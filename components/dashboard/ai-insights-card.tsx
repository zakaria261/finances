"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  XCircle,
  Trophy,
  ArrowRight,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/ThemeContext'

export function AiInsightsCard() {
  const { currentTheme } = useTheme()
  const router = useRouter()

  // Redirection vers la page d'analyse avec auto-start
  const handleLaunchAnalysis = () => {
    router.push('/analyse-ia?autostart=true')
  }

  return (
    <Card className={cn(
      "relative overflow-hidden border-none bg-gradient-to-br",
      currentTheme.isDark 
        ? "from-purple-900/20 via-pink-900/20 to-blue-900/20" 
        : "from-purple-50 via-pink-50 to-blue-50"
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 pointer-events-none" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl shadow-lg",
            currentTheme.isDark 
              ? "bg-gradient-to-br from-purple-600 to-pink-600" 
              : "bg-gradient-to-br from-purple-500 to-pink-500"
          )}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className={cn("text-lg font-bold", currentTheme.colors.text)}>
              Analyse IA
            </div>
            <div className={cn("text-sm font-normal", currentTheme.colors.subtext)}>
              Insights personnalisés
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <div className={cn("text-center py-8", currentTheme.colors.subtext)}>
          <div className="inline-flex p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl mb-4">
            <Sparkles className={cn("w-16 h-16", currentTheme.isDark ? "text-purple-400" : "text-purple-500")} />
          </div>
          <p className="text-sm mb-6 max-w-xs mx-auto">
            Obtenez une analyse complète de votre situation financière avec des recommandations personnalisées
          </p>
        </div>

        <Button 
          onClick={handleLaunchAnalysis}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Lancer l'Analyse IA
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-500" />
            <span>Instantané</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Personnalisé</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-500" />
            <span>+50 XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}