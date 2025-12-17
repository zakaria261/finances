// components/gamification/season-pass-card.tsx (NEW FILE)
"use client";

import type { GameState } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { siteConfig } from "@/lib/config";

interface SeasonPassCardProps {
    gameState: GameState | null;
}

export function SeasonPassCard({ gameState }: SeasonPassCardProps) {
    if (!gameState) return null;

    const { level, xp } = gameState;
    const { xpToNextLevel, rewards } = siteConfig.gamification;
    const currentLevelXp = xpToNextLevel[level - 1] || Infinity;
    const progress = (xp / currentLevelXp) * 100;
    const nextReward = rewards.find(r => r.level === level + 1);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <CardTitle>Season Pass</CardTitle>
                </div>
                <CardDescription>Level up by managing your finances.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold">Level {level}</span>
                    <span className="text-sm text-muted-foreground">{xp} / {currentLevelXp} XP</span>
                </div>
                <Progress value={progress} />
                {nextReward && (
                    <p className="text-xs text-center text-muted-foreground">
                        Next Reward: {nextReward.name} at Level {nextReward.level}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}