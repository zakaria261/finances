'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle, Trash2, Wallet, AlertTriangle, TrendingUp, Home, PiggyBank, Car, Landmark } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Actif } from '@/types';
import { formaterMontant } from '@/utils/financeCalculations';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ACTIF_TYPES = [
  { value: 'immobilier', label: 'Immobilier', icon: Home, gradient: 'from-blue-500 to-indigo-500' },
  { value: 'epargne', label: 'Épargne', icon: PiggyBank, gradient: 'from-emerald-500 to-teal-500' },
  { value: 'vehicule', label: 'Véhicule', icon: Car, gradient: 'from-amber-500 to-orange-500' },
  { value: 'autre', label: 'Autre', icon: Landmark, gradient: 'from-purple-500 to-pink-500' },
];

export default function PatrimoinePage() {
  const { actifs, setActifs, depenses, patrimoineNet } = useFinanceData();
  const [nouvelActif, setNouvelActif] = useState({ nom: '', valeur: '', type: 'epargne' });
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { currentTheme } = useTheme();

  const ajouterActif = () => {
    const valeurNum = parseFloat(nouvelActif.valeur);
    if (!nouvelActif.nom.trim()) {
      setError("Le nom de l'actif est requis.");
      return;
    }
    if (isNaN(valeurNum) || valeurNum < 0) {
      setError('Veuillez entrer une valeur valide et positive.');
      return;
    }
    setError('');
    setActifs([...actifs, { ...nouvelActif, id: Date.now() }]);
    setNouvelActif({ nom: '', valeur: '', type: 'epargne' });
  };

  const confirmerSuppression = (id: number) => {
    setDeleteConfirmId(id);
  };

  const annulerSuppression = () => {
    setDeleteConfirmId(null);
  };

  const executerSuppression = () => {
    if (deleteConfirmId !== null) {
      setActifs(actifs.filter(a => a.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const totalDettes = depenses
    .filter(d => d.categorie === 'credit' && d.montantTotal)
    .reduce((acc, d) => acc + (parseFloat(d.montantTotal || '0')), 0);

  const totalActifs = actifs.reduce((acc, a) => acc + (parseFloat(a.valeur) || 0), 0);

  const netWorthHistory = useMemo(() => {
    const allItems = [
      ...actifs.map(a => ({ date: new Date(a.id), amount: parseFloat(a.valeur) || 0 })),
      ...depenses
        .filter(d => d.categorie === 'credit' && d.montantTotal)
        .map(d => ({ 
          date: new Date(d.id), 
          amount: -(parseFloat(d.montantTotal || '0'))
        }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    if (allItems.length < 1) return [];

    let cumulativeWorth = 0;
    const dataPoints = [
      { date: 'Début', 'Patrimoine Net': 0 }, 
      ...allItems.map(item => {
        cumulativeWorth += item.amount;
        return {
          date: item.date.toLocaleDateString('fr-FR', { month: 'short', day: '2-digit' }),
          'Patrimoine Net': cumulativeWorth
        };
      })
    ];
    
    return dataPoints;
  }, [actifs, depenses]);

  const inputClass = cn(
    "px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
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
                Êtes-vous sûr de vouloir supprimer cet actif ?
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

      {/* Résumé du patrimoine */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cn(
          "overflow-hidden relative border-none",
          patrimoineNet >= 0 
            ? "bg-gradient-to-br from-blue-600 to-indigo-600" 
            : "bg-gradient-to-br from-red-500 to-pink-600",
          "text-white"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Patrimoine Net</span>
            </div>
            <div className="text-3xl font-bold">{formaterMontant(patrimoineNet)}</div>
          </CardContent>
        </Card>

        <Card className={cn(
          "overflow-hidden relative border-none bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Total Actifs</span>
            </div>
            <div className="text-3xl font-bold">{formaterMontant(totalActifs)}</div>
          </CardContent>
        </Card>

        <Card className={cn(
          "overflow-hidden relative border-none bg-gradient-to-br from-red-500 to-orange-500 text-white"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Total Dettes</span>
            </div>
            <div className="text-3xl font-bold">{formaterMontant(totalDettes)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire d'ajout */}
      <div className={cn(
        "rounded-2xl p-6 shadow-xl border backdrop-blur-xl",
        currentTheme.colors.card,
        currentTheme.colors.border
      )}>
        <h2 className={cn("text-2xl font-bold mb-6 flex items-center gap-3", currentTheme.colors.text)}>
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          Ajouter un actif
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nom de l'actif (ex: Livret A, Maison)"
            value={nouvelActif.nom}
            onChange={(e) => setNouvelActif({...nouvelActif, nom: e.target.value})}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Valeur (€)"
            value={nouvelActif.valeur}
            onChange={(e) => setNouvelActif({...nouvelActif, valeur: e.target.value})}
            className={inputClass}
          />
          <select
            value={nouvelActif.type}
            onChange={(e) => setNouvelActif({...nouvelActif, type: e.target.value})}
            className={inputClass}
          >
            {ACTIF_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <button
          onClick={ajouterActif}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Ajouter l&apos;actif
        </button>
      </div>

      {/* Graphique d'évolution */}
      {netWorthHistory.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Évolution du Patrimoine Net
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={netWorthHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.isDark ? "#334155" : "#f1f5f9"} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: currentTheme.colors.chartText, fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: currentTheme.colors.chartText, fontSize: 12 }} 
                  tickFormatter={(value) => formaterMontant(value as number)} 
                />
                <Tooltip 
                  formatter={(value: number) => [formaterMontant(value), "Patrimoine Net"]} 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: currentTheme.isDark ? '#1e293b' : '#fff',
                    color: currentTheme.isDark ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Patrimoine Net" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#4f46e5' }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Liste des actifs */}
      <div className={cn(
        "rounded-2xl p-6 shadow-xl border backdrop-blur-xl",
        currentTheme.colors.card,
        currentTheme.colors.border
      )}>
        <h3 className={cn("text-xl font-bold mb-4", currentTheme.colors.text)}>
          Mes actifs ({actifs.length})
        </h3>
        <div className="space-y-3">
          {actifs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <PiggyBank className={cn("w-12 h-12 mb-3 opacity-30", currentTheme.colors.subtext)} />
              <p className={cn("text-center", currentTheme.colors.subtext)}>
                Aucun actif ajouté pour le moment.
              </p>
              <p className={cn("text-center text-sm", currentTheme.colors.subtext)}>
                Ajoutez vos actifs pour calculer votre patrimoine net.
              </p>
            </div>
          )}
          {actifs.map(actif => {
            const typeInfo = ACTIF_TYPES.find(t => t.value === actif.type) || ACTIF_TYPES[3];
            const Icon = typeInfo.icon;
            
            return (
              <div
                key={actif.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-lg",
                  currentTheme.colors.border,
                  currentTheme.isDark ? "bg-slate-800/40" : "bg-slate-50/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${typeInfo.gradient} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className={cn("font-bold", currentTheme.colors.text)}>{actif.nom}</div>
                    <div className={cn("text-xs", currentTheme.colors.subtext)}>{typeInfo.label}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold text-blue-600">
                    {formaterMontant(parseFloat(actif.valeur))}
                  </div>
                  <button
                    onClick={() => confirmerSuppression(actif.id)}
                    className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentTheme.isDark ? "bg-red-900/20 text-red-400 hover:bg-red-900/40" : "bg-red-100 text-red-600 hover:bg-red-200"
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section des dettes (crédits) */}
      {totalDettes > 0 && (
        <div className={cn(
          "rounded-2xl p-6 shadow-xl border backdrop-blur-xl",
          currentTheme.colors.card, 
          currentTheme.colors.border
        )}>
          <h3 className={cn("text-xl font-bold mb-4 text-red-600")}>
            Mes dettes (crédits)
          </h3>
          <div className="space-y-3">
            {depenses
              .filter(d => d.categorie === 'credit' && d.montantTotal)
              .map(dette => (
                <div
                  key={dette.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border",
                    currentTheme.isDark ? "bg-red-900/10 border-red-900/30" : "bg-red-50/50 border-red-100"
                  )}
                >
                  <div>
                    <div className={cn("font-bold", currentTheme.colors.text)}>{dette.nom}</div>
                    <div className={cn("text-xs", currentTheme.colors.subtext)}>
                      {dette.mensualitesRestantes} mensualités restantes
                    </div>
                  </div>
                  <div className="font-semibold text-red-600">
                    -{formaterMontant(parseFloat(dette.montantTotal || '0'))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}