// components/debts/debt-ai-analysis.tsx (NEW FILE)
"use client";

import { useState } from "react";
import { Bot, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzeDebtRepayment } from "@/lib/actions/ai.actions";
import { useToast } from "../ui/use-toast";

type DebtAnalysisResult = {
  bestMethod: 'AVALANCHE' | 'SNOWBALL';
  reasoning: string;
  avalanche: { payoffMonths: number, totalInterest: number };
  snowball: { payoffMonths: number, totalInterest: number };
};

export function DebtAiAnalysis({ debts }: { debts: any[] }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DebtAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setData(null);
    try {
      const result = await analyzeDebtRepayment(debts);
       if (!result || !result.bestMethod) {
        toast({ title: "Analysis Error", description: "The AI could not determine the best repayment strategy. Please try again.", variant: "destructive" });
        return;
      }
      setData(result);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "An unexpected error occurred during analysis.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-sky-500/20 bg-sky-50/10 dark:bg-sky-950/10">
      <CardHeader>
        <div className="flex items-center gap-2">
           <Bot className="h-5 w-5 text-sky-500" />
           <CardTitle>AI Debt Repayment Coach</CardTitle>
        </div>
        <CardDescription>Analyze your debts to find the fastest way to become debt-free.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            <p className="text-sm text-muted-foreground">Comparing strategies...</p>
          </div>
        ) : data ? (
          <div className="space-y-4 text-sm">
             <div className="p-3 bg-background/50 rounded-lg border">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Recommendation</p>
                <p className="font-semibold text-sky-600 dark:text-sky-400">The best method for you is the <span className="capitalize">{data.bestMethod.toLowerCase()}</span> method.</p>
                <p className="text-xs mt-1">{data.reasoning}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                     <p className="font-semibold">Avalanche (High APR First)</p>
                     <p>Payoff: ~{data.avalanche.payoffMonths} months</p>
                     <p>Total Interest: ${data.avalanche.totalInterest.toFixed(2)}</p>
                 </div>
                  <div className="space-y-1">
                     <p className="font-semibold">Snowball (Low Balance First)</p>
                     <p>Payoff: ~{data.snowball.payoffMonths} months</p>
                     <p>Total Interest: ${data.snowball.totalInterest.toFixed(2)}</p>
                 </div>
             </div>
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            Get a personalized debt repayment plan.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full bg-sky-600 hover:bg-sky-700 text-white" 
            onClick={handleGenerate} 
            disabled={loading}
        >
            {data ? <><RefreshCw className="mr-2 h-4 w-4"/> Re-analyze</> : "Analyze My Debts"}
        </Button>
      </CardFooter>
    </Card>
  );
}