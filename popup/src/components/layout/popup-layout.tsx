import React from "react";

interface PopupLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <div className="w-full shadow-xl p-1">
        <main>{children}</main>
        <footer className=" text-center text-xs text-gray-500 flex gap-1 items-center justify-center">
          {/* <p>&copy; {new Date().getFullYear()} Pingpay. All rights reserved.</p> */}
          {/* Add any other footer links or info here */}
          <p>Powered by</p>
          <img src="/Pingpay-Logo.svg" className="w-[53px] h-[14px]" />
        </footer>
      </div>
    </div>
  );
};

export default PopupLayout;
