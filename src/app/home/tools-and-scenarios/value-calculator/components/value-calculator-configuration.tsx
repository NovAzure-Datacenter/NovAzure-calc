import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Cpu, Package, ChevronDown, ChevronUp } from "lucide-react"
import { useState, Dispatch, SetStateAction } from "react"
import { mockIndustries, mockTechnologies, mockSolutions, mockSolutionVariants, mockLowLevelConfig, mockAdvancedConfig } from "./mock-data"

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
	// Configuration state props
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
	setAdvancedConfigA: Dispatch<SetStateAction<Record<string, string | boolean>>>;
	advancedConfigB: Record<string, string | boolean>;
	setAdvancedConfigB: Dispatch<SetStateAction<Record<string, string | boolean>>>;
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
	setAdvancedConfigB
}: ValueCalculatorConfigurationProps) {
	// Get available technologies based on selected industry
	const availableTechnologies = selectedIndustry ? mockTechnologies[selectedIndustry] || [] : [];

	// Get available solutions based on selected technology
	const availableSolutions = selectedTechnology ? mockSolutions[selectedTechnology] || [] : [];

	// Get available solution variants based on selected solution
	const availableVariants = selectedSolution ? mockSolutionVariants[selectedSolution] || [] : [];

	// Get available low level configuration based on selected solution
	const availableLowLevelConfig = selectedSolution ? mockLowLevelConfig[selectedSolution] || [] : [];

	// Get available advanced configuration based on selected solution and variant
	const getAdvancedConfig = (variantId: string): AdvancedConfigItem[] => {
		if (selectedSolution && mockAdvancedConfig[selectedSolution]) {
			return mockAdvancedConfig[selectedSolution][variantId] || [];
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
		// Initialize low level config with default values
		const config = mockLowLevelConfig[solutionId] || [];
		const initialConfig: Record<string, string> = {};
		config.forEach(item => {
			initialConfig[item.id] = item.value;
		});
		setLowLevelConfigA(initialConfig);
		setLowLevelConfigB(initialConfig);
	};

	const handleLowLevelConfigAChange = (configId: string, value: string) => {
		setLowLevelConfigA((prev: Record<string, string>) => ({
			...prev,
			[configId]: value
		}));
	};

	const handleLowLevelConfigBChange = (configId: string, value: string) => {
		setLowLevelConfigB((prev: Record<string, string>) => ({
			...prev,
			[configId]: value
		}));
	};

	const handleAdvancedConfigAChange = (configId: string, value: string | boolean) => {
		setAdvancedConfigA((prev: Record<string, string | boolean>) => ({
			...prev,
			[configId]: value
		}));
	};

	const handleAdvancedConfigBChange = (configId: string, value: string | boolean) => {
		setAdvancedConfigB((prev: Record<string, string | boolean>) => ({
			...prev,
			[configId]: value
		}));
	};

	const handleCalculate = () => {
		if (onCalculate) {
			onCalculate();
		}
	};

	return (
		<div className="space-y-6">
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-lg">Compare Solutions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Horizontal Dropdown Layout */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Industry Selection */}
						<div className="space-y-3">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								Industry
							</Label>
							<Select value={selectedIndustry} onValueChange={handleIndustryChange}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select an industry" />
								</SelectTrigger>
								<SelectContent>
									{mockIndustries.map((industry) => (
										<SelectItem key={industry.id} value={industry.id}>
											<div className="flex items-center gap-2">
												<Building2 className="h-4 w-4" />
												{industry.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Technology Selection */}
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
									<SelectValue placeholder={selectedIndustry ? "Select a technology" : "Select an industry first"} />
								</SelectTrigger>
								<SelectContent>
									{availableTechnologies.map((technology) => (
										<SelectItem key={technology.id} value={technology.id}>
											<div className="flex items-center gap-2">
												<Cpu className="h-4 w-4" />
												{technology.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Solution Selection */}
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
									<SelectValue placeholder={selectedTechnology ? "Select a solution" : "Select a technology first"} />
								</SelectTrigger>
								<SelectContent>
									{availableSolutions.map((solution) => (
										<SelectItem key={solution.id} value={solution.id}>
											<div className="flex items-center gap-2">
												<Package className="h-4 w-4" />
												{solution.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

				</CardContent>
			</Card>

			{/* Solution Variants Comparison Card */}
			{selectedSolution && (
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-lg">Solution Variants Comparison</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Solution Variant A */}
							<div className="space-y-4">
								<Label className="text-sm font-medium">Solution Variant A</Label>
								<Select value={solutionVariantA} onValueChange={setSolutionVariantA}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select variant A" />
									</SelectTrigger>
									<SelectContent>
										{availableVariants.map((variant) => (
											<SelectItem key={variant.id} value={variant.id}>
												<div className="space-y-1">
													<div className="font-medium">{variant.name}</div>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Solution Variant B */}
							<div className="space-y-4">
								<Label className="text-sm font-medium">Solution Variant B</Label>
								<Select value={solutionVariantB} onValueChange={setSolutionVariantB}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select variant B" />
									</SelectTrigger>
									<SelectContent>
										{availableVariants.map((variant) => (
											<SelectItem key={variant.id} value={variant.id}>
												<div className="space-y-1">
													<div className="font-medium">{variant.name}</div>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

					</CardContent>
				</Card>
			)}

			{/* High Level Configuration Card */}
			{solutionVariantA && solutionVariantB && (
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-lg">High Level Configuration</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{/* Data Center Type */}
							<div className="space-y-3">
								<Label className="text-sm font-medium">Data Center Type</Label>
								<Select value={dataCenterType} onValueChange={setDataCenterType}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select data center type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="general-purpose">General Purpose</SelectItem>
										<SelectItem value="hpc-ai">HPC/AI</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Project Location */}
							<div className="space-y-3">
								<Label className="text-sm font-medium">Project Location</Label>
								<Select value={projectLocation} onValueChange={setProjectLocation}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select location" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="uk">UK</SelectItem>
										<SelectItem value="uae">UAE</SelectItem>
										<SelectItem value="usa">USA</SelectItem>
										<SelectItem value="singapore">Singapore</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Utilisation Percentage */}
							<div className="space-y-3">
								<Label className="text-sm font-medium">Utilisation Percentage</Label>
								<Select value={utilisationPercentage} onValueChange={setUtilisationPercentage}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select utilisation" />
									</SelectTrigger>
									<SelectContent>
										{[20, 30, 40, 50, 60, 70, 80, 90, 100].map((percentage) => (
											<SelectItem key={percentage} value={percentage.toString()}>
												{percentage}%
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Data Hall Capacity */}
							<div className="space-y-3">
								<Label className="text-sm font-medium">Data Hall Capacity</Label>
								<Input
									type="number"
									step="0.1"
									placeholder="Enter capacity"
									value={dataHallCapacity}
									onChange={(e) => setDataHallCapacity(e.target.value)}
								/>
							</div>

							{/* Planned Years of Operation */}
							<div className="space-y-3">
								<Label className="text-sm font-medium">Planned Years of Operation</Label>
								<Input
									type="number"
									placeholder="Enter years"
									value={plannedYears}
									onChange={(e) => setPlannedYears(e.target.value)}
								/>
							</div>

							{/* First Year of Operation */}
							<div className="space-y-3">
								<Label className="text-sm font-medium">First Year of Operation</Label>
								<Select value={firstYearOperation} onValueChange={setFirstYearOperation}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select year" />
									</SelectTrigger>
									<SelectContent>
										{[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
											<SelectItem key={year} value={year.toString()}>
												{year}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Low Level Configuration Card */}
			{solutionVariantA && solutionVariantB && (
				<Card className="w-full cursor-pointer" onClick={() => setIsLowLevelExpanded(!isLowLevelExpanded)}>
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle className="text-lg">Low Level Configuration</CardTitle>
							{isLowLevelExpanded ? (
								<ChevronUp className="h-5 w-5" />
							) : (
								<ChevronDown className="h-5 w-5" />
							)}
						</div>
					</CardHeader>
					{isLowLevelExpanded && (
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Variant A Section */}
								<div className="space-y-4">
									<h4 className="text-sm font-medium text-blue-600">Variant A</h4>
									<div className="space-y-4">
										{availableLowLevelConfig.map((config) => (
											<div key={config.id} className="space-y-3">
												<Label className="text-sm font-medium">
													{config.name}
													{config.unit && <span className="text-muted-foreground ml-1">({config.unit})</span>}
												</Label>
												<Input
													type="number"
													step="0.1"
													placeholder={`Enter ${config.name.toLowerCase()}`}
													value={lowLevelConfigA[config.id] || ""}
													onChange={(e) => handleLowLevelConfigAChange(config.id, e.target.value)}
												/>
											
											</div>
										))}
									</div>
								</div>

								{/* Variant B Section */}
								<div className="space-y-4">
									<h4 className="text-sm font-medium text-green-600">Variant B</h4>
									<div className="space-y-4">
										{availableLowLevelConfig.map((config) => (
											<div key={config.id} className="space-y-3">
												<Label className="text-sm font-medium">
													{config.name}
													{config.unit && <span className="text-muted-foreground ml-1">({config.unit})</span>}
												</Label>
												<Input
													type="number"
													step="0.1"
													placeholder={`Enter ${config.name.toLowerCase()}`}
													value={lowLevelConfigB[config.id] || ""}
													onChange={(e) => handleLowLevelConfigBChange(config.id, e.target.value)}
												/>
											
											</div>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					)}
				</Card>
			)}

			{/* Advanced Configuration Card */}
			{solutionVariantA && solutionVariantB && (
				<Card className="w-full cursor-pointer" onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}>
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle className="text-lg">Advanced Configuration</CardTitle>
							{isAdvancedExpanded ? (
								<ChevronUp className="h-5 w-5" />
							) : (
								<ChevronDown className="h-5 w-5" />
							)}
						</div>
					</CardHeader>
					{isAdvancedExpanded && (
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Variant A Section */}
								<div className="space-y-4">
									<h4 className="text-sm font-medium text-blue-600">Variant A</h4>
									<div className="space-y-4">
										{getAdvancedConfig(solutionVariantA).map((config: AdvancedConfigItem) => (
											<div key={config.id} className="space-y-3">
												<Label className="text-sm font-medium">
													{config.name}
													{config.unit && <span className="text-muted-foreground ml-1">({config.unit})</span>}
												</Label>
												{config.type === "text" && (
													<Input
														type="text"
														placeholder={config.placeholder}
														value={advancedConfigA[config.id] as string || ""}
														onChange={(e) => handleAdvancedConfigAChange(config.id, e.target.value)}
													/>
												)}
												{config.type === "dropdown" && (
													<Select 
														value={advancedConfigA[config.id] as string || ""} 
														onValueChange={(value) => handleAdvancedConfigAChange(config.id, value)}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder={`Select ${config.name.toLowerCase()}`} />
														</SelectTrigger>
														<SelectContent>
															{config.options?.map((option: string) => (
																<SelectItem key={option} value={option}>
																	{option}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												)}
												{config.type === "checkbox" && (
													<div className="flex items-center space-x-2">
														<Checkbox
															id={`${config.id}-a`}
															checked={advancedConfigA[config.id] as boolean || false}
															onCheckedChange={(checked) => handleAdvancedConfigAChange(config.id, checked as boolean)}
														/>
														<Label htmlFor={`${config.id}-a`} className="text-sm font-normal">
															{config.name}
														</Label>
													</div>
												)}
											</div>
										))}
									</div>
								</div>

								{/* Variant B Section */}
								<div className="space-y-4">
									<h4 className="text-sm font-medium text-green-600">Variant B</h4>
									<div className="space-y-4">
										{getAdvancedConfig(solutionVariantB).map((config: AdvancedConfigItem) => (
											<div key={config.id} className="space-y-3">
												<Label className="text-sm font-medium">
													{config.name}
													{config.unit && <span className="text-muted-foreground ml-1">({config.unit})</span>}
												</Label>
												{config.type === "text" && (
													<Input
														type="text"
														placeholder={config.placeholder}
														value={advancedConfigB[config.id] as string || ""}
														onChange={(e) => handleAdvancedConfigBChange(config.id, e.target.value)}
													/>
												)}
												{config.type === "dropdown" && (
													<Select 
														value={advancedConfigB[config.id] as string || ""} 
														onValueChange={(value) => handleAdvancedConfigBChange(config.id, value)}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder={`Select ${config.name.toLowerCase()}`} />
														</SelectTrigger>
														<SelectContent>
															{config.options?.map((option: string) => (
																<SelectItem key={option} value={option}>
																	{option}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												)}
												{config.type === "checkbox" && (
													<div className="flex items-center space-x-2">
														<Checkbox
															id={`${config.id}-b`}
															checked={advancedConfigB[config.id] as boolean || false}
															onCheckedChange={(checked) => handleAdvancedConfigBChange(config.id, checked as boolean)}
														/>
														<Label htmlFor={`${config.id}-b`} className="text-sm font-normal">
															{config.name}
														</Label>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					)}
				</Card>
			)}

			{/* Calculate Button */}
			{solutionVariantA && solutionVariantB && (
				<div className="flex justify-center">
					<Button className="px-8 py-2" onClick={handleCalculate}>
						Calculate
					</Button>
				</div>
			)}
		</div>
	);
}
