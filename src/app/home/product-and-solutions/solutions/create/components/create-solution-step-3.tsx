"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import {
	solutionTypes,
	type SolutionType,
	type SolutionVariant,
} from "../../mock-data";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { iconOptions } from "@/lib/icons/lucide-icons";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";

interface CreateSolutionStep3Props {
	formData: {
		solutionName: string;
		solutionDescription: string;
		solutionIcon: string;
		selectedSolutionId: string;
		selectedSolutionVariantId: string;
		newVariantName: string;
		newVariantDescription: string;
		newVariantIcon: string;
	};
	availableSolutionTypes: any[];
	isLoadingSolutionTypes: boolean;
	availableSolutionVariants: any[];
	isLoadingSolutionVariants: boolean;
	isCreatingNewSolution: boolean;
	isCreatingNewVariant: boolean;
	onFormDataChange: (
		updates: Partial<CreateSolutionStep3Props["formData"]>
	) => void;
	onSolutionTypeSelect: (solutionTypeId: string) => void;
	onSolutionVariantSelect: (variantId: string) => void;
	onCreateNewSolution: () => void;
	onCreateNewVariant: () => void;
	onNoVariantSelect: () => void;
	getSelectedIndustryName: () => string;
	getSelectedTechnologyName: () => string;
	getSelectedSolutionType: () => any;
	getSelectedSolutionVariant: () => any;
}

