// lib/actions/transaction.actions.ts

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { addXp } from "./gamification.actions";

// Zod schema for validation
const transactionSchema = z.object({
  name: z.string().min(1, "Name is required."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Category is required."),
  date: z.date(),
});

// Server Action to create a transaction
export async function createTransaction(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }
  const userId = session.user.id;

  const result = transactionSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid form data." };
  }

  try {
    await prisma.transaction.create({
      data: {
        ...result.data,
        userId,
        frequency: "ONCE", 
      },
    });

    await addXp("ADD_TRANSACTION");
    
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return { success: true, message: "Transaction added successfully." };
  } catch (error) {
    console.error("CREATE_TRANSACTION_ERROR", error);
    return { success: false, message: "Failed to create transaction." };
  }
}

// Server Action to get all transactions for the current user
export async function getTransactions() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Authentication required.");
  }
  const userId = session.user.id;
  
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return transactions;
}