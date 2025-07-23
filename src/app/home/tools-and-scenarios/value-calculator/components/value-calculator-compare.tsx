"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, Dispatch, SetStateAction } from "react";
import { Building2, Cpu, Package, ChevronDown, ChevronUp } from "lucide-react";
import ValueCalculatorConfiguration from "./value-calculator-configuration";
import ValueCalculatorComparison from "./value-calculator-comparison";
import ValueCalculatorOutputs from "./value-calculator-outputs";

export default function ValueCalculatorCompare() {
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
	
	// Calculation state
	const [hasCalculated, setHasCalculated] = useState<boolean>(false);

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
									Comparison
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