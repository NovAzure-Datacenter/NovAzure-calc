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
import { Calculation } from "@/types/types";
import {
	getCalculationCategoryStyle,
	getCalculationActiveTabStyle,
	getAvailableColors,
} from "../../utils/calculation-color-utils";
import { useState } from "react";
import {
	CalculationCategoryTabsProps,
	CalculationCategoryTabsListProps,
	CalculationCategoryTabProps,
	CalculationCategoryHeaderProps,
	AddCalculationCategoryDialogProps,
	CategoryNameInputProps,
	CategoryColorSelectorProps,
	CategoryValidationResult,
	CALCULATION_RESERVED_CATEGORY_NAMES,
	CALCULATION_HIDDEN_CATEGORIES,
} from "../../types/types";

/**
 * CalculationCategoryTabs component - Main component for calculation category management
 * Provides tabs for different calculation categories with add/remove functionality
 * Includes header with action buttons and dialog for adding new categories
 */
export default function CalculationCategoryTabs({
	activeTab,
	setActiveTab,
	allCategories,
	handleRemoveCategory,
	setIsAddCategoryDialogOpen,
	newCategoryData,
	setNewCategoryData,
	handleAddCategory,
	isAddCategoryDialogOpen,
	handleAddCalculation,
	isAddingCalculation,
	editingCalculation,
	handleCancelAddCalculation,
	calculations,
	customCategories,
	setIsAddNewParameterDialogOpen,
	setIsPreviewDialogOpen,
}: CalculationCategoryTabsProps) {
	const [categoryNameError, setCategoryNameError] = useState<string>("");

	// Helper functions
	const validateCategoryName = (name: string): CategoryValidationResult => {
		if (isReservedCategoryName(name)) {
			return {
				isValid: false,
				errorMessage: `"${name}" is a reserved category name and cannot be used.`,
			};
		}

		if (
			name.trim() &&
			allCategories.some((cat) => cat.toLowerCase() === name.toLowerCase())
		) {
			return {
				isValid: false,
				errorMessage: `A category named "${name}" already exists.`,
			};
		}

		if (!name.trim()) {
			return {
				isValid: false,
				errorMessage: "Category name is required.",
			};
		}

		return {
			isValid: true,
			errorMessage: "",
		};
	};

	const handleCategoryNameChange = (name: string) => {
		setNewCategoryData((prev) => ({
			...prev,
			name: name,
		}));

		// Clear error when user starts typing
		if (categoryNameError) {
			setCategoryNameError("");
		}

		const validation = validateCategoryName(name);
		if (!validation.isValid) {
			setCategoryNameError(validation.errorMessage);
		}
	};

	const handleAddCategoryWithValidation = () => {
		const validation = validateCategoryName(newCategoryData.name);
		if (!validation.isValid) {
			setCategoryNameError(validation.errorMessage);
			return;
		}

		// If validation passes, proceed with adding the category
		handleAddCategory();
		setCategoryNameError("");
	};

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
			<CalculationCategoryTabsList
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				allCategories={allCategories}
				handleRemoveCategory={handleRemoveCategory}
				setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
				customCategories={customCategories}
				calculations={calculations}
			/>

			<CalculationCategoryHeader
				activeTab={activeTab}
				handleAddCalculation={handleAddCalculation}
				isAddingCalculation={isAddingCalculation}
				editingCalculation={editingCalculation}
				handleCancelAddCalculation={handleCancelAddCalculation}
				setIsAddNewParameterDialogOpen={setIsAddNewParameterDialogOpen}
				setIsPreviewDialogOpen={setIsPreviewDialogOpen}
			/>

			<AddCalculationCategoryDialog
				isOpen={isAddCategoryDialogOpen}
				onOpenChange={setIsAddCategoryDialogOpen}
				newCategoryData={newCategoryData}
				setNewCategoryData={setNewCategoryData}
				onAddCategory={handleAddCategoryWithValidation}
				allCategories={allCategories}
				categoryNameError={categoryNameError}
				onCategoryNameChange={handleCategoryNameChange}
				onDialogClose={handleDialogClose}
			/>
		</>
	);
}

/**
 * CalculationCategoryTabsList component - Renders the tabs list with category tabs
 */
function CalculationCategoryTabsList({
	activeTab,
	setActiveTab,
	allCategories,
	handleRemoveCategory,
	setIsAddCategoryDialogOpen,
	customCategories,
	calculations,
}: CalculationCategoryTabsListProps) {
	// Helper functions
	const getCategoryStyleWrapper = (categoryName: string) => {
		return getCalculationCategoryStyle(
			categoryName,
			calculations,
			customCategories
		);
	};

	const getActiveTabStyleWrapper = (categoryName: string) => {
		return getCalculationActiveTabStyle(
			categoryName,
			calculations,
			customCategories
		);
	};

	// Filter categories to exclude hidden ones
	const visibleCategories = allCategories.filter(
		(category) => !isHiddenCategory(category)
	);

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
			<TabsList className="flex w-auto bg-muted/50 space-x-1 justify-start">
				<TabsTrigger
					value="all"
					className="text-muted-foreground bg-background/80 hover:bg-background border-backdrop h-8 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
				>
					All
				</TabsTrigger>

				{/* Show visible categories */}
				{visibleCategories.map((category) => {
					const isCustomCategory = customCategories.some(
						(cat) => cat.name === category
					);
					const isActive = activeTab === category;

					return (
						<CalculationCategoryTab
							key={category}
							category={category}
							isActive={isActive}
							isCustomCategory={isCustomCategory}
							onRemove={handleRemoveCategory}
							getCategoryStyle={getCategoryStyleWrapper}
							getActiveTabStyle={getActiveTabStyleWrapper}
						/>
					);
				})}

				<Button
					variant="outline"
					onClick={() => setIsAddCategoryDialogOpen(true)}
					size="sm"
					className="text-xs"
				>
					<Plus className="h-4 w-4" />
					Add Category
				</Button>
			</TabsList>
		</Tabs>
	);
}

