import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  isActive: boolean = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isActive &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, isActive]);

  return ref;
}
