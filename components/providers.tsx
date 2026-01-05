// components/providers.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/useTheme";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <SessionProvider>
      <ThemeProvider {...props}>{children}</ThemeProvider>
    </SessionProvider>
  );
}