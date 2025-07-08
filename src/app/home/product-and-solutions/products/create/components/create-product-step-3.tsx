"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Solution {
	id: string;
	solution_name: string;
	solution_description: string;
	solution_type: string;
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
			key: string;
			value: string;
		}>;
		features: string[];
	};
	selectedSolution: Solution | undefined;
}

export function CreateProductStep3({
	formData,
	selectedSolution,
}: CreateProductStep3Props) {
	const cleanFeatures = formData.features.filter(feature => feature.trim() !== "");
	const cleanSpecifications = formData.specifications.filter(spec => 
		spec.key.trim() !== "" && spec.value.trim() !== ""
	);

	return (
		<div className="space-y-4">
			{/* Selected Solution */}
			{selectedSolution && (
				<div className="p-3 bg-muted rounded-lg">
					<h4 className="font-medium mb-2 text-sm">Selected Solution</h4>
					<div className="space-y-1 text-xs">
						<p><strong>Name:</strong> {selectedSolution.solution_name}</p>
						<p><strong>Type:</strong> {selectedSolution.solution_type}</p>
						<p><strong>Status:</strong> 
							<Badge variant="outline" className="ml-2 text-xs">
								{selectedSolution.status}
							</Badge>
						</p>
						<p><strong>Description:</strong> {selectedSolution.solution_description}</p>
					</div>
				</div>
			)}

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
						<strong>Description:</strong> {formData.description || "Not specified"}
					</div>
				</div>
			</div>

			{/* Specifications */}
			<div className="space-y-3">
				<h4 className="font-medium text-sm">Specifications</h4>
				{cleanSpecifications.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
						{cleanSpecifications.map((spec, index) => (
							<div key={index}>
								<strong>{spec.key}:</strong> {spec.value}
							</div>
						))}
					</div>
				) : (
					<p className="text-xs text-muted-foreground">No specifications specified</p>
				)}
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

			{/* Summary */}
			<div className="p-3 bg-blue-50 rounded-lg">
				<h4 className="font-medium text-sm mb-2">Summary</h4>
				<div className="text-xs space-y-1">
					<p>• Product will be created with <strong>{cleanFeatures.length}</strong> features</p>
					<p>• Product will have <strong>{cleanSpecifications.length}</strong> specifications</p>
					<p>• Product will be associated with solution: <strong>{selectedSolution?.solution_name}</strong></p>
					<p>• Product status will be set to <strong>draft</strong></p>
				</div>
			</div>
		</div>
	);
} 