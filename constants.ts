
import React from 'react';
import { 
  CreditCard, Home, Zap, Shield, ShoppingCart, TrendingDown, Wallet, 
  Sparkles, TrendingUp, DollarSign, Target, Trophy, Star, Award, Crown, Coins, Gift, Palette,
  FileDown, PieChart, Zap as ZapIcon
} from 'lucide-react';
import type { Category, Trophee, SeasonPassLevel, Quest } from './types';

export const CATEGORIES: Record<string, Category> = {
  abonnement: { label: 'Abonnement', icon: CreditCard, color: '#6366f1', gradient: 'from-indigo-500 to-blue-500' },
  loyer: { label: 'Loyer', icon: Home, color: '#ef4444', gradient: 'from-red-500 to-pink-500' },
  credit: { label: 'Crédit', icon: TrendingDown, color: '#f59e0b', gradient: 'from-amber-500 to-orange-500' },
  energie: { label: 'Énergie', icon: Zap, color: '#10b981', gradient: 'from-emerald-500 to-green-500' },
  assurance: { label: 'Assurance', icon: Shield, color: '#8b5cf6', gradient: 'from-purple-500 to-violet-500' },
  paiementFractionne: { label: 'Paiement fractionné', icon: ShoppingCart, color: '#ec4444', gradient: 'from-pink-500 to-rose-500' },
};

