// lib/actions/patrimoine.actions.ts (NEW FILE)
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { addXp } from "./gamification.actions";

const assetSchema = z.object({
  name: z.string().min(1, "Asset name is required."),
  value: z.coerce.number().positive("Value must be a positive number."),
  type: z.enum(["SAVINGS", "REAL_ESTATE", "OTHER"]),
});

export async function createAsset(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }
  const userId = session.user.id;

  const result = assetSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid form data." };
  }

  try {
    await prisma.asset.create({
      data: { ...result.data, userId },
    });

    await addXp("ADD_ASSET");

    revalidatePath("/patrimoine");
    revalidatePath("/dashboard");
    return { success: true, message: "Asset added successfully." };
  } catch (error) {
    console.error("CREATE_ASSET_ERROR", error);
    return { success: false, message: "Failed to add asset." };
  }
}

export async function getAssets() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Authentication required.");

    return await prisma.asset.findMany({ where: { userId: session.user.id } });
}