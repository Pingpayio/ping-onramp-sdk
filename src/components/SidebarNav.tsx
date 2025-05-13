
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, BarChart2, Users, Target, ArrowDownUp } from 'lucide-react';

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
    path: "/dashboard"
  }, {
    title: "Markets",
    icon: <Building2 className="h-5 w-5" />,
    path: "/markets"
  }, {
    title: "Stats",
    icon: <BarChart2 className="h-5 w-5" />,
    path: "/stats"
  }, {
    title: "Referrals",
    icon: <Users className="h-5 w-5" />,
    path: "/referrals"
  }, {
    title: "Points",
    icon: <Target className="h-5 w-5" />,
    path: "/points"
  }];
  
  return (
    <aside className="bg-[#120714] flex flex-col h-screen w-[256px] fixed left-0 top-0">
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

      {/* User Rank */}
      
      {/* Navigation */}
      <nav className="mt-8 flex-1">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.title}>
              <Link 
                to={item.path} 
                className={`flex items-center py-3 text-base font-medium relative ${
                  isActive(item.path) ? 
                  "text-black" : 
                  "text-white hover:bg-gray-800"
                }`}
              >
                {/* Active state pill background */}
                {isActive(item.path) && (
                  <div className="absolute left-[40px] h-[44px] w-[176px] bg-[#AF9EF9] rounded-full -z-10"></div>
                )}
                
                {/* Icon and text content - always positioned the same way */}
                <div className="pl-[44px] flex items-center">
                  {/* Icon in circular bubble - consistent 44px padding for all states */}
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full ${
                    isActive(item.path) ? 
                    "bg-[#120714]" : 
                    "bg-transparent"
                  }`}>
                    <span className={`flex items-center justify-center ${
                      isActive(item.path) ? 
                      "text-[#AF9EF9]" : 
                      "text-white"
                    }`}>
                      {item.icon}
                    </span>
                  </div>
                  
                  {/* Text label with proper spacing from icon */}
                  <span className="ml-3">{item.title}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Version */}
      <div className="pl-[40px] pb-6 text-gray-500 text-sm">
        v2.4b58a
      </div>

      {/* Social Links */}
      <div className="flex pl-[40px] pt-2 pb-6 space-x-4">
        <a href="#" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
          </svg>
        </a>
        <a href="#" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </aside>
  );
};

export default SidebarNav;
