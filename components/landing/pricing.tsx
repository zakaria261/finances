// components/landing/pricing.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="w-full py-24 sm:py-32">
        <div className="container">
            <div className="bg-secondary/30 rounded-lg p-8 md:p-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                    Start for free and unlock powerful features as you grow. No hidden fees, ever.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Card className="w-full max-w-sm">
                        <CardHeader className="text-center">
                            <CardTitle>Pro Plan</CardTitle>
                            <CardDescription>All features included.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p>
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-muted-foreground">/ month</span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">This project is for demonstration purposes.</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/register">Get Started Now</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    </section>
  );
}