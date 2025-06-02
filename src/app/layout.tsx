import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "NovAzure",
	description: "Modern Next.js Application",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				suppressHydrationWarning
				className={cn("font-sans antialiased h-screen overflow-hidden", inter.variable)}
			>
				<Providers>
					<div className="flex flex-col h-screen">
						<div className="h-12">
							<Navbar />
						</div>
						<div className="h-[calc(100vh-48px)] transition-[margin] duration-200 ease-linear peer-data-[state=expanded]:ml-[var(--sidebar-width)] peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)]">
							{children}
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
