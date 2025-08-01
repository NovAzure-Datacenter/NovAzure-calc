import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building2, Cpu, Package } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ClientSolution } from "../api";
import CalculateButton from "./calculate-button";
import GlobalConfigCard from "./global-config-card";
import {
	ValueCalculatorConfigurationProps,
	ComparisonMode,
	ColorVariant,
	SolutionVariantSelectorProps,
} from "../types/types";

/**
 * ValueCalculatorConfiguration component - Main configuration interface for the value calculator
 * Handles industry, technology, and solution selection with comparison mode setup
 * Manages parameter configuration and calculation triggering
 */
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
	comparisonMode,
	setComparisonMode,
	// Data from parent component
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
}: ValueCalculatorConfigurationProps) {
	/**
	 * Get available technologies based on selected industry
	 */
	const availableTechnologies = selectedIndustry
		? technologies.filter((tech) =>
				industries
					.find((industry) => industry.id === selectedIndustry)
					?.technologies?.some((t: any) => t.id === tech.id)
		  )
		: [];

	/**
	 * Get available solution types based on selected industry and technology
	 */
	const availableSolutionTypes =
		selectedIndustry && selectedTechnology ? solutionTypes : [];

	/**
	 * Get available solution variants based on selected solution
	 */
	const availableSolutionVariants = selectedSolution
		? clientSolutions.filter(
				(solution) =>
					solution.industry_id === selectedIndustry &&
					solution.technology_id === selectedTechnology
		  )
		: [];

	/**
	 * Handle industry selection change with cascading resets
	 */
	const handleIndustryChange = (industryId: string) => {
		setSelectedIndustry(industryId);
		setSelectedTechnology("");
		setSelectedSolution("");
	};

	/**
	 * Handle technology selection change with cascading resets
	 */
	const handleTechnologyChange = (technologyId: string) => {
		setSelectedTechnology(technologyId);
		setSelectedSolution("");
	};

	/**
	 * Handle solution selection change with cascading resets
	 */
	const handleSolutionChange = (solutionId: string) => {
		setSelectedSolution(solutionId);
		setSolutionVariantA("");
		setSolutionVariantB("");
	};

	/**
	 * Handle parameter value changes
	 */
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
				<NoIndustriesWarning />
			)}

			{/* Industry, Technology, and Solution Selection Card */}
			<SolutionSelectionCard
				selectedIndustry={selectedIndustry}
				handleIndustryChange={handleIndustryChange}
				selectedTechnology={selectedTechnology}
				handleTechnologyChange={handleTechnologyChange}
				selectedSolution={selectedSolution}
				handleSolutionChange={handleSolutionChange}
				availableTechnologies={availableTechnologies}
				availableSolutionTypes={availableSolutionTypes}
				industries={industries}
				isLoadingIndustries={isLoadingIndustries}
				isLoadingTechnologies={isLoadingTechnologies}
			/>

			{/* Solution Variants Selection and Comparison Card */}
			{selectedSolution && (
				<SolutionVariantsCard
					comparisonMode={comparisonMode}
					setComparisonMode={setComparisonMode}
					solutionVariantA={solutionVariantA}
					setSolutionVariantA={setSolutionVariantA}
					solutionVariantB={solutionVariantB}
					setSolutionVariantB={setSolutionVariantB}
					availableSolutionVariants={availableSolutionVariants}
					clientSolutions={clientSolutions}
					isLoadingSolutions={isLoadingSolutions}
				/>
			)}

			{/* Global Configuration Card - Display Solution Parameters */}
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<GlobalConfigurationSection
					comparisonMode={comparisonMode}
					solutionVariantA={solutionVariantA}
					solutionVariantB={solutionVariantB}
					clientSolutions={clientSolutions}
					fetchedSolutionA={fetchedSolutionA}
					fetchedSolutionB={fetchedSolutionB}
					parameterValues={parameterValues}
					handleParameterValueChange={handleParameterValueChange}
				/>
			)}

			{/* Calculate Button - Trigger Value Calculation */}
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<CalculationSection
					fetchedSolutionA={fetchedSolutionA}
					fetchedSolutionB={fetchedSolutionB}
					parameterValues={parameterValues}
					comparisonMode={comparisonMode}
					onCalculate={onCalculate}
					setResultData={setResultData}
				/>
			)}
		</div>
	);
}

/**
 * NoIndustriesWarning component - Displays warning when no industries are available
 */
function NoIndustriesWarning() {
	return (
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
	);
}

/**
 * SolutionSelectionCard component - Handles industry, technology, and solution selection
 */
