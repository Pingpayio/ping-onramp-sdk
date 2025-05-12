
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/onramp', name: 'Onramp', icon: <ArrowRightLeft className="h-5 w-5" /> },
    { path: '/transaction', name: 'Transactions', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-ping-700 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
