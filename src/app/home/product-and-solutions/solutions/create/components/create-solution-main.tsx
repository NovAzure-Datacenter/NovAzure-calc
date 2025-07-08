"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { getClientByUserId } from "@/lib/actions/client/client";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { createSolution } from "@/lib/actions/solution/solution";
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
	defaultParameters,
	defaultCalculations,
	solutionTypes,
	type Parameter,
	type Calculation,
	type SolutionType,
	type SolutionVariant,
} from "../../../mock-data";
import { ParametersConfiguration } from "./create-solution-parameters";
import { CalculationsConfiguration } from "./create-solution-calculations";
import { CreateSolutionProgress } from "./create-solution-progress";
import { CreateSolutionStep1 } from "./create-solution-step-1";
import { CreateSolutionStep2 } from "./create-solution-step-2";
import { CreateSolutionStep3 } from "./create-solution-step-3";
import { CreateSolutionStep6 } from "./create-solution-step-6";
import { SubmissionDialog } from "../../components/submission-dialog";
import { DraftDialog } from "../../components/draft-dialog";
import Loading from "@/components/loading-main";

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
	};

	const handleTechnologySelect = (technologyId: string) => {
		setFormData((prev) => ({ ...prev, selectedTechnology: technologyId }));
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

			// Prepare data for MongoDB (convert to snake_case)
			const solutionData = {
				selected_industry: formData.selectedIndustry,
				selected_technology: formData.selectedTechnology,
				solution_type: formData.solutionType,
				solution_variant: formData.solutionVariant,
				solution_name: formData.solutionName,
				solution_description: formData.solutionDescription,
				custom_solution_type: formData.customSolutionType,
				custom_solution_variant: formData.customSolutionVariant,
				parameters: formData.parameters,
				calculations: formData.calculations,
				status: "draft" as const,
				created_by: user?._id || "",
				client_id: clientData?.id || "",
			};

			// Save to MongoDB
			const result = await createSolution(solutionData);

			if (result.error) {
				setDraftStatus("error");
				setDraftMessage(result.error);
				setShowDraftDialog(true);
				return;
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
			console.error("Error saving draft:", error);
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

			// Prepare data for MongoDB (convert to snake_case)
			const solutionData = {
				selected_industry: formData.selectedIndustry,
				selected_technology: formData.selectedTechnology,
				solution_type: formData.solutionType,
				solution_variant: formData.solutionVariant,
				solution_name: formData.solutionName,
				solution_description: formData.solutionDescription,
				custom_solution_type: formData.customSolutionType,
				custom_solution_variant: formData.customSolutionVariant,
				parameters: formData.parameters,
				calculations: formData.calculations,
				status: "pending" as const,
				created_by: user?._id || "",
				client_id: clientData?.id || "",
			};

			// Save to MongoDB
			const result = await createSolution(solutionData);

			if (result.error) {
				setSubmissionStatus("error");
				setSubmissionMessage(result.error);
				setShowSubmissionDialog(true);
				return;
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
			console.error("Error submitting for review:", error);
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
		return solutionTypes.find((st) => st.id === formData.solutionType);
	};

	const getSelectedSolutionVariant = () => {
		const solutionType = getSelectedSolutionType();
		return solutionType?.variants.find(
			(v) => v.id === formData.solutionVariant
		);
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
				return (
					!formData.solutionType ||
					!formData.solutionName ||
					!formData.solutionDescription
				);
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
					<CardDescription className="text-sm">
						{getStepDescription()}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 overflow-y-auto">
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
							onTechnologySelect={handleTechnologySelect}
						/>
					)}

					{/* Step 3: Solution Type, Variant, and Details */}
					{currentStep === 3 && (
						<CreateSolutionStep3
							formData={{
								solutionName: formData.solutionName,
								solutionDescription: formData.solutionDescription,
								solutionType: formData.solutionType,
								solutionVariant: formData.solutionVariant,
								customSolutionType: formData.customSolutionType,
								customSolutionVariant: formData.customSolutionVariant,
							}}
							showCustomSolutionType={showCustomSolutionType}
							showCustomSolutionVariant={showCustomSolutionVariant}
							onFormDataChange={handleFormDataChange}
							onShowCustomSolutionTypeChange={setShowCustomSolutionType}
							onShowCustomSolutionVariantChange={setShowCustomSolutionVariant}
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
								parameters: formData.parameters,
								calculations: formData.calculations,
							}}
							showCustomSolutionType={showCustomSolutionType}
							showCustomSolutionVariant={showCustomSolutionVariant}
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
