import { Parameter } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function Searchbar({
	searchQuery,
	setSearchQuery,
	filteredParameters,
}: {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filteredParameters: Parameter[];
}) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setSearchQuery("");
		}
	};

	return (
		<div className="mb-4">
			<div className="relative">
				<Input
					placeholder="Search parameters by name, category, description, value, unit, provider, or input type..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					className="pl-10 pr-10"
				/>
				<div className="absolute left-3 top-1/2 -translate-y-1/2">
					<Search className="h-4 w-4 text-muted-foreground" />
				</div>
				{searchQuery && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSearchQuery("")}
						className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
						title="Clear search (Esc)"
					>
						<X className="h-3 w-3" />
					</Button>
				)}
			</div>
			{searchQuery && (
				<div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
					<span>
						Searching for: &quot;{searchQuery}&quot; • {filteredParameters.length} result
						{filteredParameters.length !== 1 ? "s" : ""}
					</span>
					{searchQuery && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setSearchQuery("")}
							className="h-6 px-2 text-xs"
						>
							Clear
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
