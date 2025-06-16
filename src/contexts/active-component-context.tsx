"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ActiveComponentContextType {
  activeComponent: string;
  setActiveComponent: (url: string) => void;
}

const ActiveComponentContext = createContext<ActiveComponentContextType | undefined>(undefined);

export function ActiveComponentProvider({ children }: { children: ReactNode }) {
  const [activeComponent, setActiveComponent] = useState<string>("/dashboard");

  return (
    <ActiveComponentContext.Provider value={{ activeComponent, setActiveComponent }}>
      {children}
    </ActiveComponentContext.Provider>
  );
}

export function useActiveComponent() {
  const context = useContext(ActiveComponentContext);
  if (context === undefined) {
    throw new Error("useActiveComponent must be used within an ActiveComponentProvider");
  }
  return context;
} 