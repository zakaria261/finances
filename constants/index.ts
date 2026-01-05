import { 
  Briefcase, Gift, TrendingUp, PiggyBank, Home, Coins, Star, Flame, Trophy,
  FileDown, BarChart3, Palette, Crown, Sparkles, Shield, Zap, Award
} from 'lucide-react';
import type { Quest } from '@/types';

export type SeasonLevel = {
  level: number;
  xpRequired: number;
  freeReward: { id: string; type: string; value: number | string; icon: React.ElementType; description: string };
  premiumReward: { id: string; type: string; value: number | string; icon: React.ElementType; description: string };
};

export const CATEGORIES: Record<string, { label: string; color: string }> = {
  logement: { label: 'Logement', color: '#6366f1' },
  alimentation: { label: 'Alimentation', color: '#10b981' },
  transport: { label: 'Transport', color: '#f59e0b' },
  loisirs: { label: 'Loisirs', color: '#ec4899' },
  sante: { label: 'Santé', color: '#ef4444' },
  shopping: { label: 'Shopping', color: '#8b5cf6' },
  abonnements: { label: 'Abonnements', color: '#06b6d4' },
  credit: { label: 'Crédit', color: '#f97316' },
  autres: { label: 'Autres', color: '#64748b' },
};

export const REVENUS_CATEGORIES: Record<string, { label: string; icon: React.ElementType; gradient: string }> = {
  salaire: { label: 'Salaire', icon: Briefcase, gradient: 'from-emerald-500 to-teal-500' },
  freelance: { label: 'Freelance', icon: TrendingUp, gradient: 'from-blue-500 to-cyan-500' },
  investissement: { label: 'Investissement', icon: Coins, gradient: 'from-amber-500 to-orange-500' },
  immobilier: { label: 'Immobilier', icon: Home, gradient: 'from-purple-500 to-pink-500' },
  epargne: { label: 'Épargne', icon: PiggyBank, gradient: 'from-indigo-500 to-violet-500' },
  cadeau: { label: 'Cadeau', icon: Gift, gradient: 'from-rose-500 to-red-500' },
  autre: { label: 'Autre', icon: Coins, gradient: 'from-slate-500 to-gray-500' },
};

export const CADEAUX_OBJECTIFS = [
  { 
    nom: 'Débutant', 
    description: 'Premier pas vers votre objectif !', 
    pourcentage: 25,
    gradient: 'from-blue-400 to-blue-600',
    icon: Star
  },
  { 
    nom: 'Progression', 
    description: 'Vous êtes à mi-chemin !', 
    pourcentage: 50,
    gradient: 'from-purple-400 to-purple-600',
    icon: TrendingUp
  },
  { 
    nom: 'Presque !', 
    description: 'Plus que quelques efforts !', 
    pourcentage: 75,
    gradient: 'from-orange-400 to-orange-600',
    icon: Flame
  },
  { 
    nom: 'Champion', 
    description: 'Objectif atteint ! 🎉', 
    pourcentage: 100,
    gradient: 'from-emerald-400 to-emerald-600',
    icon: Trophy
  },
];

export const SEASON_LEVELS: SeasonLevel[] = [
  { 
    level: 1, 
    xpRequired: 100,
    freeReward: { id: 'free-1', type: 'coin', value: 50, icon: Coins, description: '50 pièces' },
    premiumReward: { id: 'prem-1', type: 'coin', value: 150, icon: Coins, description: '150 pièces' }
  },
  { 
    level: 2, 
    xpRequired: 250,
    freeReward: { id: 'free-2', type: 'feature', value: 'export_csv', icon: FileDown, description: 'Export CSV débloqué' },
    premiumReward: { id: 'prem-2', type: 'coin', value: 200, icon: Coins, description: '200 pièces' }
  },
  { 
    level: 3, 
    xpRequired: 500,
    freeReward: { id: 'free-3', type: 'coin', value: 100, icon: Coins, description: '100 pièces' },
    premiumReward: { id: 'prem-3', type: 'badge', value: 'early_supporter', icon: Award, description: 'Badge Supporter' }
  },
  { 
    level: 4, 
    xpRequired: 800,
    freeReward: { id: 'free-4', type: 'coin', value: 150, icon: Coins, description: '150 pièces' },
    premiumReward: { id: 'prem-4', type: 'theme', value: 'cyberpunk', icon: Palette, description: 'Thème Cyberpunk' }
  },
  { 
    level: 5, 
    xpRequired: 1200,
    freeReward: { id: 'free-5', type: 'feature', value: 'radar_chart', icon: BarChart3, description: 'Graphique Radar' },
    premiumReward: { id: 'prem-5', type: 'coin', value: 300, icon: Coins, description: '300 pièces' }
  },
  { 
    level: 6, 
    xpRequired: 1700,
    freeReward: { id: 'free-6', type: 'coin', value: 200, icon: Coins, description: '200 pièces' },
    premiumReward: { id: 'prem-6', type: 'feature', value: 'ai_analysis', icon: Sparkles, description: 'Analyse IA avancée' }
  },
  { 
    level: 7, 
    xpRequired: 2300,
    freeReward: { id: 'free-7', type: 'badge', value: 'veteran', icon: Shield, description: 'Badge Vétéran' },
    premiumReward: { id: 'prem-7', type: 'theme', value: 'royal', icon: Crown, description: 'Thème Royal' }
  },
  { 
    level: 8, 
    xpRequired: 3000,
    freeReward: { id: 'free-8', type: 'coin', value: 250, icon: Coins, description: '250 pièces' },
    premiumReward: { id: 'prem-8', type: 'coin', value: 500, icon: Coins, description: '500 pièces' }
  },
  { 
    level: 9, 
    xpRequired: 4000,
    freeReward: { id: 'free-9', type: 'feature', value: 'custom_categories', icon: Zap, description: 'Catégories personnalisées' },
    premiumReward: { id: 'prem-9', type: 'badge', value: 'legend', icon: Trophy, description: 'Badge Légende' }
  },
  { 
    level: 10, 
    xpRequired: 5000,
    freeReward: { id: 'free-10', type: 'badge', value: 'master', icon: Crown, description: 'Badge Maître' },
    premiumReward: { id: 'prem-10', type: 'feature', value: 'all_themes', icon: Palette, description: 'Tous les thèmes' }
  },
];

export const DEFAULT_QUESTS: Quest[] = [
  {
      id: 'quest-1',
      title: 'Premier pas',
      description: 'Ajoutez votre premier revenu',
      xpReward: 50,
      coinReward: 25,
      progress: 0,
      target: 1,
      completed: false,
      type: 'add_expense'
  },
  {
      id: 'quest-2',
      title: 'Gestionnaire',
      description: 'Ajoutez 3 dépenses',
      xpReward: 75,
      coinReward: 35,
      progress: 0,
      target: 3,
      completed: false,
      type: 'add_expense'
  },
  {
      id: 'quest-3',
      title: 'Objectif clair',
      description: 'Créez votre premier objectif d\'épargne',
      xpReward: 100,
      coinReward: 50,
      progress: 0,
      target: 1,
      completed: false,
      type: 'add_expense'
  },
  {
      id: 'quest-4',
      title: 'Investisseur',
      description: 'Ajoutez un investissement',
      xpReward: 100,
      coinReward: 50,
      progress: 0,
      target: 1,
      completed: false,
      type: 'add_expense'
  },
];