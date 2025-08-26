'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Brain, Sparkles, RefreshCw, Send } from 'lucide-react'

interface AIInsight {
  id: number
  type: string
  message: string
  timestamp: string
  severity: string
  action: string
}

export default function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/insights')
      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateInsight = async () => {
    if (!prompt.trim()) return

    setGenerating(true)
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          context: 'OrbitOS system analysis'
        }),
      })

      if (response.ok) {
        const newInsight = await response.json()
        setInsights(prev => [newInsight, ...prev])
        setPrompt('')
      }
    } catch (error) {
      console.error('Error generating AI insight:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'warning': return 'default'
      case 'success': return 'default'
      default: return 'secondary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return '🚀'
      case 'security': return '🔒'
      case 'automation': return '⚡'
      case 'cost': return '💰'
      case 'user_behavior': return '👥'
      case 'generated': return '🤖'
      default: return 'ℹ️'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI-Powered Insights
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInsights}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Real-time intelligence and automated recommendations from OrbitOS AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Generator */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask OrbitOS AI to analyze system data and generate insights..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              onClick={generateInsight}
              disabled={generating || !prompt.trim()}
              className="self-start"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {insights.map((insight) => (
            <Alert 
              key={insight.id} 
              className={`border-l-4 ${
                insight.severity === 'critical' ? 'border-l-red-500' :
                insight.severity === 'warning' ? 'border-l-yellow-500' :
                insight.severity === 'success' ? 'border-l-green-500' :
                'border-l-blue-500'
              }`}
            >
              <AlertDescription className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getTypeIcon(insight.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm">{insight.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getSeverityColor(insight.severity) as any}>
                          {insight.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {insight.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>

        {insights.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No AI insights available yet.</p>
            <p className="text-sm">Generate insights by asking questions above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}