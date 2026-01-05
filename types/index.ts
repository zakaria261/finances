import { LucideIcon } from 'lucide-react';

export type RevenuFrequence = 'mensuel' | 'ponctuel' | 'annuel';
export type DepenseFrequence = 'hebdomadaire' | 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';
export type InvestmentType = 'stock' | 'etf' | 'crypto';

export interface Depense {
  id: number;
  nom: string;
  montant: string;
  frequence: DepenseFrequence;
  categorie: string;
  dateDebut: string;
  montantTotal?: string;
  mensualitesRestantes?: string;
  tauxInteret?: string;
  nombrePaiements?: string;
  paiementsRestants?: string;
  typeAssurance?: string;
}

export interface Revenu {
  id: number;
  nom: string;
  montant: string;
  frequence: RevenuFrequence;
  categorie: string;
  dateDebut: string;
}

export interface Objectif {
  id: number;
  nom: string;
  montantCible: string;
  montantActuel: string;
}

export interface Actif {
  id: number;
  nom: string;
  valeur: string;
  type?: string;
}

export interface Budget {
  categorie: string;
  limite: number;
}

export interface Trophee {
  id: string;
  nom: string;
  description: string;
}

export interface Reward {
  id: string;
  type: 'coin' | 'feature' | 'theme' | 'badge';
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface SeasonLevel {
  level: number;
  xpRequired: number;
  freeReward?: Reward;
  premiumReward?: Reward;
}

export interface GameState {
  level: number;
  xp: number;
  coins: number;
  isPremium: boolean;
  unlockedFeatures: string[];
  claimedRewards: string[];
  quests: Quest[];
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
}