// components/global/logo.tsx

import Link from "next/link";
import { Gem } from "lucide-react"; // MODIFICATION: Changed icon from Wallet to Gem
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  hideText?: boolean;
}

export function Logo({ className, hideText = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <Gem className="h-6 w-6 text-primary" />
      {!hideText && (
        // MODIFICATION: Apply new logo font, increase size, and add gradient
        <span className="hidden font-[var(--font-logo)] text-xl font-semibold sm:inline-block">
          Finances Expert
          <span className="ml-1 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
            Pro
          </span>
        </span>
      )}
    </Link>
  );
}