"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, ArrowLeft, Check, ChevronDown, ChevronUp } from "lucide-react";
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

interface CreateSolutionStep1Props {
	clientData: any;
	availableIndustries: any[];
	availableTechnologies: any[];
	availableSolutionTypes: any[];
	availableSolutionVariants: any[];
	isLoadingIndustries: boolean;
	isLoadingTechnologies: boolean;
	isLoadingSolutionTypes: boolean;
	isLoadingSolutionVariants: boolean;
	selectedIndustry: string;
	selectedTechnology: string;
	selectedSolutionId: string;
	selectedSolutionVariantId: string;
	onIndustrySelect: (industryId: string) => void;
	onTechnologySelect: (technologyId: string) => void;
	onSolutionTypeSelect: (solutionTypeId: string) => void;
	onSolutionVariantSelect: (variantId: string) => void;
	onFormDataChange: (updates: any) => void;
	onCreateNewSolution: () => void;
	onCreateNewVariant: () => void;
	onNoVariantSelect: () => void;
	onAddSolutionVariant: (variant: any) => void;
	formData: {
		solutionName: string;
		solutionDescription: string;
		solutionIcon: string;
		newVariantName: string;
		newVariantDescription: string;
		newVariantIcon: string;
	};
	isCreatingNewSolution: boolean;
	isCreatingNewVariant: boolean;
}

type Step = "industry" | "technology" | "solution";

