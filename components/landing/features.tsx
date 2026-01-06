import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Shield, Zap, Target, Eye, Star, ArrowRight, BarChart, Smartphone, Globe } from "lucide-react"

const featureList = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get personalized financial recommendations powered by advanced AI that learns from your spending patterns and helps you make smarter decisions.",
    gradient: "from-purple-500 to-pink-500",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "Smart Investment Tracking",
    description: "Monitor your portfolio performance in real-time with comprehensive analytics and forecasting tools to maximize your returns.",
    gradient: "from-blue-500 to-cyan-500",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is protected with enterprise-grade encryption, multi-factor authentication, and compliance with industry standards.",
    gradient: "from-green-500 to-emerald-500",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Real-Time Sync",
    description: "Automatically sync with 15,000+ financial institutions worldwide. Your data updates instantly, 24/7.",
    gradient: "from-yellow-500 to-orange-500",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Target,
    title: "Goal Planning",
    description: "Set financial goals and let our AI create personalized action plans. Track progress and achieve your dreams faster.",
    gradient: "from-red-500 to-pink-500",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Eye,
    title: "360° Dashboard",
    description: "Get a complete view of your financial life with interactive visualizations, real-time charts, and future projections.",
    gradient: "from-indigo-500 to-purple-500",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Deep dive into your spending patterns with detailed reports and insights to optimize every dollar you spend.",
    gradient: "from-pink-500 to-rose-500",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "Access your finances anywhere with native iOS and Android apps plus a responsive web interface.",
    gradient: "from-cyan-500 to-blue-500",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Manage accounts in 150+ currencies with real-time conversion. Perfect for international finances and crypto.",
    gradient: "from-violet-500 to-purple-500",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
  },
]

export function Features() {
  return (
    <section id="features" className="w-full py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10 px-6">
        <div className="text-center mb-20 space-y-6">
          <div className="flex justify-center">
            <Badge className="bg-primary/10 border-primary/20 text-primary px-6 py-2.5 text-sm font-medium hover:bg-primary/20 transition-all cursor-default">
              <Star className="w-4 h-4 mr-2" />
              Features
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-center mx-auto max-w-4xl">
            <span className="bg-gradient-to-r from-primary via-pink-500 to-primary bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-foreground mt-2 inline-block">
              to Master Your Finances
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-center">
            Powerful features designed to give you complete control over your financial future
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {featureList.map((feature) => (
            <Card 
              key={feature.title} 
              className="group relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <CardHeader className="relative z-10">
                <div className={`inline-flex w-fit p-4 mb-4 rounded-2xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="relative">
                    <feature.icon className={`w-8 h-8 ${feature.color} relative z-10`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                  </div>
                </div>
                
                <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}