import { TabsTrigger } from "@/components/ui/tabs";

interface GlobalParametersTabProps {
	visibleCategories: string[];
	activeTab: string;
	getActiveTabStyleWrapper: (categoryName: string) => React.CSSProperties;
	getCategoryStyleWrapper: (categoryName: string) => React.CSSProperties;
}

/**
 * GlobalParametersTab component - Renders the "Global Parameters" tab
 */
export function GlobalParametersTab({
	visibleCategories,
	activeTab,
	getActiveTabStyleWrapper,
	getCategoryStyleWrapper,
}: GlobalParametersTabProps) {
	if (!visibleCategories.includes("Global")) {
		return null;
	}

	return (
		<TabsTrigger
			value="Global"
			className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
			style={
				activeTab === "Global"
					? getActiveTabStyleWrapper("Global")
					: getCategoryStyleWrapper("Global")
			}
		>
			Global Parameters
		</TabsTrigger>
	);
} 