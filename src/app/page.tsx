'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  Shield, 
  Zap, 
  Database, 
  Globe, 
  Layers, 
  Network, 
  Lock,
  Activity,
  BarChart3,
  Settings,
  Bell,
  Search,
  MessageSquare,
  Calendar,
  Users,
  FileText,
  Cpu,
  Cloud,
  Server,
  Code,
  Smartphone,
  Monitor
} from 'lucide-react'
import AIInsightsPanel from '@/components/ai/AIInsightsPanel'
import SystemHealthMonitor from '@/components/ai/SystemHealthMonitor'
import LayerMetrics from '@/components/ai/LayerMetrics'
import { AICopilot } from '@/components/AICopilot'
import { SmartInbox } from '@/components/SmartInbox'

export default function OrbitOSDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [systemStatus, setSystemStatus] = useState({
    aiCore: 98,
    edgeLayer: 95,
    apiGateway: 99,
    syncEngine: 97,
    securityLayer: 100,
    database: 96
  })

  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      type: 'performance',
      message: 'System performance optimized by 23% in the last hour',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      type: 'security',
      message: 'Detected and blocked 3 suspicious login attempts',
      timestamp: '15 minutes ago'
    },
    {
      id: 3,
      type: 'automation',
      message: 'Auto-scaled resources based on predicted load increase',
      timestamp: '1 hour ago'
    }
  ])

  const [layerMetrics, setLayerMetrics] = useState([
    { name: 'Client Layer', status: 'active', health: 99, icon: Smartphone },
    { name: 'Edge Layer', status: 'active', health: 95, icon: Globe },
    { name: 'API Gateway', status: 'active', health: 99, icon: Network },
    { name: 'App Logic', status: 'active', health: 97, icon: Cpu },
    { name: 'AI Core', status: 'active', health: 98, icon: Brain },
    { name: 'Data Layer', status: 'active', health: 96, icon: Database },
    { name: 'Sync Engine', status: 'active', health: 97, icon: Activity },
    { name: 'Security', status: 'active', health: 100, icon: Shield },
    { name: 'Automation', status: 'active', health: 94, icon: Zap },
    { name: 'DevOps', status: 'active', health: 96, icon: Settings }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto flex gap-6 h-[calc(100vh-2rem)]">
        {/* Main Content */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">OrbitOS</h1>
                <p className="text-slate-600 dark:text-slate-400">Full-Stack Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                System Online
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Main Dashboard */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="layers">System Layers</TabsTrigger>
              <TabsTrigger value="ai-intelligence">AI Intelligence</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AI Components Integration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemHealthMonitor />
              <AIInsightsPanel />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-xs text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">99.9%</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">2.3ms</p>
                      <p className="text-xs text-muted-foreground">Avg Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">47TB</p>
                      <p className="text-xs text-muted-foreground">Data Processed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Architecture Overview */}
            <Card>
              <CardHeader>
                <CardTitle>System Architecture Overview</CardTitle>
                <CardDescription>
                  Complete full-stack deployment across 14 intelligent layers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Frontend Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">React + WASM</Badge>
                      <Badge variant="outline">Tauri (Desktop)</Badge>
                      <Badge variant="outline">React Native</Badge>
                      <Badge variant="outline">PWA</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Backend Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Rust (Axum)</Badge>
                      <Badge variant="outline">Python (FastAPI)</Badge>
                      <Badge variant="outline">PostgreSQL</Badge>
                      <Badge variant="outline">Weaviate</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layers" className="space-y-6">
            <LayerMetrics />
          </TabsContent>

          <TabsContent value="ai-intelligence" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Core Capabilities</CardTitle>
                  <CardDescription>
                    Intelligence integrated at every layer of the stack
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Predictive UI</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Edge AI Caching</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Smart Rate Limiting</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-scaling Prediction</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Semantic Search</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conflict Prediction</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Training Pipeline</CardTitle>
                  <CardDescription>
                    Continuous improvement through user feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Model Fine-tuning</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>User Feedback Loop</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>RAG Performance</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Agent Orchestration</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <AIInsightsPanel />

            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Automation</CardTitle>
                <CardDescription>
                  Natural language workflows and intelligent automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <MessageSquare className="w-8 h-8 mb-2 text-blue-600" />
                    <h3 className="font-semibold">Email Sync Engine</h3>
                    <p className="text-sm text-muted-foreground">AI parsing at ingestion</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Calendar className="w-8 h-8 mb-2 text-green-600" />
                    <h3 className="font-semibold">Calendar Sync</h3>
                    <p className="text-sm text-muted-foreground">AI-mediated invites</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Search className="w-8 h-8 mb-2 text-purple-600" />
                    <h3 className="font-semibold">Semantic Search</h3>
                    <p className="text-sm text-muted-foreground">Understands context</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SmartInbox />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Posture</CardTitle>
                  <CardDescription>
                    Zero-trust architecture with post-quantum encryption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Data at Rest (AES-256 + PQ)</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data in Transit (TLS 1.3)</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Client-side Key Generation</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ABAC + AI Anomaly Detection</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Immutable Audit Trail</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                  <CardDescription>
                    Real-time security monitoring and threat detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-muted-foreground">Breaches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-muted-foreground">Threats Blocked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">100%</div>
                      <div className="text-sm text-muted-foreground">Encryption</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-sm text-muted-foreground">Anomalies Detected</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Security Architecture</CardTitle>
                <CardDescription>
                  Multi-layered security with AI-powered threat detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <h3 className="font-semibold">LibOQS</h3>
                    <p className="text-sm text-muted-foreground">Post-quantum crypto</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Zero-Knowledge Proofs</h3>
                    <p className="text-sm text-muted-foreground">Privacy-preserving</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Server className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">In-house Auth</h3>
                    <p className="text-sm text-muted-foreground">Full control</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">AI Detection</h3>
                    <p className="text-sm text-muted-foreground">Real-time analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
        
        {/* AI Copilot Sidebar */}
        <div className="w-80 h-full flex-shrink-0">
          <AICopilot />
        </div>
      </div>
    </div>
  )
}