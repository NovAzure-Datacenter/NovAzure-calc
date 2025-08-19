import { useState } from "react";
import { Parameter } from "@/types/types";

interface UseCategoryStateProps {
	parameters: Parameter[];
	onParametersChange: (parameters: Parameter[]) => void;
	customCategories: Array<{ name: string; color: string }>;
	setCustomCategories: React.Dispatch<React.SetStateAction<Array<{ name: string; color: string }>>>;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export function useCategoryState({
	parameters,
	onParametersChange,
	customCategories,
	setCustomCategories,
	activeTab,
	setActiveTab,
}: UseCategoryStateProps) {
	// Category management state
	const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
	const [newCategoryData, setNewCategoryData] = useState({
		name: "",
		description: "",
		color: "blue",
	});
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [confirmCategory, setConfirmCategory] = useState<string | null>(null);

	// Category management handlers
	const handleAddCategory = () => {
		if (newCategoryData.name.trim()) {
			setCustomCategories((prev) => [
				...prev,
				{
					name: newCategoryData.name.trim(),
					color: newCategoryData.color,
				},
			]);
			setActiveTab(newCategoryData.name.trim());
			setIsAddCategoryDialogOpen(false);
			setNewCategoryData({
				name: "",
				description: "",
				color: "blue",
			});
		}
	};

	const handleRemoveCategory = (categoryToRemove: string) => {
		setConfirmCategory(categoryToRemove);
		setIsConfirmDialogOpen(true);
	};

	const handleConfirmRemoveCategory = () => {
		if (confirmCategory) {
			setCustomCategories((prev) =>
				prev.filter((cat) => cat.name !== confirmCategory)
			);

			const updatedParameters = parameters.filter(
				(param) => param.category.name !== confirmCategory
			);
			onParametersChange(updatedParameters);

			if (activeTab === confirmCategory) {
				setActiveTab("all");
			}
			setIsConfirmDialogOpen(false);
			setConfirmCategory(null);
		}
	};

	return {
		// State
		isAddCategoryDialogOpen,
		setIsAddCategoryDialogOpen,
		newCategoryData,
		setNewCategoryData,
		isConfirmDialogOpen,
		setIsConfirmDialogOpen,
		confirmCategory,

		// Handlers
		handleAddCategory,
		handleRemoveCategory,
		handleConfirmRemoveCategory,
	};
} 