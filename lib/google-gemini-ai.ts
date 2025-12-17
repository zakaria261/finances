// lib/google-gemini-ai.ts (NEW FILE)
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

export async function runFinancialAnalysis(financialData: any) {
  const prompt = `
    You are an expert financial analyst. Analyze the following financial data for a user and provide a concise, insightful report.

    Financial Data:
    ${JSON.stringify(financialData, null, 2)}

    Your task is to return a JSON object with the following structure:
    {
      "score": <A financial health score from 0-100, where 100 is excellent. Base this on savings rate, debt-to-asset ratio, and spending habits>,
      "summary": "<A 1-2 sentence summary of the user's overall financial health>",
      "strengths": ["<A key financial strength>", "<Another strength>"],
      "weaknesses": ["<A key financial weakness>", "<Another weakness>"],
      "recommendations": [
        "<A specific, actionable recommendation to improve their finances>",
        "<Another actionable recommendation>",
        "<A third actionable recommendation>"
      ]
    }

    Keep your analysis brief and to the point. The user wants actionable advice. Do not include any introductory text like "Here is the analysis". Just return the JSON object.
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}


export async function runDebtAnalysis(debts: any[]) {
    const prompt = `
    You are a debt repayment specialist. Analyze the user's debts and recommend the best repayment strategy (Avalanche or Snowball).
    Assume the user can pay an extra $200 per month towards their debts on top of all minimum payments.

    Debts Data:
    ${JSON.stringify(debts, null, 2)}

    Simulate both the Avalanche (paying off highest APR first) and Snowball (paying off lowest balance first) methods.
    
    Return a JSON object with the following structure:
    {
        "bestMethod": "<'AVALANCHE' or 'SNOWBALL'>",
        "reasoning": "<A brief explanation of why this method is recommended for this user's specific situation>",
        "avalanche": {
            "payoffMonths": <estimated months to be debt free>,
            "totalInterest": <estimated total interest paid>
        },
        "snowball": {
            "payoffMonths": <estimated months to be debt free>,
            "totalInterest": <estimated total interest paid>
        }
    }

    Base your calculations on the provided data and the $200 extra payment. Be realistic. For payoff months, round to the nearest whole number.
    Just return the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
}