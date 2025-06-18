"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import AuthSessionProvider from "./providers/session-provider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<AuthSessionProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
				<Toaster />
			</ThemeProvider>
		</AuthSessionProvider>
	);
}
