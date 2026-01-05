"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { SessionProvider } from "next-auth/react";
// We import the CUSTOM theme provider as 'AppThemeProvider' to avoid conflict, 
// if you plan to use the custom color schemes (Ocean, Cyberpunk) later.
import { ThemeProvider as AppThemeProvider } from "@/context/ThemeContext";
import { FinanceDataProvider } from "@/context/FinanceDataContext";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <SessionProvider>
      {/* 1. NextThemes handles Light/Dark mode via CSS class */}
      <NextThemesProvider
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
        {...props}
      >
        {/* 2. AppTheme handles custom color palettes (Cyberpunk, etc.) */}
        <AppThemeProvider>
            {children}
        </AppThemeProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}