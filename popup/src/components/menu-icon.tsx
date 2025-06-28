interface MenuIconProps {
  onClick: () => void;
}

export function MenuIcon({ onClick }: MenuIconProps) {
  return (
    <div
      className="cursor-pointer z-50"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="31"
        viewBox="0 0 30 31"
        fill="none"
      >
        <path
          d="M4 9H26M4 16H26M4 23H26"
          stroke="#AF9EF9"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}