/**
 * CalculationCategoryTab component - Individual category tab
 */
function CalculationCategoryTab({
	category,
	isActive,
	isCustomCategory,
	onRemove,
	getCategoryStyle,
	getActiveTabStyle,
}: CalculationCategoryTabProps) {
	return (
		<TabsTrigger
			value={category}
			className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop group relative"
			style={
				isActive
					? getActiveTabStyle(category)
					: getCategoryStyle(category)
			}
		>
			<span className={isCustomCategory ? "pr-6" : ""}>
				{category}
			</span>
			{isCustomCategory && (
				<Button
					size="sm"
					variant="ghost"
					onClick={(e) => {
						e.stopPropagation();
						onRemove(category);
					}}
					className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
				>
					<X className="h-3 w-3" />
				</Button>
			)}
		</TabsTrigger>
	);
}

/**
 * CalculationCategoryHeader component - Header with title and action buttons
 */
function CalculationCategoryHeader({
	activeTab,
	handleAddCalculation,
	isAddingCalculation,
	editingCalculation,
	handleCancelAddCalculation,
	setIsAddNewParameterDialogOpen,
	setIsPreviewDialogOpen,
}: CalculationCategoryHeaderProps) {
	const getHeaderTitle = () => {
		return activeTab === "all" ? "All Calculations" : activeTab;
	};

	const getHeaderDescription = () => {
		return activeTab === "all"
			? "View and manage all calculations across all categories"
			: `Calculations categorized under ${activeTab}`;
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
					<Button
						size="sm"
						className="text-xs"
						onClick={() => setIsAddNewParameterDialogOpen(true)}
					>
						<Plus className="h-3 w-3" />
						Add Parameter
					</Button>
					<Button
						size="sm"
						className="text-xs"
						onClick={
							isAddingCalculation
								? handleCancelAddCalculation
								: handleAddCalculation
						}
						disabled={editingCalculation !== null}
					>
						{isAddingCalculation ? (
							<>
								<X className="h-3 w-3" />
								Cancel
							</>
						) : (
							<>
								<Plus className="h-3 w-3" />
								Add Calculation
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
 * AddCalculationCategoryDialog component - Dialog for adding new calculation categories
 */
function AddCalculationCategoryDialog({
	isOpen,
	onOpenChange,
	newCategoryData,
	setNewCategoryData,
	onAddCategory,
	allCategories,
	categoryNameError,
	onCategoryNameChange,
	onDialogClose,
}: AddCalculationCategoryDialogProps) {
	const categoryColors = getAvailableColors();

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Category</DialogTitle>
					<DialogDescription>
						Create a new calculation category to organize your calculations.
						<br />
						<strong>Note:</strong> &ldquo;Financial&rdquo;, &ldquo;Performance&rdquo;, &ldquo;Efficiency&rdquo;,
						and &ldquo;Operational&rdquo; are reserved names and cannot be used.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="category-name" className="text-right">
							Name
						</Label>
						<div className="col-span-3">
							<CategoryNameInput
								value={newCategoryData.name}
								onChange={onCategoryNameChange}
								error={categoryNameError}
								placeholder="Enter category name"
							/>
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="category-color" className="text-right">
							Color
						</Label>
						<div className="col-span-3">
							<CategoryColorSelector
								selectedColor={newCategoryData.color}
								onColorSelect={(color) =>
									setNewCategoryData((prev) => ({
										...prev,
										color: color,
									}))
								}
								availableColors={categoryColors}
							/>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onDialogClose}>
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
 * CategoryNameInput component - Input field for category name with error handling
 */
function CategoryNameInput({
	value,
	onChange,
	error,
	placeholder,
}: CategoryNameInputProps) {
	return (
		<>
			<Input
				id="category-name"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={`${error ? "border-red-500" : ""}`}
				placeholder={placeholder}
			/>
			{error && (
				<p className="text-sm text-red-500 mt-1">{error}</p>
			)}
		</>
	);
}

/**
 * CategoryColorSelector component - Color picker for category colors
 */
function CategoryColorSelector({
	selectedColor,
	onColorSelect,
	availableColors,
}: CategoryColorSelectorProps) {
	return (
		<div className="flex gap-2">
			{availableColors.map((color) => (
				<button
					key={color}
					type="button"
					onClick={() => onColorSelect(color)}
					className={`w-6 h-6 rounded-full bg-${color}-500 transition-all duration-200 hover:scale-110 ${
						selectedColor === color
							? "ring-2 ring-black ring-offset-2"
							: ""
					}`}
				/>
			))}
		</div>
	);
}

/**
 * Helper functions for category validation
 */
function isReservedCategoryName(name: string): boolean {
	return CALCULATION_RESERVED_CATEGORY_NAMES.includes(name.toLowerCase() as any);
}

function isHiddenCategory(name: string): boolean {
	return CALCULATION_HIDDEN_CATEGORIES.includes(name.toLowerCase());
}
