"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Mockup, MockupFrame } from "@/components/ui/mockup"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

// @ts-ignore
interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
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

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  ({ className, title, subtitle, eyebrow, ctaText, ctaLink, mockupImage, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("relative flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24", className)}
        {...props}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#6366f1_100%)] opacity-5 dark:opacity-20" />
        <div className="absolute inset-0 -z-10 h-full w-full bg-grid-pattern text-slate-950/5 dark:text-slate-50/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        {/* Top Glow */}
        <div className="absolute top-0 z-0 h-[500px] w-[500px] -translate-y-[20%] rounded-full bg-indigo-500/20 blur-[100px] dark:bg-indigo-500/10" />

        <div className="container relative z-10 text-center px-4">
            {eyebrow && (
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 animate-appear opacity-0 mb-8">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                {eyebrow}
            </div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground animate-appear opacity-0 [animation-delay:100ms] leading-[1.1]">
              <span className="block">Maîtrisez votre</span>
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Avenir Financier
              </span>
            </h1>

            {subtitle && (
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-appear opacity-0 [animation-delay:300ms] leading-relaxed">
                {subtitle}
            </p>
            )}

            {ctaText && ctaLink && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-appear opacity-0 [animation-delay:500ms]">
                <Button asChild size="lg" className="h-12 px-8 text-base rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25">
                    <Link href={ctaLink}>
                        {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-full">
                    <Link href="#features">En savoir plus</Link>
                </Button>
            </div>
            )}
        </div>

        {mockupImage && (
          <div className="mt-16 w-full max-w-5xl px-4 relative animate-appear opacity-0 [animation-delay:700ms]">
            <div className="relative rounded-xl border bg-background/50 backdrop-blur shadow-2xl lg:rounded-2xl ring-1 ring-inset ring-foreground/10 p-2 md:p-4">
                <div className="rounded-lg overflow-hidden border shadow-sm bg-background">
                    <Image
                        src={mockupImage.src}
                        alt={mockupImage.alt}
                        width={mockupImage.width}
                        height={mockupImage.height}
                        className="w-full h-auto object-cover"
                        priority
                    />
                </div>
            </div>
            {/* Glow behind mockup */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-2xl rounded-[3rem]" />
          </div>
        )}
      </section>
    )
  }
)
Hero.displayName = "Hero"

export { Hero }