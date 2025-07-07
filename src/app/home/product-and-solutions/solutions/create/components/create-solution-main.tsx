"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { getClientByUserId } from "@/lib/actions/client/client";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	ChevronDown,
	ChevronRight,
	Plus,
	ArrowRight,
	ArrowLeft,
	Building2,
	Cpu,
	Wrench,
	Settings,
	Calculator,
	FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
	solutionTypes,
	defaultParameters,
	defaultCalculations,
	type SolutionType,
	type SolutionVariant,
	type Parameter,
	type Calculation,
} from "../../mock-data";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import { ParametersConfiguration } from "./create-solution-parameters";
import { CalculationsConfiguration } from "./create-solution-calculations";

interface CreateSolutionData {
	selectedIndustry: string;
	selectedTechnology: string;
	solutionType: string;
	solutionVariant: string;
	solutionName: string;
	solutionDescription: string;
	customSolutionType: string;
	customSolutionVariant: string;
	parameters: Parameter[];
	calculations: Calculation[];
}

export function CreateSolutionMain() {
	const { user } = useUser();
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [clientData, setClientData] = useState<any>(null);
	const [availableIndustries, setAvailableIndustries] = useState<any[]>([]);
	const [availableTechnologies, setAvailableTechnologies] = useState<any[]>([]);
	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);
	const [showCustomSolutionType, setShowCustomSolutionType] = useState(false);
	const [showCustomSolutionVariant, setShowCustomSolutionVariant] =
		useState(false);

	const [formData, setFormData] = useState<CreateSolutionData>({
		selectedIndustry: "",
		selectedTechnology: "",
		solutionType: "",
		solutionVariant: "",
		solutionName: "",
		solutionDescription: "",
		customSolutionType: "",
		customSolutionVariant: "",
		parameters: [...defaultParameters],
		calculations: [...defaultCalculations],
	});

	// Load client data and available industries/technologies
	useEffect(() => {
		async function loadData() {
			if (!user?._id) return;

			setIsLoading(true);
			try {
				// Get client data
				const clientResult = await getClientByUserId(user._id);
				if (clientResult.error) {
					toast.error("Failed to load client data");
					return;
				}
				setClientData(clientResult.client);

				// Load available industries
				setIsLoadingIndustries(true);
				const industriesResult = await getIndustries();
				if (industriesResult.error) {
					toast.error("Failed to load industries");
				} else {
					setAvailableIndustries(industriesResult.industries || []);
				}
				setIsLoadingIndustries(false);

				// Load available technologies
				setIsLoadingTechnologies(true);
				const technologiesResult = await getTechnologies();
				if (technologiesResult.error) {
					toast.error("Failed to load technologies");
				} else {
					setAvailableTechnologies(technologiesResult.technologies || []);
				}
				setIsLoadingTechnologies(false);
			} catch (error) {
				console.error("Error loading data:", error);
				toast.error("Failed to load required data");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();
	}, [user?._id]);

	const handleNext = () => {
		if (currentStep < 5) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleIndustrySelect = (industryId: string) => {
		setFormData((prev) => ({ ...prev, selectedIndustry: industryId }));
	};

	const handleTechnologySelect = (technologyId: string) => {
		setFormData((prev) => ({ ...prev, selectedTechnology: technologyId }));
	};

	const handleSolutionTypeSelect = (solutionTypeId: string) => {
		setFormData((prev) => ({
			...prev,
			solutionType: solutionTypeId,
			solutionVariant: "", // Reset variant when type changes
		}));
		setShowCustomSolutionType(false);
	};

	const handleSolutionVariantSelect = (variantId: string) => {
		setFormData((prev) => ({ ...prev, solutionVariant: variantId }));
		setShowCustomSolutionVariant(false);
	};

	const handleParametersChange = (parameters: Parameter[]) => {
		setFormData((prev) => ({ ...prev, parameters }));
	};

	const handleCalculationsChange = (calculations: Calculation[]) => {
		setFormData((prev) => ({ ...prev, calculations }));
	};

	const handleCreateSolution = async () => {
		try {
			// Validate form data - solution variant is now optional
			if (
				!formData.selectedIndustry ||
				!formData.selectedTechnology ||
				!formData.solutionType ||
				!formData.solutionName ||
				!formData.solutionDescription
			) {
				toast.error("Please fill in all required fields");
				return;
			}

			// Here you would typically call your API to create the solution
			console.log("Creating solution:", formData);
			toast.success("Solution created successfully!");

			// Reset form and go back to step 1
			setFormData({
				selectedIndustry: "",
				selectedTechnology: "",
				solutionType: "",
				solutionVariant: "",
				solutionName: "",
				solutionDescription: "",
				customSolutionType: "",
				customSolutionVariant: "",
				parameters: [...defaultParameters],
				calculations: [...defaultCalculations],
			});
			setCurrentStep(1);
		} catch (error) {
			console.error("Error creating solution:", error);
			toast.error("Failed to create solution");
		}
	};

	const getSelectedIndustryName = () => {
		const industry = availableIndustries.find(
			(i) => i.id === formData.selectedIndustry
		);
		return industry?.name || formData.selectedIndustry;
	};

	const getSelectedTechnologyName = () => {
		const technology = availableTechnologies.find(
			(t) => t.id === formData.selectedTechnology
		);
		return technology?.name || formData.selectedTechnology;
	};

	const getSelectedSolutionType = () => {
		return solutionTypes.find((st) => st.id === formData.solutionType);
	};

	const getSelectedSolutionVariant = () => {
		const solutionType = getSelectedSolutionType();
		return solutionType?.variants.find(
			(v) => v.id === formData.solutionVariant
		);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<span className="ml-2">Loading...</span>
			</div>
		);
	}

	return (
		<div className=" mx-auto p-4 space-y-4">
			{/* Header */}
			<div className="text-center space-y-1">
				<h1 className="text-2xl font-bold">Create New Solution</h1>
				<p className="text-sm text-muted-foreground">
					Follow the steps below to create a new solution for your organization
				</p>
			</div>

			{/* Progress Steps */}
			<div className="flex items-center justify-center space-x-3 mb-6">
				{[1, 2, 3, 4, 5].map((step) => (
					<div key={step} className="flex items-center">
						<div
							className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
								currentStep >= step
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground"
							}`}
						>
							{step}
						</div>
						{step < 5 && (
							<div
								className={`w-12 h-0.5 mx-1 ${
									currentStep > step ? "bg-primary" : "bg-muted"
								}`}
							/>
						)}
					</div>
				))}
			</div>

			{/* Step Content */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center gap-2 text-lg">
						{currentStep === 1 && <Building2 className="h-4 w-4" />}
						{currentStep === 2 && <Cpu className="h-4 w-4" />}
						{currentStep === 3 && <FileText className="h-4 w-4" />}
						{currentStep === 4 && <Calculator className="h-4 w-4" />}
						{currentStep === 5 && <Settings className="h-4 w-4" />}
						{currentStep === 1 && "Select Industry"}
						{currentStep === 2 && "Select Technology"}
						{currentStep === 3 && "Solution Details"}
						{currentStep === 4 && "Parameters Configuration"}
						{currentStep === 5 && "Calculations Configuration"}
					</CardTitle>
					<CardDescription className="text-sm">
						{currentStep === 1 &&
							"Choose the industry that best fits your solution"}
						{currentStep === 2 &&
							"Select the technology category for your solution"}
						{currentStep === 3 &&
							"Define the type, variant, and details of your solution"}
						{currentStep === 4 &&
							"Configure system parameters and override values as needed"}
						{currentStep === 5 &&
							"Set up calculation formulas and view results"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 overflow-y-auto">
					{/* Step 1: Industry Selection */}
					{currentStep === 1 && (
						<div className="space-y-3">
							<div>
								<Label className="text-sm font-medium">
									Available Industries
								</Label>
								<p className="text-xs text-muted-foreground mb-2">
									Select from your organization's available industries
								</p>
								{isLoadingIndustries ? (
									<div className="flex items-center justify-center py-6">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
										<span className="ml-2 text-sm">Loading industries...</span>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
										{clientData?.selected_industries?.map(
											(industryId: string) => {
												const industry = availableIndustries.find(
													(i) => i.id === industryId
												);
												if (!industry) return null;

												return (
													<div
														key={industryId}
														className={`p-3 border rounded-md cursor-pointer transition-colors ${
															formData.selectedIndustry === industryId
																? "border-primary bg-primary/5"
																: "border-border hover:border-primary/50"
														}`}
														onClick={() => handleIndustrySelect(industryId)}
													>
														<div className="flex items-center gap-2">
															<Checkbox
																checked={
																	formData.selectedIndustry === industryId
																}
																onCheckedChange={() =>
																	handleIndustrySelect(industryId)
																}
															/>
															<div className="flex items-center gap-2">
																{industry.icon &&
																	stringToIconComponent(industry.icon) && (
																		<div className="h-4 w-4">
																			{React.createElement(
																				stringToIconComponent(industry.icon),
																				{ className: "h-4 w-4" }
																			)}
																		</div>
																	)}
																<span className="font-medium text-sm">
																	{industry.name}
																</span>
															</div>
														</div>
														<p className="text-xs text-muted-foreground mt-1 ml-6">
															{industry.description}
														</p>
													</div>
												);
											}
										)}
									</div>
								)}
							</div>
						</div>
					)}

					{/* Step 2: Technology Selection */}
					{currentStep === 2 && (
						<div className="space-y-3">
							<div>
								<Label className="text-sm font-medium">
									Available Technologies
								</Label>
								<p className="text-xs text-muted-foreground mb-2">
									Select from your organization's available technologies
								</p>
								{isLoadingTechnologies ? (
									<div className="flex items-center justify-center py-6">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
										<span className="ml-2 text-sm">
											Loading technologies...
										</span>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
										{clientData?.selected_technologies?.map(
											(technologyId: string) => {
												const technology = availableTechnologies.find(
													(t) => t.id === technologyId
												);
												if (!technology) return null;

												return (
													<div
														key={technologyId}
														className={`p-3 border rounded-md cursor-pointer transition-colors ${
															formData.selectedTechnology === technologyId
																? "border-primary bg-primary/5"
																: "border-border hover:border-primary/50"
														}`}
														onClick={() => handleTechnologySelect(technologyId)}
													>
														<div className="flex items-center gap-2">
															<Checkbox
																checked={
																	formData.selectedTechnology === technologyId
																}
																onCheckedChange={() =>
																	handleTechnologySelect(technologyId)
																}
															/>
															<div className="flex items-center gap-2">
																{technology.icon &&
																	stringToIconComponent(technology.icon) && (
																		<div className="h-4 w-4">
																			{React.createElement(
																				stringToIconComponent(technology.icon),
																				{ className: "h-4 w-4" }
																			)}
																		</div>
																	)}
																<span className="font-medium text-sm">
																	{technology.name}
																</span>
															</div>
														</div>
														<p className="text-xs text-muted-foreground mt-1 ml-6">
															{technology.description}
														</p>
													</div>
												);
											}
										)}
									</div>
								)}
							</div>
						</div>
					)}

					{/* Step 3: Solution Type, Variant, and Details */}
					{currentStep === 3 && (
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
										<span className="text-muted-foreground">
											Solution Type:
										</span>
										<p className="font-medium">
											{showCustomSolutionType
												? formData.customSolutionType
												: getSelectedSolutionType()?.name}
										</p>
									</div>
									<div>
										<span className="text-muted-foreground">
											Solution Variant:
										</span>
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
										setFormData((prev) => ({
											...prev,
											solutionName: e.target.value,
										}))
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
										setFormData((prev) => ({
											...prev,
											solutionDescription: e.target.value,
										}))
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
													onCheckedChange={() =>
														handleSolutionTypeSelect(solutionType.id)
													}
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
										onClick={() => setShowCustomSolutionType(true)}
									>
										<div className="flex items-center gap-2">
											<Checkbox
												checked={showCustomSolutionType}
												onCheckedChange={() => setShowCustomSolutionType(true)}
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
										<Label
											htmlFor="customSolutionType"
											className="text-sm font-medium"
										>
											New Solution Type Name
										</Label>
										<Input
											id="customSolutionType"
											value={formData.customSolutionType}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													customSolutionType: e.target.value,
												}))
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
										Choose a specific variant, create a new one, or skip this
										step
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
														onCheckedChange={() =>
															handleSolutionVariantSelect(variant.id)
														}
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
											onClick={() => setShowCustomSolutionVariant(true)}
										>
											<div className="flex items-center gap-2">
												<Checkbox
													checked={showCustomSolutionVariant}
													onCheckedChange={() =>
														setShowCustomSolutionVariant(true)
													}
												/>
												<div className="flex items-center gap-2">
													<Plus className="h-4 w-4" />
													<span className="font-medium text-sm">
														Create New Variant
													</span>
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
												setFormData((prev) => ({
													...prev,
													solutionVariant: "",
												}));
												setShowCustomSolutionVariant(false);
											}}
										>
											<div className="flex items-center gap-2">
												<Checkbox
													checked={formData.solutionVariant === ""}
													onCheckedChange={() => {
														setFormData((prev) => ({
															...prev,
															solutionVariant: "",
														}));
														setShowCustomSolutionVariant(false);
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
											<Label
												htmlFor="customSolutionVariant"
												className="text-sm font-medium"
											>
												New Solution Variant Name
											</Label>
											<Input
												id="customSolutionVariant"
												value={formData.customSolutionVariant}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														customSolutionVariant: e.target.value,
													}))
												}
												placeholder="Enter solution variant name"
												className="mt-1"
											/>
										</div>
									)}
								</div>
							)}
						</div>
					)}

					{/* Step 4: Parameters Configuration */}
					{currentStep === 4 && (
						<ParametersConfiguration
							parameters={formData.parameters}
							onParametersChange={handleParametersChange}
						/>
					)}

					{/* Step 5: Calculations Configuration */}
					{currentStep === 5 && (
						<CalculationsConfiguration
							calculations={formData.calculations}
							onCalculationsChange={handleCalculationsChange}
							parameters={formData.parameters}
						/>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between pt-4">
						<Button
							variant="outline"
							onClick={handlePrevious}
							disabled={currentStep === 1}
							className="flex items-center gap-2"
							size="sm"
						>
							<ArrowLeft className="h-4 w-4" />
							Previous
						</Button>

						{currentStep < 5 ? (
							<Button
								onClick={handleNext}
								disabled={
									(currentStep === 1 && !formData.selectedIndustry) ||
									(currentStep === 2 && !formData.selectedTechnology) ||
									(currentStep === 3 &&
										(!formData.solutionType ||
											!formData.solutionName ||
											!formData.solutionDescription))
								}
								className="flex items-center gap-2"
								size="sm"
							>
								Next
								<ArrowRight className="h-4 w-4" />
							</Button>
						) : (
							<Button
								onClick={handleCreateSolution}
								className="flex items-center gap-2"
								size="sm"
							>
								<Plus className="h-4 w-4" />
								Create Solution
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