export function CreateSolutionStep3({
	formData,
	availableSolutionTypes,
	isLoadingSolutionTypes,
	availableSolutionVariants,
	isLoadingSolutionVariants,
	isCreatingNewSolution,
	isCreatingNewVariant,
	onFormDataChange,
	onSolutionTypeSelect,
	onSolutionVariantSelect,
	onCreateNewSolution,
	onCreateNewVariant,
	onNoVariantSelect,
	getSelectedIndustryName,
	getSelectedTechnologyName,
	getSelectedSolutionType,
	getSelectedSolutionVariant,
}: CreateSolutionStep3Props) {
	const [isIconSelectorOpen, setIsIconSelectorOpen] = React.useState(false);
	const [isVariantIconSelectorOpen, setIsVariantIconSelectorOpen] = React.useState(false);

	const handleIconChange = (iconName: string) => {
		onFormDataChange({ solutionIcon: iconName });
	};

	const handleVariantIconChange = (iconName: string) => {
		onFormDataChange({ newVariantIcon: iconName });
	};

	// Check if user has selected a solution type (either existing or creating new)
	const hasSelectedSolutionType = formData.selectedSolutionId || isCreatingNewSolution;

	return (
		<>
			<div className="max-h-[60vh] overflow-y-auto space-y-4">
				{/* Summary */}
				<div className="p-3 border rounded-md bg-muted/50">
					<h4 className="font-medium mb-2 text-sm">Solution Summary</h4>
					<div className="grid grid-cols-2 gap-3 text-xs">
						<div>
							<span className="text-muted-foreground">Industry:</span>
							<p className="font-medium">{getSelectedIndustryName()}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Technology:</span>
							<p className="font-medium">{getSelectedTechnologyName()}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Solution Type:</span>
							<p className="font-medium">
								{isCreatingNewSolution
									? formData.solutionName || "New Solution"
									: getSelectedSolutionType()?.name || "Not selected"}
							</p>
						</div>
						<div>
							<span className="text-muted-foreground">Solution Variant:</span>
							<p className="font-medium">
								{isCreatingNewVariant
									? formData.newVariantName || "New Variant"
									: formData.selectedSolutionVariantId === ""
									? "None selected"
									: getSelectedSolutionVariant()?.name || "None selected"}
							</p>
						</div>
					</div>
				</div>

				{/* Solution Type Selection */}
				<div>
					<Label className="text-sm font-medium">Solution Type</Label>
					<p className="text-xs text-muted-foreground mb-2">
						Select from existing solution types or create a new one
					</p>

					<div className="space-y-2">
						{/* Selected solution type display */}
						{hasSelectedSolutionType && (
							<div className="p-3 border rounded-md bg-primary/5 border-primary">
								<div className="flex items-center gap-2">
									{isCreatingNewSolution ? (
										<>
											{formData.solutionIcon ? (
												React.createElement(stringToIconComponent(formData.solutionIcon), { className: "h-4 w-4" })
											) : (
												<Plus className="h-4 w-4" />
											)}
											<span className="font-medium text-sm">
												{formData.solutionName || "New Solution"}
											</span>
										</>
									) : (
										<>
											{getSelectedSolutionType()?.icon ? (
												React.createElement(
													typeof getSelectedSolutionType()!.icon === 'string' 
														? stringToIconComponent(getSelectedSolutionType()!.icon as unknown as string)
														: getSelectedSolutionType()!.icon as any,
													{ className: "h-4 w-4" }
												)
											) : (
												<div className="h-4 w-4 bg-muted rounded"></div>
											)}
											<span className="font-medium text-sm">
												{getSelectedSolutionType()?.name}
											</span>
										</>
									)}
								</div>
							</div>
						)}

						{/* Show all options in compact grid */}
						{isLoadingSolutionTypes ? (
							<div className="grid grid-cols-2 md:grid-cols-3 gap-1">
								<div className="p-2 border rounded-md bg-muted/50">
									<div className="flex items-center gap-1">
										<div className="h-3 w-3 bg-muted animate-pulse rounded"></div>
										<span className="text-xs text-muted-foreground">
											Loading...
										</span>
									</div>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-3 gap-1">
								{availableSolutionTypes.map((solutionType) => (
									<div
										key={solutionType.id}
										className={`p-2 border rounded-md cursor-pointer transition-colors text-xs ${
											formData.selectedSolutionId === solutionType.id
												? "border-primary bg-primary/5"
												: "border-border hover:border-primary/50"
										}`}
										onClick={() => onSolutionTypeSelect(solutionType.id)}
									>
										<div className="flex items-center gap-1">
											{solutionType.icon ? (
												React.createElement(
													(typeof solutionType.icon as unknown) === 'string' 
														? stringToIconComponent(solutionType.icon as string)
														: solutionType.icon as any,
													{ className: "h-3 w-3" }
												)
											) : (
												<div className="h-3 w-3 bg-muted rounded"></div>
											)}
											<span className="font-medium truncate">
												{solutionType.name}
											</span>
										</div>
									</div>
								))}
								<div
									className={`p-2 border rounded-md cursor-pointer transition-colors text-xs ${
										isCreatingNewSolution
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
									onClick={onCreateNewSolution}
								>
									<div className="flex items-center gap-1">
										<Plus className="h-3 w-3" />
										<span className="font-medium truncate">Create New</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Solution Name and Description - Only show when creating new solution */}
				{isCreatingNewSolution && (
					<>
						{/* Solution Icon */}
						<div>
							<Label className="text-sm font-medium">Solution Icon</Label>
							<div className="flex items-center gap-3 mt-1">
								<div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-gray-50">
									{formData.solutionIcon ? (
										React.createElement(stringToIconComponent(formData.solutionIcon), { className: "h-5 w-5 text-gray-600" })
									) : (
										<Plus className="h-5 w-5 text-gray-600" />
									)}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsIconSelectorOpen(true)}
									className="text-xs"
								>
									{formData.solutionIcon ? "Change Icon" : "Select Icon"}
								</Button>
							</div>
						</div>

						{/* Solution Name */}
						<div>
							<Label htmlFor="solutionName" className="text-sm font-medium">
								Solution Name *
							</Label>
							<Input
								id="solutionName"
								value={formData.solutionName}
								onChange={(e) =>
									onFormDataChange({ solutionName: e.target.value })
								}
								placeholder="Enter solution name"
								className="mt-1"
							/>
						</div>

						{/* Solution Description */}
						<div>
							<Label
								htmlFor="solutionDescription"
								className="text-sm font-medium"
							>
								Solution Description *
							</Label>
							<Textarea
								id="solutionDescription"
								value={formData.solutionDescription}
								onChange={(e) =>
									onFormDataChange({ solutionDescription: e.target.value })
								}
								placeholder="Describe your solution in detail"
								className="mt-1"
								rows={3}
							/>
						</div>
					</>
				)}

				{/* Solution Variant Selection - Show when a solution type is selected OR when creating new solution */}
				{hasSelectedSolutionType && (
					<div>
						<Label className="text-sm font-medium">Solution Variant</Label>
						<p className="text-xs text-muted-foreground mb-2">
							Select from existing solution variants or create a new one
						</p>

						<div className="space-y-2">
							{/* Selected solution variant display */}
							{(formData.selectedSolutionVariantId || isCreatingNewVariant) && (
								<div className="p-3 border rounded-md bg-primary/5 border-primary">
									<div className="flex items-center gap-2">
										{isCreatingNewVariant ? (
											<>
												{formData.newVariantIcon ? (
													React.createElement(stringToIconComponent(formData.newVariantIcon), { className: "h-4 w-4" })
												) : (
													<Plus className="h-4 w-4" />
												)}
												<span className="font-medium text-sm">
													{formData.newVariantName || "New Variant"}
												</span>
											</>
										) : formData.selectedSolutionVariantId === "" ? (
											<>
												<span className="font-medium text-sm text-muted-foreground">
													No Variant Selected
												</span>
											</>
										) : (
											<>
												<span className="font-medium text-sm">
													{getSelectedSolutionVariant()?.name}
												</span>
											</>
										)}
									</div>
								</div>
							)}

							{/* Show all options in compact grid */}
							<div className="grid grid-cols-2 md:grid-cols-3 gap-1">
								{isLoadingSolutionVariants ? (
									<div className="p-2 border rounded-md bg-muted/50">
										<div className="flex items-center gap-1">
											<div className="h-3 w-3 bg-muted animate-pulse rounded"></div>
											<span className="text-xs text-muted-foreground">
												Loading variants...
											</span>
										</div>
									</div>
								) : (
									<>
										{/* Only show existing variants if we have a selected solution (not creating new) */}
										{!isCreatingNewSolution && availableSolutionVariants.map((variant) => (
											<div
												key={variant.id}
												className={`p-2 border rounded-md cursor-pointer transition-colors text-xs ${
													formData.selectedSolutionVariantId === variant.id
														? "border-primary bg-primary/5"
														: "border-border hover:border-primary/50"
												}`}
												onClick={() => onSolutionVariantSelect(variant.id)}
											>
												<div className="flex items-center gap-1">
													{variant.icon ? (
														React.createElement(stringToIconComponent(variant.icon), { className: "h-3 w-3" })
													) : (
														<div className="h-3 w-3 bg-muted rounded"></div>
													)}
													<span className="font-medium truncate">
														{variant.name}
													</span>
												</div>
											</div>
										))}
										<div
											className={`p-2 border rounded-md cursor-pointer transition-colors text-xs ${
												isCreatingNewVariant
													? "border-primary bg-primary/5"
													: "border-border hover:border-primary/50"
											}`}
											onClick={onCreateNewVariant}
										>
											<div className="flex items-center gap-1">
												<Plus className="h-3 w-3" />
												<span className="font-medium truncate">Create New</span>
											</div>
										</div>
										<div
											className={`p-2 border rounded-md cursor-pointer transition-colors text-xs ${
												formData.selectedSolutionVariantId === "" &&
												!isCreatingNewVariant
													? "border-primary bg-primary/5"
													: "border-border hover:border-primary/50"
											}`}
											onClick={onNoVariantSelect}
										>
											<div className="flex items-center gap-1">
												<span className="font-medium truncate text-muted-foreground">
													No Variant
												</span>
											</div>
										</div>
									</>
								)}
							</div>
						</div>

						{isCreatingNewVariant && (
							<div className="mt-3 p-3 border rounded-md bg-muted/50">
								{/* Solution Variant Icon */}
								<div className="mb-3">
									<Label className="text-sm font-medium">Solution Variant Icon</Label>
									<div className="flex items-center gap-3 mt-1">
										<div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-gray-50">
											{formData.newVariantIcon ? (
												React.createElement(stringToIconComponent(formData.newVariantIcon), { className: "h-5 w-5 text-gray-600" })
											) : (
												<Plus className="h-5 w-5 text-gray-600" />
											)}
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setIsVariantIconSelectorOpen(true)}
											className="text-xs"
										>
											{formData.newVariantIcon ? "Change Icon" : "Select Icon"}
										</Button>
									</div>
								</div>

								{/* Solution Variant Name */}
								<div className="mb-3">
									<Label htmlFor="newVariantName" className="text-sm font-medium">
										Solution Variant Name *
									</Label>
									<Input
										id="newVariantName"
										value={formData.newVariantName}
										onChange={(e) =>
											onFormDataChange({ newVariantName: e.target.value })
										}
										placeholder="Enter solution variant name"
										className="mt-1"
									/>
								</div>

								{/* Solution Variant Description */}
								<div>
									<Label
										htmlFor="newVariantDescription"
										className="text-sm font-medium"
									>
										Solution Variant Description *
									</Label>
									<Textarea
										id="newVariantDescription"
										value={formData.newVariantDescription}
										onChange={(e) =>
											onFormDataChange({ newVariantDescription: e.target.value })
										}
										placeholder="Describe your solution variant in detail"
										className="mt-1"
										rows={3}
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Icon Selector Dialog */}
			<Dialog open={isIconSelectorOpen} onOpenChange={setIsIconSelectorOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Select Solution Icon</DialogTitle>
						<DialogDescription>
							Choose an icon that best represents this solution type
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
						{iconOptions.map((option) => {
							const isSelected = option.value === formData.solutionIcon;
							return (
								<button
									key={option.value}
									onClick={() => {
										handleIconChange(option.value);
										setIsIconSelectorOpen(false);
									}}
									className={`p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
										isSelected
											? "border-primary bg-primary/10"
											: "border-border hover:border-primary/50"
									}`}
								>
									<div className="flex flex-col items-center gap-2">
										<option.icon
											className={`h-6 w-6 ${
												isSelected ? "text-primary" : "text-muted-foreground"
											}`}
										/>
									</div>
								</button>
							);
						})}
					</div>
					<div className="flex justify-end mt-4 pt-4 border-t">
						<Button
							onClick={() => setIsIconSelectorOpen(false)}
							variant="outline"
							size="sm"
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Variant Icon Selector Dialog */}
			<Dialog open={isVariantIconSelectorOpen} onOpenChange={setIsVariantIconSelectorOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Select Solution Variant Icon</DialogTitle>
						<DialogDescription>
							Choose an icon that best represents this solution variant
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
						{iconOptions.map((option) => {
							const isSelected = option.value === formData.newVariantIcon;
							return (
								<button
									key={option.value}
									onClick={() => {
										handleVariantIconChange(option.value);
										setIsVariantIconSelectorOpen(false);
									}}
									className={`p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
										isSelected
											? "border-primary bg-primary/10"
											: "border-border hover:border-primary/50"
									}`}
								>
									<div className="flex flex-col items-center gap-2">
										<option.icon
											className={`h-6 w-6 ${
												isSelected ? "text-primary" : "text-muted-foreground"
											}`}
										/>
									</div>
								</button>
							);
						})}
					</div>
					<div className="flex justify-end mt-4 pt-4 border-t">
						<Button
							onClick={() => setIsVariantIconSelectorOpen(false)}
							variant="outline"
							size="sm"
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
