import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function GET() {
  try {
    // Simulate AI insights - in a real implementation, this would use the ZAI SDK
    const insights = [
      {
        id: 1,
        type: 'performance',
        message: 'System performance optimized by 23% in the last hour',
        timestamp: '2 minutes ago',
        severity: 'info',
        action: 'auto_optimization'
      },
      {
        id: 2,
        type: 'security',
        message: 'Detected and blocked 3 suspicious login attempts',
        timestamp: '15 minutes ago',
        severity: 'warning',
        action: 'threat_blocked'
      },
      {
        id: 3,
        type: 'automation',
        message: 'Auto-scaled resources based on predicted load increase',
        timestamp: '1 hour ago',
        severity: 'success',
        action: 'auto_scaling'
      },
      {
        id: 4,
        type: 'cost',
        message: 'AI cost optimization saved $2,347 this month',
        timestamp: '3 hours ago',
        severity: 'success',
        action: 'cost_saving'
      },
      {
        id: 5,
        type: 'user_behavior',
        message: 'Detected unusual user activity pattern - investigating',
        timestamp: '5 hours ago',
        severity: 'warning',
        action: 'investigation'
      }
    ]

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error fetching AI insights:', error)
    return NextResponse.json({ error: 'Failed to fetch AI insights' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { prompt, context } = await request.json()
    
    // In a real implementation, this would use the ZAI SDK to generate insights
    const zai = await ZAI.create()
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI system analyst for OrbitOS. Analyze the provided system data and generate actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const insight = {
      id: Date.now(),
      type: 'generated',
      message: completion.choices[0]?.message?.content || 'No insight generated',
      timestamp: 'Just now',
      severity: 'info',
      action: 'ai_generated'
    }

    return NextResponse.json(insight)
  } catch (error) {
    console.error('Error generating AI insight:', error)
    return NextResponse.json({ error: 'Failed to generate AI insight' }, { status: 500 })
  }
}