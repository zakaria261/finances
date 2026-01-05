'use client';

import React, { useState, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, PlusCircle, Bitcoin, Briefcase, Trash2, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Investment, InvestmentType } from '@/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { formaterMontant } from '@/utils/financeCalculations';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function InvestmentsPage() {
  const { currentTheme } = useTheme();
  const { investissements, setInvestissements } = useFinanceData();
  
  const [newAsset, setNewAsset] = useState<Partial<Investment>>({
    symbol: '', name: '', quantity: 0, averageBuyPrice: 0, currentPrice: 0, type: 'stock'
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- CALCULS ---
  
  const portfolioMetrics = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;
    const allocation: Record<string, number> = {};

    investissements.forEach(inv => {
      const value = inv.quantity * inv.currentPrice;
      const cost = inv.quantity * inv.averageBuyPrice;
      totalValue += value;
      totalCost += cost;
      allocation[inv.type] = (allocation[inv.type] || 0) + value;
    });

    const plValue = totalValue - totalCost;
    const plPercent = totalCost > 0 ? (plValue / totalCost) * 100 : 0;
    const dailyVarPercent = investissements.length > 0 ? (Math.random() * 3) - 1.5 : 0;
    const dailyVarValue = totalValue * (dailyVarPercent / 100);

    return { totalValue, totalCost, plValue, plPercent, dailyVarValue, dailyVarPercent, allocation };
  }, [investissements]);

  const allocationData = Object.entries(portfolioMetrics.allocation).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value
  }));

  // Mock History Data for Benchmark Chart
  const historyData = useMemo(() => {
    if (portfolioMetrics.totalValue === 0) return [];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = [];
    let currentVal = portfolioMetrics.totalCost;
    let sp500Val = portfolioMetrics.totalCost;

    for (let i = 0; i < 12; i++) {
      const change = (Math.random() * 10 - 4) / 100;
      const spChange = (Math.random() * 6 - 2) / 100;
      
      currentVal = currentVal * (1 + change);
      sp500Val = sp500Val * (1 + spChange);

      data.push({
        name: months[i],
        Portfolio: currentVal,
        SP500: sp500Val
      });
    }
    data[data.length - 1].Portfolio = portfolioMetrics.totalValue;
    
    return data;
  }, [portfolioMetrics.totalCost, portfolioMetrics.totalValue]);

  // --- HANDLERS ---

  const handleAddAsset = () => {
    if (!newAsset.symbol || !newAsset.name) return;
    const asset: Investment = {
      id: Date.now().toString(),
      symbol: newAsset.symbol.toUpperCase(),
      name: newAsset.name,
      type: newAsset.type as InvestmentType,
      quantity: Number(newAsset.quantity),
      averageBuyPrice: Number(newAsset.averageBuyPrice),
      currentPrice: Number(newAsset.currentPrice)
    };
    setInvestissements([...investissements, asset]);
    setNewAsset({ symbol: '', name: '', quantity: 0, averageBuyPrice: 0, currentPrice: 0, type: 'stock' });
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setInvestissements(prev => prev.filter(i => i.id !== id));
  };

  const inputClass = cn(
    "w-full h-10 rounded-xl border px-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
    currentTheme.colors.input,
    currentTheme.colors.border,
    currentTheme.colors.text
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Section - Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Value */}
        <Card className="md:col-span-2 overflow-hidden relative border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 p-20 bg-purple-500/10 rounded-full blur-3xl"></div>
          <CardContent className="relative z-10 p-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Valeur Totale</div>
                <h2 className="text-5xl font-bold mb-4">{formaterMontant(portfolioMetrics.totalValue)}</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className={`${portfolioMetrics.plValue >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'} border-none px-3 py-1`}>
                    {portfolioMetrics.plValue >= 0 ? '+' : ''}{formaterMontant(portfolioMetrics.plValue)} ({portfolioMetrics.plPercent.toFixed(2)}%)
                    <span className="ml-1 text-xs opacity-70">Total</span>
                  </Badge>
                  <Badge className={`${portfolioMetrics.dailyVarValue >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border-none px-3 py-1`}>
                    {portfolioMetrics.dailyVarValue >= 0 ? '+' : ''}{formaterMontant(portfolioMetrics.dailyVarValue)} (24h)
                  </Badge>
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allocation Mini Chart */}
        <Card className="flex flex-col justify-center items-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Allocation</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[150px]">
            {investissements.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocationData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => formaterMontant(Number(val))} 
                    contentStyle={{borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff'}} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">Aucune donnée</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart Section: Portfolio vs Benchmark */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500"/> Performance vs Marché (S&P 500)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {investissements.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: currentTheme.colors.chartText, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: currentTheme.colors.chartText, fontSize: 12}} tickFormatter={(val) => `${val/1000}k€`} />
                <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.isDark ? "#334155" : "#f1f5f9"} vertical={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                  formatter={(val) => formaterMontant(Number(val))}
                />
                <Area type="monotone" dataKey="Portfolio" stroke="#8884d8" fillOpacity={1} fill="url(#colorPort)" strokeWidth={2} />
                <Area type="monotone" dataKey="SP500" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSP)" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <TrendingUp className="w-12 h-12 mb-2 opacity-20"/>
              <p>Ajoutez des actifs pour voir la comparaison</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assets List & Add Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mes Actifs</CardTitle>
          <Button 
            onClick={() => setIsFormOpen(!isFormOpen)} 
            size="sm" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
          >
            {isFormOpen ? 'Fermer' : <><PlusCircle className="w-4 h-4 mr-2"/> Ajouter un actif</>}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Add Form */}
          {isFormOpen && (
            <div className={cn(
              "mb-6 p-4 rounded-xl border animate-fadeIn",
              currentTheme.colors.card,
              currentTheme.colors.border
            )}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div className="md:col-span-1">
                  <label className={cn("text-xs font-medium mb-1 block", currentTheme.colors.subtext)}>Type</label>
                  <select 
                    className={inputClass}
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({...newAsset, type: e.target.value as InvestmentType})}
                  >
                    <option value="stock">Action</option>
                    <option value="etf">ETF</option>
                    <option value="crypto">Crypto</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className={cn("text-xs font-medium mb-1 block", currentTheme.colors.subtext)}>Symbole</label>
                  <Input 
                    placeholder="AAPL" 
                    value={newAsset.symbol} 
                    onChange={(e) => setNewAsset({...newAsset, symbol: e.target.value})} 
                  />
                </div>
                <div className="md:col-span-1">
                  <label className={cn("text-xs font-medium mb-1 block", currentTheme.colors.subtext)}>Nom</label>
                  <Input 
                    placeholder="Apple Inc." 
                    value={newAsset.name} 
                    onChange={(e) => setNewAsset({...newAsset, name: e.target.value})} 
                  />
                </div>
                <div className="md:col-span-1">
                  <label className={cn("text-xs font-medium mb-1 block", currentTheme.colors.subtext)}>Quantité</label>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    value={newAsset.quantity || ''} 
                    onChange={(e) => setNewAsset({...newAsset, quantity: Number(e.target.value)})} 
                  />
                </div>
                <div className="md:col-span-1">
                  <label className={cn("text-xs font-medium mb-1 block", currentTheme.colors.subtext)}>PRU (€)</label>
                  <Input 
                    type="number" 
                    placeholder="150" 
                    value={newAsset.averageBuyPrice || ''} 
                    onChange={(e) => setNewAsset({...newAsset, averageBuyPrice: Number(e.target.value)})} 
                  />
                </div>
                <div className="md:col-span-1">
                  <label className={cn("text-xs font-medium mb-1 block", currentTheme.colors.subtext)}>Prix actuel</label>
                  <Input 
                    type="number" 
                    placeholder="175" 
                    value={newAsset.currentPrice || ''} 
                    onChange={(e) => setNewAsset({...newAsset, currentPrice: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={handleAddAsset} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                  Ajouter l&apos;actif
                </Button>
                <p className={cn("text-[10px] mt-2 text-center", currentTheme.colors.subtext)}>
                  Dans cette démo, entrez le prix actuel manuellement.
                </p>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-3">
            {investissements.length === 0 && (
              <p className={cn("text-center py-8", currentTheme.colors.subtext)}>
                Aucun investissement. Cliquez sur &quot;Ajouter un actif&quot; pour commencer.
              </p>
            )}
            {investissements.map((inv) => {
              const val = inv.quantity * inv.currentPrice;
              const gain = val - (inv.quantity * inv.averageBuyPrice);
              const gainPercent = inv.quantity * inv.averageBuyPrice > 0 
                ? ((gain / (inv.quantity * inv.averageBuyPrice)) * 100) 
                : 0;

              return (
                <div 
                  key={inv.id} 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md",
                    currentTheme.isDark ? "bg-slate-800/50" : "bg-white/50",
                    currentTheme.colors.border
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${inv.type === 'crypto' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {inv.type === 'crypto' ? <Bitcoin className="w-5 h-5"/> : <Briefcase className="w-5 h-5"/>}
                    </div>
                    <div>
                      <div className={cn("font-bold", currentTheme.colors.text)}>{inv.symbol}</div>
                      <div className={cn("text-xs", currentTheme.colors.subtext)}>{inv.name} • {inv.quantity} unités</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className={cn("text-xs", currentTheme.colors.subtext)}>Prix: {formaterMontant(inv.currentPrice)}</div>
                      <div className={cn("text-xs", currentTheme.colors.subtext)}>PRU: {formaterMontant(inv.averageBuyPrice)}</div>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <div className={cn("font-bold", currentTheme.colors.text)}>{formaterMontant(val)}</div>
                      <div className={`text-xs font-medium ${gain >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {gain >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%
                      </div>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDelete(inv.id)} 
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}