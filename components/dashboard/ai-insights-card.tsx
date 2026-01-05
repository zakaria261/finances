// components/dashboard/ai-insights-card.tsx

"use client";

import { 
  Sparkles, Loader2, RefreshCw, TrendingUp, TrendingDown, 
  Minus, CheckCircle2, ArrowRight, BrainCircuit, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { useFinanceData } from "@/context/FinanceDataContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AiInsightsCard() {
  // Use the global context
  const { 
    aiInsights, 
    analyserAvecIA, 
    chargementIA 
  } = useFinanceData();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-900/50 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <BrainCircuit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
             </div>
             <div>
                <CardTitle className="text-lg">AI Financial Strategist</CardTitle>
                <CardDescription>Deep analysis & forecasting</CardDescription>
             </div>
          </div>
          {aiInsights && (
            <Badge variant="outline" className="bg-background/50 backdrop-blur font-semibold">
              {aiInsights.financialPersona}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="min-h-[300px]">
        {chargementIA ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 animate-pulse">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-ping"></div>
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500 relative z-10" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Reading transactions & Generating forecast...</p>
          </div>
        ) : aiInsights ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="actions">Action Plan</TabsTrigger>
            </TabsList>

            {/* TAB: OVERVIEW */}
            <TabsContent value="overview" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between p-4 bg-background/60 rounded-xl border shadow-sm">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Financial Health Score</p>
                  <div className={`text-4xl font-bold ${getScoreColor(aiInsights.financialScore)}`}>
                    {aiInsights.financialScore}
                  </div>
                </div>
                <div className="w-1/2 space-y-1">
                    <div className="flex justify-between text-xs">
                        <span>Status</span>
                        <span className="font-medium">{aiInsights.financialScore > 70 ? "Healthy" : "Needs Work"}</span>
                    </div>
                    <Progress value={aiInsights.financialScore} className="h-2" />
                </div>
              </div>

              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                <p className="text-sm leading-relaxed italic text-foreground/80">
                  "{aiInsights.executiveSummary}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-background rounded-lg border">
                    <p className="text-xs text-muted-foreground">Proj. Savings (Next Mo)</p>
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(aiInsights.forecast.nextMonthSavings)}</p>
                </div>
                <div className="p-3 bg-background rounded-lg border">
                    <p className="text-xs text-muted-foreground">Proj. Wealth (6 Mo)</p>
                    <p className="text-lg font-bold text-indigo-600">{formatCurrency(aiInsights.forecast.wealthProjection6Months)}</p>
                </div>
              </div>
            </TabsContent>

            {/* TAB: TRENDS */}
            <TabsContent value="trends" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                {aiInsights.keyTrends.map((trend, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-background/50 rounded-lg border items-start">
                        <div className={`mt-1 p-1.5 rounded-full ${
                            trend.direction === 'up' ? 'bg-emerald-100 text-emerald-600' : 
                            trend.direction === 'down' ? 'bg-red-100 text-red-600' : 
                            'bg-slate-100 text-slate-600'
                        }`}>
                            {trend.direction === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                             trend.direction === 'down' ? <TrendingDown className="w-4 h-4" /> : 
                             <Minus className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{trend.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{trend.insight}</p>
                        </div>
                    </div>
                ))}
            </TabsContent>

            {/* TAB: ACTIONS */}
            <TabsContent value="actions" className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                {aiInsights.actionableSteps.map((step, i) => (
                    <div key={i} className="group flex flex-col gap-2 p-3 bg-background rounded-lg border hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                                <span className="text-sm font-medium">{step.action}</span>
                            </div>
                            <Badge variant={step.difficulty === 'High' ? 'destructive' : 'secondary'} className="text-[10px] h-5">
                                {step.difficulty} Effort
                            </Badge>
                        </div>
                        <div className="pl-6 flex items-center text-xs text-emerald-600 font-medium">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Potential Impact: {step.impact}
                        </div>
                    </div>
                ))}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center p-6 space-y-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                <Sparkles className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="space-y-1">
                <h3 className="font-semibold">Unlock Deep Insights</h3>
                <p className="text-sm text-muted-foreground max-w-[260px] mx-auto">
                    Use Gemini AI to analyze spending habits, forecast wealth, and get a personalized action plan.
                </p>
                {/* Visual Alert if env var is likely missing in dev */}
                <div className="pt-2">
                   <p className="text-[10px] text-muted-foreground opacity-50">Requires GEMINI_API_KEY in .env</p>
                </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]" 
            onClick={() => analyserAvecIA()} 
            disabled={chargementIA}
        >
            {aiInsights ? (
                <>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh Analysis
                </>
            ) : (
                <>
                    Generate Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
      </CardFooter>
    </Card>
  );
}