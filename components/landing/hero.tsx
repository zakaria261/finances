"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Rocket, Sparkles, Users, Wallet, Zap, Star, TrendingUp, Shield, Target } from "lucide-react"

interface HeroProps {
  title: React.ReactNode
  subtitle?: string
  eyebrow?: string
  ctaText?: string
  ctaLink?: string
  mockupImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

const stats = [
  { value: "2M+", label: "Active Users", icon: Users },
  { value: "$15B", label: "Assets Managed", icon: Wallet },
  { value: "99.9%", label: "Uptime", icon: Zap },
  { value: "4.9★", label: "Average Rating", icon: Star },
]

const floatingIcons = [
  { Icon: TrendingUp, color: "text-green-400", delay: "0s", position: "top-20 left-10" },
  { Icon: Shield, color: "text-blue-400", delay: "0.5s", position: "top-40 right-20" },
  { Icon: Target, color: "text-purple-400", delay: "1s", position: "bottom-40 left-20" },
  { Icon: Sparkles, color: "text-pink-400", delay: "1.5s", position: "bottom-20 right-10" },
]

export function Hero({ 
  title, 
  subtitle, 
  eyebrow, 
  ctaText = "Get Started", 
  ctaLink = "/register",
  mockupImage 
}: HeroProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background pt-20 pb-16">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mouse follower orb */}
        <div 
          className="absolute w-96 h-96 bg-primary rounded-full blur-3xl opacity-20 transition-all duration-300 ease-out"
          style={{
            top: mousePosition.y - 192,
            left: mousePosition.x - 192,
          }}
        />
        
        {/* Static orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, idx) => (
        <div
          key={idx}
          className={`absolute ${item.position} hidden lg:block opacity-20 hover:opacity-40 transition-opacity animate-float`}
          style={{ animationDelay: item.delay }}
        >
          <item.Icon className={`w-12 h-12 ${item.color}`} />
        </div>
      ))}

      <div className="container mx-auto max-w-7xl relative z-10 px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Top Badge */}
          {eyebrow && (
            <Badge className="bg-primary/10 border-primary/20 text-primary px-6 py-2.5 text-sm font-medium hover:bg-primary/20 transition-all hover:scale-105 cursor-default uppercase tracking-wider">
              <Rocket className="w-4 h-4 mr-2" />
              {eyebrow}
              <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
            </Badge>
          )}

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin leading-[1.1] max-w-6xl tracking-tight text-center">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light text-center">
              {subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button 
              size="lg" 
              asChild
              className="group relative bg-gradient-to-r from-primary to-pink-600 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 text-lg px-10 py-7 font-bold overflow-hidden"
            >
              <Link href={ctaLink}>
                <span className="relative z-10 flex items-center">
                  {ctaText}
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="bg-background/50 backdrop-blur-sm border-border hover:bg-accent hover:scale-105 transition-all duration-300 text-lg px-10 py-7 font-semibold"
            >
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Bank-level security</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>

          {/* Mockup Image */}
          {mockupImage && (
            <div className="mt-16 w-full max-w-6xl mx-auto relative">
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/20 bg-gradient-to-br from-background/50 to-primary/5 backdrop-blur-sm p-2">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-background/50">
                  <Image
                    src={mockupImage.src}
                    alt={mockupImage.alt}
                    width={mockupImage.width}
                    height={mockupImage.height}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>
          )}

          {/* Stats Grid */}
          {!mockupImage && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 w-full max-w-5xl mx-auto">
              {stats.map((stat, idx) => (
                <Card 
                  key={idx} 
                  className="group relative bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 cursor-default overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 text-center relative z-10">
                    <div className="inline-flex p-3 bg-primary/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}