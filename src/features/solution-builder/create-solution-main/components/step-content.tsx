import { CalculationMain } from "../../components/create-solution-calculations/calculation-main";
import ValueMain from "../../components/create-solution-valuebuilder/value-main";
import { CreateSolutionFilter } from "../../create-solution-filter/create-solution-filter";
import { ParameterMain } from "../../create-solution-parameters/parameter-main";
import { CreateSolutionSubmit } from "../../create-solution-submit";
import { StepContentProps } from "../../types/types";

/**
 * StepContent component - Renders the appropriate content based on current step
 */
export default function StepContent(props: StepContentProps) {
	const {
		currentStep,
		formData,
		clientData,
		availableIndustries,
		availableTechnologies,
		availableSolutionTypes,
		availableSolutionVariants,
		newlyCreatedSolutions,
		newlyCreatedVariants,
		isLoadingIndustries,
		isLoadingTechnologies,
		isLoadingSolutionTypes,
		isLoadingSolutionVariants,
		isLoadingParameters,
		isLoadingCalculations,
		isCreatingNewSolution,
		isCreatingNewVariant,
		isSubmitting,
		onIndustrySelect,
		onTechnologySelect,
		onSolutionTypeSelect,
		onSolutionVariantSelect,
		onFormDataChange,
		onCreateNewSolution,
		onCreateNewVariant,
		onNoVariantSelect,
		onAddSolutionVariant,
		onAddNewlyCreatedSolution,
		onAddNewlyCreatedVariant,
		onParametersChange,
		onCalculationsChange,
		onSaveAsDraft,
		onSubmitForReview,
		getSelectedIndustryName,
		getSelectedTechnologyName,
		getSelectedSolutionType,
		getSelectedSolutionVariant,
		isExistingSolutionLoaded,
		customParameterCategories,
		setCustomParameterCategories,
		customCalculationCategories,
		setCustomCalculationCategories,
		handleSolutionTypeSelectLocal,
	} = props;

	// Extract used parameter IDs from calculations and nested parameters
	const extractUsedParameterIds = () => {
		const usedIds = new Set<string>();

		// Test case: if no calculations, return empty array
		if (formData.calculations.length === 0) {
			return [];
		}

		// Helper function to extract parameter names from a formula
		const extractParameterNamesFromFormula = (formula: string): string[] => {
			// Updated regex to capture parameter names with spaces and numbers
			const parameterMatches = formula.match(/[a-zA-Z_][a-zA-Z0-9_\s]*/g) || [];
			return parameterMatches.filter((match) => {
				// Skip common mathematical functions and constants
				const skipWords = [
					"Math",
					"sin",
					"cos",
					"tan",
					"log",
					"exp",
					"sqrt",
					"abs",
					"round",
					"floor",
					"ceil",
					"max",
					"min",
					"pi",
					"e",
					"self",
					"this",
					"conditional",
				];
				return !skipWords.includes(match);
			});
		};

		// Helper function to find ALL parameters by name (case-insensitive search)
		const findAllParametersByName = (name: string) => {
			return formData.parameters.filter((param) => {
				const paramName = param.name.toLowerCase();
				const searchName = name.toLowerCase();

				// Direct match
				if (paramName === searchName) return true;

				// Cleaned name match (remove special characters but keep spaces)
				const cleanedParamName = paramName.replace(/[^a-zA-Z0-9_\s]/g, "");
				const cleanedSearchName = searchName.replace(/[^a-zA-Z0-9_\s]/g, "");
				if (cleanedParamName === cleanedSearchName) return true;

				// Handle spaces and underscores
				const normalizedParamName = paramName.replace(/[\s_]+/g, "_");
				const normalizedSearchName = searchName.replace(/[\s_]+/g, "_");
				if (normalizedParamName === normalizedSearchName) return true;

				// Trim whitespace and compare
				if (paramName.trim() === searchName.trim()) return true;

				return false;
			});
		};

		// Helper function to find ALL parameters by partial match
		const findAllParametersByPartialMatch = (name: string) => {
			return formData.parameters.filter((param) => {
				const paramName = param.name.toLowerCase();
				const searchName = name.toLowerCase();

				// Direct contains match
				if (paramName.includes(searchName) || searchName.includes(paramName))
					return true;

				// Cleaned name contains match (keep spaces)
				const cleanedParamName = paramName.replace(/[^a-zA-Z0-9_\s]/g, "");
				const cleanedSearchName = searchName.replace(/[^a-zA-Z0-9_\s]/g, "");
				if (
					cleanedParamName.includes(cleanedSearchName) ||
					cleanedSearchName.includes(cleanedParamName)
				)
					return true;

				// Normalized contains match
				const normalizedParamName = paramName.replace(/[\s_]+/g, "_");
				const normalizedSearchName = searchName.replace(/[\s_]+/g, "_");
				if (
					normalizedParamName.includes(normalizedSearchName) ||
					normalizedSearchName.includes(normalizedParamName)
				)
					return true;

				// Trim whitespace and compare
				if (
					paramName.trim().includes(searchName.trim()) ||
					searchName.trim().includes(paramName.trim())
				)
					return true;

				return false;
			});
		};

		// Extract parameter names from all calculation formulas
		formData.calculations.forEach((calculation) => {
			const parameterNames = extractParameterNamesFromFormula(
				calculation.formula
			);

			parameterNames.forEach((name) => {
				const matchingParameters = findAllParametersByName(name);
				const partialMatchingParameters = findAllParametersByPartialMatch(name);

				// Combine all matching parameters and remove duplicates
				const allMatchingParameters = [
					...matchingParameters,
					...partialMatchingParameters,
				];
				const uniqueMatchingParameters = allMatchingParameters.filter(
					(param, index, arr) =>
						arr.findIndex((p) => p.id === param.id) === index
				);

				// Mark all matching parameters as used
				uniqueMatchingParameters.forEach((matchingParameter) => {
					usedIds.add(matchingParameter.id);
				});
			});
		});

		// NEW: Mark filter parameters as used if they provide values to conditional parameters
		formData.parameters.forEach((filterParameter) => {
			if (
				filterParameter.display_type === "filter" &&
				filterParameter.dropdown_options &&
				Array.isArray(filterParameter.dropdown_options)
			) {
				// Check if any conditional parameter uses values from this filter
				const isUsedInConditional = formData.parameters.some(
					(conditionalParam) => {
						if (
							conditionalParam.display_type === "conditional" &&
							conditionalParam.conditional_rules &&
							Array.isArray(conditionalParam.conditional_rules)
						) {
							return conditionalParam.conditional_rules.some((rule) => {
								// Check if the rule's condition or value matches any of the filter's dropdown options
								return filterParameter.dropdown_options!.some(
									(filterOption) => {
										const filterValue = filterOption.value || filterOption.key;
										return (
											rule.condition === filterValue ||
											rule.value === filterValue
										);
									}
								);
							});
						}
						return false;
					}
				);

				if (isUsedInConditional) {
					usedIds.add(filterParameter.id);
				}
			}
		});

		// NEW: Mark conditional parameters as used when they are added to calculations
		// Since conditional parameters don't have formulas but are still part of the solution
		formData.parameters.forEach((parameter) => {
			if (parameter.display_type === "conditional") {
				// Mark conditional parameters as used since they're part of the solution
				usedIds.add(parameter.id);
			}
		});

		return Array.from(usedIds);
	};

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
					newlyCreatedSolutions={newlyCreatedSolutions}
					newlyCreatedVariants={newlyCreatedVariants}
					isLoadingIndustries={isLoadingIndustries}
					isLoadingTechnologies={isLoadingTechnologies}
					isLoadingSolutionTypes={isLoadingSolutionTypes}
					isLoadingSolutionVariants={isLoadingSolutionVariants}
					selectedIndustry={formData.industry}
					selectedTechnology={formData.technology}
					selectedSolutionId={formData.solution}
					selectedSolutionVariantId={formData.solution_variant}
					onIndustrySelect={onIndustrySelect}
					onTechnologySelect={onTechnologySelect}
					onSolutionTypeSelect={onSolutionTypeSelect}
					onSolutionVariantSelect={onSolutionVariantSelect}
					onFormDataChange={onFormDataChange}
					onCreateNewSolution={onCreateNewSolution}
					onCreateNewVariant={onCreateNewVariant}
					onNoVariantSelect={onNoVariantSelect}
					onAddSolutionVariant={onAddSolutionVariant}
					onAddNewlyCreatedSolution={onAddNewlyCreatedSolution}
					onAddNewlyCreatedVariant={onAddNewlyCreatedVariant}
					formData={{
						solution_name: formData.solution_name,
						solution_description: formData.solution_description,
						solution_icon: formData.solution_icon,
						solution_variant_name: formData.solution_variant_name,
						solution_variant_description: formData.solution_variant_description,
						solution_variant_icon: formData.solution_variant_icon,
						solution_variant_product_badge:
							formData.solution_variant_product_badge,
					}}
					isCreatingNewSolution={isCreatingNewSolution}
					isCreatingNewVariant={isCreatingNewVariant}
					handleSolutionTypeSelectLocal={handleSolutionTypeSelectLocal}
				/>
			)}

			{/* Step 2: Parameters Configuration */}
			{currentStep === 2 && (
				<ParameterMain
					parameters={formData.parameters}
					onParametersChange={onParametersChange}
					customCategories={customParameterCategories}
					setCustomCategories={setCustomParameterCategories}
					selectedIndustry={formData.industry}
					selectedTechnology={formData.technology}
					selectedSolutionId={formData.solution}
					selectedSolutionVariantId={formData.solution_variant}
					availableIndustries={availableIndustries}
					availableTechnologies={availableTechnologies}
					availableSolutionTypes={availableSolutionTypes}
					isLoadingParameters={isLoadingParameters}
					usedParameterIds={extractUsedParameterIds()}
				/>
			)}

			{/* Step 3: Calculations Configuration */}
			{currentStep === 3 && (
				<CalculationMain
					calculations={formData.calculations}
					onCalculationsChange={onCalculationsChange}
					parameters={formData.parameters}
					onParametersChange={onParametersChange}
					selectedIndustry={formData.industry}
					selectedTechnology={formData.technology}
					selectedSolutionId={formData.solution}
					selectedSolutionVariantId={formData.solution_variant}
					availableIndustries={availableIndustries}
					availableTechnologies={availableTechnologies}
					availableSolutionTypes={availableSolutionTypes}
					customCategories={customCalculationCategories}
					setCustomCategories={setCustomCalculationCategories}
					isLoadingCalculations={isLoadingCalculations}
				/>
			)}

			{/* Step 4: Value Configuration */}
			{currentStep === 4 && <ValueMain formData={formData} />}

			{/* Step 5: Review and Submit */}
			{currentStep === 5 && (
				<CreateSolutionSubmit
					formData={{
						solution_name: formData.solution_name,
						solution_description: formData.solution_description,
						solution_variant: formData.solution_variant,
						solution_variant_name: formData.solution_variant_name,
						solution_variant_description: formData.solution_variant_description,
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
					unusedParameterIds={formData.parameters
						.filter((param) => !extractUsedParameterIds().includes(param.id))
						.map((param) => param.id)}
				/>
			)}
		</div>
	);
}
