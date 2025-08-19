"use client";

import { useCallback } from "react";
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
import { toast } from "sonner";
import { SubmissionDialog } from "../components/submission-dialog";
import { DraftDialog } from "../components/draft-dialog";
import Loading from "@/components/loading-main";
import { Calculation } from "@/types/types";
import { Parameter } from "@/types/types";
import {
	CreateSolutionData,
	CreateSolutionMainProps,
	StepContentProps,
} from "../types/types";
import {
	handleIndustrySelect,
	handleTechnologySelect,
	handleSolutionTypeSelect,
	handleSolutionVariantSelect,
	handleCreateNewSolution,
	handleCreateNewVariant,
	handleNoVariantSelect,
	handleFormDataChange,
	handleParametersChange,
	handleCalculationsChange,
	getSelectedIndustryName,
	getSelectedTechnologyName,
	getSelectedSolutionType,
	getSelectedSolutionVariant,
	clearAvailableOptions,
	clearSolutionVariantOptions,
	handleAddNewlyCreatedSolution,
	handleAddNewlyCreatedVariant,
	handleAddSolutionVariant,
} from "./services";
import {
	handleSaveAsDraft as handleSaveAsDraftSubmission,
	handleSubmitForReview as handleSubmitForReviewSubmission,
} from "./services/submission";
import {
	getStepTitle,
	getStepDescription,
	isNextDisabled,
	handleNext as handleNextNavigation,
	handlePrevious as handlePreviousNavigation,
} from "./services/navigation";
import StepContent from "./components/step-content";
import ActionButtons from "./components/action-buttons";
import {
	loadClientSolutionsData,
	loadClientsSolutionVariantsData,
	loadInitialClientData,
	loadSolutionParametersAndCalculationsData,
} from "./services/data-loading";

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

	// Newly created items state - persisted at this level
	const [newlyCreatedSolutions, setNewlyCreatedSolutions] = useState<any[]>([]);
	const [newlyCreatedVariants, setNewlyCreatedVariants] = useState<any[]>([]);

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

	const [selectedSolutionVariantData, setSelectedSolutionVariantData] = useState<any>(null);

	// Category states for parameters and calculations
	const [customParameterCategories, setCustomParameterCategories] = useState<
		Array<{ name: string; color: string }>
	>([]);
	const [customCalculationCategories, setCustomCalculationCategories] =
		useState<Array<{ name: string; color: string }>>([]);

	const [formData, setFormData] = useState<CreateSolutionData>({
		// ids
		industry: "",
		technology: "",
		solution: "",
		solution_variant: "",

		// Creation fields (only populated when creating new)
		solution_name: "",
		solution_description: "",
		solution_icon: "",
		solution_variant_name: "",
		solution_variant_description: "",
		solution_variant_icon: "",
		solution_variant_product_badge: false,

		// Data arrays
		parameters: [],
		calculations: [],
		categories: [],
	});

	useEffect(() => {
		if (
			formData.solution &&
			formData.solution_variant &&
			formData.solution === formData.solution_variant
		) {
			console.error(
				"ERROR: solution field is same as solution_variant field - this indicates corruption!"
			);
		}

		if (
			formData.solution &&
			formData.solution_variant &&
			formData.solution !== formData.solution_variant
		) {
			const isSolutionInVariants = availableSolutionVariants.some(
				(v) => v.solution_variant === formData.solution
			);
			if (isSolutionInVariants) {
				console.error(
					"ERROR: solution field appears to contain a variant ID instead of a solution ID!"
				);
				console.error("formData.solution:", formData.solution);
				console.error("This should contain a solution ID, not a variant ID");
			}
		}

		if (
			formData.solution &&
			formData.solution !== "new" &&
			formData.solution.length !== 24
		) {
			console.warn(
				"Warning: Solution field contains a value that doesn't look like a valid MongoDB ObjectId"
			);
			console.warn("formData.solution:", formData.solution);
			console.warn(
				"Expected length: 24 characters, Actual length:",
				formData.solution.length
			);
		}
	}, [
		formData,
		isCreatingNewSolution,
		isCreatingNewVariant,
		availableSolutionVariants,
	]);

	/**
	 * Load initial client data and populate industries/technologies
	 */
	const loadInitialData = useCallback(async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const result = await loadInitialClientData(user._id);
			if (result) {
				setClientData(result.clientData);
				setAvailableIndustries(result.industries);
				setAvailableTechnologies(result.technologies);
			}
		} catch (error) {
			console.error("Error loading data:", error);
			toast.error("Failed to load initial data");
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	/**
	 * Fetch solution based on selected industry and technology
	 */
	const loadClientSolutions = async (
		industryId: string,
		technologyId: string
	) => {
		try {
			setIsLoadingSolutionTypes(true);
			const result = await loadClientSolutionsData(
				industryId,
				technologyId,
				clientData?.id || ""
			);
			setAvailableSolutionTypes(result);
		} catch (error) {
			console.error("Error fetching solution types:", error);
			toast.error("Failed to load solution types");
		} finally {
			setIsLoadingSolutionTypes(false);
		}
	};

	/**
	 * Fetch solution variants for the selected solution
	 */
	const loadClientsSolutionVariants = async (solutionId: string) => {
		try {
			setIsLoadingSolutionVariants(true);
			const result = await loadClientsSolutionVariantsData(
				solutionId,
				clientData?.id || ""
			);
			setAvailableSolutionVariants(result);
		} catch (error) {
			console.error("Error fetching solution variants:", error);
			toast.error("Failed to load solution variants");
		} finally {
			setIsLoadingSolutionVariants(false);
		}
	};

	/**
	 * Handle industry selection change
	 */
	const handleIndustrySelectLocal = (industryId: string) => {
		setFormData((prev) => ({ ...prev, industry: industryId }));

		clearAvailableOptions(
			setAvailableSolutionTypes,
			setAvailableSolutionVariants,
			setIsExistingSolutionLoaded,
			setExistingSolutionId,
			setNewlyCreatedSolutions,
			setNewlyCreatedVariants
		);
		
		// Clear selected variant data when industry changes
		setSelectedSolutionVariantData(null);
	};

	/**
	 * Handle technology selection change
	 */
	const handleTechnologySelectLocal = (technologyId: string) => {
		setFormData((prev) => ({ ...prev, technology: technologyId }));

		clearSolutionVariantOptions(
			setAvailableSolutionVariants,
			setIsExistingSolutionLoaded,
			setExistingSolutionId,
			setNewlyCreatedVariants
		);
		
		// Clear selected variant data when technology changes
		setSelectedSolutionVariantData(null);

		if (formData.industry && technologyId && clientData?.id) {
			loadClientSolutions(formData.industry, technologyId);
		}
	};

	/**
	 * Handle solution type selection change
	 */
	const handleSolutionSelectLocal = (solutionId: string) => {
		// Validate the solutionId parameter
		if (solutionId && solutionId !== "new" && solutionId.length !== 24) {
			console.warn(
				"Warning: Selected solutionId doesn't look like a valid MongoDB ObjectId"
			);
			console.warn("solutionId:", solutionId);
			console.warn(
				"Expected length: 24 characters, Actual length:",
				solutionId.length
			);
		}

		// Find the selected solution data
		const selectedSolution = availableSolutionTypes.find(
			(solution) => solution.id === solutionId
		);

		// Validate the selected solution data
		if (selectedSolution) {
			// Check if the selected solution has a solution field (indicating it might be a variant)
			if (selectedSolution.solution) {
				console.warn(
					"Warning: Selected solution has a solution field, indicating it might be a variant"
				);
				console.warn("This could cause issues with solution selection");
			}
		}

		// Store the current variant ID to verify it doesn't get corrupted
		const currentVariantId = formData.solution_variant;

		// Clear selected variant data when solution type changes
		setSelectedSolutionVariantData(null);
		
		handleSolutionTypeSelect(
			solutionId,
			selectedSolution, // Pass the solution data
			formData,
			setFormData,
			setIsCreatingNewSolution,
			setIsCreatingNewVariant,
			setIsExistingSolutionLoaded,
			setExistingSolutionId,
			loadClientsSolutionVariants
		);

		// Verify the variant field wasn't corrupted
		setTimeout(() => {
			if (formData.solution_variant !== currentVariantId) {
				console.error(
					"ERROR: formData.solution_variant was modified during solution selection!"
				);
				console.error("Original variant ID:", currentVariantId);
				console.error("Current variant ID:", formData.solution_variant);
				console.error("This should not happen!");
			}
		}, 0);
	};

	/**
	 * Handle solution variant selection change
	 */
	const handleSolutionVariantSelectLocal = (variantId: string) => {
		// Store the current solution ID to verify it doesn't get corrupted
		const currentSolutionId = formData.solution;

		// Find the selected variant data from available variants
		let selectedVariant = availableSolutionVariants.find(
			(variant) => variant.solution_variant === variantId
		);
		
		// If not found in available variants, check newly created variants
		if (!selectedVariant) {
			selectedVariant = newlyCreatedVariants.find(
				(variant) => variant.id === variantId
			);
		}

		// Set the selected variant data BEFORE calling the service function
		if (selectedVariant) {
		
			// Simply set the variant data - the service function will handle the rest
			setSelectedSolutionVariantData(selectedVariant);
		} else {
			console.warn("No variant found for ID:", variantId);
			setSelectedSolutionVariantData(null);
		}

		// Restore the service function call to handle variant selection
		handleSolutionVariantSelect(
			variantId,
			selectedVariant, // Pass the variant data
			setFormData,
			setIsCreatingNewVariant,
			setIsExistingSolutionLoaded,
			setExistingSolutionId,
		);

		// Debug: Log the form data after variant selection
		setTimeout(() => {
			
		}, 100);

		// Verify the solution field wasn't corrupted
		setTimeout(() => {
			if (formData.solution !== currentSolutionId) {
				console.error(
					"ERROR: formData.solution was modified during variant selection!"
				);
				console.error("Original solution ID:", currentSolutionId);
				console.error("Current solution ID:", formData.solution);
				console.error("This should not happen!");
			}
		}, 0);
	};

	/**
	 * Handle creation mode changes
	 */
	const handleCreateNewSolutionLocal = () => {
		// Set creation mode flags directly instead of calling the service function
		setIsCreatingNewSolution(true);
		setAvailableSolutionVariants([]);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
		
		// Create a mock solution data structure for new solutions
		const mockNewSolutionData = {
			id: "new",
			solution: "new",
			solution_name: formData.solution_name || "",
			solution_description: formData.solution_description || "",
			solution_icon: formData.solution_icon || "",
			// Empty arrays for new solutions - user will configure these
			parameters: [],
			calculations: [],
			categories: [],
			// Copy industry and technology data
			industry: formData.industry,
			technology: formData.technology,
		};
		
		// Set the mock data instead of null
		setSelectedSolutionVariantData(mockNewSolutionData);

		// Set formData.solution to "new" to indicate new solution creation
		setFormData((prev) => ({
			...prev,
			solution: "new",
		}));
	};

	const handleCreateNewVariantLocal = () => {
		const originalSolutionId = formData.solution;

		setIsCreatingNewVariant(true);
		setAvailableSolutionVariants([]);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
		
		// Create a mock variant data structure for new variants
		// This allows the parameters and calculations steps to render
		const mockNewVariantData = {
			id: "new",
			solution_variant: "new",
			solution_variant_name: formData.solution_variant_name || "",
			solution_variant_description: formData.solution_variant_description || "",
			solution_variant_icon: formData.solution_variant_icon || "",
			solution_variant_product_badge: formData.solution_variant_product_badge || false,
			// Empty arrays for new variants - user will configure these
			parameters: [],
			calculations: [],
			categories: [],
			// Copy solution-level data
			solution: formData.solution,
			solution_name: formData.solution_name,
			solution_description: formData.solution_description,
			solution_icon: formData.solution_icon,
			industry: formData.industry,
			technology: formData.technology,
		};
		
		// Set the mock data instead of null
		setSelectedSolutionVariantData(mockNewVariantData);

		// Set formData.solution_variant to "new" to indicate new variant creation
		setFormData((prev) => ({
			...prev,
			solution_variant: "new",
		}));

		// Verify the solution field wasn't modified
		setTimeout(() => {
			if (formData.solution !== originalSolutionId) {
				console.error(
					"ERROR: formData.solution was modified during variant creation!"
				);
				console.error("Original solution ID:", originalSolutionId);
				console.error("Current solution ID:", formData.solution);
				console.error("This should not happen!");
			}
		}, 0);
	};

	const handleNoVariantSelectLocal = () => {
		// Clear selected variant data when no variant is selected
		setSelectedSolutionVariantData(null);
		
		handleNoVariantSelect(
			setFormData,
			setIsCreatingNewVariant,
			setIsExistingSolutionLoaded,
			setExistingSolutionId
		);
	};

	/**
	 * Handle form data changes
	 */
	const handleFormDataChangeLocal = (updates: Partial<CreateSolutionData>) => {
		if (updates.solution !== undefined) {
			if (
				updates.solution &&
				formData.solution_variant &&
				updates.solution === formData.solution_variant
			) {
				console.error(
					"ERROR: Attempting to set solution field to the same value as solution_variant field!"
				);
				console.error("This will cause corruption!");
			}

			const isNewValueInVariants = availableSolutionVariants.some(
				(v) => v.solution_variant === updates.solution
			);
			if (isNewValueInVariants) {
				console.error(
					"ERROR: Attempting to set solution field to what appears to be a variant ID!"
				);
				console.error("New solution value:", updates.solution);
				console.error("This should be a solution ID, not a variant ID");
			}
		}

		handleFormDataChange(updates, setFormData);
	};

	const handleParametersChangeLocal = (parameters: Parameter[]) => {
		handleParametersChange(parameters, setFormData);
	};

	const handleCalculationsChangeLocal = (calculations: Calculation[]) => {
		handleCalculationsChange(calculations, setFormData);
	};

	const handleAddSolutionVariantLocal = (newVariant: any) => {
		handleAddSolutionVariant(setAvailableSolutionVariants, newVariant);
	};

	/**
	 * Handle adding newly created solutions and variants to persistent lists
	 */
	const handleAddNewlyCreatedSolutionLocal = (newSolution: any) => {
		if (newSolution.id) {
			if (newSolution.id !== formData.solution) {
				console.error(
					"ERROR: New solution id doesn't match current formData.solution!"
				);
				console.error("newSolution.id:", newSolution.id);
				console.error("formData.solution:", formData.solution);
			}
		}

		handleAddNewlyCreatedSolution(setNewlyCreatedSolutions, newSolution);
	};

	const handleAddNewlyCreatedVariantLocal = (newVariant: any) => {
		if (newVariant.solution_id) {
			if (newVariant.solution_id !== formData.solution) {
				console.error(
					"ERROR: New variant solution_id doesn't match current formData.solution!"
				);
				console.error("newVariant.solution_id:", newVariant.solution_id);
				console.error("formData.solution:", formData.solution);
			}
		}

		handleAddNewlyCreatedVariant(setNewlyCreatedVariants, newVariant);
	};

	/**
	 * Handle step navigation
	 */
	const handleNext = () => {
		handleNextNavigation(
			currentStep,
			setCurrentStep,
			formData,
			isExistingSolutionLoaded,
		);
	};

	const handlePrevious = () => {
		handlePreviousNavigation(setCurrentStep);
	};

	/**
	 * Handle solution submission
	 */
	const handleSaveAsDraft = async () => {
		try {
			setIsSubmitting(true);

			const result = await handleSaveAsDraftSubmission(
				formData,
				clientData,
				user?._id || "",
				isExistingSolutionLoaded,
				existingSolutionId,
				isCreatingNewSolution,
				isCreatingNewVariant,
				() => {
					const selected = getSelectedSolutionType(
						availableSolutionTypes,
						formData.solution
					);
					return selected;
				},
				() =>
					getSelectedSolutionVariant(
						availableSolutionVariants,
						formData.solution_variant
					)
			);

			if (result.success) {
				setDraftStatus(result.status);
				setDraftMessage(result.message);
				setDraftSolutionName(result.solutionName);
				setShowDraftDialog(true);
			} else {
				setDraftStatus(result.status);
				setDraftMessage(result.message);
				setDraftSolutionName("");
				setShowDraftDialog(true);
			}
		} catch (error) {
			console.error("Error saving draft:", error);
			setDraftStatus("error");
			setDraftMessage("Failed to save solution as draft. Please try again.");
			setDraftSolutionName("");
			setShowDraftDialog(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmitForReview = async () => {
		try {
			setIsSubmitting(true);

			const result = await handleSubmitForReviewSubmission(
				formData,
				clientData,
				user?._id || "",
				isExistingSolutionLoaded,
				existingSolutionId,
				isCreatingNewSolution,
				isCreatingNewVariant,
				() => {
					const selected = getSelectedSolutionType(
						availableSolutionTypes,
						formData.solution
					);
					return selected;
				},
				() =>
					getSelectedSolutionVariant(
						availableSolutionVariants,
						formData.solution_variant
					)
			);

			if (result.success) {
				setSubmissionStatus(result.status);
				setSubmissionMessage(result.message);
				setSubmittedSolutionName(result.solutionName);
				setShowSubmissionDialog(true);
			} else {
				setSubmissionStatus(result.status);
				setSubmissionMessage(result.message);
				setSubmittedSolutionName("");
				setShowSubmissionDialog(true);
			}
		} catch (error) {
			console.error("Error submitting solution:", error);
			setSubmissionStatus("error");
			setSubmissionMessage(
				"Failed to submit solution for review. Please try again."
			);
			setSubmittedSolutionName("");
			setShowSubmissionDialog(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	/**
	 * Step configuration helpers
	 */
	const getStepTitleLocal = () => {
		return getStepTitle(currentStep);
	};

	const getStepDescriptionLocal = () => {
		return getStepDescription(currentStep);
	};

	const isNextDisabledLocal = () => {
		return isNextDisabled(
			currentStep,
			formData,
			isCreatingNewSolution,
			isCreatingNewVariant,
			isLoadingParameters,
			isLoadingCalculations
		);
	};

	const handleSolutionTypeSelectLocal = (
		solutionTypeId: string,
		solutionName: string,
		solutionDescription: string,
		solutionIcon: string
	) => {
		setFormData((prev) => ({
			...prev,
			solution: solutionTypeId,
			solution_name: solutionName,
			solution_description: solutionDescription,
			solution_icon: solutionIcon,
		}));
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
		<div className="flex flex-col py-2 h-full">
			{/* Step Content */}
			<Card className="flex flex-col h-full mx-2 max-w-full py-0 pt-4">
				<CardHeader className="">
					<CardTitle className="text-lg">{getStepTitleLocal()}</CardTitle>
					<CardDescription className="text-sm">
						{getStepDescriptionLocal()}
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
						newlyCreatedSolutions={newlyCreatedSolutions}
						newlyCreatedVariants={newlyCreatedVariants}
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
						selectedIndustry={formData.industry}
						selectedTechnology={formData.technology}
						selectedSolutionId={formData.solution}
						selectedSolutionVariantId={formData.solution_variant}
						onIndustrySelect={handleIndustrySelectLocal}
						onTechnologySelect={handleTechnologySelectLocal}
						onSolutionTypeSelect={handleSolutionSelectLocal}
						onSolutionVariantSelect={handleSolutionVariantSelectLocal}
						onFormDataChange={handleFormDataChangeLocal}
						onCreateNewSolution={handleCreateNewSolutionLocal}
						onCreateNewVariant={handleCreateNewVariantLocal}
						onNoVariantSelect={handleNoVariantSelectLocal}
						onAddSolutionVariant={handleAddSolutionVariantLocal}
						onAddNewlyCreatedSolution={handleAddNewlyCreatedSolutionLocal}
						onAddNewlyCreatedVariant={handleAddNewlyCreatedVariantLocal}
						onParametersChange={handleParametersChangeLocal}
						onCalculationsChange={handleCalculationsChangeLocal}
						onSaveAsDraft={handleSaveAsDraft}
						onSubmitForReview={handleSubmitForReview}
						setCustomParameterCategories={setCustomParameterCategories}
						setCustomCalculationCategories={setCustomCalculationCategories}
						getSelectedIndustryName={() =>
							getSelectedIndustryName(availableIndustries, formData.industry)
						}
						getSelectedTechnologyName={() =>
							getSelectedTechnologyName(
								availableTechnologies,
								formData.technology
							)
						}
						getSelectedSolutionType={() =>
							getSelectedSolutionType(availableSolutionTypes, formData.solution)
						}
						getSelectedSolutionVariant={() =>
							getSelectedSolutionVariant(
								availableSolutionVariants,
								formData.solution_variant
							)
						}
						handleSolutionTypeSelectLocal={handleSolutionTypeSelectLocal}
						selectedSolutionVariantData={selectedSolutionVariantData}
					/>
				</CardContent>
				{/* Navigation Buttons */}
				<CardFooter className="p-4 border-t bg-gray-50">
					<ActionButtons
						currentStep={currentStep}
						handlePrevious={handlePrevious}
						handleNext={handleNext}
						isNextDisabled={isNextDisabledLocal}
					/>
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
