import React, { useState } from 'react';
import { Play, Pause, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

const workflowSteps = [
  {
    id: 1,
    name: 'Initialize Scraper',
    description: 'Setting up LinkedIn scraper with provided credentials',
    status: 'completed',
    progress: 100,
    startTime: '2024-01-15 10:30:00',
    endTime: '2024-01-15 10:30:15',
    duration: '15s'
  },
  {
    id: 2,
    name: 'Apply Filters',
    description: 'Filtering leads based on: Technology, San Francisco, Marketing Manager',
    status: 'completed',
    progress: 100,
    startTime: '2024-01-15 10:30:15',
    endTime: '2024-01-15 10:30:30',
    duration: '15s'
  },
  {
    id: 3,
    name: 'Extract Lead Data',
    description: 'Scraping LinkedIn profiles and company information',
    status: 'running',
    progress: 68,
    startTime: '2024-01-15 10:30:30',
    duration: '45m'
  },
  {
    id: 4,
    name: 'Validate Data',
    description: 'Checking data quality and removing duplicates',
    status: 'pending',
    progress: 0
  },
  {
    id: 5,
    name: 'Export Results',
    description: 'Generating CSV file with lead data',
    status: 'pending',
    progress: 0
  }
];

const recentWorkflows = [
  {
    id: 1,
    name: 'Healthcare Leads - Boston',
    status: 'completed',
    progress: 100,
    leads: 1247,
    startTime: '2024-01-14 09:15:00',
    endTime: '2024-01-14 10:30:00',
    duration: '1h 15m'
  },
  {
    id: 2,
    name: 'Tech Startups - NYC',
    status: 'failed',
    progress: 32,
    leads: 0,
    startTime: '2024-01-14 08:00:00',
    endTime: '2024-01-14 08:45:00',
    duration: '45m',
    error: 'Rate limit exceeded'
  },
  {
    id: 3,
    name: 'Finance Companies - Chicago',
    status: 'completed',
    progress: 100,
    leads: 892,
    startTime: '2024-01-13 14:20:00',
    endTime: '2024-01-13 15:10:00',
    duration: '50m'
  }
];

const WorkflowPage: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Monitor</h1>
        <p className="text-gray-600">Track the progress of your lead generation workflows</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Current Workflow */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Current Workflow</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Pause className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {workflowSteps.map((step) => (
                <div key={step.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{step.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(step.status)}`}>
                        {step.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    
                    {step.status === 'running' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{step.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {step.startTime && (
                        <span>Started: {new Date(step.startTime).toLocaleTimeString()}</span>
                      )}
                      {step.endTime && (
                        <span>Ended: {new Date(step.endTime).toLocaleTimeString()}</span>
                      )}
                      {step.duration && (
                        <span>Duration: {step.duration}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Workflows */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Workflows</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentWorkflows.map((workflow) => (
                <div 
                  key={workflow.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedWorkflow === workflow.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedWorkflow(workflow.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{workflow.name}</h3>
                    {getStatusIcon(workflow.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Leads:</span> {workflow.leads}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {workflow.duration}
                    </div>
                  </div>
                  
                  {workflow.error && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      Error: {workflow.error}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          workflow.status === 'completed' ? 'bg-green-600' : 
                          workflow.status === 'failed' ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {recentWorkflows.filter(w => w.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {recentWorkflows.filter(w => w.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">52m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WorkflowPage;
