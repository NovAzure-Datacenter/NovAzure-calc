"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getClientSolutions } from "@/lib/actions/clients-solutions/clients-solutions";
import { CreateSolutionFilterProps } from "@/features/solution-builder/types/types";
import SectionMain from "./components/section-main";

/**
 * CreateSolutionStep1 component - First step of the solution creation process
 * Handles industry, technology, and solution selection with progressive filtering
 * Manages existing solutions display and new variant creation
 */
export function CreateSolutionFilter(props: CreateSolutionFilterProps) {
	const {
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
		selectedIndustry,
		selectedTechnology,
		selectedSolutionId,
		selectedSolutionVariantId,
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
		formData,
		isCreatingNewSolution,
		isCreatingNewVariant,
	} = props;
	const [openAccordion, setOpenAccordion] = useState<string | undefined>(
		undefined
	);

	/**
	 * Handle create new variant action
	 */
	const handleCreateNewVariant = () => {
		onFormDataChange({
			solution_variant_name: formData.solution_variant_name,
			solution_variant_description: formData.solution_variant_description,
			solution_variant_icon: formData.solution_variant_icon,
			solution_variant_product_badge: formData.solution_variant_product_badge,
		});
	};

	/**
	 * Handle create new solution action
	 */
	const handleCreateNewSolution = () => {
		onFormDataChange({
			solution_name: formData.solution_name,
			solution_description: formData.solution_description,
			solution_icon: formData.solution_icon,
		});
	};

	/**
	 * Handle industry selection change - clear dependent selections
	 */
	const handleIndustrySelect = (industryId: string) => {
		onIndustrySelect(industryId);
		if (industryId !== selectedIndustry) {
			onTechnologySelect("");
			onSolutionTypeSelect("");
			onSolutionVariantSelect("");
		}
	};

	return (
		<div className="w-full">
			{/* Current Step Content */}
			<SectionMain
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
				selectedIndustry={selectedIndustry}
				selectedTechnology={selectedTechnology}
				selectedSolutionId={selectedSolutionId}
				selectedSolutionVariantId={selectedSolutionVariantId}
				onIndustrySelect={handleIndustrySelect}
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
				formData={formData}
				isCreatingNewSolution={isCreatingNewSolution}
				isCreatingNewVariant={isCreatingNewVariant}
				openAccordion={openAccordion}
				setOpenAccordion={setOpenAccordion}
				handleCreateNewVariant={handleCreateNewVariant}
				handleCreateNewSolution={handleCreateNewSolution}
				handleSolutionTypeSelectLocal={onSolutionTypeSelect}
			/>
		</div>
	);
}
