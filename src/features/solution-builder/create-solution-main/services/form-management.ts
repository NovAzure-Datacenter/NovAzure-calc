import React from "react";
import { CreateSolutionData } from "../../types/types";

/**
 * Form Management Service
 * Handles form state changes and data management
 */

/**
 * Handle industry selection change
 */
export function handleIndustrySelect(
	formData: CreateSolutionData,
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>,
	clearOptions: () => void
) {
	setFormData((prev) => ({
		...prev,
		industry: formData.industry,
		technology: "",
		solution: "",
		solution_variant: "",
		solution_name: "",
		solution_description: "",
		solution_icon: "",
		solution_variant_name: "",
		solution_variant_description: "",
		solution_variant_icon: "",
		solution_variant_product_badge: false,
	}));

	clearOptions();
}

/**
 * Handle technology selection change
 */
export function handleTechnologySelect(
	technologyId: string,
	formData: CreateSolutionData,
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>,
	clearOptions: () => void,
	loadSolutionTypes: (industryId: string, technologyId: string) => void
) {
	setFormData((prev) => ({
		...prev,
		technology: technologyId,
		solution: "",
		solution_variant: "",
		solution_name: "",
		solution_description: "",
		solution_icon: "",
		solution_variant_name: "",
		solution_variant_description: "",
		solution_variant_icon: "",
		solution_variant_product_badge: false,
	}));

	clearOptions();

	// Load solution types if we have both industry and technology
	if (formData.industry && technologyId) {
		loadSolutionTypes(formData.industry, technologyId);
	}
}

/**
 * Handle solution type selection change
 */
export function handleSolutionTypeSelect(
	solutionId: string,
	solutionData: any,
	formData: CreateSolutionData,
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>,
	setIsCreatingNewSolution: React.Dispatch<React.SetStateAction<boolean>>,
	setIsCreatingNewVariant: React.Dispatch<React.SetStateAction<boolean>>,
	setIsExistingSolutionLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	setExistingSolutionId: React.Dispatch<React.SetStateAction<string | null>>,
	loadSolutionVariants: (solutionId: string) => void
) {
	setFormData((prev) => ({
		...prev,
		solution: solutionId,
		solution_name: solutionData?.solution_name || "",
		solution_description: solutionData?.solution_description || "",
		solution_icon: solutionData?.solution_icon || "",
	}));

	// Determine if this is an existing solution or a new one
	const isExistingSolution = solutionId && 
		solutionId !== "new" && 
		!solutionId.startsWith("new-solution-") && 
		solutionId.length === 24; // MongoDB ObjectId length

	if (isExistingSolution) {
		// This is an existing solution - set flags for updating
		setIsCreatingNewSolution(false);
		setIsCreatingNewVariant(false);
		setIsExistingSolutionLoaded(true);
		setExistingSolutionId(solutionId);
	} else {
		// This is a new solution or no solution selected
		setIsCreatingNewSolution(false);
		setIsCreatingNewVariant(false);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	}

	if (solutionId) {
		loadSolutionVariants(solutionId);
	}
}

/**
 * Handle solution variant selection change
 */
