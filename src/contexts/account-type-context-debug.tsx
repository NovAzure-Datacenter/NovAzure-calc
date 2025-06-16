"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AccountType = "super-admin" | "user";

interface AccountTypeContextType {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
}

const AccountTypeContext = createContext<AccountTypeContextType | undefined>(undefined);

export function AccountTypeProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("super-admin");

  return (
    <AccountTypeContext.Provider value={{ accountType, setAccountType }}>
      {children}
    </AccountTypeContext.Provider>
  );
}

export function useAccountType() {
  const context = useContext(AccountTypeContext);
  if (context === undefined) {
    throw new Error("useAccountType must be used within an AccountTypeProvider");
  }
  return context;
} 