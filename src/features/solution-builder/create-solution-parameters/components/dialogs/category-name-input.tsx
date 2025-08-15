import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CategoryData } from "@/features/solution-builder/types/types";

interface CategoryNameInputProps {
	newCategoryData: CategoryData;
	handleCategoryNameChange: (name: string) => void;
	categoryNameError: string;
}

/**
 * CategoryNameInput component - Input field for category name with validation
 */
export function CategoryNameInput({
	newCategoryData,
	handleCategoryNameChange,
	categoryNameError,
}: CategoryNameInputProps) {
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