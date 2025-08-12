"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Plus,
	ArrowRight,
	ArrowLeft,
	Check,
	ChevronDown,
	ChevronUp,
	Eye,
	Clock,
	User,
} from "lucide-react";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import { iconOptions } from "@/lib/icons/lucide-icons";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getClientSolutions } from "@/lib/actions/clients-solutions/clients-solutions";
import {
	StepContentStep1Props,
	IconSelectorDialogProps,
	CreateVariantDialogProps,
	Step,
	IndustrySectionProps,
	TechnologySectionProps,
	SolutionSectionProps,
	CreateSolutionFilterProps,
} from "./types/types";

/**
 * CreateSolutionStep1 component - First step of the solution creation process
 * Handles industry, technology, and solution selection with progressive filtering
 * Manages existing solutions display and new variant creation
 */
export function CreateSolutionFilter({
	clientData,
	availableIndustries,
	availableTechnologies,
	availableSolutionTypes,
	availableSolutionVariants,
	isLoadingIndustries,
	isLoadingTechnologies,
	isLoadingSolutionTypes,
	isLoadingSolutionVariants,
	selectedIndustry,
	selectedTechnology,
	selectedSolutionId,
	selectedSolutionVariantId,
	onIndustrySelect,
	onTechnologySelect,
	onSolutionTypeSelect,
	onSolutionVariantSelect,
	onFormDataChange,
	onCreateNewSolution,
	onCreateNewVariant,
	onNoVariantSelect,
	onAddSolutionVariant,
	formData,
	isCreatingNewSolution,
	isCreatingNewVariant,
}: CreateSolutionFilterProps) {
	// Dialog state
	const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
	const [isVariantIconSelectorOpen, setIsVariantIconSelectorOpen] =
		useState(false);
	const [isCreateVariantDialogOpen, setIsCreateVariantDialogOpen] =
		useState(false);

	// Accordion state
	const [openAccordion, setOpenAccordion] = useState<string | undefined>(
		undefined
	);

	// Existing solutions state
	const [existingSolutions, setExistingSolutions] = useState<any[]>([]);
	const [isLoadingExistingSolutions, setIsLoadingExistingSolutions] =
		useState(false);

	/**
	 * Get client's selected industries and technologies
	 */
	const clientSelectedIndustries = clientData?.selected_industries || [];
	const clientSelectedTechnologies = clientData?.selected_technologies || [];

	/**
	 * Filter technologies based on selected industry
	 */
	const technologiesForSelectedIndustry = availableTechnologies.filter(
		(technology) => {
			if (!selectedIndustry) return true;
			const applicableIndustries = technology.applicableIndustries || [];
			return applicableIndustries.includes(selectedIndustry);
		}
	);

	/**
	 * Get other industries (excluding client's selected ones)
	 */
	const otherIndustries = availableIndustries.filter(
		(industry) => !clientSelectedIndustries.includes(industry.id)
	);

	/**
	 * Get other technologies (excluding client's selected ones and filtered by industry)
	 */
	const otherTechnologies = technologiesForSelectedIndustry.filter(
		(technology) => !clientSelectedTechnologies.includes(technology.id)
	);

	/**
	 * Fetch existing solutions that match the current criteria
	 */
	const fetchExistingSolutions = useCallback(async () => {
		if (!selectedIndustry || !selectedTechnology || !selectedSolutionId || !clientData?.id) {
			setExistingSolutions([]);
			return;
		}

		setIsLoadingExistingSolutions(true);
		try {
			const result = await getClientSolutions(clientData.id);
			if (result.solutions) {
				const matchingSolutions = result.solutions.filter(
					(solution: any) =>
						solution.industry_id === selectedIndustry &&
						solution.technology_id === selectedTechnology &&
						solution.selected_solution_id === selectedSolutionId
				);
				setExistingSolutions(matchingSolutions);
			}
		} catch (error) {
			console.error("Error fetching existing solutions:", error);
			setExistingSolutions([]);
		} finally {
			setIsLoadingExistingSolutions(false);
		}
	}, [selectedIndustry, selectedTechnology, selectedSolutionId, clientData?.id]);

	/**
	 * Handle create new variant action
	 */
	const handleCreateNewVariant = () => {
		onFormDataChange({
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		});
		setIsCreateVariantDialogOpen(true);
	};

	/**
	 * Handle icon selection for solution
	 */
	const handleSolutionIconSelect = (icon: string) => {
		onFormDataChange({ solutionIcon: icon });
		setIsIconSelectorOpen(false);
	};

	/**
	 * Handle icon selection for variant
	 */
	const handleVariantIconSelect = (icon: string) => {
		onFormDataChange({ newVariantIcon: icon });
		setIsVariantIconSelectorOpen(false);
	};

	/**
	 * Handle variant creation
	 */
	const handleCreateVariant = () => {
		const newVariant = {
			id: `new-variant-${Date.now()}`,
			solution_name: formData.newVariantName,
			solution_description: formData.newVariantDescription,
			solution_icon: formData.newVariantIcon,
			status: "New",
			created_at: new Date().toISOString(),
			parameters: [],
		};

		setExistingSolutions((prev) => [newVariant, ...prev]);
		onSolutionVariantSelect(newVariant.id);
		setIsCreateVariantDialogOpen(false);
		onFormDataChange({
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		});
	};

	/**
	 * Fetch existing solutions when criteria change
	 */
	useEffect(() => {
		fetchExistingSolutions();
	}, [
		selectedIndustry,
		selectedTechnology,
		selectedSolutionId,
		clientData?.id,
		fetchExistingSolutions,
	]);

	return (
		<div className="w-full">
			{/* Current Step Content */}
			<StepContent
				clientData={clientData}
				availableIndustries={availableIndustries}
				availableTechnologies={availableTechnologies}
				availableSolutionTypes={availableSolutionTypes}
				availableSolutionVariants={availableSolutionVariants}
				isLoadingIndustries={isLoadingIndustries}
				isLoadingTechnologies={isLoadingTechnologies}
				isLoadingSolutionTypes={isLoadingSolutionTypes}
				isLoadingSolutionVariants={isLoadingSolutionVariants}
				selectedIndustry={selectedIndustry}
				selectedTechnology={selectedTechnology}
				selectedSolutionId={selectedSolutionId}
				selectedSolutionVariantId={selectedSolutionVariantId}
				onIndustrySelect={onIndustrySelect}
				onTechnologySelect={onTechnologySelect}
				onSolutionTypeSelect={onSolutionTypeSelect}
				onSolutionVariantSelect={onSolutionVariantSelect}
				onFormDataChange={onFormDataChange}
				onCreateNewSolution={onCreateNewSolution}
				onCreateNewVariant={onCreateNewVariant}
				onNoVariantSelect={onNoVariantSelect}
				onAddSolutionVariant={onAddSolutionVariant}
				formData={formData}
				isCreatingNewSolution={isCreatingNewSolution}
				isCreatingNewVariant={isCreatingNewVariant}
				existingSolutions={existingSolutions}
				isLoadingExistingSolutions={isLoadingExistingSolutions}
				openAccordion={openAccordion}
				setOpenAccordion={setOpenAccordion}
				handleCreateNewVariant={handleCreateNewVariant}
			/>

			{/* Icon Selector Dialog */}
			<IconSelectorDialog
				isOpen={isIconSelectorOpen}
				onOpenChange={setIsIconSelectorOpen}
				selectedIcon={formData.solutionIcon}
				onIconSelect={handleSolutionIconSelect}
				title="Select Solution Icon"
				description="Choose an icon that best represents this solution category"
			/>

			{/* Create New Variant Dialog */}
			<CreateVariantDialog
				isOpen={isCreateVariantDialogOpen}
				onOpenChange={setIsCreateVariantDialogOpen}
				formData={formData}
				onFormDataChange={onFormDataChange}
				onCreateVariant={handleCreateVariant}
				isVariantIconSelectorOpen={isVariantIconSelectorOpen}
				setIsVariantIconSelectorOpen={setIsVariantIconSelectorOpen}
			/>

			{/* Variant Icon Selector Dialog */}
			<IconSelectorDialog
				isOpen={isVariantIconSelectorOpen}
				onOpenChange={setIsVariantIconSelectorOpen}
				selectedIcon={formData.newVariantIcon}
				onIconSelect={handleVariantIconSelect}
				title="Select Solution Variant Icon"
				description="Choose an icon that best represents this solution variant"
			/>
		</div>
	);
}

