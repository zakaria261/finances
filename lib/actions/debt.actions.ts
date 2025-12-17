// lib/actions/debt.actions.ts (NEW FILE)
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { addXp } from "./gamification.actions";

const debtSchema = z.object({
  name: z.string().min(1, "Debt name is required."),
  type: z.enum(["LOAN", "CREDIT_CARD", "OTHER"]),
  balance: z.coerce.number().positive("Balance must be a positive number."),
  apr: z.coerce.number().min(0, "APR cannot be negative."),
  minPayment: z.coerce.number().positive("Minimum payment must be positive."),
});

export async function createDebt(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }
  const userId = session.user.id;

  const result = debtSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid form data." };
  }

  try {
    await prisma.debt.create({
      data: { ...result.data, userId },
    });
    
    await addXp("ADD_DEBT");

    revalidatePath("/debts");
    revalidatePath("/dashboard");
    return { success: true, message: "Debt added successfully." };
  } catch (error) {
    console.error("CREATE_DEBT_ERROR", error);
    return { success: false, message: "Failed to add debt." };
  }
}

export async function getDebts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Authentication required.");

  return await prisma.debt.findMany({
    where: { userId: session.user.id },
    orderBy: { balance: "desc" },
  });
}