export function handleSolutionVariantSelect(
	variantId: string,
	variantData: any,
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>,
	setIsCreatingNewVariant: React.Dispatch<React.SetStateAction<boolean>>,
	setIsExistingSolutionLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	setExistingSolutionId: React.Dispatch<React.SetStateAction<string | null>>
) {
	let variantName = "";
	let variantDescription = "";
	let variantIcon = "";
	let variantProductBadge = false;

	if (variantData) {
		// Try to extract variant information from various possible property names
		// Priority order: solution_variant_* > variant_* > solution_* > direct properties
		if (variantData.solution_variant_name !== undefined) {
			variantName = variantData.solution_variant_name || "";
			variantDescription = variantData.solution_variant_description || "";
			variantIcon = variantData.solution_variant_icon || "";
			variantProductBadge = variantData.solution_variant_product_badge || false;
		} else if (variantData.variant_name !== undefined) {
			variantName = variantData.variant_name || "";
			variantDescription = variantData.variant_description || "";
			variantIcon = variantData.variant_icon || "";
			variantProductBadge = variantData.variant_product_badge || false;
		} else if (variantData.solution_name !== undefined) {
			variantName = variantData.solution_name || "";
			variantDescription = variantData.solution_description || "";
			variantIcon = variantData.solution_icon || "";
			variantProductBadge = variantData.product_badge || false;
		} else if (variantData.name !== undefined) {
			variantName = variantData.name || "";
			variantDescription = variantData.description || "";
			variantIcon = variantData.icon || "";
			variantProductBadge = variantData.product_badge || false;
		}

		// If we still don't have the data, try to extract from the variantData object structure
		if (!variantName && variantData.variant) {
			const variant = variantData.variant;
			variantName =
				variant.name ||
				variant.solution_variant_name ||
				variant.variant_name ||
				"";
			variantDescription =
				variant.description ||
				variant.solution_variant_description ||
				variant.variant_description ||
				"";
			variantIcon =
				variant.icon ||
				variant.solution_variant_icon ||
				variant.variant_icon ||
				"";
			variantProductBadge =
				variant.product_badge ||
				variant.solution_variant_product_badge ||
				variant.variant_product_badge ||
				false;
		}
	}

	setFormData((prev) => {
		const newFormData = {
			...prev,
			solution_variant: variantId,
			solution_variant_name: variantName,
			solution_variant_description: variantDescription,
			solution_variant_icon: variantIcon,
			solution_variant_product_badge: variantProductBadge,
			// Copy parameters and calculations from the selected variant if available
			parameters: variantData?.parameters || prev.parameters || [],
			calculations: variantData?.calculations || prev.calculations || [],
			categories: variantData?.categories || prev.categories || [],
		};

		return newFormData;
	});

	// Determine if this is an existing variant or a new one
	const isExistingVariant = variantId && 
		variantId !== "new" && 
		!variantId.startsWith("new-variant-") && 
		variantId.length === 24; // MongoDB ObjectId length


	if (isExistingVariant) {

		setIsCreatingNewVariant(false);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	} else {

		setIsCreatingNewVariant(false);
		setIsExistingSolutionLoaded(false);
		setExistingSolutionId(null);
	}
}

/**
 * Handle creation mode changes
 */
export function handleCreateNewSolution(
	setIsCreatingNewSolution: React.Dispatch<React.SetStateAction<boolean>>,
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>,
	setAvailableSolutionVariants: React.Dispatch<React.SetStateAction<any[]>>,
	setIsExistingSolutionLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	setExistingSolutionId: React.Dispatch<React.SetStateAction<string | null>>
) {
	setIsCreatingNewSolution(true);

	setAvailableSolutionVariants([]);
	setIsExistingSolutionLoaded(false);
	setExistingSolutionId(null);
}

export function handleCreateNewVariant(
	setIsCreatingNewVariant: React.Dispatch<React.SetStateAction<boolean>>,
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>,
	setIsExistingSolutionLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	setExistingSolutionId: React.Dispatch<React.SetStateAction<string | null>>
) {
	setIsCreatingNewVariant(true);

	setIsExistingSolutionLoaded(false);
	setExistingSolutionId(null);
}

export function handleNoVariantSelect(
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>,
	setIsCreatingNewVariant: React.Dispatch<React.SetStateAction<boolean>>,
	setIsExistingSolutionLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	setExistingSolutionId: React.Dispatch<React.SetStateAction<string | null>>
) {
	setFormData((prev) => ({ ...prev, solution_variant: "" }));
	setIsCreatingNewVariant(false);
	setFormData((prev) => ({
		...prev,
		solution_variant_name: "",
		solution_variant_description: "",
		solution_variant_icon: "",
		solution_variant_product_badge: false,
	}));
	setIsExistingSolutionLoaded(false);
	setExistingSolutionId(null);
}

/**
 * Handle form data changes
 */
export function handleFormDataChange(
	updates: Partial<CreateSolutionData>,
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>
) {
	setFormData((prev) => {
		const newData = { ...prev, ...updates };
		return newData;
	});
}

/**
 * Handle parameters change
 */
export function handleParametersChange(
	parameters: any[],
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>
) {
	setFormData((prev) => ({ ...prev, parameters }));
}

/**
 * Handle calculations change
 */
export function handleCalculationsChange(
	calculations: any[],
	setFormData: React.Dispatch<React.SetStateAction<CreateSolutionData>>
) {
	setFormData((prev) => ({ ...prev, calculations }));
}
