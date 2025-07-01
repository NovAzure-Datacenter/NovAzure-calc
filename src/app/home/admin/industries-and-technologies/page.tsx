"use client";

import type React from "react";
import { useState } from "react";
import {
	Search,
	Grid3X3,
	List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sampleData } from "./constants";
import { TableView } from "./components/list-view";
import { GridView } from "./components/grid-view";
import { CreateIndustryDialog } from "./components/create-industry-dialog";
import { CreateTechnologyDialog } from "./components/create-technology-dialog";
import type { Industry, Technology } from "./types";

export default function IndustriesAndTechnologies() {
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");
	const [searchQuery, setSearchQuery] = useState("");
	const [data, setData] = useState<Industry[]>(sampleData);

	const filteredData = data.filter(
		(industry) =>
			industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			industry.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleCreateIndustry = (newIndustry: Omit<Industry, "id" | "status">) => {
		const industryWithId: Industry = {
			...newIndustry,
			id: Date.now().toString(), // Simple ID generation
			status: "pending" as const,
		};
		setData([...data, industryWithId]);
	};

	const handleCreateTechnology = (newTechnology: Technology) => {
		// For now, we'll just show a success message
		// In a real app, you might want to add this to a global technology pool
		// or associate it with a specific industry
		console.log("New technology created:", newTechnology);
		// You could implement logic here to add the technology to a specific industry
		// or create a global technology management system
	};

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<div className="space-y-6">
				{/* Header */}
				<Card className="w-full">
					<CardContent className=" w-full">
						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search industries and technologies..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>
							<div className="flex items-center gap-2">
								<CreateIndustryDialog onCreate={handleCreateIndustry} />
								<CreateTechnologyDialog onCreate={handleCreateTechnology} />
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
				</Card>

				{/* Content */}
				<div className="w-full">
				{viewMode === "table" ? (
					<TableView data={filteredData} />
				) : (
					<GridView data={filteredData} />
				)}
				</div>
			</div>
		</div>
	);
}
