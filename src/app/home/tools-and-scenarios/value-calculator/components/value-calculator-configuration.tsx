import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Cpu, Package, ChevronDown, ChevronUp } from "lucide-react";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import React from "react";
import {
	ClientSolution,
} from "@/lib/actions/clients-solutions/clients-solutions";
import MockButton from "./mock-button";
import CalculateButton from "./calculate-button";
import GlobalConfigCard from "./global-config-card";

interface ValueCalculatorConfigurationProps {
	onCalculate?: () => void;
	selectedIndustry: string;
	setSelectedIndustry: Dispatch<SetStateAction<string>>;
	selectedTechnology: string;
	setSelectedTechnology: Dispatch<SetStateAction<string>>;
	selectedSolution: string;
	setSelectedSolution: Dispatch<SetStateAction<string>>;
	solutionVariantA: string;
	setSolutionVariantA: Dispatch<SetStateAction<string>>;
	solutionVariantB: string;
	setSolutionVariantB: Dispatch<SetStateAction<string>>;
	dataCenterType: string;
	setDataCenterType: Dispatch<SetStateAction<string>>;
	projectLocation: string;
	setProjectLocation: Dispatch<SetStateAction<string>>;
	utilisationPercentage: string;
	setUtilisationPercentage: Dispatch<SetStateAction<string>>;
	dataHallCapacity: string;
	setDataHallCapacity: Dispatch<SetStateAction<string>>;
	plannedYears: string;
	setPlannedYears: Dispatch<SetStateAction<string>>;
	firstYearOperation: string;
	setFirstYearOperation: Dispatch<SetStateAction<string>>;
	comparisonMode: "single" | "compare" | null;
	setComparisonMode: Dispatch<SetStateAction<"single" | "compare" | null>>;
	// Data from parent component
	clientSolutions: ClientSolution[];
	isLoadingSolutions: boolean;
	solutionTypes: any[];
	isLoadingSolutionTypes: boolean;
	industries: any[];
	technologies: any[];
	isLoadingIndustries: boolean;
	isLoadingTechnologies: boolean;
	clientData: any;
	fetchedSolutionA: ClientSolution | null;
	isLoadingSolutionA: boolean;
	fetchedSolutionB: ClientSolution | null;
	isLoadingSolutionB: boolean;
	parameterValues: Record<string, any>;
	setParameterValues: Dispatch<SetStateAction<Record<string, any>>>;
	setResultData: Dispatch<SetStateAction<any>>;
}

