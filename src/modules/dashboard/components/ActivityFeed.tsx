import React from 'react';
import { Clock, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ActivityItem {
  id: number;
  action: string;
  target: string;
  time: string;
  status: 'success' | 'error' | 'info' | 'warning';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return {
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          icon: CheckCircle
        };
      case 'error':
        return {
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          icon: XCircle
        };
      case 'warning':
        return {
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          icon: AlertTriangle
        };
      case 'info':
      default:
        return {
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          icon: Info
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500">Latest updates from your lead generation workflows</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => {
              const statusConfig = getStatusConfig(activity.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div 
                  key={activity.id} 
                  className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 hover:shadow-md ${statusConfig.bgColor} border border-gray-100`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.color}`}>
                      <StatusIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${statusConfig.textColor} mb-1`}>
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{activity.target}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} text-white`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {activities.length > 0 && (
          <div className="mt-6 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all activity →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};export default ActivityFeed;
