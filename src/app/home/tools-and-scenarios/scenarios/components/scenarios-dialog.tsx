"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
	X,
	FileText,
	Settings,
	BarChart3,
	User,
	Calendar,
	Building2,
	Zap,
	Calculator,
	Target,
	TrendingUp,
	Info,
} from "lucide-react";
import type { SavedCalculationScenario } from "../mock-data";
import type {
	Industry,
	Technology,
} from "../../../admin/industries-and-technologies/types";

interface ScenariosDialogProps {
	scenario: SavedCalculationScenario | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	availableIndustries: Industry[];
	availableTechnologies: Technology[];
	resolvedNames: Record<string, string>;
}

export function ScenariosDialog({
	scenario,
	open,
	onOpenChange,
	availableIndustries,
	availableTechnologies,
	resolvedNames,
}: ScenariosDialogProps) {
	if (!scenario) return null;

	// Helper functions to get resolved names
	function getResolvedName(type: "solution" | "user", id: string): string {
		const cacheKey = `${type}_${id}`;
		return resolvedNames[cacheKey] || id;
	}

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

	function getResultInfo(results: any[]): {
		name: string;
		data: Record<string, any>;
	} {
		if (!results || results.length === 0) {
			return { name: "No Results", data: {} };
		}

		const firstResult = results[0];
		const resultKeys = Object.keys(firstResult);
		const resultName = resultKeys[0] || "Unknown";
		const resultData = firstResult[resultName];

		return { name: resultName, data: resultData || {} };
	}

	const resultInfo = getResultInfo(scenario.results);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						{scenario.scenario_name}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<Info className="h-5 w-5" />
								Scenario Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Industry and Technology */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<div>
									<h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
										<Building2 className="h-4 w-4" />
										Industry
									</h4>
									<div className="flex flex-wrap gap-1">
										{scenario.industry.map((industryId, index) => (
											<Badge key={index} variant="outline">
												{getIndustryName(industryId)}
											</Badge>
										))}
									</div>
								</div>
								<div>
									<h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
										<Zap className="h-4 w-4" />
										Technology
									</h4>
									<div className="flex flex-wrap gap-1">
										{scenario.technology.map((techId, index) => (
											<Badge key={index} variant="outline">
												{getTechnologyName(techId)}
											</Badge>
										))}
									</div>
								</div>
							</div>

							{/* Solution Information */}
							<div>
								<h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
									<Target className="h-4 w-4" />
									Solution
								</h4>
								<div className="flex flex-wrap gap-1">
									{scenario.solution.map((solutionId, index) => (
										<Badge key={index} variant="secondary">
											{getResolvedName("solution", solutionId)}
										</Badge>
									))}
									{scenario.solution_variant &&
										scenario.solution_variant !== "N/A" && (
											<Badge variant="secondary">
												{scenario.solution_variant}
											</Badge>
										)}
								</div>
							</div>

							{/* Comparison */}
							{scenario.compared_to && scenario.compared_to.length > 0 && (
								<div>
									<h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
										<TrendingUp className="h-4 w-4" />
										Comparison
									</h4>
									<div className="flex flex-wrap gap-1">
										<Badge variant="outline">
											Compared to: {scenario.compared_to.join(", ")}
										</Badge>
									</div>
								</div>
							)}

							{/* Metadata */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										Created by:
									</span>
									<span className="text-sm font-medium">
										{getResolvedName("user", scenario.user_id)}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										Created:
									</span>
									<span className="text-sm font-medium">
										{new Date(scenario.created_at).toLocaleDateString()}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										Updated:
									</span>
									<span className="text-sm font-medium">
										{new Date(scenario.updated_at).toLocaleDateString()}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Input Parameters */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<Settings className="h-5 w-5" />
								Input Parameters ({scenario.input_parameters?.length || 0})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
								{scenario.input_parameters?.map((param, index) => (
									<div key={index} className="border rounded-lg p-3">
										<div className="flex items-center justify-between mb-2">
											<h5 className="text-sm font-medium">{param.name}</h5>
											<Badge variant="outline" className="text-xs">
												{param.level}
											</Badge>
										</div>
										<div className="space-y-1">
											<div className="flex justify-between text-xs">
												<span className="text-muted-foreground">Default:</span>
												<span className="font-medium">
													{param.defaultValue} {param.units}
												</span>
											</div>
											{param.overrideValue !== null && (
												<div className="flex justify-between text-xs">
													<span className="text-muted-foreground">
														Override:
													</span>
													<span className="font-medium text-blue-600">
														{param.overrideValue} {param.units}
													</span>
												</div>
											)}
											<div className="flex justify-between text-xs">
												<span className="text-muted-foreground">Category:</span>
												<Badge variant="outline" className="text-xs">
													{param.category}
												</Badge>
											</div>
										</div>
										{param.description && (
											<p className="text-xs text-muted-foreground mt-2">
												{param.description}
											</p>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Results */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<BarChart3 className="h-5 w-5" />
								Results - {resultInfo.name}
							</CardTitle>
						</CardHeader>
						<CardContent>
							{Object.keys(resultInfo.data).length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
									{Object.entries(resultInfo.data).map(([key, value]) => (
										<div key={key} className="border rounded-lg p-3">
											<div className="flex items-center justify-between mb-2">
												<h5 className="text-sm font-medium capitalize">
													{key.replace(/_/g, " ")}
												</h5>
											</div>
											<div className="text-2xl font-bold text-primary">
												{typeof value === "number"
													? value.toLocaleString()
													: value}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									<Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p>No results available</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
