// components/landing/features.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, BarChart, Trophy, Bot } from "lucide-react";

const featureList = [
    { icon: <DollarSign className="w-8 h-8 text-primary" />, title: "Transaction Management", description: "Log income and expenses with ease. Categorize, sort, and filter to understand your spending habits." },
    { icon: <BarChart className="w-8 h-8 text-primary" />, title: "Financial Planning", description: "Create and track financial goals. Set budgets for spending categories and monitor your progress in real-time." },
    { icon: <Trophy className="w-8 h-8 text-primary" />, title: "Gamification", description: "Earn XP and level up by managing your finances. Unlock new features and themes as you go." },
    { icon: <Bot className="w-8 h-8 text-primary" />, title: "AI-Powered Insights", description: "Get a detailed analysis of your financial health with actionable recommendations from our integrated AI." },
]

export function Features() {
  return (
    <section id="features" className="w-full py-24 sm:py-32">
        <div className="container">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need to Succeed</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    All the tools to take control of your financial future, in one place.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {featureList.map(feature => (
                     <Card key={feature.title} className="text-center">
                        <CardHeader>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                               {feature.icon}
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                     </Card>
                ))}
            </div>
        </div>
    </section>
  );
}