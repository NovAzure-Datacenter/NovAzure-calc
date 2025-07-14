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

	// Helper function to get scenario names from compared_to IDs
	function getComparedScenarioNames(comparedToIds: string[]): string[] {
		return comparedToIds.map(id => {
			const comparedScenario = scenarios.find(s => s.id === id);
			return comparedScenario?.scenario_name || id;
		});
	}

	function getResultInfo(results: any): { name: string; count: number; keyMetrics?: any } {
		if (!results || typeof results !== 'object') {
			return { name: "No Results", count: 0 };
		}

		// For value calculator scenarios, extract key financial metrics
		const keyMetrics = {
			tco: results.tco_including_it || results.tco_excluding_it || 0,
			capex: results.total_capex || 0,
			opex: results.total_opex_over_lifetime || 0,
		};

		return { 
			name: "Value Calculator", 
			count: Object.keys(results).length,
			keyMetrics 
		};
	}

	function getInputParametersInfo(inputParams: any): { 
		dataCenterType?: string; 
		location?: string; 
		capacity?: string; 
		utilization?: string;
		years?: string;
	} {
		if (!inputParams || typeof inputParams !== 'object') {
			return {};
		}

		return {
			dataCenterType: inputParams.data_centre_type,
			location: inputParams.project_location,
			capacity: inputParams.data_hall_capacity,
			utilization: inputParams.utilisation_percentage,
			years: inputParams.planned_years_operation,
		};
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
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
													Compared to: {getComparedScenarioNames(scenario.compared_to).join(", ")}
												</Badge>
											</div>
										</div>
									)}

									{/* Creation date */}
									{scenario.created_at && (
										<div className="mt-1">
											<div className="text-xs text-muted-foreground">
												Created: {new Date(scenario.created_at).toLocaleDateString()}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</CardHeader>

					{/* Scenario-specific information */}
					<CardContent className="pt-0 pb-3 space-y-3">
						{/* Input Parameters */}
						{scenario.input_parameters && (
							<div>
								<div className="text-xs font-medium text-muted-foreground mb-1">
									Configuration
								</div>
								<div className="space-y-1">
									{(() => {
										const inputInfo = getInputParametersInfo(scenario.input_parameters);
										return (
											<>
												{inputInfo.dataCenterType && (
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">Type:</span>
														<span className="font-medium">{inputInfo.dataCenterType}</span>
													</div>
												)}
												{inputInfo.location && (
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">Location:</span>
														<span className="font-medium">{inputInfo.location}</span>
													</div>
												)}
												{inputInfo.capacity && (
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">Capacity:</span>
														<span className="font-medium">{inputInfo.capacity} MW</span>
													</div>
												)}
												{inputInfo.utilization && (
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">Utilization:</span>
														<span className="font-medium">{inputInfo.utilization}</span>
													</div>
												)}
												{inputInfo.years && (
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">Years:</span>
														<span className="font-medium">{inputInfo.years}</span>
													</div>
												)}
											</>
										);
									})()}
								</div>
							</div>
						)}

						{/* Financial Results */}
						{scenario.results && (
							<div>
								<div className="text-xs font-medium text-muted-foreground mb-1">
									Financial Results
								</div>
								<div className="space-y-1">
									{(() => {
										const resultInfo = getResultInfo(scenario.results);
										if (resultInfo.keyMetrics) {
											return (
												<>
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">TCO:</span>
														<span className="font-medium text-green-600">
															{formatCurrency(resultInfo.keyMetrics.tco)}
														</span>
													</div>
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">CAPEX:</span>
														<span className="font-medium text-blue-600">
															{formatCurrency(resultInfo.keyMetrics.capex)}
														</span>
													</div>
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">OPEX:</span>
														<span className="font-medium text-orange-600">
															{formatCurrency(resultInfo.keyMetrics.opex)}
														</span>
													</div>
												</>
											);
										}
										return (
											<Badge variant="outline" className="text-xs">
												{resultInfo.name}: {resultInfo.count} values
											</Badge>
										);
									})()}
								</div>
							</div>
						)}

						{/* Solution badges - only show if there are solutions */}
						{scenario.solution && scenario.solution.length > 0 && (
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
						)}
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
