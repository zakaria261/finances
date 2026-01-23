// components/debts/debt-card.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* -------------------------------- */
/* Type LOCAL (pas Prisma)          */
/* -------------------------------- */
export type Debt = {
  id: string;
  name: string;
  type: "LOAN" | "CREDIT_CARD" | "OTHER";
  balance: number;
  apr: number;
  minPayment: number;
};

type DebtCardProps = {
  debt: Debt;
};

export function DebtCard({ debt }: DebtCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{debt.name}</CardTitle>
        <CardDescription>
          <Badge variant="secondary">{debt.type}</Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p>
          <strong>Balance:</strong> ${debt.balance.toFixed(2)}
        </p>
        <p>
          <strong>APR:</strong> {debt.apr}%
        </p>
        <p>
          <strong>Minimum Payment:</strong> ${debt.minPayment.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        Debt tracking
      </CardFooter>
    </Card>
  );
}
