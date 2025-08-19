import React from "react";

/**
 * Get selected industry name from available industries
 */
export function getSelectedIndustryName(
	availableIndustries: any[],
	selectedIndustryId: string
): string {
	const industry = availableIndustries.find((i) => i.id === selectedIndustryId);
	return industry?.name || "Not selected";
}

/**
 * Get selected technology name from available technologies
 */
export function getSelectedTechnologyName(
	availableTechnologies: any[],
	selectedTechnologyId: string
): string {
	const technology = availableTechnologies.find(
		(t) => t.id === selectedTechnologyId
	);
	return technology?.name || "Not selected";
}

/**
 * Get selected solution type from available solution types
 */
export function getSelectedSolutionType(
	availableSolutionTypes: any[],
	selectedSolutionId: string
): any {
	return availableSolutionTypes.find((s) => s.id === selectedSolutionId);
}

/**
 * Get selected solution variant from available solution variants
 */
export function getSelectedSolutionVariant(
	availableSolutionVariants: any[],
	selectedVariantId: string
): any {
	return availableSolutionVariants.find((v) => v.id === selectedVariantId);
}

/**
 * Clear available options when selections change
 */
export function clearAvailableOptions(
	setAvailableSolutionTypes: React.Dispatch<React.SetStateAction<any[]>>,
	setAvailableSolutionVariants: React.Dispatch<React.SetStateAction<any[]>>,
	setIsExistingSolutionLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	setExistingSolutionId: React.Dispatch<React.SetStateAction<string | null>>,
	setNewlyCreatedSolutions: React.Dispatch<React.SetStateAction<any[]>>,
	setNewlyCreatedVariants: React.Dispatch<React.SetStateAction<any[]>>
) {
	setAvailableSolutionTypes([]);
	setAvailableSolutionVariants([]);
	setIsExistingSolutionLoaded(false);
	setExistingSolutionId(null);
	setNewlyCreatedSolutions([]);
	setNewlyCreatedVariants([]);
}

/**
 * Clear solution variant options when solution type changes
 */
export function clearSolutionVariantOptions(
	setAvailableSolutionVariants: React.Dispatch<React.SetStateAction<any[]>>,
	setIsExistingSolutionLoaded: React.Dispatch<React.SetStateAction<boolean>>,
	setExistingSolutionId: React.Dispatch<React.SetStateAction<string | null>>,
	setNewlyCreatedVariants: React.Dispatch<React.SetStateAction<any[]>>
) {
	setAvailableSolutionVariants([]);
	setIsExistingSolutionLoaded(false);
	setExistingSolutionId(null);
	setNewlyCreatedVariants([]);
}

/**
 * Handle adding newly created solutions to persistent lists
 */
export function handleAddNewlyCreatedSolution(
	setNewlyCreatedSolutions: React.Dispatch<React.SetStateAction<any[]>>,
	newSolution: any
) {
	setNewlyCreatedSolutions((prev) => [...prev, newSolution]);
}

/**
 * Handle adding newly created variants to persistent lists
 */
export function handleAddNewlyCreatedVariant(
	setNewlyCreatedVariants: React.Dispatch<React.SetStateAction<any[]>>,
	newVariant: any
) {
	setNewlyCreatedVariants((prev) => [...prev, newVariant]);
}

/**
 * Handle adding solution variants to available options
 */
export function handleAddSolutionVariant(
	setAvailableSolutionVariants: React.Dispatch<React.SetStateAction<any[]>>,
	newVariant: any
) {
	setAvailableSolutionVariants((prev) => [...prev, newVariant]);
}
