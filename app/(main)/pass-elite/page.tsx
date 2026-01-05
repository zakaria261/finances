'use client';

import React, { useState } from 'react';
import { Crown, Lock, Check, Gift, Coins, Sparkles, Star } from 'lucide-react';
import { SEASON_LEVELS } from '@/constants';
import type { Reward } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useFinanceData } from '@/context/FinanceDataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PassElitePage() {
  const { gameState, setGameState } = useFinanceData();
  const { currentTheme } = useTheme();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const nextLevel = SEASON_LEVELS.find(l => l.level === gameState.level + 1) || SEASON_LEVELS[SEASON_LEVELS.length - 1];
  const progressPercent = Math.min(100, (gameState.xp / nextLevel.xpRequired) * 100);

  const handleClaim = (reward: Reward) => {
    if (gameState.claimedRewards.includes(reward.id)) return;
    
    let newCoins = gameState.coins;
    const newUnlockedFeatures = [...gameState.unlockedFeatures];

    if (reward.type === 'coin') {
      newCoins += Number(reward.value);
    } else if (reward.type === 'feature') {
      newUnlockedFeatures.push(String(reward.value));
    }

    setGameState(prev => ({
      ...prev,
      coins: newCoins,
      unlockedFeatures: newUnlockedFeatures,
      claimedRewards: [...prev.claimedRewards, reward.id]
    }));
  };

  const handleBuyPremium = () => {
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isPremium: true }));
      setShowPremiumModal(false);
    }, 1000);
  };

  const renderRewardButton = (reward: Reward, isUnlocked: boolean) => {
    const isClaimed = gameState.claimedRewards.includes(reward.id);
    const isFeature = reward.type === 'feature';

    return (
      <div className="relative">
        <Button 
          size="sm" 
          variant={isClaimed ? "outline" : isFeature ? "default" : "secondary"}
          disabled={!isUnlocked || isClaimed}
          onClick={() => handleClaim(reward)}
          className={cn(
            "h-8 text-xs px-3",
            !isUnlocked && 'opacity-50 cursor-not-allowed',
            isFeature && !isClaimed && 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none hover:opacity-90 shadow-md'
          )}
        >
          {isClaimed && <Check className="w-3 h-3 mr-1"/>}
          {isClaimed ? 'Reçu' : isFeature ? 'Débloquer' : 'Réclamer'}
        </Button>
        {isFeature && !isClaimed && isUnlocked && (
          <span className="absolute -top-2 -right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <Badge className="bg-amber-500 text-black font-bold border-none">
                <Crown className="w-3 h-3 mr-1"/> SAISON 1
              </Badge>
              <span className="text-slate-300 text-sm">Fin dans 24 jours</span>
            </div>
            <h2 className="text-4xl font-bold mb-2">Pass Finance Elite</h2>
            <p className="text-indigo-200 max-w-md">
              Complétez des quêtes, gagnez de l&apos;XP et débloquez des{' '}
              <strong className="text-white">fonctionnalités exclusives</strong>{' '}
              (Export CSV, Graphiques Avancés) pour booster votre gestion.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 min-w-[200px] text-center">
            <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold mb-1">Niveau Actuel</div>
            <div className="text-5xl font-black text-white mb-2">{gameState.level}</div>
            <div className="text-xs text-indigo-200 mb-2">{gameState.xp} / {nextLevel.xpRequired} XP</div>
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quests Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className={cn("text-xl font-bold flex items-center gap-2", currentTheme.colors.text)}>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500"/> Quêtes Quotidiennes
          </h3>
          {gameState.quests.map(quest => (
            <Card 
              key={quest.id} 
              className={cn(
                "border-l-4",
                quest.completed 
                  ? "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                  : "border-l-indigo-500"
              )}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className={cn(
                    "font-bold",
                    quest.completed ? "text-emerald-800 dark:text-emerald-400" : currentTheme.colors.text
                  )}>
                    {quest.title}
                  </h4>
                  {quest.completed && <Check className="w-5 h-5 text-emerald-600" />}
                </div>
                <p className={cn("text-sm mb-3", currentTheme.colors.subtext)}>{quest.description}</p>
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex gap-2">
                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3"/> {quest.xpReward} XP
                    </span>
                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-1 rounded flex items-center gap-1">
                      <Coins className="w-3 h-3"/> {quest.coinReward}
                    </span>
                  </div>
                  <span className={currentTheme.colors.subtext}>{quest.progress} / {quest.target}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* The Pass Track */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn("text-xl font-bold flex items-center gap-2", currentTheme.colors.text)}>
              <Gift className="w-5 h-5 text-purple-500"/> Progression & Récompenses
            </h3>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full shadow-sm border",
              currentTheme.colors.card,
              currentTheme.colors.border
            )}>
              <Coins className="w-4 h-4 text-amber-500" />
              <span className={cn("font-bold", currentTheme.colors.text)}>{gameState.coins}</span>
            </div>
          </div>
          
          <div className={cn(
            "rounded-2xl border shadow-xl overflow-x-auto",
            currentTheme.colors.card,
            currentTheme.colors.border
          )}>
            <div className="min-w-[800px] p-6">
              
              {/* Headers */}
              <div className="grid grid-cols-10 gap-4 mb-4 px-12">
                <div className="col-span-10 flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Débutant</span>
                  <span>Expert</span>
                  <span>Légende</span>
                </div>
              </div>

              {/* Free Track */}
              <div className="flex items-center gap-4 mb-8 relative pl-12 pr-12">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-24 text-center origin-center">
                  Gratuit
                </div>
                <div className={cn(
                  "absolute left-12 right-12 top-1/2 h-2 -z-10 rounded-full",
                  currentTheme.isDark ? "bg-slate-700" : "bg-slate-200"
                )}></div>
                
                {SEASON_LEVELS.map((lvl) => {
                  const isUnlocked = gameState.level >= lvl.level;
                  const reward = lvl.freeReward;
                  const RewardIcon = reward?.icon;
                  
                  return (
                    <div key={`free-${lvl.level}`} className="flex-1 flex flex-col items-center gap-3 min-w-[60px]">
                      <div className={cn(
                        "relative group w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                        isUnlocked 
                          ? "border-emerald-500 bg-white dark:bg-slate-800 shadow-md" 
                          : "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700",
                        reward?.type === 'feature' && "ring-2 ring-indigo-300 ring-offset-2"
                      )}>
                        {reward && RewardIcon ? (
                          <>
                            <RewardIcon className={cn(
                              "w-6 h-6",
                              isUnlocked 
                                ? (reward.type === 'feature' ? 'text-indigo-600' : 'text-emerald-600') 
                                : 'text-slate-400'
                            )} />
                            {reward.description && (
                              <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 p-2 bg-slate-800 text-white text-xs rounded-lg z-50 text-center">
                                {reward.description}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                              </div>
                            )}
                          </>
                        ) : <div className="w-2 h-2 bg-slate-300 rounded-full"></div>}
                      </div>
                      {reward && renderRewardButton(reward, isUnlocked)}
                    </div>
                  );
                })}
              </div>

              {/* Premium Track */}
              <div className="flex items-center gap-4 relative pl-12 pr-12 mt-8">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 font-bold text-amber-600 text-[10px] uppercase tracking-widest w-24 text-center origin-center">
                  Elite
                  {!gameState.isPremium && <Lock className="w-3 h-3 inline-block ml-1"/>}
                </div>
                <div className="absolute left-12 right-12 top-1/2 h-2 bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-900/50 dark:to-orange-900/50 -z-10 rounded-full"></div>
                
                {SEASON_LEVELS.map((lvl) => {
                  const isUnlocked = gameState.level >= lvl.level;
                  const canClaim = isUnlocked && gameState.isPremium;
                  const reward = lvl.premiumReward;
                  const RewardIcon = reward?.icon;

                  return (
                    <div key={`prem-${lvl.level}`} className="flex-1 flex flex-col items-center gap-3 min-w-[60px]">
                      <div className={cn(
                        "relative group w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                        canClaim 
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 shadow-md" 
                          : "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700",
                        reward?.type === 'feature' && "ring-2 ring-purple-300 ring-offset-2"
                      )}>
                        {!gameState.isPremium && (
                          <div className="absolute inset-0 bg-black/5 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                            <Lock className="w-4 h-4 text-slate-500/50"/>
                          </div>
                        )}
                        {reward && RewardIcon ? (
                          <>
                            <RewardIcon className={cn(
                              "w-6 h-6",
                              canClaim 
                                ? (reward.type === 'feature' ? 'text-purple-600' : 'text-amber-600') 
                                : 'text-slate-400'
                            )} />
                            {reward.description && (
                              <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 p-2 bg-slate-800 text-white text-xs rounded-lg z-50 text-center">
                                {reward.description}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                              </div>
                            )}
                          </>
                        ) : <div className="w-2 h-2 bg-slate-300 rounded-full"></div>}
                      </div>
                      {reward && renderRewardButton(reward, canClaim)}
                      <div className="text-[10px] font-bold text-slate-400 mt-1">Niv {lvl.level}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Premium CTA */}
          {!gameState.isPremium && (
            <div className={cn(
              "mt-6 p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4",
              currentTheme.isDark 
                ? "bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-800/30"
                : "bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200"
            )}>
              <div className="flex-1">
                <h4 className={cn(
                  "text-lg font-bold flex items-center gap-2",
                  currentTheme.isDark ? "text-amber-400" : "text-amber-900"
                )}>
                  <Crown className="w-5 h-5"/> Débloquez le Pass Elite
                </h4>
                <p className={cn(
                  "text-sm mt-1",
                  currentTheme.isDark ? "text-amber-200" : "text-amber-800"
                )}>
                  Accédez à <strong>l&apos;analyse radar</strong>, aux <strong>thèmes exclusifs</strong> (Cyberpunk, Royal) et gagnez 3x plus de pièces.
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 whitespace-nowrap hover:opacity-90"
                onClick={() => setShowPremiumModal(true)}
              >
                Débloquer pour 9.99€
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <Card className="max-w-md w-full m-4 p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white text-center">
              <Crown className="w-12 h-12 mx-auto mb-3"/>
              <h3 className="text-2xl font-bold">Pass Elite Finance</h3>
              <p className="opacity-90">Passez au niveau supérieur</p>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                currentTheme.isDark ? "bg-slate-800" : "bg-slate-50"
              )}>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                  <Check className="w-4 h-4 text-emerald-600"/>
                </div>
                <div className={cn("text-sm", currentTheme.colors.text)}>
                  <strong>Graphiques Avancés :</strong> Visualisez vos finances en radar.
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                currentTheme.isDark ? "bg-slate-800" : "bg-slate-50"
              )}>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <Check className="w-4 h-4 text-purple-600"/>
                </div>
                <div className={cn("text-sm", currentTheme.colors.text)}>
                  <strong>Thèmes Exclusifs :</strong> Cyberpunk & Royal.
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg",
                currentTheme.isDark ? "bg-slate-800" : "bg-slate-50"
              )}>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                  <Check className="w-4 h-4 text-amber-600"/>
                </div>
                <div className={cn("text-sm", currentTheme.colors.text)}>
                  <strong>Badge &quot;Supporter&quot;</strong> sur votre profil.
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowPremiumModal(false)}>
                  Annuler
                </Button>
                <Button className="flex-1 bg-slate-900 dark:bg-slate-100 dark:text-slate-900" onClick={handleBuyPremium}>
                  Payer 9.99€
                </Button>
              </div>
              <p className={cn("text-[10px] text-center", currentTheme.colors.subtext)}>
                Ceci est une simulation. Aucun argent réel n&apos;est débité.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}