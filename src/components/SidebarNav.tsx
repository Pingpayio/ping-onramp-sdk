import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowDownUp, LayoutDashboard, Link as LinkIcon, User, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogoClick = () => {
    navigate('/onramp');
    // Force a page refresh
    window.location.reload();
  };
  
  const menuItems = [{
    title: "Onramp",
    icon: <ArrowDownUp className="h-5 w-5" />,
    path: "/onramp",
    disabled: false
  }, {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/dashboard",
    disabled: true
  }, {
    title: "Ping Links",
    icon: <LinkIcon className="h-5 w-5" />,
    path: "/stats",
    disabled: true
  }, {
    title: "Subscriptions",
    icon: (
      <div className="relative h-5 w-5 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat">
          <path d="m17 2 4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="m7 22-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
      </div>
    ),
    path: "/referrals",
    disabled: true
  }, {
    title: "Ping Account",
    icon: <User className="h-5 w-5" />,
    path: "/points",
    disabled: true
  }];
  
  return (
    <aside className="bg-[#121212] hidden md:flex flex-col h-screen w-[256px] fixed left-0 top-0">
      {/* Logo - reduced pt from 56px to 40px to move it up */}
      <div className="pt-[40px] pl-[40px]">
        <div 
          className="text-white text-2xl font-semibold flex items-center cursor-pointer" 
          onClick={handleLogoClick}
        >
          <img 
            src="/lovable-uploads/f655448d-7787-4f68-bd65-c92b438f5d1c.png" 
            alt="PING" 
            className="h-[28px]" 
          />
        </div>
      </div>

      {/* Navigation - reduced mt from 8 to align with the logo adjustment */}
      <nav className="mt-6 flex-1">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.title}>
              {item.disabled ? (
                <div 
                  className={`flex items-center py-3 text-base font-medium relative transition-colors duration-300 text-gray-500 cursor-not-allowed`}
                >
                  <div className="pl-[44px] flex items-center">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent">
                      <span className="flex items-center justify-center text-gray-500">
                        {item.icon}
                      </span>
                    </div>
                    
                    <span className="ml-3">{item.title}</span>
                  </div>
                </div>
              ) : (
                <Link 
                  to={item.path} 
                  className={`flex items-center py-3 text-base font-medium relative transition-colors duration-300 ${
                    isActive(item.path) ? 
                    "text-black" : 
                    "text-white hover:text-[#AF9EF9]"
                  }`}
                >
                  {isActive(item.path) && (
                    <div className="absolute left-[40px] h-[44px] w-[176px] bg-[#AF9EF9] rounded-full -z-10 transition-all duration-300 ease-in-out"></div>
                  )}
                  
                  <div className="pl-[44px] flex items-center">
                    <div className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 ${
                      isActive(item.path) ? 
                      "bg-[#1F1F1F]" : 
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
                    
                    <span className="ml-3">{item.title}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Social Links */}
      <div className="flex pl-[52px] pt-2 pb-6 space-x-2">
        <a href="https://x.com/pingpay_io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#AF9EF9]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a href="#" className="text-white hover:text-[#AF9EF9] ml-[8px]">
          <Github size={20} />
        </a>
      </div>
    </aside>
  );
};

export default SidebarNav;
