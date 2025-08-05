export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  avatar?: string;
  role: string;
  createdAt: string;
  permission?: {
    canAccessDashboard: boolean;
  };
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  industry: string;
  location: string;
  linkedinUrl: string;
  status: 'active' | 'contacted' | 'converted';
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  type: 'scraping' | 'filtering' | 'export';
  status: 'completed' | 'running' | 'failed';
  description: string;
  results?: number;
  createdAt: string;
  completedAt?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  progress: number;
  startTime?: string;
  endTime?: string;
  error?: string;
}

export interface LeadFilter {
  company?: string;
  industry?: string;
  location?: string;
  position?: string;
  experience?: string;
}
