'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
}

interface Card {
  id: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Analytics {
  daily: { date: string; views: number }[];
}

interface DataContextType {
  analytics: Analytics;
  leads: Lead[];
  cards: Card[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [analytics] = useState<Analytics>({
    daily: [
      { date: 'Lun', views: 45 },
      { date: 'Mar', views: 52 },
      { date: 'Mer', views: 38 },
      { date: 'Jeu', views: 65 },
      { date: 'Ven', views: 48 },
      { date: 'Sam', views: 72 },
      { date: 'Dim', views: 55 },
    ]
  });
  
  const [leads] = useState<Lead[]>([]);
  const [cards] = useState<Card[]>([]);

  return (
    <DataContext.Provider value={{ analytics, leads, cards }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}