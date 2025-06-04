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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Search,
	ShoppingCart,
	Star,
	Zap,
	DollarSign,
	Leaf,
	BarChart3,
	Settings,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function Calculators() {
	const categories = [
		{ name: "Energy Analysis", icon: Zap, count: 8 },
		{ name: "Cost Analysis", icon: DollarSign, count: 12 },
		{ name: "Carbon Footprint", icon: Leaf, count: 6 },
		{ name: "Performance", icon: BarChart3, count: 10 },
		{ name: "Infrastructure", icon: Settings, count: 15 },
	];

	const featuredCalculators = [
		{
			name: "Data Center Capital Cost Calculator",
			description:
				"Determine the impact of physical infrastructure design choices on capital cost",
			category: "Cost Analysis",
			price: "€299",
			rating: 4.8,
			reviews: 124,
			features: [
				"Budget expectations (+/- 20%)",
				"Costs by subsystem",
				"Material & labor breakdown",
			],
			popular: true,
		},
		{
			name: "Lifecycle CO2e Calculator",
			description:
				"Quickly estimate carbon drivers to prioritize reduction efforts",
			category: "Carbon Footprint",
			price: "€199",
			rating: 4.9,
			reviews: 89,
			features: [
				"Cradle to grave analysis",
				"Breakdown by scope",
				"CUE calculations",
			],
			popular: false,
		},
		{
			name: "UPS Efficiency Comparison Calculator",
			description:
				"Compare single-phase UPS systems for efficiency and cost impact",
			category: "Energy Analysis",
			price: "€149",
			rating: 4.7,
			reviews: 156,
			features: [
				"Efficiency curves",
				"Electricity cost analysis",
				"Carbon footprint",
			],
			popular: true,
		},
		{
			name: "DCIM Monitoring Value Calculator",
			description:
				"Estimate ROI of DCIM monitoring and alarming for distributed IT",
			category: "Performance",
			price: "€249",
			rating: 4.6,
			reviews: 78,
			features: ["Downtime reduction", "Staff optimization", "5-year cashflow"],
			popular: false,
		},
	];

	const allCalculators = [
		{
			name: "Three-phase UPS Efficiency Calculator",
			category: "Energy Analysis",
			price: "€179",
			rating: 4.5,
			description:
				"Gauge impact of 3-phase UPS on energy costs and carbon footprint",
		},
		{
			name: "Edge UPS Fleet Management Calculator",
			category: "Cost Analysis",
			price: "€229",
			rating: 4.7,
			description:
				"Compare costs of managing distributed UPS fleet vs 3rd party",
		},
		{
			name: "Site Electricity Emission Factor Calculator",
			category: "Carbon Footprint",
			price: "€129",
			rating: 4.4,
			description: "Understand impact of electricity source mix on emissions",
		},
		{
			name: "Prefabricated Data Center Service ROI Calculator",
			category: "Performance",
			price: "€199",
			rating: 4.6,
			description:
				"Estimate value of monitoring & maintenance for prefab data centers",
		},
		{
			name: "Data Center Efficiency & PUE Calculator",
			category: "Energy Analysis",
			price: "€159",
			rating: 4.8,
			description:
				"Determine impact of power and cooling approaches on energy cost",
		},
		{
			name: "Lithium-ion vs VRLA Battery TCO Calculator",
			category: "Cost Analysis",
			price: "€189",
			rating: 4.3,
			description:
				"Compare TCO impact of lithium-ion vs VRLA batteries for UPS",
		},
		{
			name: "Cooling Infrastructure Sizing Calculator",
			category: "Infrastructure",
			price: "€249",
			rating: 4.7,
			description: "Determine optimal cooling capacity and configuration for your data center environment",
		},
		{
			name: "Edge Computing Network Latency Calculator",
			category: "Performance",
			price: "€179",
			rating: 4.8,
			description: "Analyze network latency impact and optimize edge computing deployment locations",
		},
		{
			name: "Renewable Energy Integration Calculator",
			category: "Energy Analysis",
			price: "€219",
			rating: 4.6,
			description: "Evaluate feasibility and ROI of integrating renewable energy sources in data centers",
		},
		{
			name: "Data Center Water Usage Calculator",
			category: "Carbon Footprint",
			price: "€169",
			rating: 4.5,
			description: "Calculate and optimize water consumption efficiency in cooling systems",
		},
		{
			name: "IT Equipment Refresh ROI Calculator",
			category: "Cost Analysis",
			price: "€199",
			rating: 4.4,
			description: "Determine optimal timing and ROI for IT equipment replacement cycles",
		},
	];

	return (
		<div className="space-y-6 ">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Purchase Calculators
					</h1>
					<p className="text-muted-foreground">
						Expand your toolkit with additional data center analysis calculators
					</p>
				</div>
				<div className="relative">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Search calculators..." className="pl-8 w-64" />
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-5">
				{categories.map((category, index) => (
					<Card
						key={index}
						className="cursor-pointer hover:shadow-md transition-shadow p-0"
					>
						<CardContent className="flex flex-col items-center p-6">
							<category.icon className="h-8 w-8 mb-2 text-primary" />
							<h3 className="font-semibold text-center">{category.name}</h3>
							<p className="text-sm text-muted-foreground">
								{category.count} calculators
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<Tabs defaultValue="featured" className="space-y-2 pt-12">
				<div className="flex items-center justify-between">
					<TabsList className="grid grid-cols-3 w-[400px]">
						<TabsTrigger value="featured">Featured</TabsTrigger>
						<TabsTrigger value="all">All Calculators</TabsTrigger>
						<TabsTrigger value="bundles">Bundles</TabsTrigger>
					</TabsList>

					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className="flex items-center gap-2">
								<ShoppingCart className="h-4 w-4" />
								<Badge variant="secondary" className="rounded-full">0</Badge>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80" align="end">
							<div className="flex flex-col gap-4">
								<div className="flex items-center justify-between">
									<h4 className="font-medium">Cart</h4>
									<Badge variant="secondary">0 items</Badge>
								</div>
								<ScrollArea className="h-[200px]">
									<div className="space-y-4">
										{/* Cart items will go here */}
										<div className="text-sm text-muted-foreground text-center py-8">
											Your cart is empty
										</div>
									</div>
								</ScrollArea>
								<Separator />
								<div className="space-y-4">
									<div className="flex items-center justify-between font-medium">
										<span>Total</span>
										<span>€0.00</span>
									</div>
									<Button className="w-full" disabled>
										Checkout
									</Button>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<TabsContent value="featured" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						{featuredCalculators.map((calc, index) => (
							<Card key={index} className="relative">
								{calc.popular && (
									<Badge className="absolute top-4 right-4">Popular</Badge>
								)}
								<CardHeader>
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-lg">{calc.name}</CardTitle>
											<CardDescription className="mt-2">
												{calc.description}
											</CardDescription>
										</div>
									</div>
									<div className="flex items-center gap-4 mt-4">
										<Badge variant="outline">{calc.category}</Badge>
										<div className="flex items-center gap-1">
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<span className="text-sm">{calc.rating}</span>
											<span className="text-sm text-muted-foreground">
												({calc.reviews})
											</span>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<p className="text-sm font-medium">Key Features:</p>
										<ul className="text-sm text-muted-foreground space-y-1">
											{calc.features.map((feature, idx) => (
												<li key={idx}>• {feature}</li>
											))}
										</ul>
									</div>
									<div className="flex items-center justify-between pt-4">
										<div className="text-2xl font-bold">{calc.price}</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												Preview
											</Button>
											<Button size="sm">
												<ShoppingCart className="h-4 w-4 mr-1" />
												Purchase
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="all" className="space-y-2">
					{allCalculators.map((calc, index) => (
						<Card
							key={index}
							className="hover:shadow-md transition-shadow py-2 "
						>
							<CardContent className="flex items-center justify-between px-4 py-2">
								<div className="flex items-center gap-6">
									<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
										<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
											{calc.category === "Energy Analysis" && (
												<Zap className="h-8 w-8 text-primary" />
											)}
											{calc.category === "Cost Analysis" && (
												<DollarSign className="h-8 w-8 text-primary" />
											)}
											{calc.category === "Carbon Footprint" && (
												<Leaf className="h-8 w-8 text-primary" />
											)}
											{calc.category === "Performance" && (
												<BarChart3 className="h-8 w-8 text-primary" />
											)}
											{calc.category === "Infrastructure" && (
												<Settings className="h-8 w-8 text-primary" />
											)}
										</div>
									</div>
									<div className="space-y-2">
										<h3 className="font-semibold">{calc.name}</h3>
										<p className="text-sm text-muted-foreground">
											{calc.description}
										</p>
										<div className="flex items-center gap-4">
											<Badge variant="outline">{calc.category}</Badge>
											<div className="flex items-center gap-1">
												<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
												<span className="text-sm">{calc.rating}</span>
											</div>
										</div>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2">
									<div className="text-xl font-bold pr-2">{calc.price}</div>
									<div className="flex gap-2">
										<Button variant="outline" size="sm">
											Preview
										</Button>
										<Button size="sm">
											<ShoppingCart className="h-4 w-4 mr-1" />
											Add to Cart
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>

				<TabsContent value="bundles" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Energy Efficiency Bundle</CardTitle>
								<CardDescription>
									Complete energy analysis toolkit for data centers
								</CardDescription>
								<Badge className="w-fit">Save 25%</Badge>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<p className="text-sm font-medium">Includes:</p>
									<ul className="text-sm text-muted-foreground space-y-1">
										<li>• UPS Efficiency Comparison Calculator</li>
										<li>• Three-phase UPS Efficiency Calculator</li>
										<li>• Data Center Efficiency & PUE Calculator</li>
										<li>• eConversion vs Double Conversion Calculator</li>
									</ul>
								</div>
								<div className="flex items-center justify-between pt-4">
									<div>
										<span className="text-2xl font-bold">€449</span>
										<span className="text-sm text-muted-foreground line-through ml-2">
											€599
										</span>
									</div>
									<Button>
										<ShoppingCart className="h-4 w-4 mr-1" />
										Purchase Bundle
									</Button>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Carbon Footprint Suite</CardTitle>
								<CardDescription>
									Comprehensive carbon analysis and reduction tools
								</CardDescription>
								<Badge className="w-fit">Save 30%</Badge>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<p className="text-sm font-medium">Includes:</p>
									<ul className="text-sm text-muted-foreground space-y-1">
										<li>• Lifecycle CO2e Calculator</li>
										<li>• Micro Data Center CO2e Calculator</li>
										<li>• Site Electricity Emission Factor Calculator</li>
										<li>• Data Center Carbon Footprint Calculator</li>
									</ul>
								</div>
								<div className="flex items-center justify-between pt-4">
									<div>
										<span className="text-2xl font-bold">€399</span>
										<span className="text-sm text-muted-foreground line-through ml-2">
											€569
										</span>
									</div>
									<Button>
										<ShoppingCart className="h-4 w-4 mr-1" />
										Purchase Bundle
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
