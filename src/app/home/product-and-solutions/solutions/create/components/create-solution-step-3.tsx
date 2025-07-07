"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { solutionTypes, type SolutionType, type SolutionVariant } from "../../../mock-data";

interface CreateSolutionStep3Props {
	formData: {
		solutionName: string;
		solutionDescription: string;
		solutionType: string;
		solutionVariant: string;
		customSolutionType: string;
		customSolutionVariant: string;
	};
	showCustomSolutionType: boolean;
	showCustomSolutionVariant: boolean;
	onFormDataChange: (updates: Partial<CreateSolutionStep3Props["formData"]>) => void;
	onShowCustomSolutionTypeChange: (show: boolean) => void;
	onShowCustomSolutionVariantChange: (show: boolean) => void;
	getSelectedIndustryName: () => string;
	getSelectedTechnologyName: () => string;
	getSelectedSolutionType: () => SolutionType | undefined;
	getSelectedSolutionVariant: () => SolutionVariant | undefined;
}

export function CreateSolutionStep3({
	formData,
	showCustomSolutionType,
	showCustomSolutionVariant,
	onFormDataChange,
	onShowCustomSolutionTypeChange,
	onShowCustomSolutionVariantChange,
	getSelectedIndustryName,
	getSelectedTechnologyName,
	getSelectedSolutionType,
	getSelectedSolutionVariant,
}: CreateSolutionStep3Props) {
	const handleSolutionTypeSelect = (solutionTypeId: string) => {
		onFormDataChange({
			solutionType: solutionTypeId,
			solutionVariant: "", // Reset variant when type changes
		});
		onShowCustomSolutionTypeChange(false);
	};

	const handleSolutionVariantSelect = (variantId: string) => {
		onFormDataChange({ solutionVariant: variantId });
		onShowCustomSolutionVariantChange(false);
	};

	return (
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
							{showCustomSolutionType
								? formData.customSolutionType
								: getSelectedSolutionType()?.name}
						</p>
					</div>
					<div>
						<span className="text-muted-foreground">Solution Variant:</span>
						<p className="font-medium">
							{showCustomSolutionVariant
								? formData.customSolutionVariant
								: formData.solutionVariant === ""
								? "None selected"
								: getSelectedSolutionVariant()?.name || "None selected"}
						</p>
					</div>
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
				<Label htmlFor="solutionDescription" className="text-sm font-medium">
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

			{/* Solution Type Selection */}
			<div>
				<Label className="text-sm font-medium">Solution Type</Label>
				<p className="text-xs text-muted-foreground mb-2">
					What type of solution is this?
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					{solutionTypes.map((solutionType) => (
						<div
							key={solutionType.id}
							className={`p-3 border rounded-md cursor-pointer transition-colors ${
								formData.solutionType === solutionType.id
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50"
							}`}
							onClick={() => handleSolutionTypeSelect(solutionType.id)}
						>
							<div className="flex items-center gap-2">
								<Checkbox
									checked={formData.solutionType === solutionType.id}
									onCheckedChange={() => handleSolutionTypeSelect(solutionType.id)}
								/>
								<div className="flex items-center gap-2">
									<solutionType.icon className="h-4 w-4" />
									<span className="font-medium text-sm">
										{solutionType.name}
									</span>
								</div>
							</div>
							<p className="text-xs text-muted-foreground mt-1 ml-6">
								{solutionType.description}
							</p>
						</div>
					))}
					<div
						className={`p-3 border rounded-md cursor-pointer transition-colors ${
							showCustomSolutionType
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/50"
						}`}
						onClick={() => onShowCustomSolutionTypeChange(true)}
					>
						<div className="flex items-center gap-2">
							<Checkbox
								checked={showCustomSolutionType}
								onCheckedChange={() => onShowCustomSolutionTypeChange(true)}
							/>
							<div className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								<span className="font-medium text-sm">Create New Type</span>
							</div>
						</div>
					</div>
				</div>

				{showCustomSolutionType && (
					<div className="mt-3 p-3 border rounded-md bg-muted/50">
						<Label htmlFor="customSolutionType" className="text-sm font-medium">
							New Solution Type Name
						</Label>
						<Input
							id="customSolutionType"
							value={formData.customSolutionType}
							onChange={(e) =>
								onFormDataChange({ customSolutionType: e.target.value })
							}
							placeholder="Enter solution type name"
							className="mt-1"
						/>
					</div>
				)}
			</div>

			{/* Solution Variant Selection */}
			{formData.solutionType && !showCustomSolutionType && (
				<div>
					<Label className="text-sm font-medium">
						Solution Variant (Optional)
					</Label>
					<p className="text-xs text-muted-foreground mb-2">
						Choose a specific variant, create a new one, or skip this step
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						{getSelectedSolutionType()?.variants.map((variant) => (
							<div
								key={variant.id}
								className={`p-3 border rounded-md cursor-pointer transition-colors ${
									formData.solutionVariant === variant.id
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50"
								}`}
								onClick={() => handleSolutionVariantSelect(variant.id)}
							>
								<div className="flex items-center gap-2">
									<Checkbox
										checked={formData.solutionVariant === variant.id}
										onCheckedChange={() => handleSolutionVariantSelect(variant.id)}
									/>
									<div className="flex items-center gap-2">
										<variant.icon className="h-4 w-4" />
										<span className="font-medium text-sm">{variant.name}</span>
									</div>
								</div>
								<p className="text-xs text-muted-foreground mt-1 ml-6">
									{variant.description}
								</p>
							</div>
						))}
						<div
							className={`p-3 border rounded-md cursor-pointer transition-colors ${
								showCustomSolutionVariant
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50"
							}`}
							onClick={() => onShowCustomSolutionVariantChange(true)}
						>
							<div className="flex items-center gap-2">
								<Checkbox
									checked={showCustomSolutionVariant}
									onCheckedChange={() => onShowCustomSolutionVariantChange(true)}
								/>
								<div className="flex items-center gap-2">
									<Plus className="h-4 w-4" />
									<span className="font-medium text-sm">Create New Variant</span>
								</div>
							</div>
						</div>
						<div
							className={`p-3 border rounded-md cursor-pointer transition-colors ${
								formData.solutionVariant === ""
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50"
							}`}
							onClick={() => {
								onFormDataChange({ solutionVariant: "" });
								onShowCustomSolutionVariantChange(false);
							}}
						>
							<div className="flex items-center gap-2">
								<Checkbox
									checked={formData.solutionVariant === ""}
									onCheckedChange={() => {
										onFormDataChange({ solutionVariant: "" });
										onShowCustomSolutionVariantChange(false);
									}}
								/>
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm text-muted-foreground">
										Skip Variant
									</span>
								</div>
							</div>
							<p className="text-xs text-muted-foreground mt-1 ml-6">
								No specific variant needed for this solution
							</p>
						</div>
					</div>

					{showCustomSolutionVariant && (
						<div className="mt-3 p-3 border rounded-md bg-muted/50">
							<Label htmlFor="customSolutionVariant" className="text-sm font-medium">
								New Solution Variant Name
							</Label>
							<Input
								id="customSolutionVariant"
								value={formData.customSolutionVariant}
								onChange={(e) =>
									onFormDataChange({ customSolutionVariant: e.target.value })
								}
								placeholder="Enter solution variant name"
								className="mt-1"
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
} 