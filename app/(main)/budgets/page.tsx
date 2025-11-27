// app/(main)/budgets/page.tsx (NEW FILE)
import { getBudgetsWithSpending } from "@/lib/actions/budget.actions";
import { AddBudgetDialog } from "@/components/budgets/add-budget-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

export default async function BudgetsPage() {
  const budgets = await getBudgetsWithSpending();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">Budgets</h1>
        <AddBudgetDialog />
      </div>

      {budgets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader>
                <CardTitle>{budget.category}</CardTitle>
                <CardDescription>Monthly Spending Limit: {formatCurrency(budget.limit)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold">{formatCurrency(budget.spent)} spent</div>
                  <Progress value={budget.progress} className={budget.progress > 100 ? "[&>div]:bg-red-500" : ""}/>
                </div>
              </CardContent>
              <CardFooter>
                 <p className={`text-sm font-medium ${budget.remaining < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {budget.remaining >= 0 ? `${formatCurrency(budget.remaining)} remaining` : `${formatCurrency(Math.abs(budget.remaining))} over budget`}
                 </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-8">
            <CardTitle>No Budgets Found</CardTitle>
            <CardDescription className="mt-2">Create a budget to start tracking your spending.</CardDescription>
        </Card>
      )}
    </div>
  );
}