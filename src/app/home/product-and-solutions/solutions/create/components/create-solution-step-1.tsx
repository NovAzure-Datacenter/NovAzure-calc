"use client";

import React, { useState, useEffect } from "react";
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
	const [isVariantIconSelectorOpen, setIsVariantIconSelectorOpen] =
		useState(false);
	const [openAccordion, setOpenAccordion] = useState<string | undefined>(
		undefined
	);
	const [existingSolutions, setExistingSolutions] = useState<any[]>([]);
	const [isLoadingExistingSolutions, setIsLoadingExistingSolutions] =
		useState(false);
	const [isCreateVariantDialogOpen, setIsCreateVariantDialogOpen] = useState(false);

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

	// Get selected items for display
	const getSelectedIndustry = () =>
		availableIndustries.find((i) => i.id === selectedIndustry);
	const getSelectedTechnology = () =>
		availableTechnologies.find((t) => t.id === selectedTechnology);
	const getSelectedSolutionCategory = () =>
		availableSolutionTypes.find((s) => s.id === selectedSolutionId);
	const getSelectedSolutionVariant = () =>
		availableSolutionVariants.find((v) => v.id === selectedSolutionVariantId);

	// Progressive filtering logic
	const canSelectTechnology = !!selectedIndustry;
	const canSelectSolution = !!selectedIndustry && !!selectedTechnology;

	// Fetch existing solutions that match the current criteria
	const fetchExistingSolutions = async () => {
		if (
			!clientData?.id ||
			!selectedIndustry ||
			!selectedTechnology ||
			!selectedSolutionId
		) {
			setExistingSolutions([]);
			return;
		}

		setIsLoadingExistingSolutions(true);
		try {
			const result = await getClientSolutions(clientData.id);
			if (result.solutions) {
				// Filter solutions that match the current criteria
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
	};

	// Fetch existing solutions when criteria change
	useEffect(() => {
		fetchExistingSolutions();
	}, [
		selectedIndustry,
		selectedTechnology,
		selectedSolutionId,
		clientData?.id,
	]);

	const handleCreateNewVariant = () => {
		onFormDataChange({
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		});
		setIsCreateVariantDialogOpen(true);
	};
	



	return (
		<div className="w-full">
			{/* Current Step Content */}
			<div className="space-y-12">
				{/* Industry Section */}
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
						<span
							className={`text-sm ${selectedIndustry ? "font-medium" : ""}`}
						>
							Industry Selection
						</span>
					</div>

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
								Your Organization's Industries
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
								{/* Selected Industry Card */}
								{selectedIndustry && (
									<div
										className="p-3 border-2 border-primary rounded-md bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
										onClick={() =>
											setOpenAccordion(
												openAccordion === "industries"
													? undefined
													: "industries"
											)
										}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Check className="h-4 w-4 text-primary" />
												<span className="text-sm font-medium">
													Selected Industry
												</span>
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
														setOpenAccordion(
															openAccordion === "industries"
																? undefined
																: "industries"
														);
													}}
													className="h-6 px-2 text-xs"
												>
													{openAccordion === "industries" ? "Hide" : "Show"}{" "}
													List
												</Button>
											</div>
										</div>
										<div className="flex items-center gap-2 mt-2">
											{getSelectedIndustry()?.icon &&
												stringToIconComponent(getSelectedIndustry()?.icon) && (
													<div className="h-4 w-4">
														{React.createElement(
															stringToIconComponent(
																getSelectedIndustry()?.icon
															),
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
				</div>

				{/* Separator */}
				<Separator className="my-8" />

				{/* Technology Section */}
				<div
					className={`space-y-4 ${
						!canSelectTechnology ? "opacity-50 pointer-events-none" : ""
					}`}
				>
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
						{!canSelectTechnology && (
							<span className="text-xs text-muted-foreground ml-2">
								(Select an industry first)
							</span>
						)}
					</div>

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
								Your Organization's Technologies
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
									{/* Selected Technology Card */}
									{selectedTechnology && (
										<div className="p-3 border-2 border-primary rounded-md bg-primary/5">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Check className="h-4 w-4 text-primary" />
													<span className="text-sm font-medium">
														Selected Technology
													</span>
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
												{getSelectedTechnology()?.icon &&
													stringToIconComponent(
														getSelectedTechnology()?.icon
													) && (
														<div className="h-4 w-4">
															{React.createElement(
																stringToIconComponent(
																	getSelectedTechnology()?.icon
																),
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
											<p className="text-xs text-muted-foreground mt-1 ml-6">
												{getSelectedTechnology()?.description}
											</p>
										</div>
									)}

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
				</div>

				{/* Separator */}
				<Separator className="my-8" />

				{/* Solution Section */}
				<div
					className={`space-y-4 ${
						!canSelectSolution ? "opacity-50 pointer-events-none" : ""
					}`}
				>
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
						{!canSelectSolution && (
							<span className="text-xs text-muted-foreground ml-2">
								(Select industry and technology first)
							</span>
						)}
					</div>

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
								Solution Categories for {getSelectedTechnology()?.name || "Selected Technology"}
							</Label>
							{isLoadingSolutionTypes ? (
								<div className="flex items-center justify-center py-6">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
									<span className="ml-2 text-sm">Loading solution categories...</span>
								</div>
							) : (
								<div className="space-y-3">
									{/* Selected Solution Category Card */}
									{selectedSolutionId && (
										<div
											className="p-3 border-2 border-primary rounded-md bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
											onClick={() =>
												setOpenAccordion(
													openAccordion === "solutions"
														? undefined
														: "solutions"
												)
											}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Check className="h-4 w-4 text-primary" />
													<span className="text-sm font-medium">
														Selected Solution Category
													</span>
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
															setOpenAccordion(
																openAccordion === "solutions"
																	? undefined
																	: "solutions"
															);
														}}
														className="h-6 px-2 text-xs"
													>
														{openAccordion === "solutions" ? "Hide" : "Show"}{" "}
														List
													</Button>
												</div>
											</div>
											<div className="flex items-center gap-2 mt-2">
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
										<AccordionItem
											value="solutions"
											className="border rounded-md"
										>
											<AccordionTrigger className="px-4 py-3 hover:no-underline">
												<div className="flex items-center justify-between w-full">
													<div className="flex items-center gap-3">
														<span className="text-sm font-medium">
															{availableSolutionTypes.length} Available Solution
															Categories
														</span>
														{/* Preview of first few solution categories */}
														<div className="flex items-center gap-1">
															{availableSolutionTypes
																.slice(0, 3)
																.map((solutionCategory, index) => (
																	<div
																		key={solutionCategory.id}
																		className="flex items-center gap-1"
																	>
																		{solutionCategory.icon ? (
																			React.createElement(
																				(typeof solutionCategory.icon as unknown) ===
																					"string"
																					? stringToIconComponent(
																							solutionCategory.icon as string
																					  )
																					: (solutionCategory.icon as any),
																				{
																					className:
																						"h-3 w-3 text-muted-foreground",
																				}
																			)
																		) : (
																			<div className="h-3 w-3 bg-muted rounded"></div>
																		)}
																		<span className="text-xs text-muted-foreground">
																			{solutionCategory.name}
																		</span>
																		{index <
																			Math.min(
																				3,
																				availableSolutionTypes.length - 1
																			) && (
																			<span className="text-xs text-muted-foreground">
																				,
																			</span>
																		)}
																	</div>
																))}
															{availableSolutionTypes.length > 3 && (
																<span className="text-xs text-muted-foreground">
																	... and {availableSolutionTypes.length - 3}{" "}
																	more
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
												<div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
													{availableSolutionTypes.map(
														renderSolutionCategoryCard
													)}
													<div
														className={`p-3 border rounded-md cursor-pointer transition-colors ${
															isCreatingNewSolution
																? "border-primary bg-primary/5"
																: "border-border hover:border-primary/50"
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
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							)}
						</div>
					)}

					{/* Solution Variant Selection */}
					{(selectedSolutionId || isCreatingNewSolution) &&
						canSelectSolution && (
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
										className={`text-sm ${selectedSolutionVariantId ? "font-medium" : ""}`}
									>
										Solution Variant Selection
									</span>
									{!selectedSolutionVariantId && (
										<span className="text-xs text-muted-foreground ml-2">
											(Select a solution variant to continue)
										</span>
									)}
								</div>

								{/* Selected Solution Variant Display */}
								{selectedSolutionVariantId && (
									<div className="p-3 border-2 border-primary rounded-md bg-primary/5">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Check className="h-4 w-4 text-primary" />
												<span className="text-sm font-medium">
													Selected Solution Variant
												</span>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onSolutionVariantSelect("")}
												className="h-6 px-2 text-xs"
											>
												Change
											</Button>
										</div>
										<div className="flex items-center gap-2 mt-2">
											{(() => {
												const selectedVariant = existingSolutions.find(s => s.id === selectedSolutionVariantId);
												return (
													<>
														{selectedVariant?.solution_icon ? (
															React.createElement(
																stringToIconComponent(selectedVariant.solution_icon),
																{ className: "h-4 w-4" }
															)
														) : (
															<div className="h-4 w-4 bg-muted rounded"></div>
														)}
														<span className="font-medium text-sm">
															{selectedVariant?.solution_name || "New Variant"}
														</span>
													</>
												);
											})()}
										</div>
										<p className="text-xs text-muted-foreground mt-1 ml-6">
											{(() => {
												const selectedVariant = existingSolutions.find(s => s.id === selectedSolutionVariantId);
												return selectedVariant?.solution_description || "Newly created variant";
											})()}
										</p>
									</div>
								)}

								{/* Existing Solutions Section */}
								{existingSolutions.length > 0 && (
									<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
										<Accordion type="single" collapsible className="w-full">
											<AccordionItem
												value="existing-solutions"
												className="border rounded-md"
											>
												<AccordionTrigger className="px-4 py-3 hover:no-underline">
													<div className="flex items-center justify-between w-full">
														<div className="flex items-center gap-3">
															<Eye className="h-3 w-3 text-muted-foreground" />
															<span className="text-sm font-medium">
																Existing Solutions ({existingSolutions.length})
															</span>
															{/* Preview of first few solutions */}
															<div className="flex items-center gap-1">
																<span className="text-xs text-muted-foreground">
																	Create New Variant
																</span>
																<span className="text-xs text-muted-foreground">,</span>
																{existingSolutions.slice(0, 1).map((solution, index) => (
																	<div
																		key={solution.id}
																		className="flex items-center gap-1"
																	>
																		{solution.solution_icon ? (
																			React.createElement(
																				stringToIconComponent(
																					solution.solution_icon
																				),
																				{
																					className:
																						"h-3 w-3 text-muted-foreground",
																				}
																			)
																		) : (
																			<div className="h-3 w-3 bg-muted rounded"></div>
																		)}
																		<span className="text-xs text-muted-foreground">
																			{solution.solution_name}
																		</span>
																		{index <
																			Math.min(
																				1,
																				existingSolutions.length - 1
																			) && (
																			<span className="text-xs text-muted-foreground">
																				,
																			</span>
																		)}
																	</div>
																))}
																{existingSolutions.length > 1 && (
																	<span className="text-xs text-muted-foreground">
																		... and {existingSolutions.length - 1} more
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
													<div className="space-y-2">
														<p className="text-xs text-muted-foreground mb-3">
															These solutions already exist for your selected
															criteria. You can view them for reference or
															create a new variant.
														</p>
														{isLoadingExistingSolutions ? (
															<div className="flex items-center justify-center py-4">
																<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground"></div>
																<span className="ml-2 text-sm text-muted-foreground">
																	Loading existing solutions...
																</span>
															</div>
														) : (
															<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
																{/* Create New Variant Card */}
																<div
																	className={`p-3 border rounded-md cursor-pointer transition-colors ${
																		selectedSolutionVariantId === "create-new"
																			? "border-primary bg-primary/5"
																			: "border-border hover:border-primary/50"
																	}`}
																	onClick={handleCreateNewVariant}
																>
																	<div className="flex items-center justify-between mb-2">
																		<div className="flex items-center gap-2">
																			<Checkbox
																				checked={selectedSolutionVariantId === "create-new"}
																				onCheckedChange={handleCreateNewVariant}
																			/>
																			<Plus className="h-3 w-3 text-muted-foreground" />
																			<span className="font-medium text-xs">
																				Create New Variant
																			</span>
																		</div>
																		<Badge variant="outline" className="text-xs">
																			New
																		</Badge>
																	</div>
																	<div className="space-y-1">
										
																		<p className="text-xs text-muted-foreground line-clamp-2">
																			Add a new variant to your selected solution category
																		</p>
									
																	</div>
																</div>
																{existingSolutions.map((solution) => (
																	<div
																		key={solution.id}
																		className={`p-3 border rounded-md cursor-pointer transition-colors text-xs ${
																			selectedSolutionVariantId === solution.id
																				? "border-primary bg-primary/5"
																				: "bg-white hover:border-primary/50"
																		}`}
																		onClick={() => onSolutionVariantSelect(solution.id)}
																	>
																		<div className="flex items-center justify-between mb-2">
																			<div className="flex items-center gap-2">
																				<Checkbox
																					checked={selectedSolutionVariantId === solution.id}
																					onCheckedChange={() => onSolutionVariantSelect(solution.id)}
																				/>
																				<Eye className="h-3 w-3 text-muted-foreground" />
																				<span className="font-medium text-xs">
																					Existing Solution
																				</span>
																			</div>
																			<Badge
																				variant="outline"
																				className="text-xs"
																			>
																				{solution.status}
																			</Badge>
																		</div>
																		<div className="space-y-1">
																			<div className="flex items-center gap-1">
																				{solution.solution_icon ? (
																					React.createElement(
																						stringToIconComponent(
																							solution.solution_icon
																						),
																						{
																							className: "h-3 w-3",
																						}
																					)
																				) : (
																					<div className="h-3 w-3 bg-muted rounded"></div>
																				)}
																				<span className="font-medium text-xs truncate">
																					{solution.solution_name}
																				</span>
																			</div>
																			<p className="text-xs text-muted-foreground line-clamp-2">
																				{solution.solution_description}
																			</p>
																			<div className="flex items-center gap-2 text-xs text-muted-foreground">
																				<div className="flex items-center gap-1">
																					<Clock className="h-3 w-3" />
																					<span>
																						{new Date(
																							solution.created_at
																						).toLocaleDateString()}
																					</span>
																				</div>
																				<div className="flex items-center gap-1">
																					<User className="h-3 w-3" />
																					<span>
																						{solution.parameters?.length || 0}{" "}
																						params
																					</span>
																				</div>
																			</div>
																		</div>
																	</div>
																))}
															</div>
														)}
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
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
													// setIsCreatingNewVariant(false);
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
													// setIsCreatingNewVariant(false);
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

			{/* Create New Variant Dialog */}
			<Dialog open={isCreateVariantDialogOpen} onOpenChange={setIsCreateVariantDialogOpen}>
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
							<Label className="text-sm font-medium">Solution Variant Name *</Label>
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
							<Label className="text-sm font-medium">Solution Variant Description *</Label>
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
							onClick={() => setIsCreateVariantDialogOpen(false)}
							variant="outline"
							size="sm"
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								// Create the variant locally and optimistically display it
								const newVariant = {
									id: `new-variant-${Date.now()}`,
									solution_name: formData.newVariantName,
									solution_description: formData.newVariantDescription,
									solution_icon: formData.newVariantIcon,
									status: "New",
									created_at: new Date().toISOString(),
									parameters: [],
								};

								// Add to existing solutions list
								setExistingSolutions(prev => [newVariant, ...prev]);

								// Select the new variant
								onSolutionVariantSelect(newVariant.id);

								// Clear the form and close dialog
								setIsCreateVariantDialogOpen(false);
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
							size="sm"
						>
							Create Variant
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isVariantIconSelectorOpen}
				onOpenChange={setIsVariantIconSelectorOpen}
			>
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