/**
 * StepContent component - Renders the main step content with industry, technology, and solution selection
 */
function StepContent({
	clientData,
	availableIndustries,
	availableTechnologies,
	availableSolutionTypes,
	availableSolutionVariants,
	isLoadingIndustries,
	isLoadingTechnologies,
	isLoadingSolutionTypes,
	isLoadingSolutionVariants,
	selectedIndustry,
	selectedTechnology,
	selectedSolutionId,
	selectedSolutionVariantId,
	onIndustrySelect,
	onTechnologySelect,
	onSolutionTypeSelect,
	onSolutionVariantSelect,
	onFormDataChange,
	onCreateNewSolution,
	onCreateNewVariant,
	onNoVariantSelect,
	onAddSolutionVariant,
	formData,
	isCreatingNewSolution,
	isCreatingNewVariant,
	existingSolutions,
	isLoadingExistingSolutions,
	openAccordion,
	setOpenAccordion,
	handleCreateNewVariant,
}: StepContentStep1Props) {
	/**
	 * Get client's selected industries and technologies
	 */
	const clientSelectedIndustries = clientData?.selected_industries || [];
	const clientSelectedTechnologies = clientData?.selected_technologies || [];

	/**
	 * Filter technologies based on selected industry
	 */
	const technologiesForSelectedIndustry = availableTechnologies.filter(
		(technology) => {
			if (!selectedIndustry) return true;
			const applicableIndustries = technology.applicableIndustries || [];
			return applicableIndustries.includes(selectedIndustry);
		}
	);

	/**
	 * Get other industries (excluding client's selected ones)
	 */
	const otherIndustries = availableIndustries.filter(
		(industry) => !clientSelectedIndustries.includes(industry.id)
	);

	/**
	 * Get other technologies (excluding client's selected ones and filtered by industry)
	 */
	const otherTechnologies = technologiesForSelectedIndustry.filter(
		(technology) => !clientSelectedTechnologies.includes(technology.id)
	);

	/**
	 * Progressive filtering logic
	 */
	const canSelectTechnology = !!selectedIndustry;
	const canSelectSolution = !!selectedIndustry && !!selectedTechnology;

	/**
	 * Get selected items for display
	 */
	const getSelectedIndustry = () =>
		availableIndustries.find((i) => i.id === selectedIndustry);
	const getSelectedTechnology = () =>
		availableTechnologies.find((t) => t.id === selectedTechnology);
	const getSelectedSolutionCategory = () =>
		availableSolutionTypes.find((s) => s.id === selectedSolutionId);
	const getSelectedSolutionVariant = () =>
		availableSolutionVariants.find((v) => v.id === selectedSolutionVariantId);

	/**
	 * Helper function to render selection card
	 */
	const renderSelectionCard = (
		item: any,
		itemId: string,
		isSelected: boolean,
		onSelect: (id: string) => void,
		showIcon = true
	) => (
		<div
			key={itemId}
			className={`p-3 border rounded-md cursor-pointer transition-colors ${
				isSelected
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/50"
			}`}
			onClick={() => onSelect(itemId)}
		>
			<div className="flex items-center gap-2">
				<Checkbox
					checked={isSelected}
					onCheckedChange={() => onSelect(itemId)}
				/>
				<div className="flex items-center gap-2">
					{showIcon && item.icon && stringToIconComponent(item.icon) && (
						<div className="h-4 w-4">
							{React.createElement(stringToIconComponent(item.icon), {
								className: "h-4 w-4",
							})}
						</div>
					)}
					<span className="font-medium text-sm">{item.name}</span>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-1 ml-6">
				{item.description}
			</p>
		</div>
	);

	/**
	 * Helper function to render solution category card
	 */
	const renderSolutionCategoryCard = (solutionCategory: any) => (
		<div
			key={solutionCategory.id}
			className={`p-3 border rounded-md cursor-pointer transition-colors ${
				selectedSolutionId === solutionCategory.id
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/50"
			}`}
			onClick={() => onSolutionTypeSelect(solutionCategory.id)}
		>
			<div className="flex items-center gap-2">
				<Checkbox
					checked={selectedSolutionId === solutionCategory.id}
					onCheckedChange={() => onSolutionTypeSelect(solutionCategory.id)}
				/>
				<div className="flex items-center gap-2">
					{solutionCategory.icon ? (
						React.createElement(
							(typeof solutionCategory.icon as unknown) === "string"
								? stringToIconComponent(solutionCategory.icon as string)
								: (solutionCategory.icon as any),
							{ className: "h-4 w-4" }
						)
					) : (
						<div className="h-4 w-4 bg-muted rounded"></div>
					)}
					<span className="font-medium text-sm">{solutionCategory.name}</span>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-1 ml-6">
				{solutionCategory.description}
			</p>
		</div>
	);

	return (
		<div className="space-y-6">
			{/* Industry Section */}
			<IndustrySection
				selectedIndustry={selectedIndustry}
				clientSelectedIndustries={clientSelectedIndustries}
				otherIndustries={otherIndustries}
				availableIndustries={availableIndustries}
				isLoadingIndustries={isLoadingIndustries}
				onIndustrySelect={onIndustrySelect}
				openAccordion={openAccordion}
				setOpenAccordion={setOpenAccordion}
				getSelectedIndustry={getSelectedIndustry}
				renderSelectionCard={renderSelectionCard}
			/>

			{/* Technology Section - Only show if industry is selected */}
			{selectedIndustry && (
				<TechnologySection
					selectedTechnology={selectedTechnology}
					clientSelectedTechnologies={clientSelectedTechnologies}
					otherTechnologies={otherTechnologies}
					technologiesForSelectedIndustry={technologiesForSelectedIndustry}
					canSelectTechnology={canSelectTechnology}
					isLoadingTechnologies={isLoadingTechnologies}
					onTechnologySelect={onTechnologySelect}
					getSelectedIndustry={getSelectedIndustry}
					getSelectedTechnology={getSelectedTechnology}
					renderSelectionCard={renderSelectionCard}
				/>
			)}

			{/* Solution Section - Only show if technology is selected */}
			{selectedTechnology && (
				<SolutionSection
					selectedSolutionId={selectedSolutionId}
					selectedSolutionVariantId={selectedSolutionVariantId}
					availableSolutionTypes={availableSolutionTypes}
					canSelectSolution={canSelectSolution}
					isLoadingSolutionTypes={isLoadingSolutionTypes}
					isCreatingNewSolution={isCreatingNewSolution}
					onSolutionTypeSelect={onSolutionTypeSelect}
					onSolutionVariantSelect={onSolutionVariantSelect}
					onCreateNewSolution={onCreateNewSolution}
					getSelectedIndustry={getSelectedIndustry}
					getSelectedTechnology={getSelectedTechnology}
					getSelectedSolutionCategory={getSelectedSolutionCategory}
					renderSolutionCategoryCard={renderSolutionCategoryCard}
					existingSolutions={existingSolutions}
					isLoadingExistingSolutions={isLoadingExistingSolutions}
					isCreatingNewVariant={isCreatingNewVariant}
					formData={formData}
					onFormDataChange={onFormDataChange}
					handleCreateNewVariant={handleCreateNewVariant}
					onAddSolutionVariant={onAddSolutionVariant}
					renderSelectionCard={renderSelectionCard}
				/>
			)}
		</div>
	);
}

