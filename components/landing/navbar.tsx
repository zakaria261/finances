// components/landing/navbar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Wallet } from "lucide-react"

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
]

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Finances Expert Pro
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  "text-foreground/60"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Nav */}
        <div className="flex items-center md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <Link
                href="/"
                className="mb-4 flex items-center"
                onClick={() => setOpen(false)}
                >
                <Wallet className="mr-2 h-4 w-4" />
                <span className="font-bold">Finances Expert Pro</span>
                </Link>
                <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground"
                    >
                    {link.name}
                    </Link>
                ))}
                </div>
            </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
                <Wallet className="h-6 w-6" />
                <span className="font-bold">Finances Pro</span>
            </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild>
                <Link href="/login">Get Started</Link>
            </Button>
        </div>
      </div>
    </header>
  )
}