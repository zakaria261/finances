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
    const [transactions, goals, budgets, assets, debts] = await Promise.all([
      prisma.transaction.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 100 }),
      prisma.goal.findMany({ where: { userId } }),
      prisma.budget.findMany({ where: { userId } }),
      prisma.asset.findMany({ where: { userId } }),
      prisma.debt.findMany({ where: { userId } })
    ]);

    const financialData = {
      transactions: transactions.map(t => ({...t, date: format(t.date, 'yyyy-MM-dd')})),
      goals,
      budgets,
      assets,
      debts
    };

    const analysisResult = await runFinancialAnalysis(financialData);
    
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