// lib/actions/goal.actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { addXp } from "./gamification.actions";

/* ---------------------------- */
/* ZOD SCHEMAS */
/* ---------------------------- */

const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required."),
  targetAmount: z.coerce
  //@ts-ignore
    .number({ invalid_type_error: "Target amount must be a number." })
    .positive("Target amount must be positive."),
  deadline: z.coerce.date().optional(),
});

const addFundsSchema = z.object({
  goalId: z.string().min(1, "Goal ID is required."),
  amount: z.coerce
  //@ts-ignore
    .number({ invalid_type_error: "Amount must be a number." })
    .positive("Amount must be a positive number."),
});

/* ---------------------------- */
/* ACTIONS */
/* ---------------------------- */

export async function createGoal(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }

  const result = goalSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid form data." };
  }

  try {
    await prisma.goal.create({
      data: {
        ...result.data,
        userId: session.user.id,
      },
    });

    await addXp("ADD_GOAL");
    revalidatePath("/goals");

    return { success: true, message: "Goal created successfully." };
  } catch (error) {
    console.error("CREATE_GOAL_ERROR", error);
    return { success: false, message: "Failed to create goal." };
  }
}

export async function getGoals() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Authentication required.");
  }

  return prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function addFundsToGoal(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }

  const result = addFundsSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid data provided." };
  }

  const { goalId, amount } = result.data;

  try {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId: session.user.id },
    });

    if (!goal) {
      return { success: false, message: "Goal not found." };
    }

    await prisma.$transaction([
      prisma.goal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: amount } },
      }),
      prisma.transaction.create({
        data: {
          name: `Contribution to "${goal.name}"`,
          amount,
          type: "EXPENSE",
          category: "Savings",
          frequency: "ONCE",
          date: new Date(),
          userId: session.user.id,
        },
      }),
    ]);

    await addXp("FUND_GOAL");

    revalidatePath("/goals");
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return { success: true, message: "Funds added successfully!" };
  } catch (error) {
    console.error("ADD_FUNDS_ERROR", error);
    return { success: false, message: "Failed to add funds." };
  }
}
