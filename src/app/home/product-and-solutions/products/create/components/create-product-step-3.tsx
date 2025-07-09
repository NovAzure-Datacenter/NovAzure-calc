"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSolutionVariantsBySolutionId } from "@/lib/actions/solution-variant/solution-variant";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";

interface SolutionVariant {
	id: string;
	name: string;
	description: string;
	icon: string;
	solution_id: string;
	created_by: string;
	created_at: Date;
	updated_at: Date;
}

interface Solution {
	id: string;
	solution_name: string;
	solution_description: string;
	solution_type: string;
	solution_variants: string[];
	status: "draft" | "pending" | "verified";
	created_at: Date;
	updated_at: Date;
}

interface CreateProductStep3Props {
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
	selectedSolution: Solution | undefined;
	onFormDataChange: (
		updates: Partial<CreateProductStep3Props["formData"]>
	) => void;
}

export function CreateProductStep3({
	formData,
	selectedSolution,
	onFormDataChange,
}: CreateProductStep3Props) {
	const [solutionVariants, setSolutionVariants] = useState<SolutionVariant[]>(
		[]
	);
	const [loadingVariants, setLoadingVariants] = useState(false);
	const [errorVariants, setErrorVariants] = useState<string | null>(null);

	const cleanFeatures = formData.features.filter(
		(feature) => feature.trim() !== ""
	);
	
	const cleanSpecificationCategories = formData.specificationCategories?.filter(
		(category) => category.name.trim() !== "" && category.specifications.some(
			(spec) => spec.key.trim() !== "" && spec.value.trim() !== ""
		)
	) || [];

	const totalSpecifications = cleanSpecificationCategories.reduce(
		(total, category) => total + category.specifications.filter(
			(spec) => spec.key.trim() !== "" && spec.value.trim() !== ""
		).length, 0
	);

	const fetchVariants = async () => {
		if (!selectedSolution?.id) {
			setSolutionVariants([]);
			return;
		}

		setLoadingVariants(true);
		setErrorVariants(null);

		try {
			const result = await getSolutionVariantsBySolutionId(selectedSolution.id);
			if (result.error) {
				setErrorVariants(result.error);
				setSolutionVariants([]);
			} else {
				setSolutionVariants(result.solutionVariants || []);
			}
		} catch (error) {
			console.error("Error fetching solution variants:", error);
			setErrorVariants("Failed to load solution variants");
			setSolutionVariants([]);
		} finally {
			setLoadingVariants(false);
		}
	};

	useEffect(() => {
		fetchVariants();
	}, [selectedSolution?.id]);

	const handleVariantSelect = (variantId: string) => {
		onFormDataChange({ selectedSolutionVariant: variantId });
	};

	return (
		<div className="h-[calc(100vh-400px)] overflow-y-auto">
			<div className="space-y-4 p-1">
				{/* Selected Solution */}
				{selectedSolution && (
					<div className="p-3 bg-muted rounded-lg">
						<h4 className="font-medium mb-2 text-sm">Selected Solution</h4>
						<div className="space-y-1 text-xs">
							<p>
								<strong>Name:</strong> {selectedSolution.solution_name}
							</p>

							<p>
								<strong>Status:</strong>
								<Badge variant="outline" className="ml-2 text-xs">
									{selectedSolution.status}
								</Badge>
							</p>
							<p>
								<strong>Description:</strong>{" "}
								{selectedSolution.solution_description}
							</p>
						</div>
					</div>
				)}
				{/* Solution Variants */}
				<div className="space-y-3">
					{loadingVariants ? (
						<p className="text-xs text-muted-foreground">Loading variants...</p>
					) : errorVariants ? (
						<p className="text-xs text-red-500">{errorVariants}</p>
					) : solutionVariants.length > 0 ? (
						<>
							{/* Selected Variant Display */}
							{formData.selectedSolutionVariant && (
								<div className="p-3 bg-green-50 border border-green-200 rounded-md">
									<h5 className="font-medium text-sm mb-2 text-green-800">
										Selected Variant
									</h5>
									{(() => {
										const selectedVariant = solutionVariants.find(
											(v) => v.id === formData.selectedSolutionVariant
										);
										return selectedVariant ? (
											<div className="flex items-center gap-2">
												{React.createElement(
													stringToIconComponent(selectedVariant.icon),
													{
														className: "w-4 h-4 text-green-600",
													}
												)}
												<div>
													<p className="text-sm font-medium text-green-800">
														{selectedVariant.name}
													</p>
													<p className="text-xs text-green-600">
														{selectedVariant.description}
													</p>
												</div>
											</div>
										) : null;
									})()}
								</div>
							)}
						</>
					) : (
						<p className="text-xs text-muted-foreground">
							No variants available for this solution.
						</p>
					)}
				</div>

				{/* Product Information */}
				<div className="space-y-3">
					<h4 className="font-medium text-sm">Product Information</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
						<div>
							<strong>Name:</strong> {formData.name || "Not specified"}
						</div>
						<div>
							<strong>Model:</strong> {formData.model || "Not specified"}
						</div>
						<div className="md:col-span-2">
							<strong>Description:</strong>{" "}
							{formData.description || "Not specified"}
						</div>
					</div>
				</div>

				{/* Features */}
				<div className="space-y-3">
					<h4 className="font-medium text-sm">Features</h4>
					{cleanFeatures.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{cleanFeatures.map((feature, index) => (
								<Badge key={index} variant="secondary" className="text-xs">
									{feature}
								</Badge>
							))}
						</div>
					) : (
						<p className="text-xs text-muted-foreground">No features specified</p>
					)}
				</div>

				{/* Specifications */}
				<div className="space-y-3">
					<h4 className="font-medium text-sm">Specifications</h4>
					{cleanSpecificationCategories.length > 0 ? (
						<div className="space-y-2">
							{cleanSpecificationCategories.map((category) => (
								<div key={category.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2">
									<h5 className="font-medium text-xs mb-1 text-gray-700">{category.name}</h5>
									<div className="grid grid-cols-1 gap-1 text-xs">
										{category.specifications
											.filter((spec) => spec.key.trim() !== "" && spec.value.trim() !== "")
											.map((spec) => (
												<div key={spec.id} className="flex justify-between">
													<span className="text-gray-600">{spec.key}:</span>
													<span className="font-medium">{spec.value}</span>
												</div>
											))}
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-xs text-muted-foreground">
							No specifications specified
						</p>
					)}
				</div>

				{/* Summary */}
				<div className="p-3 bg-blue-50 rounded-lg">
					<h4 className="font-medium text-sm mb-2">Summary</h4>
					<div className="text-xs space-y-1">
						<p>
							• Product will be created with{" "}
							<strong>{cleanFeatures.length}</strong> features
						</p>
						<p>
							• Product will have <strong>{totalSpecifications}</strong>{" "}
							specifications
						</p>
						<p>
							• Product will be associated with solution:{" "}
							<strong>{selectedSolution?.solution_name}</strong>
						</p>
						<p>
							• Product status will be set to <strong>draft</strong>
						</p>
						<p>
							• Product variant selected:{" "}
							<strong>
								{formData.selectedSolutionVariant
									? solutionVariants.find(
											(v) => v.id === formData.selectedSolutionVariant
									  )?.name
									: "None"}
							</strong>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
