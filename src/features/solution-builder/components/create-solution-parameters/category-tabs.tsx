import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	getCategoryStyle,
	getActiveTabStyle,
	getAvailableColors,
} from "../../../../utils/color-utils";
import { useState } from "react";
import { ColumnFilter } from "./table-content";
import {
	CategoryTabsProps,
	AddCategoryDialogProps,
	CategoryData,
	CategoryValidationResult,
	ColumnVisibility,
	RESERVED_CATEGORY_NAMES,
	HIDDEN_CATEGORIES,
} from "../../types/types";

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
	const [categoryNameError, setCategoryNameError] = useState<string>("");

	// Wrapper functions to match the expected signatures
	const getCategoryStyleWrapper = (categoryName: string) => {
		return getCategoryStyle(categoryName, parameters, customCategories);
	};

	const getActiveTabStyleWrapper = (categoryName: string) => {
		return getActiveTabStyle(categoryName, parameters, customCategories);
	};

	// Filter categories to exclude hidden ones
	const visibleCategories = allCategories.filter(category => !isHiddenCategory(category));

	// Handle category name input change with validation
	const handleCategoryNameChange = (name: string) => {
		setNewCategoryData((prev) => ({
			...prev,
			name: name,
		}));

		// Clear error when user starts typing
		if (categoryNameError) {
			setCategoryNameError("");
		}

		// Validate category name
		const validation = validateCategoryName(name, allCategories);
		if (!validation.isValid) {
			setCategoryNameError(validation.errorMessage);
		}
	};

	// Handle add category with validation
	const handleAddCategoryWithValidation = () => {
		const validation = validateCategoryName(newCategoryData.name, allCategories);
		if (!validation.isValid) {
			setCategoryNameError(validation.errorMessage);
			return;
		}

		// If validation passes, proceed with adding the category
		handleAddCategory();
		setCategoryNameError("");
	};

	// Handle dialog close
	const handleDialogClose = () => {
		setIsAddCategoryDialogOpen(false);
		setNewCategoryData({
			name: "",
			description: "",
			color: "blue",
		});
		setCategoryNameError("");
	};

	return (
		<>
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="flex w-auto bg-muted/50 space-x-1 justify-start">
					<AllParametersTab />
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
				onAddCategory={handleAddCategoryWithValidation}
				allCategories={allCategories}
				categoryNameError={categoryNameError}
				handleCategoryNameChange={handleCategoryNameChange}
				handleDialogClose={handleDialogClose}
				categoryColors={categoryColors}
			/>
		</>
	);
}

/**
 * AllParametersTab component - Renders the "All" tab for viewing all parameters
 */
function AllParametersTab() {
	return (
		<TabsTrigger
			value="all"
			className="text-muted-foreground bg-background/80 hover:bg-background border-backdrop h-8 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
		>
			All
		</TabsTrigger>
	);
}

/**
 * GlobalParametersTab component - Renders the "Global Parameters" tab
 */
function GlobalParametersTab({
	visibleCategories,
	activeTab,
	getActiveTabStyleWrapper,
	getCategoryStyleWrapper,
}: {
	visibleCategories: string[];
	activeTab: string;
	getActiveTabStyleWrapper: (categoryName: string) => React.CSSProperties;
	getCategoryStyleWrapper: (categoryName: string) => React.CSSProperties;
}) {
	if (!visibleCategories.includes("Global")) {
		return null;
	}

	return (
		<TabsTrigger
			value="Global"
			className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
			style={
				activeTab === "Global"
					? getActiveTabStyleWrapper("Global")
					: getCategoryStyleWrapper("Global")
			}
		>
			Global Parameters
		</TabsTrigger>
	);
}

/**
 * CustomCategoryTabs component - Renders tabs for custom categories
 */
function CustomCategoryTabs({
	visibleCategories,
	activeTab,
	getActiveTabStyleWrapper,
	getCategoryStyleWrapper,
}: {
	visibleCategories: string[];
	activeTab: string;
	getActiveTabStyleWrapper: (categoryName: string) => React.CSSProperties;
	getCategoryStyleWrapper: (categoryName: string) => React.CSSProperties;
}) {
	const customCategories = visibleCategories.filter(
		(category) =>
			!HIDDEN_CATEGORIES.includes(category.toLowerCase() as any) &&
			category !== "Global"
	);

	return (
		<>
			{customCategories.map((category) => (
				<TabsTrigger
					key={category}
					value={category}
					className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
					style={
						activeTab === category
							? getActiveTabStyleWrapper(category)
							: getCategoryStyleWrapper(category)
					}
				>
					{category}
				</TabsTrigger>
			))}
		</>
	);
}

/**
 * AddCategoryButton component - Renders the button to add a new category
 */
function AddCategoryButton({ onClick }: { onClick: () => void }) {
	return (
		<Button
			variant="outline"
			onClick={onClick}
			size="sm"
			className="text-xs"
		>
			<Plus className="h-4 w-4" />
			Add Category
		</Button>
	);
}

/**
 * ParametersHeader component - Renders the header section with title and action buttons
 */
