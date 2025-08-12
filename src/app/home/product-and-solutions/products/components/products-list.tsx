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
	Ruler,
	Weight,
	Shield,
	Tag,
	List,
	ThermometerIcon,
} from "lucide-react";
import { getProducts, deleteProduct } from "@/lib/actions/products/products";
import { getSolutions } from "@/lib/actions/solution/solution";
import { toast } from "sonner";
import { ProductDialog } from "./product-dialog";
import Loading from "@/components/loading-main";

interface Product {
	id: string;
	name: string;
	description: string;
	model: string;
	category: string;
	efficiency: string;
	specifications: Array<{
		key: string;
		value: string;
	}>;
	features: string[];
	status: "pending" | "verified" | "draft";
	solutionId: string;
	created_by: string;
	client_id: string;
	created_at: Date;
	updated_at: Date;
}

interface ProductWithSolution extends Product {
	solutionName: string;
	solutionCategory: string;
}

interface ProductsListProps {
	searchQuery: string;
	viewMode: "table" | "grid";
}

export function ProductsList({ searchQuery, viewMode }: ProductsListProps) {
	const [products, setProducts] = useState<ProductWithSolution[]>([]);
	const [solutions, setSolutions] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [selectedProduct, setSelectedProduct] =
		useState<ProductWithSolution | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	// Load products and solutions from MongoDB
	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			try {
				// Load products
				const productsResult = await getProducts();
				if (productsResult.error) {
					toast.error("Failed to load products");
					return;
				}

				// Load solutions for product enrichment
				const solutionsResult = await getSolutions();
				if (solutionsResult.error) {
					toast.error("Failed to load solutions");
				} else {
					setSolutions(solutionsResult.solutions || []);
				}

				// Enrich products with solution information
				const enrichedProducts: ProductWithSolution[] = (productsResult.products || []).map((product: Product) => {
					const solution = solutionsResult.solutions?.find((s: any) => s.id === product.solutionId);
					return {
						...product,
						solutionName: solution?.solution_name || "Unknown Solution",
						solutionCategory: solution?.solution_type || "Unknown Category",
					};
				});

				setProducts(enrichedProducts);
			} catch (error) {
				console.error("Error loading products:", error);
				toast.error("Failed to load products");
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	// Filter products based on search query
	const filteredProducts = products.filter(
		(product) =>
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

	const handleDropdownItemClick = async (action: string, productId: string) => {
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
				const result = await deleteProduct(productId);
				if (result.error) {
					toast.error(result.error);
				} else {
					setProducts(products.filter((p) => p.id !== productId));
					toast.success("Product removed successfully!");
				}
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
			const result = await deleteProduct(productId);
			if (result.error) {
				toast.error(result.error);
			} else {
				setProducts(products.filter((p) => p.id !== productId));
				toast.success("Product removed successfully!");
				handleDialogClose();
			}
		} catch (error) {
			console.error("Error removing product:", error);
			toast.error("Failed to remove product");
		} finally {
			setIsRemoving(null);
		}
	};

	const handleEditProduct = (product: ProductWithSolution) => {
		// In a real app, you would navigate to edit page or open edit form
		// For now, we'll just log the action
	};

	if (isLoading) {
		return <Loading />;
	}

	if (viewMode === "grid") {
		return (
			<>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
					{filteredProducts.map((product) => (
						<Card
							key={product.id}
							className="p-4 hover:shadow-md transition-shadow h-fit"
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="p-2 rounded-lg bg-gray-100">
										{getCategoryIcon(product.category)}
									</div>
									<div>
										<h3 className="font-medium text-sm">{product.name}</h3>
										<p className="text-xs text-muted-foreground">
											{product.model}
										</p>
									</div>
								</div>
								<Badge
									variant="outline"
									className={`text-xs ${statusColors[product.status]}`}
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
									<Tag className="h-3 w-3 text-blue-600" />
									<span className="text-xs font-medium">
										{product.category}
									</span>
								</div>
								<div className="text-xs text-muted-foreground">
									Solution: {product.solutionName}
								</div>
							</div>

							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<Settings className="h-3 w-3 text-gray-600" />
									<span className="text-xs">
										{product.features.length} features
									</span>
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
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-20">
											Features
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-20">
											Specifications
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Status
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
													<Badge
														variant="outline"
														className="text-xs px-1 py-0"
													>
														{product.category}
													</Badge>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs text-muted-foreground">
													{product.features.length} items
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs text-muted-foreground">
													{product.specifications.length} specs
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<Badge
													variant="outline"
													className={`text-xs px-1 py-0 ${statusColors[product.status]}`}
												>
													{getStatusIcon(product.status)}
													<span className="ml-1">{product.status}</span>
												</Badge>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															onClick={(e) =>
																handleDropdownButtonClick(e, product.id)
															}
															className="h-6 w-6 p-0"
														>
															<MoreHorizontal className="h-3 w-3" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<div className="flex flex-col gap-1">
															<Button
																variant="ghost"
																size="sm"
																onClick={() =>
																	handleDropdownItemClick("View", product.id)
																}
																className="h-6 px-2 text-xs justify-start"
															>
																<Eye className="h-3 w-3 mr-1" />
																View
															</Button>
															<Button
																variant="ghost"
																size="sm"
																onClick={() =>
																	handleDropdownItemClick("Edit", product.id)
																}
																className="h-6 px-2 text-xs justify-start"
															>
																<Edit className="h-3 w-3 mr-1" />
																Edit
															</Button>
															<Button
																variant="ghost"
																size="sm"
																onClick={() =>
																	handleDropdownItemClick("Remove", product.id)
																}
																className="h-6 px-2 text-xs justify-start text-red-600 hover:text-red-700"
																disabled={isRemoving === product.id}
															>
																<Trash2 className="h-3 w-3 mr-1" />
																{isRemoving === product.id ? "Removing..." : "Remove"}
															</Button>
														</div>
													</TooltipContent>
												</Tooltip>
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
