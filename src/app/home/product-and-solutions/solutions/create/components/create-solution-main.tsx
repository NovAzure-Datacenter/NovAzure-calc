"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { getClientByUserId } from "@/lib/actions/client/client";
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
	defaultCalculations,
	solutionTypes,
	type Calculation,
	type SolutionType,
	type SolutionVariant,
} from "../../mock-data";
import { Parameter } from "../../../types";
import { ParametersConfiguration } from "./create-solution-parameters/create-solution-parameters";
import { CalculationsConfiguration } from "./create-solution-calculations";
import { CreateSolutionProgress } from "./create-solution-progress";
import { CreateSolutionStep1 } from "./create-solution-step-1";
import { CreateSolutionStep2 } from "./create-solution-step-2";
import { CreateSolutionStep3 } from "./create-solution-step-3";
import { CreateSolutionStep6 } from "./create-solution-step-6";
import { SubmissionDialog } from "./submission-dialog";
import { DraftDialog } from "./draft-dialog";
import Loading from "@/components/loading-main";
import { globalParameters } from "../../mock-data";

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
		parameters: [...globalParameters],
		calculations: [...defaultCalculations],
	});

	// Custom categories state for parameters
	const [customCategories, setCustomCategories] = useState<Array<{ name: string; color: string }>>([]);

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
				toast.error("Failed to load required data");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();
	}, [user?._id]);

	const handleNext = () => {
		if (currentStep < 6) {
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
		// Fetch solution types when both industry and technology are selected
		if (industryId && formData.selectedTechnology) {
			fetchSolutionTypes(industryId, formData.selectedTechnology);
		}
	};

	const handleTechnologySelect = (technologyId: string) => {
		setFormData((prev) => ({ ...prev, selectedTechnology: technologyId }));
		// Fetch solution types when both industry and technology are selected
		if (formData.selectedIndustry && technologyId) {
			fetchSolutionTypes(formData.selectedIndustry, technologyId);
		}
	};

	const handleSolutionTypeSelect = (solutionTypeId: string) => {
		setFormData((prev) => ({
			...prev,
			selectedSolutionId: solutionTypeId,
			selectedSolutionVariantId: "", // Reset variant when type changes
		}));
		setIsCreatingNewSolution(false);
		setIsCreatingNewVariant(false);

		// Fetch solution variants for the selected solution type
		if (solutionTypeId) {
			fetchSolutionVariants(solutionTypeId);
		}
	};

	const handleSolutionVariantSelect = (variantId: string) => {
		setFormData((prev) => ({ ...prev, selectedSolutionVariantId: variantId }));
		setIsCreatingNewVariant(false);
	};

	const handleCreateNewSolution = () => {
		setFormData((prev) => ({
			...prev,
			selectedSolutionId: "",
			selectedSolutionVariantId: "",
		}));
		setIsCreatingNewSolution(true);
		setIsCreatingNewVariant(false);
		setAvailableSolutionVariants([]);
	};

	const handleCreateNewVariant = () => {
		setFormData((prev) => ({ ...prev, selectedSolutionVariantId: "" }));
		setIsCreatingNewVariant(true);
	};

	const handleNoVariantSelect = () => {
		setFormData((prev) => ({ ...prev, selectedSolutionVariantId: "" }));
		setIsCreatingNewVariant(false);
	};

	const fetchSolutionTypes = async (
		industryId: string,
		technologyId: string
	) => {
		setIsLoadingSolutionTypes(true);
		try {
			const result = await getSolutionTypesByIndustryAndTechnology(
				industryId,
				technologyId
			);
			if (result.error) {
				toast.error("Failed to load solution types");
				setAvailableSolutionTypes([]);
			} else {
				setAvailableSolutionTypes(result.solutionTypes || []);
			}
		} catch (error) {
			toast.error("Failed to load solution types");
			setAvailableSolutionTypes([]);
		} finally {
			setIsLoadingSolutionTypes(false);
		}
	};

	const fetchSolutionVariants = async (solutionId: string) => {
		setIsLoadingSolutionVariants(true);
		try {
			// Extract the actual MongoDB ObjectId from the solution type ID
			// If it starts with "custom_", remove that prefix
			const actualSolutionId = solutionId.startsWith("custom_")
				? solutionId.replace("custom_", "")
				: solutionId;

			const result = await getSolutionVariantsBySolutionId(actualSolutionId);
			if (result.error) {
				toast.error("Failed to load solution variants");
				setAvailableSolutionVariants([]);
			} else {
				setAvailableSolutionVariants(result.solutionVariants || []);
			}
		} catch (error) {
			toast.error("Failed to load solution variants");
			setAvailableSolutionVariants([]);
		} finally {
			setIsLoadingSolutionVariants(false);
		}
	};

	const handleFormDataChange = (updates: Partial<CreateSolutionData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const handleParametersChange = (parameters: Parameter[]) => {
		setFormData((prev) => ({ ...prev, parameters }));
	};

	const handleCalculationsChange = (calculations: Calculation[]) => {
		setFormData((prev) => ({ ...prev, calculations }));
	};

	const handleSaveAsDraft = async () => {
		try {
			setIsSubmitting(true);

			// Validate form data
			if (!formData.selectedIndustry || !formData.selectedTechnology) {
				toast.error("Please fill in all required fields");
				return;
			}

			// Check if user has selected a solution type (either default or custom)
			const hasSelectedSolutionType =
				formData.selectedSolutionId || isCreatingNewSolution;

			if (!hasSelectedSolutionType) {
				toast.error("Please select a solution type");
				return;
			}

			// If creating custom solution type, require name and description
			if (
				isCreatingNewSolution &&
				(!formData.solutionName || !formData.solutionDescription)
			) {
				toast.error(
					"Please fill in solution name and description for custom solution type"
				);
				return;
			}

			// Handle solution variant creation if creating a new variant
			let solutionVariantIds: string[] = [];
			let existingSolutionId: string | null = null;

			// If using an existing solution type, we need to update that solution
			if (!isCreatingNewSolution && formData.selectedSolutionId) {
				// Get the existing solution to update it
				existingSolutionId = getActualSolutionId();
			}

			// If creating a new variant, we need to handle it differently based on whether we're creating a new solution or using an existing one
			if (isCreatingNewVariant) {
				if (!formData.newVariantName || !formData.newVariantDescription) {
					toast.error("Please fill in solution variant name and description");
					return;
				}

				// If using an existing solution, create the variant now
				if (existingSolutionId) {
					const variantData = {
						name: formData.newVariantName,
						description: formData.newVariantDescription,
						icon: formData.newVariantIcon || "Package",
						solution_id: existingSolutionId,
						created_by: user?._id || "",
					};

					const variantResult = await createSolutionVariant(variantData);
					if (variantResult.error) {
						setDraftStatus("error");
						setDraftMessage(variantResult.error);
						setShowDraftDialog(true);
						return;
					}

					solutionVariantIds = [variantResult.solution_variant_id!];
				}
				// If creating a new solution, we'll create the variant after the solution is created
			}

			// Prepare data for MongoDB
			const solutionData = {
				applicable_industries: formData.selectedIndustry,
				applicable_technologies: formData.selectedTechnology,
				solution_name: formData.solutionName,
				solution_description: formData.solutionDescription,
				solution_variants: solutionVariantIds,
				solution_icon: isCreatingNewSolution
					? formData.solutionIcon
					: undefined,
				parameters: formData.parameters,
				calculations: formData.calculations,
				status: "draft" as const,
				created_by: user?._id || "",
				client_id: clientData?.id || "",
			};

			let result;
			if (existingSolutionId) {
				// Update existing solution with new variant
				result = await updateSolution(existingSolutionId, {
					solution_variants: solutionVariantIds,
					parameters: formData.parameters as any,
					calculations: formData.calculations,
					status: "draft",
				});
			} else {
				// Create new solution
				result = await createSolution(solutionData as any);
			}

			if (result.error) {
				setDraftStatus("error");
				setDraftMessage(result.error);
				setShowDraftDialog(true);
				return;
			}

			// If we created a new solution and a new variant, create the variant now with the actual solution ID
			if (
				isCreatingNewSolution &&
				isCreatingNewVariant &&
				result.success &&
				"solution_id" in result
			) {
				const solutionId = (result as { solution_id: string }).solution_id;

				const variantData = {
					name: formData.newVariantName,
					description: formData.newVariantDescription,
					icon: formData.newVariantIcon || "Package",
					solution_id: solutionId,
					created_by: user?._id || "",
				};

				const variantResult = await createSolutionVariant(variantData);
				if (variantResult.error) {
					// Don't fail the entire submission, just log the error
				} else {
					// Update the solution with the new variant ID
					await updateSolution(solutionId, {
						solution_variants: [variantResult.solution_variant_id!],
					});
				}
			}

			// Show success dialog
			setDraftStatus("success");
			setDraftMessage("Solution saved as draft successfully!");
			setDraftSolutionName(formData.solutionName);
			setShowDraftDialog(true);

			// Reset form and go back to step 1
			setFormData({
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
				parameters: [...globalParameters],
				calculations: [...defaultCalculations],
			});
			setCurrentStep(1);
		} catch (error) {
			setDraftStatus("error");
			setDraftMessage("Failed to save draft. Please try again.");
			setShowDraftDialog(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmitForReview = async () => {
		try {
			setIsSubmitting(true);

			// Validate form data
			if (!formData.selectedIndustry || !formData.selectedTechnology) {
				toast.error("Please fill in all required fields");
				return;
			}

			// Check if user has selected a solution type (either default or custom)
			const hasSelectedSolutionType =
				formData.selectedSolutionId || isCreatingNewSolution;

			if (!hasSelectedSolutionType) {
				toast.error("Please select a solution type");
				return;
			}

			// If creating custom solution type, require name and description
			if (
				isCreatingNewSolution &&
				(!formData.solutionName || !formData.solutionDescription)
			) {
				toast.error(
					"Please fill in solution name and description for custom solution type"
				);
				return;
			}

			// Handle solution variant creation if creating a new variant
			let solutionVariantIds: string[] = [];
			let existingSolutionId: string | null = null;

			// If using an existing solution type, we need to update that solution
			if (!isCreatingNewSolution && formData.selectedSolutionId) {
				// Get the existing solution to update it
				existingSolutionId = getActualSolutionId();
			}

			// If creating a new variant, we need to handle it differently based on whether we're creating a new solution or using an existing one
			if (isCreatingNewVariant) {
				if (!formData.newVariantName || !formData.newVariantDescription) {
					toast.error("Please fill in solution variant name and description");
					return;
				}

				// If using an existing solution, create the variant now
				if (existingSolutionId) {
					const variantData = {
						name: formData.newVariantName,
						description: formData.newVariantDescription,
						icon: formData.newVariantIcon || "Package",
						solution_id: existingSolutionId,
						created_by: user?._id || "",
					};

					const variantResult = await createSolutionVariant(variantData);
					if (variantResult.error) {
						setSubmissionStatus("error");
						setSubmissionMessage(variantResult.error);
						setShowSubmissionDialog(true);
						return;
					}

					solutionVariantIds = [variantResult.solution_variant_id!];
				}
				// If creating a new solution, we'll create the variant after the solution is created
			}

			// Prepare data for MongoDB
			const solutionData = {
				applicable_industries: formData.selectedIndustry,
				applicable_technologies: formData.selectedTechnology,
				solution_name: formData.solutionName,
				solution_description: formData.solutionDescription,
				solution_variants: solutionVariantIds,
				solution_icon: isCreatingNewSolution
					? formData.solutionIcon
					: undefined,
				parameters: formData.parameters,
				calculations: formData.calculations,
				status: "pending" as const,
				created_by: user?._id || "",
				client_id: clientData?.id || "",
			};

			let result;
			if (existingSolutionId) {
				// Update existing solution with new variant
				result = await updateSolution(existingSolutionId, {
					solution_variants: solutionVariantIds,
					parameters: formData.parameters as any,
					calculations: formData.calculations,
					status: "pending",
				});
			} else {
				// Create new solution
				result = await createSolution(solutionData as any);
			}

			if (result.error) {
				setSubmissionStatus("error");
				setSubmissionMessage(result.error);
				setShowSubmissionDialog(true);
				return;
			}

			// If we created a new solution and a new variant, create the variant now with the actual solution ID
			if (
				isCreatingNewSolution &&
				isCreatingNewVariant &&
				result.success &&
				"solution_id" in result
			) {
				const solutionId = (result as { solution_id: string }).solution_id;

				const variantData = {
					name: formData.newVariantName,
					description: formData.newVariantDescription,
					icon: formData.newVariantIcon || "Package",
					solution_id: solutionId,
					created_by: user?._id || "",
				};

				const variantResult = await createSolutionVariant(variantData);
				if (variantResult.error) {
					// Don't fail the entire submission, just log the error
				} else {
					// Update the solution with the new variant ID
					await updateSolution(solutionId, {
						solution_variants: [variantResult.solution_variant_id!],
					});
				}
			}

			// Show success dialog
			setSubmissionStatus("success");
			setSubmissionMessage("Solution submitted for review successfully!");
			setSubmittedSolutionName(formData.solutionName);
			setShowSubmissionDialog(true);

			// Reset form and go back to step 1
			setFormData({
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
				parameters: [...globalParameters],
				calculations: [...defaultCalculations],
			});
			setCurrentStep(1);
		} catch (error) {
			setSubmissionStatus("error");
			setSubmissionMessage("Failed to submit for review. Please try again.");
			setShowSubmissionDialog(true);
		} finally {
			setIsSubmitting(false);
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
		return availableSolutionTypes.find(
			(st) => st.id === formData.selectedSolutionId
		);
	};

	const getSelectedSolutionVariant = () => {
		return availableSolutionVariants.find(
			(sv) => sv.id === formData.selectedSolutionVariantId
		);
	};

	const getActualSolutionId = () => {
		const selectedSolutionType = getSelectedSolutionType();
		if (selectedSolutionType?.solutionId) {
			return selectedSolutionType.solutionId;
		}
		return null;
	};

	if (isLoading) {
		return <Loading />;
	}

	const getStepTitle = () => {
		switch (currentStep) {
			case 1:
				return "Select Industry";
			case 2:
				return "Select Technology";
			case 3:
				return "Solution Details";
			case 4:
				return "Parameters Configuration";
			case 5:
				return "Calculations Configuration";
			case 6:
				return "Review & Submit";
			default:
				return "";
		}
	};

	const getStepDescription = () => {
		switch (currentStep) {
			case 1:
				return "Choose the industry that best fits your solution";
			case 2:
				return "Select the technology category for your solution";
			case 3:
				return "Define the type, variant, and details of your solution";
			case 4:
				return "Configure system parameters and override values as needed";
			case 5:
				return "Set up calculation formulas and view results";
			case 6:
				return "Review your solution and choose to save as draft or submit for review";
			default:
				return "";
		}
	};

	const isNextDisabled = () => {
		switch (currentStep) {
			case 1:
				return !formData.selectedIndustry;
			case 2:
				return !formData.selectedTechnology;
			case 3:
				// Check if user has selected a solution type (either existing or creating new)
				const hasSelectedSolutionType =
					formData.selectedSolutionId || isCreatingNewSolution;

				// If creating new solution, require name and description
				if (isCreatingNewSolution) {
					return !formData.solutionName || !formData.solutionDescription;
				}

				// If using existing solution type, just require the type to be selected
				return !hasSelectedSolutionType;
			default:
				return false;
		}
	};

	return (
		<div className="mx-auto p-4 space-y-4">
			{/* Header */}
			<div className="text-center space-y-1">
				<h1 className="text-2xl font-bold">Create New Solution</h1>
				<p className="text-sm text-muted-foreground">
					Follow the steps below to create a new solution for your organization
				</p>
			</div>

			{/* Progress Steps */}
			<CreateSolutionProgress currentStep={currentStep} />

			{/* Step Content */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="text-lg">{getStepTitle()}</CardTitle>
					<CardDescription className="text-sm ">
						{getStepDescription()}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Step 1: Industry Selection */}
					{currentStep === 1 && (
						<CreateSolutionStep1
							clientData={clientData}
							availableIndustries={availableIndustries}
							isLoadingIndustries={isLoadingIndustries}
							selectedIndustry={formData.selectedIndustry}
							onIndustrySelect={handleIndustrySelect}
						/>
					)}

					{/* Step 2: Technology Selection */}
					{currentStep === 2 && (
						<CreateSolutionStep2
							clientData={clientData}
							availableTechnologies={availableTechnologies}
							isLoadingTechnologies={isLoadingTechnologies}
							selectedTechnology={formData.selectedTechnology}
							selectedIndustryId={formData.selectedIndustry}
							onTechnologySelect={handleTechnologySelect}
						/>
					)}

					{/* Step 3: Solution Type, Variant, and Details */}
					{currentStep === 3 && (
						<CreateSolutionStep3
							formData={{
								solutionName: formData.solutionName,
								solutionDescription: formData.solutionDescription,
								solutionIcon: formData.solutionIcon,
								selectedSolutionId: formData.selectedSolutionId,
								selectedSolutionVariantId: formData.selectedSolutionVariantId,
								newVariantName: formData.newVariantName,
								newVariantDescription: formData.newVariantDescription,
								newVariantIcon: formData.newVariantIcon,
							}}
							availableSolutionTypes={availableSolutionTypes}
							isLoadingSolutionTypes={isLoadingSolutionTypes}
							availableSolutionVariants={availableSolutionVariants}
							isLoadingSolutionVariants={isLoadingSolutionVariants}
							isCreatingNewSolution={isCreatingNewSolution}
							isCreatingNewVariant={isCreatingNewVariant}
							onFormDataChange={handleFormDataChange}
							onSolutionTypeSelect={handleSolutionTypeSelect}
							onSolutionVariantSelect={handleSolutionVariantSelect}
							onCreateNewSolution={handleCreateNewSolution}
							onCreateNewVariant={handleCreateNewVariant}
							onNoVariantSelect={handleNoVariantSelect}
							getSelectedIndustryName={getSelectedIndustryName}
							getSelectedTechnologyName={getSelectedTechnologyName}
							getSelectedSolutionType={getSelectedSolutionType}
							getSelectedSolutionVariant={getSelectedSolutionVariant}
						/>
					)}

					{/* Step 4: Parameters Configuration */}
					{currentStep === 4 && (
						<ParametersConfiguration
							parameters={formData.parameters}
							onParametersChange={handleParametersChange}
							customCategories={customCategories}
							setCustomCategories={setCustomCategories}
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

					{/* Step 6: Review and Submit */}
					{currentStep === 6 && (
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

						{currentStep < 6 ? (
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
