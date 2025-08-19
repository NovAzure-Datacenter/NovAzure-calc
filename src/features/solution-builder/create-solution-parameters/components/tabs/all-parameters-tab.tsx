import { TabsTrigger } from "@/components/ui/tabs";

/**
 * AllParametersTab component - Renders the "All" tab
 */
export function AllParametersTab() {
	return (
		<TabsTrigger
			value="all"
			className="text-muted-foreground bg-background/80 hover:bg-background border-backdrop h-8 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
		>
			All
		</TabsTrigger>
	);
} 