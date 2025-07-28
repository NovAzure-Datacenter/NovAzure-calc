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
import { useState, Dispatch, SetStateAction } from "react";
import {
	mockLowLevelConfig,
	mockAdvancedConfig,
} from "./mock-data";
import {
	ClientSolution,
} from "@/lib/actions/clients-solutions/clients-solutions";
import MockButton from "./mock-button";
import CalculateButton from "./calculate-button";
import HighLevelConfigCard from "./high-level-config-card";
import LowLevelConfigCard from "./low-level-config-card";
import AdvancedLevelConfigCard from "./adv-level-config-card";

interface AdvancedConfigItem {
	id: string;
	name: string;
	type: "text" | "dropdown" | "checkbox";
	unit?: string;
	placeholder?: string;
	options?: string[];
}

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
	isLowLevelExpanded: boolean;
	setIsLowLevelExpanded: Dispatch<SetStateAction<boolean>>;
	lowLevelConfigA: Record<string, string>;
	setLowLevelConfigA: Dispatch<SetStateAction<Record<string, string>>>;
	lowLevelConfigB: Record<string, string>;
	setLowLevelConfigB: Dispatch<SetStateAction<Record<string, string>>>;
	isAdvancedExpanded: boolean;
	setIsAdvancedExpanded: Dispatch<SetStateAction<boolean>>;
	advancedConfigA: Record<string, string | boolean>;
	setAdvancedConfigA: Dispatch<
		SetStateAction<Record<string, string | boolean>>
	>;
	advancedConfigB: Record<string, string | boolean>;
	setAdvancedConfigB: Dispatch<
		SetStateAction<Record<string, string | boolean>>
	>;
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
	isLowLevelExpanded,
	setIsLowLevelExpanded,
	lowLevelConfigA,
	setLowLevelConfigA,
	lowLevelConfigB,
	setLowLevelConfigB,
	isAdvancedExpanded,
	setIsAdvancedExpanded,
	advancedConfigA,
	setAdvancedConfigA,
	advancedConfigB,
	setAdvancedConfigB,
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

	const availableLowLevelConfig = selectedSolution
		? mockLowLevelConfig[selectedSolution] || []
		: [];

	const getAdvancedConfig = (variantId: string): AdvancedConfigItem[] => {
		if (selectedSolution && mockAdvancedConfig[selectedSolution]) {
			return mockAdvancedConfig[selectedSolution][variantId] || [];
		}
		return [];
	};

	const getSelectedSolutionA = () =>
		clientSolutions.find((s) => s.id === solutionVariantA);
	const getSelectedSolutionB = () =>
		clientSolutions.find((s) => s.id === solutionVariantB);

	const getAdvancedConfigForSolution = (
		solutionId: string
	): AdvancedConfigItem[] => {
		const solution = clientSolutions.find((s) => s.id === solutionId);
		if (!solution) return [];

		const mockSolutionKey = Object.keys(mockAdvancedConfig).find((key) =>
			key.toLowerCase().includes(solution.solution_name.toLowerCase())
		);

		if (mockSolutionKey && mockAdvancedConfig[mockSolutionKey]) {
			const firstVariant = Object.keys(mockAdvancedConfig[mockSolutionKey])[0];
			return mockAdvancedConfig[mockSolutionKey][firstVariant] || [];
		}

		return [];
	};

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
		const config = mockLowLevelConfig[solutionId] || [];
		const initialConfig: Record<string, string> = {};
		config.forEach((item) => {
			initialConfig[item.id] = item.value;
		});
		setLowLevelConfigA(initialConfig);
		setLowLevelConfigB(initialConfig);
	};

	const handleLowLevelConfigAChange = (configId: string, value: string) => {
		setLowLevelConfigA((prev: Record<string, string>) => ({
			...prev,
			[configId]: value,
		}));
	};

	const handleLowLevelConfigBChange = (configId: string, value: string) => {
		setLowLevelConfigB((prev: Record<string, string>) => ({
			...prev,
			[configId]: value,
		}));
	};

	const handleAdvancedConfigAChange = (
		configId: string,
		value: string | boolean
	) => {
		setAdvancedConfigA((prev: Record<string, string | boolean>) => ({
			...prev,
			[configId]: value,
		}));
	};

	const handleAdvancedConfigBChange = (
		configId: string,
		value: string | boolean
	) => {
		setAdvancedConfigB((prev: Record<string, string | boolean>) => ({
			...prev,
			[configId]: value,
		}));
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
													{getSelectedSolutionA()?.solution_name ||
														"Selected Solution"}
												</div>
												<div className="text-sm text-gray-700">
													{getSelectedSolutionA()?.solution_description ||
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
															{getSelectedSolutionA()?.solution_name ||
																"Selected Solution"}
														</div>
														<div className="text-sm text-gray-700">
															{getSelectedSolutionA()?.solution_description ||
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
															{getSelectedSolutionB()?.solution_name ||
																"Selected Solution"}
														</div>
														<div className="text-sm text-gray-600">
															{getSelectedSolutionB()?.solution_description ||
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

			{/* High Level Configuration Card - Project Settings and Parameters */}
			<HighLevelConfigCard
				comparisonMode={comparisonMode}
				solutionVariantA={solutionVariantA}
				solutionVariantB={solutionVariantB}
				clientSolutions={clientSolutions}
				fetchedSolutionA={fetchedSolutionA}
				fetchedSolutionB={fetchedSolutionB}
				parameterValues={parameterValues}
				handleParameterValueChange={handleParameterValueChange}
			/>

			{/* Low Level Configuration Card - Technical Specifications */}
			<LowLevelConfigCard
				comparisonMode={comparisonMode}
				solutionVariantA={solutionVariantA}
				solutionVariantB={solutionVariantB}
				clientSolutions={clientSolutions}
				fetchedSolutionA={fetchedSolutionA}
				fetchedSolutionB={fetchedSolutionB}
				parameterValues={parameterValues}
				handleParameterValueChange={handleParameterValueChange}
			/>

			{/* Advanced Configuration Card - Custom Parameters and Settings */}
			<AdvancedLevelConfigCard
				comparisonMode={comparisonMode}
				solutionVariantA={solutionVariantA}
				solutionVariantB={solutionVariantB}
				clientSolutions={clientSolutions}
				fetchedSolutionA={fetchedSolutionA}
				fetchedSolutionB={fetchedSolutionB}
				parameterValues={parameterValues}
				handleParameterValueChange={handleParameterValueChange}
				advancedConfigA={advancedConfigA}
				advancedConfigB={advancedConfigB}
				handleAdvancedConfigAChange={handleAdvancedConfigAChange}
				handleAdvancedConfigBChange={handleAdvancedConfigBChange}
				getAdvancedConfig={getAdvancedConfig}
				getAdvancedConfigForSolution={getAdvancedConfigForSolution}
				isAdvancedExpanded={isAdvancedExpanded}
				setIsAdvancedExpanded={setIsAdvancedExpanded}
			/>

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
						parameterValues={parameterValues}
						onCalculate={onCalculate}
						disabled={!fetchedSolutionA}
						setResultData={setResultData}
					/>
					<MockButton />
				</div>
			)}
		</div>
	);
}
