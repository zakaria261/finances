// lib/google-gemini-ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a cheaper/faster model for basic JSON tasks
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite",
    // Force JSON mode where supported, but we still clean the output manually below to be safe
    generationConfig: { responseMimeType: "application/json" }
});

// Helper to strip Markdown code blocks
function cleanJsonOutput(text: string) {
  // Remove ```json and ``` wrapping
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return cleaned;
}

export async function runFinancialAnalysis(financialData: any) {
  const prompt = `
    You are an expert financial analyst. Analyze the following financial data for a user and provide a concise, insightful report.

    Financial Data:
    ${JSON.stringify(financialData, null, 2)}

    Your task is to return a JSON object with the exact following structure:
    {
      "score": <number 0-100>,
      "summary": "<string>",
      "strengths": ["<string>", "<string>"],
      "weaknesses": ["<string>", "<string>"],
      "recommendations": ["<string>", "<string>", "<string>"]
    }

    Do not include any introductory text. Just return the JSON string.
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