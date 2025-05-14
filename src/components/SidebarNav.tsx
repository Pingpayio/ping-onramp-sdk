import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, BarChart2, Users, Target, ArrowDownUp, Github, Telegram } from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarNav = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/onramp") {
      return true;
    }
    return location.pathname === path;
  };
  
  const menuItems = [{
    title: "Onramp",
    icon: <ArrowDownUp className="h-5 w-5" />,
    path: "/dashboard",
    disabled: false
  }, {
    title: "Dashboard", // Changed from Markets
    icon: <Building2 className="h-5 w-5" />,
    path: "/markets",
    disabled: true
  }, {
    title: "Ping Links", // Changed from Stats
    icon: <BarChart2 className="h-5 w-5" />,
    path: "/stats",
    disabled: true
  }, {
    title: "Subscriptions", // Changed from Referrals
    icon: <Users className="h-5 w-5" />,
    path: "/referrals",
    disabled: true
  }, {
    title: "Ping Account", // Changed from Points
    icon: <Target className="h-5 w-5" />,
    path: "/points",
    disabled: true
  }];
  
  return (
    <aside className="bg-[#121212] flex flex-col h-screen w-[256px] fixed left-0 top-0">
      {/* Logo */}
      <div className="pt-[56px] pl-[40px]">
        <div className="text-white text-2xl font-semibold flex items-center">
          <img 
            src="/lovable-uploads/f655448d-7787-4f68-bd65-c92b438f5d1c.png" 
            alt="PING" 
            className="h-[28px]" 
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.title}>
              {item.disabled ? (
                // Disabled item - only visual, not clickable
                <div 
                  className={`flex items-center py-3 text-base font-medium relative transition-colors duration-300 text-gray-500 cursor-not-allowed`}
                >
                  {/* Icon bubble with greyed out styling */}
                  <div className="pl-[44px] flex items-center">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent">
                      <span className="flex items-center justify-center text-gray-500">
                        {item.icon}
                      </span>
                    </div>
                    
                    {/* Text label */}
                    <span className="ml-3">{item.title}</span>
                  </div>
                </div>
              ) : (
                // Active item - clickable with original styling
                <Link 
                  to={item.path} 
                  className={`flex items-center py-3 text-base font-medium relative transition-colors duration-300 ${
                    isActive(item.path) ? 
                    "text-black" : 
                    "text-white hover:text-[#AF9EF9]"
                  }`}
                >
                  {/* Active state pill background - with smooth animation */}
                  {isActive(item.path) && (
                    <div className="absolute left-[40px] h-[44px] w-[176px] bg-[#AF9EF9] rounded-full -z-10 transition-all duration-300 ease-in-out"></div>
                  )}
                  
                  {/* Icon and text content - always positioned the same way */}
                  <div className="pl-[44px] flex items-center">
                    {/* Icon in circular bubble with smooth transition */}
                    <div className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 ${
                      isActive(item.path) ? 
                      "bg-[#121212]" : 
                      "bg-transparent hover:bg-[#1A1326]"
                    }`}>
                      <span className={`flex items-center justify-center transition-colors duration-300 ${
                        isActive(item.path) ? 
                        "text-[#AF9EF9]" : 
                        "text-white group-hover:text-[#AF9EF9]"
                      }`}>
                        {item.icon}
                      </span>
                    </div>
                    
                    {/* Text label with proper spacing from icon */}
                    <span className="ml-3">{item.title}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Social Links */}
      <div className="flex pl-[40px] pt-2 pb-6 space-x-4">
        <a href="https://x.com/pingpay_io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <Github size={20} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <Telegram size={20} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l8 5-8 5z" />
          </svg>
        </a>
      </div>
    </aside>
  );
};

export default SidebarNav;
