'use client';

import React, { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Wallet, Target, Flame, Star, Trophy, 
  Sparkles, ChevronRight, PiggyBank, AlertTriangle, AlertCircle, 
  FileDown, Lock 
} from 'lucide-react';

import { formaterMontant, calculerMontantMensuel } from '@/utils/financeCalculations';
import { CATEGORIES } from '@/constants';
import type { Depense, Revenu, Objectif, Actif, Trophee, Budget, GameState } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFinanceData } from '@/context/FinanceDataContext';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
  bg: string;
  count: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, gradient, bg, count }) => {
  const { currentTheme } = useTheme();
  const bgClass = currentTheme.isDark ? `bg-slate-800/50` : `bg-gradient-to-br ${bg}`;
  
  return (
    <Card className={`border-none overflow-hidden relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${bgClass}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg text-white`}>
            <Icon className="w-6 h-6" />
          </div>
          <Badge variant="secondary" className={currentTheme.isDark ? "bg-slate-700 text-slate-200" : "bg-white/50 backdrop-blur-md"}>
            {count}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className={cn("text-sm font-medium", currentTheme.colors.subtext)}>{label}</p>
          <h4 className={cn("text-3xl font-bold tracking-tight", currentTheme.colors.text)}>{value}</h4>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const {
    cashFlow,
    scoreSante,
    totalRevenusMensuel,
    totalDepensesMensuel,
    patrimoineNet,
    revenus,
    depenses,
    objectifs,
    actifs,
    tropheesDeverrouilles,
    analyserAvecIA,
    chargementIA,
    budgets,
    setBudgets,
    gameState
  } = useFinanceData();

  const [nouveauBudget, setNouveauBudget] = useState({ categorie: Object.keys(CATEGORIES)[0], limite: '' });
  const [budgetError, setBudgetError] = useState('');
  const { currentTheme } = useTheme();

  const isCsvUnlocked = gameState.unlockedFeatures.includes('export_csv');
  const isRadarUnlocked = gameState.unlockedFeatures.includes('radar_chart');

  const donneesParCategorie = Object.keys(CATEGORIES).map(cat => ({
    name: CATEGORIES[cat].label,
    value: depenses.filter(d => d.categorie === cat).reduce((acc, d) => acc + calculerMontantMensuel(d), 0),
    color: CATEGORIES[cat].color,
    fullMark: 100
  })).filter(d => d.value > 0);
  
  const donneesRevenuDepenses = [
    { categorie: 'Revenus', montant: totalRevenusMensuel, color: '#10B981' },
    { categorie: 'Dépenses', montant: totalDepensesMensuel, color: '#EF4444' },
    { categorie: 'Cash Flow', montant: Math.max(0, cashFlow), color: '#6366f1' }
  ];

  const depensesMensuellesParCategorie = useMemo(() => {
    const map: { [key: string]: number } = {};
    depenses.forEach(dep => {
      const montant = calculerMontantMensuel(dep);
      map[dep.categorie] = (map[dep.categorie] || 0) + montant;
    });
    return map;
  }, [depenses]);

  const handleAjouterBudget = () => {
    const limite = parseFloat(nouveauBudget.limite);
    if (isNaN(limite) || limite <= 0) { 
      setBudgetError('Montant invalide.'); 
      return; 
    }
    setBudgetError('');
    setBudgets(prev => {
      const existing = prev.find(b => b.categorie === nouveauBudget.categorie);
      if (existing) return prev.map(b => b.categorie === nouveauBudget.categorie ? { ...b, limite } : b);
      return [...prev, { categorie: nouveauBudget.categorie as keyof typeof CATEGORIES, limite }];
    });
    setNouveauBudget({ categorie: nouveauBudget.categorie, limite: '' });
  };

  const exportCSV = () => {
    if (!isCsvUnlocked) return;
    const headers = ['Date', 'Nom', 'Montant', 'Catégorie', 'Fréquence'];
    const rows = depenses.map(d => [new Date().toLocaleDateString(), d.nom, d.montant, CATEGORIES[d.categorie].label, d.frequence]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mes_finances.csv");
    document.body.appendChild(link);
    link.click();
  };

  const budgetAlerts = useMemo(() => {
    return budgets.map(budget => {
      const spent = depensesMensuellesParCategorie[budget.categorie] || 0;
      const percentage = budget.limite > 0 ? (spent / budget.limite) * 100 : 0;
      if (percentage >= 80) return { ...budget, spent, percentage };
      return null;
    }).filter((b): b is NonNullable<typeof b> => b !== null);
  }, [budgets, depensesMensuellesParCategorie]);

  const tooltipStyle = {
    borderRadius: '12px', 
    border: 'none', 
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
    backgroundColor: currentTheme.isDark ? '#1e293b' : '#fff',
    color: currentTheme.isDark ? '#f8fafc' : '#0f172a'
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Actions Bar (Export) */}
      <div className="flex justify-end">
        {isCsvUnlocked ? (
          <Button variant="outline" size="sm" onClick={exportCSV} className="flex items-center gap-2">
            <FileDown className="w-4 h-4"/> Exporter CSV
          </Button>
        ) : (
          <div className="group relative">
            <Button variant="outline" size="sm" disabled className="flex items-center gap-2 opacity-60 cursor-not-allowed">
              <Lock className="w-3 h-3"/> Export CSV
            </Button>
            <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-xl hidden group-hover:block z-50 text-center">
              Débloquez au Niveau 2 du Pass (Gratuit)
            </div>
          </div>
        )}
      </div>

      {/* Alertes */}
      {budgetAlerts.length > 0 && (
        <Card className="border-amber-200/50 bg-amber-50/80 dark:bg-amber-900/20">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold mb-2">
              <AlertTriangle className="w-5 h-5"/> Alertes Budgétaires
            </div>
            {budgetAlerts.map(alert => (
              <div key={alert.categorie} className="flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-black/20 rounded-lg border border-amber-100/50">
                <span className="dark:text-amber-100">{CATEGORIES[alert.categorie].label}</span>
                <Badge variant={alert.percentage > 100 ? "destructive" : "secondary"}>
                  {alert.percentage.toFixed(0)}% ({formaterMontant(alert.spent)})
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hero Card */}
      <div className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl transform hover:scale-[1.01] transition-all duration-500 ${cashFlow >= 0 ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500' : 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'}`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-50 animate-pulse"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white/90 text-sm mb-2 font-medium uppercase tracking-wider">
              <Flame className="w-4 h-4" />Cash Flow Net
            </div>
            <div className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {formaterMontant(cashFlow)}
            </div>
            <Badge className="bg-white/20 text-white border-none backdrop-blur-md px-4 py-1 text-sm font-normal">
              {cashFlow >= 0 ? 'Situation saine' : 'Déficit mensuel'}
            </Badge>
          </div>
          
          <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 text-center min-w-[240px]">
            <div className="text-white/80 text-sm mb-2 font-medium">Score de Santé</div>
            <div className="flex items-baseline justify-center gap-1 mb-3">
              <span className="text-6xl font-bold text-white">{scoreSante}</span>
              <span className="text-xl text-white/60">/100</span>
            </div>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(scoreSante / 20) ? 'text-yellow-300 fill-yellow-300' : 'text-white/20'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Revenus" value={formaterMontant(totalRevenusMensuel)} icon={TrendingUp} gradient="from-emerald-500 to-teal-500" bg="from-emerald-50 to-teal-50" count={`${revenus.length} sources`} />
        <StatCard label="Dépenses" value={formaterMontant(totalDepensesMensuel)} icon={TrendingDown} gradient="from-red-500 to-pink-500" bg="from-red-50 to-pink-50" count={`${depenses.length} dépenses`} />
        <StatCard label="Patrimoine" value={formaterMontant(patrimoineNet)} icon={Wallet} gradient="from-indigo-500 to-purple-500" bg="from-indigo-50 to-purple-50" count={`${actifs.length} actifs`} />
        <StatCard label="Objectifs" value={objectifs.length.toString()} icon={Target} gradient="from-purple-500 to-pink-500" bg="from-purple-50 to-pink-50" count="En cours" />
      </div>

      {/* Charts Section */}
      {(depenses.length > 0 || revenus.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Répartition</CardTitle>
            </CardHeader>
            <CardContent>
              {donneesParCategorie.length > 0 ? (
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={donneesParCategorie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {donneesParCategorie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => [formaterMontant(value), "Montant"]} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : <div className="h-[250px] flex items-center justify-center text-slate-400">Aucune donnée</div>}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Aperçu Mensuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donneesRevenuDepenses} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.isDark ? "#334155" : "#f1f5f9"} vertical={false} />
                    <XAxis dataKey="categorie" stroke={currentTheme.colors.chartText} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke={currentTheme.colors.chartText} tickFormatter={(value) => `${value}€`} tick={{fontSize: 12}} axisLine={false} tickLine={false}/>
                    <Tooltip formatter={(value: number) => formaterMontant(value)} cursor={{fill: currentTheme.isDark ? '#1e293b' : '#f8fafc'}} contentStyle={tooltipStyle} />
                    <Bar dataKey="montant" radius={[6, 6, 0, 0]}>
                      {donneesRevenuDepenses.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Charts (Unlockable) */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500"/> Analyses Avancées
            {!isRadarUnlocked && <Badge variant="secondary" className="ml-2 flex items-center gap-1"><Lock className="w-3 h-3"/> Verrouillé</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`h-[300px] w-full transition-all duration-500 ${!isRadarUnlocked ? 'blur-sm opacity-50 pointer-events-none select-none' : ''}`}>
            {donneesParCategorie.length > 2 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={donneesParCategorie}>
                  <PolarGrid gridType="polygon" stroke={currentTheme.isDark ? "#334155" : "#e2e8f0"} />
                  <PolarAngleAxis dataKey="name" tick={{ fill: currentTheme.colors.chartText, fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <Radar name="Dépenses" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Tooltip formatter={(value: number) => formaterMontant(value)} contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Ajoutez plus de catégories pour voir le radar.</div>
            )}
          </div>
          
          {!isRadarUnlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/10">
              <div className={cn("p-6 rounded-2xl shadow-xl text-center border max-w-sm mx-4", currentTheme.colors.card, currentTheme.colors.border)}>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-purple-600"/>
                </div>
                <h4 className={cn("text-lg font-bold mb-2", currentTheme.colors.text)}>Contenu Elite</h4>
                <p className={cn("text-sm mb-4", currentTheme.colors.subtext)}>Atteignez le <span className="font-bold text-purple-600">Niveau 5</span> du Pass Elite pour débloquer l&apos;analyse radar de vos dépenses.</p>
                <Button disabled variant="outline">Verrouillé</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budgets Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><PiggyBank className="w-5 h-5"/> Budgets Mensuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <select 
                value={nouveauBudget.categorie} 
                onChange={e => setNouveauBudget({...nouveauBudget, categorie: e.target.value})} 
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-xl border px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  currentTheme.colors.input,
                  currentTheme.colors.border,
                  currentTheme.colors.text
                )}
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => (<option key={key} value={key}>{cat.label}</option>))}
              </select>
            </div>
            <Input 
              type="number" 
              placeholder="Limite (€)" 
              value={nouveauBudget.limite} 
              onChange={e => setNouveauBudget({...nouveauBudget, limite: e.target.value})}
              className="flex-1" 
            />
            <Button onClick={handleAjouterBudget}>Définir</Button>
          </div>
          {budgetError && <p className="text-red-500 text-sm mb-4">{budgetError}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(budget => {
              const catInfo = CATEGORIES[budget.categorie];
              const spent = depensesMensuellesParCategorie[budget.categorie] || 0;
              const percentage = Math.min(100, (spent / budget.limite) * 100);
              const isWarning = percentage >= 80 && percentage < 100;
              const isDanger = percentage >= 100;

              return (
                <div key={budget.categorie} className={cn("p-4 rounded-xl border", currentTheme.colors.border, currentTheme.isDark ? 'bg-slate-800/50' : 'bg-slate-50')}>
                  <div className="flex justify-between items-center mb-2">
                    <div className={cn("flex items-center gap-2 font-medium", currentTheme.colors.text)}>
                      {isDanger && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {isWarning && <AlertCircle className="w-4 h-4 text-amber-500" />}
                      {catInfo.label}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDanger ? 'bg-red-100 text-red-700' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className={cn("flex justify-between text-sm mb-2", currentTheme.colors.subtext)}>
                    <span>{formaterMontant(spent)}</span>
                    <span>{formaterMontant(budget.limite)}</span>
                  </div>
                  <div className={cn("h-2 w-full rounded-full overflow-hidden", currentTheme.isDark ? "bg-slate-700" : "bg-slate-200")}>
                    <div className={`h-full rounded-full transition-all duration-500 ${isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Trophies Section */}
      {tropheesDeverrouilles.length > 0 && (
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 dark:from-amber-900/20 dark:to-yellow-900/20 dark:border-amber-800/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-400">
              <Trophy className="w-6 h-6 text-amber-500" /> Trophées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tropheesDeverrouilles.map(trophee => (
                <div key={trophee.id} className={cn("rounded-xl p-4 shadow-sm border flex flex-col items-center text-center hover:shadow-md transition-shadow", currentTheme.colors.card, currentTheme.colors.border)}>
                  <div className="text-4xl mb-2">{trophee.nom.split(' ')[0]}</div>
                  <div className={cn("font-bold text-sm", currentTheme.colors.text)}>{trophee.nom}</div>
                  <div className={cn("text-xs", currentTheme.colors.subtext)}>{trophee.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Action Button */}
      <Button 
        onClick={analyserAvecIA} 
        disabled={chargementIA} 
        className="w-full h-16 text-lg rounded-2xl shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.01] transition-transform"
      >
        {chargementIA ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div> 
            Analyse en cours...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" /> 
            Lancer l&apos;analyse IA 
            <ChevronRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}