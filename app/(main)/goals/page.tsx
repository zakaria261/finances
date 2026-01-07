'use client';

import React, { useState } from 'react';
import { Trash2, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { cn } from '@/lib/utils';
import { Empty } from '@/components/ui/empty';
import { AddGoalDialog } from '@/components/goals/add-goal-dialog';
import { formaterMontant } from '@/utils/financeCalculations';
import { CADEAUX_OBJECTIFS } from '@/constants';

export default function GoalsPage() {
  const { objectifs, setObjectifs } = useFinanceData();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { currentTheme } = useTheme();

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
    
    // Allow empty string for typing
    if (nouveauMontant === '') {
       setObjectifs(objectifs.map(o => o.id === id ? { ...o, montantActuel: '' } : o));
       return;
    }

    const montantNum = parseFloat(nouveauMontant);
    if (isNaN(montantNum) || montantNum < 0) return;
    
    setObjectifs(objectifs.map(o => o.id === id ? { ...o, montantActuel: nouveauMontant } : o));
  };

  return (
    <div className="space-y-6 animate-fadeIn relative pb-12">
      
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
                Delete Goal?
              </h3>
              <p className={currentTheme.colors.subtext}>
                Are you sure you want to remove this financial goal?
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
                  Cancel
                </button>
                <button
                  onClick={executerSuppression}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-bold", currentTheme.colors.text)}>
            Financial Goals
          </h1>
          <p className={cn("text-sm", currentTheme.colors.subtext)}>
            Track your savings and reach your targets.
          </p>
        </div>
        {/* The Dialog Component is used here */}
        <AddGoalDialog />
      </div>

      {objectifs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {objectifs.map(obj => {
              const montantActuel = parseFloat(obj.montantActuel) || 0;
              const montantCible = parseFloat(obj.montantCible) || 1;
              const progression = Math.min(100, (montantActuel / montantCible) * 100);
              const cadeauxDebloques = CADEAUX_OBJECTIFS.filter(cadeau => progression >= cadeau.pourcentage);

              return (
                <div
                  key={obj.id}
                  className={cn(
                    "relative p-6 rounded-2xl border shadow-lg transition-all hover:shadow-xl",
                    currentTheme.colors.card,
                    currentTheme.colors.border
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-3 rounded-xl", 
                            currentTheme.isDark ? "bg-slate-800" : "bg-indigo-50"
                        )}>
                            <Target className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <h3 className={cn("font-bold text-lg", currentTheme.colors.text)}>{obj.nom}</h3>
                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300")}>
                                In Progress
                            </span>
                        </div>
                    </div>
                    <button
                      onClick={() => confirmerSuppression(obj.id)}
                      className={cn(
                          "p-2 rounded-lg transition-colors",
                          currentTheme.isDark ? "hover:bg-slate-800 text-slate-400 hover:text-red-400" : "hover:bg-slate-100 text-slate-400 hover:text-red-500"
                      )}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mb-2">
                     <div className={cn("text-3xl font-bold", currentTheme.colors.text)}>
                        {formaterMontant(montantActuel)}
                     </div>
                     <div className={cn("text-sm mb-1", currentTheme.colors.subtext)}>
                        of {formaterMontant(montantCible)}
                     </div>
                  </div>

                  {/* Progress Bar */}
                  <div className={cn("w-full rounded-full h-3 mb-6 overflow-hidden", currentTheme.isDark ? "bg-slate-800" : "bg-slate-100")}>
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${Math.max(progression, 5)}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Rewards Section */}
                  {cadeauxDebloques.length > 0 && (
                    <div className={cn("mt-4 pt-4 border-t", currentTheme.colors.border)}>
                      <h4 className={cn("text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1", currentTheme.colors.subtext)}>
                        <TrendingUp className="w-3 h-3" /> Unlocked Milestones
                      </h4>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {cadeauxDebloques.map((cadeau, index) => {
                          const Icon = cadeau.icon;
                          return (
                            <div
                              key={index}
                              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br ${cadeau.gradient} text-white shadow-md`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-xs font-bold">{cadeau.nom}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Add Funds */}
                  <div className={cn(
                      "mt-4 p-3 rounded-xl flex items-center gap-3",
                      currentTheme.isDark ? "bg-slate-800/50" : "bg-slate-50"
                  )}>
                    <label className={cn("text-xs font-medium whitespace-nowrap", currentTheme.colors.subtext)}>
                      Update Amount:
                    </label>
                    <input
                      type="number"
                      value={obj.montantActuel}
                      onChange={(e) => mettreAJourObjectif(obj.id, e.target.value)}
                      placeholder="0.00"
                      className={cn(
                        "w-full bg-transparent border-none outline-none text-sm font-bold text-right",
                        currentTheme.colors.text
                      )}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <Empty className={cn("border-dashed", currentTheme.colors.border)}>
          <div className={cn("p-4 rounded-full bg-muted/50 mb-4")}>
             <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className={cn("text-lg font-semibold", currentTheme.colors.text)}>No Goals Yet</h3>
            <p className={currentTheme.colors.subtext}>
              Setting goals is the first step to financial freedom.
            </p>
          </div>
        </Empty>
      )}
    </div>
  );
}