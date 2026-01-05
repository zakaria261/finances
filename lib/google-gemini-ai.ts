// lib/google-gemini-ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a model capable of good reasoning (Flash is fast and cost-effective for this)
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash", 
    generationConfig: { responseMimeType: "application/json" }
});

// Helper to strip Markdown code blocks if the model adds them
function cleanJsonOutput(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function runFinancialAnalysis(financialData: any) {
  const prompt = `
    You are an elite financial strategist. Analyze the provided user data (transactions, goals, assets, debts).
    
    Data Context:
    - Transactions: Last 100 entries. Look for recurring patterns, impulse buys, and category bloat.
    - Debts vs Assets: Analyze net worth trends and liquidity.
    - Summary Stats: Use the pre-calculated totals for accuracy.
    
    Perform a deep analysis and return a strict JSON object with this exact structure:
    {
      "financialScore": <number 0-100>,
      "financialPersona": "<string (e.g., 'Aggressive Saver', 'Impulsive Spender', 'Balanced Planner', 'Debt Juggler')>",
      "executiveSummary": "<string (2 sentences max, punchy and direct)>",
      "keyTrends": [
        { "title": "<string>", "direction": "<'up' | 'down' | 'flat'>", "insight": "<string>" }
      ],
      "actionableSteps": [
        { "action": "<string>", "impact": "<string (e.g., 'Save $200/mo')>", "difficulty": "<'High' | 'Medium' | 'Low'>" }
      ],
      "forecast": {
        "nextMonthSavings": <number (estimated savings for next month)>,
        "debtFreeProjection": "<string (e.g., '14 months', 'N/A' if no debt, or 'Unknown')>",
        "wealthProjection6Months": <number (estimated total net worth in 6 months)>
      }
    }

    Financial Data:
    ${JSON.stringify(financialData, null, 2)}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  return cleanJsonOutput(text);
}

export async function runDebtAnalysis(debts: any[]) {
    const prompt = `
    You are a debt repayment specialist. Analyze the user's debts and recommend the best repayment strategy.
    Assume the user can pay an extra $200 per month towards their debts.

    Debts Data:
    ${JSON.stringify(debts, null, 2)}

    Return a JSON object with the following structure:
    {
        "bestMethod": "AVALANCHE" | "SNOWBALL",
        "reasoning": "<string>",
        "avalanche": {
            "payoffMonths": <number>,
            "totalInterest": <number>
        },
        "snowball": {
            "payoffMonths": <number>,
            "totalInterest": <number>
        }
    }
    
    Do not include any introductory text. Just return the JSON string.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return cleanJsonOutput(text);
}