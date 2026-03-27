import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-brand-primary text-white hover:bg-brand-primary-dark active:bg-brand-primary-dark shadow-sm hover:shadow-md transition-all duration-200",
      destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md transition-all duration-200",
      outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all duration-200",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all duration-200",
      ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200",
      link: "text-brand-primary underline-offset-4 hover:underline hover:text-brand-primary-dark transition-colors duration-200",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      lg: "h-11 rounded-lg px-8",
      icon: "h-10 w-10",
    };

    return (
      <Comp
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
