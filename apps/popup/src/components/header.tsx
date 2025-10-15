import { useState } from "react";
// import { useClickOutside } from "../hooks/use-click-outside";
import { Logo } from "./logo";
import { MenuIcon } from "./menu-icon";
import { Button } from "./ui/button";

interface HeaderProps {
  title: string;
  showCloseIcon?: boolean;
  onClose?: () => void;
}

export default function Header({ title, showCloseIcon, onClose }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle click outside to close menu
  // const menuRef = useClickOutside<HTMLDivElement>(
  //   () => setIsMenuOpen(false),
  //   isMenuOpen,
  // );

  return (
    <div className="relative w-full">
      <header className="flex items-center justify-between">
        <a href="https://pingpay.io" target="_blank" rel="noreferrer noopener">
          <Logo />
        </a>
        <h3 className=" font-semibold text-[24px]">{title}</h3>
        {showCloseIcon ? (
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0 hover:bg-white/10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        ) : (
          <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)} />
        )}
      </header>
    </div>
  );
}
