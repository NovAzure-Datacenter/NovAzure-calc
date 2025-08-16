import { Label } from "@/components/ui/label";
import { CategoryData } from "@/features/solution-builder/types/types";

interface CategoryColorSelectorProps {
	newCategoryData: CategoryData;
	setNewCategoryData: React.Dispatch<React.SetStateAction<CategoryData>>;
	categoryColors: string[];
}

/**
 * CategoryColorSelector component - Color picker for category colors
 */
export function CategoryColorSelector({
	newCategoryData,
	setNewCategoryData,
	categoryColors,
}: CategoryColorSelectorProps) {
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