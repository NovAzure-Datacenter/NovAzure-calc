"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { Grid3X3, RefreshCw, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import SolutionsList from "./solutions-list";

export function SolutionsMain() {
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
	const [isLoading, setIsLoading] = useState(false);

	const handleRefresh = () => {
		// Trigger a refresh of the data
		loadData();
	};

	const loadData = async () => {
		setIsLoading(true);
		try {
			// TODO: Implement data loading logic
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	
	return <div className="space-y-6">
			{/* Header */}
			<Card className="w-full">
				<CardContent className="w-full">
					<div className="flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search solutions..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleRefresh}
								className="text-xs"
								disabled={isLoading}
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								Refresh
							</Button>

							<Button
								variant={viewMode === "grid" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("grid")}
							>
								<Grid3X3 className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "table" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("table")}
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>

				<SolutionsList />
			</Card>
	</div>;
}