function SolutionSelectionCard({
	selectedIndustry,
	handleIndustryChange,
	selectedTechnology,
	handleTechnologyChange,
	selectedSolution,
	handleSolutionChange,
	availableTechnologies,
	availableSolutionTypes,
	industries,
	isLoadingIndustries,
	isLoadingTechnologies,
}: {
	selectedIndustry: string;
	handleIndustryChange: (industryId: string) => void;
	selectedTechnology: string;
	handleTechnologyChange: (technologyId: string) => void;
	selectedSolution: string;
	handleSolutionChange: (solutionId: string) => void;
	availableTechnologies: any[];
	availableSolutionTypes: any[];
	industries: any[];
	isLoadingIndustries: boolean;
	isLoadingTechnologies: boolean;
}) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-lg">Compare Solutions</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<IndustrySelector
						selectedIndustry={selectedIndustry}
						handleIndustryChange={handleIndustryChange}
						industries={industries}
						isLoadingIndustries={isLoadingIndustries}
					/>
					<TechnologySelector
						selectedTechnology={selectedTechnology}
						handleTechnologyChange={handleTechnologyChange}
						availableTechnologies={availableTechnologies}
						isLoadingTechnologies={isLoadingTechnologies}
						selectedIndustry={selectedIndustry}
					/>
					<SolutionSelector
						selectedSolution={selectedSolution}
						handleSolutionChange={handleSolutionChange}
						availableSolutionTypes={availableSolutionTypes}
						selectedTechnology={selectedTechnology}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * IndustrySelector component - Handles industry selection dropdown
 */
function IndustrySelector({
	selectedIndustry,
	handleIndustryChange,
	industries,
	isLoadingIndustries,
}: {
	selectedIndustry: string;
	handleIndustryChange: (industryId: string) => void;
	industries: any[];
	isLoadingIndustries: boolean;
}) {
	return (
		<div className="space-y-3">
			<Label className="text-sm font-medium flex items-center gap-2">
				<Building2 className="h-4 w-4" />
				Industry
			</Label>
			<Select value={selectedIndustry} onValueChange={handleIndustryChange}>
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
	);
}

/**
 * TechnologySelector component - Handles technology selection dropdown
 */
function TechnologySelector({
	selectedTechnology,
	handleTechnologyChange,
	availableTechnologies,
	isLoadingTechnologies,
	selectedIndustry,
}: {
	selectedTechnology: string;
	handleTechnologyChange: (technologyId: string) => void;
	availableTechnologies: any[];
	isLoadingTechnologies: boolean;
	selectedIndustry: string;
}) {
	return (
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
					{availableTechnologies.length === 0 && !isLoadingTechnologies ? (
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
	);
}

/**
 * SolutionSelector component - Handles solution selection dropdown
 */
function SolutionSelector({
	selectedSolution,
	handleSolutionChange,
	availableSolutionTypes,
	selectedTechnology,
}: {
	selectedSolution: string;
	handleSolutionChange: (solutionId: string) => void;
	availableSolutionTypes: any[];
	selectedTechnology: string;
}) {
	return (
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
								? "Select a solution"
								: "Select a technology first"
						}
					/>
				</SelectTrigger>
				<SelectContent>
					{availableSolutionTypes.length === 0 ? (
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
	);
}

/**
 * SolutionVariantsCard component - Handles solution variant selection and comparison mode
 */
function SolutionVariantsCard({
	comparisonMode,
	setComparisonMode,
	solutionVariantA,
	setSolutionVariantA,
	solutionVariantB,
	setSolutionVariantB,
	availableSolutionVariants,
	clientSolutions,
	isLoadingSolutions,
}: {
	comparisonMode: "single" | "compare" | null;
	setComparisonMode: Dispatch<SetStateAction<"single" | "compare" | null>>;
	solutionVariantA: string;
	setSolutionVariantA: Dispatch<SetStateAction<string>>;
	solutionVariantB: string;
	setSolutionVariantB: Dispatch<SetStateAction<string>>;
	availableSolutionVariants: any[];
	clientSolutions: any[];
	isLoadingSolutions: boolean;
}) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-lg">Solution Variants</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{!comparisonMode && (
					<ComparisonModeSelector setComparisonMode={setComparisonMode} />
				)}

				{comparisonMode === "single" && (
					<SingleModeSelector
						solutionVariantA={solutionVariantA}
						setSolutionVariantA={setSolutionVariantA}
						setComparisonMode={setComparisonMode}
						availableSolutionVariants={availableSolutionVariants}
						clientSolutions={clientSolutions}
						isLoadingSolutions={isLoadingSolutions}
					/>
				)}

				{comparisonMode === "compare" && (
					<CompareModeSelector
						solutionVariantA={solutionVariantA}
						setSolutionVariantA={setSolutionVariantA}
						solutionVariantB={solutionVariantB}
						setSolutionVariantB={setSolutionVariantB}
						setComparisonMode={setComparisonMode}
						availableSolutionVariants={availableSolutionVariants}
						clientSolutions={clientSolutions}
						isLoadingSolutions={isLoadingSolutions}
					/>
				)}
			</CardContent>
		</Card>
	);
}

