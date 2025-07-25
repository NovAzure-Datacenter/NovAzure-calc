"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { getClientByUserId } from "@/lib/actions/clients/clients";
import { createClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { createSolution } from "@/lib/actions/solution/solution";
import {
	getSolutions,
	getSolutionTypesByIndustryAndTechnology,
} from "@/lib/actions/solution/solution";
import {
	createSolutionVariant,
	getSolutionVariantsBySolutionId,
	updateSolutionVariant,
	updateSolutionVariantSolutionId,
} from "@/lib/actions/solution-variant/solution-variant";
import { updateSolution } from "@/lib/actions/solution/solution";
import { getAllGlobalParameters } from "@/lib/actions/global-parameters/global-parameters";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
	solutionTypes,
	type Calculation,
	type SolutionType,
	type SolutionVariant,
} from "../../mock-data";
import { Parameter } from "../../../types";
import { CreateSolutionParameters } from "./create-solution-parameters/create-solution-parameters";
import { CalculationsConfiguration, mockCalculations } from "./create-solution-calculations/create-solution-calculations";
import { CreateSolutionProgress } from "./create-solution-progress";
import { CreateSolutionStep1 } from "./create-solution-step-1";
import { CreateSolutionStep6 } from "./create-solution-step-6";
import { SubmissionDialog } from "./submission-dialog";
import { DraftDialog } from "./draft-dialog";
import Loading from "@/components/loading-main";
import { globalParameters } from "../../mock-data";
import { getClientSolutions } from "@/lib/actions/clients-solutions/clients-solutions";
import { updateClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";

interface CreateSolutionData {
	selectedIndustry: string;
	selectedTechnology: string;
	selectedSolutionId: string;
	selectedSolutionVariantId: string;
	// For creating new solution
	solutionName: string;
	solutionDescription: string;
	solutionIcon: string;
	// For creating new solution variant
	newVariantName: string;
	newVariantDescription: string;
	newVariantIcon: string;
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
	const [availableSolutionTypes, setAvailableSolutionTypes] = useState<any[]>(
		[]
	);
	const [isLoadingSolutionTypes, setIsLoadingSolutionTypes] = useState(false);
	const [availableSolutionVariants, setAvailableSolutionVariants] = useState<
		any[]
	>([]);
	const [isLoadingSolutionVariants, setIsLoadingSolutionVariants] =
		useState(false);
	const [isCreatingNewSolution, setIsCreatingNewSolution] = useState(false);
	const [isCreatingNewVariant, setIsCreatingNewVariant] = useState(false);
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
	// Separate category states for parameters and calculations to keep them independent
	const [customParameterCategories, setCustomParameterCategories] = useState<any[]>([]);
	const [customCalculationCategories, setCustomCalculationCategories] = useState<any[]>([]);

	// Loading state for parameters
	const [isLoadingParameters, setIsLoadingParameters] = useState(false);

	// Loading state for calculations
	const [isLoadingCalculations, setIsLoadingCalculations] = useState(false);

	// Track if an existing solution was loaded
	const [isExistingSolutionLoaded, setIsExistingSolutionLoaded] = useState(false);

	// Track the existing solution ID for updates
	const [existingSolutionId, setExistingSolutionId] = useState<string | null>(null);

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
		calculations: mockCalculations,
	});

	// Load initial data
	useEffect(() => {
		async function loadData() {
			if (!user) return;

			try {
			setIsLoading(true);

				// Load client data
				const clientResult = await getClientByUserId(user._id);
				if (clientResult.client) {
					setClientData(clientResult.client);
				} else if (clientResult.error) {
					console.error("Error loading client:", clientResult.error);
					toast.error("Failed to load client data");
					return;
				}

				// Load industries
				setIsLoadingIndustries(true);
				const industriesResult = await getIndustries();
				if (industriesResult.success) {
					setAvailableIndustries(industriesResult.industries || []);
				}
				setIsLoadingIndustries(false);

				// Load technologies
				setIsLoadingTechnologies(true);
				const technologiesResult = await getTechnologies();
				if (technologiesResult.success) {
					setAvailableTechnologies(technologiesResult.technologies || []);
				}
				setIsLoadingTechnologies(false);

				// Load global parameters
				const globalParams = await getAllGlobalParameters();
				setFormData(prev => ({
					...prev,
					parameters: globalParams,
				}));

			} catch (error) {
				console.error("Error loading data:", error);
				toast.error("Failed to load initial data");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();
	}, [user]);

	const handleNext = () => {
		// If moving to step 2 or 3 and we have a selected solution variant, load existing data
		// Only load if we haven't already loaded the data for this solution variant
		if ((currentStep === 1 || currentStep === 2) && 
			formData.selectedSolutionVariantId && 
			!isExistingSolutionLoaded) {
			loadExistingSolutionData(formData.selectedSolutionVariantId);
		}
		setCurrentStep(prev => prev + 1);
	};

	const handlePrevious = () => {
		setCurrentStep(prev => prev - 1);
	};

	const handleIndustrySelect = (industryId: string) => {
		setFormData(prev => ({ ...prev, selectedIndustry: industryId }));
		// Reset technology and solution when industry changes
		setFormData(prev => ({ 
			...prev, 
			selectedTechnology: "",
			selectedSolutionId: "",
			selectedSolutionVariantId: ""
		}));
		setAvailableSolutionTypes([]);
		setAvailableSolutionVariants([]);
		// Reset loaded solution data when industry changes
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	};

	const handleTechnologySelect = (technologyId: string) => {
		setFormData(prev => ({ ...prev, selectedTechnology: technologyId }));
		// Reset solution when technology changes
		setFormData(prev => ({ 
			...prev, 
			selectedSolutionId: "",
			selectedSolutionVariantId: ""
		}));
		setAvailableSolutionVariants([]);
		// Reset loaded solution data when technology changes
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
		
		// Fetch solution types for the selected industry and technology
		if (formData.selectedIndustry && technologyId) {
			fetchSolutionTypes(formData.selectedIndustry, technologyId);
		}
	};

	const handleSolutionTypeSelect = (solutionTypeId: string) => {
		setFormData(prev => ({ 
			...prev,
			selectedSolutionId: solutionTypeId,
			selectedSolutionVariantId: ""
		}));
		setIsCreatingNewSolution(false);
		setIsCreatingNewVariant(false);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
		
		// Reset new solution/variant data
		setFormData(prev => ({
			...prev,
			solutionName: "",
			solutionDescription: "",
			solutionIcon: "",
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		}));

		// Fetch solution variants for the selected solution type
		if (solutionTypeId) {
			fetchSolutionVariants(solutionTypeId);
		}
	};

	const handleSolutionVariantSelect = (variantId: string) => {
		setFormData(prev => ({ ...prev, selectedSolutionVariantId: variantId }));
		setIsCreatingNewVariant(false);
		setFormData(prev => ({
			...prev,
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		}));

		// Reset existing solution loaded state for new variants
		if (variantId.startsWith('new-variant-')) {
			setIsExistingSolutionLoaded(false);
			setExistingSolutionId(null);
		}

		// Load existing solution data if this is an existing solution variant
		if (variantId && !variantId.startsWith('new-variant-')) {
			// Reset the loaded state so we can load data for the new variant
			setIsExistingSolutionLoaded(false);
			setExistingSolutionId(null);
			loadExistingSolutionData(variantId);
		}
	};

	const handleCreateNewSolution = () => {
		setIsCreatingNewSolution(true);
		setFormData(prev => ({ 
			...prev,
			selectedSolutionId: "",
			selectedSolutionVariantId: ""
		}));
		setAvailableSolutionVariants([]);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	};

	const handleCreateNewVariant = () => {
		setIsCreatingNewVariant(true);
		setFormData(prev => ({ ...prev, selectedSolutionVariantId: "" }));
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	};

	const handleNoVariantSelect = () => {
		setFormData(prev => ({ ...prev, selectedSolutionVariantId: "" }));
		setIsCreatingNewVariant(false);
		setFormData(prev => ({
			...prev,
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		}));
		// Reset loaded solution data when no variant is selected
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	};

	const handleAddSolutionVariant = (newVariant: any) => {
		setAvailableSolutionVariants(prev => [...prev, newVariant]);
	};

	const fetchSolutionTypes = async (
		industryId: string,
		technologyId: string
	) => {
		try {
			setIsLoadingSolutionTypes(true);
			const result = await getSolutionTypesByIndustryAndTechnology(
				industryId,
				technologyId
			);
			if (result.success) {
				setAvailableSolutionTypes(result.solutionTypes || []);
			}
		} catch (error) {
			console.error("Error fetching solution types:", error);
			toast.error("Failed to load solution types");
		} finally {
			setIsLoadingSolutionTypes(false);
		}
	};

	const fetchSolutionVariants = async (solutionId: string) => {
		try {
		setIsLoadingSolutionVariants(true);
			const result = await getSolutionVariantsBySolutionId(solutionId);
			if (result.success) {
				setAvailableSolutionVariants(result.solutionVariants || []);
			}
		} catch (error) {
			console.error("Error fetching solution variants:", error);
			toast.error("Failed to load solution variants");
		} finally {
			setIsLoadingSolutionVariants(false);
		}
	};

	const handleFormDataChange = (updates: Partial<CreateSolutionData>) => {
		setFormData(prev => ({ ...prev, ...updates }));
	};

	const handleParametersChange = (parameters: Parameter[]) => {
		setFormData(prev => ({ ...prev, parameters }));
	};

	const handleCalculationsChange = (calculations: Calculation[]) => {
		setFormData(prev => ({ ...prev, calculations }));
	};

	// Function to load existing solution data (parameters and calculations)
	const loadExistingSolutionData = async (solutionVariantId: string) => {
		try {
			setIsLoadingParameters(true);
			setIsLoadingCalculations(true);
			console.log("Loading data for solution variant:", solutionVariantId);
			
			// Check if this is an existing solution variant (not a new one)
			if (!solutionVariantId.startsWith('new-variant-')) {
				// Get the existing solution data
				const existingSolutions = await getClientSolutions(clientData.id);
				console.log("Found existing solutions:", existingSolutions.solutions?.length || 0);
				
				if (existingSolutions.solutions) {
					const existingSolution = existingSolutions.solutions.find(
						solution => solution.id === solutionVariantId
					);
					
					console.log("Found matching solution:", existingSolution);
					
					if (existingSolution) {
						// Load parameters if they exist
						if (existingSolution.parameters) {
							setFormData(prev => ({
								...prev,
								parameters: existingSolution.parameters
							}));
						}

						// Load calculations if they exist
						if (existingSolution.calculations) {
							setFormData(prev => ({
								...prev,
								calculations: existingSolution.calculations
							}));
						}
						setIsExistingSolutionLoaded(true);
						setExistingSolutionId(existingSolution.id || null); // Set the existing solution ID
					} else {
						// Solution not found
						toast.warning("Existing solution not found. Starting with empty data.");
					}
				}
			} else {
				console.log("New variant selected, starting with empty data");
			}
		} catch (error) {
			console.error("Error loading existing solution data:", error);
			toast.error("Failed to load existing solution data");
		} finally {
			setIsLoadingParameters(false);
			setIsLoadingCalculations(false);
		}
	};

	const handleSaveAsDraft = async () => {
		try {
			setIsSubmitting(true);

			// If we have an existing solution loaded, update it instead of creating a new one
			if (isExistingSolutionLoaded && existingSolutionId) {
				// Update the existing solution
				const updateResult = await updateClientSolution(existingSolutionId, {
					parameters: formData.parameters,
					calculations: formData.calculations,
					status: "draft",
					updated_at: new Date(),
				});

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

			// Create solution first
			let solutionId = formData.selectedSolutionId;
			if (isCreatingNewSolution) {
				const newSolution = await createSolution({
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

			// Create solution variant if needed
			let variantId = formData.selectedSolutionVariantId;
			if (isCreatingNewVariant) {
				const newVariant = await createSolutionVariant({
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

			// Load existing solution data if this is an existing solution variant
			if (variantId && !variantId.startsWith('new-variant-')) {
				// Reset the loaded state so we can load data for the new variant
				setIsExistingSolutionLoaded(false);
				setExistingSolutionId(null);
				loadExistingSolutionData(variantId);
			}

			// Determine solution details based on what was selected/created
			let finalSolutionName: string;
			let finalSolutionDescription: string;
			let finalSolutionIcon: string;

			if (isCreatingNewSolution) {
				// New solution created
				finalSolutionName = formData.solutionName;
				finalSolutionDescription = formData.solutionDescription;
				finalSolutionIcon = formData.solutionIcon;
			} else if (isCreatingNewVariant) {
				// Existing solution with new variant
				const selectedSolution = getSelectedSolutionType();
				finalSolutionName = formData.newVariantName;
				finalSolutionDescription = formData.newVariantDescription;
				finalSolutionIcon = formData.newVariantIcon;
			} else {
				// Existing solution and variant
				const selectedSolution = getSelectedSolutionType();
				const selectedVariant = getSelectedSolutionVariant();
				
				if (selectedVariant) {
					// Use variant information
					finalSolutionName = selectedVariant.name;
					finalSolutionDescription = selectedVariant.description || "";
					finalSolutionIcon = selectedVariant.icon || "";
				} else {
					// Fallback to solution information
					finalSolutionName = selectedSolution?.name || "Unknown Solution";
					finalSolutionDescription = selectedSolution?.description || "";
					finalSolutionIcon = selectedSolution?.icon || "";
				}
			}

			await createClientSolution({
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

			// If we have an existing solution loaded, update it instead of creating a new one
			if (isExistingSolutionLoaded && existingSolutionId) {
				// Update the existing solution
				const updateResult = await updateClientSolution(existingSolutionId, {
					parameters: formData.parameters,
					calculations: formData.calculations,
					status: "pending",
					updated_at: new Date(),
				});

				if (updateResult.success) {
					setSubmissionStatus("success");
					setSubmissionMessage("Solution updated and submitted for review successfully!");
					setSubmittedSolutionName("Updated Solution");
					setShowSubmissionDialog(true);
				} else {
					throw new Error(updateResult.error || "Failed to update solution");
				}
				return;
			}

			// Create solution first
			let solutionId = formData.selectedSolutionId;
			if (isCreatingNewSolution) {
				const newSolution = await createSolution({
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

			// Create solution variant if needed
			let variantId = formData.selectedSolutionVariantId;
			if (isCreatingNewVariant) {
				const newVariant = await createSolutionVariant({
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

			// Load existing solution data if this is an existing solution variant
			if (variantId && !variantId.startsWith('new-variant-')) {
				// Reset the loaded state so we can load data for the new variant
				setIsExistingSolutionLoaded(false);
				setExistingSolutionId(null);
				loadExistingSolutionData(variantId);
			}

			// Determine solution details based on what was selected/created
			let finalSolutionName: string;
			let finalSolutionDescription: string;
			let finalSolutionIcon: string;

			if (isCreatingNewSolution) {
				// New solution created
				finalSolutionName = formData.solutionName;
				finalSolutionDescription = formData.solutionDescription;
				finalSolutionIcon = formData.solutionIcon;
			} else if (isCreatingNewVariant) {
				// Existing solution with new variant
				const selectedSolution = getSelectedSolutionType();
				finalSolutionName = formData.newVariantName;
				finalSolutionDescription = formData.newVariantDescription;
				finalSolutionIcon = formData.newVariantIcon;
			} else {
				// Existing solution and variant
				const selectedSolution = getSelectedSolutionType();
				const selectedVariant = getSelectedSolutionVariant();
				
				if (selectedVariant) {
					// Use variant information
					finalSolutionName = selectedVariant.name;
					finalSolutionDescription = selectedVariant.description || "";
					finalSolutionIcon = selectedVariant.icon || "";
				} else {
					// Fallback to solution information
					finalSolutionName = selectedSolution?.name || "Unknown Solution";
					finalSolutionDescription = selectedSolution?.description || "";
					finalSolutionIcon = selectedSolution?.icon || "";
				}
			}


			await createClientSolution({
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
			setSubmissionMessage("Failed to submit solution for review. Please try again.");
			setShowSubmissionDialog(true);
		} finally {
			setIsSubmitting(false);
		}
	};

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

	const getStepTitle = () => {
		switch (currentStep) {
			case 1:
				return "Select Industry, Technology & Solution";
			case 2:
				return "Configure Parameters";
			case 3:
				return "Configure Calculations";
			case 4:
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
				return "Review your solution configuration and submit for approval";
			default:
				return "Follow the steps to create your solution";
		}
	};

	const isNextDisabled = () => {
		switch (currentStep) {
			case 1:
				// Check if industry, technology, and solution are selected
				const hasIndustry = !!formData.selectedIndustry;
				const hasTechnology = !!formData.selectedTechnology;
				const hasSolution = formData.selectedSolutionId || isCreatingNewSolution;
				const hasSolutionVariant = !!formData.selectedSolutionVariantId || isCreatingNewVariant;

				// If creating new solution, require name and description
				if (isCreatingNewSolution) {
					return !hasIndustry || !hasTechnology || !formData.solutionName || !formData.solutionDescription || !hasSolutionVariant;
				}

				// If using existing solution type, require solution variant as well
				return !hasIndustry || !hasTechnology || !hasSolution || !hasSolutionVariant;
			case 2:
				// Allow proceeding even if parameters are being loaded
				if (isLoadingParameters) {
					return false;
				}
				return formData.parameters.length === 0;
			case 3:
				// Allow proceeding even if calculations are being loaded
				if (isLoadingCalculations) {
					return false;
				}
				return formData.calculations.length === 0;
			default:
				return false;
		}
	};

	if (isLoading) {
		return <Loading />;
	}



	return (
		<div className="w-full h-screen flex flex-col pb-8 overflow-hidden">
			{/* Header */}
			<div className="text-center space-y-1 flex-shrink-0 p-4">
				<h1 className="text-2xl font-bold">Create New Solution</h1>
				<p className="text-sm text-muted-foreground">
					Follow the steps below to create a new solution for your organization
				</p>
			</div>

			{/* Progress Steps */}
			<div className="flex-shrink-0 px-4">
			<CreateSolutionProgress currentStep={currentStep} />
			</div>

			{/* Step Content */}
			<Card className="flex flex-col min-h-0 max-h-[calc(100vh-200px)] overflow-hidden mx-4">
				<CardHeader className="pb-4 flex-shrink-0">
					<CardTitle className="text-lg">{getStepTitle()}</CardTitle>
					<CardDescription className="text-sm ">
						{getStepDescription()}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 overflow-y-auto space-y-4 overflow-x-hidden">
					{/* Step 1: Industry, Technology & Solution Selection */}
					{currentStep === 1 && (
						<CreateSolutionStep1
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
							onIndustrySelect={handleIndustrySelect}
							onTechnologySelect={handleTechnologySelect}
							onSolutionTypeSelect={handleSolutionTypeSelect}
							onSolutionVariantSelect={handleSolutionVariantSelect}
							onFormDataChange={handleFormDataChange}
							onCreateNewSolution={handleCreateNewSolution}
							onCreateNewVariant={handleCreateNewVariant}
							onNoVariantSelect={handleNoVariantSelect}
							onAddSolutionVariant={handleAddSolutionVariant}
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
						<CreateSolutionParameters
							parameters={formData.parameters}
							onParametersChange={handleParametersChange}
							customCategories={customParameterCategories}
							setCustomCategories={setCustomParameterCategories}
							selectedIndustry={formData.selectedIndustry}
							selectedTechnology={formData.selectedTechnology}
							selectedSolutionId={formData.selectedSolutionId}
							availableIndustries={availableIndustries}
							availableTechnologies={availableTechnologies}
							availableSolutionTypes={availableSolutionTypes}
							isLoadingParameters={isLoadingParameters}
						/>
					)}

					{/* Step 3: Calculations Configuration */}
					{currentStep === 3 && (
						<CalculationsConfiguration
							calculations={formData.calculations}
							onCalculationsChange={handleCalculationsChange}
							parameters={formData.parameters}
							onParametersChange={handleParametersChange}
							selectedIndustry={formData.selectedIndustry}
							selectedTechnology={formData.selectedTechnology}
							selectedSolutionId={formData.selectedSolutionId}
							availableIndustries={availableIndustries}
							availableTechnologies={availableTechnologies}
							availableSolutionTypes={availableSolutionTypes}
							customCategories={customCalculationCategories}
							setCustomCategories={setCustomCalculationCategories}
							isLoadingCalculations={isLoadingCalculations}
						/>
					)}

					{/* Step 4: Review and Submit */}
					{currentStep === 4 && (
						<CreateSolutionStep6
							formData={{
								solutionName: formData.solutionName,
								solutionDescription: formData.solutionDescription,
								solutionVariant: formData.selectedSolutionVariantId,
								customSolutionVariant: formData.newVariantName,
								customSolutionVariantDescription:
									formData.newVariantDescription,
								parameters: formData.parameters as any,
								calculations: formData.calculations,
							}}
							showCustomSolutionType={isCreatingNewSolution}
							showCustomSolutionVariant={isCreatingNewVariant}
							isSubmitting={isSubmitting}
							onSaveAsDraft={handleSaveAsDraft}
							onSubmitForReview={handleSubmitForReview}
							getSelectedIndustryName={getSelectedIndustryName}
							getSelectedTechnologyName={getSelectedTechnologyName}
							getSelectedSolutionType={getSelectedSolutionType}
							getSelectedSolutionVariant={getSelectedSolutionVariant}
							isExistingSolutionLoaded={isExistingSolutionLoaded}
						/>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between pt-4 flex-shrink-0">
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

						{currentStep < 4 ? (
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
				</CardContent>
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
