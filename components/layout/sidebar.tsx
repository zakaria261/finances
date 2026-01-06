"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/global/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/global/ThemeToggle";
import {
  LayoutDashboard,
  Wallet,
  Landmark,
  Target,
  BarChart,
  Settings,
  Home,
  CreditCard,
  Crown,
  LogOut,
  User as UserIcon,
  CreditCard as BillingIcon,
  Bell,
  Sparkles,
  ChevronsUpDown,
  Brain, // ← NOUVELLE ICÔNE pour l'IA
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import { useFinanceData } from "@/context/FinanceDataContext";

// Menu items
const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/transactions", label: "Revenus", icon: Wallet },
  { href: "/budgets", label: "Dépenses", icon: Landmark },
  
  
  { href: "/goals", label: "Objectifs", icon: Target },
  { href: "/investments", label: "Investissements", icon: BarChart },
  { href: "/patrimoine", label: "Patrimoine", icon: Home },
  { href: "/debts", label: "Dettes", icon: CreditCard },
  { 
    href: "/analyse-ia", 
    label: "Analyse IA", 
    icon: Brain,
    badge: "AI",
    highlight: true // ← Pour un style spécial
  },
  { href: "/pass-elite", label: "Pass Elite", icon: Crown },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { gameState } = useFinanceData();

  // Calculate level progress
  const nextLevelXp = gameState ? 100 * Math.pow(1.5, gameState.level - 1) : 100;
  const progressPercent = gameState ? (gameState.xp / nextLevelXp) * 100 : 0;

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent className="mt-2">
        <SidebarMenu className="gap-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isHighlighted = item.highlight;
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    "transition-all duration-200 group relative",
                    isActive && isHighlighted
                      ? "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 text-purple-600 dark:text-purple-400 font-medium"
                      : isActive 
                      ? "bg-gradient-to-r from-indigo-500/10 to-transparent text-indigo-600 dark:text-indigo-400 font-medium" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors", 
                      isActive && isHighlighted
                        ? "text-purple-600 dark:text-purple-400"
                        : isActive 
                        ? "text-indigo-600 dark:text-indigo-400" 
                        : "group-hover:text-foreground"
                    )} />
                    <span className="flex-1">{item.label}</span>
                    
                    {/* Badge pour l'onglet IA */}
                    {item.badge && (
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "ml-auto text-[9px] px-1.5 py-0 h-4 font-bold",
                          isHighlighted && "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
                
                {/* Glow effect pour l'onglet IA quand actif */}
                {isActive && isHighlighted && (
                  <div className="absolute inset-0 -z-10 rounded-md bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 blur-xl opacity-50" />
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="mx-2 opacity-50" />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg border">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
                    <AvatarFallback className="rounded-lg bg-indigo-100 text-indigo-600 font-bold dark:bg-indigo-900 dark:text-indigo-300">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
                      <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                {/* Gamification Status Section */}
                <div className="px-2 py-2 bg-muted/30 rounded-md mx-1 my-1">
                    <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <div className="bg-amber-100 p-1 rounded-md dark:bg-amber-900/40">
                                <Crown className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-xs font-semibold text-foreground">Niveau {gameState?.level || 1}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{Math.floor(gameState?.xp || 0)} / {Math.floor(nextLevelXp)} XP</span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5" />
                </div>

                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/pass-elite">
                        <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
                        Pass Elite
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/analyse-ia">
                        <Brain className="mr-2 h-4 w-4 text-purple-500" />
                        Analyse IA
                        <Badge className="ml-auto h-4 px-1 text-[9px] bg-gradient-to-r from-purple-600 to-pink-600 border-0">AI</Badge>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <BillingIcon className="mr-2 h-4 w-4" />
                        Abonnement
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        <Badge className="ml-auto h-4 px-1 text-[9px] bg-red-500">2</Badge>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {/* Embedded Theme Toggle in Menu */}
                <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-sm">Thème</span>
                    <ThemeToggle /> 
                </div>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}