"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Package } from "lucide-react";

interface SolutionVariant {
	id: string;
	name: string;
	description: string;
	icon: string;
	solution_id: string;
}

interface CreateProductStep2Props {
	formData: {
		name: string;
		description: string;
		model: string;
		specifications: Array<{
			id: string;
			key: string;
			value: string;
		}>;
		specificationCategories: Array<{
			id: string;
			name: string;
			specifications: Array<{
				id: string;
				key: string;
				value: string;
			}>;
		}>;
		features: string[];
		selectedSolutionVariant?: string;
	};
	selectedSolution: any;
	solutionVariants: SolutionVariant[];
	onFormDataChange: (updates: Partial<{
		name: string;
		description: string;
		model: string;
		specifications: Array<{
			id: string;
			key: string;
			value: string;
		}>;
		specificationCategories: Array<{
			id: string;
			name: string;
			specifications: Array<{
				id: string;
				key: string;
				value: string;
			}>;
		}>;
		features: string[];
		selectedSolutionVariant?: string;
	}>) => void;
	onFeatureChange: (index: number, value: string) => void;
	onAddFeature: () => void;
	onRemoveFeature: (index: number) => void;
	onSpecificationChange: (
		index: number,
		field: "key" | "value",
		value: string
	) => void;
	onAddSpecification: () => void;
	onRemoveSpecification: (index: number) => void;
	onAddSpecificationCategory: () => void;
	onRemoveSpecificationCategory: (categoryIndex: number) => void;
	onSpecificationCategoryChange: (categoryIndex: number, name: string) => void;
	onCategorySpecificationChange: (
		categoryIndex: number,
		specIndex: number,
		field: "key" | "value",
		value: string
	) => void;
	onAddCategorySpecification: (categoryIndex: number) => void;
	onRemoveCategorySpecification: (categoryIndex: number, specIndex: number) => void;
}

