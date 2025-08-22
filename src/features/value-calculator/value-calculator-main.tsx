"use client";
import { useEffect, useState } from "react";

import IndustryAndTechnologySelector from "./components/value-calc-config/industry-and-technology-selector";
import ModeSelector from "./components/value-calc-config/mode-selector";
import SolutionSelector from "./components/value-calc-config/solution-selector";
import { VariantSelectorCard } from "./components/value-calc-config/variant-selector";
import { ClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";

export interface ModeSelectorProps {
	setComparisonMode: (mode: "single" | "compare" | null) => void;
	comparisonMode: "single" | "compare" | null;
	hasSelectedMode: boolean;
	setHasSelectedMode: (hasSelectedMode: boolean) => void;
	onModeChangeSelection: () => void;
}

export default function ValueCalculatorMain() {
	const [clientData, setClientData] = useState<any>(null);
	const [hasSelectedMode, setHasSelectedMode] = useState(false);
	const [
		hasSelectedIndustryAndTechnology,
		setHasSelectedIndustryAndTechnology,
	] = useState(false);
	const [hasSelectedSolution, setHasSelectedSolution] = useState(false);

	
	const [selectedIndustry, setSelectedIndustry] = useState<string>("");
	const [selectedTechnology, setSelectedTechnology] = useState<string>("");
	const [comparisonMode, setComparisonMode] = useState<
		"single" | "compare" | null
	>(null);
	const [selectedVariantDataA, setSelectedVariantDataA] = useState<ClientSolution | null>(null);
	const [selectedVariantDataB, setSelectedVariantDataB] = useState<ClientSolution | null>(null);

	// Reset flow when mode changes
	useEffect(() => {
		if (!hasSelectedMode) {
			setHasSelectedIndustryAndTechnology(false);
			setSelectedIndustry("");
			setSelectedTechnology("");
			setSelectedVariantDataA(null);
			setSelectedVariantDataB(null);
		}
	}, [hasSelectedMode]);

	// Function to reset everything when mode selection changes
	const handleModeChangeSelection = () => {
		setHasSelectedMode(false);
		setHasSelectedIndustryAndTechnology(false);
		setHasSelectedSolution(false);
		setSelectedIndustry("");
		setSelectedTechnology("");
		setSelectedVariantDataA(null);
		setSelectedVariantDataB(null);
	};

	// Function to reset industry/technology and everything below
	const handleIndustryTechnologyChangeSelection = () => {
		setHasSelectedIndustryAndTechnology(false);
		setHasSelectedSolution(false);
		setSelectedVariantDataA(null);
		setSelectedVariantDataB(null);
	};

	// Function to reset solution and everything below
	const handleSolutionChangeSelection = () => {
		setHasSelectedSolution(false);
		setSelectedVariantDataA(null);
		setSelectedVariantDataB(null);
	};

	return (
		<div className="space-y-4">
			<ModeSelector
				setComparisonMode={setComparisonMode}
				comparisonMode={comparisonMode}
				hasSelectedMode={hasSelectedMode}
				setHasSelectedMode={setHasSelectedMode}
				onModeChangeSelection={handleModeChangeSelection}
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
					hasSelectedMode={hasSelectedMode}
					onChangeSelection={handleIndustryTechnologyChangeSelection}
				/>
			)}

			{hasSelectedIndustryAndTechnology && hasSelectedMode && (
				<SolutionSelector
					hasSelectedIndustryAndTechnology={hasSelectedIndustryAndTechnology}
					comparisonMode={comparisonMode}
					clientData={clientData}
					selectedIndustry={selectedIndustry}
					selectedTechnology={selectedTechnology}
					hasSelectedMode={hasSelectedMode}
					setSelectedVariantDataA={setSelectedVariantDataA}
					setSelectedVariantDataB={setSelectedVariantDataB}
					onChangeSelection={handleSolutionChangeSelection}
				/>
			)}
			{selectedVariantDataA && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<VariantSelectorCard
						selectedVariantData={selectedVariantDataA}
					/>
					{selectedVariantDataB && (
						<VariantSelectorCard
							selectedVariantData={selectedVariantDataB}
						/>
					)}
				</div>
			)}
			{!selectedVariantDataA && selectedVariantDataB && (
				<VariantSelectorCard
					selectedVariantData={selectedVariantDataB}
				/>
			)}


			
		</div>
	);
}


