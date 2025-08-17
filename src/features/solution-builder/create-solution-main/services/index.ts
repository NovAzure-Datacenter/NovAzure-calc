export {
	loadInitialClientData,
	loadClientSolutionsData,
	loadClientsSolutionVariantsData,
	loadSolutionParametersAndCalculationsData,
} from "./data-loading";
export {
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
} from "./form-management";
export { handleSaveAsDraft, handleSubmitForReview } from "./submission";
export {
	getStepTitle,
	getStepDescription,
	isNextDisabled,
	handleNext,
	handlePrevious,
} from "./navigation";
export {
	getSelectedIndustryName,
	getSelectedTechnologyName,
	getSelectedSolutionType,
	getSelectedSolutionVariant,
	clearAvailableOptions,
	clearSolutionVariantOptions,
	handleAddNewlyCreatedSolution,
	handleAddNewlyCreatedVariant,
	handleAddSolutionVariant,
} from "./helper";
