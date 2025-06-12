import React from "react";

interface PopupLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PopupLayout: React.FC<PopupLayoutProps> = ({ children }) => {
  return (
    <div className="popup-root flex flex-col items-center mx-auto my-auto md:min-h-screen justify-center text-white md:bg-white bg-[#121212]">
      <div className="w-full flex p-4 min-h-screen md:min-h-auto flex-col justify-between rounded-[16px] h-full md:w-[500px] md:h-[700px] bg-[#121212]">
        <main className="flex-1 overflow-auto">{children}</main>
        <footer className="text-center text-xs text-white flex gap-1 items-end justify-center py-2">
          <p>Powered by</p>
          <a href="https://pingpay.io" target="_blank">
            <img src="/ping-pay-logo-light.svg" className="" />
          </a>
        </footer>
      </div>
    </div>
  );
};

export default PopupLayout;
