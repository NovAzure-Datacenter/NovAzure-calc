"use client";

import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { ParameterMain } from "./components/create-solution-parameters/parameter-main";
import { CalculationMain } from "./components/create-solution-calculations/calculation-main";
import { CreateSolutionProgress } from "./components/create-solution-progress";
import { CreateSolutionFilter } from "./create-solution-filter";
import { CreateSolutionSubmit } from "./create-solution-submit";
import { SubmissionDialog } from "./components/submission-dialog";
import { DraftDialog } from "./components/draft-dialog";
import Loading from "@/components/loading-main";
import { Calculation } from "@/types/types";
import { Parameter } from "@/types/types";
import {
	CreateSolutionData,
	CreateSolutionMainProps,
	StepContentProps,
} from "./types/types";
import {
	fetchInitialData,
	fetchSolutionTypes,
	fetchSolutionVariants,
	fetchExistingSolutionData,
	createNewSolution,
	createNewSolutionVariant,
	createNewClientSolution,
	updateExistingClientSolution,
	fetchClientSelectedData,
	filterTechnologiesByIndustry,
	getOtherIndustries,
	getOtherTechnologies,
} from "./api";
import ValueMain from "./components/create-solution-valuebuilder/value-main";
/**
 * CreateSolutionMain component - Main orchestrator for the solution builder feature
 * Manages state, data fetching, and coordinates between different creation steps
 * Handles user interactions and solution creation flow for both new and existing solutions
 */
