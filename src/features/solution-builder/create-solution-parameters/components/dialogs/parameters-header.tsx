import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ColumnFilter } from "../table/column-filter";
import { ColumnVisibility } from "@/features/solution-builder/types/types";

interface ParametersHeaderProps {
	activeTab: string;
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
	handleAddParameter: () => void;
	isAddingParameter: boolean;
	editingParameter: string | null;
	handleCancelAddParameter: () => void;
	setIsPreviewDialogOpen: (open: boolean) => void;
}

/**
 * ParametersHeader component - Renders the header section with title and action buttons
 */
export function ParametersHeader({
	activeTab,
	columnVisibility,
	setColumnVisibility,
	handleAddParameter,
	isAddingParameter,
	editingParameter,
	handleCancelAddParameter,
	setIsPreviewDialogOpen,
}: ParametersHeaderProps) {
	const getHeaderTitle = () => {
		if (activeTab === "all") return "All Parameters";
		if (activeTab === "required") return "Required Parameters";
		return activeTab;
	};

	const getHeaderDescription = () => {
		switch (activeTab) {
			case "all":
				return "View and manage all parameters across all categories";
			case "required":
				return "View and manage required parameters that must be configured";
			case "High Level Configuration":
				return "Parameters for high-level configuration settings";
			case "Low Level Configuration":
				return "Parameters for low-level configuration settings";
			case "Advanced Configuration":
				return "Parameters for advanced configuration settings";
			default:
				return `Parameters categorized under ${activeTab}`;
		}
	};

	return (
		<div className="mb-4">
			<div className="flex items-end justify-between">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold text-foreground">
						{getHeaderTitle()}
					</h2>
					<p className="text-sm text-muted-foreground">
						{getHeaderDescription()}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<ColumnFilter 
						columnVisibility={columnVisibility} 
						setColumnVisibility={setColumnVisibility} 
					/>
					<Button
						className="text-xs"
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
					<Button 
						variant="outline" 
						size="sm" 
						className="text-xs" 
						onClick={() => setIsPreviewDialogOpen(true)}
					>
						<Plus className="h-3 w-3" />
						Preview 
					</Button>
				</div>
			</div>
		</div>
	);
} 