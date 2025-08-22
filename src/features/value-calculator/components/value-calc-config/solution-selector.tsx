import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getClientSolutions } from "@/lib/actions/clients-solutions/clients-solutions";
import { ClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";
import VariantSelector from "./variant-selector";

export default function SolutionSelector(props: {
	hasSelectedIndustryAndTechnology: boolean;
	comparisonMode: "single" | "compare" | null;
	clientData: any;
	selectedIndustry: string;
	selectedTechnology: string;
	hasSelectedMode: boolean;
	setSelectedVariantDataA: (variantData: ClientSolution | null) => void;
	setSelectedVariantDataB: (variantData: ClientSolution | null) => void;
	onChangeSelection: () => void;
		}) {
	const {
		hasSelectedIndustryAndTechnology,
		comparisonMode,
		clientData,
		selectedIndustry,
		selectedTechnology,
		hasSelectedMode,
		setSelectedVariantDataA,
		setSelectedVariantDataB,
		onChangeSelection,
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
	const [selectedSolutionA, setSelectedSolutionA] = useState<string>("");
	const [selectedSolutionB, setSelectedSolutionB] = useState<string>("");
	const [hasSelectedSolutionA, setHasSelectedSolutionA] = useState(false);
	const [hasSelectedSolutionB, setHasSelectedSolutionB] = useState(false);
	const [selectedVariantA, setSelectedVariantA] = useState<string>("");
	const [selectedVariantB, setSelectedVariantB] = useState<string>("");

	useEffect(() => {
		const fetchSolutions = async () => {
			setIsLoadingSolutions(true);
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

			return () => {
				setAvailableSolutions([]);
			};
		};

		if (hasSelectedIndustryAndTechnology) fetchSolutions();
	}, [clientData, comparisonMode, selectedIndustry, selectedTechnology]);

	// Reset solution selection when mode changes
	useEffect(() => {
		if (!hasSelectedMode) {
			setSelectedSolution("");
			setHasSelectedSolution(false);
			setSelectedSolutionA("");
			setSelectedSolutionB("");
			setHasSelectedSolutionA(false);
			setHasSelectedSolutionB(false);
		}
	}, [hasSelectedMode]);

	// Reset solution selection when industry/technology changes
	useEffect(() => {
		setSelectedSolution("");
		setHasSelectedSolution(false);
		setSelectedSolutionA("");
		setSelectedSolutionB("");
		setHasSelectedSolutionA(false);
		setHasSelectedSolutionB(false);
	}, [selectedIndustry, selectedTechnology, comparisonMode]);

	const handleChangeSelection = () => {
		setSelectedSolution("");
		setHasSelectedSolution(false);
		setSelectedSolutionA("");
		setSelectedSolutionB("");
		setHasSelectedSolutionA(false);
		setHasSelectedSolutionB(false);
		setSelectedVariantA("");
		setSelectedVariantB("");
		onChangeSelection();
	};

	// Always show the form when we have industry/tech selected and mode selected
	const shouldShowForm = hasSelectedIndustryAndTechnology && hasSelectedMode;

	// Check if variants are selected
	const hasSelectedVariants = comparisonMode === "single" 
		? selectedVariantA 
		: selectedVariantA && selectedVariantB;

	// Get solution names for display
	const getSolutionName = (solutionId: string) => {
		return availableSolutions.find(s => s.solution === solutionId)?.solution_name || solutionId;
	};

	if (!shouldShowForm) return null;

	// Show summary when variants are selected
	if (hasSelectedVariants) {
		return (
			<Card className="border-2 border-dashed border-gray-200">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-base font-semibold text-green-800">
								Solution Selected ✓
							</span>
							<span>•</span>
							<span>
								{comparisonMode === "single" ? (
									`${getSolutionName(selectedSolution)}`
								) : (
									<>
										{getSolutionName(selectedSolutionA)} vs {getSolutionName(selectedSolutionB)}
									</>
								)}
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleChangeSelection}
							className="text-xs"
						>
							Change Selection
						</Button>
					</div>
				</CardHeader>
			</Card>
		);
	}

	// Show the full form when no variants are selected
	return (
		comparisonMode === "single" ? (
			<>
				{/* Single Mode */}
				<Card className="border-2 border-dashed border-gray-200">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-base font-semibold text-blue-800">
									Solution Selector
								</span>
							</div>
							{selectedSolution && (
								<Button
									variant="outline"
									size="sm"
									onClick={handleChangeSelection}
									className="text-xs"
								>
									Change Selection
								</Button>
							)}
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Solution
							</label>
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
											value={solution.solution || ""}
											onClick={() => {
												setHasSelectedSolution(true);
											}}
										>
											{solution.solution_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{isLoadingSolutions && (
								<p className="text-xs text-gray-500">Loading solutions...</p>
							)}
							<VariantSelector
								selectedSolution={selectedSolution}
								hasSelectedSolution={hasSelectedSolution}
								mode={comparisonMode}
								variant="A"
								setSelectedVariant={setSelectedVariantA}
								clientData={clientData}
								setSelectedVariantData={setSelectedVariantDataA}
							/>
						</div>
					</CardContent>
				</Card>
			</>
		) : (
			<>
				{/* Compare Mode */}
				<Card className="border-2 border-dashed border-gray-200">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-base font-semibold text-blue-800">
									Solution Selector
								</span>
							</div>
							{(selectedSolutionA || selectedSolutionB) && (
								<Button
									variant="outline"
									size="sm"
									onClick={handleChangeSelection}
									className="text-xs"
								>
									Change Selection
								</Button>
							
							)}
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Solution A */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Solution A
								</label>
								<Select
									value={selectedSolutionA}
									onValueChange={(value) => {
										setSelectedSolutionA(value);
										setHasSelectedSolutionA(true);
									}}
									disabled={isLoadingSolutions}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Solution A" />
									</SelectTrigger>
									<SelectContent>
										{availableSolutions.map((solution) => (
											<SelectItem
												key={solution.id}
												value={solution.solution || ""}
												onClick={() => {
													setHasSelectedSolutionA(true);
												}}
											>
												{solution.solution_name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{isLoadingSolutions && (
									<p className="text-xs text-gray-500">Loading solutions...</p>
								)}

								{/* Variant A */}
								<div className="space-y-2 mt-4">
									<VariantSelector
										selectedSolution={selectedSolutionA}
										hasSelectedSolution={hasSelectedSolutionA}
										mode={comparisonMode}
										variant="A"
										setSelectedVariant={setSelectedVariantA}
										clientData={clientData}
										setSelectedVariantData={setSelectedVariantDataA}
									/>
								</div>
							</div>

							{/* Solution B */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Solution B
								</label>
								<Select
									value={selectedSolutionB}
									onValueChange={(value) => {
										setSelectedSolutionB(value);
										setHasSelectedSolutionB(true);
									}}
									disabled={isLoadingSolutions}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Solution B" />
									</SelectTrigger>
									<SelectContent>
										{availableSolutions.map((solution) => (
											<SelectItem
												key={solution.id}
												value={solution.solution || ""}
												onClick={() => {
													setHasSelectedSolutionB(true);
												}}
											>
												{solution.solution_name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{isLoadingSolutions && (
									<p className="text-xs text-gray-500">Loading solutions...</p>
								)}

								{/* Variant B */}
								<div className="space-y-2 mt-4">
									<VariantSelector
										selectedSolution={selectedSolutionB}
										hasSelectedSolution={hasSelectedSolutionB}
										mode={comparisonMode}
										variant="B"
										setSelectedVariant={setSelectedVariantB}
										clientData={clientData}
										setSelectedVariantData={setSelectedVariantDataB}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</>
		)
	);
}