/**
 * ComparisonModeSelector component - Allows user to choose between single and compare modes
 */
function ComparisonModeSelector({
	setComparisonMode,
}: {
	setComparisonMode: Dispatch<SetStateAction<"single" | "compare" | null>>;
}) {
	return (
		<div className="space-y-4">
			<Label className="text-sm font-medium">
				Would you like to compare two solutions or view a single one?
			</Label>
			<div className="flex justify-center gap-4">
				<Button onClick={() => setComparisonMode("single")} className="w-48">
					View Single Solution
				</Button>
				<Button onClick={() => setComparisonMode("compare")} className="w-48">
					Compare Two Solutions
				</Button>
			</div>
		</div>
	);
}

/**
 * SingleModeSelector component - Handles single solution variant selection
 */
function SingleModeSelector({
	solutionVariantA,
	setSolutionVariantA,
	setComparisonMode,
	availableSolutionVariants,
	clientSolutions,
	isLoadingSolutions,
}: {
	solutionVariantA: string;
	setSolutionVariantA: Dispatch<SetStateAction<string>>;
	setComparisonMode: Dispatch<SetStateAction<"single" | "compare" | null>>;
	availableSolutionVariants: any[];
	clientSolutions: any[];
	isLoadingSolutions: boolean;
}) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Label className="text-sm font-medium">Solution Variant</Label>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setComparisonMode(null)}
				>
					Change Mode
				</Button>
			</div>

			{solutionVariantA && (
				<SelectedSolutionDisplay
					solutionVariantA={solutionVariantA}
					clientSolutions={clientSolutions}
				/>
			)}

			<SolutionVariantSelector
				value={solutionVariantA}
				onValueChange={setSolutionVariantA}
				availableSolutionVariants={availableSolutionVariants}
				isLoadingSolutions={isLoadingSolutions}
				placeholder="Select a variant"
			/>
		</div>
	);
}

/**
 * CompareModeSelector component - Handles dual solution variant selection
 */
function CompareModeSelector({
	solutionVariantA,
	setSolutionVariantA,
	solutionVariantB,
	setSolutionVariantB,
	setComparisonMode,
	availableSolutionVariants,
	clientSolutions,
	isLoadingSolutions,
}: {
	solutionVariantA: string;
	setSolutionVariantA: Dispatch<SetStateAction<string>>;
	solutionVariantB: string;
	setSolutionVariantB: Dispatch<SetStateAction<string>>;
	setComparisonMode: Dispatch<SetStateAction<"single" | "compare" | null>>;
	availableSolutionVariants: any[];
	clientSolutions: any[];
	isLoadingSolutions: boolean;
}) {
	return (
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
				<ComparisonSolutionDisplay
					solutionVariantA={solutionVariantA}
					solutionVariantB={solutionVariantB}
					clientSolutions={clientSolutions}
				/>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<SolutionVariantSelector
					value={solutionVariantA}
					onValueChange={setSolutionVariantA}
					availableSolutionVariants={availableSolutionVariants}
					isLoadingSolutions={isLoadingSolutions}
					placeholder="Select variant A"
					label="Solution Variant A"
					color="gray"
				/>
				<SolutionVariantSelector
					value={solutionVariantB}
					onValueChange={setSolutionVariantB}
					availableSolutionVariants={availableSolutionVariants}
					isLoadingSolutions={isLoadingSolutions}
					placeholder="Select variant B"
					label="Solution Variant B"
					color="gray"
				/>
			</div>
		</div>
	);
}

/**
 * SelectedSolutionDisplay component - Shows selected solution information
 */
