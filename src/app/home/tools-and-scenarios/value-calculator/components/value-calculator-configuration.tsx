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
import {
	mockSolutions,
	mockLowLevelConfig,
	mockAdvancedConfig,
} from "./mock-data";
import {
	getClientSolutions,
	getClientSolution,
	ClientSolution,
} from "@/lib/actions/clients-solutions/clients-solutions";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { getSolutionTypesByIndustryAndTechnology } from "@/lib/actions/solution/solution";
import { useUser } from "@/hooks/useUser";
import { getClientDataById } from "@/lib/actions/clients/clients";
import { getIndustriesBySelectedIds } from "@/lib/actions/industry/industry";
import { getTechnologiesBySelectedIds } from "@/lib/actions/technology/technology";
import MockButton from "./mock-button";
import CalculateButton from "./calculate-button";

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
}: ValueCalculatorConfigurationProps) {
	const { user } = useUser();

	const [clientSolutions, setClientSolutions] = useState<ClientSolution[]>([]);
	const [isLoadingSolutions, setIsLoadingSolutions] = useState(false);

	const [solutionTypes, setSolutionTypes] = useState<any[]>([]);
	const [isLoadingSolutionTypes, setIsLoadingSolutionTypes] = useState(false);

	const [industries, setIndustries] = useState<any[]>([]);
	const [technologies, setTechnologies] = useState<any[]>([]);
	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);
	const [clientData, setClientData] = useState<any>(null);

	const [fetchedSolutionA, setFetchedSolutionA] =
		useState<ClientSolution | null>(null);
	const [isLoadingSolutionA, setIsLoadingSolutionA] = useState(false);

	// State for storing parameter values
	const [parameterValues, setParameterValues] = useState<Record<string, any>>(
		{}
	);

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

	const fetchClientSolutions = async (
		industryId: string,
		technologyId: string
	) => {
		if (!industryId || !technologyId || !user?.client_id) {
			setClientSolutions([]);
			return;
		}

		setIsLoadingSolutions(true);
		try {
			const result = await getClientSolutions(user.client_id);

			if (result.solutions) {
				const filteredSolutions = result.solutions.filter((solution) => {
					const matchesIndustry = solution.industry_id === industryId;
					const matchesTechnology = solution.technology_id === technologyId;
					return matchesIndustry && matchesTechnology;
				});

				setClientSolutions(filteredSolutions);
			} else {
				setClientSolutions([]);
			}
		} catch (error) {
			setClientSolutions([]);
		} finally {
			setIsLoadingSolutions(false);
		}
	};

	const fetchSolutionTypes = async (
		industryId: string,
		technologyId: string
	) => {
		if (!industryId || !technologyId) {
			setSolutionTypes([]);
			return;
		}

		setIsLoadingSolutionTypes(true);
		try {
			const result = await getSolutionTypesByIndustryAndTechnology(
				industryId,
				technologyId
			);

			if (result.success && result.solutionTypes) {
				setSolutionTypes(result.solutionTypes);
			} else {
				setSolutionTypes([]);
			}
		} catch (error) {
			setSolutionTypes([]);
		} finally {
			setIsLoadingSolutionTypes(false);
		}
	};

	const fetchSolutionVariantA = async (solutionId: string) => {
		if (!solutionId) {
			setFetchedSolutionA(null);
			return;
		}

		setIsLoadingSolutionA(true);
		try {
			const result = await getClientSolution(solutionId);

			if (result.solution) {
				setFetchedSolutionA(result.solution);
			} else {
				setFetchedSolutionA(null);
			}
		} catch (error) {
			setFetchedSolutionA(null);
		} finally {
			setIsLoadingSolutionA(false);
		}
	};

	useEffect(() => {
		const loadClientDataAndSelections = async () => {
			if (!user?.client_id) {
				return;
			}

			try {
				setIsLoadingIndustries(true);
				setIsLoadingTechnologies(true);

				const clientResult = await getClientDataById(user.client_id);

				if (clientResult.client) {
					setClientData(clientResult.client);

					if (
						clientResult.client.selected_industries &&
						clientResult.client.selected_industries.length > 0
					) {
						const industriesResult = await getIndustriesBySelectedIds(
							clientResult.client.selected_industries
						);

						if (industriesResult.success && industriesResult.industries) {
							setIndustries(industriesResult.industries);
						} else {
							setIndustries([]);
						}
					} else {
						setIndustries([]);
					}

					if (
						clientResult.client.selected_technologies &&
						clientResult.client.selected_technologies.length > 0
					) {
						const technologiesResult = await getTechnologiesBySelectedIds(
							clientResult.client.selected_technologies
						);

						if (technologiesResult.success && technologiesResult.technologies) {
							setTechnologies(technologiesResult.technologies);
						} else {
							setTechnologies([]);
						}
					} else {
						setTechnologies([]);
					}
				} else {
					setIndustries([]);
					setTechnologies([]);
				}
			} catch (error) {
				setIndustries([]);
				setTechnologies([]);
			} finally {
				setIsLoadingIndustries(false);
				setIsLoadingTechnologies(false);
			}
		};

		loadClientDataAndSelections();
	}, [user?.client_id]);

	useEffect(() => {
		if (selectedIndustry && selectedTechnology && user?.client_id) {
			fetchClientSolutions(selectedIndustry, selectedTechnology);
		} else {
			setClientSolutions([]);
		}
	}, [selectedIndustry, selectedTechnology, user?.client_id]);

	useEffect(() => {
		if (selectedIndustry && selectedTechnology) {
			fetchSolutionTypes(selectedIndustry, selectedTechnology);
		} else {
			setSolutionTypes([]);
		}
	}, [selectedIndustry, selectedTechnology]);

	useEffect(() => {
		if (solutionVariantA) {
			fetchSolutionVariantA(solutionVariantA);
		} else {
			setFetchedSolutionA(null);
		}
	}, [solutionVariantA]);

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
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-lg">High Level Configuration</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Solution Variant Parameters */}
						{fetchedSolutionA?.parameters && (
							<div className="space-y-4">
								{/* Filter parameters that are provided by user and are high level */}
								{(() => {
									const userParameters = fetchedSolutionA.parameters.filter(
										(param: any) =>
											param.provided_by === "user" &&
											param.category?.name === "High Level Configuration"
									);

									if (userParameters.length === 0) {
										return (
											<div className="text-center py-8 text-muted-foreground">
												<p>No high level parameters to display</p>
											</div>
										);
									}

									return (
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{userParameters.map((parameter: any) => (
												<div key={parameter.id} className="space-y-3">
													<div className="flex items-center gap-2">
														<Label className="text-sm font-medium">
															{parameter.name}
														</Label>
														{parameter.information && (
															<div className="flex items-center gap-1">
																<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
																<span className="text-xs text-gray-500">
																	Info
																</span>
															</div>
														)}
													</div>
													<div className="space-y-2">
														{parameter.display_type === "dropdown" ? (
															<div className="space-y-2">
																<Label className="text-xs text-muted-foreground">
																	Select {parameter.name}:
																</Label>
																<Select
																	value={parameterValues[parameter.id] || ""}
																	onValueChange={(value) =>
																		handleParameterValueChange(
																			parameter.id,
																			value
																		)
																	}
																>
																	<SelectTrigger className="w-full">
																		<SelectValue
																			placeholder={`Select an option for ${parameter.name}`}
																		/>
																	</SelectTrigger>
																	<SelectContent>
																		{parameter.dropdown_options &&
																			parameter.dropdown_options.map(
																				(option: any, index: number) => (
																					<SelectItem
																						key={index}
																						value={option.key}
																					>
																						{option.key}
																					</SelectItem>
																				)
																			)}
																	</SelectContent>
																</Select>
															</div>
														) : parameter.display_type === "range" ? (
															<div className="space-y-2">
																<Label className="text-xs text-muted-foreground">
																	{parameter.description ||
																		`Enter ${parameter.name}`}
																</Label>
																<Input
																	type="number"
																	placeholder={`Enter value between ${
																		parameter.range_min || "0"
																	} and ${parameter.range_max || "∞"}`}
																	min={parameter.range_min}
																	max={parameter.range_max}
																	step="any"
																	value={parameterValues[parameter.id] || ""}
																	onChange={(e) =>
																		handleParameterValueChange(
																			parameter.id,
																			e.target.value
																		)
																	}
																	onKeyDown={(e) => {
																		const min = parseFloat(parameter.range_min);
																		const max = parseFloat(parameter.range_max);

																		// Allow: backspace, delete, tab, escape, enter, and navigation keys
																		if (
																			[
																				8, 9, 27, 13, 46, 37, 38, 39, 40,
																			].includes(e.keyCode)
																		) {
																			return;
																		}

																		// Allow decimal point
																		if (
																			e.key === "." &&
																			!e.currentTarget.value.includes(".")
																		) {
																			return;
																		}

																		// Allow numbers
																		if (/[0-9]/.test(e.key)) {
																			const currentValue =
																				e.currentTarget.value;
																			const newValue = currentValue + e.key;

																			// Check if the new value would be within range
																			const numValue = parseFloat(newValue);
																			if (
																				!isNaN(numValue) &&
																				numValue >= min &&
																				numValue <= max
																			) {
																				return;
																			}
																		}

																		// Prevent all other inputs
																		e.preventDefault();
																	}}
																	onBlur={(e) => {
																		const value = parseFloat(e.target.value);
																		const min = parseFloat(parameter.range_min);
																		const max = parseFloat(parameter.range_max);

																		// Ensure value is within range on blur
																		if (isNaN(value) || value < min) {
																			e.target.value = min.toString();
																		} else if (value > max) {
																			e.target.value = max.toString();
																		}
																	}}
																/>
																{parameter.range_min && parameter.range_max && (
																	<div className="text-xs text-muted-foreground">
																		Range: {parameter.range_min} -{" "}
																		{parameter.range_max}{" "}
																		{parameter.unit && `(${parameter.unit})`}
																	</div>
																)}
															</div>
														) : (
															<div className="space-y-2">
																<Label className="text-xs text-muted-foreground">
																	{parameter.description ||
																		`Enter ${parameter.name}`}
																</Label>
																<Input
																	type="number"
																	placeholder={`Enter ${parameter.name}`}
																	value={parameterValues[parameter.id] || ""}
																	onChange={(e) =>
																		handleParameterValueChange(
																			parameter.id,
																			e.target.value
																		)
																	}
																/>
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									);
								})()}
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Low Level Configuration Card - Technical Specifications */}
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<Card
					className="w-full cursor-pointer"
					onClick={() => setIsLowLevelExpanded(!isLowLevelExpanded)}
				>
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
							{/* Solution Variant Parameters */}
							{fetchedSolutionA?.parameters &&
								(() => {
									const userParameters = fetchedSolutionA.parameters.filter(
										(param: any) =>
											param.provided_by === "user" &&
											param.category?.name === "Low Level Configuration"
									);

									if (userParameters.length === 0) {
										return (
											<div className="text-center py-8 text-muted-foreground">
												<p>No low level parameters to display</p>
											</div>
										);
									}

									return (
										<div className="space-y-6">
											{comparisonMode === "single" ? (
												<div className="space-y-4">
													<h4 className="text-sm font-medium text-blue-600">
														Configuration
													</h4>
													<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
														{userParameters.map((parameter: any) => (
															<div key={parameter.id} className="space-y-3">
																<div className="flex items-center gap-2">
																	<Label className="text-sm font-medium">
																		{parameter.name}
																	</Label>
																	{parameter.information && (
																		<div className="flex items-center gap-1">
																			<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
																			<span className="text-xs text-gray-500">
																				Info
																			</span>
																		</div>
																	)}
																</div>
																<div className="space-y-2">
																	{parameter.display_type === "dropdown" ? (
																		<div className="space-y-2">
																			<Label className="text-xs text-muted-foreground">
																				Select {parameter.name}:
																			</Label>
																			<Select
																				value={
																					parameterValues[parameter.id] || ""
																				}
																				onValueChange={(value) =>
																					handleParameterValueChange(
																						parameter.id,
																						value
																					)
																				}
																			>
																				<SelectTrigger className="w-full">
																					<SelectValue
																						placeholder={`Select an option for ${parameter.name}`}
																					/>
																				</SelectTrigger>
																				<SelectContent>
																					{parameter.dropdown_options &&
																						parameter.dropdown_options.map(
																							(option: any, index: number) => (
																								<SelectItem
																									key={index}
																									value={option.key}
																								>
																									{option.key}
																								</SelectItem>
																							)
																						)}
																				</SelectContent>
																			</Select>
																		</div>
																	) : parameter.display_type === "range" ? (
																		<div className="space-y-2">
																			<Label className="text-xs text-muted-foreground">
																				{parameter.description ||
																					`Enter ${parameter.name}`}
																			</Label>
																			<Input
																				type="number"
																				placeholder={`Enter value between ${
																					parameter.range_min || "0"
																				} and ${parameter.range_max || "∞"}`}
																				min={parameter.range_min}
																				max={parameter.range_max}
																				step="any"
																				value={
																					parameterValues[parameter.id] || ""
																				}
																				onChange={(e) =>
																					handleParameterValueChange(
																						parameter.id,
																						e.target.value
																					)
																				}
																				onKeyDown={(e) => {
																					const min = parseFloat(
																						parameter.range_min
																					);
																					const max = parseFloat(
																						parameter.range_max
																					);

																					// Allow: backspace, delete, tab, escape, enter, and navigation keys
																					if (
																						[
																							8, 9, 27, 13, 46, 37, 38, 39, 40,
																						].includes(e.keyCode)
																					) {
																						return;
																					}

																					// Allow decimal point
																					if (
																						e.key === "." &&
																						!e.currentTarget.value.includes(".")
																					) {
																						return;
																					}

																					// Allow numbers
																					if (/[0-9]/.test(e.key)) {
																						const currentValue =
																							e.currentTarget.value;
																						const newValue =
																							currentValue + e.key;

																						// Check if the new value would be within range
																						const numValue =
																							parseFloat(newValue);
																						if (
																							!isNaN(numValue) &&
																							numValue >= min &&
																							numValue <= max
																						) {
																							return;
																						}
																					}

																					// Prevent all other inputs
																					e.preventDefault();
																				}}
																				onBlur={(e) => {
																					const value = parseFloat(
																						e.target.value
																					);
																					const min = parseFloat(
																						parameter.range_min
																					);
																					const max = parseFloat(
																						parameter.range_max
																					);

																					// Ensure value is within range on blur
																					if (isNaN(value) || value < min) {
																						e.target.value = min.toString();
																					} else if (value > max) {
																						e.target.value = max.toString();
																					}
																				}}
																			/>
																			{parameter.range_min &&
																				parameter.range_max && (
																					<div className="text-xs text-muted-foreground">
																						Range: {parameter.range_min} -{" "}
																						{parameter.range_max}{" "}
																						{parameter.unit &&
																							`(${parameter.unit})`}
																					</div>
																				)}
																		</div>
																	) : (
																		<div className="space-y-2">
																			<Label className="text-xs text-muted-foreground">
																				{parameter.description ||
																					`Enter ${parameter.name}`}
																			</Label>
																			<Input
																				type="number"
																				placeholder={`Enter ${parameter.name}`}
																				value={
																					parameterValues[parameter.id] || ""
																				}
																				onChange={(e) =>
																					handleParameterValueChange(
																						parameter.id,
																						e.target.value
																					)
																				}
																				step="0.1"
																			/>
																		</div>
																	)}
																</div>
															</div>
														))}
													</div>
												</div>
											) : (
												<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
													<div className="space-y-4">
														<h4 className="text-sm font-medium text-blue-600">
															Variant A
														</h4>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{userParameters.map((parameter: any) => (
																<div key={parameter.id} className="space-y-3">
																	<div className="flex items-center gap-2">
																		<Label className="text-sm font-medium">
																			{parameter.name}
																		</Label>
																		{parameter.information && (
																			<div className="flex items-center gap-1">
																				<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
																				<span className="text-xs text-gray-500">
																					Info
																				</span>
																			</div>
																		)}
																	</div>
																	<div className="space-y-2">
																		{parameter.display_type === "dropdown" ? (
																			<div className="space-y-2">
																				<Label className="text-xs text-muted-foreground">
																					Select {parameter.name}:
																				</Label>
																				<Select
																					value={
																						parameterValues[parameter.id] || ""
																					}
																					onValueChange={(value) =>
																						handleParameterValueChange(
																							parameter.id,
																							value
																						)
																					}
																				>
																					<SelectTrigger className="w-full">
																						<SelectValue
																							placeholder={`Select an option for ${parameter.name}`}
																						/>
																					</SelectTrigger>
																					<SelectContent>
																						{parameter.dropdown_options &&
																							parameter.dropdown_options.map(
																								(
																									option: any,
																									index: number
																								) => (
																									<SelectItem
																										key={index}
																										value={option.key}
																									>
																										{option.key}
																									</SelectItem>
																								)
																							)}
																					</SelectContent>
																				</Select>
																			</div>
																		) : parameter.display_type === "range" ? (
																			<div className="space-y-2">
																				<Label className="text-xs text-muted-foreground">
																					{parameter.description ||
																						`Enter ${parameter.name}`}
																				</Label>
																				<Input
																					type="number"
																					placeholder={`Enter value between ${
																						parameter.range_min || "0"
																					} and ${parameter.range_max || "∞"}`}
																					min={parameter.range_min}
																					max={parameter.range_max}
																					step="any"
																					value={
																						parameterValues[parameter.id] || ""
																					}
																					onChange={(e) =>
																						handleParameterValueChange(
																							parameter.id,
																							e.target.value
																						)
																					}
																					onKeyDown={(e) => {
																						const min = parseFloat(
																							parameter.range_min
																						);
																						const max = parseFloat(
																							parameter.range_max
																						);

																						// Allow: backspace, delete, tab, escape, enter, and navigation keys
																						if (
																							[
																								8, 9, 27, 13, 46, 37, 38, 39,
																								40,
																							].includes(e.keyCode)
																						) {
																							return;
																						}

																						// Allow decimal point
																						if (
																							e.key === "." &&
																							!e.currentTarget.value.includes(
																								"."
																							)
																						) {
																							return;
																						}

																						// Allow numbers
																						if (/[0-9]/.test(e.key)) {
																							const currentValue =
																								e.currentTarget.value;
																							const newValue =
																								currentValue + e.key;

																							// Check if the new value would be within range
																							const numValue =
																								parseFloat(newValue);
																							if (
																								!isNaN(numValue) &&
																								numValue >= min &&
																								numValue <= max
																							) {
																								return;
																							}
																						}

																						// Prevent all other inputs
																						e.preventDefault();
																					}}
																					onBlur={(e) => {
																						const value = parseFloat(
																							e.target.value
																						);
																						const min = parseFloat(
																							parameter.range_min
																						);
																						const max = parseFloat(
																							parameter.range_max
																						);

																						// Ensure value is within range on blur
																						if (isNaN(value) || value < min) {
																							e.target.value = min.toString();
																						} else if (value > max) {
																							e.target.value = max.toString();
																						}
																					}}
																				/>
																				{parameter.range_min &&
																					parameter.range_max && (
																						<div className="text-xs text-muted-foreground">
																							Range: {parameter.range_min} -{" "}
																							{parameter.range_max}{" "}
																							{parameter.unit &&
																								`(${parameter.unit})`}
																						</div>
																					)}
																			</div>
																		) : (
																			<div className="space-y-2">
																				<Label className="text-xs text-muted-foreground">
																					{parameter.description ||
																						`Enter ${parameter.name}`}
																				</Label>
																				<Input
																					type="number"
																					placeholder={`Enter ${parameter.name}`}
																					value={
																						parameterValues[parameter.id] || ""
																					}
																					onChange={(e) =>
																						handleParameterValueChange(
																							parameter.id,
																							e.target.value
																						)
																					}
																					step="0.1"
																				/>
																			</div>
																		)}
																	</div>
																</div>
															))}
														</div>
													</div>

													<div className="space-y-4">
														<h4 className="text-sm font-medium text-green-600">
															Variant B
														</h4>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															{userParameters.map((parameter: any) => (
																<div key={parameter.id} className="space-y-3">
																	<div className="flex items-center gap-2">
																		<Label className="text-sm font-medium">
																			{parameter.name}
																		</Label>
																		{parameter.information && (
																			<div className="flex items-center gap-1">
																				<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
																				<span className="text-xs text-gray-500">
																					Info
																				</span>
																			</div>
																		)}
																	</div>
																	<div className="space-y-2">
																		{parameter.display_type === "dropdown" ? (
																			<div className="space-y-2">
																				<Label className="text-xs text-muted-foreground">
																					Select {parameter.name}:
																				</Label>
																				<Select
																					value={
																						parameterValues[parameter.id] || ""
																					}
																					onValueChange={(value) =>
																						handleParameterValueChange(
																							parameter.id,
																							value
																						)
																					}
																				>
																					<SelectTrigger className="w-full">
																						<SelectValue
																							placeholder={`Select an option for ${parameter.name}`}
																						/>
																					</SelectTrigger>
																					<SelectContent>
																						{parameter.dropdown_options &&
																							parameter.dropdown_options.map(
																								(
																									option: any,
																									index: number
																								) => (
																									<SelectItem
																										key={index}
																										value={option.key}
																									>
																										{option.key}
																									</SelectItem>
																								)
																							)}
																					</SelectContent>
																				</Select>
																			</div>
																		) : parameter.display_type === "range" ? (
																			<div className="space-y-2">
																				<Label className="text-xs text-muted-foreground">
																					{parameter.description ||
																						`Enter ${parameter.name}`}
																				</Label>
																				<Input
																					type="number"
																					placeholder={`Enter value between ${
																						parameter.range_min || "0"
																					} and ${parameter.range_max || "∞"}`}
																					min={parameter.range_min}
																					max={parameter.range_max}
																					step="any"
																					value={
																						parameterValues[parameter.id] || ""
																					}
																					onChange={(e) =>
																						handleParameterValueChange(
																							parameter.id,
																							e.target.value
																						)
																					}
																					onKeyDown={(e) => {
																						const min = parseFloat(
																							parameter.range_min
																						);
																						const max = parseFloat(
																							parameter.range_max
																						);

																						// Allow: backspace, delete, tab, escape, enter, and navigation keys
																						if (
																							[
																								8, 9, 27, 13, 46, 37, 38, 39,
																								40,
																							].includes(e.keyCode)
																						) {
																							return;
																						}

																						// Allow decimal point
																						if (
																							e.key === "." &&
																							!e.currentTarget.value.includes(
																								"."
																							)
																						) {
																							return;
																						}

																						// Allow numbers
																						if (/[0-9]/.test(e.key)) {
																							const currentValue =
																								e.currentTarget.value;
																							const newValue =
																								currentValue + e.key;

																							// Check if the new value would be within range
																							const numValue =
																								parseFloat(newValue);
																							if (
																								!isNaN(numValue) &&
																								numValue >= min &&
																								numValue <= max
																							) {
																								return;
																							}
																						}

																						// Prevent all other inputs
																						e.preventDefault();
																					}}
																					onBlur={(e) => {
																						const value = parseFloat(
																							e.target.value
																						);
																						const min = parseFloat(
																							parameter.range_min
																						);
																						const max = parseFloat(
																							parameter.range_max
																						);

																						// Ensure value is within range on blur
																						if (isNaN(value) || value < min) {
																							e.target.value = min.toString();
																						} else if (value > max) {
																							e.target.value = max.toString();
																						}
																					}}
																				/>
																				{parameter.range_min &&
																					parameter.range_max && (
																						<div className="text-xs text-muted-foreground">
																							Range: {parameter.range_min} -{" "}
																							{parameter.range_max}{" "}
																							{parameter.unit &&
																								`(${parameter.unit})`}
																						</div>
																					)}
																			</div>
																		) : (
																			<div className="space-y-2">
																				<Label className="text-xs text-muted-foreground">
																					{parameter.description ||
																						`Enter ${parameter.name}`}
																				</Label>
																				<Input
																					type="number"
																					placeholder={`Enter ${parameter.name}`}
																					value={
																						parameterValues[parameter.id] || ""
																					}
																					onChange={(e) =>
																						handleParameterValueChange(
																							parameter.id,
																							e.target.value
																						)
																					}
																					step="0.1"
																				/>
																			</div>
																		)}
																	</div>
																</div>
															))}
														</div>
													</div>
												</div>
											)}
										</div>
									);
								})()}
						</CardContent>
					)}
				</Card>
			)}

			{/* Advanced Configuration Card - Custom Parameters and Settings */}
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<Card
					className="w-full cursor-pointer"
					onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
				>
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
							{comparisonMode === "single" ? (
								<div className="space-y-4">
									<h4 className="text-sm font-medium text-blue-600">
										Configuration
									</h4>
									<div className="space-y-4">
										{getAdvancedConfig(solutionVariantA).map(
											(config: AdvancedConfigItem) => (
												<div key={config.id} className="space-y-3">
													<Label className="text-sm font-medium">
														{config.name}
														{config.unit && (
															<span className="text-muted-foreground ml-1">
																({config.unit})
															</span>
														)}
													</Label>
													{config.type === "text" && (
														<Input
															type="text"
															placeholder={config.placeholder}
															value={
																(advancedConfigA[config.id] as string) || ""
															}
															onChange={(e) =>
																handleAdvancedConfigAChange(
																	config.id,
																	e.target.value
																)
															}
														/>
													)}
													{config.type === "dropdown" && (
														<Select
															value={
																(advancedConfigA[config.id] as string) || ""
															}
															onValueChange={(value) =>
																handleAdvancedConfigAChange(config.id, value)
															}
														>
															<SelectTrigger className="w-full">
																<SelectValue
																	placeholder={`Select ${config.name.toLowerCase()}`}
																/>
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
																id={`${config.id}-single`}
																checked={
																	(advancedConfigA[config.id] as boolean) ||
																	false
																}
																onCheckedChange={(checked) =>
																	handleAdvancedConfigAChange(
																		config.id,
																		checked as boolean
																	)
																}
															/>
															<Label
																htmlFor={`${config.id}-single`}
																className="text-sm font-normal"
															>
																{config.name}
															</Label>
														</div>
													)}
												</div>
											)
										)}
									</div>
								</div>
							) : (
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<div className="space-y-4">
										<h4 className="text-sm font-medium text-blue-600">
											Variant A
										</h4>
										<div className="space-y-4">
											{getAdvancedConfigForSolution(solutionVariantA).map(
												(config: AdvancedConfigItem) => (
													<div key={config.id} className="space-y-3">
														<Label className="text-sm font-medium">
															{config.name}
															{config.unit && (
																<span className="text-muted-foreground ml-1">
																	({config.unit})
																</span>
															)}
														</Label>
														{config.type === "text" && (
															<Input
																type="text"
																placeholder={config.placeholder}
																value={
																	(advancedConfigA[config.id] as string) || ""
																}
																onChange={(e) =>
																	handleAdvancedConfigAChange(
																		config.id,
																		e.target.value
																	)
																}
															/>
														)}
														{config.type === "dropdown" && (
															<Select
																value={
																	(advancedConfigA[config.id] as string) || ""
																}
																onValueChange={(value) =>
																	handleAdvancedConfigAChange(config.id, value)
																}
															>
																<SelectTrigger className="w-full">
																	<SelectValue
																		placeholder={`Select ${config.name.toLowerCase()}`}
																	/>
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
																	checked={
																		(advancedConfigA[config.id] as boolean) ||
																		false
																	}
																	onCheckedChange={(checked) =>
																		handleAdvancedConfigAChange(
																			config.id,
																			checked as boolean
																		)
																	}
																/>
																<Label
																	htmlFor={`${config.id}-a`}
																	className="text-sm font-normal"
																>
																	{config.name}
																</Label>
															</div>
														)}
													</div>
												)
											)}
										</div>
									</div>

									<div className="space-y-4">
										<h4 className="text-sm font-medium text-green-600">
											Variant B
										</h4>
										<div className="space-y-4">
											{getAdvancedConfigForSolution(solutionVariantB).map(
												(config: AdvancedConfigItem) => (
													<div key={config.id} className="space-y-3">
														<Label className="text-sm font-medium">
															{config.name}
															{config.unit && (
																<span className="text-muted-foreground ml-1">
																	({config.unit})
																</span>
															)}
														</Label>
														{config.type === "text" && (
															<Input
																type="text"
																placeholder={config.placeholder}
																value={
																	(advancedConfigB[config.id] as string) || ""
																}
																onChange={(e) =>
																	handleAdvancedConfigBChange(
																		config.id,
																		e.target.value
																	)
																}
															/>
														)}
														{config.type === "dropdown" && (
															<Select
																value={
																	(advancedConfigB[config.id] as string) || ""
																}
																onValueChange={(value) =>
																	handleAdvancedConfigBChange(config.id, value)
																}
															>
																<SelectTrigger className="w-full">
																	<SelectValue
																		placeholder={`Select ${config.name.toLowerCase()}`}
																	/>
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
																	checked={
																		(advancedConfigB[config.id] as boolean) ||
																		false
																	}
																	onCheckedChange={(checked) =>
																		handleAdvancedConfigBChange(
																			config.id,
																			checked as boolean
																		)
																	}
																/>
																<Label
																	htmlFor={`${config.id}-b`}
																	className="text-sm font-normal"
																>
																	{config.name}
																</Label>
															</div>
														)}
													</div>
												)
											)}
										</div>
									</div>
								</div>
							)}
						</CardContent>
					)}
				</Card>
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
						parameterValues={parameterValues}
						onCalculate={onCalculate}
						disabled={!fetchedSolutionA}
					/>
					<MockButton />
				</div>
			)}
		</div>
	);
}
