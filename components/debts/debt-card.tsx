// components/debts/debt-card.tsx (NEW FILE)
import type { Debt } from "@prisma/client";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export function DebtCard({ debt }: { debt: Debt }) {
    
  const debtTypeMap = {
      "CREDIT_CARD": "Credit Card",
      "LOAN": "Loan",
      "OTHER": "Other"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle>{debt.name}</CardTitle>
                <CardDescription>
                   <Badge variant="secondary" className="mt-1">{debtTypeMap[debt.type]}</Badge>
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive"/>
            </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
            <p className="text-muted-foreground">Balance</p>
            <p className="font-semibold">{formatCurrency(debt.balance)}</p>
        </div>
        <div>
            <p className="text-muted-foreground">APR</p>
            <p className="font-semibold">{debt.apr.toFixed(2)}%</p>
        </div>
        <div className="col-span-2">
            <p className="text-muted-foreground">Minimum Payment</p>
            <p className="font-semibold">{formatCurrency(debt.minPayment)} / month</p>
        </div>
      </CardContent>
    </Card>
  );
}