"use client";
import { useEffect, useState } from "react";

import IndustryAndTechnologySelector from "./components/value-calc-config/industry-and-technology-selector";
import ModeSelector from "./components/value-calc-config/mode-selector";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ClientSolution,
	getClientSolution,
	getClientSolutions,
} from "@/lib/actions/clients-solutions/clients-solutions";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface ModeSelectorProps {
	setComparisonMode: (mode: "single" | "compare" | null) => void;
	comparisonMode: "single" | "compare" | null;
	hasSelectedMode: boolean;
	setHasSelectedMode: (hasSelectedMode: boolean) => void;
}

export default function ValueCalculatorMain() {
	const [hasSelectedMode, setHasSelectedMode] = useState(false);
	const [clientData, setClientData] = useState<any>(null);
	const [
		hasSelectedIndustryAndTechnology,
		setHasSelectedIndustryAndTechnology,
	] = useState(false);
	const [selectedIndustry, setSelectedIndustry] = useState<string>("");
	const [selectedTechnology, setSelectedTechnology] = useState<string>("");
	const [comparisonMode, setComparisonMode] = useState<
		"single" | "compare" | null
	>(null);

	return (
		<div className="space-y-4">
			<ModeSelector
				setComparisonMode={setComparisonMode}
				comparisonMode={comparisonMode}
				hasSelectedMode={hasSelectedMode}
				setHasSelectedMode={setHasSelectedMode}
			/>

			{hasSelectedMode && (
				<IndustryAndTechnologySelector
					setHasSelectedIndustryAndTechnology={
						setHasSelectedIndustryAndTechnology
					}
					setClientData={setClientData}
					setSelectedIndustryParent={setSelectedIndustry}
					setSelectedTechnologyParent={setSelectedTechnology}
					comparisonMode={comparisonMode}
				/>
			)}

			{hasSelectedIndustryAndTechnology && hasSelectedMode && (
				<SolutionSelector
					hasSelectedIndustryAndTechnology={hasSelectedIndustryAndTechnology}
					comparisonMode={comparisonMode}
					clientData={clientData}
					selectedIndustry={selectedIndustry}
					selectedTechnology={selectedTechnology}
				/>
			)}
		</div>
	);
}

function SolutionSelector(props: {
	hasSelectedIndustryAndTechnology: boolean;
	comparisonMode: "single" | "compare" | null;
	clientData: any;
	selectedIndustry: string;
	selectedTechnology: string;
}) {
	const {
		hasSelectedIndustryAndTechnology,
		comparisonMode,
		clientData,
		selectedIndustry,
		selectedTechnology,
	} = props;

	const [availableSolutions, setAvailableSolutions] = useState<
		{
			id?: string;
			solution?: string;
			solution_name?: string;
			solution_description?: string;
			solution_icon?: string;
			industry: string;
			technology: string;
		}[]
	>([]);

	const [isLoadingSolutions, setIsLoadingSolutions] = useState(false);
	const [selectedSolution, setSelectedSolution] = useState<string>("");
	const [hasSelectedSolution, setHasSelectedSolution] = useState(false);

	useEffect(() => {
		const fetchSolutions = async () => {
			setIsLoadingSolutions(true);
			if (comparisonMode === "single") {
				const solutions = await getClientSolutions(clientData.id);
				// Filter solutions by industry and technology
				const filteredSolutions =
					solutions.solutions?.filter((solution) => {
						return (
							solution.industry === selectedIndustry &&
							solution.technology === selectedTechnology
						);
					}) || [];

				// Remove duplicate solutions
				const availableSolutions =
					filteredSolutions.reduce((unique, solution) => {
						if (!unique.some((s) => s.solution === solution.solution)) {
							unique.push(solution);
						}
						return unique;
					}, [] as ClientSolution[]) || [];

				setAvailableSolutions(availableSolutions);
				setIsLoadingSolutions(false);
			}
			if (comparisonMode === "compare") {
				const solutions = await getClientSolutions(clientData.id);
			}

			return () => {
				setAvailableSolutions([]);
			};
		};

		if (hasSelectedIndustryAndTechnology) fetchSolutions();
	}, [clientData, comparisonMode, selectedIndustry, selectedTechnology]);

	// Reset solution selection when industry/technology changes
	useEffect(() => {
		setSelectedSolution("");
		setHasSelectedSolution(false);
	}, [selectedIndustry, selectedTechnology, comparisonMode]);

	return !hasSelectedSolution ? (
		<Card className="border-2 border-dashed border-gray-200">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-base font-semibold text-blue-800">
							Solution Selector
						</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Solution</label>
					<Select 
						value={selectedSolution} 
						onValueChange={(value) => {
							setSelectedSolution(value);
							setHasSelectedSolution(true);
						}}
						disabled={isLoadingSolutions}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a solution" />
						</SelectTrigger>
						<SelectContent>
							{availableSolutions.map((solution) => (
								<SelectItem
									key={solution.id}
									value={solution.id || ""}
								>
									{solution.solution_name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{isLoadingSolutions && (
						<p className="text-xs text-gray-500">Loading solutions...</p>
					)}
				</div>
			</CardContent>
		</Card>
	) : (
		<Card className="border-2 border-dashed border-gray-200">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-base font-semibold text-blue-800">
							Solution Selected
						</span>
						<span>•</span>
						<span>
							{availableSolutions.find((s) => s.id === selectedSolution)?.solution_name || "Solution selected"}
						</span>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setSelectedSolution("");
							setHasSelectedSolution(false);
						}}
						className="text-xs"
					>
						Change Selection
					</Button>
				</div>
			</CardHeader>
		</Card>
	);
}
