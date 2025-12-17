// lib/actions/gamification.actions.ts (NEW FILE)
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
        gameState = await prisma.gameState.create({
            data: { userId }
        });
    }

    return gameState;
}

type XpEvent = "ADD_TRANSACTION" | "ADD_GOAL" | "FUND_GOAL" | "ADD_BUDGET" | "ADD_INVESTMENT" | "ADD_ASSET" | "ADD_DEBT";

export async function addXp(event: XpEvent) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return;
    const userId = session.user.id;
    
    const xpAmount = siteConfig.gamification.xpEvents[event] || 0;
    if (xpAmount === 0) return;

    const gameState = await getGameState();
    if (!gameState) return;

    let { xp, level } = gameState;
    xp += xpAmount;

    // Check for level up
    let xpToNextLevel = siteConfig.gamification.xpToNextLevel[level - 1];
    while (xpToNextLevel && xp >= xpToNextLevel) {
        level++;
        xp -= xpToNextLevel;
        xpToNextLevel = siteConfig.gamification.xpToNextLevel[level - 1];
    }

    await prisma.gameState.update({
        where: { userId },
        data: { xp, level },
    });
}