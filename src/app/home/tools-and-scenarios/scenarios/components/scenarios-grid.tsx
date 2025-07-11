"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScenarioData } from "@/lib/actions/scenarios/scenarios";
import type {
	Industry,
	Technology,
} from "../../../admin/industries-and-technologies/types";

interface ScenariosGridProps {
	scenarios: ScenarioData[];
	availableIndustries: Industry[];
	availableTechnologies: Technology[];
	resolvedNames: Record<string, string>;
	onScenarioClick: (scenario: ScenarioData) => void;
}

export function ScenariosGrid({
	scenarios,
	availableIndustries,
	availableTechnologies,
	resolvedNames,
	onScenarioClick,
}: ScenariosGridProps) {
	// Helper functions to resolve IDs to names
	function getIndustryName(industryId: string): string {
		const industry = availableIndustries.find((ind) => ind.id === industryId);
		return industry?.name || industryId;
	}

	function getTechnologyName(technologyId: string): string {
		const technology = availableTechnologies.find(
			(tech) => tech.id === technologyId
		);
		return technology?.name || technologyId;
	}

	function getResolvedName(type: "solution" | "user", id: string): string {
		const cacheKey = `${type}_${id}`;
		return resolvedNames[cacheKey] || id;
	}

	function getResultInfo(results: any[]): { name: string; count: number } {
		if (!results || results.length === 0) {
			return { name: "No Results", count: 0 };
		}

		const firstResult = results[0];
		const resultKeys = Object.keys(firstResult);
		const resultName = resultKeys[0] || "Unknown";
		const resultData = firstResult[resultName];
		const dataKeys = resultData ? Object.keys(resultData) : [];

		return { name: resultName, count: dataKeys.length };
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{scenarios.map((scenario) => (
				<Card
					key={scenario.id}
					className="cursor-pointer hover:shadow-md transition-shadow group relative"
					onClick={() => onScenarioClick(scenario)}
				>
					{/* Status badge at top right */}
					<Badge variant="default" className="absolute top-2 right-2 text-xs">
						verified
					</Badge>

					<CardHeader className="pb-2 pt-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
									<FileText className="h-4 w-4 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<CardTitle className="text-sm font-medium truncate">
										{scenario.scenario_name}
									</CardTitle>

									{/* Comparison info below scenario name */}
									{scenario.compared_to && scenario.compared_to.length > 0 && (
										<div className="mt-2">
											<div className="flex flex-wrap gap-1">
												<Badge variant="outline" className="text-xs">
													Compared to: {scenario.compared_to.join(", ")}
												</Badge>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</CardHeader>

					{/* Scenario-specific information */}
					<CardContent className="pt-0 pb-3 space-y-3">
						{/* Solution badges */}
						<div>
							<div className="text-xs font-medium text-muted-foreground mb-1">
								Solution
							</div>
							<div className="flex flex-wrap gap-1">
								{scenario.solution.map((solutionId, index) => (
									<Badge key={index} variant="secondary" className="text-xs">
										{getResolvedName("solution", solutionId)}
									</Badge>
								))}
								{scenario.solution_variant &&
									scenario.solution_variant !== "N/A" && (
										<Badge variant="secondary" className="text-xs">
											{scenario.solution_variant}
										</Badge>
									)}
							</div>
						</div>

						{/* Parameters and Results on same horizontal line */}
						<div>
							<div className="text-xs font-medium text-muted-foreground mb-1">
								Parameters & Results
							</div>
							<div className="flex flex-wrap gap-2">
								<Badge variant="outline" className="text-xs">
									{scenario.input_parameters?.length || 0} parameters
								</Badge>
								{scenario.results &&
									scenario.results.length > 0 &&
									(() => {
										const resultInfo = getResultInfo(scenario.results);
										return (
											<Badge variant="outline" className="text-xs">
												{resultInfo.name}: {resultInfo.count} values
											</Badge>
										);
									})()}
							</div>
						</div>
					</CardContent>

					{/* User info at bottom right - always positioned at bottom */}
					<div className="absolute bottom-2 right-2">
						<Badge variant="outline" className="text-xs">
							{getResolvedName("user", scenario.user_id)}
						</Badge>
					</div>
				</Card>
			))}
		</div>
	);
}
