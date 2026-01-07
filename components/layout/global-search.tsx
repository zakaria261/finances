"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutDashboard,
  Wallet,
  Landmark,
  Target,
  BarChart,
  Home,
  Brain,
  Crown,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useTheme as useNextTheme } from "next-themes";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme: setNextTheme } = useNextTheme(); // For Light/Dark mode
  const { toggleTheme: toggleAppTheme } = useTheme(); // For Custom App Themes if needed

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search website...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/transactions"))}
            >
              <Wallet className="mr-2 h-4 w-4" />
              <span>Transactions</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/budgets"))}
            >
              <Landmark className="mr-2 h-4 w-4" />
              <span>Budgets</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/goals"))}
            >
              <Target className="mr-2 h-4 w-4" />
              <span>Goals</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/investments"))}
            >
              <BarChart className="mr-2 h-4 w-4" />
              <span>Investments</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/patrimoine"))}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Patrimoine (Assets)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/debts"))}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Debts</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/analyse-ia"))}
            >
              <Brain className="mr-2 h-4 w-4" />
              <span>AI Analysis</span>
            </CommandItem>
             <CommandItem
              onSelect={() => runCommand(() => router.push("/pass-elite"))}
            >
              <Crown className="mr-2 h-4 w-4" />
              <span>Pass Elite</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/settings"))}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/settings"))}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/settings"))}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setNextTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setNextTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setNextTheme("system"))}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System Mode</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          
          <CommandGroup heading="Account">
             <CommandItem
              onSelect={() => runCommand(() => signOut({ callbackUrl: "/" }))}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}