export default function CreateSolutionMain({}: CreateSolutionMainProps) {
	const { user } = useUser();

	// Step management state
	const [currentStep, setCurrentStep] = useState(1);

	// Loading states
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);
	const [isLoadingSolutionTypes, setIsLoadingSolutionTypes] = useState(false);
	const [isLoadingSolutionVariants, setIsLoadingSolutionVariants] =
		useState(false);
	const [isLoadingParameters, setIsLoadingParameters] = useState(false);
	const [isLoadingCalculations, setIsLoadingCalculations] = useState(false);

	// Data fetching state
	const [clientData, setClientData] = useState<any>(null);
	const [availableIndustries, setAvailableIndustries] = useState<any[]>([]);
	const [availableTechnologies, setAvailableTechnologies] = useState<any[]>([]);
	const [availableSolutionTypes, setAvailableSolutionTypes] = useState<any[]>(
		[]
	);
	const [availableSolutionVariants, setAvailableSolutionVariants] = useState<
		any[]
	>([]);

	// Creation mode state
	const [isCreatingNewSolution, setIsCreatingNewSolution] = useState(false);
	const [isCreatingNewVariant, setIsCreatingNewVariant] = useState(false);

	// Submission state
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
	const [submissionStatus, setSubmissionStatus] = useState<"success" | "error">(
		"success"
	);
	const [submissionMessage, setSubmissionMessage] = useState("");
	const [submittedSolutionName, setSubmittedSolutionName] = useState("");
	const [showDraftDialog, setShowDraftDialog] = useState(false);
	const [draftStatus, setDraftStatus] = useState<"success" | "error">(
		"success"
	);
	const [draftMessage, setDraftMessage] = useState("");
	const [draftSolutionName, setDraftSolutionName] = useState("");

	// Solution tracking state
	const [isExistingSolutionLoaded, setIsExistingSolutionLoaded] =
		useState(false);
	const [existingSolutionId, setExistingSolutionId] = useState<string | null>(
		null
	);

	// Category states for parameters and calculations
	const [customParameterCategories, setCustomParameterCategories] = useState<
		Array<{ name: string; color: string }>
	>([]);
	const [customCalculationCategories, setCustomCalculationCategories] =
		useState<Array<{ name: string; color: string }>>([]);

	// Form data state
	const [formData, setFormData] = useState<CreateSolutionData>({
		selectedIndustry: "",
		selectedTechnology: "",
		selectedSolutionId: "",
		selectedSolutionVariantId: "",
		solutionName: "",
		solutionDescription: "",
		solutionIcon: "",
		newVariantName: "",
		newVariantDescription: "",
		newVariantIcon: "",
		parameters: [],
		calculations: [],
	});

	/**
	 * Load initial client data and populate industries/technologies
	 */
	const loadInitialData = useCallback(async () => {
		if (!user) return;

		setIsLoading(true);

		try {
			// Load initial data using centralized API
			const initialData = await fetchInitialData(user._id);

			if (initialData.clientData) {
				setClientData(initialData.clientData);
				setAvailableIndustries(initialData.industries);
				setAvailableTechnologies(initialData.technologies);

	
			} else {
				console.error("Error loading client data");
				toast.error("Failed to load client data");
				return;
			}
		} catch (error) {
			console.error("Error loading data:", error);
			toast.error("Failed to load initial data");
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	/**
	 * Fetch solution types based on selected industry and technology
	 */
	const loadSolutionTypes = async (
		industryId: string,
		technologyId: string
	) => {
		try {
			setIsLoadingSolutionTypes(true);
			const result = await fetchSolutionTypes(industryId, technologyId);
			setAvailableSolutionTypes(result);
		} catch (error) {
			console.error("Error fetching solution types:", error);
			toast.error("Failed to load solution types");
		} finally {
			setIsLoadingSolutionTypes(false);
		}
	};

	/**
	 * Fetch solution variants for the selected solution type
	 */
	const loadSolutionVariants = async (solutionId: string) => {
		try {
			setIsLoadingSolutionVariants(true);
			const result = await fetchSolutionVariants(solutionId);
			setAvailableSolutionVariants(result);
		} catch (error) {
			console.error("Error fetching solution variants:", error);
			toast.error("Failed to load solution variants");
		} finally {
			setIsLoadingSolutionVariants(false);
		}
	};

	/**
	 * Load existing solution data (parameters and calculations)
	 */
	const loadExistingSolutionData = async (solutionVariantId: string) => {
		try {
			setIsLoadingParameters(true);
			setIsLoadingCalculations(true);

			const result = await fetchExistingSolutionData(
				solutionVariantId,
				clientData,
				formData.parameters
			);

			if (result.existingSolution) {
				setFormData((prev) => ({
					...prev,
					parameters: result.parameters,
					calculations: result.calculations,
				}));
				setIsExistingSolutionLoaded(true);
				setExistingSolutionId(result.existingSolution.id || null);
			} else {
				setFormData((prev) => ({
					...prev,
					parameters: result.parameters,
				}));
				toast.warning(
					"Existing solution not found. Starting with global parameters."
				);
			}
		} catch (error) {
			console.error("Error loading existing solution data:", error);
			toast.error("Failed to load existing solution data");
		} finally {
			setIsLoadingParameters(false);
			setIsLoadingCalculations(false);
		}
	};

	/**
	 * Handle industry selection change
	 */
	const handleIndustrySelect = (industryId: string) => {
		setFormData((prev) => ({ ...prev, selectedIndustry: industryId }));
		setFormData((prev) => ({
			...prev,
			selectedTechnology: "",
			selectedSolutionId: "",
			selectedSolutionVariantId: "",
		}));
		setAvailableSolutionTypes([]);
		setAvailableSolutionVariants([]);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	};

	/**
	 * Handle technology selection change
	 */
	const handleTechnologySelect = (technologyId: string) => {
		setFormData((prev) => ({ ...prev, selectedTechnology: technologyId }));
		setFormData((prev) => ({
			...prev,
			selectedSolutionId: "",
			selectedSolutionVariantId: "",
		}));
		setAvailableSolutionVariants([]);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);

		if (formData.selectedIndustry && technologyId) {
			loadSolutionTypes(formData.selectedIndustry, technologyId);
		}
	};

	/**
	 * Handle solution type selection change
	 */
	const handleSolutionTypeSelect = (solutionTypeId: string) => {
		setFormData((prev) => ({
			...prev,
			selectedSolutionId: solutionTypeId,
			selectedSolutionVariantId: "",
		}));
		setIsCreatingNewSolution(false);
		setIsCreatingNewVariant(false);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);

		setFormData((prev) => ({
			...prev,
			solutionName: "",
			solutionDescription: "",
			solutionIcon: "",
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		}));

		if (solutionTypeId) {
			loadSolutionVariants(solutionTypeId);
		}
	};

	/**
	 * Handle solution variant selection change
	 */
	const handleSolutionVariantSelect = (variantId: string) => {
		setFormData((prev) => ({ ...prev, selectedSolutionVariantId: variantId }));
		setIsCreatingNewVariant(false);
		setFormData((prev) => ({
			...prev,
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		}));

		if (variantId.startsWith("new-variant-")) {
			setIsExistingSolutionLoaded(false);
			setExistingSolutionId(null);

			setFormData((prev) => ({
				...prev,
				parameters: [],
				calculations: []
			}));
		}

		if (variantId && !variantId.startsWith("new-variant-")) {
			setIsExistingSolutionLoaded(false);
			setExistingSolutionId(null);
			loadExistingSolutionData(variantId);
		}
	};

	/**
	 * Handle creation mode changes
	 */
	const handleCreateNewSolution = () => {
		setIsCreatingNewSolution(true);
		setFormData((prev) => ({
			...prev,
			selectedSolutionId: "",
			selectedSolutionVariantId: "",
		}));
		setAvailableSolutionVariants([]);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	};

	const handleCreateNewVariant = () => {
		setIsCreatingNewVariant(true);
		setFormData((prev) => ({ 
			...prev, 
			selectedSolutionVariantId: "",
			parameters: [], 
			calculations: [] 
		}));
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	};

	const handleNoVariantSelect = () => {
		setFormData((prev) => ({ ...prev, selectedSolutionVariantId: "" }));
		setIsCreatingNewVariant(false);
		setFormData((prev) => ({
			...prev,
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		}));
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	};

	/**
	 * Handle form data changes
	 */
	const handleFormDataChange = (updates: Partial<CreateSolutionData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const handleParametersChange = (parameters: Parameter[]) => {
		setFormData((prev) => ({ ...prev, parameters }));
	};

	const handleCalculationsChange = (calculations: Calculation[]) => {
		setFormData((prev) => ({ ...prev, calculations }));
	};

	const handleAddSolutionVariant = (newVariant: any) => {
		setAvailableSolutionVariants((prev) => [...prev, newVariant]);
	};

	/**
	 * Handle step navigation
	 */
	const handleNext = () => {
		if (
			(currentStep === 1 || currentStep === 2) &&
			formData.selectedSolutionVariantId &&
			!isExistingSolutionLoaded &&
			!formData.selectedSolutionVariantId.startsWith("new-variant-")
		) {
			loadExistingSolutionData(formData.selectedSolutionVariantId);
		}
		setCurrentStep((prev) => prev + 1);
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => prev - 1);
	};

	/**
	 * Handle solution submission
	 */
	const handleSaveAsDraft = async () => {
		try {
			setIsSubmitting(true);

			if (isExistingSolutionLoaded && existingSolutionId) {
				const updateResult = await updateExistingClientSolution(
					existingSolutionId,
					{
						parameters: formData.parameters,
						calculations: formData.calculations,
						status: "draft",
						updated_at: new Date(),
					}
				);

				if (updateResult.success) {
					setDraftStatus("success");
					setDraftMessage("Solution updated and saved as draft successfully!");
					setDraftSolutionName("Updated Solution");
					setShowDraftDialog(true);
				} else {
					throw new Error(updateResult.error || "Failed to update solution");
				}
				return;
			}

			let solutionId = formData.selectedSolutionId;
			if (isCreatingNewSolution) {
				const newSolution = await createNewSolution({
					solution_name: formData.solutionName,
					solution_description: formData.solutionDescription,
					solution_icon: formData.solutionIcon,
					applicable_industries: formData.selectedIndustry,
					applicable_technologies: formData.selectedTechnology,
					solution_variants: [],
					parameters: formData.parameters,
					calculations: formData.calculations,
					status: "draft",
					created_by: user?._id || "",
					client_id: clientData.id,
				});
				if (newSolution.success) {
					solutionId = newSolution.solution_id;
				}
			}

			let variantId = formData.selectedSolutionVariantId;
			if (isCreatingNewVariant) {
				const newVariant = await createNewSolutionVariant({
					name: formData.newVariantName,
					description: formData.newVariantDescription,
					icon: formData.newVariantIcon,
					solution_id: solutionId,
					created_by: user?._id || "",
				});
				if (newVariant.success) {
					variantId = newVariant.solution_variant_id;
				}
			}

			if (variantId && !variantId.startsWith("new-variant-")) {
				setIsExistingSolutionLoaded(false);
				setExistingSolutionId(null);
				loadExistingSolutionData(variantId);
			}

			let finalSolutionName: string;
			let finalSolutionDescription: string;
			let finalSolutionIcon: string;

			if (isCreatingNewSolution) {
				finalSolutionName = formData.solutionName;
				finalSolutionDescription = formData.solutionDescription;
				finalSolutionIcon = formData.solutionIcon;
			} else if (isCreatingNewVariant) {
				const selectedSolution = getSelectedSolutionType();
				finalSolutionName = formData.newVariantName;
				finalSolutionDescription = formData.newVariantDescription;
				finalSolutionIcon = formData.newVariantIcon;
			} else {
				const selectedSolution = getSelectedSolutionType();
				const selectedVariant = getSelectedSolutionVariant();

				if (selectedVariant) {
					finalSolutionName = selectedVariant.name;
					finalSolutionDescription = selectedVariant.description || "";
					finalSolutionIcon = selectedVariant.icon || "";
				} else {
					finalSolutionName = selectedSolution?.name || "Unknown Solution";
					finalSolutionDescription = selectedSolution?.description || "";
					finalSolutionIcon = selectedSolution?.icon || "";
				}
			}

			await createNewClientSolution({
				client_id: clientData.id,
				solution_name: finalSolutionName,
				solution_description: finalSolutionDescription,
				solution_icon: finalSolutionIcon,
				industry_id: formData.selectedIndustry,
				technology_id: formData.selectedTechnology,
				selected_solution_id: solutionId,
				selected_solution_variant_id: variantId || undefined,
				is_creating_new_solution: isCreatingNewSolution,
				is_creating_new_variant: isCreatingNewVariant,
				new_variant_name: formData.newVariantName,
				new_variant_description: formData.newVariantDescription,
				new_variant_icon: formData.newVariantIcon,
				parameters: formData.parameters,
				calculations: formData.calculations,
				status: "draft",
				created_by: user?._id || "",
			});

			setDraftStatus("success");
			setDraftMessage("Solution saved as draft successfully!");
			setDraftSolutionName(finalSolutionName);
			setShowDraftDialog(true);
		} catch (error) {
			console.error("Error saving draft:", error);
			setDraftStatus("error");
			setDraftMessage("Failed to save solution as draft. Please try again.");
			setShowDraftDialog(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmitForReview = async () => {
		try {
			setIsSubmitting(true);

			if (isExistingSolutionLoaded && existingSolutionId) {
				const updateResult = await updateExistingClientSolution(
					existingSolutionId,
					{
						parameters: formData.parameters,
						calculations: formData.calculations,
						status: "pending",
						updated_at: new Date(),
					}
				);

				if (updateResult.success) {
					setSubmissionStatus("success");
					setSubmissionMessage(
						"Solution updated and submitted for review successfully!"
					);
					setSubmittedSolutionName("Updated Solution");
					setShowSubmissionDialog(true);
				} else {
					throw new Error(updateResult.error || "Failed to update solution");
				}
				return;
			}

			let solutionId = formData.selectedSolutionId;
			if (isCreatingNewSolution) {
				const newSolution = await createNewSolution({
					solution_name: formData.solutionName,
					solution_description: formData.solutionDescription,
					solution_icon: formData.solutionIcon,
					applicable_industries: formData.selectedIndustry,
					applicable_technologies: formData.selectedTechnology,
					solution_variants: [],
					parameters: formData.parameters,
					calculations: formData.calculations,
					status: "pending",
					created_by: user?._id || "",
					client_id: clientData.id,
				});
				if (newSolution.success) {
					solutionId = newSolution.solution_id;
				}
			}

			let variantId = formData.selectedSolutionVariantId;
			if (isCreatingNewVariant) {
				const newVariant = await createNewSolutionVariant({
					name: formData.newVariantName,
					description: formData.newVariantDescription,
					icon: formData.newVariantIcon,
					solution_id: solutionId,
					created_by: user?._id || "",
				});
				if (newVariant.success) {
					variantId = newVariant.solution_variant_id;
				}
			}

			if (variantId && !variantId.startsWith("new-variant-")) {
				setIsExistingSolutionLoaded(false);
				setExistingSolutionId(null);
				loadExistingSolutionData(variantId);
			}

			let finalSolutionName: string;
			let finalSolutionDescription: string;
			let finalSolutionIcon: string;

			if (isCreatingNewSolution) {
				finalSolutionName = formData.solutionName;
				finalSolutionDescription = formData.solutionDescription;
				finalSolutionIcon = formData.solutionIcon;
			} else if (isCreatingNewVariant) {
				const selectedSolution = getSelectedSolutionType();
				finalSolutionName = formData.newVariantName;
				finalSolutionDescription = formData.newVariantDescription;
				finalSolutionIcon = formData.newVariantIcon;
			} else {
				const selectedSolution = getSelectedSolutionType();
				const selectedVariant = getSelectedSolutionVariant();

				if (selectedVariant) {
					finalSolutionName = selectedVariant.name;
					finalSolutionDescription = selectedVariant.description || "";
					finalSolutionIcon = selectedVariant.icon || "";
				} else {
					finalSolutionName = selectedSolution?.name || "Unknown Solution";
					finalSolutionDescription = selectedSolution?.description || "";
					finalSolutionIcon = selectedSolution?.icon || "";
				}
			}

			await createNewClientSolution({
				client_id: clientData.id,
				solution_name: finalSolutionName,
				solution_description: finalSolutionDescription,
				solution_icon: finalSolutionIcon,
				industry_id: formData.selectedIndustry,
				technology_id: formData.selectedTechnology,
				selected_solution_id: solutionId,
				selected_solution_variant_id: variantId || undefined,
				is_creating_new_solution: isCreatingNewSolution,
				is_creating_new_variant: isCreatingNewVariant,
				new_variant_name: formData.newVariantName,
				new_variant_description: formData.newVariantDescription,
				new_variant_icon: formData.newVariantIcon,
				parameters: formData.parameters,
				calculations: formData.calculations,
				status: "pending",
				created_by: user?._id || "",
			});

			setSubmissionStatus("success");
			setSubmissionMessage("Solution submitted for review successfully!");
			setSubmittedSolutionName(finalSolutionName);
			setShowSubmissionDialog(true);
		} catch (error) {
			console.error("Error submitting solution:", error);
			setSubmissionStatus("error");
			setSubmissionMessage(
				"Failed to submit solution for review. Please try again."
			);
			setShowSubmissionDialog(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	/**
	 * Helper functions for getting selected data
	 */
	const getSelectedIndustryName = () => {
		const industry = availableIndustries.find(
			(i) => i.id === formData.selectedIndustry
		);
		return industry?.name || "Not selected";
	};

	const getSelectedTechnologyName = () => {
		const technology = availableTechnologies.find(
			(t) => t.id === formData.selectedTechnology
		);
		return technology?.name || "Not selected";
	};

	const getSelectedSolutionType = () => {
		return availableSolutionTypes.find(
			(s) => s.id === formData.selectedSolutionId
		);
	};

	const getSelectedSolutionVariant = () => {
		return availableSolutionVariants.find(
			(v) => v.id === formData.selectedSolutionVariantId
		);
	};

	/**
	 * Step configuration helpers
	 */
	const getStepTitle = () => {
		switch (currentStep) {
			case 1:
				return "Select Industry, Technology & Solution";
			case 2:
				return "Configure Parameters";
			case 3:
				return "Configure Calculations";
			case 4:
				return "Configure Value";
			case 5:
				return "Review and Submit";
			default:
				return "Create Solution";
		}
	};

	const getStepDescription = () => {
		switch (currentStep) {
			case 1:
				return "Choose your industry, technology, and solution type to get started";
			case 2:
				return "Configure the parameters that will be used in your solution calculations";
			case 3:
				return "Set up calculations and formulas for your solution";
			case 4:
				return "Configure the value that will be used in your solution calculations";
			case 5:
				return "Review your solution configuration and submit for approval";
			default:
				return "Follow the steps to create your solution";
		}
	};

	const isNextDisabled = () => {
		switch (currentStep) {
			case 1:
				const hasIndustry = !!formData.selectedIndustry;
				const hasTechnology = !!formData.selectedTechnology;
				const hasSolution =
					formData.selectedSolutionId || isCreatingNewSolution;
				const hasSolutionVariant =
					!!formData.selectedSolutionVariantId || isCreatingNewVariant;

				if (isCreatingNewSolution) {
					return (
						!hasIndustry ||
						!hasTechnology ||
						!formData.solutionName ||
						!formData.solutionDescription ||
						!hasSolutionVariant
					);
				}

				return (
					!hasIndustry || !hasTechnology || !hasSolution || !hasSolutionVariant
				);
			case 2:
				if (isLoadingParameters) {
					return false;
				}
				return formData.parameters.length === 0;
			case 3:
				if (isLoadingCalculations) {
					return false;
				}
				return formData.calculations.length === 0;
			default:
				return false;
		}
	};

	/**
	 * Load initial data when user is available
	 */
	useEffect(() => {
		if (user) {
			loadInitialData();
		}
	}, [user, loadInitialData]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col  py-2 h-full">

			{/* Step Content */}
			<Card className="flex flex-col h-full mx-2 max-w-full py-0 pt-4">
				<CardHeader className="">
					<CardTitle className="text-lg">{getStepTitle()}</CardTitle>
					<CardDescription className="text-sm">
						{getStepDescription()}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 px-2 h-full">
					<StepContent
						currentStep={currentStep}
						formData={formData}
						clientData={clientData}
						availableIndustries={availableIndustries}
						availableTechnologies={availableTechnologies}
						availableSolutionTypes={availableSolutionTypes}
						availableSolutionVariants={availableSolutionVariants}
						isLoadingIndustries={isLoadingIndustries}
						isLoadingTechnologies={isLoadingTechnologies}
						isLoadingSolutionTypes={isLoadingSolutionTypes}
						isLoadingSolutionVariants={isLoadingSolutionVariants}
						isLoadingParameters={isLoadingParameters}
						isLoadingCalculations={isLoadingCalculations}
						isCreatingNewSolution={isCreatingNewSolution}
						isCreatingNewVariant={isCreatingNewVariant}
						isSubmitting={isSubmitting}
						isExistingSolutionLoaded={isExistingSolutionLoaded}
						customParameterCategories={customParameterCategories}
						customCalculationCategories={customCalculationCategories}
						selectedIndustry={formData.selectedIndustry}
						selectedTechnology={formData.selectedTechnology}
						selectedSolutionId={formData.selectedSolutionId}
						selectedSolutionVariantId={formData.selectedSolutionVariantId}
						onIndustrySelect={handleIndustrySelect}
						onTechnologySelect={handleTechnologySelect}
						onSolutionTypeSelect={handleSolutionTypeSelect}
						onSolutionVariantSelect={handleSolutionVariantSelect}
						onFormDataChange={handleFormDataChange}
						onCreateNewSolution={handleCreateNewSolution}
						onCreateNewVariant={handleCreateNewVariant}
						onNoVariantSelect={handleNoVariantSelect}
						onAddSolutionVariant={handleAddSolutionVariant}
						onParametersChange={handleParametersChange}
						onCalculationsChange={handleCalculationsChange}
						onSaveAsDraft={handleSaveAsDraft}
						onSubmitForReview={handleSubmitForReview}
						setCustomParameterCategories={setCustomParameterCategories}
						setCustomCalculationCategories={setCustomCalculationCategories}
						getSelectedIndustryName={getSelectedIndustryName}
						getSelectedTechnologyName={getSelectedTechnologyName}
						getSelectedSolutionType={getSelectedSolutionType}
						getSelectedSolutionVariant={getSelectedSolutionVariant}
					/>
				</CardContent>
				{/* Navigation Buttons */}
				<CardFooter className="p-4 border-t bg-gray-50">
					<div className="w-full flex flex-row justify-between flex-shrink-0 ">
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
								disabled={isNextDisabled()}
								className="flex items-center gap-2"
								size="sm"
							>
								Next
								<ArrowRight className="h-4 w-4" />
							</Button>
						) : null}
					</div>
				</CardFooter>
			</Card>

			{/* Submission Dialog */}
			<SubmissionDialog
				isOpen={showSubmissionDialog}
				onClose={() => setShowSubmissionDialog(false)}
				status={submissionStatus}
				message={submissionMessage}
				solutionName={submittedSolutionName}
			/>

			{/* Draft Dialog */}
			<DraftDialog
				isOpen={showDraftDialog}
				onClose={() => setShowDraftDialog(false)}
				status={draftStatus}
				message={draftMessage}
				solutionName={draftSolutionName}
			/>
		</div>
	);
}

/**
 * StepContent component - Renders the appropriate content based on current step
 */
function StepContent({
	currentStep,
	formData,
	clientData,
	availableIndustries,
	availableTechnologies,
	availableSolutionTypes,
	availableSolutionVariants,
	isLoadingIndustries,
	isLoadingTechnologies,
	isLoadingSolutionTypes,
	isLoadingSolutionVariants,
	isLoadingParameters,
	isLoadingCalculations,
	isCreatingNewSolution,
	isCreatingNewVariant,
	isSubmitting,
	isExistingSolutionLoaded,
	customParameterCategories,
	customCalculationCategories,
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
	onParametersChange,
	onCalculationsChange,
	onSaveAsDraft,
	onSubmitForReview,
	setCustomParameterCategories,
	setCustomCalculationCategories,
	getSelectedIndustryName,
	getSelectedTechnologyName,
	getSelectedSolutionType,
	getSelectedSolutionVariant,
}: StepContentProps) {
	return (
		<div>
			{/* Step 1: Industry, Technology & Solution Selection */}
			{currentStep === 1 && (
				<CreateSolutionFilter
					clientData={clientData}
					availableIndustries={availableIndustries}
					availableTechnologies={availableTechnologies}
					availableSolutionTypes={availableSolutionTypes}
					availableSolutionVariants={availableSolutionVariants}
					isLoadingIndustries={isLoadingIndustries}
					isLoadingTechnologies={isLoadingTechnologies}
					isLoadingSolutionTypes={isLoadingSolutionTypes}
					isLoadingSolutionVariants={isLoadingSolutionVariants}
					selectedIndustry={formData.selectedIndustry}
					selectedTechnology={formData.selectedTechnology}
					selectedSolutionId={formData.selectedSolutionId}
					selectedSolutionVariantId={formData.selectedSolutionVariantId}
					onIndustrySelect={onIndustrySelect}
					onTechnologySelect={onTechnologySelect}
					onSolutionTypeSelect={onSolutionTypeSelect}
					onSolutionVariantSelect={onSolutionVariantSelect}
					onFormDataChange={onFormDataChange}
					onCreateNewSolution={onCreateNewSolution}
					onCreateNewVariant={onCreateNewVariant}
					onNoVariantSelect={onNoVariantSelect}
					onAddSolutionVariant={onAddSolutionVariant}
					formData={{
						solutionName: formData.solutionName,
						solutionDescription: formData.solutionDescription,
						solutionIcon: formData.solutionIcon,
						newVariantName: formData.newVariantName,
						newVariantDescription: formData.newVariantDescription,
						newVariantIcon: formData.newVariantIcon,
					}}
					isCreatingNewSolution={isCreatingNewSolution}
					isCreatingNewVariant={isCreatingNewVariant}
				/>
			)}

			{/* Step 2: Parameters Configuration */}
			{currentStep === 2 && (
				<ParameterMain
					parameters={formData.parameters}
					onParametersChange={onParametersChange}
					customCategories={customParameterCategories}
					setCustomCategories={setCustomParameterCategories}
					selectedIndustry={formData.selectedIndustry}
					selectedTechnology={formData.selectedTechnology}
					selectedSolutionId={formData.selectedSolutionId}
					selectedSolutionVariantId={formData.selectedSolutionVariantId}
					availableIndustries={availableIndustries}
					availableTechnologies={availableTechnologies}
					availableSolutionTypes={availableSolutionTypes}
					isLoadingParameters={isLoadingParameters}
				/>
			)}

			{/* Step 3: Calculations Configuration */}
			{currentStep === 3 && (
				<CalculationMain
					calculations={formData.calculations}
					onCalculationsChange={onCalculationsChange}
					parameters={formData.parameters}
					onParametersChange={onParametersChange}
					selectedIndustry={formData.selectedIndustry}
					selectedTechnology={formData.selectedTechnology}
					selectedSolutionId={formData.selectedSolutionId}
					selectedSolutionVariantId={formData.selectedSolutionVariantId}
					availableIndustries={availableIndustries}
					availableTechnologies={availableTechnologies}
					availableSolutionTypes={availableSolutionTypes}
					customCategories={customCalculationCategories}
					setCustomCategories={setCustomCalculationCategories}
					isLoadingCalculations={isLoadingCalculations}
				/>
			)}

			{/* Step 4: Value Configuration */}
			{currentStep === 4 && (
				<ValueMain
					formData={formData}
					
				/>
			)}

			{/* Step 5: Review and Submit */}
			{currentStep === 5 && (
				<CreateSolutionSubmit
					formData={{
						solutionName: formData.solutionName,
						solutionDescription: formData.solutionDescription,
						solutionVariant: formData.selectedSolutionVariantId,
						customSolutionVariant: formData.newVariantName,
						customSolutionVariantDescription: formData.newVariantDescription,
						parameters: formData.parameters as any,
						calculations: formData.calculations,
					}}
					showCustomSolutionType={isCreatingNewSolution}
					showCustomSolutionVariant={isCreatingNewVariant}
					isSubmitting={isSubmitting}
					onSaveAsDraft={onSaveAsDraft}
					onSubmitForReview={onSubmitForReview}
					getSelectedIndustryName={getSelectedIndustryName}
					getSelectedTechnologyName={getSelectedTechnologyName}
					getSelectedSolutionType={getSelectedSolutionType}
					getSelectedSolutionVariant={getSelectedSolutionVariant}
					isExistingSolutionLoaded={isExistingSolutionLoaded}
				/>
			)}
		</div>
	);
}
