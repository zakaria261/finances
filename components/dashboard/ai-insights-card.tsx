// components/dashboard/ai-insights-card.tsx

"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateFinancialInsights } from "@/lib/actions/ai.actions";

// Define the expected type
type InsightsData = {
  score: number;
  summary: string;
  recommendations?: string[]; // Make optional
};

export function AiInsightsCard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InsightsData | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateFinancialInsights();
      if (result.error) {
        // Handle error gracefully (could use toast here)
        console.error(result.error);
        return;
      }
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-950/10">
      <CardHeader>
        <div className="flex items-center gap-2">
           <Sparkles className="h-5 w-5 text-indigo-500" />
           <CardTitle>AI Financial Analyst</CardTitle>
        </div>
        <CardDescription>Get personalized insights powered by Gemini.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm text-muted-foreground">Analyzing your transactions...</p>
          </div>
        ) : data ? (
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border">
                <span className="text-sm font-medium">Financial Health Score</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{data.score ?? 0}/100</span>
             </div>
             <p className="text-sm">{data.summary}</p>
             <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Recommendations</p>
                <ul className="text-sm space-y-1 list-disc pl-4">
                    {/* SAFE GUARD: Check if recommendations exists before mapping */}
                    {data.recommendations && data.recommendations.length > 0 ? (
                        data.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                        ))
                    ) : (
                        <li>No specific recommendations available.</li>
                    )}
                </ul>
             </div>
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            Tap the button below to generate a real-time analysis of your finances.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
            onClick={handleGenerate} 
            disabled={loading}
        >
            {data ? <><RefreshCw className="mr-2 h-4 w-4"/> Refresh Analysis</> : "Generate Insights"}
        </Button>
      </CardFooter>
    </Card>
  );
}