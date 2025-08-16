import { Tabs, TabsList } from "@/components/ui/tabs";
import {
	getCategoryStyle,
	getActiveTabStyle,
	getAvailableColors,
} from "@/utils/color-utils";
import {
	AllParametersTab,
	RequiredParametersTab,
	GlobalParametersTab,
	CustomCategoryTabs,
	AddCategoryButton,
} from "./components/tabs";
import {
	AddCategoryDialog,
	ParametersHeader,
} from "./components/dialogs";
import { isHiddenCategory } from "./services";
import { useCategoryValidation } from "./hooks";
import { CategoryTabsProps } from "@/features/solution-builder/types/types";

/**
 * CategoryTabs component - Manages parameter categories with tabs and category creation
 * Provides tab navigation for different parameter categories and allows adding new categories
 * Handles category validation and provides a clean interface for parameter organization
 */
export default function CategoryTabs({
	activeTab,
	setActiveTab,
	allCategories,
	handleRemoveCategory,
	setIsAddCategoryDialogOpen,
	newCategoryData,
	setNewCategoryData,
	handleAddCategory,
	isAddCategoryDialogOpen,
	handleAddParameter,
	isAddingParameter,
	editingParameter,
	handleCancelAddParameter,
	parameters,
	customCategories,
	setIsPreviewDialogOpen,
	columnVisibility,
	setColumnVisibility,
}: CategoryTabsProps) {
	const categoryColors = getAvailableColors();

	const validation = useCategoryValidation({
		allCategories,
		newCategoryData,
		handleAddCategory,
		setIsAddCategoryDialogOpen,
		setNewCategoryData,
	});

	// Wrapper functions to match the expected signatures
	const getCategoryStyleWrapper = (categoryName: string) => {
		return getCategoryStyle(categoryName, parameters, customCategories);
	};

	const getActiveTabStyleWrapper = (categoryName: string) => {
		return getActiveTabStyle(categoryName, parameters, customCategories);
	};

	// Filter categories to exclude hidden ones
	const visibleCategories = allCategories.filter(category => !isHiddenCategory(category));

	return (
		<>
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="flex w-auto bg-muted/50 space-x-1 justify-start">
					<AllParametersTab />
					<RequiredParametersTab />
					<GlobalParametersTab 
						visibleCategories={visibleCategories}
						activeTab={activeTab}
						getActiveTabStyleWrapper={getActiveTabStyleWrapper}
						getCategoryStyleWrapper={getCategoryStyleWrapper}
					/>
					<CustomCategoryTabs 
						visibleCategories={visibleCategories}
						activeTab={activeTab}
						getActiveTabStyleWrapper={getActiveTabStyleWrapper}
						getCategoryStyleWrapper={getCategoryStyleWrapper}
					/>
					<AddCategoryButton 
						onClick={() => setIsAddCategoryDialogOpen(true)}
					/>
				</TabsList>
			</Tabs>

			<ParametersHeader 
				activeTab={activeTab}
				columnVisibility={columnVisibility}
				setColumnVisibility={setColumnVisibility}
				handleAddParameter={handleAddParameter}
				isAddingParameter={isAddingParameter}
				editingParameter={editingParameter}
				handleCancelAddParameter={handleCancelAddParameter}
				setIsPreviewDialogOpen={setIsPreviewDialogOpen}
			/>

			<AddCategoryDialog
				isOpen={isAddCategoryDialogOpen}
				onOpenChange={setIsAddCategoryDialogOpen}
				newCategoryData={newCategoryData}
				setNewCategoryData={setNewCategoryData}
				onAddCategory={validation.handleAddCategoryWithValidation}
				allCategories={allCategories}
				categoryNameError={validation.categoryNameError}
				handleCategoryNameChange={validation.handleCategoryNameChange}
				handleDialogClose={validation.handleDialogClose}
				categoryColors={categoryColors}
			/>
		</>
	);
}




