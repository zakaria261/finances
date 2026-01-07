'use client';

import React, { useState } from 'react';
import { PlusCircle, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import { REVENUS_CATEGORIES } from '@/constants';
import type { RevenuFrequence } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
  const { revenus, setRevenus } = useFinanceData();
  const [nouveauRevenu, setNouveauRevenu] = useState({
    nom: '', 
    montant: '', 
    frequence: 'mensuel' as RevenuFrequence, 
    categorie: 'salaire', 
    dateDebut: ''
  });
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { currentTheme } = useTheme();

  const ajouterRevenu = () => {
    const montantNum = parseFloat(nouveauRevenu.montant);
    if (!nouveauRevenu.nom.trim()) {
      setError('Le nom du revenu est requis.');
      return;
    }
    if (isNaN(montantNum) || montantNum <= 0) {
      setError('Veuillez entrer un montant valide et positif.');
      return;
    }
    setError('');
    setRevenus([...revenus, { ...nouveauRevenu, id: Date.now() }]);
    setNouveauRevenu({ nom: '', montant: '', frequence: 'mensuel', categorie: 'salaire', dateDebut: '' });
  };

  const confirmerSuppression = (id: number) => {
    setDeleteConfirmId(id);
  };

  const annulerSuppression = () => {
    setDeleteConfirmId(null);
  };

  const executerSuppression = () => {
    if (deleteConfirmId !== null) {
      setRevenus(revenus.filter(r => r.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const inputClass = cn(
    "px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
    currentTheme.colors.input,
    currentTheme.colors.border,
    currentTheme.colors.text
  );

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* Modal de confirmation */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className={cn(
            "rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border transform transition-all scale-100", 
            currentTheme.colors.card, 
            currentTheme.colors.border
          )}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className={cn("text-xl font-bold", currentTheme.colors.text)}>
                Confirmer la suppression
              </h3>
              <p className={currentTheme.colors.subtext}>
                Êtes-vous sûr de vouloir supprimer ce revenu ?
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={annulerSuppression}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-xl border font-semibold transition-colors hover:opacity-80", 
                    currentTheme.colors.border, 
                    currentTheme.colors.text
                  )}
                >
                  Annuler
                </button>
                <button
                  onClick={executerSuppression}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire d'ajout */}
      <div className={cn(
        "rounded-2xl p-6 shadow-xl border backdrop-blur-xl", 
        currentTheme.colors.card, 
        currentTheme.colors.border
      )}>
        <h2 className={cn("text-2xl font-bold mb-6 flex items-center gap-3", currentTheme.colors.text)}>
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          Ajouter un revenu
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Nom du revenu" 
            value={nouveauRevenu.nom} 
            onChange={(e) => setNouveauRevenu({...nouveauRevenu, nom: e.target.value})} 
            className={inputClass} 
          />
          <input 
            type="number" 
            step="0.01" 
            placeholder="Montant (€)" 
            value={nouveauRevenu.montant} 
            onChange={(e) => setNouveauRevenu({...nouveauRevenu, montant: e.target.value})} 
            className={inputClass} 
          />
          <select 
            value={nouveauRevenu.frequence} 
            onChange={(e) => setNouveauRevenu({...nouveauRevenu, frequence: e.target.value as RevenuFrequence})} 
            className={inputClass}
          >
            <option value="mensuel">Mensuel</option>
            <option value="ponctuel">Ponctuel</option>
            <option value="annuel">Annuel</option>
          </select>
          <select 
            value={nouveauRevenu.categorie} 
            onChange={(e) => setNouveauRevenu({...nouveauRevenu, categorie: e.target.value})} 
            className={inputClass}
          >
            {Object.entries(REVENUS_CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
          <div className="lg:col-span-1">
            <label 
              htmlFor="revenu-date-debut" 
              className={cn("block text-xs font-medium mb-1", currentTheme.colors.subtext)}
            >
              Date de début (optionnel)
            </label>
            <input 
              id="revenu-date-debut" 
              type="date" 
              value={nouveauRevenu.dateDebut} 
              onChange={(e) => setNouveauRevenu({...nouveauRevenu, dateDebut: e.target.value})} 
              className={cn("w-full", inputClass)} 
            />
          </div>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button 
          onClick={ajouterRevenu} 
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Ajouter le revenu
        </button>
      </div>

      {/* Liste des revenus */}
      <div className={cn(
        "rounded-2xl p-6 shadow-xl border backdrop-blur-xl", 
        currentTheme.colors.card, 
        currentTheme.colors.border
      )}>
        <h3 className={cn("text-xl font-bold mb-4", currentTheme.colors.text)}>
          Mes revenus ({revenus.length})
        </h3>
        <div className="space-y-3">
          {revenus.length === 0 && (
            <p className={cn("text-center py-4", currentTheme.colors.subtext)}>
              Aucun revenu ajouté pour le moment.
            </p>
          )}
          {revenus.map(rev => {
            const catInfo = REVENUS_CATEGORIES[rev.categorie];
            const Icon = catInfo?.icon || TrendingUp;
            const gradient = catInfo?.gradient || 'from-emerald-500 to-teal-500';
            
            return (
              <div 
                key={rev.id} 
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border hover:shadow-lg transition-all", 
                  currentTheme.colors.border, 
                  currentTheme.isDark ? "bg-slate-800/40" : "bg-slate-50/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className={cn("font-bold", currentTheme.colors.text)}>{rev.nom}</div>
                    <div className={cn("text-sm", currentTheme.colors.subtext)}>
                      {parseFloat(rev.montant).toFixed(2)}€ · {rev.frequence}
                      {rev.dateDebut && rev.frequence !== 'ponctuel' && (
                        <span className="italic"> · à p. du {new Date(rev.dateDebut).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => confirmerSuppression(rev.id)} 
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    currentTheme.isDark ? "bg-red-900/20 text-red-400 hover:bg-red-900/40" : "bg-red-100 text-red-600 hover:bg-red-200"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}