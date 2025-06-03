import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Bookmark, Activity } from "lucide-react";

export function Dashboard() {
	const purchasedCalculators = [
		{
			name: "Data Center Capital Cost Calculator",
			type: "Cost Analysis",
			lastUsed: "2 hours ago",
		},
		{
			name: "Lifecycle CO2e Calculator",
			type: "Carbon Footprint",
			lastUsed: "1 day ago",
		},
		{
			name: "UPS Efficiency Comparison",
			type: "Energy Analysis",
			lastUsed: "3 days ago",
		},
		{
			name: "DCIM Monitoring Value Calculator",
			type: "ROI Analysis",
			lastUsed: "1 week ago",
		},
	];

	const activeProjects = [
		{
			name: "NYC Data Center Expansion",
			calculators: 3,
			progress: "In Progress",
		},
		{ name: "Edge Computing Rollout", calculators: 2, progress: "Planning" },
		{ name: "Green Energy Migration", calculators: 4, progress: "Analysis" },
	];

	const savedScenarios = [
		{
			name: "High Density Rack Config",
			location: "US East",
			lastModified: "Yesterday",
		},
		{
			name: "European Compliance Setup",
			location: "EU West",
			lastModified: "3 days ago",
		},
		{
			name: "Edge Site Template",
			location: "Global",
			lastModified: "1 week ago",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of your purchased calculators, active projects, and saved
					scenarios
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Purchased Calculators
						</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{purchasedCalculators.length}
						</div>
						<p className="text-xs text-muted-foreground">+2 from last month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Projects
						</CardTitle>
						<Bookmark className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeProjects.length}</div>
						<p className="text-xs text-muted-foreground">
							2 completed this month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Saved Scenarios
						</CardTitle>
						<Play className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{savedScenarios.length}</div>
						<p className="text-xs text-muted-foreground">
							Ready for quick launch
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Purchased Calculators</CardTitle>
						<CardDescription>Quick launch your available tools</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{purchasedCalculators.map((calc, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 border border-border rounded-lg"
							>
								<div className="space-y-1">
									<p className="font-medium">{calc.name}</p>
									<div className="flex items-center gap-2">
										<Badge variant="secondary">{calc.type}</Badge>
										<span className="text-sm text-muted-foreground">
											Last used: {calc.lastUsed}
										</span>
									</div>
								</div>
								<Button size="sm">
									<Play className="h-4 w-4 mr-1" />
									Launch
								</Button>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Active Projects</CardTitle>
						<CardDescription>Your ongoing data center analyses</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{activeProjects.map((project, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 border border-border rounded-lg"
							>
								<div className="space-y-1">
									<p className="font-medium">{project.name}</p>
									<div className="flex items-center gap-2">
										<span className="text-sm text-muted-foreground">
											{project.calculators} calculators
										</span>
										<Badge variant="outline">{project.progress}</Badge>
									</div>
								</div>
								<Button variant="outline" size="sm">
									View
								</Button>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Saved Scenarios</CardTitle>
					<CardDescription>
						Pre-configured templates for quick analysis
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						{savedScenarios.map((scenario, index) => (
							<div key={index} className="p-4 border border-border rounded-lg">
								<h4 className="font-medium">{scenario.name}</h4>
								<p className="text-sm text-muted-foreground mt-1">
									{scenario.location}
								</p>
								<p className="text-xs text-muted-foreground mt-2">
									Modified: {scenario.lastModified}
								</p>
								<Button className="w-full mt-3" variant="outline" size="sm">
									Apply Scenario
								</Button>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
