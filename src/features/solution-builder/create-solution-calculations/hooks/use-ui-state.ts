import { useState } from "react";

/**
 * Hook for managing UI state (tabs, dialogs, search)
 */
export function useUIState() {
	// Tab state
	const [activeTab, setActiveTab] = useState("all");
	
	// Dialog states
	const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
	const [isAddNewParameterDialogOpen, setIsAddNewParameterDialogOpen] = useState(false);
	const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
	
	// Search state
	const [searchQuery, setSearchQuery] = useState("");
	
	return {
		// Tab state
		activeTab,
		setActiveTab,
		
		// Dialog states
		isAddCategoryDialogOpen,
		setIsAddCategoryDialogOpen,
		isAddNewParameterDialogOpen,
		setIsAddNewParameterDialogOpen,
		isPreviewDialogOpen,
		setIsPreviewDialogOpen,
		
		// Search state
		searchQuery,
		setSearchQuery,
	};
} 