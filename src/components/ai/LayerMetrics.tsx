'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Layers, RefreshCw, Smartphone, Globe, Network, Cpu, Database, Shield, Zap, Settings } from 'lucide-react'

interface LayerMetric {
  name: string
  status: string
  health: number
  description: string
  metrics: Record<string, any>
  technologies: string[]
}

export default function LayerMetrics() {
  const [layerMetrics, setLayerMetrics] = useState<LayerMetric[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLayerMetrics()
  }, [])

  const fetchLayerMetrics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/layers/metrics')
      if (response.ok) {
        const data = await response.json()
        setLayerMetrics(data)
      }
    } catch (error) {
      console.error('Error fetching layer metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLayerIcon = (name: string) => {
    if (name.includes('Client')) return Smartphone
    if (name.includes('Edge')) return Globe
    if (name.includes('API') || name.includes('Gateway')) return Network
    if (name.includes('App Logic') || name.includes('AI')) return Cpu
    if (name.includes('Data')) return Database
    if (name.includes('Security')) return Shield
    if (name.includes('Automation')) return Zap
    if (name.includes('DevOps') || name.includes('Deployment')) return Settings
    return Layers
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'warning': return 'secondary'
      case 'error': return 'destructive'
      default: return 'outline'
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600'
    if (health >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const layerCategories = {
    frontend: ['Client Layer'],
    infrastructure: ['Edge Layer', 'API Gateway', 'App Logic'],
    ai: ['AI Core', 'Semantic Engine'],
    data: ['Data Layer', 'Sync Engine'],
    security: ['Security Layer'],
    operations: ['Automation Engine', 'DevOps & Observability', 'Deployment', 'AI Training Pipeline', 'Built-in Tools']
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          System Layer Metrics
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLayerMetrics}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Comprehensive monitoring of all 14 OrbitOS system layers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="ai">AI Core</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {layerMetrics.slice(0, 6).map((layer) => {
                const IconComponent = getLayerIcon(layer.name)
                return (
                  <div key={layer.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <h3 className="font-semibold text-sm">{layer.name}</h3>
                      </div>
                      <Badge variant={getStatusColor(layer.status) as any}>
                        {layer.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Health</span>
                        <span className={`text-sm font-bold ${getHealthColor(layer.health)}`}>
                          {layer.health}%
                        </span>
                      </div>
                      <Progress value={layer.health} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {Object.entries(layerCategories).map(([category, layers]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {layerMetrics
                  .filter(layer => layers.includes(layer.name))
                  .map((layer) => {
                    const IconComponent = getLayerIcon(layer.name)
                    return (
                      <div key={layer.name} className="p-6 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-6 h-6" />
                            <div>
                              <h3 className="font-semibold">{layer.name}</h3>
                              <p className="text-sm text-muted-foreground">{layer.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusColor(layer.status) as any}>
                              {layer.status}
                            </Badge>
                            <div className={`text-lg font-bold ${getHealthColor(layer.health)}`}>
                              {layer.health}%
                            </div>
                          </div>
                        </div>

                        <Progress value={layer.health} className="h-3" />

                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Key Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(layer.metrics).slice(0, 4).map(([key, value]) => (
                              <div key={key} className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                <div className="text-xs text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="font-semibold text-sm">
                                  {typeof value === 'number' ? `${value}%` : value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Technologies</h4>
                          <div className="flex flex-wrap gap-1">
                            {layer.technologies.slice(0, 4).map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {layer.technologies.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{layer.technologies.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}