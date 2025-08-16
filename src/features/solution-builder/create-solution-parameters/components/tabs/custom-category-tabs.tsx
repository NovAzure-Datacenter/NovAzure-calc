import { TabsTrigger } from "@/components/ui/tabs";
import { HIDDEN_CATEGORIES } from "@/features/solution-builder/types/types";

interface CustomCategoryTabsProps {
	visibleCategories: string[];
	activeTab: string;
	getActiveTabStyleWrapper: (categoryName: string) => React.CSSProperties;
	getCategoryStyleWrapper: (categoryName: string) => React.CSSProperties;
}

/**
 * CustomCategoryTabs component - Renders tabs for custom categories
 */
export function CustomCategoryTabs({
	visibleCategories,
	activeTab,
	getActiveTabStyleWrapper,
	getCategoryStyleWrapper,
}: CustomCategoryTabsProps) {
	const customCategories = visibleCategories.filter(
		(category) =>
			!HIDDEN_CATEGORIES.includes(category.toLowerCase() as any) &&
			category !== "Global" &&
			category.toLowerCase() !== "required"
	);

	return (
		<>
			{customCategories.map((category) => (
				<TabsTrigger
					key={category}
					value={category}
					className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
					style={
						activeTab === category
							? getActiveTabStyleWrapper(category)
							: getCategoryStyleWrapper(category)
					}
				>
					{category}
				</TabsTrigger>
			))}
		</>
	);
} 