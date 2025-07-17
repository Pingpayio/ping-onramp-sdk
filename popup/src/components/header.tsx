import { useState } from "react";
// import { useClickOutside } from "../hooks/use-click-outside";
import { Logo } from "./logo";
import { MenuIcon } from "./menu-icon";

export default function Header({ title }: { title: string }) {
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
        <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)} />
      </header>
      {/* 
      <HeaderMenu
        ref={menuRef}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      /> */}
    </div>
  );
}
