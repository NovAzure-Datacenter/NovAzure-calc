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
	const [existingSolutions, setExistingSolutions] = useState<any[]>([]);
	const [isLoadingExistingSolutions, setIsLoadingExistingSolutions] =
		useState(false);

	/**
	 * Fetch existing solutions that match the current criteria
	 */
	const fetchExistingSolutions = useCallback(async () => {
		if (
			!selectedIndustry ||
			!selectedTechnology ||
			!selectedSolutionId ||
			!clientData?.id
		) {
			setExistingSolutions([]);
			return;
		}

		setIsLoadingExistingSolutions(true);
		try {
			const result = await getClientSolutions(clientData.id);
			if (result.solutions) {
				const matchingSolutions = result.solutions.filter(
					(solution: any) =>
						solution.industry_id === selectedIndustry &&
						solution.technology_id === selectedTechnology &&
						solution.selected_solution_id === selectedSolutionId
				);
				setExistingSolutions(matchingSolutions);
			}
		} catch (error) {
			console.error("Error fetching existing solutions:", error);
			setExistingSolutions([]);
		} finally {
			setIsLoadingExistingSolutions(false);
		}
	}, [
		selectedIndustry,
		selectedTechnology,
		selectedSolutionId,
		clientData?.id,
	]);

	/**
	 * Handle create new variant action
	 */
	const handleCreateNewVariant = () => {
		onFormDataChange({
			newVariantName: "",
			newVariantDescription: "",
			newVariantIcon: "",
		});
	};

	/**
	 * Handle create new solution action
	 */
	const handleCreateNewSolution = () => {
		onFormDataChange({
			solutionName: "",
			solutionDescription: "",
			solutionIcon: "",
		});
	};

	useEffect(() => {
		fetchExistingSolutions();
	}, [
		selectedIndustry,
		selectedTechnology,
		selectedSolutionId,
		clientData?.id,
		fetchExistingSolutions,
	]);

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
				formData={formData}
				isCreatingNewSolution={isCreatingNewSolution}
				isCreatingNewVariant={isCreatingNewVariant}
				existingSolutions={existingSolutions}
				isLoadingExistingSolutions={isLoadingExistingSolutions}
				openAccordion={openAccordion}
				setOpenAccordion={setOpenAccordion}
				handleCreateNewVariant={handleCreateNewVariant}
				handleCreateNewSolution={handleCreateNewSolution}
			/>
		</div>
	);
}
