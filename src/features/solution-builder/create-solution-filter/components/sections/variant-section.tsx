import { VariantSectionProps } from "@/features/solution-builder/types/types";
import { Check, Clock, Eye, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import React, { useState } from "react";
import CreateNewItemDialog from "../create-new-item-dialog";

/**
 * VariantSection component - Renders the solution variant selection section
 */
export default function VariantSection(props: VariantSectionProps) {
	const {
		selectedSolutionVariantId,
		isCreatingNewVariant,
		onFormDataChange,
		onSolutionVariantSelect,
		onAddSolutionVariant,
		onAddNewlyCreatedVariant,
		newlyCreatedVariants,
		selectedSolutionId,
		formData,
		renderSelectionCard,
		availableSolutionVariants,
	} = props;

	const [isCreateVariantDialogOpen, setIsCreateVariantDialogOpen] =
		useState(false);
	const [variantFormData, setVariantFormData] = useState({
		solution_name: "",
		solution_description: "",
		solution_icon: "",
		solution_variant_name: "",
		solution_variant_description: "",
		solution_variant_icon: "",
		solution_variant_product_badge: false,
	});

	const currentSolutionVariants = newlyCreatedVariants.filter(
		(variant) =>
			variant.solution_id === selectedSolutionId ||
			variant.solution_id === `new-solution-${selectedSolutionId}`
	);
	const currentNewlyCreatedVariant =
		currentSolutionVariants.length > 0
			? currentSolutionVariants[currentSolutionVariants.length - 1]
			: null;

	const getSelectedVariantData = () => {
		if (selectedSolutionVariantId === "new" && currentNewlyCreatedVariant) {
			return currentNewlyCreatedVariant;
		}

		const availableVariant = availableSolutionVariants?.find(
			(v: any) => v.solution_variant === selectedSolutionVariantId
		);
		if (availableVariant) {
			return {
				id: availableVariant.solution_variant,
				solution_name: availableVariant.solution_name || "Solution",
				solution_icon: availableVariant.solution_variant_icon,
				solution_variant_name: availableVariant.solution_variant_name,
				product_badge: availableVariant.solution_variant_product_badge,
				status: "Available",
			};
		}

		return null;
	};

	const handleCreateVariant = () => {
		if (
			!variantFormData.solution_variant_name.trim() ||
			!variantFormData.solution_variant_description.trim()
		) {
			console.warn("Cannot create variant: missing required fields");
			return;
		}

		// Update the main form data - only variant-related fields, not solution fields
		onFormDataChange({
			solution_variant: "new",
			solution_variant_name: variantFormData.solution_variant_name,
			solution_variant_description:
				variantFormData.solution_variant_description,
			solution_variant_icon: variantFormData.solution_variant_icon,
			solution_variant_product_badge:
				variantFormData.solution_variant_product_badge,
		});

		const newVariant = {
			id: "new",
			solution_name: formData.solution_name,
			solution_description: formData.solution_description,
			solution_icon: formData.solution_icon,
			solution_id: selectedSolutionId,
			solution_variant_name: variantFormData.solution_variant_name,
			solution_variant_description:
				variantFormData.solution_variant_description,
			solution_variant_icon: variantFormData.solution_variant_icon,
			solution_variant_product_badge:
				variantFormData.solution_variant_product_badge,
			product_badge: variantFormData.solution_variant_product_badge,
			status: "New",
			created_at: new Date().toISOString(),
			parameters: [],
		};

		onAddSolutionVariant(newVariant);
		onAddNewlyCreatedVariant(newVariant);
		setIsCreateVariantDialogOpen(false);

		setVariantFormData({
			solution_name: "",
			solution_description: "",
			solution_icon: "",
			solution_variant_name: "",
			solution_variant_description: "",
			solution_variant_icon: "",
			solution_variant_product_badge: false,
		});
	};

	const handleVariantFormDataChange = (
		data: Partial<{
			solution_name: string;
			solution_description: string;
			solution_icon: string;
			solution_variant_name: string;
			solution_variant_description: string;
			solution_variant_icon: string;
			solution_variant_product_badge: boolean;
		}>
	) => {
		setVariantFormData((prev) => {
			const updated = { ...prev, ...data };
			return updated;
		});
	};

	return (
		<>
			<div className="space-y-4">
				{/* Solution Variant Progress Indicator */}
				<div className="flex items-center gap-2 mb-2">
					<div
						className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
							selectedSolutionVariantId
								? "bg-green-500 text-white"
								: "bg-muted text-muted-foreground"
						}`}
					>
						{selectedSolutionVariantId ? <Check className="h-3 w-3" /> : "4"}
					</div>
					<span
						className={`text-sm ${
							selectedSolutionVariantId ? "font-medium" : ""
						}`}
					>
						Solution Variant Selection
					</span>
				</div>

				{/* Collapsed State - When variant is selected */}
				{selectedSolutionVariantId ? (
					<div className="p-3 border-2 border-green-200 rounded-md bg-green-50">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 min-w-0">
								<Check className="h-4 w-4 text-green-600 flex-shrink-0" />
								<div className="flex items-center gap-2 min-w-0">
									{(() => {
										const selectedVariant = getSelectedVariantData();
										if (!selectedVariant) return null;

										return (
											<>
												{selectedVariant.solution_icon ? (
													React.createElement(
														stringToIconComponent(
															selectedVariant.solution_icon
														),
														{ className: "h-4 w-4 flex-shrink-0" }
													)
												) : (
													<div className="h-4 w-4 bg-muted rounded flex-shrink-0"></div>
												)}
												<span className="font-medium text-sm truncate min-w-0">
													{selectedVariant.solution_variant_name ||
														selectedVariant.solution_name ||
														"Selected Variant"}
												</span>
											</>
										);
									})()}
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onSolutionVariantSelect("")}
								className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
							>
								Change
							</Button>
						</div>
					</div>
				) : (
					/* Expanded State - When no variant is selected */
					<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
						<Label className="text-xs font-medium text-muted-foreground mb-2">
							Solution Variants for Selected Solution
						</Label>
						<div className="space-y-3">
							{/* Variants Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
								{/* Create New Variant Card - First item in grid */}
								<div
									className="p-3 border rounded-md cursor-pointer transition-colors bg-white hover:border-primary/50"
									onClick={() => setIsCreateVariantDialogOpen(true)}
								>
									<div className="flex items-center gap-2">
										<Plus className="h-4 w-4" />
										<span className="font-medium text-sm">
											Create New Variant
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-1 ml-6">
										Add a new variant to your selected solution
									</p>
								</div>

								{/* Newly Created Variant */}
								{currentNewlyCreatedVariant && (
									<div
										className="p-3 border-2 border-primary rounded-md bg-primary/5 cursor-pointer transition-colors"
										onClick={() =>
											onSolutionVariantSelect(currentNewlyCreatedVariant.id)
										}
									>
										<div className="flex items-center gap-2">
											{currentNewlyCreatedVariant.solution_icon ? (
												React.createElement(
													stringToIconComponent(
														currentNewlyCreatedVariant.solution_icon
													),
													{ className: "h-4 w-4" }
												)
											) : (
												<div className="h-4 w-4 bg-muted rounded"></div>
											)}
											<span className="font-medium text-sm">
												{currentNewlyCreatedVariant.solution_name}
											</span>
										</div>
										<p className="text-xs text-muted-foreground mt-1 ml-6">
											{currentNewlyCreatedVariant.solution_description}
										</p>
									</div>
								)}

								{/* Available Solution Variants */}
								{availableSolutionVariants &&
									availableSolutionVariants.map((variant: any) => (
										<div
											key={variant.solution_variant}
											className="p-3 border rounded-md cursor-pointer transition-colors bg-white hover:border-primary/50"
											onClick={() =>
												onSolutionVariantSelect(variant.solution_variant)
											}
										>
											<div className="flex items-center gap-2">
												{variant.solution_variant_icon ? (
													React.createElement(
														stringToIconComponent(
															variant.solution_variant_icon
														),
														{ className: "h-4 w-4" }
													)
												) : (
													<div className="h-4 w-4 bg-muted rounded"></div>
												)}
												<span className="font-medium text-sm">
													{variant.solution_variant_name}
												</span>
											</div>
											<p className="text-xs text-muted-foreground mt-1 ml-6">
												{variant.solution_variant_description}
											</p>
										</div>
									))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Create Variant Dialog */}
			<CreateNewItemDialog
				isOpen={isCreateVariantDialogOpen}
				onOpenChange={setIsCreateVariantDialogOpen}
				formData={variantFormData}
				onFormDataChange={handleVariantFormDataChange}
				onCreate={handleCreateVariant}
				type="variant"
			/>
		</>
	);
}
