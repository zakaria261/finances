'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Theme, ThemeId } from '../types';

// Helper properties
// We use semantic classes (text-foreground) so they automatically switch 
// between dark/light based on the CSS variables in globals.css
const baseThemeProps = {
  isDark: false,
  colors: {
    text: 'text-foreground',
    subtext: 'text-muted-foreground',
    card: 'bg-card',
    border: 'border-border',
    input: 'bg-input',
    chartText: '#94a3b8' // Default slate-400
  }
};

const THEMES: Record<ThemeId, Theme> = {
  default: {
    id: 'default',
    name: 'Futuriste',
    ...baseThemeProps,
    colors: { ...baseThemeProps.colors, primary: 'indigo-600', secondary: 'purple-600', accent: 'pink-500' },
    gradients: {
      header: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500',
      appBackground: 'bg-background', // Use CSS variable
      primaryButton: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
      activeTab: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
      loginSidebar: 'bg-slate-900',
    },
    isPremium: false
  },
  dark: {
    id: 'dark',
    name: 'Sombre',
    isDark: true,
    colors: {
      primary: 'slate-200',
      secondary: 'slate-400',
      accent: 'indigo-400',
      // Dynamic semantic colors
      text: 'text-foreground',
      subtext: 'text-muted-foreground',
      card: 'bg-card',
      border: 'border-border',
      input: 'bg-input',
      chartText: '#94a3b8'
    },
    gradients: {
      header: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-border',
      appBackground: 'bg-background',
      primaryButton: 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white',
      activeTab: 'bg-gradient-to-r from-slate-700 to-slate-600 text-white',
      loginSidebar: 'bg-black',
    },
    isPremium: false
  },
  ocean: {
    id: 'ocean',
    name: 'Océan',
    ...baseThemeProps,
    colors: { ...baseThemeProps.colors, primary: 'blue-600', secondary: 'cyan-600', accent: 'teal-400' },
    gradients: {
      header: 'bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500',
      appBackground: 'bg-background',
      primaryButton: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
      activeTab: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
      loginSidebar: 'bg-slate-900',
    },
    isPremium: false
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    ...baseThemeProps,
    colors: { ...baseThemeProps.colors, primary: 'emerald-600', secondary: 'green-600', accent: 'lime-500' },
    gradients: {
      header: 'bg-gradient-to-br from-emerald-600 via-green-600 to-lime-500',
      appBackground: 'bg-background',
      primaryButton: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white',
      activeTab: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white',
      loginSidebar: 'bg-slate-900',
    },
    isPremium: false
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    ...baseThemeProps,
    colors: { ...baseThemeProps.colors, primary: 'orange-600', secondary: 'red-600', accent: 'amber-500' },
    gradients: {
      header: 'bg-gradient-to-br from-orange-600 via-red-600 to-amber-500',
      appBackground: 'bg-background',
      primaryButton: 'bg-gradient-to-r from-orange-600 to-red-600 text-white',
      activeTab: 'bg-gradient-to-r from-orange-600 to-red-600 text-white',
      loginSidebar: 'bg-slate-900',
    },
    isPremium: false
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    isDark: true,
    colors: { 
      primary: 'fuchsia-600', 
      secondary: 'violet-600', 
      accent: 'cyan-400',
      // Force specific colors for this theme regardless of light/dark mode preference
      text: 'text-fuchsia-50', 
      subtext: 'text-fuchsia-200',
      card: 'bg-slate-900/80 backdrop-blur-md', 
      border: 'border-fuchsia-500/30',
      input: 'bg-black/50', 
      chartText: '#e879f9'
    },
    gradients: {
      header: 'bg-gradient-to-br from-fuchsia-700 via-purple-800 to-indigo-900 border-b-4 border-cyan-400',
      appBackground: 'bg-slate-950', // Force dark background
      primaryButton: 'bg-gradient-to-r from-fuchsia-600 to-cyan-600 shadow-[0_0_15px_rgba(217,70,239,0.5)] text-white',
      activeTab: 'bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white',
      loginSidebar: 'bg-black',
    },
    isPremium: true
  },
  royal: {
    id: 'royal',
    name: 'Luxe',
    isDark: true,
    colors: { 
      primary: 'yellow-600', 
      secondary: 'slate-600', 
      accent: 'yellow-500',
      // Force specific colors
      text: 'text-yellow-50', 
      subtext: 'text-yellow-200/70',
      card: 'bg-slate-900/90 backdrop-blur-md', 
      border: 'border-yellow-500/30',
      input: 'bg-slate-950/80', 
      chartText: '#eab308'
    },
    gradients: {
      header: 'bg-gradient-to-br from-slate-900 via-slate-800 to-yellow-700 border-b border-yellow-500/50',
      appBackground: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black',
      primaryButton: 'bg-gradient-to-r from-yellow-600 to-yellow-700 border border-yellow-400/30 text-white shadow-lg shadow-yellow-900/20',
      activeTab: 'bg-gradient-to-r from-slate-800 to-black text-yellow-500 border border-yellow-500/30',
      loginSidebar: 'bg-black',
    },
    isPremium: true
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (id: ThemeId) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('finance_theme') as ThemeId;
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentThemeId(savedTheme);
    }
  }, []);

  const setTheme = (id: ThemeId) => {
    setCurrentThemeId(id);
    localStorage.setItem('finance_theme', id);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme: THEMES[currentThemeId], 
      setTheme, 
      availableThemes: Object.values(THEMES) 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};