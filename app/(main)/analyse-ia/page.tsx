"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Sparkles, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trophy,
  RefreshCw,
  Zap,
  Lightbulb,
  Target,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/ThemeContext'
import { useFinanceData } from '@/context/FinanceDataContext'
import { formaterMontant } from '@/utils/financeCalculations'
import type { AnalyseIA } from '@/types/analyse'

export default function AnalyseIAPage() {
  const { currentTheme } = useTheme()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const {
    cashFlow,
    totalRevenusMensuel,
    totalDepensesMensuel,
    patrimoineNet,
    revenus,
    depenses,
    actifs,
    // passifs, // RETIRÉ: N'existe pas dans le contexte
    gameState,
    setGameState
  } = useFinanceData()

  // CORRECTION 1 : On dérive les passifs (dettes) depuis les dépenses de type 'credit'
  const passifs = depenses.filter(d => d.categorie === 'credit');

  const [analyse, setAnalyse] = useState<AnalyseIA | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-start l'analyse si le paramètre autostart=true est présent
  useEffect(() => {
    const autostart = searchParams.get('autostart')
    if (autostart === 'true' && !analyse && !isLoading) {
      const timer = setTimeout(() => {
        handleAnalyse()
        router.replace('/analyse-ia', { scroll: false })
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleAnalyse = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Préparer les données pour l'IA
      const financialSnapshot = {
        revenus: {
          total: totalRevenusMensuel,
          sources: revenus.map(r => ({
            nom: r.nom,
            montant: r.montant,
            frequence: r.frequence
          }))
        },
        depenses: {
          total: totalDepensesMensuel,
          detail: depenses.map(d => ({
            nom: d.nom,
            montant: d.montant,
            categorie: d.categorie,
            frequence: d.frequence
          }))
        },
        patrimoine: {
          net: patrimoineNet,
          actifs: actifs.map(a => ({
            type: a.type,
            valeur: a.valeur
          })),
          // CORRECTION 2 : Utilisation de la variable dérivée passifs avec sécurisation
          passifs: passifs.map(p => ({
            nom: p.nom,
            // On s'assure d'avoir une valeur numérique valide
            montant: parseFloat(p.montantTotal || p.montant || '0')
          }))
        },
        cashFlow: cashFlow,
        metriques: {
          ratioDepensesRevenus: totalRevenusMensuel > 0 ? (totalDepensesMensuel / totalRevenusMensuel) * 100 : 0,
          tauxEpargne: totalRevenusMensuel > 0 ? ((totalRevenusMensuel - totalDepensesMensuel) / totalRevenusMensuel) * 100 : 0
        }
      }

      const response = await fetch('/api/analyse-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(financialSnapshot)
      })

      //alert(JSON.stringify(financialSnapshot, null, 2)) // DEBUG

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse')
      }

      const data: AnalyseIA = await response.json()
      setAnalyse(data)

      if (gameState && setGameState) {
        setGameState({
          ...gameState,
          xp: gameState.xp + 50
        })
      }

    } catch (err) {
      console.error('Erreur analyse:', err)
      setError('Une erreur est survenue lors de l\'analyse. Utilisation de données de démonstration.')
      
      // CORRECTION 3 : Calcul du score sécurisé (évite NaN si revenus = 0)
      const calculatedScore = totalRevenusMensuel > 0 
        ? Math.min(100, Math.max(0, 70 + Math.floor((cashFlow / totalRevenusMensuel) * 30)))
        : 50; // Score par défaut si pas de revenus

      const mockData: AnalyseIA = {
        score: calculatedScore,
        resume: "Votre situation financière présente des opportunités d'amélioration intéressantes.",
        pointsForts: [
          totalRevenusMensuel >= totalDepensesMensuel ? "Flux de trésorerie positif" : "Potentiel d'optimisation",
          `${revenus.length} source${revenus.length > 1 ? 's' : ''} de revenus`,
          `Patrimoine de ${formaterMontant(patrimoineNet)}`,
          actifs.length > 0 ? "Présence d'actifs diversifiés" : "Opportunité de débuter l'investissement"
        ],
        pointsFaibles: [
          totalDepensesMensuel > totalRevenusMensuel * 0.7 ? "Ratio dépenses/revenus élevé" : "Gestion budgétaire à affiner",
          "Diversification des actifs à améliorer",
          "Épargne de précaution à renforcer",
          depenses.length > 10 ? "Nombreuses dépenses à rationaliser" : "Structure de dépenses à optimiser"
        ],
        recommandationsPrioritaires: [
          {
            priorite: 1,
            titre: "Optimiser le budget mensuel",
            description: "Réduisez vos dépenses de 10% en identifiant les postes non essentiels pour augmenter votre capacité d'épargne.",
            economie: `${formaterMontant(Math.max(50, totalDepensesMensuel * 0.1))}/mois`,
            delai: "Immédiat"
          },
          {
            priorite: 2,
            titre: "Constituer un fonds d'urgence",
            description: "Épargnez progressivement l'équivalent de 3 à 6 mois de dépenses pour faire face aux imprévus.",
            economie: `${formaterMontant(Math.max(1000, totalDepensesMensuel * 3))} objectif`,
            delai: "6-12 mois"
          },
          {
            priorite: 3,
            titre: "Diversifier vos revenus",
            description: "Explorez des sources de revenus complémentaires (freelance, investissements, placements) pour sécuriser votre situation.",
            economie: `+${formaterMontant(Math.max(100, totalRevenusMensuel * 0.2))}/mois potentiel`,
            delai: "Moyen terme"
          }
        ],
        conseilsExpert: [
          "Automatisez vos virements d'épargne dès réception du salaire",
          "Appliquez la règle du 50/30/20 (50% besoins, 30% envies, 20% épargne)",
          "Diversifiez vos investissements entre liquidités et placements long terme",
          "Revoyez vos abonnements mensuels et résiliez ceux non utilisés",
          "Négociez vos contrats d'assurance pour réduire vos charges fixes"
        ],
        optimisationFiscale: `Explorez les dispositifs d'épargne défiscalisée français : PER (Plan Épargne Retraite) pour réduire vos impôts, PEA (Plan d'Épargne en Actions) pour investir en bourse sans fiscalité après 5 ans, et Assurance Vie pour transmettre votre patrimoine. Avec un revenu de ${formaterMontant(totalRevenusMensuel * 12)}/an, vous pourriez économiser jusqu'à ${formaterMontant(totalRevenusMensuel * 12 * 0.11)} d'impôts par an.`
      }
      setAnalyse(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500'
    if (score >= 50) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500'
    if (score >= 50) return 'from-amber-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={cn("text-4xl font-bold mb-2", currentTheme.colors.text)}>
            Analyse IA
          </h1>
          <p className={cn("text-lg", currentTheme.colors.subtext)}>
            Obtenez des insights personnalisés sur votre situation financière
          </p>
        </div>
        
        <Button 
          onClick={handleAnalyse}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              {analyse ? 'Nouvelle Analyse' : 'Lancer l\'Analyse'}
            </>
          )}
        </Button>
      </div>

      {/* Info Message when auto-started */}
      {searchParams.get('autostart') === 'true' && isLoading && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <CardContent className="p-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
            <p className="text-blue-800 dark:text-blue-200">Analyse IA en cours de génération...</p>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-amber-800 dark:text-amber-200">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* No Analysis State */}
      {!analyse && !isLoading && (
        <Card className={cn(
          "relative overflow-hidden border-none",
          currentTheme.isDark 
            ? "bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" 
            : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 pointer-events-none" />
          
          <CardContent className="p-12 text-center relative z-10">
            <div className="inline-flex p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl mb-6">
              <Brain className={cn("w-24 h-24", currentTheme.isDark ? "text-purple-400" : "text-purple-500")} />
            </div>
            
            <h2 className={cn("text-3xl font-bold mb-4", currentTheme.colors.text)}>
              Intelligence Artificielle Financière
            </h2>
            
            <p className={cn("text-lg mb-8 max-w-2xl mx-auto", currentTheme.colors.subtext)}>
              Notre IA analyse votre situation financière complète et vous propose des recommandations personnalisées pour optimiser votre patrimoine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className={cn("p-6 rounded-xl", currentTheme.isDark ? "bg-slate-800/50" : "bg-white/50")}>
                <Zap className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <h3 className={cn("font-bold mb-2", currentTheme.colors.text)}>Analyse Instantanée</h3>
                <p className={cn("text-sm", currentTheme.colors.subtext)}>Résultats en quelques secondes</p>
              </div>
              
              <div className={cn("p-6 rounded-xl", currentTheme.isDark ? "bg-slate-800/50" : "bg-white/50")}>
                <Target className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                <h3 className={cn("font-bold mb-2", currentTheme.colors.text)}>100% Personnalisé</h3>
                <p className={cn("text-sm", currentTheme.colors.subtext)}>Adapté à votre situation</p>
              </div>
              
              <div className={cn("p-6 rounded-xl", currentTheme.isDark ? "bg-slate-800/50" : "bg-white/50")}>
                <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className={cn("font-bold mb-2", currentTheme.colors.text)}>+50 XP</h3>
                <p className={cn("text-sm", currentTheme.colors.subtext)}>Gagnez des points à chaque analyse</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analyse && (
        <div className="space-y-6">
          {/* Score Card */}
          <Card className={cn("relative overflow-hidden border-none", currentTheme.isDark ? "bg-slate-800/50" : "bg-white")}>
            <div className={`absolute inset-0 bg-gradient-to-br ${getScoreGradient(analyse.score)} opacity-5`} />
            <CardContent className="p-8 text-center relative z-10">
              <h2 className={cn("text-2xl font-bold mb-4", currentTheme.colors.text)}>Votre Score Financier</h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <p className={`text-8xl font-black ${getScoreColor(analyse.score)}`}>
                  {isNaN(analyse.score) ? 0 : analyse.score}
                </p>
                <span className={cn("text-4xl font-bold", currentTheme.colors.subtext)}>/100</span>
              </div>
              <p className={cn("text-lg max-w-2xl mx-auto", currentTheme.colors.subtext)}>
                {analyse.resume}
              </p>
            </CardContent>
          </Card>

          {/* Points Forts & Faibles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={cn("border-none", currentTheme.isDark ? "bg-emerald-900/20" : "bg-emerald-50")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  Points Forts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analyse.pointsForts.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className={currentTheme.colors.text}>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className={cn("border-none", currentTheme.isDark ? "bg-red-900/20" : "bg-red-50")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </div>
                  À Améliorer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analyse.pointsFaibles.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      <span className={currentTheme.colors.text}>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommandations */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Trophy className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className={cn("text-3xl font-bold", currentTheme.colors.text)}>
                Recommandations Prioritaires
              </h3>
            </div>
            
            <div className="space-y-4">
              {analyse.recommandationsPrioritaires.sort((a, b) => a.priorite - b.priorite).map((rec, i) => (
                <Card key={i} className={cn("group relative overflow-hidden border-none", currentTheme.isDark ? "bg-slate-800/50" : "bg-white")}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start gap-4">
                      <Badge className="bg-purple-600 text-white font-bold text-lg px-3 py-1 flex-shrink-0">
                        #{rec.priorite}
                      </Badge>
                      <div className="flex-1">
                        <h4 className={cn("font-bold text-xl mb-2", currentTheme.colors.text)}>
                          {rec.titre}
                        </h4>
                        <p className={cn("mb-4", currentTheme.colors.subtext)}>
                          {rec.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            💰 Économie: {rec.economie}
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            ⏱️ Délai: {rec.delai}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Conseils Expert */}
          <Card className={cn("border-none", currentTheme.isDark ? "bg-amber-900/20" : "bg-amber-50")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                </div>
                Conseils d'Expert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analyse.conseilsExpert.map((conseil, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className={currentTheme.colors.text}>{conseil}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Optimisation Fiscale */}
          <Card className={cn("border-none", currentTheme.isDark ? "bg-cyan-900/20" : "bg-cyan-50")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-cyan-500" />
                </div>
                Optimisation Fiscale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn("leading-relaxed", currentTheme.colors.text)}>
                {analyse.optimisationFiscale}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}