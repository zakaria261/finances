// lib/actions/dashboard.actions.ts (NEW FILE)
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";
import { getBudgetsWithSpending } from "./budget.actions";

export async function getDashboardStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Authentication required.");
  }
  const userId = session.user.id;

  // --- Net Worth Calculation ---
  const { _sum: { value: totalAssets } } = await prisma.asset.aggregate({
    _sum: { value: true },
    where: { userId },
  });
  const { _sum: { balance: totalDebts } } = await prisma.debt.aggregate({
    _sum: { balance: true },
    where: { userId },
  });
  const netWorth = (totalAssets ?? 0) - (totalDebts ?? 0);

  // --- Monthly Cash Flow ---
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const { _sum: { amount: monthlyIncome } } = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'INCOME', date: { gte: monthStart, lte: monthEnd } },
  });
   const { _sum: { amount: monthlyExpense } } = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'EXPENSE', date: { gte: monthStart, lte: monthEnd } },
  });
  const cashFlow = (monthlyIncome ?? 0) - (monthlyExpense ?? 0);

  // --- Total Savings ---
  const { _sum: { currentAmount: totalSavings } } = await prisma.goal.aggregate({
      _sum: { currentAmount: true },
      where: { userId }
  });

  // --- Budgets Status ---
  const budgets = await getBudgetsWithSpending();
  const budgetsOnTrack = budgets.filter(b => b.progress <= 100).length;
  const budgetsOverspent = budgets.length - budgetsOnTrack;
  
  return {
    netWorth,
    cashFlow,
    totalSavings: totalSavings ?? 0,
    budgets: {
        count: budgets.length,
        onTrack: budgetsOnTrack,
        overspent: budgetsOverspent,
    }
  };
}