"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import ValueCalculatorConfiguration from "./components/value-calculator-configuration";
import ValueCalculatorResults from "./components/value-calculator-results";
import ValueCalculatorOutputs from "./components/value-calculator-outputs";
import { useUser } from "@/hooks/useUser";
import {
	fetchClientInitialData,
	fetchAvailableClientSolutions,
	fetchAvailableSolutionTypes,
	fetchSolutionVariantADetails,
	fetchSolutionVariantBDetails,
	ClientSolution,
} from "@/features/value-calculator/api";
import {
	TabNavigationProps,
	TabContentProps,
	ComparisonMode,
} from "@/features/value-calculator/types/types";
import TestResultsAIPowered from "@/features/value-calculator/components/test-results-aipowered";
import TestResultsSemantics from "@/features/value-calculator/components/test-results-semantics";
import TestResultsWidget from "@/features/value-calculator/components/test-results-widget";

/**
 * ValueCalculatorMain component - Main orchestrator for the value calculator feature
 * Manages state, data fetching, and coordinates between configuration, comparison, and outputs tabs
 * Handles user interactions and calculation flow for both single and comparison modes
 */
export default function ValueCalculatorMain() {
	const { user } = useUser();

	const [selectedIndustry, setSelectedIndustry] = useState<string>("");
	const [selectedTechnology, setSelectedTechnology] = useState<string>("");
	const [selectedSolution, setSelectedSolution] = useState<string>("");
	const [solutionVariantA, setSolutionVariantA] = useState<string>("");
	const [solutionVariantB, setSolutionVariantB] = useState<string>("");
	const [dataCenterType, setDataCenterType] = useState<string>("");
	const [projectLocation, setProjectLocation] = useState<string>("");
	const [utilisationPercentage, setUtilisationPercentage] =
		useState<string>("");
	const [dataHallCapacity, setDataHallCapacity] = useState<string>("");
	const [plannedYears, setPlannedYears] = useState<string>("");
	const [firstYearOperation, setFirstYearOperation] = useState<string>("");
	const [comparisonMode, setComparisonMode] = useState<
		"single" | "compare" | null
	>(null);

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
	const [fetchedSolutionA, setFetchedSolutionA] =
		useState<ClientSolution | null>(null);
	const [isLoadingSolutionA, setIsLoadingSolutionA] = useState(false);
	const [fetchedSolutionB, setFetchedSolutionB] =
		useState<ClientSolution | null>(null);
	const [isLoadingSolutionB, setIsLoadingSolutionB] = useState(false);
	const [parameterValues, setParameterValues] = useState<Record<string, any>>(
		{}
	);

	// Calculation state
	const [hasCalculated, setHasCalculated] = useState<boolean>(false);
	const [resultData, setResultData] = useState<any>(null);
	const [currentTab, setCurrentTab] = useState<string>("configuration");

	/**
	 * Fetch client solutions filtered by industry and technology
	 */
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
			const solutions = await fetchAvailableClientSolutions(
				user.client_id,
				industryId,
				technologyId
			);
			setClientSolutions(solutions);
		} catch (error) {
			setClientSolutions([]);
		} finally {
			setIsLoadingSolutions(false);
		}
	};

	/**
	 * Fetch solution types based on selected industry and technology
	 */
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
			const solutionTypes = await fetchAvailableSolutionTypes(
				industryId,
				technologyId
			);
			setSolutionTypes(solutionTypes);
		} catch (error) {
			setSolutionTypes([]);
		} finally {
			setIsLoadingSolutionTypes(false);
		}
	};

	/**
	 * Fetch solution variant A details
	 */
	const fetchSolutionVariantA = async (solutionId: string) => {
		if (!solutionId) {
			setFetchedSolutionA(null);
			return;
		}

		setIsLoadingSolutionA(true);
		try {
			const solution = await fetchSolutionVariantADetails(solutionId);
			setFetchedSolutionA(solution);
		} catch (error) {
			setFetchedSolutionA(null);
		} finally {
			setIsLoadingSolutionA(false);
		}
	};

	/**
	 * Fetch solution variant B details
	 */
	const fetchSolutionVariantB = async (solutionId: string) => {
		if (!solutionId) {
			setFetchedSolutionB(null);
			return;
		}

		setIsLoadingSolutionB(true);
		try {
			const solution = await fetchSolutionVariantBDetails(solutionId);
			setFetchedSolutionB(solution);
		} catch (error) {
			setFetchedSolutionB(null);
		} finally {
			setIsLoadingSolutionB(false);
		}
	};

	/**
	 * Load initial client data and populate industries/technologies
	 */
	const loadClientDataAndSelections = async () => {
		if (!user?.client_id) {
			return;
		}

		try {
			setIsLoadingIndustries(true);
			setIsLoadingTechnologies(true);

			const { industries, technologies, clientData } =
				await fetchClientInitialData(user.client_id);

			setIndustries(industries);
			setTechnologies(technologies);
			setClientData(clientData);
		} catch (error) {
			setIndustries([]);
			setTechnologies([]);
		} finally {
			setIsLoadingIndustries(false);
			setIsLoadingTechnologies(false);
		}
	};

	/**
	 * Handle industry selection change
	 */
	const handleIndustryChange = (
		industryId: string | ((prev: string) => string)
	) => {
		const newIndustryId =
			typeof industryId === "function"
				? industryId(selectedIndustry)
				: industryId;
		setSelectedIndustry(newIndustryId);
		setSelectedSolution("");
		setSolutionVariantA("");
		setSolutionVariantB("");
		setFetchedSolutionA(null);
		setFetchedSolutionB(null);
		setClientSolutions([]);
		setSolutionTypes([]);
	};

	/**
	 * Handle technology selection change
	 */
	const handleTechnologyChange = (
		technologyId: string | ((prev: string) => string)
	) => {
		const newTechnologyId =
			typeof technologyId === "function"
				? technologyId(selectedTechnology)
				: technologyId;
		setSelectedTechnology(newTechnologyId);
		setSelectedSolution("");
		setSolutionVariantA("");
		setSolutionVariantB("");
		setFetchedSolutionA(null);
		setFetchedSolutionB(null);
		setClientSolutions([]);
		setSolutionTypes([]);
	};

	/**
	 * Handle solution variant A selection change
	 */
	const handleSolutionVariantAChange = (
		solutionId: string | ((prev: string) => string)
	) => {
		const newSolutionId =
			typeof solutionId === "function"
				? solutionId(solutionVariantA)
				: solutionId;
		setSolutionVariantA(newSolutionId);
		if (newSolutionId) {
			fetchSolutionVariantA(newSolutionId);
		} else {
			setFetchedSolutionA(null);
		}
	};

	/**
	 * Handle solution variant B selection change
	 */
	const handleSolutionVariantBChange = (
		solutionId: string | ((prev: string) => string)
	) => {
		const newSolutionId =
			typeof solutionId === "function"
				? solutionId(solutionVariantB)
				: solutionId;
		setSolutionVariantB(newSolutionId);
		if (newSolutionId) {
			fetchSolutionVariantB(newSolutionId);
		} else {
			setFetchedSolutionB(null);
		}
	};

	/**
	 * Trigger data fetching when both industry and technology are selected
	 */
	const triggerDataFetching = () => {
		if (selectedIndustry && selectedTechnology && user?.client_id) {
			fetchClientSolutions(selectedIndustry, selectedTechnology);
			fetchSolutionTypes(selectedIndustry, selectedTechnology);
		} else {
			setClientSolutions([]);
			setSolutionTypes([]);
		}
	};

	/**
	 * Load initial data when user is available
	 */
	useEffect(() => {
		if (user?.client_id) {
			loadClientDataAndSelections();
		}
	}, [user?.client_id]);

	/**
	 * Trigger data fetching when dependencies change
	 */
	useEffect(() => {
		triggerDataFetching();
	}, [selectedIndustry, selectedTechnology, user?.client_id]);

	/**
	 * Handle calculation completion and tab switching
	 */
	const handleCalculate = () => {
		setHasCalculated(true);
		setCurrentTab("comparison");
	};

	return (
		<TooltipProvider>
			<Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
				<TabNavigation
					hasCalculated={hasCalculated}
					comparisonMode={comparisonMode}
				/>
				<TabContent
					currentTab={currentTab}
					hasCalculated={hasCalculated}
					comparisonMode={comparisonMode}
					// Configuration props
					selectedIndustry={selectedIndustry}
					setSelectedIndustry={handleIndustryChange}
					selectedTechnology={selectedTechnology}
					setSelectedTechnology={handleTechnologyChange}
					selectedSolution={selectedSolution}
					setSelectedSolution={setSelectedSolution}
					solutionVariantA={solutionVariantA}
					setSolutionVariantA={handleSolutionVariantAChange}
					solutionVariantB={solutionVariantB}
					setSolutionVariantB={handleSolutionVariantBChange}
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
					setComparisonMode={setComparisonMode}
					// Data fetching props
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
					setResultData={setResultData}
					resultData={resultData}
					onCalculate={handleCalculate}
				/>
			</Tabs>
		</TooltipProvider>
	);
}

