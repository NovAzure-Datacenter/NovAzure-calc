import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { AddCategoryDialogProps } from "@/features/solution-builder/types/types";
import { CategoryNameInput } from "./category-name-input";
import { CategoryColorSelector } from "./category-color-selector";

interface ExtendedAddCategoryDialogProps extends AddCategoryDialogProps {
	categoryNameError: string;
	handleCategoryNameChange: (name: string) => void;
	handleDialogClose: () => void;
	categoryColors: string[];
}

/**
 * AddCategoryDialog component - Dialog for adding new parameter categories
 */
export function AddCategoryDialog({
	isOpen,
	onOpenChange,
	newCategoryData,
	setNewCategoryData,
	onAddCategory,
	categoryNameError,
	handleCategoryNameChange,
	handleDialogClose,
	categoryColors,
}: ExtendedAddCategoryDialogProps) {
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