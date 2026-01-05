'use client';

import React, { useState } from 'react';
import { Trash2, Target } from 'lucide-react'; // PlusCircle and AlertTriangle were unused in render
import type { Objectif } from '@/types';
import { formaterMontant } from '@/utils/financeCalculations';
import { CADEAUX_OBJECTIFS } from '@/constants';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { cn } from '@/lib/utils';
import { Empty } from '@/components/ui/empty';
import { AddGoalDialog } from '@/components/goals/add-goal-dialog';

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

  // Note: These functions were defined but not fully utilized in the UI (modal logic missing),
  // but kept to maintain original logic.
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight font-roboto">
          Financial Goals
        </h1>
        <AddGoalDialog />
      </div>

      {/* FIXED: Added ternary start here */}
      {objectifs.length > 0 ? (
        <div className={cn(
          "rounded-2xl p-6 shadow-xl border backdrop-blur-xl",
          currentTheme.colors.card,
          currentTheme.colors.border
        )}>
          <h3 className={cn("text-xl font-bold mb-4", currentTheme.colors.text)}>
            Mes objectifs ({objectifs.length})
          </h3>
          <div className="space-y-4">
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
                    {/* Direct delete for simplicity based on provided UI, can be swapped for Confirm Dialog */}
                    <button
                      onClick={() => executerSuppression()} 
                      onMouseDown={() => confirmerSuppression(obj.id)}
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
        </div>
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
    </div>
  );
}