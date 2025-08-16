import { useState } from "react";
import { CategoryData } from "@/features/solution-builder/types/types";
import { validateCategoryName } from "../services/category-validation";

interface UseCategoryValidationProps {
	allCategories: string[];
	newCategoryData: CategoryData;
	handleAddCategory: () => void;
	setIsAddCategoryDialogOpen: (open: boolean) => void;
	setNewCategoryData: React.Dispatch<React.SetStateAction<CategoryData>>;
}

export function useCategoryValidation({
	allCategories,
	newCategoryData,
	handleAddCategory,
	setIsAddCategoryDialogOpen,
	setNewCategoryData,
}: UseCategoryValidationProps) {
	const [categoryNameError, setCategoryNameError] = useState<string>("");

	const handleCategoryNameChange = (name: string) => {
		setNewCategoryData((prev) => ({
			...prev,
			name: name,
		}));

		if (categoryNameError) {
			setCategoryNameError("");
		}

		const validation = validateCategoryName(name, allCategories);
		if (!validation.isValid) {
			setCategoryNameError(validation.errorMessage);
		}
	};

	const handleAddCategoryWithValidation = () => {
		const validation = validateCategoryName(newCategoryData.name, allCategories);
		if (!validation.isValid) {
			setCategoryNameError(validation.errorMessage);
			return;
		}

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

	return {
		categoryNameError,
		handleCategoryNameChange,
		handleAddCategoryWithValidation,
		handleDialogClose,
	};
} 