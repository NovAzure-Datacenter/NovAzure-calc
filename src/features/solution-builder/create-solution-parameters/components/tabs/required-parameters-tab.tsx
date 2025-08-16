import { TabsTrigger } from "@/components/ui/tabs";

/**
 * RequiredParametersTab component - Renders the "Required" tab
 */
export function RequiredParametersTab() {
	return (
		<TabsTrigger
			value="required"
			className="text-muted-foreground bg-background/80 hover:bg-background border-backdrop h-8 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
		>
			Required
		</TabsTrigger>
	);
} 