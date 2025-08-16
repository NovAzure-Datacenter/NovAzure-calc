"use client";

import React from "react";

import CategoryTabs from "./category-tabs";
import TableContent from "./table-content";
import {
	getLevelColor,
	getCategoryTailwindClasses,
} from "@/utils/color-utils";
import { LoadingIndicator, SearchBar } from "./components/common";
import { 
	ConfirmCategoryRemovalDialog, 
	ConfirmParameterRemovalDialog, 
	PreviewDialog 
} from "./components/dialogs";
import { getSortedCategories, getFilteredParameters } from "./services";
import { useParameterState, useCategoryState, useUIState, useGlobalParameters } from "./hooks";
import { CreateSolutionParametersProps } from "@/features/solution-builder/types/types";

/**
 * CreateSolutionParameters component - Main component for managing solution parameters
 * Provides a comprehensive interface for creating, editing, and organizing parameters
 * Handles parameter validation, category management, and parameter filtering
 */
export function ParameterMain({
	parameters,
	onParametersChange,
	customCategories,
	setCustomCategories,
	selectedIndustry,
	selectedTechnology,
	selectedSolutionId,
	availableIndustries = [],
	availableTechnologies = [],
	availableSolutionTypes = [],
	isLoadingParameters = false,
	usedParameterIds = [],
}: CreateSolutionParametersProps) {
	const uiState = useUIState();
	const { activeTab, setActiveTab, searchQuery, setSearchQuery, isPreviewDialogOpen, setIsPreviewDialogOpen, columnVisibility, setColumnVisibility } = uiState;
	
	const parameterState = useParameterState({
		parameters,
		onParametersChange,
		customCategories,
		activeTab,
	});
	
	const categoryState = useCategoryState({
		parameters,
		onParametersChange,
		customCategories,
		setCustomCategories,
		activeTab,
		setActiveTab,
	});
	
	useGlobalParameters({ parameters, onParametersChange });



	const getCategoryColor = (categoryName: string) => {
		return getCategoryTailwindClasses(
			categoryName,
			parameters,
			customCategories
		);
	};

	const allCategories = getSortedCategories(parameters, customCategories);
	const filteredParameters = getFilteredParameters(
		parameters,
		activeTab,
		searchQuery
	);

	return (
		<div className="flex flex-col h-full">
			<CategoryTabs
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				allCategories={allCategories}
				handleRemoveCategory={categoryState.handleRemoveCategory}
				setIsAddCategoryDialogOpen={categoryState.setIsAddCategoryDialogOpen}
				newCategoryData={categoryState.newCategoryData}
				setNewCategoryData={categoryState.setNewCategoryData}
				handleAddCategory={categoryState.handleAddCategory}
				isAddCategoryDialogOpen={categoryState.isAddCategoryDialogOpen}
				handleAddParameter={parameterState.handleAddParameter}
				handleCancelAddParameter={parameterState.handleCancelAddParameter}
				isAddingParameter={parameterState.isAddingParameter}
				editingParameter={parameterState.editingParameter}
				parameters={parameters}
				customCategories={customCategories}
				setIsPreviewDialogOpen={setIsPreviewDialogOpen}
				columnVisibility={columnVisibility}
				setColumnVisibility={setColumnVisibility}
			/>

			<ConfirmCategoryRemovalDialog
				isConfirmDialogOpen={categoryState.isConfirmDialogOpen}
				setIsConfirmDialogOpen={categoryState.setIsConfirmDialogOpen}
				confirmCategory={categoryState.confirmCategory || ""}
				handleConfirmRemoveCategory={categoryState.handleConfirmRemoveCategory}
				parameters={parameters}
			/>

			<ConfirmParameterRemovalDialog
				isConfirmDialogOpen={parameterState.isParameterConfirmDialogOpen}
				setIsConfirmDialogOpen={parameterState.setIsParameterConfirmDialogOpen}
				confirmParameter={parameterState.confirmParameter || ""}
				handleConfirmRemoveParameter={parameterState.handleConfirmRemoveParameter}
				parameters={parameters}
			/>

			{activeTab !== "add-new-category" && (
				<>
					<LoadingIndicator 
						isLoading={isLoadingParameters} 
						message="Loading existing solution parameters..."
					/>
					<SearchBar
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						filteredParameters={filteredParameters}
					/>
					<TableContent
						filteredParameters={filteredParameters}
						editingParameter={parameterState.editingParameter}
						editData={parameterState.editData}
						setEditData={parameterState.setEditData}
						handleEditParameter={parameterState.handleEditParameter}
						handleSaveParameter={parameterState.handleSaveParameter}
						handleCancelEdit={parameterState.handleCancelEdit}
						handleDeleteParameter={parameterState.handleDeleteParameter}
						getLevelColor={getLevelColor}
						getCategoryColor={getCategoryColor}
						isAddingParameter={parameterState.isAddingParameter}
						newParameterData={parameterState.newParameterData}
						setNewParameterData={parameterState.setNewParameterData}
						handleSaveNewParameter={parameterState.handleSaveNewParameter}
						handleCancelAddParameter={parameterState.handleCancelAddParameter}
						handleAddParameter={parameterState.handleAddParameter}
						customCategories={customCategories}
						searchQuery={searchQuery}
						parameters={parameters}
						activeTab={activeTab}
						columnVisibility={columnVisibility}
						setColumnVisibility={setColumnVisibility}
						usedParameterIds={usedParameterIds}
					/>
				</>
			)}

			<PreviewDialog
				isOpen={isPreviewDialogOpen}
				onOpenChange={setIsPreviewDialogOpen}
				parameters={parameters}
				selectedIndustry={selectedIndustry}
				selectedTechnology={selectedTechnology}
				selectedSolutionId={selectedSolutionId}
				availableIndustries={availableIndustries}
				availableTechnologies={availableTechnologies}
				availableSolutionTypes={availableSolutionTypes}
			/>
		</div>
	);
}




