import React from "react";
import Header from "../header";

interface PopupLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center mx-auto my-auto md:min-h-screen justify-center text-white md:bg-white bg-[#121212]">
      <div className="w-full flex p-4 min-h-screen md:min-h-auto flex-col justify-between rounded-[16px] h-full md:w-[500px] md:h-[700px] bg-[#121212]">
        <main className="flex-1 overflow-auto">{children}</main>
        <footer className="text-center text-xs text-white flex gap-1 items-end justify-center py-2">
          <p>Powered by</p>
          <img src="/ping-pay-logo-light.svg" className="" />
        </footer>
      </div>
    </div>
  );
};

export default PopupLayout;