function SelectedSolutionDisplay({
	solutionVariantA,
	clientSolutions,
}: {
	solutionVariantA: string;
	clientSolutions: any[];
}) {
	const selectedSolution = clientSolutions.find(
		(s) => s.id === solutionVariantA
	);

	return (
		<div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
			<div className="flex items-center gap-3">
				<div className="w-3 h-3 bg-gray-500 rounded-full"></div>
				<div className="flex-1">
					<div className="font-medium text-gray-900">
						{selectedSolution?.solution_name || "Selected Solution"}
					</div>
					<div className="text-sm text-gray-700">
						{selectedSolution?.solution_description ||
							"No description available"}
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * ComparisonSolutionDisplay component - Shows both selected solutions for comparison
 */
function ComparisonSolutionDisplay({
	solutionVariantA,
	solutionVariantB,
	clientSolutions,
}: {
	solutionVariantA: string;
	solutionVariantB: string;
	clientSolutions: any[];
}) {
	const solutionA = clientSolutions.find((s) => s.id === solutionVariantA);
	const solutionB = clientSolutions.find((s) => s.id === solutionVariantB);

	return (
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
								{solutionA?.solution_name || "Selected Solution"}
							</div>
							<div className="text-sm text-gray-700">
								{solutionA?.solution_description || "No description available"}
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
								{solutionB?.solution_name || "Selected Solution"}
							</div>
							<div className="text-sm text-gray-600">
								{solutionB?.solution_description || "No description available"}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * SolutionVariantSelector component - Generic solution variant selection dropdown
 */
function SolutionVariantSelector({
	value,
	onValueChange,
	availableSolutionVariants,
	isLoadingSolutions,
	placeholder,
	label,
	color = "gray",
}: SolutionVariantSelectorProps) {
	const colorClasses = {
		gray: "bg-gray-400",
		blue: "bg-blue-500",
		green: "bg-green-500",
	};

	return (
		<div className="space-y-4">
			{label && (
				<Label className="text-sm font-medium flex items-center gap-2">
					<div className={`w-2 h-2 ${colorClasses[color]} rounded-full`}></div>
					{label}
				</Label>
			)}
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{availableSolutionVariants.length === 0 && !isLoadingSolutions ? (
						<SelectItem value="no-variants" disabled>
							No variants found for selected solution type
						</SelectItem>
					) : (
						availableSolutionVariants.map((variant) => (
							<SelectItem key={variant.id || ""} value={variant.id || ""}>
								<div className="space-y-1">
									<div className="font-medium">{variant.solution_name}</div>
								</div>
							</SelectItem>
						))
					)}
				</SelectContent>
			</Select>
		</div>
	);
}

/**
 * GlobalConfigurationSection component - Displays solution parameters configuration
 */
function GlobalConfigurationSection({
	comparisonMode,
	solutionVariantA,
	solutionVariantB,
	clientSolutions,
	fetchedSolutionA,
	fetchedSolutionB,
	parameterValues,
	handleParameterValueChange,
}: {
	comparisonMode: "single" | "compare" | null;
	solutionVariantA: string;
	solutionVariantB: string;
	clientSolutions: any[];
	fetchedSolutionA: ClientSolution | null;
	fetchedSolutionB: ClientSolution | null;
	parameterValues: Record<string, any>;
	handleParameterValueChange: (parameterId: string, value: any) => void;
}) {
	return (
		<div className="space-y-6">
			<GlobalConfigCard
				comparisonMode={comparisonMode}
				solutionVariantA={solutionVariantA}
				solutionVariantB={solutionVariantB}
				clientSolutions={clientSolutions}
				fetchedSolutionA={fetchedSolutionA}
				fetchedSolutionB={fetchedSolutionB}
				parameterValues={parameterValues}
				handleParameterValueChange={handleParameterValueChange}
			/>
		</div>
	);
}

/**
 * CalculationSection component - Handles calculation triggering
 */
function CalculationSection({
	fetchedSolutionA,
	fetchedSolutionB,
	parameterValues,
	comparisonMode,
	onCalculate,
	setResultData,
}: {
	fetchedSolutionA: ClientSolution | null;
	fetchedSolutionB: ClientSolution | null;
	parameterValues: Record<string, any>;
	comparisonMode: "single" | "compare" | null;
	onCalculate?: () => void;
	setResultData: Dispatch<SetStateAction<any>>;
}) {
	return (
		<div className="flex justify-center gap-4">
			<CalculateButton
				fetchedSolutionA={fetchedSolutionA}
				fetchedSolutionB={fetchedSolutionB}
				parameterValues={parameterValues}
				comparisonMode={comparisonMode}
				onCalculate={onCalculate}
				disabled={
					!fetchedSolutionA ||
					(comparisonMode === "compare" && !fetchedSolutionB)
				}
				setResultData={setResultData}
			/>
		</div>
	);
}
