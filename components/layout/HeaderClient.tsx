// components/layout/HeaderClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "../global/logo";
import { siteConfig } from "@/lib/config";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import { ThemeToggle } from "@/components/global/ThemeToggle";

// Dummy user type since next-auth types aren't fully available
interface DummyUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface HeaderClientProps {
  user: DummyUser | null;
}

export function HeaderClient({ user }: HeaderClientProps) {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(
    siteConfig.menuItems[0]?.id || ""
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: `-50% 0px -50% 0px` }
    );

    const sections = siteConfig.menuItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
      
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const getInitials = (name?: string | null) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        data-state={menuState ? "active" : "inactive"}
        className="w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 flex items-center justify-between transition-all duration-300",
            isScrolled
              ? "max-w-4xl rounded-full border border-border/40 bg-background/60 p-2 pl-4 backdrop-blur-lg shadow-sm"
              : "max-w-6xl p-2.5"
          )}
        >
          <div className="flex items-center">
            <Logo hideText={false} className="text-foreground" />
          </div>

          <div className="hidden lg:flex">
            <ul
              className={cn(
                "relative flex items-center gap-4 text-sm transition-all duration-300",
                isScrolled && "ml-4"
              )}
            >
              {siteConfig.menuItems.map((item) => (
                <li key={item.id} className="relative">
                  <Link
                    href={item.href}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "block px-3 py-1.5 transition-colors",
                      activeSection === item.id
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{item.name}</span>
                  </Link>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 z-[-1] rounded-full bg-secondary/50"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="overflow-hidden rounded-full h-8 w-8"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.image || undefined}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback>
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name || <Skeleton className="h-4 w-20" />}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || (
                            <Skeleton className="h-3 w-32 mt-1" />
                          )}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center w-full"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/settings"
                        className="flex items-center w-full"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? "Close Menu" : "Open Menu"}
              className="relative z-20 -m-2.5 block cursor-pointer p-2.5 lg:hidden text-foreground"
            >
              <Menu className="group-data-[state=inactive]:scale-100 group-data-[state=inactive]:opacity-100 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 transition-all duration-200" />
              <X className="group-data-[state=inactive]:scale-0 group-data-[state=inactive]:opacity-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 transition-all duration-200" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuState && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute left-0 w-full mt-2 px-2"
            >
              <div className="rounded-2xl border border-border/40 bg-background/95 p-6 backdrop-blur-lg shadow-xl">
                <ul className="space-y-6 text-base">
                  {siteConfig.menuItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="w-full border-t border-border/10 pt-4 mt-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    {user ? (
                      <Button asChild className="w-full">
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/login">Sign In</Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/register">Get Started</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}