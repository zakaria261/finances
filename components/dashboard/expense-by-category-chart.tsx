// components/dashboard/expense-by-category-chart.tsx (NEW FILE)

"use client";

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

interface ExpenseByCategoryChartProps {
  data: {
    category: string;
    amount: number;
    fill: string;
  }[];
}

export function ExpenseByCategoryChart({ data }: ExpenseByCategoryChartProps) {
  const chartConfig = React.useMemo(() => {
    return data.reduce((config, item) => {
      config[item.category] = { label: item.category, color: item.fill };
      return config;
    }, {} as ChartConfig);
  }, [data]);

  if (data.length === 0) {
    return (
       <div className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground">No expenses recorded for this month.</p>
       </div>
    )
  }


  const totalAmount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.amount, 0);
  }, [data]);

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[300px] w-full"
    >
      <ResponsiveContainer>
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)}/>}
          />
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={60}
            strokeWidth={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
           <ChartLegend
            content={<ChartLegendContent nameKey="category" />}
            className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}