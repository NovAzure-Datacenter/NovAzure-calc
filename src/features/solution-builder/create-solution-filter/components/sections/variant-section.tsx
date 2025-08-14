import { VariantSectionProps } from "@/features/solution-builder/types/types";
import { Check, Clock, Eye, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import CreateNewItemDialog from "../create-new-item-dialog";

/**
 * VariantSection component - Renders the solution variant selection section
 */
export default function VariantSection(props: VariantSectionProps) {
	const {
		selectedSolutionVariantId,
		existingSolutions,
		isLoadingExistingSolutions,
		isCreatingNewVariant,
		onFormDataChange,
		onSolutionVariantSelect,
		onAddSolutionVariant,
		onAddNewlyCreatedVariant,
		newlyCreatedVariants,
		selectedSolutionId, 
		formData,
	} = props;

	const [isCreateVariantDialogOpen, setIsCreateVariantDialogOpen] =
		useState(false);
	const [variantFormData, setVariantFormData] = useState({
		name: "",
		description: "",
		icon: "",
		product_badge: formData.newVariantProductBadge || false,
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

	const handleCreateVariant = () => {
		onFormDataChange({
			newVariantName: variantFormData.name,
			newVariantDescription: variantFormData.description,
			newVariantIcon: variantFormData.icon,
		});

		const newVariant = {
			id: `new-variant-${Date.now()}`,
			solution_name: variantFormData.name,
			solution_description: variantFormData.description,
			solution_icon: variantFormData.icon,
			solution_id: selectedSolutionId,
			product_badge: variantFormData.product_badge, 
			status: "New",
			created_at: new Date().toISOString(),
			parameters: [],
		};

		onAddSolutionVariant(newVariant);
		onAddNewlyCreatedVariant(newVariant);

		onFormDataChange({
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		});

		setIsCreateVariantDialogOpen(false);
		setVariantFormData({
			name: "",
			description: "",
			icon: "",
			product_badge: false,
		});
	};

	const handleVariantFormDataChange = (
		data: Partial<{ name: string; description: string; icon: string; product_badge: boolean }>
	) => {
		setVariantFormData((prev) => ({ ...prev, ...data }));
	};

	/**
	 * Specialized renderer for variant cards 
	 */
	const renderVariantCard = (
		solution: any,
		solutionId: string,
		isSelected: boolean,
		onSelect: (id: string) => void
	) => (
		<div
			key={solutionId}
			className={`p-2 border rounded-md cursor-pointer transition-colors ${
				isSelected
					? "border-primary bg-primary/5"
					: "bg-white hover:border-primary/50"
			}`}
			onClick={() => onSelect(solutionId)}
		>
			<div className="flex items-center justify-between mb-1">
				<div className="flex items-center gap-1.5">
					<Checkbox
						checked={isSelected}
						onCheckedChange={() => onSelect(solutionId)}
						className="h-3 w-3"
					/>
					<Eye className="h-3.5 w-3.5 flex-shrink-0" />
					<span className="font-medium text-xs truncate">
						Existing Solution
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					{/* Product Badge - Only show if variant has product_badge set to true */}
					{solution.product_badge && (
						<Badge
							variant="outline"
							className="text-xs flex-shrink-0 px-1.5 py-0.5 bg-green-50 border-green-200 text-green-700"
						>
							Product
						</Badge>
					)}
					<Badge
						variant="outline"
						className="text-xs flex-shrink-0 px-1.5 py-0.5"
					>
						{solution.status}
					</Badge>
				</div>
			</div>
			<div className="space-y-0.5 min-w-0">
				<div className="flex items-center gap-1">
					{solution.solution_icon ? (
						React.createElement(stringToIconComponent(solution.solution_icon), {
							className: "h-3.5 w-3.5 flex-shrink-0",
						})
					) : (
						<div className="h-3.5 w-3.5 bg-muted rounded flex-shrink-0"></div>
					)}
					<span className="font-medium text-xs truncate min-w-0">
						{solution.solution_name}
					</span>
				</div>
				<p className="text-xs text-muted-foreground line-clamp-1 min-w-0">
					{solution.solution_description}
				</p>
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
					<div className="flex items-center gap-0.5 flex-shrink-0">
						<Clock className="h-2.5 w-2.5" />
						<span className="text-xs">
							{new Date(solution.created_at).toLocaleDateString()}
						</span>
					</div>
					<div className="flex items-center gap-0.5 flex-shrink-0">
						<User className="h-2.5 w-2.5" />
						<span className="text-xs">
							{solution.parameters?.length || 0} params
						</span>
					</div>
				</div>
			</div>
		</div>
	);

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
					<div className="p-3 border-2 border-green-200 rounded-md bg-green-50 ">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 min-w-0">
								<Check className="h-4 w-4 text-green-600 flex-shrink-0" />
								<div className="flex items-center gap-2 min-w-0">
									{(() => {
										// Check if the selected variant is the newly created one
										if (
											currentNewlyCreatedVariant &&
											selectedSolutionVariantId ===
												currentNewlyCreatedVariant.id
										) {
											return (
												<>
													{currentNewlyCreatedVariant.solution_icon ? (
														React.createElement(
															stringToIconComponent(
																currentNewlyCreatedVariant.solution_icon
															),
															{ className: "h-4 w-4 flex-shrink-0" }
														)
													) : (
														<div className="h-4 w-4 bg-muted rounded flex-shrink-0"></div>
													)}
													<span className="font-medium text-sm truncate min-w-0">
														{currentNewlyCreatedVariant.solution_name}
													</span>
												</>
											);
										}

										const selectedVariant = existingSolutions.find(
											(s: any) => s.id === selectedSolutionVariantId
										);
										return (
											<>
												{selectedVariant?.solution_icon ? (
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
													{selectedVariant?.solution_name || "New Variant"}
												</span>
											</>
										);
									})()}
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									onSolutionVariantSelect("");
									// setNewlyCreatedVariant(null); // This line is removed as per the edit hint
								}}
								className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
							>
								Change
							</Button>
						</div>
					</div>
				) : (
					/* Expanded State - When no variant is selected */
					<>
						{/* Existing Solutions Section */}
						{existingSolutions.length > 0 && (
							<div className="p-3 bg-gray-50 rounded-lg border border-gray-200 ">
								<Label className="text-xs font-medium text-muted-foreground mb-2">
									Existing Solutions ({existingSolutions.length})
								</Label>
								<div className="space-y-1 ">
									<p className="text-xs text-muted-foreground mb-2 overflow-y-auto">
										These solutions already exist for your selected criteria.
										You can view and edit them or create a new variant.
									</p>
									{isLoadingExistingSolutions ? (
										<div className="flex items-center justify-center py-3 ">
											<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-muted-foreground"></div>
											<span className="ml-2 text-xs text-muted-foreground">
												Loading existing solutions...
											</span>
										</div>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{/* Create New Variant Card - Only show if not creating new variant */}
											{!currentNewlyCreatedVariant ? (
												<div
													className={`p-2 border rounded-md cursor-pointer transition-colors ${
														selectedSolutionVariantId === "create-new"
															? "border-primary bg-primary/5"
															: "bg-white hover:border-primary/50"
													}`}
													onClick={() => setIsCreateVariantDialogOpen(true)}
												>
													<div className="flex items-center justify-between mb-1">
														<div className="flex items-center gap-1.5 min-w-0">
															<Plus className="h-3.5 w-3.5 flex-shrink-0" />
															<span className="font-medium text-xs truncate">
																Create New Variant
															</span>
														</div>
														<Badge
															variant="outline"
															className="text-xs flex-shrink-0 px-1.5 py-0.5"
														>
															New
														</Badge>
													</div>
													<div className="space-y-0.5 min-w-0">
														<p className="text-xs text-muted-foreground line-clamp-1">
															Add a new variant to your selected solution
															category
														</p>
													</div>
												</div>
											) : (
												<div
													className={`p-2 border rounded-md cursor-pointer transition-colors ${
														selectedSolutionVariantId ===
														currentNewlyCreatedVariant.id
															? "border-primary bg-primary/5"
															: "bg-white hover:border-primary/50"
													}`}
													onClick={() =>
														onSolutionVariantSelect(
															currentNewlyCreatedVariant.id
														)
													}
												>
													<div className="flex items-center justify-between mb-1">
														<div className="flex items-center gap-1.5 min-w-0">
															{currentNewlyCreatedVariant.solution_icon ? (
																React.createElement(
																	stringToIconComponent(
																		currentNewlyCreatedVariant.solution_icon
																	),
																	{ className: "h-3.5 w-3.5 flex-shrink-0" }
																)
															) : (
																<div className="h-3.5 w-3.5 bg-muted rounded flex-shrink-0"></div>
															)}
															<span className="font-medium text-xs truncate">
																{currentNewlyCreatedVariant.solution_name}
															</span>
														</div>
														<div className="flex items-center gap-1.5">
															{/* Product Badge - Only show if variant has product_badge set to true */}
															{currentNewlyCreatedVariant.product_badge && (
																<Badge
																	variant="outline"
																	className="text-xs flex-shrink-0 px-1.5 py-0.5 bg-green-50 border-green-200 text-green-700"
																>
																	Product
																</Badge>
															)}
															<Badge
																variant="outline"
																className="text-xs flex-shrink-0 px-1.5 py-0.5"
															>
																{currentNewlyCreatedVariant.status}
															</Badge>
														</div>
													</div>
													<div className="space-y-0.5 min-w-0">
														<p className="text-xs text-muted-foreground line-clamp-1">
															{currentNewlyCreatedVariant.solution_description}
														</p>
													</div>
												</div>
											)}
											{/* Existing Solutions using specialized variant card renderer */}
											{existingSolutions.map((solution: any) =>
												renderVariantCard(
													solution,
													solution.id,
													selectedSolutionVariantId === solution.id,
													onSolutionVariantSelect
												)
											)}
										</div>
									)}
								</div>
							</div>
						)}

						{/* Fallback Section - Show when no existing solutions or when user wants to create new */}
						{(existingSolutions.length === 0 || isCreatingNewVariant) && (
							<div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
								<Label className="text-xs font-medium text-muted-foreground mb-2">
									{existingSolutions.length === 0
										? "No Existing Solutions Found"
										: "Create New Solution Variant"}
								</Label>
								{existingSolutions.length === 0 && (
									<p className="text-xs text-muted-foreground mb-3">
										No existing solutions found for your selected criteria. You
										can create a new solution variant.
									</p>
								)}
								{/* Create New Variant Card - Always visible when no existing solutions */}
								{!currentNewlyCreatedVariant ? (
									<div
										className={`p-2 border rounded-md cursor-pointer transition-colors ${
											selectedSolutionVariantId === "create-new"
												? "border-primary bg-primary/5"
												: "bg-white hover:border-primary/50"
										}`}
										onClick={() => setIsCreateVariantDialogOpen(true)}
									>
										<div className="flex items-center justify-between mb-1">
											<div className="flex items-center gap-1.5 min-w-0">
												<Plus className="h-3.5 w-3.5 flex-shrink-0" />
												<span className="font-medium text-xs truncate">
													Create New Variant
												</span>
											</div>
											<Badge
												variant="outline"
												className="text-xs flex-shrink-0 px-1.5 py-0.5"
											>
												New
											</Badge>
										</div>
										<div className="space-y-0.5 min-w-0">
											<p className="text-xs text-muted-foreground line-clamp-1">
												Add a new variant to your selected solution category
											</p>
										</div>
									</div>
								) : (
									<div
										className={`p-2 border rounded-md cursor-pointer transition-colors ${
											selectedSolutionVariantId ===
											currentNewlyCreatedVariant.id
												? "border-primary bg-primary/5"
												: "bg-white hover:border-primary/50"
										}`}
										onClick={() =>
											onSolutionVariantSelect(currentNewlyCreatedVariant.id)
										}
									>
										<div className="flex items-center justify-between mb-1">
											<div className="flex items-center gap-1.5 min-w-0">
												{currentNewlyCreatedVariant.solution_icon ? (
													React.createElement(
														stringToIconComponent(
															currentNewlyCreatedVariant.solution_icon
														),
														{ className: "h-3.5 w-3.5 flex-shrink-0" }
													)
												) : (
													<div className="h-3.5 w-3.5 bg-muted rounded flex-shrink-0"></div>
												)}
												<span className="font-medium text-xs truncate">
													{currentNewlyCreatedVariant.solution_name}
												</span>
											</div>
											<div className="flex items-center gap-1.5">
												{/* Product Badge - Only show if variant has product_badge set to true */}
												{currentNewlyCreatedVariant.product_badge && (
													<Badge
														variant="outline"
														className="text-xs flex-shrink-0 px-1.5 py-0.5 bg-green-50 border-green-200 text-green-700"
													>
														Product
													</Badge>
												)}
												<Badge
													variant="outline"
													className="text-xs flex-shrink-0 px-1.5 py-0.5"
												>
													{currentNewlyCreatedVariant.status}
												</Badge>
											</div>
										</div>
										<div className="space-y-0.5 min-w-0">
											<p className="text-xs text-muted-foreground line-clamp-1">
												{currentNewlyCreatedVariant.solution_description}
											</p>
										</div>
									</div>
								)}
							</div>
						)}
					</>
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
