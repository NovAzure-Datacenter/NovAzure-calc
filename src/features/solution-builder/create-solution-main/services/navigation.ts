import React from "react";
import { CreateSolutionData } from "../../types/types";

/**
 * Get step title based on current step
 */
export function getStepTitle(currentStep: number): string {
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
}

/**
 * Get step description based on current step
 */
export function getStepDescription(currentStep: number): string {
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
}

/**
 * Check if next button should be disabled based on current step and form data
 */
export function isNextDisabled(
	currentStep: number,
	formData: CreateSolutionData,
	isCreatingNewSolution: boolean,
	isCreatingNewVariant: boolean,
	isLoadingParameters: boolean,
	isLoadingCalculations: boolean
): boolean {
	switch (currentStep) {
		case 1:
			const hasIndustry = !!formData.industry;
			const hasTechnology = !!formData.technology;
			const hasSolution = formData.solution || isCreatingNewSolution;

			if (isCreatingNewSolution) {
				return (
					!hasIndustry ||
					!hasTechnology ||
					!formData.solution_name ||
					!formData.solution_description
				);
			}

			const hasSolutionVariant =
				!!formData.solution_variant || isCreatingNewVariant;
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
}

/**
 * Handle next step navigation
 */
export function handleNext(
	currentStep: number,
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
	formData: CreateSolutionData,
	isExistingSolutionLoaded: boolean,
	loadExistingSolutionData: (variantId: string) => void
) {
	if (
		(currentStep === 1 || currentStep === 2) &&
		formData.solution_variant &&
		!isExistingSolutionLoaded &&
		!formData.solution_variant.startsWith("new-variant-") &&
		formData.solution_variant !== "new"
	) {
		loadExistingSolutionData(formData.solution_variant);
	}
	setCurrentStep((prev) => prev + 1);
}

/**
 * Handle previous step navigation
 */
export function handlePrevious(
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>
) {
	setCurrentStep((prev) => prev - 1);
}
