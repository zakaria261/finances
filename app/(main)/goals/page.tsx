<<<<<<< HEAD
// app/(main)/goals/page.tsx
import { getGoals } from "@/lib/actions/goal.actions";
import { AddGoalDialog } from "@/components/goals/add-goal-dialog";
import { GoalCard } from "@/components/goals/goal-card";
import { Empty } from "@/components/ui/empty";
import { Target } from "lucide-react";
=======
'use client';
>>>>>>> 5096589c923b2f78bb39a3ca90df3a5cead660fb

import React, { useState } from 'react';
import { PlusCircle, Trash2, Target, AlertTriangle } from 'lucide-react';
import type { Objectif } from '@/types';
import { formaterMontant } from '@/utils/financeCalculations';
import { CADEAUX_OBJECTIFS } from '@/constants';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { cn } from '@/lib/utils';

export default function GoalsPage() {
  const { objectifs, setObjectifs } = useFinanceData();
  const [nouvelObjectif, setNouvelObjectif] = useState({ nom: '', montantCible: '', montantActuel: '0' });
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { currentTheme } = useTheme();

  const ajouterObjectif = () => {
    const cible = parseFloat(nouvelObjectif.montantCible);
    const actuel = parseFloat(nouvelObjectif.montantActuel);

    if (!nouvelObjectif.nom.trim()) {
      setError("Le nom de l'objectif est requis.");
      return;
    }
    if (isNaN(cible) || cible <= 0) {
      setError("Le montant cible doit être un nombre positif.");
      return;
    }
    if (isNaN(actuel) || actuel < 0) {
      setError("Le montant actuel est invalide.");
      return;
    }
    if (actuel > cible) {
      setError("Le montant actuel ne peut pas dépasser le montant cible.");
      return;
    }
    setError('');
    setObjectifs([...objectifs, { ...nouvelObjectif, id: Date.now() }]);
    setNouvelObjectif({ nom: '', montantCible: '', montantActuel: '0' });
  };

  const confirmerSuppression = (id: number) => {
    setDeleteConfirmId(id);
  };

  const annulerSuppression = () => {
    setDeleteConfirmId(null);
  };

  const executerSuppression = () => {
    if (deleteConfirmId !== null) {
      setObjectifs(objectifs.filter(o => o.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const mettreAJourObjectif = (id: number, nouveauMontant: string) => {
    const obj = objectifs.find(o => o.id === id);
    if (!obj) return;
    
    const montantNum = parseFloat(nouveauMontant);
    if (isNaN(montantNum) || montantNum < 0 || montantNum > parseFloat(obj.montantCible)) {
      return;
    }
    setObjectifs(objectifs.map(o => o.id === id ? { ...o, montantActuel: nouveauMontant } : o));
  };

  const inputClass = cn(
    "px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200",
    currentTheme.colors.input,
    currentTheme.colors.border,
    currentTheme.colors.text
  );

  // Calcul du total épargné
  const totalEpargne = objectifs.reduce((acc, obj) => acc + (parseFloat(obj.montantActuel) || 0), 0);
  const totalCible = objectifs.reduce((acc, obj) => acc + (parseFloat(obj.montantCible) || 0), 0);

  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight font-roboto">
          Financial Goals
        </h1>
        <AddGoalDialog />
=======
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
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className={cn("text-xl font-bold", currentTheme.colors.text)}>
                Confirmer la suppression
              </h3>
              <p className={currentTheme.colors.subtext}>
                Êtes-vous sûr de vouloir supprimer cet objectif ?
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

      {/* Résumé des objectifs */}
      {objectifs.length > 0 && (
        <div className={cn(
          "rounded-2xl p-4 shadow-xl border backdrop-blur-xl",
          currentTheme.isDark ? "bg-purple-900/20 border-purple-800/30" : "bg-purple-50 border-purple-200"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className={cn("font-semibold", currentTheme.colors.text)}>Progression globale</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-purple-600">{formaterMontant(totalEpargne)}</span>
              <span className={cn("text-sm ml-2", currentTheme.colors.subtext)}>/ {formaterMontant(totalCible)}</span>
            </div>
          </div>
          <div className={cn("w-full rounded-full h-2 mt-3", currentTheme.isDark ? "bg-purple-900/50" : "bg-purple-200")}>
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${totalCible > 0 ? Math.min(100, (totalEpargne / totalCible) * 100) : 0}%` }}
            />
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
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          Ajouter un objectif
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nom de l'objectif"
            value={nouvelObjectif.nom}
            onChange={(e) => setNouvelObjectif({...nouvelObjectif, nom: e.target.value})}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Montant Cible (€)"
            value={nouvelObjectif.montantCible}
            onChange={(e) => setNouvelObjectif({...nouvelObjectif, montantCible: e.target.value})}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Montant Actuel (€)"
            value={nouvelObjectif.montantActuel}
            onChange={(e) => setNouvelObjectif({...nouvelObjectif, montantActuel: e.target.value})}
            className={inputClass}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <button
          onClick={ajouterObjectif}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Ajouter l&apos;objectif
        </button>
>>>>>>> 5096589c923b2f78bb39a3ca90df3a5cead660fb
      </div>

      {/* Liste des objectifs */}
      <div className={cn(
        "rounded-2xl p-6 shadow-xl border backdrop-blur-xl",
        currentTheme.colors.card,
        currentTheme.colors.border
      )}>
        <h3 className={cn("text-xl font-bold mb-4", currentTheme.colors.text)}>
          Mes objectifs ({objectifs.length})
        </h3>
        <div className="space-y-4">
          {objectifs.length === 0 && (
            <p className={cn("text-center py-4", currentTheme.colors.subtext)}>
              Aucun objectif défini pour le moment.
            </p>
          )}
          {objectifs.map(obj => {
            const montantActuel = parseFloat(obj.montantActuel) || 0;
            const montantCible = parseFloat(obj.montantCible) || 1;
            const progression = Math.min(100, (montantActuel / montantCible) * 100);
            const cadeauxDebloques = CADEAUX_OBJECTIFS.filter(cadeau => progression >= cadeau.pourcentage);

            return (
              <div
                key={obj.id}
                className={cn(
                  "p-4 rounded-xl border",
                  currentTheme.colors.border,
                  currentTheme.isDark ? "bg-slate-800/40" : "bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("font-bold", currentTheme.colors.text)}>{obj.nom}</span>
                  <button
                    onClick={() => confirmerSuppression(obj.id)}
                    className="p-2 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className={cn("text-sm mb-2", currentTheme.colors.subtext)}>
                  {formaterMontant(montantActuel)} / {formaterMontant(montantCible)}
                </div>
                <div className={cn("w-full rounded-full h-4", currentTheme.isDark ? "bg-slate-700" : "bg-gray-200")}>
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full text-center text-white text-xs font-bold flex items-center justify-center transition-all duration-500"
                    style={{ width: `${Math.max(progression, 10)}%` }}
                  >
                    {progression.toFixed(0)}%
                  </div>
                </div>

                {/* Récompenses débloquées */}
                {cadeauxDebloques.length > 0 && (
                  <div className={cn("mt-4 pt-4 border-t", currentTheme.colors.border)}>
                    <h4 className={cn("font-semibold mb-2", currentTheme.colors.text)}>
                      Récompenses débloquées
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {cadeauxDebloques.map(cadeau => {
                        const Icon = cadeau.icon;
                        return (
                          <div
                            key={cadeau.nom}
                            className={`relative overflow-hidden flex-1 min-w-[150px] p-4 rounded-xl bg-gradient-to-br ${cadeau.gradient} text-white shadow-lg flex flex-col items-center justify-center`}
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                              <Icon className="w-24 h-24" />
                            </div>
                            <div className="relative text-center">
                              <div className="flex justify-center mb-2">
                                <Icon className="w-10 h-10" />
                              </div>
                              <div className="font-bold text-lg">{cadeau.nom}</div>
                              <p className="text-xs text-white/90">{cadeau.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mise à jour du montant */}
                <div className="mt-4">
                  <label className={cn("text-xs", currentTheme.colors.subtext)}>
                    Mettre à jour le montant actuel:
                  </label>
                  <input
                    type="number"
                    value={obj.montantActuel}
                    onChange={(e) => mettreAJourObjectif(obj.id, e.target.value)}
                    className={cn(
                      "w-full mt-1 px-3 py-2 text-sm rounded-lg border outline-none transition-all focus:border-purple-500",
                      currentTheme.colors.input,
                      currentTheme.colors.border,
                      currentTheme.colors.text
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
<<<<<<< HEAD
      ) : (
        <Empty>
            <Target className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
                <h3 className="text-lg font-semibold font-roboto">No Goals Yet</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Setting goals is the first step to financial freedom.
                </p>
            </div>
        </Empty>
      )}
=======
      </div>
>>>>>>> 5096589c923b2f78bb39a3ca90df3a5cead660fb
    </div>
  );
}