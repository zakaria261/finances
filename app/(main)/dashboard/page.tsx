import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, PiggyBank, Scale, TrendingUp, HandCoins } from "lucide-react";
import { getTransactions } from "@/lib/actions/transaction.actions";
import { formatCurrency } from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";
import { MonthlySummaryChart } from "@/components/dashboard/monthly-summary-chart";
import { ExpenseByCategoryChart } from "@/components/dashboard/expense-by-category-chart";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { SeasonPassCard } from "@/components/gamification/season-pass-card";
import { getGameState } from "@/lib/actions/gamification.actions";

export default async function DashboardPage() {
  const [transactions, stats, gameState] = await Promise.all([
      getTransactions(),
      getDashboardStats(),
      getGameState(),
  ]);

  // --- Data for Monthly Summary Bar Chart (Last 6 Months) ---
  const now = new Date();
  const monthlySummaryData = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(now, 5 - i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const monthTransactions = transactions.filter(
      (t) => new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd
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
   const currentMonthStart = startOfMonth(now);
   const currentMonthEnd = endOfMonth(now);
   const monthlyTransactions = transactions.filter(
    (t) => new Date(t.date) >= currentMonthStart && new Date(t.date) <= currentMonthEnd
  );
  
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold`}>
              {formatCurrency(stats.netWorth)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total assets minus total debts
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
             <div className={`text-2xl font-bold ${stats.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
               {formatCurrency(stats.cashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month&apos;s income vs. expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Savings
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSavings)}</div>
            <p className="text-xs text-muted-foreground">
              Across all savings goals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Budgets
            </CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.budgets.count}</div>
            <p className="text-xs text-muted-foreground">
              {stats.budgets.onTrack} on track, {stats.budgets.overspent} over
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart & AI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid gap-4">
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
        <div className="space-y-4">
            <AiInsightsCard />
            <SeasonPassCard gameState={gameState} />
        </div>
      </div>
    </div>
  );
}