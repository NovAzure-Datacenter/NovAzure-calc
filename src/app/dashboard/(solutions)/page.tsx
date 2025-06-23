"use client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Droplets,
	Wind,
	Zap,
	Snowflake,
	Thermometer,
	ArrowLeft,
	CheckCircle,
	Clock,
	Lightbulb,
} from "lucide-react";
import SolutionsDisplay from "./components/solutions-display";

const technologies = [
	{
		id: "liquid-cooling",
		name: "Liquid Cooling Solutions",
		description:
			"Advanced immersion and precision liquid cooling systems for high-density computing",
		icon: Droplets,
		status: "available",
		features: [
			"Zero-fan design",
			"95%+ heat recovery",
			"Ultra-low PUE",
			"Scalable architecture",
		],
		applications: ["Edge Computing", "Data Centers", "HPC", "AI/ML Workloads"],
		color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
		iconColor: "text-blue-600",
		badgeColor: "bg-blue-100 text-blue-800",
	},
	{
		id: "air-cooling",
		name: "Advanced Air Cooling",
		description:
			"Next-generation air cooling with intelligent airflow management and optimization",
		icon: Wind,
		status: "coming-soon",
		features: [
			"Smart airflow control",
			"Energy efficient fans",
			"Modular design",
			"IoT monitoring",
		],
		applications: [
			"Traditional Data Centers",
			"Office Environments",
			"Telecom",
		],
		color: "bg-green-50 border-green-200 hover:bg-green-100",
		iconColor: "text-green-600",
		badgeColor: "bg-green-100 text-green-800",
	},
	{
		id: "hybrid-cooling",
		name: "Hybrid Cooling Systems",
		description:
			"Intelligent combination of liquid and air cooling for optimal efficiency",
		icon: Thermometer,
		status: "development",
		features: [
			"Adaptive cooling",
			"Load balancing",
			"Redundant systems",
			"Cost optimization",
		],
		applications: [
			"Mixed Workloads",
			"Variable Density",
			"Seasonal Optimization",
		],
		color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
		iconColor: "text-purple-600",
		badgeColor: "bg-purple-100 text-purple-800",
	},
	{
		id: "cryogenic-cooling",
		name: "Cryogenic Solutions",
		description:
			"Ultra-low temperature cooling for quantum computing and specialized applications",
		icon: Snowflake,
		status: "research",
		features: [
			"Sub-zero temperatures",
			"Quantum ready",
			"Precision control",
			"Research grade",
		],
		applications: ["Quantum Computing", "Research Labs", "Specialized HPC"],
		color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
		iconColor: "text-cyan-600",
		badgeColor: "bg-cyan-100 text-cyan-800",
	},
	{
		id: "thermal-management",
		name: "Thermal Management Platform",
		description:
			"AI-powered thermal monitoring and management across all cooling technologies",
		icon: Zap,
		status: "beta",
		features: [
			"AI optimization",
			"Predictive analytics",
			"Real-time monitoring",
			"Energy insights",
		],
		applications: ["All Platforms", "Monitoring", "Analytics", "Optimization"],
		color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
		iconColor: "text-orange-600",
		badgeColor: "bg-orange-100 text-orange-800",
	},
	{
		id: "sustainable-cooling",
		name: "Sustainable Cooling Initiative",
		description:
			"Eco-friendly cooling solutions with renewable energy integration",
		icon: Lightbulb,
		status: "planning",
		features: [
			"Carbon neutral",
			"Renewable powered",
			"Waste heat recovery",
			"Green certification",
		],
		applications: [
			"Green Data Centers",
			"Sustainable Computing",
			"ESG Compliance",
		],
		color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
		iconColor: "text-emerald-600",
		badgeColor: "bg-emerald-100 text-emerald-800",
	},
];

