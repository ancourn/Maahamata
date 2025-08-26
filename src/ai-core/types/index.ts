export interface AIResponse {
  reply: string;
  data?: any;
  confidence?: number;
  timestamp: string;
}

export interface EmailTriageResult {
  category: 'Priority' | 'Follow-Up' | 'Promo' | 'Noise' | 'Action-Required';
  summary: string;
  suggested_action: string;
  urgency: number;
}

export interface SearchResult {
  results: Array<{
    id: string;
    title: string;
    content: string;
    relevance: number;
    type: 'document' | 'email' | 'calendar' | 'task';
  }>;
  query: string;
  timestamp: string;
}

export interface CalendarResult {
  events: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    attendees: string[];
    location?: string;
  }>;
  suggestions?: Array<{
    title: string;
    start: Date;
    end: Date;
    confidence: number;
  }>;
  timestamp: string;
}

export interface AgentContext {
  userId?: string;
  recentEmails?: number;
  calendarEvents?: number;
  timezone?: string;
  preferences?: Record<string, any>;
}