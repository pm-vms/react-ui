import React from 'react';
import { Plus, Download, BarChart3, Filter, History, Settings } from 'lucide-react';

interface QuickActionsProps {
  onStartCampaign: () => void;
  onExportData: () => void;
  onViewAnalytics: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onStartCampaign,
  onExportData,
  onViewAnalytics
}) => {
  const actions = [
    {
      title: 'Start New Campaign',
      description: 'Create a new lead generation campaign',
      icon: Plus,
      onClick: onStartCampaign,
      primary: true,
      color: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
    },
    {
      title: 'Export Lead Data',
      description: 'Download your leads as CSV or Excel',
      icon: Download,
      onClick: onExportData,
      primary: false,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    },
    {
      title: 'View Analytics',
      description: 'Analyze your lead generation performance',
      icon: BarChart3,
      onClick: onViewAnalytics,
      primary: false,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    }
  ];

  const quickLinks = [
    { title: 'Lead Filters', icon: Filter, href: '/lead-filters' },
    { title: 'History', icon: History, href: '/history' },
    { title: 'Settings', icon: Settings, href: '/settings' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Plus className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-full group relative overflow-hidden rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 ${
                action.primary 
                  ? `bg-gradient-to-r ${action.color} text-white shadow-lg` 
                  : `${action.color} border border-gray-200`
              }`}
            >
              <div className="flex items-center space-x-4 p-4">
                <div className={`p-3 rounded-lg ${
                  action.primary 
                    ? 'bg-white/20' 
                    : 'bg-gray-200'
                }`}>
                  <action.icon className={`w-6 h-6 ${
                    action.primary ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-semibold ${
                    action.primary ? 'text-white' : 'text-gray-900'
                  }`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${
                    action.primary ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {action.description}
                  </p>
                </div>
              </div>
              
              {action.primary && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex items-center space-x-3 p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};