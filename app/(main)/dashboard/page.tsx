// app/(main)/dashboard/page.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Landmark, PiggyBank, Scale } from "lucide-react";
import { getTransactions } from "@/lib/actions/transaction.actions";
import { formatCurrency } from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  startOfYear,
} from "date-fns";
import { MonthlySummaryChart } from "@/components/dashboard/monthly-summary-chart";
import { ExpenseByCategoryChart } from "@/components/dashboard/expense-by-category-chart";

export default async function DashboardPage() {
  const transactions = await getTransactions();

  // --- Data for Stat Cards ---
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthlyTransactions = transactions.filter(
    (t) => t.date >= monthStart && t.date <= monthEnd
  );

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashFlow = monthlyIncome - monthlyExpense;

  const totalFlow = transactions.reduce(
    (sum, t) => sum + (t.type === "INCOME" ? t.amount : -t.amount),
    0
  );

  // --- Data for Monthly Summary Bar Chart (Last 6 Months) ---
  const monthlySummaryData = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(now, 5 - i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const monthTransactions = transactions.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    );

    const income = monthTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(date, "MMM"),
      income,
      expense,
    };
  });
  
  // --- Data for Expense by Category Donut Chart (Current Month) ---
  const expenseByCategory = monthlyTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const chartColors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
  ];

  const expenseByCategoryData = Object.entries(expenseByCategory)
    .map(([category, amount], index) => ({
      category,
      amount,
      fill: chartColors[index % chartColors.length],
    }))
    .sort((a, b) => b.amount - a.amount);


  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Welcome Back!
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards remain the same */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flow</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total income minus total expense
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Cash Flow
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
               {formatCurrency(cashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month&apos;s income vs. expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Financial Health
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82/100</div>
            <p className="text-xs text-muted-foreground">
              Based on AI analysis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Budgets
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 on track, 2 overspending
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription>
              Income vs. Expense for the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlySummaryChart data={monthlySummaryData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>
              How your expenses are categorized this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseByCategoryChart data={expenseByCategoryData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}