export function CreateSolutionStep1({
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
}: CreateSolutionStep1Props) {
	const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
	const [isVariantIconSelectorOpen, setIsVariantIconSelectorOpen] = useState(false);
	const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
	const [isCreatingNewVariantPending, setIsCreatingNewVariantPending] = useState(false);

	// Get client's selected industries and technologies
	const clientSelectedIndustries = clientData?.selected_industries || [];
	const clientSelectedTechnologies = clientData?.selected_technologies || [];

	// Filter technologies based on selected industry
	const technologiesForSelectedIndustry = availableTechnologies.filter(
		(technology) => {
			if (!selectedIndustry) return true;
			const applicableIndustries = technology.applicableIndustries || [];
			return applicableIndustries.includes(selectedIndustry);
		}
	);

	// Get other industries (excluding client's selected ones)
	const otherIndustries = availableIndustries.filter(
		(industry) => !clientSelectedIndustries.includes(industry.id)
	);

	// Get other technologies (excluding client's selected ones and filtered by industry)
	const otherTechnologies = technologiesForSelectedIndustry.filter(
		(technology) => !clientSelectedTechnologies.includes(technology.id)
	);

	// Helper function to render selection card
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

	// Helper function to render solution category card
	const renderSolutionCategoryCard = (solutionCategory: any) => (
		<div
			key={solutionCategory.id}
			className={`p-2 border rounded-md cursor-pointer transition-colors text-xs ${
				selectedSolutionId === solutionCategory.id
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/50"
			}`}
			onClick={() => onSolutionTypeSelect(solutionCategory.id)}
		>
			<div className="flex items-center gap-1">
				{solutionCategory.icon ? (
					React.createElement(
						(typeof solutionCategory.icon as unknown) === 'string' 
							? stringToIconComponent(solutionCategory.icon as string)
							: solutionCategory.icon as any,
						{ className: "h-3 w-3" }
					)
				) : (
					<div className="h-3 w-3 bg-muted rounded"></div>
				)}
				<span className="font-medium truncate">{solutionCategory.name}</span>
			</div>
		</div>
	);

	// Helper function to render solution variant card
	const renderSolutionVariantCard = (variant: any) => (
		<div
			key={variant.id}
			className={`p-2 border rounded-md cursor-pointer transition-colors text-xs ${
				selectedSolutionVariantId === variant.id
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
				<span className="font-medium truncate">{variant.name}</span>
			</div>
		</div>
	);

	// Get selected items for display
	const getSelectedIndustry = () => availableIndustries.find(i => i.id === selectedIndustry);
	const getSelectedTechnology = () => availableTechnologies.find(t => t.id === selectedTechnology);
	const getSelectedSolutionCategory = () => availableSolutionTypes.find(s => s.id === selectedSolutionId);
	const getSelectedSolutionVariant = () => availableSolutionVariants.find(v => v.id === selectedSolutionVariantId);

	// Progressive filtering logic
	const canSelectTechnology = !!selectedIndustry;
	const canSelectSolution = !!selectedIndustry && !!selectedTechnology;

	const handleCreateNewVariant = () => {
		setIsCreatingNewVariantPending(true);
		onFormDataChange({
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		});
	};

	return (
		<div className="w-full">
			{/* Current Step Content */}
			<div className="space-y-12">
				{/* Industry Section */}
				<div className="space-y-4">
					{/* Industry Progress Indicator */}
					<div className="flex items-center gap-2 mb-2">
						<div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
							selectedIndustry ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
						}`}>
							{selectedIndustry ? <Check className="h-3 w-3" /> : "1"}
						</div>
						<span className={`text-sm ${selectedIndustry ? "font-medium" : ""}`}>
							Industry Selection
						</span>
					</div>

					<div>
					
						<p className="text-xs text-muted-foreground mb-3">
							Choose the industry that best fits your solution, some additional global parameters will be provided to you based on this selection
						</p>
					</div>

					{/* Client's Selected Industries */}
					{clientSelectedIndustries.length > 0 && (
						<div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Your Organization's Industries
							</Label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{clientSelectedIndustries.map((industryId: string) => {
									const industry = availableIndustries.find(i => i.id === industryId);
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
								{/* Selected Industry Card */}
								{selectedIndustry && (
									<div 
										className="p-3 border-2 border-primary rounded-md bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
										onClick={() => setOpenAccordion(openAccordion === "industries" ? undefined : "industries")}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Check className="h-4 w-4 text-primary" />
												<span className="text-sm font-medium">Selected Industry</span>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={(e) => {
														e.stopPropagation();
														onIndustrySelect("");
													}}
													className="h-6 px-2 text-xs"
												>
													Change
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={(e) => {
														e.stopPropagation();
														setOpenAccordion(openAccordion === "industries" ? undefined : "industries");
													}}
													className="h-6 px-2 text-xs"
												>
													{openAccordion === "industries" ? "Hide" : "Show"} List
												</Button>
											</div>
										</div>
										<div className="flex items-center gap-2 mt-2">
											{getSelectedIndustry()?.icon && stringToIconComponent(getSelectedIndustry()?.icon) && (
												<div className="h-4 w-4">
													{React.createElement(stringToIconComponent(getSelectedIndustry()?.icon), {
														className: "h-4 w-4",
													})}
												</div>
											)}
											<span className="font-medium text-sm">{getSelectedIndustry()?.name}</span>
										</div>
										<p className="text-xs text-muted-foreground mt-1 ml-6">
											{getSelectedIndustry()?.description}
										</p>
									</div>
								)}

								{/* Industries Accordion */}
								<Accordion 
									type="single" 
									collapsible 
									className="w-full"
									value={openAccordion}
									onValueChange={setOpenAccordion}
								>
									<AccordionItem value="industries" className="border rounded-md">
										<AccordionTrigger className="px-4 py-3 hover:no-underline">
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center gap-3">
													<span className="text-sm font-medium">
														{otherIndustries.length} Available Industries
													</span>
													{/* Preview of first few industries */}
													<div className="flex items-center gap-1">
														{otherIndustries.slice(0, 3).map((industry, index) => (
															<div key={industry.id} className="flex items-center gap-1">
																{industry.icon && stringToIconComponent(industry.icon) && (
																	<div className="h-3 w-3">
																		{React.createElement(stringToIconComponent(industry.icon), {
																			className: "h-3 w-3 text-muted-foreground",
																		})}
																	</div>
																)}
																<span className="text-xs text-muted-foreground">
																	{industry.name}
																</span>
																{index < Math.min(3, otherIndustries.length - 1) && (
																	<span className="text-xs text-muted-foreground">,</span>
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
				</div>

				{/* Separator */}
				<Separator className="my-8" />

				{/* Technology Section */}
				<div className={`space-y-4 ${!canSelectTechnology ? 'opacity-50 pointer-events-none' : ''}`}>
					{/* Technology Progress Indicator */}
					<div className="flex items-center gap-2 mb-2">
						<div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
							selectedTechnology ? "bg-green-500 text-white" : canSelectTechnology ? "bg-muted text-muted-foreground" : "bg-gray-200 text-gray-400"
						}`}>
							{selectedTechnology ? <Check className="h-3 w-3" /> : canSelectTechnology ? "2" : "2"}
						</div>
						<span className={`text-sm ${selectedTechnology ? "font-medium" : canSelectTechnology ? "" : "text-muted-foreground"}`}>
							Technology Selection
						</span>
						{!canSelectTechnology && (
							<span className="text-xs text-muted-foreground ml-2">
								(Select an industry first)
							</span>
						)}
					</div>

					<div>
				
						<p className="text-xs text-muted-foreground mb-3">
							{canSelectTechnology 
								? `Choose the technology that applies to ${getSelectedIndustry()?.name || "your selected industry"}`
								: "Please select an industry first to choose available technologies"
							}
						</p>
					</div>

					{/* Client's Selected Technologies */}
					{clientSelectedTechnologies.length > 0 && canSelectTechnology && (
						<div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Your Organization's Technologies
							</Label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{clientSelectedTechnologies.map((technologyId: string) => {
									const technology = technologiesForSelectedIndustry.find(t => t.id === technologyId);
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
								Available Technologies for {getSelectedIndustry()?.name || "Selected Industry"}
							</Label>
							{isLoadingTechnologies ? (
								<div className="flex items-center justify-center py-6">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
									<span className="ml-2 text-sm">Loading technologies...</span>
							</div>
						) : (
								<div className="space-y-3">
									{/* Selected Technology Card */}
									{selectedTechnology && (
										<div className="p-3 border-2 border-primary rounded-md bg-primary/5">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Check className="h-4 w-4 text-primary" />
													<span className="text-sm font-medium">Selected Technology</span>
												</div>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => onTechnologySelect("")}
													className="h-6 px-2 text-xs"
												>
													Change
												</Button>
											</div>
											<div className="flex items-center gap-2 mt-2">
												{getSelectedTechnology()?.icon && stringToIconComponent(getSelectedTechnology()?.icon) && (
													<div className="h-4 w-4">
														{React.createElement(stringToIconComponent(getSelectedTechnology()?.icon), {
															className: "h-4 w-4",
														})}
													</div>
												)}
												<span className="font-medium text-sm">{getSelectedTechnology()?.name}</span>
											</div>
											<p className="text-xs text-muted-foreground mt-1 ml-6">
												{getSelectedTechnology()?.description}
											</p>
										</div>
									)}

									{/* Technologies Accordion */}
									<Accordion type="single" collapsible className="w-full">
										<AccordionItem value="technologies" className="border rounded-md">
											<AccordionTrigger className="px-4 py-3 hover:no-underline">
												<div className="flex items-center justify-between w-full">
													<div className="flex items-center gap-3">
														<span className="text-sm font-medium">
															{otherTechnologies.length} Available Technologies
														</span>
														{/* Preview of first few technologies */}
														<div className="flex items-center gap-1">
															{otherTechnologies.slice(0, 3).map((technology, index) => (
																<div key={technology.id} className="flex items-center gap-1">
																	{technology.icon && stringToIconComponent(technology.icon) && (
																		<div className="h-3 w-3">
																			{React.createElement(stringToIconComponent(technology.icon), {
																				className: "h-3 w-3 text-muted-foreground",
																			})}
																		</div>
																	)}
																	<span className="text-xs text-muted-foreground">
																		{technology.name}
																	</span>
																	{index < Math.min(3, otherTechnologies.length - 1) && (
																		<span className="text-xs text-muted-foreground">,</span>
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
				</div>

				{/* Separator */}
				<Separator className="my-8" />

				{/* Solution Section */}
				<div className={`space-y-4 ${!canSelectSolution ? 'opacity-50 pointer-events-none' : ''}`}>
					{/* Solution Progress Indicator */}
					<div className="flex items-center gap-2 mb-2">
						<div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
							(selectedSolutionId || isCreatingNewSolution) ? "bg-green-500 text-white" : canSelectSolution ? "bg-muted text-muted-foreground" : "bg-gray-200 text-gray-400"
						}`}>
							{(selectedSolutionId || isCreatingNewSolution) ? <Check className="h-3 w-3" /> : canSelectSolution ? "3" : "3"}
							</div>
						<span className={`text-sm ${(selectedSolutionId || isCreatingNewSolution) ? "font-medium" : canSelectSolution ? "" : "text-muted-foreground"}`}>
							Solution Selection
						</span>
						{!canSelectSolution && (
							<span className="text-xs text-muted-foreground ml-2">
								(Select industry and technology first)
							</span>
						)}
					</div>

					<div>
						
						<p className="text-xs text-muted-foreground mb-3">
							{canSelectSolution 
								? `Choose a solution for ${getSelectedTechnology()?.name || "your selected technology"} in ${getSelectedIndustry()?.name || "your selected industry"}`
								: "Please select an industry and technology first to choose available solutions"
							}
						</p>
					</div>

					{/* Solution Category Selection */}
					{canSelectSolution && (
						<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
							<Label className="text-xs font-medium text-muted-foreground mb-2">
								Solution Category
							</Label>
							{isLoadingSolutionTypes ? (
								<div className="flex items-center justify-center py-4">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
									<span className="ml-2 text-sm">Loading solution categories...</span>
								</div>
							) : (
								<div className="space-y-3">
									{/* Selected Solution Category Card */}
									{selectedSolutionId && (
										<div 
											className="p-3 border-2 border-primary rounded-md bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
											onClick={() => setOpenAccordion(openAccordion === "solutions" ? undefined : "solutions")}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Check className="h-4 w-4 text-primary" />
													<span className="text-sm font-medium">Selected Solution Category</span>
												</div>
												<div className="flex items-center gap-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={(e) => {
															e.stopPropagation();
															onSolutionTypeSelect("");
														}}
														className="h-6 px-2 text-xs"
													>
														Change
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={(e) => {
															e.stopPropagation();
															setOpenAccordion(openAccordion === "solutions" ? undefined : "solutions");
														}}
														className="h-6 px-2 text-xs"
													>
														{openAccordion === "solutions" ? "Hide" : "Show"} List
													</Button>
												</div>
											</div>
											<div className="flex items-center gap-2 mt-2">
												{getSelectedSolutionCategory()?.icon ? (
													React.createElement(
														(typeof getSelectedSolutionCategory()?.icon as unknown) === 'string' 
															? stringToIconComponent(getSelectedSolutionCategory()?.icon as string)
															: getSelectedSolutionCategory()?.icon as any,
														{ className: "h-4 w-4" }
													)
												) : (
													<div className="h-4 w-4 bg-muted rounded"></div>
												)}
												<span className="font-medium text-sm">{getSelectedSolutionCategory()?.name}</span>
											</div>
											<p className="text-xs text-muted-foreground mt-1 ml-6">
												{getSelectedSolutionCategory()?.description}
											</p>
										</div>
									)}

									{/* Solution Categories Accordion */}
									<Accordion 
										type="single" 
										collapsible 
										className="w-full"
										value={openAccordion}
										onValueChange={setOpenAccordion}
									>
										<AccordionItem value="solutions" className="border rounded-md">
											<AccordionTrigger className="px-4 py-3 hover:no-underline">
												<div className="flex items-center justify-between w-full">
													<div className="flex items-center gap-3">
														<span className="text-sm font-medium">
															{availableSolutionTypes.length} Available Solution Categories
														</span>
														{/* Preview of first few solution categories */}
														<div className="flex items-center gap-1">
															{availableSolutionTypes.slice(0, 3).map((solutionCategory, index) => (
																<div key={solutionCategory.id} className="flex items-center gap-1">
																	{solutionCategory.icon ? (
																		React.createElement(
																			(typeof solutionCategory.icon as unknown) === 'string' 
																				? stringToIconComponent(solutionCategory.icon as string)
																				: solutionCategory.icon as any,
																			{ className: "h-3 w-3 text-muted-foreground" }
																		)
																	) : (
																		<div className="h-3 w-3 bg-muted rounded"></div>
																	)}
																	<span className="text-xs text-muted-foreground">
																		{solutionCategory.name}
																	</span>
																	{index < Math.min(3, availableSolutionTypes.length - 1) && (
																		<span className="text-xs text-muted-foreground">,</span>
																	)}
																</div>
															))}
															{availableSolutionTypes.length > 3 && (
																<span className="text-xs text-muted-foreground">
																	... and {availableSolutionTypes.length - 3} more
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
												<div className="grid grid-cols-2 md:grid-cols-3 gap-1 max-h-60 overflow-y-auto">
													{availableSolutionTypes.map(renderSolutionCategoryCard)}
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
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							)}
						</div>
					)}

					{/* New Solution Form */}
					{isCreatingNewSolution && canSelectSolution && (
						<div className="p-4 border rounded-md bg-muted/50 space-y-3">
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

							<div>
								<Label className="text-sm font-medium">Solution Name *</Label>
								<Input
									value={formData.solutionName}
									onChange={(e) => onFormDataChange({ solutionName: e.target.value })}
									placeholder="Enter solution name"
									className="mt-1"
								/>
							</div>

							<div>
								<Label className="text-sm font-medium">Solution Description *</Label>
								<Textarea
									value={formData.solutionDescription}
									onChange={(e) => onFormDataChange({ solutionDescription: e.target.value })}
									placeholder="Describe your solution in detail"
									className="mt-1"
									rows={3}
								/>
							</div>
						</div>
					)}

					{/* Solution Variant Selection */}
					{(selectedSolutionId || isCreatingNewSolution) && canSelectSolution && (
						<div className="space-y-4">
							<div>
								<Label className="text-sm font-medium">Solution Variant</Label>
								<p className="text-xs text-muted-foreground mb-3">
									Choose a variant for your selected solution category
								</p>
							</div>

							<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
								<Label className="text-xs font-medium text-muted-foreground mb-2">
									Solution Variants
								</Label>
								{isLoadingSolutionVariants ? (
									<div className="flex items-center justify-center py-4">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
										<span className="ml-2 text-sm">Loading variants...</span>
									</div>
								) : (
									<div className="space-y-3">
										{/* Selected Solution Variant Card */}
										{selectedSolutionVariantId && (
											<div 
												className="p-3 border-2 border-primary rounded-md bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
												onClick={() => setOpenAccordion(openAccordion === "variants" ? undefined : "variants")}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Check className="h-4 w-4 text-primary" />
														<span className="text-sm font-medium">Selected Solution Variant</span>
													</div>
													<div className="flex items-center gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																onSolutionVariantSelect("");
															}}
															className="h-6 px-2 text-xs"
														>
															Change
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																setOpenAccordion(openAccordion === "variants" ? undefined : "variants");
															}}
															className="h-6 px-2 text-xs"
														>
															{openAccordion === "variants" ? "Hide" : "Show"} List
														</Button>
													</div>
												</div>
												<div className="flex items-center gap-2 mt-2">
													{getSelectedSolutionVariant()?.icon ? (
														React.createElement(stringToIconComponent(getSelectedSolutionVariant()?.icon), { className: "h-4 w-4" })
													) : (
														<div className="h-4 w-4 bg-muted rounded"></div>
													)}
													<span className="font-medium text-sm">{getSelectedSolutionVariant()?.name}</span>
												</div>
												<p className="text-xs text-muted-foreground mt-1 ml-6">
													{getSelectedSolutionVariant()?.description}
												</p>
											</div>
										)}

										{/* Solution Variants Accordion */}
										<Accordion 
											type="single" 
											collapsible 
											className="w-full"
											value={openAccordion}
											onValueChange={setOpenAccordion}
										>
											<AccordionItem value="variants" className="border rounded-md">
												<AccordionTrigger className="px-4 py-3 hover:no-underline">
													<div className="flex items-center justify-between w-full">
														<div className="flex items-center gap-3">
															<span className="text-sm font-medium">
																{availableSolutionVariants.length + 1} Available Options
															</span>
															{/* Preview of first few variants */}
															<div className="flex items-center gap-1">
																{availableSolutionVariants.slice(0, 2).map((variant, index) => (
																	<div key={variant.id} className="flex items-center gap-1">
																		{variant.icon ? (
																			React.createElement(stringToIconComponent(variant.icon), { className: "h-3 w-3 text-muted-foreground" })
																		) : (
																			<div className="h-3 w-3 bg-muted rounded"></div>
																		)}
																		<span className="text-xs text-muted-foreground">
																			{variant.name}
																		</span>
																		{index < Math.min(2, availableSolutionVariants.length - 1) && (
																			<span className="text-xs text-muted-foreground">,</span>
																		)}
																	</div>
																))}
																{availableSolutionVariants.length > 2 && (
																	<span className="text-xs text-muted-foreground">
																		... and {availableSolutionVariants.length - 2} more
																	</span>
																)}
																<span className="text-xs text-muted-foreground">
																	, Create New
																</span>
															</div>
														</div>
														<span className="text-xs text-muted-foreground">
															Click to expand
														</span>
													</div>
												</AccordionTrigger>
												<AccordionContent className="px-4 pb-4">
													<div className="grid grid-cols-2 md:grid-cols-3 gap-1 max-h-60 overflow-y-auto">
														{!isCreatingNewSolution && availableSolutionVariants.map(renderSolutionVariantCard)}
														<div
															className={`p-2 border rounded-md cursor-pointer transition-colors text-xs ${
																isCreatingNewVariantPending
																	? "border-primary bg-primary/5"
																	: "border-border hover:border-primary/50"
															}`}
															onClick={handleCreateNewVariant}
														>
															<div className="flex items-center gap-1">
																<Plus className="h-3 w-3" />
																<span className="font-medium truncate">Create New</span>
															</div>
														</div>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</div>
								)}
							</div>

							{/* New Variant Form */}
							{isCreatingNewVariantPending && (
								<div className="p-4 border rounded-md bg-muted/50 space-y-3">
									<div>
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

									<div>
										<Label className="text-sm font-medium">Solution Variant Name *</Label>
										<Input
											value={formData.newVariantName}
											onChange={(e) => onFormDataChange({ newVariantName: e.target.value })}
											placeholder="Enter solution variant name"
											className="mt-1"
										/>
									</div>

									<div>
										<Label className="text-sm font-medium">Solution Variant Description *</Label>
										<Textarea
											value={formData.newVariantDescription}
											onChange={(e) => onFormDataChange({ newVariantDescription: e.target.value })}
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
													id: `new-variant-${Date.now()}`, // Temporary ID
													name: formData.newVariantName,
													description: formData.newVariantDescription,
													icon: formData.newVariantIcon,
												};
												
												// Add to available variants list
												onAddSolutionVariant(newVariant);
												
												// Select the new variant
												onSolutionVariantSelect(newVariant.id);
												
												// Clear the form and exit pending state
												setIsCreatingNewVariantPending(false);
												onFormDataChange({
													newVariantName: "",
													newVariantDescription: "",
													newVariantIcon: "",
												});
											}}
											disabled={!formData.newVariantName || !formData.newVariantDescription}
											className="text-xs"
										>
											Create Variant
										</Button>
										<Button
											variant="outline"
											onClick={() => {
												setIsCreatingNewVariantPending(false);
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
							</div>
						)}
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className="flex-shrink-0 flex justify-between pt-4 border-t">
				{/* Navigation buttons removed since all sections are visible */}
			</div>

			{/* Icon Selector Dialogs */}
			<Dialog open={isIconSelectorOpen} onOpenChange={setIsIconSelectorOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Select Solution Icon</DialogTitle>
						<DialogDescription>
							Choose an icon that best represents this solution category
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
						{iconOptions.map((option) => {
							const isSelected = option.value === formData.solutionIcon;
							return (
								<button
									key={option.value}
									onClick={() => {
										onFormDataChange({ solutionIcon: option.value });
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
										onFormDataChange({ newVariantIcon: option.value });
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
		</div>
	);
} 