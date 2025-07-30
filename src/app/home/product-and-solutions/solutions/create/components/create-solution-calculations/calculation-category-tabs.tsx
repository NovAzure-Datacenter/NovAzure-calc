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
import { Calculation } from "@/app/home/product-and-solutions/types";
import {
	getCalculationCategoryStyle,
	getCalculationActiveTabStyle,
	getAvailableColors,
	CustomCalculationCategory,
} from "./calculation-color-utils";
import { useState } from "react";

const RESERVED_CATEGORY_NAMES = [
	"financial",
	"performance",
	"efficiency",
	"operational",
];
const HIDDEN_CATEGORIES: string[] = [];

function isReservedCategoryName(name: string): boolean {
	return RESERVED_CATEGORY_NAMES.includes(name.toLowerCase());
}

function isHiddenCategory(name: string): boolean {
	return HIDDEN_CATEGORIES.includes(name.toLowerCase());
}

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
}: {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	allCategories: string[];
	handleRemoveCategory: (category: string) => void;
	setIsAddCategoryDialogOpen: (open: boolean) => void;
	newCategoryData: {
		name: string;
		description: string;
		color: string;
	};
	setNewCategoryData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			description: string;
			color: string;
		}>
	>;
	handleAddCategory: () => void;
	isAddCategoryDialogOpen: boolean;
	handleAddCalculation: () => void;
	isAddingCalculation: boolean;
	editingCalculation: string | null;
	handleCancelAddCalculation: () => void;
	calculations: Calculation[];
	customCategories: CustomCalculationCategory[];
	setIsAddNewParameterDialogOpen: (open: boolean) => void;
	setIsPreviewDialogOpen: (open: boolean) => void;
}) {
	const categoryColors = getAvailableColors();
	const [categoryNameError, setCategoryNameError] = useState<string>("");

	// Wrapper functions to match the expected signatures
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

		// Check for reserved names
		if (isReservedCategoryName(name)) {
			setCategoryNameError(
				`"${name}" is a reserved category name and cannot be used.`
			);
		} else if (
			name.trim() &&
			allCategories.some((cat) => cat.toLowerCase() === name.toLowerCase())
		) {
			setCategoryNameError(`A category named "${name}" already exists.`);
		} else {
			setCategoryNameError("");
		}
	};

	// Handle add category with validation
	const handleAddCategoryWithValidation = () => {
		if (isReservedCategoryName(newCategoryData.name)) {
			setCategoryNameError(
				`"${newCategoryData.name}" is a reserved category name and cannot be used.`
			);
			return;
		}

		if (
			allCategories.some(
				(cat) => cat.toLowerCase() === newCategoryData.name.toLowerCase()
			)
		) {
			setCategoryNameError(
				`A category named "${newCategoryData.name}" already exists.`
			);
			return;
		}

		if (!newCategoryData.name.trim()) {
			setCategoryNameError("Category name is required.");
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
							<TabsTrigger
								key={category}
								value={category}
								className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop group relative"
								style={
									isActive
										? getActiveTabStyleWrapper(category)
										: getCategoryStyleWrapper(category)
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
											handleRemoveCategory(category);
										}}
										className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
									>
										<X className="h-3 w-3" />
									</Button>
								)}
							</TabsTrigger>
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

			{/* Calculations Header */}
			<div className="mb-4">
				<div className="flex items-end justify-between">
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-semibold text-foreground">
							{activeTab === "all" ? "All Calculations" : activeTab}
						</h2>
						<p className="text-sm text-muted-foreground">
							{activeTab === "all"
								? "View and manage all calculations across all categories"
								: `Calculations categorized under ${activeTab}`}
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

			{/* Add New Category Dialog */}
			<Dialog
				open={isAddCategoryDialogOpen}
				onOpenChange={setIsAddCategoryDialogOpen}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add New Category</DialogTitle>
						<DialogDescription>
							Create a new calculation category to organize your calculations.
							<br />
							<strong>Note:</strong> "Financial", "Performance", "Efficiency",
							and "Operational" are reserved names and cannot be used.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
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
									<p className="text-sm text-red-500 mt-1">
										{categoryNameError}
									</p>
								)}
							</div>
						</div>
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
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={handleDialogClose}>
							Cancel
						</Button>
						<Button
							onClick={handleAddCategoryWithValidation}
							disabled={!newCategoryData.name.trim() || !!categoryNameError}
						>
							Add Category
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
