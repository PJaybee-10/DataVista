import React from 'react';
import { Home, Users, BarChart3, Settings, Bell } from 'lucide-react';

interface HorizontalMenuProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const HorizontalMenu: React.FC<HorizontalMenuProps> = ({ activeTab = 'employees', onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalMenu;
