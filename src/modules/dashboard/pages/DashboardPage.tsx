import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Database, Activity, AlertCircle } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { QuickActions } from '../components/QuickActions';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';

const defaultStats = [
  { title: 'Total Leads', value: '12,847', change: '+12%', changeType: 'increase' as const, icon: Users, color: 'blue' as const },
  { title: 'Conversion Rate', value: '24.7%', change: '+2.3%', changeType: 'increase' as const, icon: TrendingUp, color: 'green' as const },
  { title: 'Active Campaigns', value: '8', change: '-1', changeType: 'decrease' as const, icon: Activity, color: 'purple' as const },
  { title: 'Data Points', value: '2.4M', change: '+180K', changeType: 'increase' as const, icon: Database, color: 'yellow' as const },
];

const defaultActivity = [
  { id: 1, action: 'Lead scraping completed', target: 'Tech Companies - SF', time: '2 minutes ago', status: 'success' as const },
  { id: 2, action: 'New filter applied', target: 'Marketing Managers', time: '15 minutes ago', status: 'info' as const },
  { id: 3, action: 'Export generated', target: '1,247 leads', time: '1 hour ago', status: 'success' as const },
  { id: 4, action: 'Scraping failed', target: 'Healthcare - NY', time: '2 hours ago', status: 'error' as const },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);
  const [recentActivity, setRecentActivity] = useState(defaultActivity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard stats
      const statsResponse = await apiService.getDashboardStats();
      if (statsResponse.success && statsResponse.data) {
        // Transform API data to match our stats format
        const apiStats = statsResponse.data;
        setStats([
          { 
            title: 'Total Leads', 
            value: apiStats.totalLeads?.toLocaleString() || '0', 
            change: apiStats.leadsChange || '0%', 
            changeType: apiStats.leadsChange?.startsWith('+') ? 'increase' : 'decrease',
            icon: Users, 
            color: 'blue' as const 
          },
          { 
            title: 'Conversion Rate', 
            value: `${apiStats.conversionRate || 0}%`, 
            change: apiStats.conversionChange || '0%', 
            changeType: apiStats.conversionChange?.startsWith('+') ? 'increase' : 'decrease',
            icon: TrendingUp, 
            color: 'green' as const 
          },
          { 
            title: 'Active Campaigns', 
            value: apiStats.activeCampaigns?.toString() || '0', 
            change: apiStats.campaignsChange || '0', 
            changeType: apiStats.campaignsChange?.startsWith('+') ? 'increase' : 'decrease',
            icon: Activity, 
            color: 'purple' as const 
          },
          { 
            title: 'Data Points', 
            value: formatLargeNumber(apiStats.dataPoints || 0), 
            change: formatLargeNumber(apiStats.dataPointsChange || 0), 
            changeType: (apiStats.dataPointsChange || 0) >= 0 ? 'increase' : 'decrease',
            icon: Database, 
            color: 'yellow' as const 
          },
        ]);
      }

      // Load recent activity
      const activityResponse = await apiService.getRecentActivity(5);
      if (activityResponse.success && activityResponse.data) {
        setRecentActivity(activityResponse.data);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Using default values.');
    } finally {
      setLoading(false);
    }
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleStartCampaign = () => {
    navigate('/lead-filters');
  };

  const handleExportData = () => {
    navigate('/lead-data');
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics page or show analytics modal
    console.log('View analytics');
  };

  const handleRefreshData = () => {
    loadDashboardData();
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's what's happening with your leads.</p>
        </div>
        <button
          onClick={handleRefreshData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">Notice</h3>
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={`${stat.title}-${index}`} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivity} />
        </div>

        <QuickActions
          onStartCampaign={handleStartCampaign}
          onExportData={handleExportData}
          onViewAnalytics={handleViewAnalytics}
        />
      </div>

      {/* Additional Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Lead Generation Trends</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              {/* <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" /> */}
              <p className="text-gray-500">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        {/* Top Performing Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Filters</h3>
          <div className="space-y-4">
            {[
              { name: 'Tech Companies - SF', leads: 1247, success: 89 },
              { name: 'Marketing Managers', leads: 892, success: 76 },
              { name: 'Healthcare - Boston', leads: 654, success: 82 },
              { name: 'Finance - NYC', leads: 543, success: 71 }
            ].map((filter, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{filter.name}</p>
                  <p className="text-sm text-gray-500">{filter.leads} leads generated</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{filter.success}%</p>
                  <p className="text-xs text-gray-500">success rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
