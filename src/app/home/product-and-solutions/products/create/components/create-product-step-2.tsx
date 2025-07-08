"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface CreateProductStep2Props {
	formData: {
		name: string;
		description: string;
		model: string;
		specifications: Array<{
			key: string;
			value: string;
		}>;
		features: string[];
	};
	onFormDataChange: (updates: any) => void;
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
}

export function CreateProductStep2({
	formData,
	onFormDataChange,
	onFeatureChange,
	onAddFeature,
	onRemoveFeature,
	onSpecificationChange,
	onAddSpecification,
	onRemoveSpecification,
}: CreateProductStep2Props) {
	const handleInputChange = (field: string, value: string) => {
		onFormDataChange({ [field]: value });
	};

	return (
		<div className="space-y-4">
			{/* Basic Information */}
			<div className="space-y-3">
				<div>
					<Label className="text-sm font-medium">Product Name *</Label>
					<Input
						value={formData.name}
						onChange={(e) => handleInputChange("name", e.target.value)}
						placeholder="Enter product name"
						className="mt-1"
					/>
				</div>

				<div>
					<Label className="text-sm font-medium">Model *</Label>
					<Input
						value={formData.model}
						onChange={(e) => handleInputChange("model", e.target.value)}
						placeholder="Enter model number"
						className="mt-1"
					/>
				</div>

				<div>
					<Label className="text-sm font-medium">Description *</Label>
					<Textarea
						value={formData.description}
						onChange={(e) => handleInputChange("description", e.target.value)}
						placeholder="Enter product description"
						className="mt-1"
						rows={3}
					/>
				</div>
			</div>

			{/* Features */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<Label className="text-sm font-medium">Features</Label>
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

				<div className="space-y-2">
					{formData.features.map((feature, index) => (
						<div key={index} className="flex items-center gap-2">
							<Input
								value={feature}
								onChange={(e) => onFeatureChange(index, e.target.value)}
								placeholder="Enter feature"
								className="flex-1"
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
			</div>

			{/* Specifications */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<Label className="text-sm font-medium">Specifications</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onAddSpecification}
						className="h-6 px-2 text-xs"
					>
						<Plus className="h-3 w-3 mr-1" />
						Add Specification
					</Button>
				</div>

				<div className="space-y-2">
					{formData.specifications.map((spec, index) => (
						<div key={index} className="flex items-center gap-2">
							<Input
								value={spec.key}
								onChange={(e) => onSpecificationChange(index, "key", e.target.value)}
								placeholder="Specification name"
								className="flex-1"
							/>
							<Input
								value={spec.value}
								onChange={(e) => onSpecificationChange(index, "value", e.target.value)}
								placeholder="Value"
								className="flex-1"
							/>
							{formData.specifications.length > 1 && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => onRemoveSpecification(index)}
									className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
								>
									<X className="h-3 w-3" />
								</Button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
