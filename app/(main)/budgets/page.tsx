'use client';

import React, { useState } from 'react';
import { PlusCircle, Trash2, TrendingDown, AlertTriangle, CreditCard } from 'lucide-react';
import { CATEGORIES } from '@/constants';
import type { Depense, DepenseFrequence } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { cn } from '@/lib/utils';
import { formaterMontant, calculerMontantMensuel } from '@/utils/financeCalculations';

const initialState: Omit<Depense, 'id'> = {
  nom: '',
  montant: '',
  frequence: 'mensuel',
  categorie: 'abonnements',
  dateDebut: new Date().toISOString().split('T')[0],
  montantTotal: '',
  mensualitesRestantes: '',
  tauxInteret: '',
  nombrePaiements: '',
  paiementsRestants: '',
  typeAssurance: 'auto'
};

export default function BudgetsPage() {
  const { depenses, setDepenses } = useFinanceData();
  const [nouvelleDepense, setNouvelleDepense] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { currentTheme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNouvelleDepense(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const montantNum = parseFloat(nouvelleDepense.montant);

    if (!nouvelleDepense.nom.trim()) newErrors.nom = "Le nom est requis.";
    if (isNaN(montantNum) || montantNum <= 0) newErrors.montant = "Le montant doit être un nombre positif.";

    if (nouvelleDepense.categorie === 'credit') {
      const montantTotalNum = parseFloat(nouvelleDepense.montantTotal || '');
      const mensualitesNum = parseInt(nouvelleDepense.mensualitesRestantes || '');
      const tauxNum = parseFloat(nouvelleDepense.tauxInteret || '');

      if (isNaN(montantTotalNum) || montantTotalNum <= 0) newErrors.montantTotal = "Montant total invalide.";
      if (isNaN(mensualitesNum) || mensualitesNum <= 0) newErrors.mensualitesRestantes = "Nombre de mensualités invalide.";
      if (isNaN(tauxNum) || tauxNum < 0) newErrors.tauxInteret = "Taux invalide.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ajouterDepense = () => {
    if (validate()) {
      setDepenses(prev => [...prev, { ...nouvelleDepense, id: Date.now() }]);
      setNouvelleDepense(initialState);
      setErrors({});
    }
  };

  const confirmerSuppression = (id: number) => {
    setDeleteConfirmId(id);
  };

  const annulerSuppression = () => {
    setDeleteConfirmId(null);
  };

  const executerSuppression = () => {
    if (deleteConfirmId !== null) {
      setDepenses(depenses.filter(d => d.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const inputClass = cn(
    "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
    currentTheme.colors.input,
    currentTheme.colors.border,
    currentTheme.colors.text
  );

  const totalMensuel = depenses.reduce((acc, dep) => acc + calculerMontantMensuel(dep), 0);

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
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className={cn("text-xl font-bold", currentTheme.colors.text)}>
                Confirmer la suppression
              </h3>
              <p className={currentTheme.colors.subtext}>
                Êtes-vous sûr de vouloir supprimer cette dépense ?
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
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          Ajouter une dépense
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-6">
          <div>
            <input
              type="text"
              placeholder="Nom"
              name="nom"
              value={nouvelleDepense.nom}
              onChange={handleInputChange}
              className={cn(inputClass, errors.nom && 'border-red-500')}
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
          </div>
          <div>
            <input
              type="number"
              step="0.01"
              placeholder="Montant (€)"
              name="montant"
              value={nouvelleDepense.montant}
              onChange={handleInputChange}
              className={cn(inputClass, errors.montant && 'border-red-500')}
            />
            {errors.montant && <p className="text-red-500 text-xs mt-1">{errors.montant}</p>}
          </div>
          <select
            name="frequence"
            value={nouvelleDepense.frequence}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="hebdomadaire">Hebdomadaire</option>
            <option value="mensuel">Mensuel</option>
            <option value="trimestriel">Trimestriel</option>
            <option value="semestriel">Semestriel</option>
            <option value="annuel">Annuel</option>
          </select>
          <select
            name="categorie"
            value={nouvelleDepense.categorie}
            onChange={handleInputChange}
            className={inputClass}
          >
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Champs supplémentaires pour les crédits */}
        {nouvelleDepense.categorie === 'credit' && (
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mb-6 p-4 rounded-lg",
            currentTheme.isDark ? "bg-amber-900/20" : "bg-amber-50"
          )}>
            <div>
              <input
                type="number"
                placeholder="Montant total emprunté (€)"
                name="montantTotal"
                value={nouvelleDepense.montantTotal}
                onChange={handleInputChange}
                className={cn(inputClass, errors.montantTotal && 'border-red-500')}
              />
              {errors.montantTotal && <p className="text-red-500 text-xs mt-1">{errors.montantTotal}</p>}
            </div>
            <div>
              <input
                type="number"
                placeholder="Mensualités restantes"
                name="mensualitesRestantes"
                value={nouvelleDepense.mensualitesRestantes}
                onChange={handleInputChange}
                className={cn(inputClass, errors.mensualitesRestantes && 'border-red-500')}
              />
              {errors.mensualitesRestantes && <p className="text-red-500 text-xs mt-1">{errors.mensualitesRestantes}</p>}
            </div>
            <div>
              <input
                type="number"
                step="0.01"
                placeholder="Taux d'intérêt (%)"
                name="tauxInteret"
                value={nouvelleDepense.tauxInteret}
                onChange={handleInputChange}
                className={cn(inputClass, errors.tauxInteret && 'border-red-500')}
              />
              {errors.tauxInteret && <p className="text-red-500 text-xs mt-1">{errors.tauxInteret}</p>}
            </div>
          </div>
        )}
        
        <button
          onClick={ajouterDepense}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Ajouter la dépense
        </button>
      </div>

      {/* Résumé */}
      <div className={cn(
        "rounded-2xl p-4 shadow-xl border backdrop-blur-xl",
        currentTheme.isDark ? "bg-red-900/20 border-red-800/30" : "bg-red-50 border-red-200"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span className={cn("font-semibold", currentTheme.colors.text)}>Total dépenses mensuelles</span>
          </div>
          <span className="text-2xl font-bold text-red-600">{formaterMontant(totalMensuel)}</span>
        </div>
      </div>

      {/* Liste des dépenses */}
      <div className={cn(
        "rounded-2xl p-6 shadow-xl border backdrop-blur-xl",
        currentTheme.colors.card,
        currentTheme.colors.border
      )}>
        <h3 className={cn("text-xl font-bold mb-4", currentTheme.colors.text)}>
          Mes dépenses ({depenses.length})
        </h3>
        <div className="space-y-3">
          {depenses.length === 0 && (
            <p className={cn("text-center py-4", currentTheme.colors.subtext)}>
              Aucune dépense ajoutée pour le moment.
            </p>
          )}
          {depenses.map(dep => {
            const catInfo = CATEGORIES[dep.categorie];
            const montantMensuel = calculerMontantMensuel(dep);
            
            return (
              <div
                key={dep.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border hover:shadow-lg transition-all",
                  currentTheme.colors.border,
                  currentTheme.isDark ? "bg-slate-800/40" : "bg-gradient-to-r from-red-50 to-pink-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: catInfo?.color || '#6366f1' }}
                  >
                    {dep.categorie === 'credit' ? (
                      <CreditCard className="w-5 h-5 text-white" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className={cn("font-bold", currentTheme.colors.text)}>{dep.nom}</div>
                    <div className={cn("text-sm", currentTheme.colors.subtext)}>
                      {parseFloat(dep.montant).toFixed(2)}€ · {dep.frequence}
                      {dep.frequence !== 'mensuel' && (
                        <span className="text-indigo-600 font-medium"> ({formaterMontant(montantMensuel)}/mois)</span>
                      )}
                    </div>
                    <div className={cn("text-xs", currentTheme.colors.subtext)}>
                      {catInfo?.label || 'Autre'}
                      {dep.categorie === 'credit' && dep.mensualitesRestantes && (
                        <span> · {dep.mensualitesRestantes} mensualités restantes</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => confirmerSuppression(dep.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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