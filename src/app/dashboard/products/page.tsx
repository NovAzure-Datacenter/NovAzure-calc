"use client";

import { useState, useMemo } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Building2,
	Cpu,
	Wrench,
	Package,
	Eye,
	Search,
	Settings,
	Gauge,
	ChevronRight,
	Star,
	Plus,
	Edit,
} from "lucide-react";
import { mockData, type Product, type SolutionVariant, type Industry, type Technology, type Solution, getIconForCategory } from "./constants";
import Image from "next/image";
import AddNewFeature, { type NewProductData } from "./components/add-new-feature";
import { SidebarInset } from "@/components/ui/sidebar";

type NavigationLevel =
	| "industry"
	| "technology"
	| "solution"
	| "solutionVariant"
	| "product";

interface NavigationState {
	level: NavigationLevel;
	industryId?: string;
	technologyId?: string;
	solutionId?: string;
	solutionVariantId?: string;
}

interface SearchResult {
	id: string;
	name: string;
	description: string;
	type: NavigationLevel;
	path: string[];
	pathIds: {
		industryId?: string;
		technologyId?: string;
		solutionId?: string;
		solutionVariantId?: string;
	};
}

export default function CRMProductNavigator() {
	const [navState, setNavState] = useState<NavigationState>({
		level: "industry",
	});
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [_newProducts, setNewProducts] = useState<Product[]>([]);
	const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
	const [selectedSolutionVariant, setSelectedSolutionVariant] =
		useState<SolutionVariant | null>(null);

	// Auto-open search when user starts typing
	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		if (value.trim() && !searchOpen) {
			setSearchOpen(true);
		}
	};

	// Generate search results
	const searchResults = useMemo(() => {
		if (!searchQuery.trim()) return [];

		const results: SearchResult[] = [];
		const query = searchQuery.toLowerCase();

		mockData.industries.forEach((industry) => {
			// Search industries
			if (
				industry.name.toLowerCase().includes(query) ||
				industry.description.toLowerCase().includes(query)
			) {
				results.push({
					id: industry.id,
					name: industry.name,
					description: industry.description,
					type: "industry",
					path: [industry.name],
					pathIds: { industryId: industry.id },
				});
			}

			industry.technologies.forEach((technology) => {
				// Search technologies
				if (
					technology.name.toLowerCase().includes(query) ||
					technology.description.toLowerCase().includes(query)
				) {
					results.push({
						id: technology.id,
						name: technology.name,
						description: technology.description,
						type: "technology",
						path: [industry.name, technology.name],
						pathIds: { industryId: industry.id, technologyId: technology.id },
					});
				}

				technology.solutions.forEach((solution) => {
					// Search solutions
					if (
						solution.name.toLowerCase().includes(query) ||
						solution.description.toLowerCase().includes(query)
					) {
						results.push({
							id: solution.id,
							name: solution.name,
							description: solution.description,
							type: "solution",
							path: [industry.name, technology.name, solution.name],
							pathIds: {
								industryId: industry.id,
								technologyId: technology.id,
								solutionId: solution.id,
							},
						});
					}

					solution.solutionVariants.forEach((solutionVariant) => {
						// Search solution variants
						if (
							solutionVariant.name.toLowerCase().includes(query) ||
							solutionVariant.description.toLowerCase().includes(query)
						) {
							results.push({
								id: solutionVariant.id,
								name: solutionVariant.name,
								description: solutionVariant.description,
								type: "solutionVariant",
								path: [
									industry.name,
									technology.name,
									solution.name,
									solutionVariant.name,
								],
								pathIds: {
									industryId: industry.id,
									technologyId: technology.id,
									solutionId: solution.id,
									solutionVariantId: solutionVariant.id,
								},
							});
						}

						solutionVariant.products.forEach((product) => {
							// Search products
							if (
								product.name.toLowerCase().includes(query) ||
								product.description.toLowerCase().includes(query) ||
								product.model.toLowerCase().includes(query)
							) {
								results.push({
									id: product.id,
									name: product.name,
									description: product.description,
									type: "product",
									path: [
										industry.name,
										technology.name,
										solution.name,
										solutionVariant.name,
										product.name,
									],
									pathIds: {
										industryId: industry.id,
										technologyId: technology.id,
										solutionId: solution.id,
										solutionVariantId: solutionVariant.id,
									},
								});
							}
						});
					});
				});
			});
		});

		return results.slice(0, 10);
	}, [searchQuery]);

	const handleSearchSelect = (result: SearchResult) => {
		if (result.type === "product") {
			// Navigate to the product level and show the product
			setNavState({
				level: "product",
				industryId: result.pathIds.industryId,
				technologyId: result.pathIds.technologyId,
				solutionId: result.pathIds.solutionId,
				solutionVariantId: result.pathIds.solutionVariantId,
			});

			// Find and show the product
			const industry = mockData.industries.find(
				(i) => i.id === result.pathIds.industryId
			);
			const technology = industry?.technologies.find(
				(t) => t.id === result.pathIds.technologyId
			);
			const solution = technology?.solutions.find(
				(s) => s.id === result.pathIds.solutionId
			);
			const solutionVariant = solution?.solutionVariants.find(
				(ss) => ss.id === result.pathIds.solutionVariantId
			);
			const product = solutionVariant?.products.find((p) => p.id === result.id);

			if (product) {
				setTimeout(() => setSelectedProduct(product), 100);
			}
		} else {
			// Navigate to the appropriate level
			let nextLevel: NavigationLevel;
			switch (result.type) {
				case "industry":
					nextLevel = "technology";
					break;
				case "technology":
					nextLevel = "solution";
					break;
				case "solution":
					nextLevel = "solutionVariant";
					break;
				default:
					nextLevel = "technology";
			}
			setNavState({
				level: nextLevel,
				industryId: result.pathIds.industryId,
				technologyId: result.pathIds.technologyId,
				solutionId: result.pathIds.solutionId,
				solutionVariantId: result.pathIds.solutionVariantId,
			});
		}

		setSearchOpen(false);
		setSearchQuery("");
	};

	const getCurrentData = () => {
		switch (navState.level) {
			case "industry":
				return mockData.industries;
			case "technology":
				return (
					mockData.industries.find((i) => i.id === navState.industryId)
						?.technologies || []
				);
			case "solution":
				const industry = mockData.industries.find(
					(i) => i.id === navState.industryId
				);
				return (
					industry?.technologies.find((t) => t.id === navState.technologyId)
						?.solutions || []
				);
			case "solutionVariant":
				const ind = mockData.industries.find(
					(i) => i.id === navState.industryId
				);
				const tech = ind?.technologies.find(
					(t) => t.id === navState.technologyId
				);
				return (
					tech?.solutions.find((s) => s.id === navState.solutionId)
						?.solutionVariants || []
				);
			case "product":
				const industry2 = mockData.industries.find(
					(i) => i.id === navState.industryId
				);
				const tech2 = industry2?.technologies.find(
					(t) => t.id === navState.technologyId
				);
				const sol = tech2?.solutions.find((s) => s.id === navState.solutionId);
				return (
					sol?.solutionVariants.find(
						(ss) => ss.id === navState.solutionVariantId
					)?.products || []
				);
			default:
				return [];
		}
	};

	const getBreadcrumbs = () => {
		const breadcrumbs = [];

		if (navState.industryId) {
			const industry = mockData.industries.find(
				(i) => i.id === navState.industryId
			);
			breadcrumbs.push({
				label: industry?.name || "",
				level: "industry" as NavigationLevel,
			});
		}

		if (navState.technologyId) {
			const industry = mockData.industries.find(
				(i) => i.id === navState.industryId
			);
			const technology = industry?.technologies.find(
				(t) => t.id === navState.technologyId
			);
			breadcrumbs.push({
				label: technology?.name || "",
				level: "technology" as NavigationLevel,
			});
		}

		if (navState.solutionId) {
			const industry = mockData.industries.find(
				(i) => i.id === navState.industryId
			);
			const technology = industry?.technologies.find(
				(t) => t.id === navState.technologyId
			);
			const solution = technology?.solutions.find(
				(s) => s.id === navState.solutionId
			);
			breadcrumbs.push({
				label: solution?.name || "",
				level: "solution" as NavigationLevel,
			});
		}

		if (navState.solutionVariantId) {
			const industry = mockData.industries.find(
				(i) => i.id === navState.industryId
			);
			const technology = industry?.technologies.find(
				(t) => t.id === navState.technologyId
			);
			const solution = technology?.solutions.find(
				(s) => s.id === navState.solutionId
			);
			const solutionVariant = solution?.solutionVariants.find(
				(ss) => ss.id === navState.solutionVariantId
			);
			breadcrumbs.push({
				label: solutionVariant?.name || "",
				level: "solutionVariant" as NavigationLevel,
			});
		}

		return breadcrumbs;
	};

	const navigateToLevel = (level: NavigationLevel, id?: string) => {
		switch (level) {
			case "industry":
				setNavState({ level: "industry" });
				break;
			case "technology":
				setNavState({ level: "technology", industryId: id });
				break;
			case "solution":
				setNavState({ ...navState, level: "solution", technologyId: id });
				break;
			case "solutionVariant":
				setNavState({ ...navState, level: "solutionVariant", solutionId: id });
				break;
			case "product":
				setNavState({ ...navState, level: "product", solutionVariantId: id });
				break;
		}
	};

	const navigateToBreadcrumb = (targetLevel: NavigationLevel) => {
		switch (targetLevel) {
			case "industry":
				setNavState({ level: "technology", industryId: navState.industryId });
				break;
			case "technology":
				setNavState({
					level: "solution",
					industryId: navState.industryId,
					technologyId: navState.technologyId,
				});
				break;
			case "solution":
				setNavState({
					level: "solutionVariant",
					industryId: navState.industryId,
					technologyId: navState.technologyId,
					solutionId: navState.solutionId,
				});
				break;
		}
	};

	const _goBack = () => {
		switch (navState.level) {
			case "technology":
				setNavState({ level: "industry" });
				break;
			case "solution":
				setNavState({ level: "technology", industryId: navState.industryId });
				break;
			case "solutionVariant":
				setNavState({
					level: "solution",
					industryId: navState.industryId,
					technologyId: navState.technologyId,
				});
				break;
			case "product":
				setNavState({
					level: "solutionVariant",
					industryId: navState.industryId,
					technologyId: navState.technologyId,
					solutionId: navState.solutionId,
				});
				break;
		}
	};

	const getLevelTitle = () => {
		switch (navState.level) {
			case "industry":
				return "Industries";
			case "technology":
				return "Technologies";
			case "solution":
				return "Solutions";
			case "solutionVariant":
				return "Solution Variants";
			case "product":
				return "Products";
			default:
				return "";
		}
	};

	const getLevelIcon = () => {
		switch (navState.level) {
			case "industry":
				return <Building2 className="h-6 w-6 text-blue-600" />;
			case "technology":
				return <Cpu className="h-6 w-6 text-purple-600" />;
			case "solution":
				return <Wrench className="h-6 w-6 text-orange-600" />;
			case "solutionVariant":
				return <Settings className="h-6 w-6 text-teal-600" />;
			case "product":
				return <Package className="h-6 w-6 text-green-600" />;
			default:
				return null;
		}
	};

	const handleNewProductSubmit = (data: NewProductData) => {
		console.log("New product data:", data);
		// Convert NewProductData to Product format if needed
		const newProduct: Product = {
			id: Date.now().toString(),
			name: data.solutionName,
			description: data.description,
			model: "Custom Model",
			category: data.industry,
			efficiency: "High",
			specifications: {
				powerRating: "Custom",
				coolingCapacity: "Custom",
				dimensions: "Custom",
				weight: "Custom",
				operatingTemperature: "Custom",
				certifications: "Custom",
			},
			features: [],
		};
		setNewProducts((prev) => [...prev, newProduct]);
		setAddDialogOpen(false);
	};

	const currentData = getCurrentData();
	const breadcrumbs = getBreadcrumbs();

	return (
		<SidebarInset>
			<div className="w-full min-h-full p-8 overflow-x-auto bg-gradient-to-br from-blue-50 to-sky-50">
				{/* Nav Header */}
				<Card className="px-6 mb-6 min-w-0">
					{/* Header Row - Just the title and description */}
					<div className="">
						{/* Header */}
						<div className="flex items-center space-x-3 mb-4">
							{getLevelIcon()}
							<div className="min-w-0">
								<h2 className="text-3xl font-bold text-gray-900 truncate">
									{getLevelTitle()}
								</h2>
								<p className="text-gray-600 mt-1 truncate">
									{navState.level === "industry" &&
										"Select an industry to explore our solutions"}
									{navState.level === "technology" &&
										"Choose a technology area"}
									{navState.level === "solution" &&
										"Browse available solutions"}
									{navState.level === "solutionVariant" &&
										"Explore specialized solutions and compare alternatives"}
								</p>
							</div>
						</div>

						{/* Search and Actions Row */}
						<div className="flex items-center justify-between gap-4">
							{/* Global Search */}
							<Popover
								open={searchOpen}
								onOpenChange={(open) => {
									setSearchOpen(open);
									if (!open) {
										setSearchQuery("");
									}
								}}
							>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={searchOpen}
										className="w-auto justify-between bg-white border-gray-200 hover:bg-gray-50"
									>
										<div className="flex items-center space-x-2 text-gray-500">
											<Search className="h-4 w-4" />
											<span className="truncate">
												Search industries, technologies, solutions, products...
											</span>
										</div>
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-[500px] p-0"
									align="start"
									onOpenAutoFocus={(e) => e.preventDefault()}
								>
									<Command shouldFilter={false}>
										<div className="flex items-center border-b px-3">
											<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
											<Input
												placeholder="Search products, solutions, technologies..."
												value={searchQuery}
												onChange={handleSearchInputChange}
												className="border-0 focus:ring-0 focus:outline-none"
												autoFocus
											/>
										</div>
										<CommandList>
											{searchResults.length === 0 && searchQuery && (
												<CommandEmpty>No results found.</CommandEmpty>
											)}
											{searchResults.length > 0 && (
												<CommandGroup heading="Search Results">
													{searchResults.map((result) => (
														<div
															key={`${result.type}-${result.id}`}
															onClick={() => handleSearchSelect(result)}
															className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
														>
															<div className="flex-shrink-0 mt-1">
																{getIconForCategory(result.type, result.name)}
															</div>
															<div className="flex-1 min-w-0">
																<div className="font-medium text-gray-900">
																	{result.name}
																</div>
																<div className="text-sm text-gray-500 truncate">
																	{result.description}
																</div>
																<div className="flex items-center text-xs text-gray-400 mt-1">
																	{result.path.map((segment, index) => (
																		<span
																			key={index}
																			className="flex items-center"
																		>
																			{index > 0 && (
																				<ChevronRight className="h-3 w-3 mx-1" />
																			)}
																			<span className="truncate max-w-[80px]">
																				{segment}
																			</span>
																		</span>
																	))}
																</div>
															</div>
															<Badge variant="outline" className="text-xs">
																{result.type}
															</Badge>
														</div>
													))}
												</CommandGroup>
											)}
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>

							{/* Action Buttons */}
							<div className="flex items-center gap-2 flex-shrink-0">
								{/* Add New button */}
								<Button
									variant="outline"
									onClick={() => setAddDialogOpen(true)}
									className="hover:bg-green-50 border-green-200 text-green-700"
								>
									<div className="flex items-center gap-2">
										<Plus className="h-4 w-4" />
										Add
									</div>
								</Button>

								{/* Edit button */}
								<Button
									variant="outline"
									className="hover:bg-blue-50 border-blue-200 text-blue-700"
								>
									<div className="flex items-center gap-2">
										<Edit className="h-4 w-4" />
										Edit
									</div>
								</Button>
							</div>
						</div>
					</div>
				</Card>

				{/* Content Grid */}
				<Card className="px-6 h-[calc(100vh-400px)] overflow-y-auto min-w-0">
					{/* Breadcrumbs - Always visible */}
					<div className="py-4 border-b border-gray-100">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									{navState.level === "industry" ? (
										<BreadcrumbPage className="font-medium flex items-center space-x-1">
											<Building2 className="h-4 w-4" />
											<span>Industries</span>
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink
											onClick={() => setNavState({ level: "industry" })}
											className="cursor-pointer hover:text-green-600 flex items-center space-x-1"
										>
											<Building2 className="h-4 w-4" />
											<span>Industries</span>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
								{breadcrumbs.map((crumb, index) => (
									<div key={index} className="flex items-center">
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											{index === breadcrumbs.length - 1 ? (
												<BreadcrumbPage className="font-medium">
													{crumb.label}
												</BreadcrumbPage>
											) : (
												<BreadcrumbLink
													onClick={() => navigateToBreadcrumb(crumb.level)}
													className="cursor-pointer hover:text-green-600"
												>
													{crumb.label}
												</BreadcrumbLink>
											)}
										</BreadcrumbItem>
									</div>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>

					<div className="divide-y divide-gray-100">
						{currentData.map((item, _index) => (
							<div key={item.id} className="group">
								{/* Main Item Row */}
								<div
									className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
									onClick={() => {
										if (navState.level === "product") {
											setSelectedProduct(item as Product);
										} else if (navState.level === "solutionVariant") {
											// For solution variants, show comparison dialog
											setSelectedSolutionVariant(item as SolutionVariant);
											setComparisonDialogOpen(true);
										} else {
											let nextLevel: NavigationLevel;
											switch (navState.level) {
												case "industry":
													nextLevel = "technology";
													break;
												case "technology":
													nextLevel = "solution";
													break;
												case "solution":
													nextLevel = "solutionVariant";
													break;
												default:
													nextLevel = "technology";
											}
											navigateToLevel(nextLevel, item.id);
										}
									}}
								>
									{/* Left Side - Icon, Name, Description */}
									<div className="flex items-center space-x-4 flex-1 min-w-0">
										{/* Icon */}
										<div className="flex-shrink-0">
											<div className="p-2 rounded-lg bg-gray-100 group-hover:bg-green-100 transition-colors">
												{getIconForCategory(navState.level, item.name)}
											</div>
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-3 mb-1">
												<h3 className="text-base font-semibold text-gray-900 truncate">
													{item.name}
												</h3>
												<Badge
													variant="outline"
													className="text-xs flex-shrink-0"
												>
													{item.category}
												</Badge>
												{navState.level === "solutionVariant" && (
													<Badge
														variant="secondary"
														className="bg-blue-100 text-blue-800 border-blue-200 text-xs flex-shrink-0"
													>
														<Gauge className="h-3 w-3 mr-1" />
														Click to Compare
													</Badge>
												)}
												{navState.level === "product" && (
													<Badge
														variant="secondary"
														className="bg-green-100 text-green-800 border-green-200 text-xs flex-shrink-0"
													>
														<Star className="h-3 w-3 mr-1" />
														{(item as Product).efficiency}
													</Badge>
												)}
											</div>
											<p className="text-sm text-gray-600 truncate">
												{item.description}
											</p>
											{navState.level === "product" && (
												<p className="text-xs text-gray-500 mt-1 font-mono">
													Model: {(item as Product).model}
												</p>
											)}
										</div>
									</div>

									{/* Right Side - Metadata and Actions */}
									<div className="flex items-center space-x-3 flex-shrink-0">
										{/* Count Badge for non-products */}
										{navState.level !== "product" && (
											<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
												{navState.level === "industry" &&
													`${(item as Industry).technologies?.length || 0} Technologies`}
												{navState.level === "technology" &&
													`${(item as Technology).solutions?.length || 0} Solutions`}
												{navState.level === "solution" &&
													`${
														(item as Solution).solutionVariants?.length || 0
													} Solution Variants`}
												{navState.level === "solutionVariant" &&
													`${(item as SolutionVariant).products?.length || 0} Products`}
											</div>
										)}

										{/* Product Image Thumbnail */}
										{navState.level === "product" && (
											<div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
												<Image
													src={`/images/image-placeholder-base.webp`}
													alt={item.name}
													width={48}
													height={48}
													className="w-full h-full object-cover"
												/>
											</div>
										)}

										{/* Action Buttons */}
										<div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
											{navState.level === "product" ? (
												<>
													<Button
														size="sm"
														variant="outline"
														className="h-8 px-3"
													>
														<Eye className="h-3 w-3 mr-1" />
														View
													</Button>
													<Button
														size="sm"
														className="h-8 px-3 bg-green-600 hover:bg-green-700"
													>
														Quote
													</Button>
												</>
											) : (
												<Button size="sm" variant="ghost" className="h-8 px-3">
													<ChevronRight className="h-4 w-4" />
												</Button>
											)}
										</div>
									</div>
								</div>

								{/* Expandable Details Section (for products) */}
								{navState.level === "product" && (
									<div className="px-6 pb-4 bg-gray-50 border-t border-gray-100 hidden group-hover:block">
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
											{/* Quick Specs */}
											<div>
												<h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
													Key Specs
												</h5>
												<div className="space-y-1 text-xs text-gray-600">
													<div className="flex justify-between">
														<span>Power:</span>
														<span className="font-medium">
															{(item as Product).specifications.powerRating}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Dimensions:</span>
														<span className="font-medium">
															{(item as Product).specifications.dimensions}
														</span>
													</div>
												</div>
											</div>

											{/* Top Features */}
											<div>
												<h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
													Top Features
												</h5>
												<div className="space-y-1">
													{(item as Product).features
														.slice(0, 2)
														.map((feature, idx) => (
															<div
																key={idx}
																className="flex items-center space-x-2"
															>
																<div className="w-1 h-1 bg-green-500 rounded-full"></div>
																<span className="text-xs text-gray-600">
																	{feature}
																</span>
															</div>
														))}
												</div>
											</div>

											{/* Certifications */}
											<div>
												<h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
													Certifications
												</h5>
												<div className="flex flex-wrap gap-1">
													{(item as Product).specifications.certifications
														.split(", ")
														.map((cert, idx) => (
															<Badge
																key={idx}
																variant="outline"
																className="text-xs px-2 py-0"
															>
																{cert}
															</Badge>
														))}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Empty State */}
					{currentData.length === 0 && (
						<div className="flex flex-col items-center justify-center h-64 text-gray-500">
							<Package className="h-12 w-12 mb-4 opacity-50" />
							<h3 className="text-lg font-medium mb-2">No items found</h3>
							<p className="text-sm">
								There are no {getLevelTitle().toLowerCase()} available at this
								level.
							</p>
						</div>
					)}
				</Card>

				{/* Product Detail Modal */}
				<Dialog
					open={!!selectedProduct}
					onOpenChange={() => setSelectedProduct(null)}
				>
					<DialogContent
						className="!w-[98vw] !max-w-[1400px] max-h-[95vh] overflow-y-auto"
						style={{ width: "98vw", maxWidth: "1400px" }}
					>
						<DialogHeader>
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0">
									<Image
										src={`/images/image-placeholder-base.webp`}
										alt={selectedProduct?.name || "Product"}
										width={300}
										height={200}
										className="rounded-lg object-cover"
									/>
								</div>
								<div className="flex-1">
									<DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
										{selectedProduct?.name}
									</DialogTitle>
									<DialogDescription className="text-gray-600 mb-4">
										{selectedProduct?.description}
									</DialogDescription>
									<div className="flex items-center space-x-3">
										<Badge
											variant="outline"
											className="bg-blue-50 text-blue-700 border-blue-200"
										>
											{selectedProduct?.category}
										</Badge>
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-800 border-green-200"
										>
											<Star className="h-3 w-3 mr-1" />
											{selectedProduct?.efficiency}
										</Badge>
									</div>
								</div>
							</div>
						</DialogHeader>

						{selectedProduct && (
							<div className="space-y-6 mt-6 overflow-y-auto">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-4">
										<h4 className="font-semibold text-gray-900 flex items-center space-x-2">
											<Package className="h-5 w-5 text-blue-600" />
											<span>Product Details</span>
										</h4>
										<div className="bg-gray-50 rounded-lg p-4 space-y-3">
											<div className="flex justify-between items-center">
												<span className="text-gray-600">Model:</span>
												<span className="font-mono font-medium bg-white px-2 py-1 rounded text-sm">
													{selectedProduct.model}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-gray-600">Category:</span>
												<Badge variant="outline">
													{selectedProduct.category}
												</Badge>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-gray-600">Efficiency:</span>
												<Badge
													variant="secondary"
													className="bg-green-100 text-green-800"
												>
													{selectedProduct.efficiency}
												</Badge>
											</div>
										</div>
									</div>

									<div className="space-y-4">
										<h4 className="font-semibold text-gray-900 flex items-center space-x-2">
											<Gauge className="h-5 w-5 text-purple-600" />
											<span>Specifications</span>
										</h4>
										<div className="bg-gray-50 rounded-lg p-4 space-y-3">
											{Object.entries(selectedProduct.specifications).map(
												([key, value]) => (
													<div
														key={key}
														className="flex justify-between items-center"
													>
														<span className="text-gray-600 capitalize text-sm">
															{key.replace(/([A-Z])/g, " $1")}:
														</span>
														<span className="font-medium text-sm bg-white px-2 py-1 rounded">
															{value}
														</span>
													</div>
												)
											)}
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h4 className="font-semibold text-gray-900 flex items-center space-x-2">
										<Star className="h-5 w-5 text-yellow-600" />
										<span>Key Features</span>
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{selectedProduct.features.map((feature, index) => (
											<div
												key={index}
												className="flex items-center space-x-3 bg-green-50 p-3 rounded-lg"
											>
												<div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
												<span className="text-sm text-gray-700">{feature}</span>
											</div>
										))}
									</div>
								</div>

								<div className="flex space-x-3 pt-4 border-t">
									<Button
										variant="outline"
										className="flex-1 border-green-200 hover:bg-green-50"
									>
										<Eye className="h-4 w-4 mr-2" />
										Download Datasheet
									</Button>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* Add New Feature Dialog */}
				<AddNewFeature
					open={addDialogOpen}
					onOpenChange={setAddDialogOpen}
					onSubmit={handleNewProductSubmit}
				/>

				{/* Comparison Dialog */}
				<Dialog
					open={comparisonDialogOpen}
					onOpenChange={setComparisonDialogOpen}
				>
					<DialogContent className="max-w-4xl">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold text-gray-900">
								{selectedSolutionVariant?.name}
							</DialogTitle>
							<DialogDescription className="text-gray-600">
								Choose how you&apos;d like to explore this solution variant
							</DialogDescription>
						</DialogHeader>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
							{/* View Products Card */}
							<Card
								className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-200"
								onClick={() => {
									setComparisonDialogOpen(false);
									setNavState({
										...navState,
										level: "product",
										solutionVariantId: selectedSolutionVariant?.id,
									});
								}}
							>
								<CardHeader className="pb-4">
									<div className="flex items-center space-x-4">
										<div className="p-3 rounded-lg bg-green-100">
											<Package className="h-7 w-7 text-green-600" />
										</div>
										<div>
											<CardTitle className="text-xl text-gray-900">
												View Products
											</CardTitle>
											<CardDescription className="text-sm text-gray-600 mt-1">
												Browse available products in this solution variant
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-600">Products Available:</span>
											<Badge
												variant="outline"
												className="bg-green-50 text-green-700 border-green-200"
											>
												{selectedSolutionVariant?.products?.length || 0}
											</Badge>
										</div>
										<div className="text-sm text-gray-500">
											Explore detailed specifications, features, and pricing for
											each product
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Compare Calculator Card */}
							<Card
								className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
								onClick={() => {
									setComparisonDialogOpen(false);
									// TODO: Navigate to comparison calculator page
									console.log(
										"Navigate to comparison calculator for:",
										selectedSolutionVariant?.name
									);
								}}
							>
								<CardHeader className="pb-4">
									<div className="flex items-center space-x-4">
										<div className="p-3 rounded-lg bg-blue-100">
											<Gauge className="h-7 w-7 text-blue-600" />
										</div>
										<div>
											<CardTitle className="text-xl text-gray-900">
												Compare Calculator
											</CardTitle>
											<CardDescription className="text-sm text-gray-600 mt-1">
												Compare this solution with alternatives
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-600">Comparison Type:</span>
											<Badge
												variant="outline"
												className="bg-blue-50 text-blue-700 border-blue-200"
											>
												ROI Analysis
											</Badge>
										</div>
										<div className="text-sm text-gray-500">
											Calculate ROI, efficiency gains, and cost savings vs.
											alternatives
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</SidebarInset>
	);
}
