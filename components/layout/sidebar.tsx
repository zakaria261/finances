// components/layout/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/global/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Wallet,
  Landmark,
  Target,
  BarChart,
  Settings,
  Home,
  CreditCard,
} from "lucide-react";
import { getInitials } from "@/lib/utils"; 

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Wallet },
  { href: "/budgets", label: "Budgets", icon: Landmark },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/investments", label: "Investments", icon: BarChart },
  { href: "/patrimoine", label: "Patrimoine", icon: Home },
  { href: "/debts", label: "Debts", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      
      <SidebarContent className="mt-8">
        <SidebarMenu className="gap-y-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden whitespace-nowrap">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}