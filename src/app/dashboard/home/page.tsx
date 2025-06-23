'use client'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import { SidebarInset } from "@/components/ui/sidebar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { Building2, Users, Package, TrendingUp } from "lucide-react";

export default function HomePage() {
	const { user } = useUser();

	return (
		<SidebarInset>
		<div className="flex-1 bg-gradient-to-br from-blue-50 to-sky-50 overflow-y-auto">
			<div className="w-full p-8">
				<div className="mx-auto max-w-7xl space-y-8">
					{/* Header */}
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tight">
							Welcome back, {user?.first_name}!
						</h1>
						<p className="text-muted-foreground">
							Here&apos;s what&apos;s happening with your account today.
						</p>
					</div>

					{/* Stats Cards */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Users
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">12</div>
								<p className="text-xs text-muted-foreground">
									+2 from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Active Products
								</CardTitle>
								<Package className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">24</div>
								<p className="text-xs text-muted-foreground">
									+4 from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Revenue
								</CardTitle>
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">$45,231</div>
								<p className="text-xs text-muted-foreground">
									+20.1% from last month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Companies
								</CardTitle>
								<Building2 className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">3</div>
								<p className="text-xs text-muted-foreground">
									+1 from last month
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Recent Activity */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="col-span-4">
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
								<CardDescription>
									You have 3 new notifications today.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center space-x-4">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">New user registered</p>
											<p className="text-xs text-muted-foreground">
											2 minutes ago
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">Product updated</p>
											<p className="text-xs text-muted-foreground">
												1 hour ago
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">System maintenance</p>
											<p className="text-xs text-muted-foreground">
												3 hours ago
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card className="col-span-3">
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
								<CardDescription>
									Common tasks and shortcuts.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
										<div className="font-medium">Add New User</div>
										<div className="text-sm text-muted-foreground">
											Invite team members
										</div>
									</button>
									<button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
										<div className="font-medium">Create Product</div>
										<div className="text-sm text-muted-foreground">
											Add new product listing
										</div>
									</button>
									<button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
										<div className="font-medium">View Reports</div>
										<div className="text-sm text-muted-foreground">
											Analytics and insights
										</div>
									</button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	</SidebarInset>
	);
}