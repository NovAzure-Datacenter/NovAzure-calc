"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Edit,
	MoreHorizontal,
	Trash2,
	Eye,
	Package,
	Settings,
	Thermometer,
	Droplets,
	Wind,
	Zap,
	CheckCircle,
	Clock,
	FileText,
} from "lucide-react";
import { mockSolutions } from "../../mock-data";
import { toast } from "sonner";
import { ProductDialog } from "./product-dialog";

interface Product {
	id: string;
	name: string;
	description: string;
	model: string;
	category: string;
	efficiency: string;
	specifications: {
		powerRating: string;
		coolingCapacity: string;
		dimensions: string;
		weight: string;
		operatingTemperature: string;
		certifications: string;
	};
	features: string[];
	status: "pending" | "verified" | "draft";
	parameterCount: number;
	calculationOverview: string;
}

interface ProductWithSolution extends Product {
	solutionId: string;
	solutionName: string;
	solutionCategory: string;
}

interface ProductsListProps {
	searchQuery: string;
	viewMode: "table" | "grid";
}

export function ProductsList({ searchQuery, viewMode }: ProductsListProps) {
	const [products, setProducts] = useState<ProductWithSolution[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<ProductWithSolution | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	// Load products from mock solutions
	useEffect(() => {
		const loadProducts = () => {
			setIsLoading(true);
			try {
				const allProducts: ProductWithSolution[] = [];
				
				mockSolutions.forEach((solution) => {
					solution.products.forEach((product) => {
						allProducts.push({
							...product,
							solutionId: solution.id,
							solutionName: solution.name,
							solutionCategory: solution.category,
						});
					});
				});
				
				setProducts(allProducts);
			} catch (error) {
				console.error("Error loading products:", error);
				toast.error("Failed to load products");
			} finally {
				setIsLoading(false);
			}
		};

		loadProducts();
	}, []);

	// Filter products based on search query
	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
		product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
		product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
		product.solutionName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const statusColors = {
		pending: "bg-yellow-100 text-yellow-800",
		verified: "bg-green-100 text-green-800",
		draft: "bg-gray-100 text-gray-800",
	} as const;

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <Clock className="h-3 w-3" />;
			case "verified":
				return <CheckCircle className="h-3 w-3" />;
			case "draft":
				return <FileText className="h-3 w-3" />;
			default:
				return null;
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category.toLowerCase()) {
			case "immersion cooling":
				return <Droplets className="h-3 w-3" />;
			case "air conditioning":
			case "free cooling":
				return <Wind className="h-3 w-3" />;
			case "hybrid cooling":
			case "thermal control":
			case "thermal management":
				return <Thermometer className="h-3 w-3" />;
			default:
				return <Package className="h-3 w-3" />;
		}
	};

	const handleDropdownButtonClick = (
		e: React.MouseEvent,
		productId: string
	) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === productId ? null : productId);
	};

	const handleDropdownItemClick = async (
		action: string,
		productId: string
	) => {
		setOpenDropdown(null);
		const product = products.find((p) => p.id === productId);
		if (!product) return;

		if (action === "View") {
			setSelectedProduct(product);
			setIsEditMode(false);
			setIsDialogOpen(true);
		} else if (action === "Edit") {
			setSelectedProduct(product);
			setIsEditMode(true);
			setIsDialogOpen(true);
		} else if (action === "Remove") {
			// Handle remove logic
			setIsRemoving(productId);
			try {
				// Simulate API call
				await new Promise(resolve => setTimeout(resolve, 1000));
				setProducts(products.filter(p => p.id !== productId));
				toast.success("Product removed successfully!");
			} catch (error) {
				console.error("Error removing product:", error);
				toast.error("Failed to remove product");
			} finally {
				setIsRemoving(null);
			}
		}
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedProduct(null);
		setIsEditMode(false);
	};

	const handleRemoveProduct = async (productId: string) => {
		setIsRemoving(productId);
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			setProducts(products.filter(p => p.id !== productId));
			toast.success("Product removed successfully!");
			handleDialogClose();
		} catch (error) {
			console.error("Error removing product:", error);
			toast.error("Failed to remove product");
		} finally {
			setIsRemoving(null);
		}
	};

	const handleEditProduct = (product: ProductWithSolution) => {
		console.log("Editing product:", product.name);
		// In a real app, you would navigate to edit page or open edit form
		// For now, we'll just log the action
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<span className="ml-2">Loading products...</span>
			</div>
		);
	}

	if (viewMode === "grid") {
		return (
			<>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-full">
					{filteredProducts.map((product) => (
						<Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="p-2 rounded-lg bg-gray-100">
										{getCategoryIcon(product.category)}
									</div>
									<div>
										<h3 className="font-medium text-sm">{product.name}</h3>
										<p className="text-xs text-muted-foreground">{product.model}</p>
									</div>
								</div>
								<Badge
									variant="outline"
									className={`text-xs ${
										statusColors[product.status]
									}`}
								>
									{getStatusIcon(product.status)}
									<span className="ml-1">{product.status}</span>
								</Badge>
							</div>
							
							<div className="space-y-2 mb-3">
								<p className="text-xs text-gray-600 line-clamp-2">
									{product.description}
								</p>
								<div className="flex items-center gap-2">
									<Zap className="h-3 w-3 text-green-600" />
									<span className="text-xs font-medium">{product.efficiency}</span>
								</div>
								<div className="text-xs text-muted-foreground">
									Solution: {product.solutionName}
								</div>
							</div>

							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<Settings className="h-3 w-3 text-gray-600" />
									<span className="text-xs">{product.parameterCount} params</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setSelectedProduct(product);
										setIsEditMode(false);
										setIsDialogOpen(true);
									}}
									className="h-6 px-2 text-xs"
								>
									<Eye className="h-3 w-3 mr-1" />
									View
								</Button>
							</div>
						</Card>
					))}
				</div>

				{/* Product Dialog */}
				<ProductDialog
					product={selectedProduct}
					isOpen={isDialogOpen}
					onClose={handleDialogClose}
					isEditMode={isEditMode}
					onRemove={handleRemoveProduct}
					onEdit={handleEditProduct}
					isRemoving={isRemoving !== null}
				/>
			</>
		);
	}

	return (
		<>
			<div className="h-[calc(100vh-200px)] overflow-y-auto max-w-full">
				<div className="overflow-x-auto">
					<Card className="rounded-md border p-2 min-w-[1200px] max-w-full">
						<TooltipProvider>
							<Table>
								<TableHeader>
									<TableRow className="border-b">
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-48">
											Product
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-32">
											Solution
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-24">
											Model
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-20">
											Category
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Efficiency
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-20">
											Power Rating
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-20">
											Cooling Capacity
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Status
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Params
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-10">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredProducts.map((product) => (
										<TableRow key={product.id} className="hover:bg-muted/50">
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-2">
													<div className="flex items-center justify-center bg-gray-100 rounded w-4 h-4 flex-shrink-0">
														<Package className="h-2.5 w-2.5 text-gray-600" />
													</div>
													<div className="min-w-0 flex-1">
														<div className="font-medium text-xs truncate">
															{product.name}
														</div>
														<div className="text-xs text-muted-foreground truncate">
															{product.description}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="min-w-0">
													<div className="text-xs font-medium truncate">
														{product.solutionName}
													</div>
													<div className="text-xs text-muted-foreground truncate">
														{product.solutionCategory}
													</div>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs font-mono text-muted-foreground">
													{product.model}
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-1">
													{getCategoryIcon(product.category)}
													<Badge variant="outline" className="text-xs px-1 py-0">
														{product.category}
													</Badge>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-1">
													<Zap className="h-3 w-3 text-green-600 flex-shrink-0" />
													<span className="text-xs font-medium">
														{product.efficiency}
													</span>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs text-muted-foreground">
													{product.specifications.powerRating}
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs text-muted-foreground">
													{product.specifications.coolingCapacity}
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<Badge
													variant="outline"
													className={`text-xs px-1 py-0 ${
														statusColors[product.status]
													}`}
												>
													{getStatusIcon(product.status)}
													<span className="ml-0.5 text-xs">
														{product.status}
													</span>
												</Badge>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-1">
													<Settings className="h-3 w-3 text-gray-600 flex-shrink-0" />
													<span className="text-xs">
														{product.parameterCount}
													</span>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="relative dropdown-container">
													<Button
														variant="ghost"
														className="h-4 w-4 p-0"
														onClick={(e) =>
															handleDropdownButtonClick(e, product.id)
														}
													>
														<MoreHorizontal className="h-2.5 w-2.5" />
													</Button>

													{openDropdown === product.id && (
														<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("View", product.id)
																}
															>
																<Eye className="h-3 w-3" />
																View
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("Edit", product.id)
																}
															>
																<Edit className="h-3 w-3" />
																Edit
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
																onClick={() =>
																	handleDropdownItemClick("Remove", product.id)
																}
																disabled={isRemoving === product.id}
															>
																<Trash2 className="h-3 w-3" />
																{isRemoving === product.id
																	? "Removing..."
																	: "Remove"}
															</button>
														</div>
													)}
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TooltipProvider>
					</Card>
				</div>
			</div>

			{/* Product Dialog */}
			<ProductDialog
				product={selectedProduct}
				isOpen={isDialogOpen}
				onClose={handleDialogClose}
				isEditMode={isEditMode}
				onRemove={handleRemoveProduct}
				onEdit={handleEditProduct}
				isRemoving={isRemoving !== null}
			/>
		</>
	);
}