export const REVENUS_CATEGORIES: Record<string, Category> = {
  salaire: { label: 'Salaire', icon: Wallet, color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
  freelance: { label: 'Freelance', icon: Sparkles, color: '#6366f1', gradient: 'from-indigo-500 to-purple-500' },
  allocations: { label: 'Allocations', icon: Shield, color: '#8b5cf6', gradient: 'from-violet-500 to-purple-500' },
  dividendes: { label: 'Dividendes', icon: TrendingUp, color: '#f59e0b', gradient: 'from-amber-500 to-yellow-500' },
  autres: { label: 'Autres', icon: DollarSign, color: '#6b7280', gradient: 'from-gray-500 to-slate-500' },
};

export const TYPES_ASSURANCE: Record<string, string> = {
  auto: 'Automobile', habitation: 'Habitation', sante: 'Santé/Mutuelle',
  vie: 'Vie', prevoyance: 'Prévoyance', responsabilite: 'Responsabilité civile', autres: 'Autres'
};

export const TROPHEES: Trophee[] = [
  { id: 'economie', nom: '🎯 Économe', description: 'Première dépense ajoutée', condition: (data) => data.depenses.length > 0 },
  { id: 'visionnaire', nom: '🔮 Visionnaire', description: 'Premier objectif créé', condition: (data) => data.objectifs.length > 0 },
  { id: 'cashflow', nom: '💰 Cash Flow Positif', description: 'Revenus > Dépenses', condition: (data) => data.cashFlow > 0 },
  { id: 'maitre', nom: '🏆 Maître du Budget', description: 'Score de santé > 80', condition: (data) => data.score >= 80 },
  { id: 'investisseur', nom: '📈 Investisseur', description: '3 actifs dans le patrimoine', condition: (data) => data.actifs.length >= 3 },
  { id: 'stratege', nom: '🎲 Stratège des Dettes', description: 'Optimisation activée', condition: (data) => data.optimisationDettes },
  { id: 'planificateurExpert', nom: '📈 Planificateur Expert', description: 'Créer au moins 3 objectifs', condition: (data) => data.objectifs.length >= 3 },
  { id: 'budgetPro', nom: '📊 Pro du Budget', description: 'Définir son premier budget', condition: (data) => data.budgets.length > 0 },
  { id: 'iaCurieux', nom: '🤖 Curieux de l\'IA', description: 'Lancer sa première analyse IA', condition: (data) => data.analyseIAEffectuee },
];

export const CADEAUX_OBJECTIFS = [
  {
    pourcentage: 50,
    nom: 'Mi-Parcours',
    description: 'La moitié du chemin est faite !',
    icon: Star,
    gradient: 'from-yellow-400 to-amber-500',
  },
  {
    pourcentage: 100,
    nom: 'Mission Accomplie !',
    description: 'Félicitations ! Objectif atteint.',
    icon: Award,
    gradient: 'from-emerald-400 to-green-500',
  }
];

// --- GAME PASS DATA ---

export const SEASON_LEVELS: SeasonPassLevel[] = [
  {
    level: 1,
    xpRequired: 100,
    freeReward: { id: 'free_1', type: 'coin', name: '50 Pièces', value: 50, icon: Coins },
    premiumReward: { id: 'prem_1', type: 'coin', name: '200 Pièces', value: 200, icon: Coins }
  },
  {
    level: 2,
    xpRequired: 250,
    freeReward: { id: 'free_2', type: 'feature', name: 'Export CSV', value: 'export_csv', icon: FileDown, description: "Débloque l'export de données" },
    premiumReward: { id: 'prem_2', type: 'coin', name: '300 Pièces', value: 300, icon: Coins }
  },
  {
    level: 3,
    xpRequired: 450,
    freeReward: { id: 'free_3', type: 'coin', name: '100 Pièces', value: 100, icon: Coins },
    premiumReward: { id: 'prem_3', type: 'badge', name: 'Badge Analyste', value: 'badge_analyst', icon: Award }
  },
  {
    level: 4,
    xpRequired: 700,
    freeReward: null,
    premiumReward: { id: 'prem_4', type: 'coin', name: '500 Pièces', value: 500, icon: Coins }
  },
  {
    level: 5,
    xpRequired: 1000,
    freeReward: { id: 'free_5', type: 'coin', name: '150 Pièces', value: 150, icon: Coins },
    premiumReward: { id: 'prem_5', type: 'feature', name: 'Graphiques Avancés', value: 'radar_chart', icon: PieChart, description: "Analyse visuelle Radar" }
  },
  {
    level: 6,
    xpRequired: 1350,
    freeReward: null,
    premiumReward: { id: 'prem_6', type: 'coin', name: '750 Pièces', value: 750, icon: Coins }
  },
  {
    level: 7,
    xpRequired: 1750,
    freeReward: { id: 'free_7', type: 'coin', name: '200 Pièces', value: 200, icon: Coins },
    premiumReward: { id: 'prem_7', type: 'feature', name: 'Thème Cyberpunk', value: 'cyberpunk', icon: ZapIcon, description: "Design Néon Exclusif" }
  },
  {
    level: 8,
    xpRequired: 2200,
    freeReward: null,
    premiumReward: { id: 'prem_8', type: 'coin', name: '1000 Pièces', value: 1000, icon: Coins }
  },
  {
    level: 9,
    xpRequired: 2700,
    freeReward: { id: 'free_9', type: 'coin', name: '250 Pièces', value: 250, icon: Coins },
    premiumReward: { id: 'prem_9', type: 'badge', name: 'Badge Magnat', value: 'badge_tycoon', icon: Crown }
  },
  {
    level: 10,
    xpRequired: 3500,
    freeReward: { id: 'free_10', type: 'coin', name: '500 Pièces', value: 500, icon: Coins },
    premiumReward: { id: 'prem_10', type: 'feature', name: 'Thème Royal', value: 'royal', icon: Palette, description: "L'ultime prestige" }
  }
];

export const DAILY_QUESTS: Quest[] = [
  { id: 'q1', title: 'Gestionnaire Actif', description: 'Ajouter une dépense aujourd\'hui', xpReward: 50, coinReward: 10, progress: 0, target: 1, completed: false, type: 'add_expense' },
  { id: 'q2', title: 'Épargnant', description: 'Consulter ses objectifs', xpReward: 30, coinReward: 5, progress: 0, target: 1, completed: false, type: 'check_app' },
  { id: 'q3', title: 'Analyste', description: 'Vérifier son patrimoine', xpReward: 40, coinReward: 10, progress: 0, target: 1, completed: false, type: 'check_app' },
];
