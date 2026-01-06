"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Sparkles } from "lucide-react"

const navLinks = [
  { name: "Fonctionnalités", href: "#features" },
  { name: "Tarifs", href: "#pricing" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      isScrolled 
        ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-lg shadow-primary/5" 
        : "bg-transparent border-transparent"
    )}>
      <div className="container flex h-16 max-w-screen-2xl items-center px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="h-7 w-7 text-primary group-hover:text-pink-500 transition-colors duration-300" />
              <div className="absolute inset-0 bg-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-primary via-pink-500 to-primary bg-clip-text text-transparent">
              Finances Expert Pro
            </span>
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary text-muted-foreground hover:scale-105 transform duration-200"
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
                className="mr-2 px-0 text-base hover:bg-primary/10 focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-background/95 backdrop-blur-xl">
              <Link
                href="/"
                className="mb-8 flex items-center space-x-2"
                onClick={() => setOpen(false)}
              >
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Finances Expert Pro</span>
              </Link>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold">Finances Pro</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button 
            asChild 
            className="bg-gradient-to-r from-primary to-pink-600 hover:shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Link href="/login">Accéder à l'App</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}