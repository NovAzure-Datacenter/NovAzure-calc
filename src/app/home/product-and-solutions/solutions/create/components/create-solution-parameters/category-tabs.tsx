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
import { Parameter } from "@/app/home/product-and-solutions/types";
import {
	getCategoryStyle,
	getActiveTabStyle,
	getAvailableColors,
} from "./color-utils";

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
}) {
	const categoryColors = getAvailableColors();

	// Wrapper functions to match the expected signatures
	const getCategoryStyleWrapper = (categoryName: string) => {
		return getCategoryStyle(categoryName, parameters, customCategories);
	};

	const getActiveTabStyleWrapper = (categoryName: string) => {
		return getActiveTabStyle(categoryName, parameters, customCategories);
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
					{allCategories.includes("Global") && (
						<TabsTrigger
							value="Global"
							className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
							style={
								activeTab === "Global"
									? getActiveTabStyleWrapper("Global")
									: getCategoryStyleWrapper("Global")
							}
						>
							Global
						</TabsTrigger>
					)}
					{/* Show other categories (excluding Global since it's already shown above) */}
					{allCategories
						.filter((category) => category !== "Global")
						.map((category) => {
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
											className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100  hover:bg-red-100 hover:text-red-600 "
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
								: `Parameters categorized under ${activeTab}`}
						</p>
					</div>
					<Button
						className="text-xs "
						onClick={
							isAddingParameter ? handleCancelAddParameter : handleAddParameter
						}
						disabled={editingParameter !== null}
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
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="category-name" className="text-right">
								Name
							</Label>
							<Input
								id="category-name"
								value={newCategoryData.name}
								onChange={(e) =>
									setNewCategoryData((prev) => ({
										...prev,
										name: e.target.value,
									}))
								}
								className="col-span-3"
								placeholder="Enter category name"
							/>
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
							onClick={() => {
								setIsAddCategoryDialogOpen(false);
								setNewCategoryData({
									name: "",
									description: "",
									color: "blue",
								});
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleAddCategory}
							disabled={!newCategoryData.name.trim()}
						>
							Add Category
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
