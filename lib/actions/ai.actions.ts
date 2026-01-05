// lib/actions/ai.actions.ts

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../prisma";
import { runFinancialAnalysis, runDebtAnalysis } from "../google-gemini-ai";
import { format } from "date-fns";

// This is the main AI analysis for the dashboard
export async function generateFinancialInsights() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  try {
    // 1. Fetch Data (Optimized: only grab what is needed)
    const [transactions, goals, budgets, assets, debts] = await Promise.all([
      prisma.transaction.findMany({ 
        where: { userId }, 
        orderBy: { date: 'desc' }, 
        take: 100,
        select: { date: true, amount: true, category: true, type: true, name: true } 
      }),
      prisma.goal.findMany({ where: { userId }, select: { name: true, targetAmount: true, currentAmount: true } }),
      prisma.budget.findMany({ where: { userId } }),
      prisma.asset.findMany({ where: { userId } }),
      prisma.debt.findMany({ where: { userId } })
    ]);

    // 2. Pre-calculate Summary Stats to help the AI (Reduces hallucination risk)
    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    const financialData = {
      summaryStats: {
        totalIncome,
        totalExpenses,
        netCashFlow: totalIncome - totalExpenses,
        transactionCount: transactions.length
      },
      recentTransactions: transactions.map(t => ({
        ...t, 
        date: format(t.date, 'yyyy-MM-dd')
      })),
      goals,
      budgets,
      assets,
      debts
    };

    // 3. Call AI
    const analysisResult = await runFinancialAnalysis(financialData);
    
    // 4. Parse & Return
    // The Gemini function returns a JSON string, so we parse it.
    const parsedResult = JSON.parse(analysisResult);
    
    return parsedResult;

  } catch (error) {
    console.error("GEMINI_FINANCIAL_ANALYSIS_ERROR", error);
    // Return a structured error so the frontend can handle it
    return { error: "Failed to generate AI insights. Please try again later." };
  }
}

// This is the AI analysis for the debts page
export async function analyzeDebtRepayment(debts: any[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        const analysisResult = await runDebtAnalysis(debts);
        const parsedResult = JSON.parse(analysisResult);
        return parsedResult;
    } catch (error) {
        console.error("GEMINI_DEBT_ANALYSIS_ERROR", error);
        return { error: "Failed to generate debt analysis." };
    }
}