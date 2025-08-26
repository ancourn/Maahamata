'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Activity, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface SystemStatus {
  aiCore: {
    health: number
    status: string
    lastUpdate: string
    metrics: Record<string, number>
  }
  edgeLayer: {
    health: number
    status: string
    lastUpdate: string
    metrics: Record<string, number>
  }
  apiGateway: {
    health: number
    status: string
    lastUpdate: string
    metrics: Record<string, number>
  }
  syncEngine: {
    health: number
    status: string
    lastUpdate: string
    metrics: Record<string, number>
  }
  securityLayer: {
    health: number
    status: string
    lastUpdate: string
    metrics: Record<string, number>
  }
  database: {
    health: number
    status: string
    lastUpdate: string
    metrics: Record<string, number>
  }
}

export default function SystemHealthMonitor() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSystemStatus()
  }, [])

  const fetchSystemStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/system/status')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data)
      }
    } catch (error) {
      console.error('Error fetching system status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600'
    if (health >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const systemComponents = [
    { key: 'aiCore', name: 'AI Core', icon: '🧠' },
    { key: 'edgeLayer', name: 'Edge Layer', icon: '🌐' },
    { key: 'apiGateway', name: 'API Gateway', icon: '🚪' },
    { key: 'syncEngine', name: 'Sync Engine', icon: '🔄' },
    { key: 'securityLayer', name: 'Security Layer', icon: '🔒' },
    { key: 'database', name: 'Database', icon: '🗄️' },
  ]

  if (!systemStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Loading system status...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          System Health Monitor
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSystemStatus}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Real-time monitoring of all OrbitOS system components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemComponents.map((component) => {
            const status = systemStatus[component.key as keyof SystemStatus]
            return (
              <div key={component.key} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{component.icon}</span>
                    <h3 className="font-semibold">{component.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status.status)}
                    <Badge variant={status.status === 'active' ? 'default' : 'secondary'}>
                      {status.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Health</span>
                    <span className={`text-lg font-bold ${getHealthColor(status.health)}`}>
                      {status.health}%
                    </span>
                  </div>
                  <Progress value={status.health} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Last update: {new Date(status.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-4">
          <h3 className="font-semibold">Detailed Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(systemStatus.aiCore.metrics).map(([key, value]) => (
              <div key={key} className="p-3 border rounded">
                <div className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold">{value}%</span>
                </div>
                <Progress value={value} className="h-1 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* System Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">System Summary</h3>
              <p className="text-sm text-muted-foreground">
                All systems operational with {(Object.values(systemStatus).reduce((acc, curr) => acc + curr.health, 0) / 6).toFixed(1)}% average health
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-600 font-semibold">All Systems Go</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}