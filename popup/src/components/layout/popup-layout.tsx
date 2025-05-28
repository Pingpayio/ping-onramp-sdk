// popup/src/components/layout/popup-layout.tsx

import React from 'react';

interface PopupLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({ children, title = "Pingpay Onramp" }) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-gray-800 shadow-xl rounded-lg p-6">
        <header className="mb-6 text-center">
          {/* You can add a logo here if desired */}
          {/* <img src="/logo.png" alt="Pingpay Logo" className="h-10 mx-auto mb-2" /> */}
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>
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
