import React from 'react';
import { DivideIcon as LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo' | 'pink';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600'
  };

  const changeColorClasses = {
    increase: 'text-green-600 bg-green-50',
    decrease: 'text-red-600 bg-red-50'
  };

  const ChangeIcon = changeType === 'increase' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${changeColorClasses[changeType]}`}>
            <ChangeIcon className="w-4 h-4 mr-1" />
            <span>{change}</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};
