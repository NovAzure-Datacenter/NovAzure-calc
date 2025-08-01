import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Plus, ChevronDown } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Parameter } from "@/app/home/product-and-solutions/types";
import {
	getCategoryStyle,
	getActiveTabStyle,
	getAvailableColors,
} from "../../../../utils/color-utils";
import { useState } from "react";
import { ColumnFilter, ColumnVisibility } from "./table-content";


const RESERVED_CATEGORY_NAMES = ["industry", "technologies", "global", "technologies"];
const HIDDEN_CATEGORIES = ["industry", "technology", "technologies", "high level configuration", "low level configuration", "advanced configuration"];

function isReservedCategoryName(name: string): boolean {
	return RESERVED_CATEGORY_NAMES.includes(name.toLowerCase());
}

function isHiddenCategory(name: string): boolean {
	return HIDDEN_CATEGORIES.some(hidden => hidden.toLowerCase() === name.toLowerCase());
}

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
	handleAddParameter: () => void;
	isAddingParameter: boolean;
	editingParameter: string | null;
	handleCancelAddParameter: () => void;
	parameters: Parameter[];
	customCategories: Array<{ name: string; color: string }>;
	setIsPreviewDialogOpen: (open: boolean) => void;
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
}) {
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

		// Check for reserved names
		if (isReservedCategoryName(name)) {
			setCategoryNameError(`"${name}" is a reserved category name and cannot be used.`);
		} else if (name.trim() && allCategories.some(cat => cat.toLowerCase() === name.toLowerCase())) {
			setCategoryNameError(`A category named "${name}" already exists.`);
		} else {
			setCategoryNameError("");
		}
	};

	// Handle add category with validation
	const handleAddCategoryWithValidation = () => {
		if (isReservedCategoryName(newCategoryData.name)) {
			setCategoryNameError(`"${newCategoryData.name}" is a reserved category name and cannot be used.`);
			return;
		}

		if (allCategories.some(cat => cat.toLowerCase() === newCategoryData.name.toLowerCase())) {
			setCategoryNameError(`A category named "${newCategoryData.name}" already exists.`);
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
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
				<TabsList className="flex w-auto bg-muted/50 space-x-1 justify-start">
					<TabsTrigger
						value="all"
						className="text-muted-foreground bg-background/80 hover:bg-background border-backdrop h-8 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
					>
						All
					</TabsTrigger>
					
					{/* Show Global tab if it exists in categories */}
					{visibleCategories.includes("Global") && (
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
					)}

					{/* Custom Categories */}
					{visibleCategories
						.filter(
							(category) =>
								!HIDDEN_CATEGORIES.includes(category.toLowerCase()) &&
								category !== "Global"
						)
						.map((category) => (
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

			{/* Parameters Header */}
			<div className="mb-4">
				<div className="flex items-end justify-between ">
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-semibold text-foreground">
							{activeTab === "all" ? "All Parameters" : activeTab}
						</h2>
						<p className="text-sm text-muted-foreground">
							{activeTab === "all"
								? "View and manage all parameters across all categories"
								: activeTab === "High Level Configuration"
								? "Parameters for high-level configuration settings"
								: activeTab === "Low Level Configuration"
								? "Parameters for low-level configuration settings"
								: activeTab === "Advanced Configuration"
								? "Parameters for advanced configuration settings"
								: `Parameters categorized under ${activeTab}`}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<ColumnFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
					<Button
						className="text-xs "
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
					<Button variant="outline" size="sm" className="text-xs" onClick={() => setIsPreviewDialogOpen(true)}>
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
							Create a new parameter category to organize your parameters.
							<br />
							<strong>Note:</strong> "Industry", "Technologies", and "Global" are reserved names and cannot be used.
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
									<p className="text-sm text-red-500 mt-1">{categoryNameError}</p>
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
						<Button
							variant="outline"
							onClick={handleDialogClose}
						>
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
