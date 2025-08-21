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

export default function SolutionSelector(props: {
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
	const [selectedSolutionA, setSelectedSolutionA] = useState<string>("");
	const [selectedSolutionB, setSelectedSolutionB] = useState<string>("");
	const [hasSelectedSolutionA, setHasSelectedSolutionA] = useState(false);
	const [hasSelectedSolutionB, setHasSelectedSolutionB] = useState(false);

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

	// Reset solution selection when industry/technology changes
	useEffect(() => {
		setSelectedSolution("");
		setHasSelectedSolution(false);
	}, [selectedIndustry, selectedTechnology, comparisonMode]);

	useEffect(() => {
		console.log(selectedSolutionA, selectedSolutionB);
	}, [selectedSolutionA, selectedSolutionB]);

	return !hasSelectedSolution ? (
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
											value={solution.id || ""}
											onClick={() => {
												setSelectedSolutionA(solution.id ?? "");
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
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
						</div>
						
						{/* Comparison Status */}
						<div className="flex items-center justify-between pt-2">
							<div className="flex items-center gap-4 text-sm text-gray-600">
								{hasSelectedSolutionA && (
									<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
										Solution A Selected
									</span>
								)}
								{hasSelectedSolutionB && (
									<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
										Solution B Selected
									</span>
								)}
							</div>
							{hasSelectedSolutionA && hasSelectedSolutionB && (
								<Button
									variant="default"
									size="sm"
									onClick={() => {
										setSelectedSolutionA("");
										setSelectedSolutionB("");
										setHasSelectedSolutionA(false);
										setHasSelectedSolutionB(false);
									}}
									className="text-xs"
								>
									Reset Selection
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</>
		)
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
							{availableSolutions.find((s) => s.id === selectedSolution)
								?.solution_name || "Solution selected"}
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