export default function ValueCalculatorConfiguration({
	onCalculate,
	selectedIndustry,
	setSelectedIndustry,
	selectedTechnology,
	setSelectedTechnology,
	selectedSolution,
	setSelectedSolution,
	solutionVariantA,
	setSolutionVariantA,
	solutionVariantB,
	setSolutionVariantB,
	dataCenterType,
	setDataCenterType,
	projectLocation,
	setProjectLocation,
	utilisationPercentage,
	setUtilisationPercentage,
	dataHallCapacity,
	setDataHallCapacity,
	plannedYears,
	setPlannedYears,
	firstYearOperation,
	setFirstYearOperation,
	comparisonMode,
	setComparisonMode,
	// Data from parent component
	clientSolutions,
	isLoadingSolutions,
	solutionTypes,
	isLoadingSolutionTypes,
	industries,
	technologies,
	isLoadingIndustries,
	isLoadingTechnologies,
	clientData,
	fetchedSolutionA,
	isLoadingSolutionA,
	fetchedSolutionB,
	isLoadingSolutionB,
	parameterValues,
	setParameterValues,
	setResultData,

}: ValueCalculatorConfigurationProps) {
	// Helper function to get parameters from a solution
	const getSolutionParameters = (solution: any, category: string) => {
		if (!solution?.parameters) return [];
		return solution.parameters.filter(
			(param: any) =>
				(param.user_interface === "input" || param.user_interface === "static") &&
				param.category?.name === category
		);
	};

	const availableTechnologies = selectedIndustry
		? technologies.filter((tech) =>
				industries
					.find((industry) => industry.id === selectedIndustry)
					?.technologies?.some((t: any) => t.id === tech.id)
		  )
		: [];

	const availableSolutionTypes =
		selectedIndustry && selectedTechnology ? solutionTypes : [];

	const availableSolutions = selectedTechnology
		? clientSolutions.filter(
				(solution) => solution.technology_id === selectedTechnology
		  )
		: [];

	const availableSolutionVariants = selectedSolution
		? clientSolutions.filter(
				(solution) =>
					solution.industry_id === selectedIndustry &&
					solution.technology_id === selectedTechnology
		  )
		: [];

	const handleIndustryChange = (industryId: string) => {
		setSelectedIndustry(industryId);
		setSelectedTechnology("");
		setSelectedSolution("");
	};

	const handleTechnologyChange = (technologyId: string) => {
		setSelectedTechnology(technologyId);
		setSelectedSolution("");
	};

	const handleSolutionChange = (solutionId: string) => {
		setSelectedSolution(solutionId);
		setSolutionVariantA("");
		setSolutionVariantB("");
	};

	const handleParameterValueChange = (parameterId: string, value: any) => {
		setParameterValues((prev) => ({
			...prev,
			[parameterId]: value,
		}));
	};

	return (
		<div className="space-y-6">
			{/* No Industries Available Warning Card */}
			{!isLoadingIndustries && industries.length === 0 && (
				<Card className="w-full border-orange-200 bg-orange-50">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 text-orange-800">
							<Building2 className="h-4 w-4" />
							<span className="text-sm font-medium">
								No industries available for your company. Please contact your
								administrator to request access to specific industries.
							</span>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Industry, Technology, and Solution Selection Card */}
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-lg">Compare Solutions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-3">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								Industry
							</Label>
							<Select
								value={selectedIndustry}
								onValueChange={handleIndustryChange}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={
											isLoadingIndustries
												? "Loading industries..."
												: "Select an industry"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{industries.length === 0 && !isLoadingIndustries ? (
										<SelectItem value="no-industries" disabled>
											No industries available for your company
										</SelectItem>
									) : (
										industries.map((industry) => (
											<SelectItem key={industry.id} value={industry.id}>
												<div className="flex items-center gap-2">
													<Building2 className="h-4 w-4" />
													{industry.name}
												</div>
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Cpu className="h-4 w-4" />
								Technology
							</Label>
							<Select
								value={selectedTechnology}
								onValueChange={handleTechnologyChange}
								disabled={!selectedIndustry}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={
											selectedIndustry
												? isLoadingTechnologies
													? "Loading technologies..."
													: "Select a technology"
												: "Select an industry first"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{availableTechnologies.length === 0 &&
									!isLoadingTechnologies ? (
										<SelectItem value="no-technologies" disabled>
											No technologies available for selected industry
										</SelectItem>
									) : (
										availableTechnologies.map((technology) => (
											<SelectItem key={technology.id} value={technology.id}>
												<div className="flex items-center gap-2">
													<Cpu className="h-4 w-4" />
													{technology.name}
												</div>
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Package className="h-4 w-4" />
								Solution
							</Label>
							<Select
								value={selectedSolution}
								onValueChange={handleSolutionChange}
								disabled={!selectedTechnology}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={
											selectedTechnology
												? isLoadingSolutionTypes
													? "Loading solutions..."
													: "Select a solution"
												: "Select a technology first"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{availableSolutionTypes.length === 0 &&
									!isLoadingSolutionTypes ? (
										<SelectItem value="no-solutions" disabled>
											No solutions found for selected industry and technology
										</SelectItem>
									) : (
										availableSolutionTypes.map((solutionType) => (
											<SelectItem
												key={solutionType.id || ""}
												value={solutionType.id || ""}
											>
												<div className="flex items-center gap-2">
													<Package className="h-4 w-4" />
													{solutionType.name}
												</div>
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Solution Variants Selection and Comparison Card */}
			{selectedSolution && (
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-lg">Solution Variants</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{!comparisonMode && (
							<div className="space-y-4">
								<Label className="text-sm font-medium">
									Would you like to compare two solutions or view a single one?
								</Label>
								<div className="flex justify-center gap-4">
									<Button
										onClick={() => setComparisonMode("single")}
										className="w-48"
									>
										View Single Solution
									</Button>
									<Button
										onClick={() => setComparisonMode("compare")}
										className="w-48"
									>
										Compare Two Solutions
									</Button>
								</div>
							</div>
						)}

						{comparisonMode === "single" && (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-sm font-medium">
										Solution Variant
									</Label>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setComparisonMode(null)}
									>
										Change Mode
									</Button>
								</div>

								{solutionVariantA && (
									<div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 bg-gray-500 rounded-full"></div>
											<div className="flex-1">
												<div className="font-medium text-gray-900">
													{clientSolutions.find((s) => s.id === solutionVariantA)?.solution_name ||
														"Selected Solution"}
												</div>
												<div className="text-sm text-gray-700">
													{clientSolutions.find((s) => s.id === solutionVariantA)?.solution_description ||
														"No description available"}
												</div>
											</div>
										</div>
									</div>
								)}

								<Select
									value={solutionVariantA}
									onValueChange={setSolutionVariantA}
								>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={
												isLoadingSolutions
													? "Loading variants..."
													: "Select a variant"
											}
										/>
									</SelectTrigger>
									<SelectContent>
										{availableSolutionVariants.length === 0 &&
										!isLoadingSolutions ? (
											<SelectItem value="no-variants" disabled>
												No variants found for selected solution type
											</SelectItem>
										) : (
											availableSolutionVariants.map((variant) => (
												<SelectItem
													key={variant.id || ""}
													value={variant.id || ""}
												>
													<div className="space-y-1">
														<div className="font-medium">
															{variant.solution_name}
														</div>
													</div>
												</SelectItem>
											))
										)}
									</SelectContent>
								</Select>
							</div>
						)}

						{comparisonMode === "compare" && (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-sm font-medium">
										Solution Variants Comparison
									</Label>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setComparisonMode(null)}
									>
										Change Mode
									</Button>
								</div>

								{(solutionVariantA || solutionVariantB) && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{solutionVariantA && (
											<div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
												<div className="flex items-center gap-3">
													<div className="w-3 h-3 bg-gray-500 rounded-full"></div>
													<div className="flex-1">
														<div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
															Variant A
														</div>
														<div className="font-medium text-gray-900">
															{clientSolutions.find((s) => s.id === solutionVariantA)?.solution_name ||
																"Selected Solution"}
														</div>
														<div className="text-sm text-gray-700">
															{clientSolutions.find((s) => s.id === solutionVariantA)?.solution_description ||
																"No description available"}
														</div>
													</div>
												</div>
											</div>
										)}

										{solutionVariantB && (
											<div className="p-4 bg-white border border-gray-200 rounded-lg">
												<div className="flex items-center gap-3">
													<div className="w-3 h-3 bg-gray-400 rounded-full"></div>
													<div className="flex-1">
														<div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
															Variant B
														</div>
														<div className="font-medium text-gray-800">
															{clientSolutions.find((s) => s.id === solutionVariantB)?.solution_name ||
																"Selected Solution"}
														</div>
														<div className="text-sm text-gray-600">
															{clientSolutions.find((s) => s.id === solutionVariantB)?.solution_description ||
																"No description available"}
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								)}

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-4">
										<Label className="text-sm font-medium flex items-center gap-2">
											<div className="w-2 h-2 bg-gray-500 rounded-full"></div>
											Solution Variant A
										</Label>
										<Select
											value={solutionVariantA}
											onValueChange={setSolutionVariantA}
										>
											<SelectTrigger className="w-full">
												<SelectValue
													placeholder={
														isLoadingSolutions
															? "Loading variants..."
															: "Select variant A"
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{availableSolutionVariants.length === 0 &&
												!isLoadingSolutions ? (
													<SelectItem value="no-variants" disabled>
														No variants found for selected solution type
													</SelectItem>
												) : (
													availableSolutionVariants.map((variant) => (
														<SelectItem
															key={variant.id || ""}
															value={variant.id || ""}
														>
															<div className="space-y-1">
																<div className="font-medium">
																	{variant.solution_name}
																</div>
															</div>
														</SelectItem>
													))
												)}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-4">
										<Label className="text-sm font-medium flex items-center gap-2">
											<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
											Solution Variant B
										</Label>
										<Select
											value={solutionVariantB}
											onValueChange={setSolutionVariantB}
										>
											<SelectTrigger className="w-full">
												<SelectValue
													placeholder={
														isLoadingSolutions
															? "Loading variants..."
															: "Select variant B"
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{availableSolutionVariants.length === 0 &&
												!isLoadingSolutions ? (
													<SelectItem value="no-variants" disabled>
														No variants found for selected solution type
													</SelectItem>
												) : (
													availableSolutionVariants.map((variant) => (
														<SelectItem
															key={variant.id || ""}
															value={variant.id || ""}
														>
															<div className="space-y-1">
																<div className="font-medium">
																	{variant.solution_name}
																</div>
															</div>
														</SelectItem>
													))
												)}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Global Configuration Card - Display Solution Parameters */}
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<div className="space-y-6">
					<GlobalConfigCard
				comparisonMode={comparisonMode}
				solutionVariantA={solutionVariantA}
				solutionVariantB={solutionVariantB}
				clientSolutions={clientSolutions}
				fetchedSolutionA={fetchedSolutionA}
				fetchedSolutionB={fetchedSolutionB}
				parameterValues={parameterValues}
				handleParameterValueChange={handleParameterValueChange}
			/>
				</div>
			)}

			{/* Calculate Button - Trigger Value Calculation */}
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<div className="flex justify-center gap-4">
					<CalculateButton
						fetchedSolutionA={fetchedSolutionA}
						fetchedSolutionB={fetchedSolutionB}
						parameterValues={parameterValues}
						comparisonMode={comparisonMode}
						onCalculate={onCalculate}
						disabled={!fetchedSolutionA || (comparisonMode === "compare" && !fetchedSolutionB)}
						setResultData={setResultData}
					/>
					<MockButton />
				</div>
			)}
		</div>
	);
}
