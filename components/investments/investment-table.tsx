// ============================================================================
// FILE: components/investments/investment-table.tsx
// ============================================================================

"use client";

import { deleteInvestment } from "@/lib/actions/investment.actions";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

// ❌ NE PLUS importer depuis @prisma/client
// import type { Investment } from "@prisma/client";

// ✅ Typage safe depuis Prisma
import type { Prisma } from "@prisma/client";

type Investment = Prisma.InvestmentGetPayload<{}>;

export function InvestmentsTable({
  investments,
}: {
  investments: Investment[];
}) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const result = await deleteInvestment(id);

    if (result.success) {
      toast({ title: "Deleted", description: result.message });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  if (investments.length === 0) {
    return <p className="text-muted-foreground">No investments yet.</p>;
  }

  return (
    <div className="space-y-2">
      {investments.map((investment) => (
        <div
          key={investment.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div>
            <p className="font-medium">{investment.name}</p>
            <p className="text-sm text-muted-foreground">
              {investment.ticker} · {investment.quantity} × $
              {investment.purchasePrice}
            </p>
          </div>

          <Button
            size="icon"
            variant="destructive"
            onClick={() => handleDelete(investment.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
