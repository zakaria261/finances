// lib/actions/user.actions.ts (NEW FILE)
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export async function updateUserProfile(formData: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required." };
  }
  const userId = session.user.id;

  const result = profileSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: result.data.name },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR", error);
    return { success: false, message: "Failed to update profile." };
  }
}