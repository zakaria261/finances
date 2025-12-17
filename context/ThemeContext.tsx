'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    subtext: string;
    card: string;
    border: string;
    input: string;
    chartText: string;
  };
  gradients: {
    primaryButton: string;
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: 'indigo-600',
    secondary: 'purple-600',
    accent: 'pink-600',
    text: 'text-slate-900',
    subtext: 'text-slate-500',
    card: 'bg-white',
    border: 'border-slate-200',
    input: 'bg-white',
    chartText: '#64748b',
  },
  gradients: {
    primaryButton: 'bg-gradient-to-r from-indigo-600 to-purple-600',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: 'indigo-400',
    secondary: 'purple-400',
    accent: 'pink-400',
    text: 'text-slate-100',
    subtext: 'text-slate-400',
    card: 'bg-slate-800',
    border: 'border-slate-700',
    input: 'bg-slate-700',
    chartText: '#94a3b8',
  },
  gradients: {
    primaryButton: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ currentTheme: isDark ? darkTheme : lightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}