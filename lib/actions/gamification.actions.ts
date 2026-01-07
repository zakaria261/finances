// ============================================================================
// FILE: lib/actions/gamification.actions.ts
// ============================================================================

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { siteConfig } from "../config";

export async function getGameState() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    const userId = session.user.id;

    let gameState = await prisma.gameState.findUnique({
        where: { userId },
    });

    if (!gameState) {
        // Create initial state if it doesn't exist
        gameState = await prisma.gameState.create({
            data: { 
                userId,
                xp: 0,
                level: 1,
                //coins: 100,
            }
        });
    }

    return gameState;
}

// Define the keys from your config
type XpEvent = keyof typeof siteConfig.gamification.xpEvents;

export async function addXp(event: XpEvent) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    const userId = session.user.id;
    
    // Get XP amount from config
    const xpAmount = siteConfig.gamification.xpEvents[event] || 0;
    if (xpAmount === 0) return null;

    const gameState = await getGameState();
    if (!gameState) return null;

    let { xp, level } = gameState;
    xp += xpAmount;

    // Check for level up using config
    // Array is 0-indexed. Level 1 needs xpToNextLevel[0]
    let xpNeeded = siteConfig.gamification.xpToNextLevel[level - 1];

    // While loop to handle multiple level ups at once (if massive XP gain)
    while (xpNeeded && xp >= xpNeeded) {
        xp -= xpNeeded; // Reset relative XP
        level++;
        xpNeeded = siteConfig.gamification.xpToNextLevel[level - 1];
    }

    const updatedState = await prisma.gameState.update({
        where: { userId },
        data: { xp, level },
    });

    return updatedState;
}