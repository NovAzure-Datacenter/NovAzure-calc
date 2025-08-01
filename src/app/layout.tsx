import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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
				className={cn("font-sans antialiased h-auto", inter.variable)}
			>
				<Providers>
					<SidebarProvider className="flex ">
						<SidebarInset>
							{children}
							</SidebarInset>
					</SidebarProvider>
				</Providers>
			</body>
		</html>
	);
}
