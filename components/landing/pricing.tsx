import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, Zap, Crown, Sparkles, DollarSign } from "lucide-react"

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    currency: "$",
    period: "forever",
    description: "Perfect for getting started with smart financial management",
    features: [
      "Unlimited transaction tracking",
      "Up to 5 bank accounts",
      "Basic budgets & categories",
      "Monthly reports",
      "Mobile app (iOS & Android)",
      "Cloud sync",
      "Charts & statistics",
    ],
    cta: "Get Started Free",
    ctaLink: "/register",
    popular: false,
    icon: Sparkles,
    iconColor: "text-slate-400",
  },
  {
    name: "Premium",
    price: "19",
    currency: "$",
    period: "per month",
    description: "Unlock the full power of AI-driven financial intelligence",
    features: [
      "Everything in Free, plus:",
      "Unlimited bank accounts",
      "Advanced AI analysis",
      "Real-time predictions",
      "Automatic tax optimization",
      "Smart alerts & notifications",
      "24/7 AI financial advisor",
      "Priority support",
      "Advanced data export",
      "Investment simulations",
      "Developer API access",
      "Exclusive Premium badge",
    ],
    cta: "Go Premium",
    ctaLink: "/register?plan=premium",
    popular: true,
    icon: Crown,
    iconColor: "text-yellow-400",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="w-full py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto max-w-7xl relative z-10 px-6">
        <div className="text-center mb-20 space-y-6">
          <div className="flex justify-center">
            <Badge className="bg-primary/10 border-primary/20 text-primary px-6 py-2.5 text-sm font-medium hover:bg-primary/20 transition-all cursor-default">
              <DollarSign className="w-4 h-4 mr-2" />
              Pricing
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-center mx-auto max-w-4xl">
            <span className="bg-gradient-to-r from-primary via-pink-500 to-primary bg-clip-text text-transparent">
              Simple & Transparent
            </span>
            <br />
            <span className="text-foreground mt-2 inline-block">
              No Hidden Fees
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-center">
            Start free and upgrade to Premium when you're ready for the full power of AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-20">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative ${plan.popular ? 'md:scale-105 md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-8 py-3 text-sm font-bold shadow-2xl shadow-primary/50 animate-pulse">
                    <Zap className="w-4 h-4 mr-2" />
                    Most Popular
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Badge>
                </div>
              )}

              <Card 
                className={`group relative h-full bg-card/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
                  plan.popular 
                    ? 'border-primary/50 shadow-2xl shadow-primary/20' 
                    : 'border-border/50 hover:border-primary/30 hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.popular ? 'from-purple-600/10 via-pink-600/10 to-red-600/10' : 'from-slate-500/5 to-slate-700/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <CardHeader className="pb-8 pt-10 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`inline-flex p-4 rounded-2xl ${plan.popular ? 'bg-primary/20' : 'bg-muted'} group-hover:scale-110 transition-transform duration-300`}>
                      <plan.icon className={`w-8 h-8 ${plan.iconColor}`} />
                    </div>
                    {plan.popular && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Sparkles key={i} className="w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-3xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="flex items-baseline mt-8 mb-2">
                    <span className={`text-6xl font-black ${plan.popular ? 'bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent' : 'text-foreground'}`}>
                      {plan.currency}{plan.price}
                    </span>
                    <span className="text-muted-foreground ml-3 text-lg font-medium">
                      / {plan.period}
                    </span>
                  </div>

                  {plan.price === "0" && (
                    <p className="text-sm text-muted-foreground mt-2">
                      No credit card required
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pb-8 relative z-10">
                  <Button 
                    asChild
                    size="lg"
                    className={`w-full mb-8 font-bold text-base py-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105' 
                        : 'bg-muted hover:bg-muted/80'
                    } transition-all duration-300`}
                  >
                    <Link href={plan.ctaLink}>
                      {plan.cta}
                      {plan.popular && <Crown className="ml-2 w-5 h-5" />}
                    </Link>
                  </Button>

                  <div className="space-y-4">
                    {plan.features.map((feature, fIdx) => (
                      <div 
                        key={fIdx} 
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className={`text-sm leading-relaxed ${feature.includes('Everything') ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {plan.popular && (
                  <CardFooter className="bg-primary/5 border-t border-primary/20 py-4 relative z-10">
                    <p className="text-sm text-center w-full text-muted-foreground">
                      🎉 <span className="font-semibold text-primary">Special offer:</span> 14-day free trial
                    </p>
                  </CardFooter>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}