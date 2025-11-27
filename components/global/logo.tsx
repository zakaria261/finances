// components/global/logo.tsx
import Link from "next/link";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

interface LogoProps {
  className?: string;
  hideText?: boolean;
}

export function Logo({ className, hideText = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <Wallet className="h-6 w-6" />
      {!hideText && (
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      )}
    </Link>
  );
}