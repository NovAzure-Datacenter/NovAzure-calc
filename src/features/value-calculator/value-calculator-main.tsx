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
import SolutionSelector from "./components/value-calc-config/solution-selector";

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

