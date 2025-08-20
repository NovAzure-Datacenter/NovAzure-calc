"use client";

import React, { useState, useEffect } from "react";

import CategoryTabs from "./category-tabs";
import TableContent from "./table-content";
import { getLevelColor, getCategoryTailwindClasses } from "@/utils/color-utils";
import { LoadingIndicator, SearchBar } from "./components/common";
import {
	ConfirmCategoryRemovalDialog,
	ConfirmParameterRemovalDialog,
	PreviewDialog,
} from "./components/dialogs";
import { getSortedCategories, getFilteredParameters } from "./services";
import { useParameterState, useCategoryState, useUIState } from "./hooks";
import { CreateSolutionParametersProps } from "@/features/solution-builder/types/types";
import { loadGlobalParametersIfNeeded } from "./services/global-parameters";
import CategorySystem from "../components/category-system/category-system";
import AddParameterSystem from "./components/common/add-parameter-system";
import ColumnVisibilitySystem from "./components/common/column-visibility-system";

/**
 * CreateSolutionParameters component - Main component for managing solution parameters
 * Provides a comprehensive interface for creating, editing, and organizing parameters
 * Handles parameter validation, category management, and parameter filtering
 */
export function ParameterMain({
	parameters: initialParameters,
	onParametersChange,
	customCategories,
	setCustomCategories,
	isLoadingParameters = false,
	usedParameterIds = [],
	categories,
	setCategories,
}: CreateSolutionParametersProps) {
	const [localParameters, setLocalParameters] = useState(initialParameters);
	const [hasLoadedGlobalParams, setHasLoadedGlobalParams] = useState(false);

	useEffect(() => {
		if (!hasLoadedGlobalParams) {
			setLocalParameters(initialParameters);
		}
	}, [initialParameters, hasLoadedGlobalParams]);

	const handleLocalParametersChange = (newParameters: any[]) => {
		setLocalParameters(newParameters);
		onParametersChange(newParameters);
	};

	useEffect(() => {
		if (localParameters.length === 0 && !hasLoadedGlobalParams) {
			loadGlobalParametersIfNeeded(localParameters, (newParams) => {
				handleLocalParametersChange(newParams);
				setHasLoadedGlobalParams(true);
			});
		}
	}, []);

	const uiState = useUIState();
	const {
		activeTab,
		setActiveTab,
		searchQuery,
		setSearchQuery,
		isPreviewDialogOpen,
		setIsPreviewDialogOpen,
		columnVisibility,
		setColumnVisibility,
	} = uiState;

	const parameterState = useParameterState({
		parameters: localParameters,
		onParametersChange: handleLocalParametersChange,
		customCategories,
		activeTab,
	});

	const categoryState = useCategoryState({
		parameters: localParameters,
		onParametersChange: handleLocalParametersChange,
		customCategories,
		setCustomCategories,
		activeTab,
		setActiveTab,
	});

	const getCategoryColor = (categoryName: string) => {
		return getCategoryTailwindClasses(
			categoryName,
			localParameters,
			customCategories
		);
	};

	const allCategories = getSortedCategories(localParameters, customCategories);
	const filteredParameters = getFilteredParameters(
		localParameters,
		activeTab,
		searchQuery
	);

	return (
		<div className="flex flex-col h-full">
			{/* <CategoryTabs
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
				parameters={localParameters}
				customCategories={customCategories}
				setIsPreviewDialogOpen={setIsPreviewDialogOpen}
				columnVisibility={columnVisibility}
				setColumnVisibility={setColumnVisibility}
			/> */}
			<CategorySystem categories={categories} setCategories={setCategories} />

			<ConfirmCategoryRemovalDialog
				isConfirmDialogOpen={categoryState.isConfirmDialogOpen}
				setIsConfirmDialogOpen={categoryState.setIsConfirmDialogOpen}
				confirmCategory={categoryState.confirmCategory || ""}
				handleConfirmRemoveCategory={categoryState.handleConfirmRemoveCategory}
				parameters={localParameters}
			/>

			<ConfirmParameterRemovalDialog
				isConfirmDialogOpen={parameterState.isParameterConfirmDialogOpen}
				setIsConfirmDialogOpen={parameterState.setIsParameterConfirmDialogOpen}
				confirmParameter={parameterState.confirmParameter || ""}
				handleConfirmRemoveParameter={
					parameterState.handleConfirmRemoveParameter
				}
				parameters={localParameters}
			/>

			{activeTab !== "add-new-category" && (
				<>
					<LoadingIndicator
						isLoading={isLoadingParameters}
						message="Loading existing solution parameters..."
					/>
					<div className="flex items-center justify-between gap-4 mb-6">
						<SearchBar
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							filteredParameters={filteredParameters}
						/>
						<AddParameterSystem
							handleAddParameter={parameterState.handleAddParameter}
							handleCancelAddParameter={parameterState.handleCancelAddParameter}
						/>
						<ColumnVisibilitySystem
							columnVisibility={columnVisibility}
							setColumnVisibility={setColumnVisibility}
						/>
					</div>
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
						parameters={localParameters}
						activeTab={activeTab}
						columnVisibility={columnVisibility}
						setColumnVisibility={setColumnVisibility}
						usedParameterIds={usedParameterIds}
					/>
				</>
			)}

			{/* <PreviewDialog
				isOpen={isPreviewDialogOpen}
				onOpenChange={setIsPreviewDialogOpen}
				parameters={localParameters}
				selectedIndustry={selectedIndustry}
				selectedTechnology={selectedTechnology}
				selectedSolutionId={selectedSolutionId}
				availableIndustries={availableIndustries}
				availableTechnologies={availableTechnologies}
				availableSolutionTypes={availableSolutionTypes}
			/> */}
		</div>
	);
}
