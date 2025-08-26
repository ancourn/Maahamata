'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebSocketDemo from '@/components/websocket-demo';
import SmartInbox from '@/components/smart-inbox';
import { 
  Code, 
  Database, 
  Globe, 
  Palette, 
  Server, 
  Shield, 
  Zap, 
  MessageSquare,
  CheckCircle,
  Star,
  Users,
  Rocket,
  Mail,
  Brain,
  Bot
} from 'lucide-react';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  const features = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Next.js 15",
      description: "Latest React framework with App Router",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Tailwind CSS 4",
      description: "Utility-first CSS framework",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Prisma ORM",
      description: "Type-safe database operations",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "NextAuth.js",
      description: "Complete authentication solution",
      color: "bg-red-100 text-red-800"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Zustand",
      description: "Lightweight state management",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "Socket.IO",
      description: "Real-time WebSocket communication",
      color: "bg-indigo-100 text-indigo-800"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Email Triage",
      description: "Intelligent email categorization and prioritization",
      color: "bg-pink-100 text-pink-800"
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Gmail Integration",
      description: "Connect and sync with your Gmail account",
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const components = [
    "Accordion", "Alert", "Avatar", "Badge", "Button", "Card", "Chart", "Checkbox",
    "Dialog", "Dropdown", "Form", "Input", "Label", "Navigation", "Pagination",
    "Popover", "Progress", "Select", "Sheet", "Skeleton", "Slider", "Switch",
    "Table", "Tabs", "Toast", "Tooltip"
  ];

  const stats = [
    { label: "Components", value: "30+", icon: <Palette className="h-4 w-4" /> },
    { label: "Technologies", value: "15+", icon: <Code className="h-4 w-4" /> },
    { label: "Ready to Use", value: "100%", icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Production Ready", value: "✓", icon: <Rocket className="h-4 w-4" /> }
  ];

  useEffect(() => {
    // Simulate connection status
    setIsConnected(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <img
                src="/logo.svg"
                alt="Z.ai Logo"
                className="w-full h-full object-contain animate-pulse"
              />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Z.ai Code Scaffold
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Modern, production-ready web application scaffold powered by cutting-edge technologies, 
            designed to accelerate your development with AI-powered coding assistance.
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Star className="w-4 h-4 mr-1" />
              Next.js 15
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Star className="w-4 h-4 mr-1" />
              TypeScript 5
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Star className="w-4 h-4 mr-1" />
              Tailwind CSS 4
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <MessageSquare className="w-4 h-4 mr-1" />
              {isConnected ? 'Connected' : 'Connecting...'}
            </Badge>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button size="lg" className="px-8">
              <Rocket className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <Code className="mr-2 h-5 w-5" />
              View Docs
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Components Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">UI Components</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                shadcn/ui Component Library
              </CardTitle>
              <CardDescription>
                Complete set of accessible, high-quality components built on Radix UI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {components.map((component, index) => (
                  <Badge key={index} variant="outline" className="hover:bg-primary/5">
                    {component}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Interactive Features</h2>
          <Tabs defaultValue="websocket" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="websocket">WebSocket</TabsTrigger>
              <TabsTrigger value="smart-inbox">Smart Inbox</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
            </TabsList>
            
            <TabsContent value="websocket" className="mt-6">
              <WebSocketDemo />
            </TabsContent>
            
            <TabsContent value="smart-inbox" className="mt-6">
              <SmartInbox />
            </TabsContent>
            
            <TabsContent value="database" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Ready
                  </CardTitle>
                  <CardDescription>
                    Prisma ORM with SQLite for rapid development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Database models: User, Post (with sample data)
                    </p>
                    <div className="space-y-2">
                      <code className="block bg-muted px-3 py-2 rounded text-sm">
                        User: id, email, name, createdAt, updatedAt
                      </code>
                      <code className="block bg-muted px-3 py-2 rounded text-sm">
                        Post: id, title, content, published, authorId, createdAt, updatedAt
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">SQLite</Badge>
                      <Badge variant="outline">Prisma</Badge>
                      <Badge variant="outline">Type-safe</Badge>
                      <Badge variant="outline">Seeded</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    API Endpoints
                  </CardTitle>
                  <CardDescription>
                    RESTful API with Next.js App Router
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <code className="block bg-muted px-3 py-2 rounded text-sm">
                        GET /api/health - Health check
                      </code>
                      <code className="block bg-muted px-3 py-2 rounded text-sm">
                        GET /api/users - List all users
                      </code>
                      <code className="block bg-muted px-3 py-2 rounded text-sm">
                        POST /api/users - Create new user
                      </code>
                      <code className="block bg-muted px-3 py-2 rounded text-sm">
                        GET /api/posts - List all posts with authors
                      </code>
                      <code className="block bg-muted px-3 py-2 rounded text-sm">
                        POST /api/posts - Create new post
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">RESTful</Badge>
                      <Badge variant="outline">JSON</Badge>
                      <Badge variant="outline">Type-safe</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="auth" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication
                  </CardTitle>
                  <CardDescription>
                    NextAuth.js for secure authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ready to configure authentication providers
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">NextAuth.js</Badge>
                      <Badge variant="outline">JWT</Badge>
                      <Badge variant="outline">OAuth</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building with AI-powered development assistance from Z.ai
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="px-8">
                  <Users className="mr-2 h-5 w-5" />
                  Get Started with Z.ai
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  <Code className="mr-2 h-5 w-5" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}