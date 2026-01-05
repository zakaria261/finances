'use client';

import React, { useMemo, useState } from 'react';
import { TrendingDown, Info, Calculator, Zap, Shield, CreditCard, AlertTriangle } from 'lucide-react';
import type { Depense } from '@/types';
import { formaterMontant } from '@/utils/financeCalculations';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PayoffResult {
  months: number;
  totalInterest: number;
}

export default function DebtsPage() {
  const { depenses, strategieDette, setStrategieDette } = useFinanceData();
  const { currentTheme } = useTheme();
  
  const credits = useMemo(() => depenses.filter(d => d.categorie === 'credit'), [depenses]);
  
  const [extraPayment, setExtraPayment] = useState('');
  const [comparison, setComparison] = useState<{ avalanche: PayoffResult; snowball: PayoffResult } | null>(null);
  const [error, setError] = useState('');

  // Total des dettes
  const totalDettes = credits.reduce((acc, d) => acc + (parseFloat(d.montantTotal || '0')), 0);
  const mensualitesTotales = credits.reduce((acc, d) => acc + (parseFloat(d.montant) || 0), 0);

  const dettesOptimisees = useMemo(() => {
    if (strategieDette === 'avalanche') {
      return [...credits].sort((a, b) => parseFloat(b.tauxInteret || '0') - parseFloat(a.tauxInteret || '0'));
    } else {
      return [...credits].sort((a, b) => parseFloat(a.montantTotal || '0') - parseFloat(b.montantTotal || '0'));
    }
  }, [credits, strategieDette]);

  const simulatePayoff = (
    initialDebts: Depense[], 
    extraMonthlyPayments: number[], 
    simStrategy: 'avalanche' | 'boule de neige'
  ): PayoffResult => {
    const debts = JSON.parse(JSON.stringify(initialDebts)).map((d: Depense) => ({
      ...d,
      balance: parseFloat(d.montantTotal || '0'),
      minPayment: parseFloat(d.montant || '0'),
      rate: (parseFloat(d.tauxInteret || '0') / 100) / 12,
    }));

    let months = 0;
    let totalInterest = 0;
    
    while (debts.some((d: { balance: number }) => d.balance > 0)) {
      months++;
      if (months > 1200) return { months: -1, totalInterest: -1 };

      const currentExtraPayment = extraMonthlyPayments.length > 0
        ? extraMonthlyPayments[(months - 1) % extraMonthlyPayments.length]
        : 0;

      let paidOffSnowball = 0;
      debts.forEach((d: { balance: number; rate: number; minPayment: number }) => {
        if (d.balance <= 0) {
          paidOffSnowball += d.minPayment;
        } else {
          const interest = d.balance * d.rate;
          totalInterest += interest;
          d.balance += interest;
        }
      });
      
      debts.forEach((d: { balance: number; minPayment: number }) => {
        if (d.balance > 0) {
          const payment = Math.min(d.balance, d.minPayment);
          d.balance -= payment;
        }
      });
      
      let availableExtra = currentExtraPayment + paidOffSnowball;
      const targetDebts = debts.filter((d: { balance: number }) => d.balance > 0);

      if (simStrategy === 'avalanche') {
        targetDebts.sort((a: { rate: number }, b: { rate: number }) => b.rate - a.rate);
      } else {
        targetDebts.sort((a: { balance: number }, b: { balance: number }) => a.balance - b.balance);
      }

      for (const target of targetDebts) {
        if (availableExtra > 0) {
          const extraPay = Math.min(target.balance, availableExtra);
          target.balance -= extraPay;
          availableExtra -= extraPay;
        }
      }
    }
    return { months, totalInterest };
  };

  const handleComparison = () => {
    const extraPaymentsArray = extraPayment
      .split(/[, ]+/)
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n) && n > 0);
    
    if (extraPaymentsArray.length === 0) {
      setError("Veuillez entrer au moins un montant supplémentaire valide et positif.");
      return;
    }
    if (credits.length === 0) {
      setError("Aucun crédit à comparer.");
      return;
    }
    setError('');
    const avalancheResult = simulatePayoff(credits, extraPaymentsArray, 'avalanche');
    const snowballResult = simulatePayoff(credits, extraPaymentsArray, 'boule de neige');
    setComparison({ avalanche: avalancheResult, snowball: snowballResult });
  };

  const ResultCard: React.FC<{
    title: string; 
    result: PayoffResult; 
    icon: React.ElementType; 
    gradient: string;
  }> = ({ title, result, icon: Icon, gradient }) => (
    <div className={cn(
      "rounded-xl p-4 shadow-lg border",
      currentTheme.colors.card,
      currentTheme.colors.border
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h4 className={cn("font-bold text-lg", currentTheme.colors.text)}>{title}</h4>
      </div>
      <div className={cn("space-y-2", currentTheme.colors.text)}>
        <p>
          🏁 Libéré des dettes en : {' '}
          <span className="font-bold">
            {result.months < 0 
              ? 'Erreur de calcul' 
              : `${Math.floor(result.months / 12)} ans et ${result.months % 12} mois`}
          </span>
        </p>
        <p>
          💰 Total des intérêts payés : {' '}
          <span className="font-bold">
            {result.totalInterest < 0 ? 'N/A' : formaterMontant(result.totalInterest)}
          </span>
        </p>
      </div>
    </div>
  );

  const inputClass = cn(
    "px-4 py-3 rounded-xl border-2 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
    currentTheme.colors.input,
    currentTheme.colors.border,
    currentTheme.colors.text
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Résumé des dettes */}
      {credits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="overflow-hidden relative border-none bg-gradient-to-br from-red-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 opacity-80" />
                <span className="text-sm font-medium opacity-80">Total des dettes</span>
              </div>
              <div className="text-3xl font-bold">{formaterMontant(totalDettes)}</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden relative border-none bg-gradient-to-br from-amber-500 to-yellow-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 opacity-80" />
                <span className="text-sm font-medium opacity-80">Mensualités totales</span>
              </div>
              <div className="text-3xl font-bold">{formaterMontant(mensualitesTotales)}/mois</div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden relative border-none bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 opacity-80" />
                <span className="text-sm font-medium opacity-80">Nombre de crédits</span>
              </div>
              <div className="text-3xl font-bold">{credits.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Optimisation des dettes */}
      <div className={cn(
        "rounded-2xl p-6 shadow-xl border backdrop-blur-xl",
        currentTheme.colors.card,
        currentTheme.colors.border
      )}>
        <h2 className={cn("text-2xl font-bold mb-6 flex items-center gap-3", currentTheme.colors.text)}>
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          Optimisation des Dettes
        </h2>

        {/* Sélection de stratégie */}
        <div className="mb-6">
          <div className={cn(
            "flex justify-center rounded-xl p-1",
            currentTheme.isDark ? "bg-slate-700" : "bg-gray-200"
          )}>
            <button
              onClick={() => setStrategieDette('avalanche')}
              className={cn(
                "w-1/2 py-2 px-4 rounded-lg font-semibold transition-all",
                strategieDette === 'avalanche' 
                  ? cn("shadow", currentTheme.colors.card, currentTheme.colors.text)
                  : currentTheme.colors.subtext
              )}
            >
              Avalanche (Taux élevés)
            </button>
            <button
              onClick={() => setStrategieDette('boule de neige')}
              className={cn(
                "w-1/2 py-2 px-4 rounded-lg font-semibold transition-all",
                strategieDette === 'boule de neige'
                  ? cn("shadow", currentTheme.colors.card, currentTheme.colors.text)
                  : currentTheme.colors.subtext
              )}
            >
              Boule de Neige (Petits soldes)
            </button>
          </div>
          
          <div className={cn(
            "mt-4 p-3 rounded-lg flex items-start gap-3 text-sm",
            currentTheme.isDark 
              ? "bg-indigo-900/30 border border-indigo-800/30 text-indigo-300"
              : "bg-indigo-50 border border-indigo-200 text-indigo-800"
          )}>
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            {strategieDette === 'avalanche' 
              ? "La méthode Avalanche priorise les dettes avec les taux d'intérêt les plus élevés, vous faisant économiser le plus d'argent sur le long terme."
              : "La méthode Boule de Neige priorise les plus petites dettes pour obtenir des victoires rapides et rester motivé."}
          </div>
        </div>

        {/* Liste des dettes optimisées */}
        <div className="space-y-4">
          <h3 className={cn("text-lg font-semibold", currentTheme.colors.text)}>
            Ordre de remboursement suggéré :
          </h3>
          {dettesOptimisees.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <CreditCard className={cn("w-12 h-12 mb-3 opacity-30", currentTheme.colors.subtext)} />
              <p className={cn("text-center", currentTheme.colors.subtext)}>
                Aucun crédit à optimiser.
              </p>
              <p className={cn("text-center text-sm", currentTheme.colors.subtext)}>
                Ajoutez des crédits dans l&apos;onglet Dépenses pour voir les optimisations.
              </p>
            </div>
          )}
          {dettesOptimisees.map((dette, index) => (
            <div
              key={dette.id}
              className={cn(
                "p-4 border rounded-xl flex items-center gap-4",
                currentTheme.colors.card,
                currentTheme.colors.border
              )}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                {index + 1}
              </div>
              <div className="flex-grow">
                <p className={cn("font-bold", currentTheme.colors.text)}>{dette.nom}</p>
                <div className={cn("text-sm flex flex-wrap gap-x-2", currentTheme.colors.subtext)}>
                  <span>Mensualité: {formaterMontant(parseFloat(dette.montant))}</span>
                  <span>|</span>
                  <span>Total restant: {formaterMontant(parseFloat(dette.montantTotal || '0'))}</span>
                  <span>|</span>
                  <span>Taux: {dette.tauxInteret || 'N/A'}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Comparateur de stratégies */}
      <div className={cn(
        "rounded-2xl p-6 shadow-xl border backdrop-blur-xl",
        currentTheme.colors.card,
        currentTheme.colors.border
      )}>
        <h3 className={cn("text-xl font-bold mb-4 flex items-center gap-2", currentTheme.colors.text)}>
          <Calculator className="w-5 h-5" /> Comparateur de Stratégies
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={extraPayment}
            onChange={(e) => setExtraPayment(e.target.value)}
            placeholder="€ extra / mois (ex: 100, 150, 200)"
            className={cn("flex-grow", inputClass)}
          />
          <button
            onClick={handleComparison}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Comparer
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        
        {comparison && (
          <div className="mt-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard 
                title="Stratégie Avalanche" 
                result={comparison.avalanche} 
                icon={Zap} 
                gradient="from-red-500 to-pink-500" 
              />
              <ResultCard 
                title="Stratégie Boule de Neige" 
                result={comparison.snowball} 
                icon={Shield} 
                gradient="from-emerald-500 to-teal-500" 
              />
            </div>
            {comparison.avalanche.totalInterest >= 0 && 
             comparison.snowball.totalInterest >= 0 && 
             comparison.snowball.totalInterest > comparison.avalanche.totalInterest && (
              <div className={cn(
                "mt-4 p-3 rounded-lg text-sm text-center",
                currentTheme.isDark 
                  ? "bg-green-900/30 border border-green-800/30 text-green-300"
                  : "bg-green-50 border border-green-200 text-green-800"
              )}>
                L&apos;Avalanche vous fait économiser{' '}
                <span className="font-bold">
                  {formaterMontant(comparison.snowball.totalInterest - comparison.avalanche.totalInterest)}
                </span>{' '}
                d&apos;intérêts !
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}