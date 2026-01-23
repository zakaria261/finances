// components/gamification/season-pass-card.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

/* -------------------------------- */
/* Type LOCAL (pas Prisma)          */
/* -------------------------------- */
export type GameState = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  seasonName: string;
};

type SeasonPassCardProps = {
  gameState: GameState;
};

export function SeasonPassCard({ gameState }: SeasonPassCardProps) {
  const progress =
    (gameState.xp / gameState.xpToNextLevel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {gameState.seasonName}
        </CardTitle>
        <CardDescription>
          Level {gameState.level}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">
          {gameState.xp} / {gameState.xpToNextLevel} XP
        </p>
      </CardContent>
    </Card>
  );
}
