import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, Zap, Server, DollarSign } from "lucide-react";

export function ScenarioTemplates() {
	const templates = [
		{
			name: "High Density Edge Site",
			description: "Optimized for edge computing with high rack density",
			location: "Multiple Regions",
			energyPrice: "$0.12/kWh",
			rackDensity: "15kW/rack",
			cooling: "Air Cooling",
			redundancy: "N+1",
			usageCount: 12,
		},
		{
			name: "Enterprise Data Center",
			description: "Large scale enterprise deployment with redundancy",
			location: "US East Coast",
			energyPrice: "$0.08/kWh",
			rackDensity: "8kW/rack",
			cooling: "Liquid Cooling",
			redundancy: "2N",
			usageCount: 8,
		},
		{
			name: "Green Energy Focused",
			description: "Renewable energy optimized configuration",
			location: "Nordic Region",
			energyPrice: "$0.06/kWh",
			rackDensity: "12kW/rack",
			cooling: "Free Cooling",
			redundancy: "N+1",
			usageCount: 15,
		},
		{
			name: "Cost Optimized SMB",
			description: "Budget-friendly setup for small to medium business",
			location: "US Central",
			energyPrice: "$0.10/kWh",
			rackDensity: "6kW/rack",
			cooling: "CRAC Units",
			redundancy: "N",
			usageCount: 5,
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Scenario Templates
					</h1>
					<p className="text-muted-foreground">
						Build and store default input profiles for reuse across calculators
					</p>
				</div>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Create Template
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Quick Template Builder</CardTitle>
					<CardDescription>
						Create a new scenario template with common parameters
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-2">
							<Label htmlFor="template-name">Template Name</Label>
							<Input
								id="template-name"
								placeholder="e.g., High Performance Setup"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input id="location" placeholder="e.g., US West Coast" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="energy-price">Energy Price</Label>
							<Input id="energy-price" placeholder="e.g., $0.12/kWh" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="rack-density">Rack Density</Label>
							<Input id="rack-density" placeholder="e.g., 10kW/rack" />
						</div>
					</div>
					<Button className="w-full">Save Template</Button>
				</CardContent>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				{templates.map((template, index) => (
					<Card key={index} className="relative">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-lg">{template.name}</CardTitle>
									<CardDescription>{template.description}</CardDescription>
								</div>
								<Badge variant="secondary">{template.usageCount} uses</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-3">
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{template.location}</span>
								</div>
								<div className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										Energy: {template.energyPrice}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Server className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										Density: {template.rackDensity}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<DollarSign className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Cooling: {template.cooling}</span>
								</div>
							</div>

							<div className="flex gap-2 pt-2">
								<Button className="flex-1" variant="outline">
									Edit
								</Button>
								<Button className="flex-1">Apply to Calculator</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Template Usage Analytics</CardTitle>
					<CardDescription>
						See which templates are most popular and effective
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{templates.map((template, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 border border-border rounded-lg"
							>
								<div>
									<p className="font-medium">{template.name}</p>
									<p className="text-sm text-muted-foreground">
										Used {template.usageCount} times this month
									</p>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-24 bg-muted rounded-full h-2">
										<div
											className="bg-primary h-2 rounded-full"
											style={{ width: `${(template.usageCount / 20) * 100}%` }}
										/>
									</div>
									<span className="text-sm text-muted-foreground">
										{template.usageCount}/20
									</span>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
