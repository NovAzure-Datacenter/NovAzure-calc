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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";

export function FilterSort() {
	const activeFilters = [
		{ type: "Category", value: "Energy Analysis" },
		{ type: "Vendor", value: "Schneider Electric" },
		{ type: "TCO Range", value: "$100K - $200K" },
	];

	const calculatorResults = [
		{
			name: "UPS Efficiency Comparison Calculator",
			category: "Energy Analysis",
			vendor: "Schneider Electric",
			tco: "$125,000",
			payback: "2.3 years",
			co2e: "45 tonnes",
			rating: 4.8,
			lastUpdated: "2024-01-15",
		},
		{
			name: "Three-phase UPS Efficiency Calculator",
			category: "Energy Analysis",
			vendor: "Schneider Electric",
			tco: "$145,000",
			payback: "2.8 years",
			co2e: "52 tonnes",
			rating: 4.6,
			lastUpdated: "2024-01-10",
		},
		{
			name: "Data Center Efficiency & PUE Calculator",
			category: "Energy Analysis",
			vendor: "Schneider Electric",
			tco: "$165,000",
			payback: "3.2 years",
			co2e: "58 tonnes",
			rating: 4.7,
			lastUpdated: "2024-01-08",
		},
		{
			name: "DCIM Monitoring Value Calculator",
			category: "ROI Analysis",
			vendor: "Schneider Electric",
			tco: "$185,000",
			payback: "1.8 years",
			co2e: "35 tonnes",
			rating: 4.9,
			lastUpdated: "2024-01-12",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Filter & Sort</h1>
				<p className="text-muted-foreground">
					Narrow results by technology category, vendor, or key metric
					thresholds
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-4">
				<div className="lg:col-span-1 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Filters</CardTitle>
							<CardDescription>Refine your search criteria</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="search">Search</Label>
								<div className="relative">
									<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										id="search"
										placeholder="Search calculators..."
										className="pl-8"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Technology Category</Label>
								<div className="space-y-2">
									{[
										"Energy Analysis",
										"Cost Analysis",
										"Carbon Footprint",
										"ROI Analysis",
										"Capacity Planning",
									].map((category) => (
										<div key={category} className="flex items-center space-x-2">
											<Checkbox id={category} />
											<Label htmlFor={category} className="text-sm">
												{category}
											</Label>
										</div>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Label>Vendor</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select vendor" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="schneider">
											Schneider Electric
										</SelectItem>
										<SelectItem value="generic">Generic Vendor</SelectItem>
										<SelectItem value="legacy">Legacy Provider</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>TCO Range ($)</Label>
								<Slider
									defaultValue={[100000, 200000]}
									max={500000}
									min={50000}
									step={10000}
									className="w-full"
								/>
								<div className="flex justify-between text-sm text-muted-foreground">
									<span>$50K</span>
									<span>$500K</span>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Payback Period (years)</Label>
								<Slider
									defaultValue={[1, 5]}
									max={10}
									min={0.5}
									step={0.5}
									className="w-full"
								/>
								<div className="flex justify-between text-sm text-muted-foreground">
									<span>0.5</span>
									<span>10</span>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Minimum Rating</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select rating" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="4.5">4.5+ Stars</SelectItem>
										<SelectItem value="4.0">4.0+ Stars</SelectItem>
										<SelectItem value="3.5">3.5+ Stars</SelectItem>
										<SelectItem value="3.0">3.0+ Stars</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button className="w-full">Apply Filters</Button>
						</CardContent>
					</Card>
				</div>

				<div className="lg:col-span-3 space-y-6">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Active Filters</CardTitle>
									<CardDescription>
										Currently applied search criteria
									</CardDescription>
								</div>
								<Button variant="outline" size="sm">
									Clear All
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{activeFilters.map((filter, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="flex items-center gap-1"
									>
										{filter.type}: {filter.value}
										<X className="h-3 w-3 cursor-pointer" />
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Results ({calculatorResults.length})</CardTitle>
									<CardDescription>
										Calculators matching your criteria
									</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<Label htmlFor="sort">Sort by:</Label>
									<Select>
										<SelectTrigger className="w-40">
											<SelectValue placeholder="Select sort" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="tco-asc">TCO (Low to High)</SelectItem>
											<SelectItem value="tco-desc">
												TCO (High to Low)
											</SelectItem>
											<SelectItem value="payback-asc">
												Payback (Fast to Slow)
											</SelectItem>
											<SelectItem value="rating-desc">
												Rating (High to Low)
											</SelectItem>
											<SelectItem value="updated-desc">
												Recently Updated
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{calculatorResults.map((calc, index) => (
									<div
										key={index}
										className="p-4 border border-border rounded-lg"
									>
										<div className="flex items-start justify-between">
											<div className="space-y-2">
												<h3 className="font-semibold">{calc.name}</h3>
												<div className="flex items-center gap-4 text-sm text-muted-foreground">
													<Badge variant="outline">{calc.category}</Badge>
													<span>Vendor: {calc.vendor}</span>
													<span>Rating: {calc.rating}/5</span>
												</div>
												<div className="flex items-center gap-6 text-sm">
													<span>
														<strong>TCO:</strong> {calc.tco}
													</span>
													<span>
														<strong>Payback:</strong> {calc.payback}
													</span>
													<span>
														<strong>CO₂e:</strong> {calc.co2e}
													</span>
												</div>
												<p className="text-xs text-muted-foreground">
													Last updated: {calc.lastUpdated}
												</p>
											</div>
											<div className="flex gap-2">
												<Button variant="outline" size="sm">
													Compare
												</Button>
												<Button size="sm">View Details</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