function ParametersHeader({
	activeTab,
	columnVisibility,
	setColumnVisibility,
	handleAddParameter,
	isAddingParameter,
	editingParameter,
	handleCancelAddParameter,
	setIsPreviewDialogOpen,
}: {
	activeTab: string;
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
	handleAddParameter: () => void;
	isAddingParameter: boolean;
	editingParameter: string | null;
	handleCancelAddParameter: () => void;
	setIsPreviewDialogOpen: (open: boolean) => void;
}) {
	const getHeaderTitle = () => {
		return activeTab === "all" ? "All Parameters" : activeTab;
	};

	const getHeaderDescription = () => {
		switch (activeTab) {
			case "all":
				return "View and manage all parameters across all categories";
			case "High Level Configuration":
				return "Parameters for high-level configuration settings";
			case "Low Level Configuration":
				return "Parameters for low-level configuration settings";
			case "Advanced Configuration":
				return "Parameters for advanced configuration settings";
			default:
				return `Parameters categorized under ${activeTab}`;
		}
	};

	return (
		<div className="mb-4">
			<div className="flex items-end justify-between">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold text-foreground">
						{getHeaderTitle()}
					</h2>
					<p className="text-sm text-muted-foreground">
						{getHeaderDescription()}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<ColumnFilter 
						columnVisibility={columnVisibility} 
						setColumnVisibility={setColumnVisibility} 
					/>
					<Button
						className="text-xs"
						onClick={
							isAddingParameter ? handleCancelAddParameter : handleAddParameter
						}
						disabled={editingParameter !== null || activeTab === "Global"}
					>
						{isAddingParameter ? (
							<>
								<X className="h-3 w-3" />
								Cancel
							</>
						) : (
							<>
								<Plus className="h-3 w-3" />
								Add Parameter
							</>
						)}
					</Button>
					<Button 
						variant="outline" 
						size="sm" 
						className="text-xs" 
						onClick={() => setIsPreviewDialogOpen(true)}
					>
						<Plus className="h-3 w-3" />
						Preview 
					</Button>
				</div>
			</div>
		</div>
	);
}

/**
 * AddCategoryDialog component - Dialog for adding new parameter categories
 */
function AddCategoryDialog({
	isOpen,
	onOpenChange,
	newCategoryData,
	setNewCategoryData,
	onAddCategory,
	allCategories,
	categoryNameError,
	handleCategoryNameChange,
	handleDialogClose,
	categoryColors,
}: AddCategoryDialogProps & {
	categoryNameError: string;
	handleCategoryNameChange: (name: string) => void;
	handleDialogClose: () => void;
	categoryColors: string[];
}) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Category</DialogTitle>
					<DialogDescription>
						Create a new parameter category to organize your parameters.
						<br />
						<strong>Note:</strong> &ldquo;Industry&rdquo;, &ldquo;Technologies&rdquo;, and &ldquo;Global&rdquo; are reserved names and cannot be used.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<CategoryNameInput 
						newCategoryData={newCategoryData}
						handleCategoryNameChange={handleCategoryNameChange}
						categoryNameError={categoryNameError}
					/>
					<CategoryColorSelector 
						newCategoryData={newCategoryData}
						setNewCategoryData={setNewCategoryData}
						categoryColors={categoryColors}
					/>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={handleDialogClose}>
						Cancel
					</Button>
					<Button
						onClick={onAddCategory}
						disabled={!newCategoryData.name.trim() || !!categoryNameError}
					>
						Add Category
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/**
 * CategoryNameInput component - Input field for category name with validation
 */
function CategoryNameInput({
	newCategoryData,
	handleCategoryNameChange,
	categoryNameError,
}: {
	newCategoryData: CategoryData;
	handleCategoryNameChange: (name: string) => void;
	categoryNameError: string;
}) {
	return (
		<div className="grid grid-cols-4 items-center gap-4">
			<Label htmlFor="category-name" className="text-right">
				Name
			</Label>
			<div className="col-span-3">
				<Input
					id="category-name"
					value={newCategoryData.name}
					onChange={(e) => handleCategoryNameChange(e.target.value)}
					className={`${categoryNameError ? "border-red-500" : ""}`}
					placeholder="Enter category name"
				/>
				{categoryNameError && (
					<p className="text-sm text-red-500 mt-1">{categoryNameError}</p>
				)}
			</div>
		</div>
	);
}

/**
 * CategoryColorSelector component - Color picker for category colors
 */
function CategoryColorSelector({
	newCategoryData,
	setNewCategoryData,
	categoryColors,
}: {
	newCategoryData: CategoryData;
	setNewCategoryData: React.Dispatch<React.SetStateAction<CategoryData>>;
	categoryColors: string[];
}) {
	return (
		<div className="grid grid-cols-4 items-center gap-4">
			<Label htmlFor="category-color" className="text-right">
				Color
			</Label>
			<div className="col-span-3 flex gap-2">
				{categoryColors.map((color) => (
					<button
						key={color}
						type="button"
						onClick={() =>
							setNewCategoryData((prev) => ({
								...prev,
								color: color,
							}))
						}
						className={`w-6 h-6 rounded-full bg-${color}-500 transition-all duration-200 hover:scale-110 ${
							newCategoryData.color === color
								? "ring-2 ring-black ring-offset-2"
								: ""
						}`}
					/>
				))}
			</div>
		</div>
	);
}

/**
 * Helper function to check if a category name is reserved
 */
function isReservedCategoryName(name: string): boolean {
	return RESERVED_CATEGORY_NAMES.includes(name.toLowerCase() as any);
}

/**
 * Helper function to check if a category should be hidden
 */
function isHiddenCategory(name: string): boolean {
	return HIDDEN_CATEGORIES.some(hidden => hidden.toLowerCase() === name.toLowerCase());
}

/**
 * Helper function to validate category names
 */
function validateCategoryName(name: string, allCategories: string[]): CategoryValidationResult {
	if (isReservedCategoryName(name)) {
		return {
			isValid: false,
			errorMessage: `"${name}" is a reserved category name and cannot be used.`
		};
	}

	if (name.trim() && allCategories.some(cat => cat.toLowerCase() === name.toLowerCase())) {
		return {
			isValid: false,
			errorMessage: `A category named "${name}" already exists.`
		};
	}

	if (!name.trim()) {
		return {
			isValid: false,
			errorMessage: "Category name is required."
		};
	}

	return {
		isValid: true,
		errorMessage: ""
	};
}
