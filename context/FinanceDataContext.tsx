// ============================================================================
// FILE: context/FinanceDataContext.tsx
// ============================================================================

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Depense, Revenu, Objectif, Actif, Trophee, Budget, GameState, Investment, DepenseFrequence, RevenuFrequence } from '@/types';
import { calculerMontantMensuel } from '@/utils/financeCalculations';
import { DEFAULT_QUESTS, REVENUS_CATEGORIES, CATEGORIES } from '@/constants/index';

// Server Actions
import { generateFinancialInsights } from '@/lib/actions/ai.actions';
import { getGameState } from '@/lib/actions/gamification.actions';
import { getGoals } from '@/lib/actions/goal.actions';
import { getTransactions } from '@/lib/actions/transaction.actions';
import { getBudgetsWithSpending } from '@/lib/actions/budget.actions';
import { getAssets } from '@/lib/actions/patrimoine.actions';
import { getInvestments } from '@/lib/actions/investment.actions';
import { siteConfig } from '@/lib/config';

type StrategieDette = 'avalanche' | 'boule de neige';

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
  analyserAvecIA: () => Promise<void>;
  chargementIA: boolean;
  aiInsights: DeepInsightsData | null; 
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  investissements: Investment[];
  setInvestissements: React.Dispatch<React.SetStateAction<Investment[]>>;
  strategieDette: StrategieDette;
  setStrategieDette: React.Dispatch<React.SetStateAction<StrategieDette>>;
  refreshData: () => Promise<void>;
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

  // --- Master Sync Function ---
  const refreshData = async () => {
    try {
      // Execute all fetches in parallel for performance
      const [
        serverGameState,
        serverGoals,
        serverTransactions,
        serverBudgets,
        serverAssets,
        serverInvestments
      ] = await Promise.all([
        getGameState(),
        getGoals(),
        getTransactions(),
        getBudgetsWithSpending(),
        getAssets(),
        getInvestments()
      ]);

      // 1. Game State
      if (serverGameState) {
        setGameState(prev => ({
            ...prev,
            ...serverGameState,
            quests: prev.quests 
        }));
      }

      // 2. Goals
      if (serverGoals) {
        console.log("Server Goals:", serverGoals);
        const mappedGoals: Objectif[] = serverGoals.map(g => ({
          id: parseInt(g.id),
          nom: g.name,
          montantCible: g.targetAmount.toString(),
          montantActuel: g.currentAmount.toString()
        }));
        setObjectifs(mappedGoals);
      }

      // 3. Transactions (Split into Incomes and Expenses)
      if (serverTransactions) {
        const mappedIncomes: Revenu[] = serverTransactions
          .filter(t => t.type === 'INCOME')
          .map((t) => ({
            id: typeof t.id === 'string' ? parseInt(t.id.substring(0, 8), 16) : Number(t.id), // Handle ID mapping
            nom: t.name,
            montant: t.amount.toString(),
            frequence: 'ponctuel' as RevenuFrequence, // Default for now
            categorie: 'autres', // Fallback or map specific string
            dateDebut: t.date.toISOString()
          }));
        setRevenus(mappedIncomes);

        const mappedExpenses: Depense[] = serverTransactions
          .filter(t => t.type === 'EXPENSE')
          .map((t) => ({
            id: typeof t.id === 'string' ? parseInt(t.id.substring(0, 8), 16) : Number(t.id),
            nom: t.name,
            montant: t.amount.toString(),
            frequence: 'ponctuel' as DepenseFrequence,
            categorie: 'autres', 
            dateDebut: t.date.toISOString(),
            montantTotal: '',
            mensualitesRestantes: '',
            tauxInteret: '',
          }));
        setDepenses(mappedExpenses);
      }

      // 4. Budgets
      if (serverBudgets) {
        const mappedBudgets: Budget[] = serverBudgets.map(b => ({
          categorie: b.category, // Ensure category strings match your constants
          limite: b.limit
        }));
        setBudgets(mappedBudgets);
      }

      // 5. Assets (Patrimoine)
      if (serverAssets) {
        const mappedAssets: Actif[] = serverAssets.map(a => ({
          id: typeof a.id === 'string' ? parseInt(a.id.substring(0, 8), 16) : Number(a.id),
          nom: a.name,
          valeur: a.value.toString(),
          type: a.type.toLowerCase()
        }));
        setActifs(mappedAssets);
      }

      // 6. Investments
      if (serverInvestments) {
        // Types/Investment matches Prisma return mostly, just ensure typing
        setInvestissements(serverInvestments as unknown as Investment[]);
      }

    } catch (e) {
      console.error("Failed to refresh data", e);
    }
  };

  // Initial Load
  useEffect(() => {
    refreshData();
  }, []);

  // Helper for immediate local UI updates (optimistic UI)
  const updateLocalGameState = (xpToAdd: number) => {
    setGameState(prev => {
        let newXp = prev.xp + xpToAdd;
        let newLevel = prev.level;
        const xpThresholds = siteConfig.gamification.xpToNextLevel;
        let threshold = xpThresholds[newLevel - 1] || Infinity;

        while (newXp >= threshold) {
            newXp -= threshold;
            newLevel++;
            threshold = xpThresholds[newLevel - 1] || Infinity;
        }

        return { ...prev, xp: newXp, level: newLevel };
    });
  };

  // --- Calculations ---
  const totalRevenusMensuel = revenus.reduce((acc: number, rev) => acc + calculerMontantMensuel(rev), 0);
  const totalDepensesMensuel = depenses.reduce((acc: number, dep) => acc + calculerMontantMensuel(dep), 0);
  const totalActifs = actifs.reduce((acc, actif) => acc + (parseFloat(actif.valeur) || 0), 0);
  const totalInvestissements = investissements.reduce((acc, inv) => acc + (inv.quantity * inv.currentPrice), 0);
  
  // Note: Debt calculation requires either mapping from transactions or separate Debt model. 
  // For now using expenses tagged as credit or we could add getDebts() to refreshData if needed.
  const totalDettes = depenses
    .filter(d => d.categorie === 'credit' && d.montantTotal)
    .reduce((acc, d) => acc + (parseFloat(d.montantTotal || '0')), 0);

  const cashFlow = totalRevenusMensuel - totalDepensesMensuel;
  const scoreSante = Math.min(100, Math.max(0, Math.round((cashFlow / (totalRevenusMensuel || 1)) * 100 + 50)));
  const patrimoineNet = totalActifs + totalInvestissements - totalDettes;

  const analyserAvecIA = async () => {
    setChargementIA(true);
    try {
      const result = await generateFinancialInsights();
      if (result.error) {
        console.error("AI Analysis Failed:", result.error);
      } else {
        setAiInsights(result as DeepInsightsData);
        updateLocalGameState(siteConfig.gamification.xpEvents.AI_ANALYSIS);
        refreshData();
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
    aiInsights, 
    budgets,
    setBudgets,
    gameState,
    setGameState,
    investissements,
    setInvestissements,
    strategieDette,
    setStrategieDette,
    refreshData
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