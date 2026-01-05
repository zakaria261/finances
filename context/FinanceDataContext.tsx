'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Depense, Revenu, Objectif, Actif, Trophee, Budget, GameState, Investment } from '@/types';
import { calculerMontantMensuel } from '@/utils/financeCalculations';
import { DEFAULT_QUESTS } from '@/constants/index';
// Import the Server Action
import { generateFinancialInsights } from '@/lib/actions/ai.actions';

type StrategieDette = 'avalanche' | 'boule de neige';

// Define the shape of the AI response here (or import from types if centralized)
export interface DeepInsightsData {
  financialScore: number;
  financialPersona: string;
  executiveSummary: string;
  keyTrends: {
    title: string;
    direction: 'up' | 'down' | 'flat';
    insight: string;
  }[];
  actionableSteps: {
    action: string;
    impact: string;
    difficulty: 'High' | 'Medium' | 'Low';
  }[];
  forecast: {
    nextMonthSavings: number;
    debtFreeProjection: string;
    wealthProjection6Months: number;
  };
}

interface FinanceDataContextType {
  cashFlow: number;
  scoreSante: number;
  totalRevenusMensuel: number;
  totalDepensesMensuel: number;
  patrimoineNet: number;
  revenus: Revenu[];
  setRevenus: React.Dispatch<React.SetStateAction<Revenu[]>>;
  depenses: Depense[];
  setDepenses: React.Dispatch<React.SetStateAction<Depense[]>>;
  objectifs: Objectif[];
  setObjectifs: React.Dispatch<React.SetStateAction<Objectif[]>>;
  actifs: Actif[];
  setActifs: React.Dispatch<React.SetStateAction<Actif[]>>;
  tropheesDeverrouilles: Trophee[];
  // AI Logic
  analyserAvecIA: () => Promise<void>;
  chargementIA: boolean;
  aiInsights: DeepInsightsData | null; // Added to store the result
  
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  investissements: Investment[];
  setInvestissements: React.Dispatch<React.SetStateAction<Investment[]>>;
  strategieDette: StrategieDette;
  setStrategieDette: React.Dispatch<React.SetStateAction<StrategieDette>>;
}

const FinanceDataContext = createContext<FinanceDataContextType | undefined>(undefined);

const initialGameState: GameState = {
    level: 1,
    xp: 0,
    coins: 100,
    isPremium: false,
    unlockedFeatures: [],
    claimedRewards: [],
    quests: DEFAULT_QUESTS,
    lastLoginDate: '',
    streak: 0
};

export function FinanceDataProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [revenus, setRevenus] = useState<Revenu[]>([]);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [actifs, setActifs] = useState<Actif[]>([]);
  const [investissements, setInvestissements] = useState<Investment[]>([]);
  
  // AI State
  const [chargementIA, setChargementIA] = useState(false);
  const [aiInsights, setAiInsights] = useState<DeepInsightsData | null>(null);

  const [strategieDette, setStrategieDette] = useState<StrategieDette>('avalanche');
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Mise à jour des quêtes en fonction des données
  useEffect(() => {
    setGameState(prev => {
      const updatedQuests = prev.quests.map(quest => {
        let progress = 0;
        let completed = quest.completed;

        switch (quest.id) {
          case 'quest-1':
            progress = revenus.length;
            completed = revenus.length >= quest.target;
            break;
          case 'quest-2':
            progress = depenses.length;
            completed = depenses.length >= quest.target;
            break;
          case 'quest-3':
            progress = objectifs.length;
            completed = objectifs.length >= quest.target;
            break;
          case 'quest-4':
            progress = investissements.length;
            completed = investissements.length >= quest.target;
            break;
        }

        return { ...quest, progress, completed };
      });

      // Calculer XP gagné des quêtes complétées
      const newlyCompletedQuests = updatedQuests.filter(
        (q, i) => q.completed && !prev.quests[i].completed
      );
      
      let newXP = prev.xp;
      let newCoins = prev.coins;
      
      newlyCompletedQuests.forEach(quest => {
        newXP += quest.xpReward;
        newCoins += quest.coinReward;
      });

      return {
        ...prev,
        quests: updatedQuests,
        xp: newXP,
        coins: newCoins,
      };
    });
  }, [revenus.length, depenses.length, objectifs.length, investissements.length]);

  // Calculs dynamiques
  const totalRevenusMensuel = revenus.reduce((acc: number, rev) => {
    return acc + calculerMontantMensuel(rev);
  }, 0);

  const totalDepensesMensuel = depenses.reduce((acc: number, dep) => {
    return acc + calculerMontantMensuel(dep);
  }, 0);

  const totalActifs = actifs.reduce((acc, actif) => {
    return acc + (parseFloat(actif.valeur) || 0);
  }, 0);

  const totalInvestissements = investissements.reduce((acc, inv) => {
    return acc + (inv.quantity * inv.currentPrice);
  }, 0);

  const totalDettes = depenses
    .filter(d => d.categorie === 'credit' && d.montantTotal)
    .reduce((acc, d) => acc + (parseFloat(d.montantTotal || '0')), 0);

  const cashFlow = totalRevenusMensuel - totalDepensesMensuel;
  const scoreSante = Math.min(100, Math.max(0, Math.round((cashFlow / (totalRevenusMensuel || 1)) * 100 + 50)));
  const patrimoineNet = totalActifs + totalInvestissements - totalDettes;

  // --- Real AI Integration ---
  const analyserAvecIA = async () => {
    setChargementIA(true);
    try {
      // Calls the Server Action defined in lib/actions/ai.actions.ts
      const result = await generateFinancialInsights();
      
      if (result.error) {
        console.error("AI Analysis Failed:", result.error);
        // You could also add a toast notification here if you import useToast
      } else {
        setAiInsights(result as DeepInsightsData);
      }
    } catch (error) {
      console.error("Unexpected error during AI analysis:", error);
    } finally {
      setChargementIA(false);
    }
  };

  const value: FinanceDataContextType = {
    cashFlow,
    scoreSante,
    totalRevenusMensuel,
    totalDepensesMensuel,
    patrimoineNet,
    revenus,
    setRevenus,
    depenses,
    setDepenses,
    objectifs,
    setObjectifs,
    actifs,
    setActifs,
    tropheesDeverrouilles: [],
    analyserAvecIA,
    chargementIA,
    aiInsights, // Expose the data
    budgets,
    setBudgets,
    gameState,
    setGameState,
    investissements,
    setInvestissements,
    strategieDette,
    setStrategieDette,
  };

  return (
    <FinanceDataContext.Provider value={value}>
      {children}
    </FinanceDataContext.Provider>
  );
}

export function useFinanceData() {
  const context = useContext(FinanceDataContext);
  if (!context) {
    throw new Error('useFinanceData must be used within a FinanceDataProvider');
  }
  return context;
}