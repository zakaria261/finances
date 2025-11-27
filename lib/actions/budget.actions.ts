// lib/actions/budget.actions.ts (NEW FILE)

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

// Zod schema for validation
const budgetSchema = z.object({
  category: z.string().min(1, "Category is required."),
  limit: z.coerce.number().positive("Limit must be a positive number."),
});

// Create a new budget
export async function createBudget(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }
  const userId = session.user.id;

  const result = budgetSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid form data." };
  }

  // Check for existing budget in the same category
  const existingBudget = await prisma.budget.findFirst({
    where: { userId, category: result.data.category },
  });

  if (existingBudget) {
    return { success: false, message: "A budget for this category already exists." };
  }

  try {
    await prisma.budget.create({
      data: { ...result.data, userId },
    });
    revalidatePath("/budgets");
    return { success: true, message: "Budget created successfully." };
  } catch (error) {
    console.error("CREATE_BUDGET_ERROR", error);
    return { success: false, message: "Failed to create budget." };
  }
}

// Get all budgets and calculate current spending for each
export async function getBudgetsWithSpending() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Authentication required.");
  const userId = session.user.id;

  const budgets = await prisma.budget.findMany({ where: { userId } });
  
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthlyExpenses = await prisma.transaction.groupBy({
    by: ['category'],
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: monthStart, lte: monthEnd },
    },
    _sum: { amount: true },
  });
  
  const spendingMap = new Map(
    monthlyExpenses.map(item => [item.category, item._sum.amount ?? 0])
  );

  return budgets.map(budget => {
    const spent = spendingMap.get(budget.category) ?? 0;
    const remaining = budget.limit - spent;
    const progress = (spent / budget.limit) * 100;
    return { ...budget, spent, remaining, progress };
  });
}