const getStatusInfo = (status: string) => {
	switch (status) {
		case "available":
			return {
				label: "Available",
				icon: CheckCircle,
				color: "bg-green-100 text-green-800",
			};
		case "coming-soon":
			return {
				label: "Coming Soon",
				icon: Clock,
				color: "bg-blue-100 text-blue-800",
			};
		case "beta":
			return {
				label: "Beta",
				icon: Zap,
				color: "bg-yellow-100 text-yellow-800",
			};
		case "development":
			return {
				label: "In Development",
				icon: Clock,
				color: "bg-orange-100 text-orange-800",
			};
		case "research":
			return {
				label: "Research",
				icon: Lightbulb,
				color: "bg-purple-100 text-purple-800",
			};
		case "planning":
			return {
				label: "Planning",
				icon: Clock,
				color: "bg-gray-100 text-gray-800",
			};
		default:
			return {
				label: "Unknown",
				icon: Clock,
				color: "bg-gray-100 text-gray-800",
			};
	}
};

export default function TechnologySelector() {
	const [selectedTechnology, setSelectedTechnology] = useState<string | null>(
		null
	);

	const handleTechnologySelect = (technologyId: string) => {
		if (technologyId === "liquid-cooling") {
			setSelectedTechnology(technologyId);
		} else {
			// For other technologies, show a placeholder or coming soon message
			// alert(
			//  `${technologies.find((t) => t.id === technologyId)?.name} - ${
			//      getStatusInfo(
			//          technologies.find((t) => t.id === technologyId)?.status || ""
			//      ).label
			//  }`
			// );
		}
	};

	const handleBackToTechnologies = () => {
		setSelectedTechnology(null);
	};

	// If liquid cooling is selected, show the detailed solutions display
	if (selectedTechnology === "liquid-cooling") {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						onClick={handleBackToTechnologies}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Technologies
					</Button>
				</div>
				<SolutionsDisplay />
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6">
			{/* Header */}

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Technologies</h1>
					<p className="text-muted-foreground">
						Explore our comprehensive range of advanced cooling solutions
						designed for modern computing infrastructure
					</p>
				</div>
			</div>

			{/* Technology Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
				{technologies.map((tech) => {
					const statusInfo = getStatusInfo(tech.status);
					const StatusIcon = statusInfo.icon;
					const isAvailable = tech.status === "available";

					return (
						<Card
							key={tech.id}
							className={`transition-all duration-200 hover:shadow-md ${
								!isAvailable
									? "filter blur-[1.5px] grayscale"
									: "cursor-pointer"
							}`}
							onClick={() => handleTechnologySelect(tech.id)}
						>
							<CardHeader className="space-y-4">
								<div className="flex items-start justify-between">
									<tech.icon className={`h-12 w-12 ${tech.iconColor}`} />
									<Badge className={statusInfo.color} variant="secondary">
										<StatusIcon className="h-3 w-3 mr-1" />
										{statusInfo.label}
									</Badge>
								</div>
								<div>
									<CardTitle className="text-xl mb-2">{tech.name}</CardTitle>
									<CardDescription className="text-base">
										{tech.description}
									</CardDescription>
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								<div>
									<h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">
										Key Features
									</h4>
									<div className="flex flex-wrap gap-1">
										{tech.features.map((feature, index) => (
											<Badge key={index} variant="outline" className="text-xs">
												{feature}
											</Badge>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">
										Applications
									</h4>
									<div className="flex flex-wrap gap-1">
										{tech.applications.map((app, index) => (
											<Badge
												key={index}
												className={tech.badgeColor}
												variant="secondary"
											>
												{app}
											</Badge>
										))}
									</div>
								</div>

								{tech.status === "available" && (
									<div className="pt-2">
										<Button className="w-full bg-blue-600 hover:bg-blue-700">
											Explore Solutions
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Footer Info */}
			<div className="text-center space-y-2 pt-8">
				<p className="text-sm text-muted-foreground">
					Need help choosing the right cooling technology for your application?
				</p>
				<Button variant="outline" className="mx-auto">
					Contact Our Experts
				</Button>
			</div>
		</div>
	);
}
