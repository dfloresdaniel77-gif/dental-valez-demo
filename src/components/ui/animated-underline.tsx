"use client";

import { ReactNode, createContext, useContext, useState, useId } from "react";
import { cn } from "@/lib/utils";

const UnderlineContext = createContext<{
  activeId: string | null;
  setActiveId: (id: string | null) => void;
} | null>(null);

export const UnderlineGroup = ({ children }: { children: ReactNode }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <UnderlineContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </UnderlineContext.Provider>
  );
};

export const AnimatedUnderline = ({ 
  children, 
  className,
  underlineColor = "after:bg-gray-300" 
}: { 
  children: ReactNode;
  className?: string;
  underlineColor?: string;
}) => {
  const id = useId();
  const context = useContext(UnderlineContext);
  
  const isGrouped = context !== null;
  const isActive = isGrouped ? context.activeId === id : false;

  const handleMouseEnter = () => {
    if (isGrouped) {
      context.setActiveId(id);
    }
  };

  return (
    <span 
      onMouseEnter={handleMouseEnter}
      className={cn(
        "relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:transition-transform after:ease-in-out after:duration-300 cursor-pointer", 
        isGrouped 
          ? (isActive ? "after:origin-bottom-left after:scale-x-100" : "after:origin-bottom-right after:scale-x-0")
          : "after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100",
        underlineColor,
        className
      )}
    >
      {children}
    </span>
  );
};
