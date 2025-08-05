import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Download, Eye } from 'lucide-react';

const historyData = [
  {
    id: 1,
    type: 'scraping',
    description: 'LinkedIn scraping - Tech Companies in San Francisco',
    status: 'completed',
    results: 1247,
    startTime: '2024-01-15 10:30 AM',
    endTime: '2024-01-15 11:45 AM',
    duration: '1h 15m'
  },
  {
    id: 2,
    type: 'filtering',
    description: 'Applied filters: Marketing Managers, 50-200 employees',
    status: 'completed',
    results: 892,
    startTime: '2024-01-15 09:15 AM',
    endTime: '2024-01-15 09:20 AM',
    duration: '5m'
  },
  {
    id: 3,
    type: 'export',
    description: 'CSV Export - Healthcare leads New York',
    status: 'completed',
    results: 2156,
    startTime: '2024-01-14 03:22 PM',
    endTime: '2024-01-14 03:25 PM',
    duration: '3m'
  },
  {
    id: 4,
    type: 'scraping',
    description: 'LinkedIn scraping - Healthcare Companies in Boston',
    status: 'failed',
    results: 0,
    startTime: '2024-01-14 02:10 PM',
    endTime: '2024-01-14 02:15 PM',
    duration: '5m',
    error: 'Rate limit exceeded'
  },
  {
    id: 5,
    type: 'scraping',
    description: 'LinkedIn scraping - Finance Companies in Chicago',
    status: 'running',
    results: 524,
    startTime: '2024-01-15 11:00 AM',
    duration: '45m'
  }
];

const HistoryPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'running' | 'failed'>('all');

  const filteredData = historyData.filter(item => 
    filter === 'all' || item.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      running: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">History</h1>
        <p className="text-gray-600">Track all your lead generation activities and results</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {['all', 'completed', 'running', 'failed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Activity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Results</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Duration</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Start Time</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      {item.error && (
                        <p className="text-xs text-red-600 mt-1">Error: {item.error}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900 font-medium">
                      {item.results.toLocaleString()}
                      {item.status === 'running' && ' (ongoing)'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{item.duration}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{item.startTime}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {item.status === 'completed' && (
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyData.filter(item => item.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Running</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyData.filter(item => item.status === 'running').length}
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
                {historyData.filter(item => item.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {historyData.reduce((sum, item) => sum + item.results, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HistoryPage;
