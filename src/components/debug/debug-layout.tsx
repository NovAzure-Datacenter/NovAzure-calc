"use client";

import { AccountTypeProvider } from "@/contexts/account-type-context-debug";
import { DebugControllerPanel } from "./debug-controller-panel";

export function DebugLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountTypeProvider>
      <DebugControllerPanel />
      {children}
    </AccountTypeProvider>
  );
} 