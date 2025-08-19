"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { CategoryData } from "@/features/solution-builder/types/types";

interface CategorySystemProps {
	categories: CategoryData[];
	setCategories: React.Dispatch<React.SetStateAction<CategoryData[]>>;
}

export default function CategorySystem(props: CategorySystemProps) {
	const { categories, setCategories } = props;
	const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

	const categoriesWithAll: Record<string, CategoryData> = {
		all: { name: "All", description: "All categories", color: "#000000" },
		...categories.reduce((acc, category) => {
			acc[category.name] = category;
			return acc;
		}, {} as Record<string, CategoryData>),
	};

	const categoriesArr = Object.keys(categoriesWithAll);
	const defaultTab = categoriesArr[0];

	const handleRemoveCategory = (categoryName: string) => {
		setCategories((prev) => prev.filter((cat) => cat.name !== categoryName));
	};

	return (
		<div className="w-full pb-6">
			<Tabs defaultValue={defaultTab} className="w-full">
				<TabsList className="flex w-full overflow-hidden">
					{categoriesArr.map((categoryKey) => (
						<TabsTrigger
							key={categoryKey}
							value={categoryKey}
							className="flex-1 min-w-0 text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop truncate px-2 relative group"
						>
							{categoriesWithAll[categoryKey].name}
							{categoryKey !== "all" && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveCategory(categoryKey);
									}}
									className="absolute -top-0 right-1 w-4 h-4 text-red-500"
									title="Remove category"
								>
									<X className="w-3 h-3" />
								</button>
							)}
						</TabsTrigger>
					))}
					<AddCategoryButton
						setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
					/>
				</TabsList>
			</Tabs>
			<AddCategoryDialog
				isOpen={isAddCategoryDialogOpen}
				onOpenChange={setIsAddCategoryDialogOpen}
				categories={categories}
				setCategories={setCategories}
			/>
		</div>
	);
}

function AddCategoryButton({
	setIsAddCategoryDialogOpen,
}: {
	setIsAddCategoryDialogOpen: (open: boolean) => void;
}) {
	return (
		<TabsTrigger
			value="add"
			className="flex-shrink-0 text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop px-3"
			onClick={() => setIsAddCategoryDialogOpen(true)}
		>
			Add+
		</TabsTrigger>
	);
}

function AddCategoryDialog({
	isOpen,
	onOpenChange,
	categories,
	setCategories,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	categories: CategoryData[];
	setCategories: React.Dispatch<React.SetStateAction<CategoryData[]>>;
}) {
	const [newCategoryData, setNewCategoryData] = useState({
		name: "",
		description: "",
		color: "#000000",
		mandatory: false,
	});

	function onAddCategory() {
		setCategories((prev) => [...prev, newCategoryData]);
		setNewCategoryData({
			name: "",
			description: "",
			color: "#000000",
			mandatory: false,
		});
		onOpenChange(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Category</DialogTitle>
					<DialogDescription>
						Create a new parameter category to organize your parameters.
						<br />
						<strong>Note:</strong> {categories.map((c) => c.name).join(", ")}{" "}
						are reserved names and cannot be used.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Input
						placeholder="Category Name"
						value={newCategoryData.name}
						onChange={(e) =>
							setNewCategoryData({ ...newCategoryData, name: e.target.value })
						}
					/>
					<Textarea
						placeholder="Category Description"
						value={newCategoryData.description}
						onChange={(e) =>
							setNewCategoryData({
								...newCategoryData,
								description: e.target.value,
							})
						}
					/>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={onAddCategory}
						disabled={
							!newCategoryData.name.trim() ||
							!newCategoryData.description.trim()
						}
					>
						Add Category
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
