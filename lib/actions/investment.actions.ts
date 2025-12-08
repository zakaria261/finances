// ============================================================================
// FILE: lib/actions/investment.actions.ts
// ============================================================================

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

const investmentSchema = z.object({
  name: z.string().min(1, "Name is required."),
  ticker: z.string().min(1, "Ticker is required.").toUpperCase(),
  quantity: z.coerce.number().positive("Quantity must be positive."),
  purchasePrice: z.coerce.number().positive("Price must be positive."),
});

export async function createInvestment(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }
  const userId = session.user.id;

  const result = investmentSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid form data." };
  }

  try {
    const { quantity, purchasePrice } = result.data;
    // We assume current value starts same as purchase price for manual entry
    const currentValue = quantity * purchasePrice; 

    await prisma.investment.create({
      data: {
        ...result.data,
        currentValue, 
        userId,
      },
    });
    
    revalidatePath("/investments");
    return { success: true, message: "Investment added successfully." };
  } catch (error) {
    console.error("CREATE_INVESTMENT_ERROR", error);
    return { success: false, message: "Failed to create investment." };
  }
}

export async function getInvestments() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Authentication required.");
  
  return await prisma.investment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteInvestment(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  try {
    await prisma.investment.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/investments");
    return { success: true, message: "Investment deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete investment." };
  }
}