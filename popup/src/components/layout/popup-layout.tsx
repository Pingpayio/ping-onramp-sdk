
import React from 'react';

interface PopupLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#121212] text-white">
      <div className="w-full shadow-xl p-6">
        <main>
          {children}
        </main>
        <footer className="mt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Pingpay. All rights reserved.</p>
          {/* Add any other footer links or info here */}
        </footer>
      </div>
    </div>
  );
};

export default PopupLayout;
