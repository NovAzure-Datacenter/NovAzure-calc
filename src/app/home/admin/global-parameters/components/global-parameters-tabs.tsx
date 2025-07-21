import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GlobalParametersTabs({
	activeTab,
	setActiveTab,
	getActiveTabStyleWrapper,
	getCategoryStyleWrapper,
}: {
	activeTab: string;
	setActiveTab: (value: string) => void;
	getActiveTabStyleWrapper: (value: string) => React.CSSProperties;
	getCategoryStyleWrapper: (value: string) => React.CSSProperties;
}) {
	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
			<TabsList className="flex w-auto bg-muted/50 space-x-1 justify-start">
				<TabsTrigger
					value="All"
					className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
					style={
						activeTab === "All"
							? getActiveTabStyleWrapper("All")
							: getCategoryStyleWrapper("All")
					}
				>
					All
				</TabsTrigger>
				<TabsTrigger
					value="Global"
					className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
					style={
						activeTab === "Global"
							? getActiveTabStyleWrapper("Global")
							: getCategoryStyleWrapper("Global")
					}
				>
					Global
				</TabsTrigger>
				<TabsTrigger
					value="Industry"
					className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
					style={
						activeTab === "Industry"
							? getActiveTabStyleWrapper("Industry")
							: getCategoryStyleWrapper("Industry")
					}
				>
					Industry
				</TabsTrigger>
				<TabsTrigger
					value="Technology"
					className="text-muted-foreground text-sm bg-background/80 hover:bg-background border-backdrop"
					style={
						activeTab === "Technology"
							? getActiveTabStyleWrapper("Technology")
							: getCategoryStyleWrapper("Technology")
					}
				>
					Technology
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
