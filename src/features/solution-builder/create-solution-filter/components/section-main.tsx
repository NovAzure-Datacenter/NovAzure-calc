import { StepContentStep1Props } from "../../types/types";
import React from "react";
import IndustrySection from "./sections/industry-section";
import TechnologySection from "./sections/technology-section";
import SolutionSection from "./sections/solution-section";
import VariantSection from "./sections/variant-section";
import SelectionCard from "./sections/selection-card";

/**
 * StepContent component - Renders the main step content with industry, technology, and solution selection
 */
export default function SectionMain(props: StepContentStep1Props) {
	const {
		clientData,
		availableIndustries,
		availableTechnologies,
		availableSolutionTypes,
		isLoadingIndustries,
		isLoadingTechnologies,
		isLoadingSolutionTypes,
		selectedIndustry,
		selectedTechnology,
		selectedSolutionId,
		selectedSolutionVariantId,
		onIndustrySelect,
		onTechnologySelect,
		onSolutionTypeSelect,
		onSolutionVariantSelect,
		onFormDataChange,
		handleCreateNewSolution,
		onAddSolutionVariant,
		formData,
		isCreatingNewSolution,
		isCreatingNewVariant,
		existingSolutions,
		isLoadingExistingSolutions,
		openAccordion,
		setOpenAccordion,
		handleCreateNewVariant,
		onAddNewlyCreatedSolution,
		onAddNewlyCreatedVariant,
		newlyCreatedVariants,
		newlyCreatedSolutions,
	} = props;

	/**
	 * Get client's selected industries and technologies
	 */
	const clientSelectedIndustries = clientData?.selected_industries || [];
	const clientSelectedTechnologies = clientData?.selected_technologies || [];

	/**
	 * Filter technologies based on selected industry
	 */
	const technologiesForSelectedIndustry = availableTechnologies.filter(
		(technology) => {
			if (!selectedIndustry) return true;
			const applicableIndustries = technology.applicableIndustries || [];
			return applicableIndustries.includes(selectedIndustry);
		}
	);

	/**
	 * Get other industries (excluding client's selected ones)
	 */
	const otherIndustries = availableIndustries.filter(
		(industry) => !clientSelectedIndustries.includes(industry.id)
	);

	/**
	 * Get other technologies (excluding client's selected ones and filtered by industry)
	 */
	const otherTechnologies = technologiesForSelectedIndustry.filter(
		(technology) => !clientSelectedTechnologies.includes(technology.id)
	);

	/**
	 * Progressive filtering logic
	 */
	const canSelectTechnology = !!selectedIndustry;
	const canSelectSolution = !!selectedIndustry && !!selectedTechnology;

	/**
	 * Get selected items for display
	 */
	const getSelectedIndustry = () =>
		availableIndustries.find((i) => i.id === selectedIndustry);
	const getSelectedTechnology = () =>
		availableTechnologies.find((t) => t.id === selectedTechnology);
	const getSelectedSolutionCategory = () =>
		availableSolutionTypes.find((s) => s.id === selectedSolutionId);

	/**
	 * Render selection card function that uses the SelectionCard component
	 */
	const renderSelectionCard = (
		item: any,
		itemId: string,
		isSelected: boolean,
		onSelect: (id: string) => void,
		showIcon = true
	) => (
		<SelectionCard
			item={item}
			itemId={itemId}
			isSelected={isSelected}
			onSelect={onSelect}
			showIcon={showIcon}
		/>
	);

	return (
		<div className="space-y-6">
			{/* Industry Section */}
			<IndustrySection
				selectedIndustry={selectedIndustry}
				clientSelectedIndustries={clientSelectedIndustries}
				otherIndustries={otherIndustries}
				availableIndustries={availableIndustries}
				isLoadingIndustries={isLoadingIndustries}
				onIndustrySelect={onIndustrySelect}
				openAccordion={openAccordion}
				setOpenAccordion={setOpenAccordion}
				getSelectedIndustry={getSelectedIndustry}
				renderSelectionCard={renderSelectionCard}
			/>

			{/* Technology Section - Only show if industry is selected */}
			{selectedIndustry && (
				<TechnologySection
					selectedTechnology={selectedTechnology}
					clientSelectedTechnologies={clientSelectedTechnologies}
					otherTechnologies={otherTechnologies}
					technologiesForSelectedIndustry={technologiesForSelectedIndustry}
					canSelectTechnology={canSelectTechnology}
					isLoadingTechnologies={isLoadingTechnologies}
					onTechnologySelect={onTechnologySelect}
					getSelectedIndustry={getSelectedIndustry}
					getSelectedTechnology={getSelectedTechnology}
					renderSelectionCard={renderSelectionCard}
				/>
			)}

			{/* Solution Section - Only show if technology is selected */}
			{selectedTechnology && (
				<>
					<SolutionSection
						selectedSolutionId={selectedSolutionId}
						availableSolutionTypes={availableSolutionTypes}
						canSelectSolution={canSelectSolution}
						isLoadingSolutionTypes={isLoadingSolutionTypes}
						isCreatingNewSolution={isCreatingNewSolution}
						onSolutionTypeSelect={onSolutionTypeSelect}
						handleCreateNewSolution={handleCreateNewSolution}
						getSelectedIndustry={getSelectedIndustry}
						getSelectedTechnology={getSelectedTechnology}
						getSelectedSolutionCategory={getSelectedSolutionCategory}
						renderSelectionCard={renderSelectionCard}
						onFormDataChange={onFormDataChange}
						onAddNewlyCreatedSolution={onAddNewlyCreatedSolution}
						newlyCreatedSolutions={newlyCreatedSolutions}
					/>

					{/* Variant Section - Only show if solution is selected */}
					{selectedSolutionId && (
						<VariantSection
							selectedSolutionVariantId={selectedSolutionVariantId}
							selectedSolutionId={selectedSolutionId}
							existingSolutions={existingSolutions}
							isLoadingExistingSolutions={isLoadingExistingSolutions}
							isCreatingNewVariant={isCreatingNewVariant}
							formData={formData}
							onFormDataChange={onFormDataChange}
							handleCreateNewVariant={handleCreateNewVariant}
							onSolutionVariantSelect={onSolutionVariantSelect}
							onAddSolutionVariant={onAddSolutionVariant}
							onAddNewlyCreatedVariant={onAddNewlyCreatedVariant}
							newlyCreatedVariants={newlyCreatedVariants}
							renderSelectionCard={renderSelectionCard}
						/>
					)}
				</>
			)}
		</div>
	);
}
