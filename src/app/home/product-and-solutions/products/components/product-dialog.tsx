"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Package,
	Thermometer,
	Droplets,
	Wind,
	Zap,
	Ruler,
	Weight,
	Shield,
	CheckCircle,
	Clock,
	FileText,
	Settings,
	Calculator,
	Building2,
} from "lucide-react";

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

interface ProductDialogProps {
	product: ProductWithSolution | null;
	isOpen: boolean;
	onClose: () => void;
	isEditMode?: boolean;
	onRemove?: (productId: string) => void;
	onEdit?: (product: ProductWithSolution) => void;
	isRemoving?: boolean;
}

export function ProductDialog({
	product,
	isOpen,
	onClose,
	isEditMode = false,
	onRemove,
	onEdit,
	isRemoving = false,
}: ProductDialogProps) {
	if (!product) return null;

	const statusColors = {
		pending: "bg-yellow-100 text-yellow-800",
		verified: "bg-green-100 text-green-800",
		draft: "bg-gray-100 text-gray-800",
	} as const;

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <Clock className="h-4 w-4" />;
			case "verified":
				return <CheckCircle className="h-4 w-4" />;
			case "draft":
				return <FileText className="h-4 w-4" />;
			default:
				return null;
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category.toLowerCase()) {
			case "immersion cooling":
				return <Droplets className="h-4 w-4" />;
			case "air conditioning":
			case "free cooling":
				return <Wind className="h-4 w-4" />;
			case "hybrid cooling":
			case "thermal control":
			case "thermal management":
				return <Thermometer className="h-4 w-4" />;
			default:
				return <Package className="h-4 w-4" />;
		}
	};

	const handleRemove = () => {
		if (onRemove) {
			onRemove(product.id);
		}
	};

	const handleEdit = () => {
		if (onEdit) {
			onEdit(product);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gray-100">
								{getCategoryIcon(product.category)}
							</div>
							<div>
								<DialogTitle className="text-xl font-semibold">
									{product.name}
								</DialogTitle>
								<DialogDescription className="text-sm text-muted-foreground">
									{product.model}
								</DialogDescription>
							</div>
						</div>
						<Badge
							variant="outline"
							className={`${
								statusColors[product.status]
							} flex items-center gap-1`}
						>
							{getStatusIcon(product.status)}
							{product.status}
						</Badge>
					</div>
				</DialogHeader>

				<div className="space-y-6">
					{/* Description */}
					<div>
						<h3 className="text-sm font-medium text-gray-900 mb-2">
							Description
						</h3>
						<p className="text-sm text-gray-600">{product.description}</p>
					</div>

					{/* Key Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-4">
							<div>
								<h3 className="text-sm font-medium text-gray-900 mb-2">
									Key Information
								</h3>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4 text-green-600" />
										<span className="text-sm">
											<span className="font-medium">Efficiency:</span>{" "}
											{product.efficiency}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Package className="h-4 w-4 text-blue-600" />
										<span className="text-sm">
											<span className="font-medium">Category:</span>{" "}
											{product.category}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Settings className="h-4 w-4 text-gray-600" />
										<span className="text-sm">
											<span className="font-medium">Parameters:</span>{" "}
											{product.parameterCount}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Calculator className="h-4 w-4 text-purple-600" />
										<span className="text-sm">
											<span className="font-medium">Calculations:</span>{" "}
											{product.calculationOverview}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-medium text-gray-900 mb-2">
									Solution Information
								</h3>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Building2 className="h-4 w-4 text-indigo-600" />
										<span className="text-sm">
											<span className="font-medium">Solution:</span>{" "}
											{product.solutionName}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Package className="h-4 w-4 text-gray-600" />
										<span className="text-sm">
											<span className="font-medium">Category:</span>{" "}
											{product.solutionCategory}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-900 mb-2">
								Specifications
							</h3>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-yellow-600" />
									<span className="text-sm">
										<span className="font-medium">Power Rating:</span>{" "}
										{product.specifications.powerRating}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Thermometer className="h-4 w-4 text-red-600" />
									<span className="text-sm">
										<span className="font-medium">Cooling Capacity:</span>{" "}
										{product.specifications.coolingCapacity}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Ruler className="h-4 w-4 text-blue-600" />
									<span className="text-sm">
										<span className="font-medium">Dimensions:</span>{" "}
										{product.specifications.dimensions}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Weight className="h-4 w-4 text-gray-600" />
									<span className="text-sm">
										<span className="font-medium">Weight:</span>{" "}
										{product.specifications.weight}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Thermometer className="h-4 w-4 text-orange-600" />
									<span className="text-sm">
										<span className="font-medium">Operating Temperature:</span>{" "}
										{product.specifications.operatingTemperature}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-green-600" />
									<span className="text-sm">
										<span className="font-medium">Certifications:</span>{" "}
										{product.specifications.certifications}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Features */}
					<div>
						<h3 className="text-sm font-medium text-gray-900 mb-2">Features</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							{product.features.map((feature, index) => (
								<div key={index} className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
									<span className="text-sm text-gray-600">{feature}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex justify-end gap-2 pt-4 border-t">
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
					{onEdit && (
						<Button onClick={handleEdit} variant="outline">
							<Package className="h-4 w-4 mr-2" />
							Edit Product
						</Button>
					)}
					{onRemove && (
						<Button
							onClick={handleRemove}
							variant="destructive"
							disabled={isRemoving}
						>
							{isRemoving ? "Removing..." : "Remove Product"}
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
} 