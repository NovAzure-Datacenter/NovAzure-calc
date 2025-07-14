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
import type { ScenarioData } from "@/lib/actions/scenarios/scenarios";
import type {
	Industry,
	Technology,
} from "../../../admin/industries-and-technologies/types";

interface ScenariosDialogProps {
	scenario: ScenarioData | null;
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

	function getResultInfo(results: any): {
		name: string;
		data: Record<string, any>;
		keyMetrics?: any;
	} {
		if (!results || typeof results !== 'object') {
			return { name: "No Results", data: {} };
		}

		// For value calculator scenarios, extract key financial metrics
		const keyMetrics = {
			tco: results.tco_including_it || results.tco_excluding_it || 0,
			capex: results.total_capex || 0,
			opex: results.total_opex_over_lifetime || 0,
			annualCoolingOpex: results.annual_cooling_opex || 0,
			annualItMaintenance: results.annual_it_maintenance || 0,
		};

		return { 
			name: "Value Calculator", 
			data: results,
			keyMetrics 
		};
	}

	function getInputParametersInfo(inputParams: any): { 
		dataCenterType?: string; 
		location?: string; 
		capacity?: string; 
		utilization?: string;
		years?: string;
		firstYear?: string;
		airPpue?: string;
		defaultAirPpue?: string;
		allParams?: Record<string, any>;
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
			firstYear: inputParams.first_year_operation,
			airPpue: inputParams.air_annualized_ppue,
			defaultAirPpue: inputParams.default_air_ppue,
			allParams: inputParams,
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

	const resultInfo = getResultInfo(scenario.results);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[50vw] max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<FileText className="h-4 w-4" />
						{scenario.scenario_name}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Basic Information */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<Info className="h-4 w-4" />
								Scenario Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{/* Solution Information */}
							<div>
								<h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
									<Target className="h-3 w-3" />
									Solution
								</h4>
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

							{/* Comparison */}
							{scenario.compared_to && scenario.compared_to.length > 0 && (
								<div>
									<h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
										<TrendingUp className="h-3 w-3" />
										Comparison
									</h4>
									<div className="flex flex-wrap gap-1">
										<Badge variant="outline" className="text-xs">
											Compared to: {scenario.compared_to.join(", ")}
										</Badge>
									</div>
								</div>
							)}

							{/* Metadata */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
								<div className="flex items-center gap-1">
									<User className="h-3 w-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										Created by:
									</span>
									<span className="text-xs font-medium">
										{getResolvedName("user", scenario.user_id)}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="h-3 w-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										Created:
									</span>
									<span className="text-xs font-medium">
										{new Date(scenario.created_at).toLocaleDateString()}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="h-3 w-3 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										Updated:
									</span>
									<span className="text-xs font-medium">
										{new Date(scenario.updated_at).toLocaleDateString()}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Input Parameters */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<Settings className="h-4 w-4" />
								Configuration Parameters
							</CardTitle>
						</CardHeader>
						<CardContent>
							{(() => {
								const inputInfo = getInputParametersInfo(scenario.input_parameters);
								if (inputInfo.allParams) {
									return (
										<div className="space-y-4">
											{/* Key Configuration */}
											<div>
												<h4 className="text-xs font-medium text-muted-foreground mb-2">
													Data Center Configuration
												</h4>
												<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
													{inputInfo.dataCenterType && (
														<div className="border rounded-md p-2">
															<div className="text-xs text-muted-foreground mb-1">Type</div>
															<div className="text-sm font-medium text-primary">
																{inputInfo.dataCenterType}
															</div>
														</div>
													)}
													{inputInfo.location && (
														<div className="border rounded-md p-2">
															<div className="text-xs text-muted-foreground mb-1">Location</div>
															<div className="text-sm font-medium text-primary">
																{inputInfo.location}
															</div>
														</div>
													)}
													{inputInfo.capacity && (
														<div className="border rounded-md p-2">
															<div className="text-xs text-muted-foreground mb-1">Capacity</div>
															<div className="text-sm font-medium text-primary">
																{inputInfo.capacity} MW
															</div>
														</div>
													)}
													{inputInfo.utilization && (
														<div className="border rounded-md p-2">
															<div className="text-xs text-muted-foreground mb-1">Utilization</div>
															<div className="text-sm font-medium text-primary">
																{inputInfo.utilization}
															</div>
														</div>
													)}
													{inputInfo.years && (
														<div className="border rounded-md p-2">
															<div className="text-xs text-muted-foreground mb-1">Years</div>
															<div className="text-sm font-medium text-primary">
																{inputInfo.years}
															</div>
														</div>
													)}
													{inputInfo.firstYear && (
														<div className="border rounded-md p-2">
															<div className="text-xs text-muted-foreground mb-1">First Year</div>
															<div className="text-sm font-medium text-primary">
																{inputInfo.firstYear}
															</div>
														</div>
													)}
												</div>
											</div>

											{/* Energy Efficiency */}
											{(inputInfo.airPpue || inputInfo.defaultAirPpue) && (
												<div>
													<h4 className="text-xs font-medium text-muted-foreground mb-2">
														Energy Efficiency
													</h4>
													<div className="grid grid-cols-2 gap-3">
														{inputInfo.airPpue && (
															<div className="border rounded-md p-2">
																<div className="text-xs text-muted-foreground mb-1">Air PPUE</div>
																<div className="text-sm font-medium text-primary">
																	{inputInfo.airPpue}
																</div>
															</div>
														)}
														{inputInfo.defaultAirPpue && (
															<div className="border rounded-md p-2">
																<div className="text-xs text-muted-foreground mb-1">Default PPUE</div>
																<div className="text-sm font-medium text-primary">
																	{inputInfo.defaultAirPpue}
																</div>
															</div>
														)}
													</div>
												</div>
											)}

											{/* All Parameters */}
											<div>
												<h4 className="text-xs font-medium text-muted-foreground mb-2">
													All Parameters
												</h4>
												<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
													{Object.entries(inputInfo.allParams).map(([key, value]) => (
														<div key={key} className="border rounded-md p-2">
															<div className="text-xs text-muted-foreground mb-1 capitalize">
																{key.replace(/_/g, " ")}
															</div>
															<div className="text-sm font-medium text-primary">
																{String(value)}
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									);
								}
								return (
									<div className="text-center py-6 text-muted-foreground">
										<Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
										<p className="text-sm">No configuration parameters available</p>
									</div>
								);
							})()}
						</CardContent>
					</Card>

					{/* Results */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<BarChart3 className="h-4 w-4" />
								Financial Results - {resultInfo.name}
							</CardTitle>
						</CardHeader>
						<CardContent>
							{(() => {
								if (resultInfo.keyMetrics) {
									return (
										<div className="space-y-4">
											{/* Key Financial Metrics */}
											<div>
												<h4 className="text-xs font-medium text-muted-foreground mb-2">
													Key Financial Metrics
												</h4>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
													<div className="border rounded-md p-3 bg-green-50">
														<div className="text-xs text-muted-foreground mb-1">TCO</div>
														<div className="text-lg font-bold text-green-600">
															{formatCurrency(resultInfo.keyMetrics.tco)}
														</div>
													</div>
													<div className="border rounded-md p-3 bg-blue-50">
														<div className="text-xs text-muted-foreground mb-1">CAPEX</div>
														<div className="text-lg font-bold text-blue-600">
															{formatCurrency(resultInfo.keyMetrics.capex)}
														</div>
													</div>
													<div className="border rounded-md p-3 bg-orange-50">
														<div className="text-xs text-muted-foreground mb-1">OPEX</div>
														<div className="text-lg font-bold text-orange-600">
															{formatCurrency(resultInfo.keyMetrics.opex)}
														</div>
													</div>
												</div>
											</div>

											{/* Annual Costs */}
											<div>
												<h4 className="text-xs font-medium text-muted-foreground mb-2">
													Annual Costs
												</h4>
												<div className="grid grid-cols-2 gap-3">
													<div className="border rounded-md p-2">
														<div className="text-xs text-muted-foreground mb-1">Annual Cooling OPEX</div>
														<div className="text-sm font-medium text-primary">
															{formatCurrency(resultInfo.keyMetrics.annualCoolingOpex)}
														</div>
													</div>
													<div className="border rounded-md p-2">
														<div className="text-xs text-muted-foreground mb-1">Annual IT Maintenance</div>
														<div className="text-sm font-medium text-primary">
															{formatCurrency(resultInfo.keyMetrics.annualItMaintenance)}
														</div>
													</div>
												</div>
											</div>

											{/* All Results */}
											<div>
												<h4 className="text-xs font-medium text-muted-foreground mb-2">
													All Financial Results
												</h4>
												<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
													{Object.entries(resultInfo.data).map(([key, value]) => (
														<div key={key} className="border rounded-md p-2">
															<div className="text-xs text-muted-foreground mb-1 capitalize">
																{key.replace(/_/g, " ")}
															</div>
															<div className="text-sm font-medium text-primary">
																{typeof value === "number" 
																	? formatCurrency(value)
																	: value.toLocaleString()
																}
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									);
								}
								
								if (Object.keys(resultInfo.data).length > 0) {
									return (
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
											{Object.entries(resultInfo.data).map(([key, value]) => (
												<div key={key} className="border rounded-md p-2">
													<div className="text-xs text-muted-foreground mb-1 capitalize">
														{key.replace(/_/g, " ")}
													</div>
													<div className="text-sm font-medium text-primary">
														{typeof value === "number"
															? value.toLocaleString()
															: value}
													</div>
												</div>
											))}
										</div>
									);
								}
								
								return (
									<div className="text-center py-6 text-muted-foreground">
										<Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
										<p className="text-sm">No results available</p>
									</div>
								);
							})()}
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
