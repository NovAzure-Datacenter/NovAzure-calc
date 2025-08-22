import { useState } from "react";

export function useUIState() {
	const [activeTab, setActiveTab] = useState("all");
	const [activeCategories, setActiveCategories] = useState<string[]>(["all"]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
	const [columnVisibility, setColumnVisibility] = useState({
		parameterName: true,
		category: true,
		displayType: true,
		value: true,
		testValue: true,
		unit: true,
		description: true,
		userInterface: true,
		output: true,
		actions: true,
	});

	return {
		// State
		activeTab,
		setActiveTab,
		activeCategories,
		setActiveCategories,
		searchQuery,
		setSearchQuery,
		isPreviewDialogOpen,
		setIsPreviewDialogOpen,
		columnVisibility,
		setColumnVisibility,
	};
}