/**
 * TabNavigation component - Renders the tab navigation with tooltips and disabled states
 */
function TabNavigation({
	hasCalculated,
	comparisonMode,
}: TabNavigationProps) {
	return (
		<TabsList className="grid w-full grid-cols-3">
			<TabsTrigger
				value="configuration"
				className="text-muted-foreground text-sm hover:bg-background border-backdrop data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
			>
				Configuration
			</TabsTrigger>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="relative">
						<TabsTrigger
							value="comparison"
							disabled={!hasCalculated}
							className="text-muted-foreground text-sm hover:bg-background border-backdrop data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed w-full"
						>
							{comparisonMode === "compare" ? "Comparison" : "Results"}
						</TabsTrigger>
						{!hasCalculated && (
							<div className="absolute inset-0 bg-transparent" />
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						Complete configuration and click Calculate to view comparison
						results
					</p>
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="relative">
						<TabsTrigger
							value="outputs"
							disabled={!hasCalculated}
							className="text-muted-foreground text-sm hover:bg-background border-backdrop data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed w-full"
						>
							Outputs
						</TabsTrigger>
						{!hasCalculated && (
							<div className="absolute inset-0 bg-transparent" />
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						Complete configuration and click Calculate to view calculation
						outputs
					</p>
				</TooltipContent>
			</Tooltip>
		</TabsList>
	);
}

/**
 * TabContent component - Renders the appropriate content based on current tab
 */
function TabContent({
	hasCalculated,
	comparisonMode,
	// Configuration props
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
	setComparisonMode,
	// Data fetching props
	clientSolutions,
	isLoadingSolutions,
	solutionTypes,
	industries,
	technologies,
	isLoadingIndustries,
	isLoadingTechnologies,
	fetchedSolutionA,
	fetchedSolutionB,
	parameterValues,
	setParameterValues,
	setResultData,
	// Calculation props
	resultData,
	onCalculate,
}: TabContentProps) {
	return (
		<>
			<TabsContent value="configuration" className="space-y-6">
				<ValueCalculatorConfiguration
					onCalculate={onCalculate}
					// Pass configuration state and handlers as props
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
					comparisonMode={comparisonMode}
					setComparisonMode={setComparisonMode}
					// Pass data fetching state and functions
					clientSolutions={clientSolutions}
					isLoadingSolutions={isLoadingSolutions}
					solutionTypes={solutionTypes}
					industries={industries}
					technologies={technologies}
					isLoadingIndustries={isLoadingIndustries}
					isLoadingTechnologies={isLoadingTechnologies}
					fetchedSolutionA={fetchedSolutionA}
					fetchedSolutionB={fetchedSolutionB}
					parameterValues={parameterValues}
					setParameterValues={setParameterValues}
					setResultData={setResultData}
					resultData={resultData}
				/>
			</TabsContent>

			<TabsContent value="comparison" className="space-y-6">
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-lg">Comparison</CardTitle>
					</CardHeader>
					<CardContent>
						{/* <ValueCalculatorResults
							hasCalculated={hasCalculated}
							selectedIndustry={selectedIndustry}
							selectedTechnology={selectedTechnology}
							selectedSolution={selectedSolution}
							solutionVariantA={solutionVariantA}
							solutionVariantB={solutionVariantB}
							fetchedSolutionA={fetchedSolutionA}
							fetchedSolutionB={fetchedSolutionB}
							resultData={resultData}
							comparisonMode={comparisonMode}
						/> */}
						{/* <TestResultsSemantics solutionData={fetchedSolutionA || fetchedSolutionB || {
								solution_name: "No Solution Selected",
								solution_description: "Please configure a solution to view results",
								status: "pending",
								parameters: [],
								calculations: []
							}}/> */}
							<TestResultsWidget solutionData={fetchedSolutionA || fetchedSolutionB || {
								solution_name: "No Solution Selected",
								solution_description: "Please configure a solution to view results",
								status: "pending",
								parameters: [],
								calculations: []
							}}/>
						{/* <TestResultsAIPowered 
							solutionData={fetchedSolutionA || fetchedSolutionB || {
								solution_name: "No Solution Selected",
								solution_description: "Please configure a solution to view results",
								status: "pending",
								parameters: [],
								calculations: []
							}}
						/> */}
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
		</>
	);
}