/**
 * IconSelectorDialog component - Dialog for selecting icons
 */
function IconSelectorDialog({
	isOpen,
	onOpenChange,
	selectedIcon,
	onIconSelect,
	title,
	description,
}: IconSelectorDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
					{iconOptions.map((option) => {
						const isSelected = option.value === selectedIcon;
						return (
							<button
								key={option.value}
								onClick={() => {
									onIconSelect(option.value);
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
						onClick={() => onOpenChange(false)}
						variant="outline"
						size="sm"
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/**
 * CreateVariantDialog component - Reusable dialog for creating new solution variants
 */
function CreateVariantDialog({
	isOpen,
	onOpenChange,
	formData,
	onFormDataChange,
	onCreateVariant,
	isVariantIconSelectorOpen,
	setIsVariantIconSelectorOpen,
}: CreateVariantDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Create New Solution Variant</DialogTitle>
					<DialogDescription>
						Create a new variant for your selected solution category
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label className="text-sm font-medium">Solution Variant Icon</Label>
						<div className="flex items-center gap-3 mt-1">
							<div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-gray-50">
								{formData.newVariantIcon ? (
									React.createElement(
										stringToIconComponent(formData.newVariantIcon),
										{ className: "h-5 w-5 text-gray-600" }
									)
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

					<div>
						<Label className="text-sm font-medium">
							Solution Variant Name *
						</Label>
						<Input
							value={formData.newVariantName}
							onChange={(e) =>
								onFormDataChange({ newVariantName: e.target.value })
							}
							placeholder="Enter solution variant name"
							className="mt-1"
						/>
					</div>

					<div>
						<Label className="text-sm font-medium">
							Solution Variant Description *
						</Label>
						<Textarea
							value={formData.newVariantDescription}
							onChange={(e) =>
								onFormDataChange({
									newVariantDescription: e.target.value,
								})
							}
							placeholder="Describe your solution variant in detail"
							className="mt-1"
							rows={3}
						/>
					</div>
				</div>
				<div className="flex justify-end gap-2 mt-6 pt-4 border-t">
					<Button
						onClick={() => onOpenChange(false)}
						variant="outline"
						size="sm"
					>
						Cancel
					</Button>
					<Button
						onClick={onCreateVariant}
						disabled={
							!formData.newVariantName || !formData.newVariantDescription
						}
						size="sm"
					>
						Create Variant
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/**
 * IndustrySection component - Renders the industry selection section
 */
function IndustrySection({
	selectedIndustry,
	clientSelectedIndustries,
	otherIndustries,
	availableIndustries,
	isLoadingIndustries,
	onIndustrySelect,
	openAccordion,
	setOpenAccordion,
	getSelectedIndustry,
	renderSelectionCard,
}: IndustrySectionProps) {
	return (
		<div className="space-y-4">
			{/* Industry Progress Indicator */}
			<div className="flex items-center gap-2 mb-2">
				<div
					className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
						selectedIndustry
							? "bg-green-500 text-white"
							: "bg-muted text-muted-foreground"
					}`}
				>
					{selectedIndustry ? <Check className="h-3 w-3" /> : "1"}
				</div>
				<span className={`text-sm ${selectedIndustry ? "font-medium" : ""}`}>
					Industry Selection
				</span>
			</div>

			{/* Collapsed State - When industry is selected */}
			{selectedIndustry ? (
				<div className="p-3 border-2 border-green-200 rounded-md bg-green-50">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Check className="h-4 w-4 text-green-600" />
							<div className="flex items-center gap-2">
								{getSelectedIndustry()?.icon &&
									stringToIconComponent(getSelectedIndustry()?.icon) && (
										<div className="h-4 w-4">
											{React.createElement(
												stringToIconComponent(getSelectedIndustry()?.icon),
												{
													className: "h-4 w-4",
												}
											)}
										</div>
									)}
								<span className="font-medium text-sm">
									{getSelectedIndustry()?.name}
								</span>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onIndustrySelect("")}
							className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
						>
							Change
						</Button>
					</div>
				</div>
			) : (
				/* Expanded State - When no industry is selected */
				<>
					<div>
						<p className="text-xs text-muted-foreground mb-3">
							Choose the industry that best fits your solution, some additional
							global parameters will be provided to you based on this selection
						</p>
					</div>

					{/* Client's Selected Industries */}
					{clientSelectedIndustries.length > 0 && (
						<div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Your Organization&apos;s Industries
							</Label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{clientSelectedIndustries.map((industryId: string) => {
									const industry = availableIndustries.find(
										(i) => i.id === industryId
									);
									if (!industry) return null;
									return renderSelectionCard(
										industry,
										industryId,
										selectedIndustry === industryId,
										onIndustrySelect
									);
								})}
							</div>
						</div>
					)}

					{/* All Available Industries */}
					<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
						<Label className="text-xs font-medium text-muted-foreground mb-2">
							All Available Industries
						</Label>
						{isLoadingIndustries ? (
							<div className="flex items-center justify-center py-6">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
								<span className="ml-2 text-sm">Loading industries...</span>
							</div>
						) : (
							<div className="space-y-3">
								{/* Industries Accordion */}
								<Accordion
									type="single"
									collapsible
									className="w-full"
									value={openAccordion}
									onValueChange={setOpenAccordion}
								>
									<AccordionItem
										value="industries"
										className="border rounded-md"
									>
										<AccordionTrigger className="px-4 py-3 hover:no-underline">
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center gap-3">
													<span className="text-sm font-medium">
														{otherIndustries.length} Available Industries
													</span>
													{/* Preview of first few industries */}
													<div className="flex items-center gap-1">
														{otherIndustries
															.slice(0, 3)
															.map((industry, index) => (
																<div
																	key={industry.id}
																	className="flex items-center gap-1"
																>
																	{industry.icon &&
																		stringToIconComponent(industry.icon) && (
																			<div className="h-3 w-3">
																				{React.createElement(
																					stringToIconComponent(industry.icon),
																					{
																						className:
																							"h-3 w-3 text-muted-foreground",
																					}
																				)}
																			</div>
																		)}
																	<span className="text-xs text-muted-foreground">
																		{industry.name}
																	</span>
																	{index <
																		Math.min(3, otherIndustries.length - 1) && (
																		<span className="text-xs text-muted-foreground">
																			,
																		</span>
																	)}
																</div>
															))}
														{otherIndustries.length > 3 && (
															<span className="text-xs text-muted-foreground">
																... and {otherIndustries.length - 3} more
															</span>
														)}
													</div>
												</div>
												<span className="text-xs text-muted-foreground">
													Click to expand
												</span>
											</div>
										</AccordionTrigger>
										<AccordionContent className="px-4 pb-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
												{otherIndustries.map((industry) =>
													renderSelectionCard(
														industry,
														industry.id,
														selectedIndustry === industry.id,
														onIndustrySelect
													)
												)}
											</div>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

/**
 * TechnologySection component - Renders the technology selection section
 */
function TechnologySection({
	selectedTechnology,
	clientSelectedTechnologies,
	otherTechnologies,
	technologiesForSelectedIndustry,
	canSelectTechnology,
	isLoadingTechnologies,
	onTechnologySelect,
	getSelectedIndustry,
	getSelectedTechnology,
	renderSelectionCard,
}: TechnologySectionProps) {
	return (
		<div className="space-y-4">
			{/* Technology Progress Indicator */}
			<div className="flex items-center gap-2 mb-2">
				<div
					className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
						selectedTechnology
							? "bg-green-500 text-white"
							: canSelectTechnology
							? "bg-muted text-muted-foreground"
							: "bg-gray-200 text-gray-400"
					}`}
				>
					{selectedTechnology ? (
						<Check className="h-3 w-3" />
					) : canSelectTechnology ? (
						"2"
					) : (
						"2"
					)}
				</div>
				<span
					className={`text-sm ${
						selectedTechnology
							? "font-medium"
							: canSelectTechnology
							? ""
							: "text-muted-foreground"
					}`}
				>
					Technology Selection
				</span>
			</div>

			{/* Collapsed State - When technology is selected */}
			{selectedTechnology ? (
				<div className="p-3 border-2 border-green-200 rounded-md bg-green-50">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Check className="h-4 w-4 text-green-600" />
							<div className="flex items-center gap-2">
								{getSelectedTechnology()?.icon &&
									stringToIconComponent(getSelectedTechnology()?.icon) && (
										<div className="h-4 w-4">
											{React.createElement(
												stringToIconComponent(getSelectedTechnology()?.icon),
												{
													className: "h-4 w-4",
												}
											)}
										</div>
									)}
								<span className="font-medium text-sm">
									{getSelectedTechnology()?.name}
								</span>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onTechnologySelect("")}
							className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
						>
							Change
						</Button>
					</div>
				</div>
			) : (
				/* Expanded State - When no technology is selected */
				<>
					<div>
						<p className="text-xs text-muted-foreground mb-3">
							{canSelectTechnology
								? `Choose the technology that applies to ${
										getSelectedIndustry()?.name || "your selected industry"
								  }`
								: "Please select an industry first to choose available technologies"}
						</p>
					</div>

					{/* Client's Selected Technologies */}
					{clientSelectedTechnologies.length > 0 && canSelectTechnology && (
						<div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Your Organization&apos;s Technologies
							</Label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{clientSelectedTechnologies.map((technologyId: string) => {
									const technology = technologiesForSelectedIndustry.find(
										(t) => t.id === technologyId
									);
									if (!technology) return null;
									return renderSelectionCard(
										technology,
										technologyId,
										selectedTechnology === technologyId,
										onTechnologySelect
									);
								})}
							</div>
						</div>
					)}

					{/* Available Technologies for Selected Industry */}
					{canSelectTechnology && (
						<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Available Technologies for{" "}
								{getSelectedIndustry()?.name || "Selected Industry"}
							</Label>
							{isLoadingTechnologies ? (
								<div className="flex items-center justify-center py-6">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
									<span className="ml-2 text-sm">Loading technologies...</span>
								</div>
							) : (
								<div className="space-y-3">
									{/* Technologies Accordion */}
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem
											value="technologies"
											className="border rounded-md"
										>
											<AccordionTrigger className="px-4 py-3 hover:no-underline">
												<div className="flex items-center justify-between w-full">
													<div className="flex items-center gap-3">
														<span className="text-sm font-medium">
															{otherTechnologies.length} Available Technologies
														</span>
														{/* Preview of first few technologies */}
														<div className="flex items-center gap-1">
															{otherTechnologies
																.slice(0, 3)
																.map((technology, index) => (
																	<div
																		key={technology.id}
																		className="flex items-center gap-1"
																	>
																		{technology.icon &&
																			stringToIconComponent(
																				technology.icon
																			) && (
																				<div className="h-3 w-3">
																					{React.createElement(
																						stringToIconComponent(
																							technology.icon
																						),
																						{
																							className:
																								"h-3 w-3 text-muted-foreground",
																						}
																					)}
																				</div>
																			)}
																		<span className="text-xs text-muted-foreground">
																			{technology.name}
																		</span>
																		{index <
																			Math.min(
																				3,
																				otherTechnologies.length - 1
																			) && (
																			<span className="text-xs text-muted-foreground">
																				,
																			</span>
																		)}
																	</div>
																))}
															{otherTechnologies.length > 3 && (
																<span className="text-xs text-muted-foreground">
																	... and {otherTechnologies.length - 3} more
																</span>
															)}
														</div>
													</div>
													<span className="text-xs text-muted-foreground">
														Click to expand
													</span>
												</div>
											</AccordionTrigger>
											<AccordionContent className="px-4 pb-4">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
													{otherTechnologies.map((technology) =>
														renderSelectionCard(
															technology,
															technology.id,
															selectedTechnology === technology.id,
															onTechnologySelect
														)
													)}
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}

/**
 * SolutionSection component - Renders the solution selection section
 */
function SolutionSection({
	selectedSolutionId,
	selectedSolutionVariantId,
	availableSolutionTypes,
	canSelectSolution,
	isLoadingSolutionTypes,
	isCreatingNewSolution,
	onSolutionTypeSelect,
	onSolutionVariantSelect,
	onCreateNewSolution,
	getSelectedIndustry,
	getSelectedTechnology,
	getSelectedSolutionCategory,
	renderSolutionCategoryCard,
	existingSolutions,
	isLoadingExistingSolutions,
	isCreatingNewVariant,
	formData,
	onFormDataChange,
	handleCreateNewVariant,
	onAddSolutionVariant,
	renderSelectionCard,
}: SolutionSectionProps) {
	return (
		<div className="space-y-4">
			{/* Solution Progress Indicator */}
			<div className="flex items-center gap-2 mb-2">
				<div
					className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
						selectedSolutionId || isCreatingNewSolution
							? "bg-green-500 text-white"
							: canSelectSolution
							? "bg-muted text-muted-foreground"
							: "bg-gray-200 text-gray-400"
					}`}
				>
					{selectedSolutionId || isCreatingNewSolution ? (
						<Check className="h-3 w-3" />
					) : canSelectSolution ? (
						"3"
					) : (
						"3"
					)}
				</div>
				<span
					className={`text-sm ${
						selectedSolutionId || isCreatingNewSolution
							? "font-medium"
							: canSelectSolution
							? ""
							: "text-muted-foreground"
					}`}
				>
					Solution Selection
				</span>
			</div>

			{/* Collapsed State - When solution is selected */}
			{selectedSolutionId ? (
				<div className="space-y-4">
					<div className="p-3 border-2 border-green-200 rounded-md bg-green-50">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Check className="h-4 w-4 text-green-600" />
								<div className="flex items-center gap-2">
									{getSelectedSolutionCategory()?.icon ? (
										React.createElement(
											(typeof getSelectedSolutionCategory()
												?.icon as unknown) === "string"
												? stringToIconComponent(
														getSelectedSolutionCategory()?.icon as string
												  )
												: (getSelectedSolutionCategory()?.icon as any),
											{ className: "h-4 w-4" }
										)
									) : (
										<div className="h-4 w-4 bg-muted rounded"></div>
									)}
									<span className="font-medium text-sm">
										{getSelectedSolutionCategory()?.name}
									</span>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onSolutionTypeSelect("")}
								className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
							>
								Change
							</Button>
						</div>
					</div>

					{/* Solution Variant Selection - Show when solution is selected */}
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
								{selectedSolutionVariantId ? (
									<Check className="h-3 w-3" />
								) : (
									"4"
								)}
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
												const selectedVariant = existingSolutions.find(
													(s) => s.id === selectedSolutionVariantId
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
										onClick={() => onSolutionVariantSelect("")}
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
												These solutions already exist for your selected
												criteria. You can view and edit them or create a new
												variant.
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
													{/* Create New Variant Card */}
													<div
														className={`p-2 border rounded-md cursor-pointer transition-colors ${
															selectedSolutionVariantId === "create-new"
																? "border-primary bg-primary/5"
																: "bg-white hover:border-primary/50"
														}`}
														onClick={handleCreateNewVariant}
													>
														<div className="flex items-center justify-between mb-1">
															<div className="flex items-center gap-1.5 min-w-0">
																<Checkbox
																	checked={
																		selectedSolutionVariantId === "create-new"
																	}
																	onCheckedChange={handleCreateNewVariant}
																	className="h-3 w-3"
																/>
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
													{existingSolutions.map((solution) => (
														<div
															key={solution.id}
															className={`p-2 border rounded-md cursor-pointer transition-colors ${
																selectedSolutionVariantId === solution.id
																	? "border-primary bg-primary/5"
																	: "bg-white hover:border-primary/50"
															}`}
															onClick={() =>
																onSolutionVariantSelect(solution.id)
															}
														>
															<div className="flex items-center justify-between mb-1">
																<div className="flex items-center gap-1.5">
																	<Checkbox
																		checked={
																			selectedSolutionVariantId === solution.id
																		}
																		onCheckedChange={() =>
																			onSolutionVariantSelect(solution.id)
																		}
																		className="h-3 w-3"
																	/>
																	<Eye className="h-3.5 w-3.5 flex-shrink-0" />
																	<span className="font-medium text-xs truncate">
																		Existing Solution
																	</span>
																</div>
																<Badge
																	variant="outline"
																	className="text-xs flex-shrink-0 px-1.5 py-0.5"
																>
																	{solution.status}
																</Badge>
															</div>
															<div className="space-y-0.5 min-w-0">
																<div className="flex items-center gap-1">
																	{solution.solution_icon ? (
																		React.createElement(
																			stringToIconComponent(
																				solution.solution_icon
																			),
																			{
																				className: "h-3.5 w-3.5 flex-shrink-0",
																			}
																		)
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
																		<span className="truncate text-xs">
																			{new Date(
																				solution.created_at
																			).toLocaleDateString()}
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
													))}
												</div>
											)}
										</div>
									</div>
								)}

								{/* New Variant Form */}
								{isCreatingNewVariant && (
									<div className="p-4 border rounded-md bg-muted/50 space-y-3">
										<div>
											<Label className="text-sm font-medium">
												Solution Variant Icon
											</Label>
											<div className="flex items-center gap-3 mt-1">
												<div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-gray-50">
													{formData.newVariantIcon ? (
														React.createElement(
															stringToIconComponent(formData.newVariantIcon),
															{ className: "h-5 w-5 text-gray-600" }
														)
													) : (
														<Plus className="h-5 w-5 text-gray-600" />
													)}
												</div>
												<Button variant="outline" size="sm" className="text-xs">
													{formData.newVariantIcon
														? "Change Icon"
														: "Select Icon"}
												</Button>
											</div>
										</div>

										<div>
											<Label className="text-sm font-medium">
												Solution Variant Name *
											</Label>
											<Input
												value={formData.newVariantName}
												onChange={(e) =>
													onFormDataChange({ newVariantName: e.target.value })
												}
												placeholder="Enter solution variant name"
												className="mt-1"
											/>
										</div>

										<div>
											<Label className="text-sm font-medium">
												Solution Variant Description *
											</Label>
											<Textarea
												value={formData.newVariantDescription}
												onChange={(e) =>
													onFormDataChange({
														newVariantDescription: e.target.value,
													})
												}
												placeholder="Describe your solution variant in detail"
												className="mt-1"
												rows={3}
											/>
										</div>

										<div className="flex items-center gap-2 pt-2">
											<Button
												onClick={() => {
													// Create the variant locally and optimistically display it
													const newVariant = {
														id: `new-variant-${Date.now()}`,
														name: formData.newVariantName,
														description: formData.newVariantDescription,
														icon: formData.newVariantIcon,
													};

													// Add to available variants list
													onAddSolutionVariant(newVariant);

													// Select the new variant
													onSolutionVariantSelect(newVariant.id);

													// Clear the form and exit pending state
													onFormDataChange({
														newVariantName: "",
														newVariantDescription: "",
														newVariantIcon: "",
													});
												}}
												disabled={
													!formData.newVariantName ||
													!formData.newVariantDescription
												}
												className="text-xs"
											>
												Create Variant
											</Button>
											<Button
												variant="outline"
												onClick={() => {
													onFormDataChange({
														newVariantName: "",
														newVariantDescription: "",
														newVariantIcon: "",
													});
												}}
												className="text-xs"
											>
												Cancel
											</Button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			) : (
				/* Expanded State - When no solution is selected */
				<>
					<div>
						<p className="text-xs text-muted-foreground mb-3">
							{canSelectSolution
								? `Choose a solution for ${
										getSelectedTechnology()?.name || "your selected technology"
								  } in ${
										getSelectedIndustry()?.name || "your selected industry"
								  }`
								: "Please select an industry and technology first to choose available solutions"}
						</p>
					</div>

					{/* Solution Category Selection */}
					{canSelectSolution && (
						<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Solution Categories for{" "}
								{getSelectedTechnology()?.name || "Selected Technology"}
							</Label>
							{isLoadingSolutionTypes ? (
								<div className="flex items-center justify-center py-6">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
									<span className="ml-2 text-sm">
										Loading solution categories...
									</span>
								</div>
							) : (
								<div className="space-y-3">
									{/* Solution Categories Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
										{availableSolutionTypes.map((solutionCategory) => (
											<div
												key={solutionCategory.id}
												className={`p-3 border rounded-md cursor-pointer transition-colors ${
													selectedSolutionId === solutionCategory.id
														? "border-primary bg-primary/5"
														: "bg-white hover:border-primary/50"
												}`}
												onClick={() =>
													onSolutionTypeSelect(solutionCategory.id)
												}
											>
												<div className="flex items-center gap-2">
													<Checkbox
														checked={selectedSolutionId === solutionCategory.id}
														onCheckedChange={() =>
															onSolutionTypeSelect(solutionCategory.id)
														}
													/>
													<div className="flex items-center gap-2">
														{solutionCategory.icon ? (
															React.createElement(
																(typeof solutionCategory.icon as unknown) ===
																	"string"
																	? stringToIconComponent(
																			solutionCategory.icon as string
																	  )
																	: (solutionCategory.icon as any),
																{ className: "h-4 w-4" }
															)
														) : (
															<div className="h-4 w-4 bg-muted rounded"></div>
														)}
														<span className="font-medium text-sm">
															{solutionCategory.name}
														</span>
													</div>
												</div>
												<p className="text-xs text-muted-foreground mt-1 ml-6">
													{solutionCategory.description}
												</p>
											</div>
										))}
										{/* Create New Solution Card */}
										<div
											className={`p-3 border rounded-md cursor-pointer transition-colors ${
												isCreatingNewSolution
													? "border-primary bg-primary/5"
													: "bg-white hover:border-primary/50"
											}`}
											onClick={onCreateNewSolution}
										>
											<div className="flex items-center gap-2">
												<Checkbox
													checked={isCreatingNewSolution}
													onCheckedChange={onCreateNewSolution}
												/>
												<div className="flex items-center gap-2">
													<Plus className="h-4 w-4" />
													<span className="font-medium text-sm">
														Create New
													</span>
												</div>
											</div>
											<p className="text-xs text-muted-foreground mt-1 ml-6">
												Create a new solution category
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
