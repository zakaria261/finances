// ============================================================================
// FILE: app/(main)/investments/page.tsx
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InvestmentsTable } from "@/components/investments/investment-table";
import { AddInvestmentDialog } from "@/components/investments/add-investment-dialog";
import { getInvestments } from "@/lib/actions/investment.actions";

export default async function InvestmentsPage() {
  const investments = await getInvestments();
  
  const totalValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">Portfolio</h1>
        <AddInvestmentDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalValue)}</div>
           </CardContent>
        </Card>
        <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium">Total Holdings</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{investments.length}</div>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
          <CardDescription>Track your stocks, crypto, and assets.</CardDescription>
        </CardHeader>
        <CardContent>
            {investments.length > 0 ? (
                <InvestmentsTable investments={investments} />
            ) : (
                <p className="text-muted-foreground text-sm">No investments tracked yet.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}