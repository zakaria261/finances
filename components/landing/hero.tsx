// components/landing/hero.tsx
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Mockup, MockupFrame } from "@/components/ui/mockup"
import { ArrowRight } from "lucide-react"

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
        className={cn("flex flex-col items-center bg-secondary/30", className)}
        {...props}
      >
        <div className="container text-center pt-20 pb-16">
            {eyebrow && (
            <p 
                className="font-instrument-sans uppercase tracking-[0.51em] leading-[133%] text-center text-sm md:text-base mb-8 text-foreground animate-appear opacity-0"
            >
                {eyebrow}
            </p>
            )}

            <h1 
            className="text-4xl md:text-6xl font-semibold leading-tight text-center text-foreground animate-appear opacity-0 [animation-delay:100ms]"
            >
            {title}
            </h1>

            {subtitle && (
            <p 
                className="text-lg md:text-xl max-w-3xl mx-auto text-center font-instrument-sans font-light mt-6 mb-8 leading-relaxed text-muted-foreground animate-appear opacity-0 [animation-delay:300ms]"
            >
                {subtitle}
            </p>
            )}

            {ctaText && ctaLink && (
            <Link href={ctaLink}>
                <div 
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 h-12 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 animate-appear opacity-0 [animation-delay:500ms]"
                >
                <span>{ctaText}</span>
                <ArrowRight className="h-5 w-5" />
                </div>
            </Link>
            )}
        </div>

        {mockupImage && (
          <div className="mt-12 w-full relative animate-appear opacity-0 [animation-delay:700ms]">
            <MockupFrame>
              <Mockup type="responsive">
                <Image
                  src={mockupImage.src}
                  alt={mockupImage.alt}
                  width={mockupImage.width}
                  height={mockupImage.height}
                  className="w-full h-auto"
                  priority
                />
              </Mockup>
            </MockupFrame>
            <div
              className="absolute bottom-0 left-0 right-0 w-full h-[303px]"
              style={{
                background: "linear-gradient(to top, oklch(from var(--secondary) l c h / 30%) 0%, oklch(from var(--secondary) l c h / 0%) 100%)",
                zIndex: 10,
              }}
            />
          </div>
        )}
      </section>
    )
  }
)
Hero.displayName = "Hero"

export { Hero }