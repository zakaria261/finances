"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import type { AnalyseIA } from '@/types/analyse'

interface ScoreWidgetProps {
  analyse: AnalyseIA | null
  onAnalyse?: () => void
  showButton?: boolean
}

export function ScoreWidget({ analyse, onAnalyse, showButton = true }: ScoreWidgetProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500'
    if (score >= 50) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreTrend = (score: number) => {
    if (score >= 80) return { icon: TrendingUp, color: 'text-emerald-500', text: 'Excellent' }
    if (score >= 50) return { icon: TrendingUp, color: 'text-amber-500', text: 'Good' }
    return { icon: TrendingDown, color: 'text-red-500', text: 'Needs Attention' }
  }

  if (!analyse) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-pink-500/10 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Not available yet</p>
              </div>
            </div>
          </div>
          
          {showButton && (
            <Button 
              onClick={onAnalyse}
              size="sm"
              className="w-full bg-gradient-to-r from-primary to-pink-600 hover:shadow-lg hover:scale-105 transition-all"
            >
              Launch Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const trend = getScoreTrend(analyse.score)

  return (
    <Link href="/dashboard/analyse">
      <Card className="bg-gradient-to-br from-background/50 to-primary/5 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all hover:-translate-y-1 group cursor-pointer overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Financial Score</h3>
                <div className="flex items-center gap-2 text-sm">
                  <trend.icon className={`w-4 h-4 ${trend.color}`} />
                  <span className={trend.color}>{trend.text}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`text-5xl font-black ${getScoreColor(analyse.score)}`}>
                {analyse.score}
              </p>
              <p className="text-sm text-muted-foreground">/100</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Strengths</p>
              <p className="font-bold text-emerald-500">{analyse.pointsForts.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">To Improve</p>
              <p className="font-bold text-amber-500">{analyse.pointsFaibles.length}</p>
            </div>
          </div>

          {/* View Details Link */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground">View full analysis</span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}