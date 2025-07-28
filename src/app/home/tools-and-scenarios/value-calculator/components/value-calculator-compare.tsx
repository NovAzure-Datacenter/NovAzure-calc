"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Building2, Cpu, Package, ChevronDown, ChevronUp } from "lucide-react";
import ValueCalculatorConfiguration from "./value-calculator-configuration";
import ValueCalculatorComparison from "./value-calculator-comparison";
import ValueCalculatorOutputs from "./value-calculator-outputs";
import { useUser } from "@/hooks/useUser";
import { getClientSolutions, getClientSolution, ClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";
import { getIndustriesBySelectedIds } from "@/lib/actions/industry/industry";
import { getTechnologiesBySelectedIds } from "@/lib/actions/technology/technology";
import { getSolutionTypesByIndustryAndTechnology } from "@/lib/actions/solution/solution";
import { getClientDataById } from "@/lib/actions/clients/clients";

export default function ValueCalculatorCompare() {
	const { user } = useUser();

	// Configuration state - moved from child component to persist across tabs
	const [selectedIndustry, setSelectedIndustry] = useState<string>("");
	const [selectedTechnology, setSelectedTechnology] = useState<string>("");
	const [selectedSolution, setSelectedSolution] = useState<string>("");
	const [solutionVariantA, setSolutionVariantA] = useState<string>("");
	const [solutionVariantB, setSolutionVariantB] = useState<string>("");
	const [dataCenterType, setDataCenterType] = useState<string>("");
	const [projectLocation, setProjectLocation] = useState<string>("");
	const [utilisationPercentage, setUtilisationPercentage] = useState<string>("");
	const [dataHallCapacity, setDataHallCapacity] = useState<string>("");
	const [plannedYears, setPlannedYears] = useState<string>("");
	const [firstYearOperation, setFirstYearOperation] = useState<string>("");
	const [isLowLevelExpanded, setIsLowLevelExpanded] = useState<boolean>(true);
	const [lowLevelConfigA, setLowLevelConfigA] = useState<Record<string, string>>({});
	const [lowLevelConfigB, setLowLevelConfigB] = useState<Record<string, string>>({});
	const [isAdvancedExpanded, setIsAdvancedExpanded] = useState<boolean>(false);
	const [advancedConfigA, setAdvancedConfigA] = useState<Record<string, string | boolean>>({});
	const [advancedConfigB, setAdvancedConfigB] = useState<Record<string, string | boolean>>({});
	const [comparisonMode, setComparisonMode] = useState<"single" | "compare" | null>(null);
	
	// Data fetching state
	const [clientSolutions, setClientSolutions] = useState<ClientSolution[]>([]);
	const [isLoadingSolutions, setIsLoadingSolutions] = useState(false);
	const [solutionTypes, setSolutionTypes] = useState<any[]>([]);
	const [isLoadingSolutionTypes, setIsLoadingSolutionTypes] = useState(false);
	const [industries, setIndustries] = useState<any[]>([]);
	const [technologies, setTechnologies] = useState<any[]>([]);
	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);
	const [clientData, setClientData] = useState<any>(null);
	const [fetchedSolutionA, setFetchedSolutionA] = useState<ClientSolution | null>(null);
	const [isLoadingSolutionA, setIsLoadingSolutionA] = useState(false);
	const [fetchedSolutionB, setFetchedSolutionB] = useState<ClientSolution | null>(null);
	const [isLoadingSolutionB, setIsLoadingSolutionB] = useState(false);
	const [parameterValues, setParameterValues] = useState<Record<string, any>>({});
	
	// Calculation state
	const [hasCalculated, setHasCalculated] = useState<boolean>(false);

	// Data fetching functions
	const fetchClientSolutions = async (industryId: string, technologyId: string) => {
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

	const fetchSolutionTypes = async (industryId: string, technologyId: string) => {
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

	const fetchSolutionVariantB = async (solutionId: string) => {
		if (!solutionId) {
			setFetchedSolutionB(null);
			return;
		}

		setIsLoadingSolutionB(true);
		try {
			const result = await getClientSolution(solutionId);

			if (result.solution) {
				setFetchedSolutionB(result.solution);
			} else {
				setFetchedSolutionB(null);
			}
		} catch (error) {
			setFetchedSolutionB(null);
		} finally {
			setIsLoadingSolutionB(false);
		}
	};

	// Load initial client data
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

	// Fetch client solutions when industry/technology changes
	useEffect(() => {
		if (selectedIndustry && selectedTechnology && user?.client_id) {
			fetchClientSolutions(selectedIndustry, selectedTechnology);
		} else {
			setClientSolutions([]);
		}
	}, [selectedIndustry, selectedTechnology, user?.client_id]);

	// Fetch solution types when industry/technology changes
	useEffect(() => {
		if (selectedIndustry && selectedTechnology) {
			fetchSolutionTypes(selectedIndustry, selectedTechnology);
		} else {
			setSolutionTypes([]);
		}
	}, [selectedIndustry, selectedTechnology]);

	// Fetch solution variant A when it changes
	useEffect(() => {
		if (solutionVariantA) {
			fetchSolutionVariantA(solutionVariantA);
		} else {
			setFetchedSolutionA(null);
		}
	}, [solutionVariantA]);

	// Fetch solution variant B when it changes
	useEffect(() => {
		if (solutionVariantB) {
			fetchSolutionVariantB(solutionVariantB);
		} else {
			setFetchedSolutionB(null);
		}
	}, [solutionVariantB]);

	const handleCalculate = () => {
		setHasCalculated(true);
		// Add calculation logic here
	};

	return (
		<TooltipProvider>
			<Tabs defaultValue="configuration" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger 
						value="configuration"
						className="text-muted-foreground text-sm  hover:bg-background border-backdrop data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
					>
						Configuration
					</TabsTrigger>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="relative">
								<TabsTrigger 
									value="comparison"
									disabled={!hasCalculated}
									className="text-muted-foreground text-sm  hover:bg-background border-backdrop data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed w-full"
								>
									{comparisonMode === "compare" ? "Comparison" : "Results"}
								</TabsTrigger>
								{!hasCalculated && (
									<div className="absolute inset-0 bg-transparent" />
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Complete configuration and click Calculate to view comparison results</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="relative">
								<TabsTrigger 
									value="outputs"
									disabled={!hasCalculated}
									className="text-muted-foreground text-sm  hover:bg-background border-backdrop data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed w-full"
								>
									Outputs
								</TabsTrigger>
								{!hasCalculated && (
									<div className="absolute inset-0 bg-transparent" />
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Complete configuration and click Calculate to view calculation outputs</p>
						</TooltipContent>
					</Tooltip>
				</TabsList>

				<TabsContent value="configuration" className="space-y-6">
					<ValueCalculatorConfiguration 
						onCalculate={handleCalculate}
						// Pass all configuration state and handlers as props
						selectedIndustry={selectedIndustry}
						setSelectedIndustry={setSelectedIndustry}
						selectedTechnology={selectedTechnology}
						setSelectedTechnology={setSelectedTechnology}
						selectedSolution={selectedSolution}
						setSelectedSolution={setSelectedSolution}
						solutionVariantA={solutionVariantA}
						setSolutionVariantA={setSolutionVariantA}
						solutionVariantB={solutionVariantB}
						setSolutionVariantB={setSolutionVariantB}
						dataCenterType={dataCenterType}
						setDataCenterType={setDataCenterType}
						projectLocation={projectLocation}
						setProjectLocation={setProjectLocation}
						utilisationPercentage={utilisationPercentage}
						setUtilisationPercentage={setUtilisationPercentage}
						dataHallCapacity={dataHallCapacity}
						setDataHallCapacity={setDataHallCapacity}
						plannedYears={plannedYears}
						setPlannedYears={setPlannedYears}
						firstYearOperation={firstYearOperation}
						setFirstYearOperation={setFirstYearOperation}
						isLowLevelExpanded={isLowLevelExpanded}
						setIsLowLevelExpanded={setIsLowLevelExpanded}
						lowLevelConfigA={lowLevelConfigA}
						setLowLevelConfigA={setLowLevelConfigA}
						lowLevelConfigB={lowLevelConfigB}
						setLowLevelConfigB={setLowLevelConfigB}
						isAdvancedExpanded={isAdvancedExpanded}
						setIsAdvancedExpanded={setIsAdvancedExpanded}
						advancedConfigA={advancedConfigA}
						setAdvancedConfigA={setAdvancedConfigA}
						advancedConfigB={advancedConfigB}
						setAdvancedConfigB={setAdvancedConfigB}
						comparisonMode={comparisonMode}
						setComparisonMode={setComparisonMode}
						// Pass all data fetching state and functions
						clientSolutions={clientSolutions}
						isLoadingSolutions={isLoadingSolutions}
						solutionTypes={solutionTypes}
						isLoadingSolutionTypes={isLoadingSolutionTypes}
						industries={industries}
						technologies={technologies}
						isLoadingIndustries={isLoadingIndustries}
						isLoadingTechnologies={isLoadingTechnologies}
						clientData={clientData}
						fetchedSolutionA={fetchedSolutionA}
						isLoadingSolutionA={isLoadingSolutionA}
						fetchedSolutionB={fetchedSolutionB}
						isLoadingSolutionB={isLoadingSolutionB}
						parameterValues={parameterValues}
						setParameterValues={setParameterValues}
					/>
				</TabsContent>

				<TabsContent value="comparison" className="space-y-6">
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="text-lg">Comparison</CardTitle>
						</CardHeader>
						<CardContent>
							<ValueCalculatorComparison 
								hasCalculated={hasCalculated}
								selectedIndustry={selectedIndustry}
								selectedTechnology={selectedTechnology}
								selectedSolution={selectedSolution}
								solutionVariantA={solutionVariantA}
								solutionVariantB={solutionVariantB}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="outputs" className="space-y-6">
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="text-lg">Outputs</CardTitle>
						</CardHeader>
						<CardContent>
							<ValueCalculatorOutputs 
								hasCalculated={hasCalculated}
								selectedIndustry={selectedIndustry}
								selectedTechnology={selectedTechnology}
								selectedSolution={selectedSolution}
								solutionVariantA={solutionVariantA}
								solutionVariantB={solutionVariantB}
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</TooltipProvider>
	);
}