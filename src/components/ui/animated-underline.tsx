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
  underlineColor = "from-gray-300 to-gray-300" 
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
        "cursor-pointer inline bg-gradient-to-r bg-no-repeat [background-position:0_100%] transition-[background-size] duration-300 ease-in-out", 
        isGrouped 
          ? (isActive ? "[background-size:100%_1px]" : "[background-size:0%_1px]")
          : "[background-size:0%_1px] hover:[background-size:100%_1px]",
        underlineColor,
        className
      )}
    >
      {children}
    </span>
  );
};
