
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  withArrow?: boolean;
  icon?: React.ReactNode;
}

const Button = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  isLoading = false,
  withArrow = false,
  icon,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variantStyles = {
    default: "bg-ping-700 text-white hover:bg-ping-800",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-ping-700",
    gradient: "text-white bg-gradient-ping hover:shadow-md transition-shadow",
  };
  
  const sizeStyles = {
    sm: "h-9 px-3 rounded-md text-sm",
    md: "h-10 py-2 px-4",
    lg: "h-12 px-8 rounded-md text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {children}
          {withArrow && <ChevronRight className="ml-2 h-4 w-4" />}
        </div>
      )}
    </button>
  );
};

export default Button;