export function CreateProductStep2({
	formData,
	selectedSolution,
	solutionVariants,
	onFormDataChange,
	onFeatureChange,
	onAddFeature,
	onRemoveFeature,
	onSpecificationChange,
	onAddSpecification,
	onRemoveSpecification,
	onAddSpecificationCategory,
	onRemoveSpecificationCategory,
	onSpecificationCategoryChange,
	onCategorySpecificationChange,
	onAddCategorySpecification,
	onRemoveCategorySpecification,
}: CreateProductStep2Props) {
	const handleInputChange = (field: string, value: string) => {
		onFormDataChange({ [field]: value });
	};

	const handleVariantSelect = (variantId: string) => {
		onFormDataChange({ selectedSolutionVariant: variantId });
	};

	const getIconComponent = (iconName: string) => {
		// Simple icon mapping - you can expand this as needed
		const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
			Package,
		};
		return iconMap[iconName] || Package;
	};

	return (
		<div className="h-[calc(100vh-400px)] overflow-y-auto">
			<div className="space-y-4 p-1">
				{/* Solution Variants Selection */}
				<div className="space-y-3">
					<div>
						<Label className="text-sm font-medium">Solution Variant</Label>
						<p className="text-xs text-muted-foreground">
							Select a specific variant for this product, or choose "No Variant" to apply globally to the solution
						</p>
					</div>

					<div className="flex items-center gap-3">
						<Select onValueChange={handleVariantSelect} defaultValue={formData.selectedSolutionVariant || "no-variant"}>
							<SelectTrigger className="w-[250px]">
								<SelectValue placeholder="Select a variant" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="no-variant">
									<div className="flex items-center gap-2">
										<Package className="h-4 w-4 text-gray-600" />
										<span>No Variant (Global)</span>
									</div>
								</SelectItem>
								{solutionVariants.map((variant) => (
									<SelectItem key={variant.id} value={variant.id}>
										<div className="flex items-center gap-2">
											<div className="flex items-center justify-center bg-gray-100 rounded-lg p-1">
												{(() => {
													const IconComponent = getIconComponent(variant.icon);
													return <IconComponent className="h-3 w-3 text-gray-600" />;
												})()}
											</div>
											<span>{variant.name}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Variant Count Badge */}
						{solutionVariants.length > 0 && (
							<Badge variant="outline" className="text-xs">
								{solutionVariants.length} variant{solutionVariants.length !== 1 ? 's' : ''} available
							</Badge>
						)}
					</div>

					{/* Selected Variant Info */}
					{formData.selectedSolutionVariant && formData.selectedSolutionVariant !== "no-variant" && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
							<div className="flex items-center gap-2 mb-1">
								{(() => {
									const selectedVariant = solutionVariants.find(v => v.id === formData.selectedSolutionVariant);
									if (!selectedVariant) return null;
									const IconComponent = getIconComponent(selectedVariant.icon);
									return <IconComponent className="h-4 w-4 text-blue-600" />;
								})()}
								<span className="font-medium text-sm text-blue-900">
									{(() => {
										const selectedVariant = solutionVariants.find(v => v.id === formData.selectedSolutionVariant);
										return selectedVariant?.name || "Selected Variant";
									})()}
								</span>
							</div>
							<p className="text-xs text-blue-700">
								{(() => {
									const selectedVariant = solutionVariants.find(v => v.id === formData.selectedSolutionVariant);
									return selectedVariant?.description || "";
								})()}
							</p>
						</div>
					)}

					{/* Global Application Info */}
					{formData.selectedSolutionVariant === "no-variant" && (
						<div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
							<div className="flex items-center gap-2 mb-1">
								<Package className="h-4 w-4 text-gray-600" />
								<span className="font-medium text-sm text-gray-900">Global Application</span>
							</div>
							<p className="text-xs text-gray-600">
								This product will be applied globally to the solution and available to all variants
							</p>
						</div>
					)}

			
				</div>

				{/* Basic Information */}
				<Card>
					<CardHeader className="pb-1">
						<CardTitle className="text-sm">Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 pt-0">
						<div>
							<Label className="text-xs font-medium">Product Name *</Label>
							<Input
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								placeholder="Enter product name"
								className="mt-1 text-xs h-8"
							/>
						</div>

						<div>
							<Label className="text-xs font-medium">Model *</Label>
							<Input
								value={formData.model}
								onChange={(e) => handleInputChange("model", e.target.value)}
								placeholder="Enter model number"
								className="mt-1 text-xs h-8"
							/>
						</div>

						<div>
							<Label className="text-xs font-medium">Description *</Label>
							<Textarea
								value={formData.description}
								onChange={(e) => handleInputChange("description", e.target.value)}
								placeholder="Enter product description"
								className="mt-1 text-xs"
								rows={2}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Features */}
				<Card>
					<CardHeader className="pb-1">
						<div className="flex items-center justify-between">
							<CardTitle className="text-sm">Features</CardTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onAddFeature}
								className="h-6 px-2 text-xs"
							>
								<Plus className="h-3 w-3 mr-1" />
								Add Feature
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Add key features and capabilities of your product (e.g., "Wireless connectivity", "Real-time monitoring", "Cloud integration")
						</p>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-2">
							{formData.features.map((feature, index) => (
								<div key={index} className="flex items-center gap-2">
									<Input
										value={feature}
										onChange={(e) => onFeatureChange(index, e.target.value)}
										placeholder="Enter feature"
										className="flex-1 text-xs h-8"
									/>
									{formData.features.length > 1 && (
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => onRemoveFeature(index)}
											className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
										>
											<X className="h-3 w-3" />
										</Button>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Specifications */}
				<Card>
					<CardHeader className="pb-1">
						<div className="flex items-center justify-between">
							<CardTitle className="text-sm">Specifications</CardTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onAddSpecificationCategory}
								className="h-6 px-2 text-xs"
							>
								<Plus className="h-3 w-3 mr-1" />
								Add Category
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Create specification categories and add technical specifications within each category (e.g., "Dimensions and Weight", "Power Requirements", "Network Specifications")
						</p>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="space-y-3">
							{(formData.specificationCategories || []).map((category, categoryIndex) => (
								<div key={category.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
									<div className="flex items-center gap-2 mb-3">
										<Input
											value={category.name}
											onChange={(e) => onSpecificationCategoryChange(categoryIndex, e.target.value)}
											placeholder="Category name (e.g., Dimensions and Weight)"
											className="flex-1 text-xs h-8"
										/>
										{(formData.specificationCategories || []).length > 1 && (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => onRemoveSpecificationCategory(categoryIndex)}
												className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
											>
												<X className="h-3 w-3" />
											</Button>
										)}
									</div>
									<div className="space-y-2">
										{category.specifications.map((spec, specIndex) => (
											<div key={spec.id} className="flex items-center gap-2">
												<Input
													value={spec.key}
													onChange={(e) => onCategorySpecificationChange(categoryIndex, specIndex, "key", e.target.value)}
													placeholder="Specification name"
													className="flex-1 text-xs h-8"
												/>
												<Input
													value={spec.value}
													onChange={(e) => onCategorySpecificationChange(categoryIndex, specIndex, "value", e.target.value)}
													placeholder="Value"
													className="flex-1 text-xs h-8"
												/>
												{category.specifications.length > 1 && (
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => onRemoveCategorySpecification(categoryIndex, specIndex)}
														className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
													>
														<X className="h-3 w-3" />
													</Button>
												)}
											</div>
										))}
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => onAddCategorySpecification(categoryIndex)}
											className="h-6 px-2 text-xs"
										>
											<Plus className="h-3 w-3 mr-1" />
											Add Specification
										</Button>
									</div>
								</div>
							))}
							{(formData.specificationCategories || []).length === 0 && (
								<div className="text-center py-4 text-gray-500 text-xs">
									No specification categories added yet. Click "Add Category" to get started.
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
