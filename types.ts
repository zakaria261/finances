
import type { LucideIcon } from 'lucide-react';

export interface Category {
  label: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

export type DepenseFrequence = 'quotidien' | 'hebdomadaire' | 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';
export type RevenuFrequence = 'mensuel' | 'ponctuel' | 'annuel';

export type TypeAssurance = 'auto' | 'habitation' | 'sante' | 'vie' | 'prevoyance' | 'responsabilite' | 'autres';

export interface Depense {
  id: number;
  nom: string;
  montant: string;
  frequence: DepenseFrequence;
  categorie: keyof typeof import('./constants').CATEGORIES;
  dateDebut?: string;
  montantTotal?: string;
  mensualitesRestantes?: string;
  tauxInteret?: string;
  nombrePaiements?: string;
  paiementsRestants?: string;
  typeAssurance?: TypeAssurance | string;
}

export interface Revenu {
  id: number;
  nom: string;
  montant: string;
  frequence: RevenuFrequence;
  categorie: keyof typeof import('./constants').REVENUS_CATEGORIES;
  dateDebut?: string;
}

export interface Objectif {
  id: number;
  nom: string;
  montantCible: string;
  montantActuel: string;
}

export interface Actif {
  type: string;
  id: number;
  nom: string;
  valeur: string;
}

// --- INVESTISSEMENT TYPES ---
export type InvestmentType = 'stock' | 'crypto' | 'etf' | 'bond' | 'other';

export interface Investment {
  id: string;
  symbol: string; // e.g., AAPL, BTC
  name: string;
  type: InvestmentType;
  quantity: number;
  averageBuyPrice: number; // PRU
  currentPrice: number; // Prix actuel (simulé ou entré manuellement)
}

export interface InfosFiscales {
  rfr: string;
  tmi: string;
  impotsPayes: string;
}

export interface Trophee {
  id: string;
  nom: string;
  description: string;
  condition: (data: FinancialData) => boolean;
}

export interface Budget {
  categorie: keyof typeof import('./constants').CATEGORIES;
  limite: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  date: string;
  read: boolean;
}

// --- GAMIFICATION TYPES ---

export type RewardType = 'coin' | 'badge' | 'theme' | 'feature';

export interface Reward {
  id: string;
  type: RewardType;
  name: string;
  value: number | string; // Amount of coins, theme ID, or feature key
  icon?: LucideIcon;
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
  type: 'add_expense' | 'add_income' | 'save_money' | 'check_app';
}

export interface SeasonPassLevel {
  level: number;
  xpRequired: number;
  freeReward: Reward | null;
  premiumReward: Reward | null;
}

export interface GameState {
  level: number;
  xp: number; // cumulative XP for current level
  coins: number;
  isPremium: boolean; // Elite Pass purchased
  claimedRewards: string[]; // IDs of claimed rewards
  unlockedFeatures: string[]; // List of unlocked feature keys (e.g., 'csv_export', 'radar_chart', 'theme_cyberpunk')
  quests: Quest[];
  lastLoginDate: string;
  streak: number;
}

export interface FinancialData {
  depenses: Depense[];
  revenus: Revenu[];
  objectifs: Objectif[];
  actifs: Actif[];
  investissements: Investment[]; // Nouveau champ
  cashFlow: number;
  score: number;
  optimisationDettes: boolean;
  patrimoineNet: number;
  infosFiscales: InfosFiscales;
  budgets: Budget[];
  analyseIAEffectuee: boolean;
  notifications: Notification[];
  gameState: GameState;
}

export interface Recommandation {
  priorite: number;
  titre: string;
  description: string;
  economie: string;
  delai: string;
}

export interface AnalyseIA {
  score: number;
  resume: string;
  pointsForts: string[];
  pointsFaibles: string[];
  recommandationsPrioritaires: Recommandation[];
  conseilsExpert: string[];
  optimisationFiscale: string;
}

export type Onglet = 'dashboard' | 'revenus' | 'depenses' | 'ajouter' | 'fiscalite' | 'objectifs' | 'patrimoine' | 'dettes' | 'analyse' | 'seasonpass' | 'investissement' | 'simulateurs';

export interface User {
  username: string;
  password: string; // Hashed
  salt?: string;
}

// THEME TYPES
export type ThemeId = 'default' | 'ocean' | 'nature' | 'sunset' | 'royal' | 'cyberpunk' | 'dark';

export interface Theme {
  id: ThemeId;
  name: string;
  isDark: boolean; // Nouveau flag pour le mode sombre
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    // Dynamic UI colors
    text: string;       // Texte principal
    subtext: string;    // Texte secondaire
    card: string;       // Fond des cartes
    border: string;     // Bordures
    input: string;      // Fond des inputs
    chartText: string;  // Couleur texte graphiques (hex)
  };
  gradients: {
    header: string;
    appBackground: string;
    primaryButton: string;
    activeTab: string;
    loginSidebar: string;
  };
  isPremium?: boolean; // Requires unlock
}
