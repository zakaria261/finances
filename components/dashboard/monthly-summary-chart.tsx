// components/dashboard/monthly-summary-chart.tsx (NEW FILE)

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

interface MonthlySummaryChartProps {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MonthlySummaryChart({ data }: MonthlySummaryChartProps) {
  if (data.length === 0) {
    return (
       <div className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground">No data for this period. Add transactions to see a summary.</p>
       </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value as number).split(".")[0]}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)}/>}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="income"
            fill="var(--color-income)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expense"
            fill="var(--color-expense)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}