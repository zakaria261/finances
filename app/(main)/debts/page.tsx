
// ============================================================================
// FILE: app/(main)/debts/page.tsx
// ============================================================================

// app/(main)/debts/page.tsx (NEW FILE)
import { getDebts } from "@/lib/actions/debt.actions";
import { AddDebtDialog } from "@/components/debts/add-debt-dialog";
import { DebtCard } from "@/components/debts/debt-card";
import { DebtAiAnalysis } from "@/components/debts/debt-ai-analysis";
import { Empty } from "@/components/ui/empty";
import { CreditCard } from "lucide-react";

export default async function DebtsPage() {
  const debts = await getDebts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Debt Management
        </h1>
        <AddDebtDialog />
      </div>

      {debts.length > 0 && <DebtAiAnalysis debts={debts} />}

      {debts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {debts.map((debt) => (
            <DebtCard key={debt.id} debt={debt} />
          ))}
        </div>
      ) : (
        <Empty>
          <CreditCard className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">No Debts Found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Track your loans and credit cards to get a clear repayment plan.
            </p>
          </div>
        </Empty>
      )}
    </div>
  );
}