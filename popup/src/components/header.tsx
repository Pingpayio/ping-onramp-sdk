import { useState } from "react";
import { Logo } from "./logo";
import { MenuIcon } from "./menu-icon";
import { HeaderMenu } from "./header-menu";
import { useClickOutside } from "../hooks/use-click-outside";
import { useWalletState } from "../hooks/use-wallet-state";

export default function Header({ title }: { title: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Manage wallet state updates
  useWalletState();
  
  // Handle click outside to close menu
  const menuRef = useClickOutside<HTMLDivElement>(
    () => setIsMenuOpen(false),
    isMenuOpen
  );

  return (
    <div className="relative w-full">
      <header className="flex items-center justify-between">
        <a href="https://pingpay.io" target="_blank">
          <Logo />
        </a>
        <h3 className=" font-bold text-[24px]">{title}</h3>
        <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)} />
      </header>

      <HeaderMenu
        ref={menuRef}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

