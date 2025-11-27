// lib/actions/goal.actions.ts (NEW FILE)

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Zod schema for creating a goal
const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required."),
  targetAmount: z.coerce.number().positive("Target amount must be positive."),
  deadline: z.date().optional(),
});

// Zod schema for adding funds
const addFundsSchema = z.object({
  goalId: z.string(),
  amount: z.coerce.number().positive("Amount must be a positive number."),
});


export async function createGoal(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }
  const userId = session.user.id;

  const result = goalSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid form data." };
  }

  try {
    await prisma.goal.create({
      data: { ...result.data, userId },
    });
    revalidatePath("/goals");
    return { success: true, message: "Goal created successfully." };
  } catch (error) {
    console.error("CREATE_GOAL_ERROR", error);
    return { success: false, message: "Failed to create goal." };
  }
}

export async function getGoals() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Authentication required.");
    const userId = session.user.id;

    return await prisma.goal.findMany({ where: { userId } });
}

export async function addFundsToGoal(formData: unknown) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, message: "Authentication required." };
    }
    const userId = session.user.id;

    const result = addFundsSchema.safeParse(formData);
    if (!result.success) {
        return { success: false, message: "Invalid data provided." };
    }

    const { goalId, amount } = result.data;

    try {
        // Use a transaction to ensure both operations succeed or fail together
        await prisma.$transaction([
            prisma.goal.update({
                where: { id: goalId, userId }, // Ensure user owns the goal
                data: { currentAmount: { increment: amount } },
            }),
            prisma.transaction.create({
                data: {
                    name: `Contribution to Goal`,
                    amount: amount,
                    type: "EXPENSE",
                    category: "Savings", // A dedicated category for goal contributions
                    frequency: "ONCE",
                    date: new Date(),
                    userId: userId,
                },
            }),
        ]);

        revalidatePath("/goals");
        revalidatePath("/dashboard");
        revalidatePath("/transactions");

        return { success: true, message: "Funds added successfully!" };
    } catch (error) {
        console.error("ADD_FUNDS_ERROR", error);
        return { success: false, message: "Failed to add funds." };
    }
}