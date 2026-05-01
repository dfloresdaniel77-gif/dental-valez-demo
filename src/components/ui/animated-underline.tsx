"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const AnimatedUnderline = ({ 
  children, 
  className,
  underlineColor = "after:bg-gray-300" 
}: { 
  children: ReactNode;
  className?: string;
  underlineColor?: string;
}) => {
  return (
    <span 
      tabIndex={0}
      className={cn(
        "relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 focus:outline-none focus:after:origin-bottom-left focus:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300 cursor-pointer", 
        underlineColor,
        className
      )}
    >
      {children}
    </span>
  );
};
