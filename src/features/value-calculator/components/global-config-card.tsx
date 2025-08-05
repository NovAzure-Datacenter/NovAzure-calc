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
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
	GlobalConfigCardProps,
	Parameter,
	SharedParameter,
	ComparisonMode,
	UserInterfaceType,
	ParameterValueChangeHandler,
	ParameterInputProps,
	DropdownInputProps,
	FilterInputProps,
	RangeInputProps,
	SimpleInputProps,
	SolutionUniqueParametersProps,
	ColorVariant,
} from "../types/types";
import {
	formatRangeValue,
	convertPercentageToDecimal,
	convertDecimalToPercentage,
} from "../utils/formatters";

/**
 * GlobalConfigCard component - Displays solution parameters in an expandable card
 * Handles parameter input, validation, and user interface logic for both single and comparison modes
 * Supports different parameter types: dropdown, filter, range, and simple inputs
 * Manages parameter visibility based on user_interface.type (input, static, not_viewable)
 */
export default function GlobalConfigCard({
	comparisonMode,
	solutionVariantA,
	solutionVariantB,
	clientSolutions,
	fetchedSolutionA,
	fetchedSolutionB,
	parameterValues,
	handleParameterValueChange,
}: GlobalConfigCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	/**
	 * Helper function to get parameters from a solution
	 * Filters parameters based on user_interface.type (input or static)
	 * Excludes parameters with type "not_viewable"
	 */
	const getSolutionParameters = (solution: any) => {
		if (!solution?.parameters) return [];
		return solution.parameters.filter((param: any) => {
			// Check if user_interface is an object with type property
			if (param.user_interface && typeof param.user_interface === "object") {
				return (
					param.user_interface.type === "input" ||
					param.user_interface.type === "static"
				);
			}
			// Fallback for old format
			return (
				param.user_interface === "input" || param.user_interface === "static"
			);
		});
	};

	// Get parameters for both solutions
	const solutionAParameters = getSolutionParameters(fetchedSolutionA);
	const solutionBParameters = getSolutionParameters(fetchedSolutionB);

	const hasContent =
		solutionAParameters.length > 0 || solutionBParameters.length > 0;

	useEffect(() => {
		if (hasContent && !isExpanded) {
			setIsExpanded(true);
		}
	}, [hasContent, isExpanded]);

	/**
	 * Find shared parameters (parameters with the same name) for comparison mode
	 */
	const getSharedParameters = () => {
		if (comparisonMode !== "compare" || !fetchedSolutionB) return [];

		const sharedParams: any[] = [];
		solutionAParameters.forEach((paramA: any) => {
			const matchingParam = solutionBParameters.find(
				(paramB: any) => paramB.name === paramA.name
			);
			if (matchingParam) {
				sharedParams.push({
					...paramA,
					solutionBParam: matchingParam,
				});
			}
		});
		return sharedParams;
	};

	/**
	 * Find unique parameters for each solution in comparison mode
	 */
	const getUniqueParameters = (
		solutionParams: any[],
		otherSolutionParams: any[]
	) => {
		return solutionParams.filter((param: any) => {
			return !otherSolutionParams.some(
				(otherParam: any) => otherParam.name === param.name
			);
		});
	};

	const sharedParameters = getSharedParameters();
	const uniqueParamsA = getUniqueParameters(
		solutionAParameters,
		solutionBParameters
	);
	const uniqueParamsB = getUniqueParameters(
		solutionBParameters,
		solutionAParameters
	);

	return (
		<>
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<Card
					className="w-full cursor-pointer"
					onClick={(e) => {
						// Prevent card click when clicking on input elements
						const target = e.target as HTMLElement;
						if (
							target instanceof HTMLInputElement ||
							target instanceof HTMLSelectElement ||
							target.closest("button") ||
							target.closest('[role="combobox"]')
						) {
							return;
						}
						setIsExpanded(!isExpanded);
					}}
				>
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle className="text-lg">Solution Parameters</CardTitle>
							{isExpanded ? (
								<ChevronUp className="h-5 w-5" />
							) : (
								<ChevronDown className="h-5 w-5" />
							)}
						</div>
					</CardHeader>
					{isExpanded && (
						<CardContent className="space-y-6">
							{comparisonMode === "single" ? (
								<SingleModeContent
									solutionAParameters={solutionAParameters}
									parameterValues={parameterValues}
									handleParameterValueChange={handleParameterValueChange}
								/>
							) : (
								<CompareModeContent
									sharedParameters={sharedParameters}
									uniqueParamsA={uniqueParamsA}
									uniqueParamsB={uniqueParamsB}
									solutionAParameters={solutionAParameters}
									solutionBParameters={solutionBParameters}
									parameterValues={parameterValues}
									handleParameterValueChange={handleParameterValueChange}
								/>
							)}
						</CardContent>
					)}
				</Card>
			)}
		</>
	);
}

/**
 * SingleModeContent component - Renders parameters for single solution mode
 */
function SingleModeContent({
	solutionAParameters,
	parameterValues,
	handleParameterValueChange,
}: {
	solutionAParameters: any[];
	parameterValues: any;
	handleParameterValueChange: (parameterId: string, value: any) => void;
}) {
	return (
		<div className="space-y-4">
			{solutionAParameters.length === 0 ? (
				<div className="text-center py-8 text-muted-foreground">
					<p>No parameters to display</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{solutionAParameters.map((parameter: any) => (
						<ParameterInput
							key={parameter.id}
							parameter={parameter}
							parameterValues={parameterValues}
							handleParameterValueChange={handleParameterValueChange}
						/>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * CompareModeContent component - Renders parameters for comparison mode
 * Shows shared parameters and solution-specific unique parameters
 */
function CompareModeContent({
	sharedParameters,
	uniqueParamsA,
	uniqueParamsB,
	solutionAParameters,
	solutionBParameters,
	parameterValues,
	handleParameterValueChange,
}: {
	sharedParameters: any[];
	uniqueParamsA: any[];
	uniqueParamsB: any[];
	solutionAParameters: any[];
	solutionBParameters: any[];
	parameterValues: any;
	handleParameterValueChange: (parameterId: string, value: any) => void;
}) {
	return (
		<div className="space-y-8">
			{/* Shared Parameters Section */}
			{sharedParameters.length > 0 && (
				<div className="space-y-4">
					<h4 className="text-sm font-medium text-gray-700 border-b pb-2">
						Shared Parameters
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{sharedParameters.map((sharedParam: any) => (
							<ParameterInput
								key={sharedParam.id}
								parameter={sharedParam}
								parameterValues={parameterValues}
								handleParameterValueChange={handleParameterValueChange}
							/>
						))}
					</div>
				</div>
			)}

			{/* Unique Parameters Section */}
			{(uniqueParamsA.length > 0 || uniqueParamsB.length > 0) && (
				<div className="space-y-4">
					<h4 className="text-sm font-medium text-gray-700 border-b pb-2">
						Solution-Specific Parameters
					</h4>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Solution A Unique Parameters */}
						<SolutionUniqueParameters
							title="Solution A Unique"
							color="blue"
							parameters={uniqueParamsA}
							parameterValues={parameterValues}
							handleParameterValueChange={handleParameterValueChange}
							prefix="A"
						/>

						{/* Solution B Unique Parameters */}
						<SolutionUniqueParameters
							title="Solution B Unique"
							color="green"
							parameters={uniqueParamsB}
							parameterValues={parameterValues}
							handleParameterValueChange={handleParameterValueChange}
							prefix="B"
						/>
					</div>
				</div>
			)}

			{/* No parameters message */}
			{solutionAParameters.length === 0 && solutionBParameters.length === 0 && (
				<div className="text-center py-8 text-muted-foreground">
					<p>No parameters to display</p>
				</div>
			)}
		</div>
	);
}

/**
 * SolutionUniqueParameters component - Renders unique parameters for a specific solution
 */
function SolutionUniqueParameters({
	title,
	color,
	parameters,
	parameterValues,
	handleParameterValueChange,
	prefix,
}: SolutionUniqueParametersProps) {
	const colorClasses = {
		gray: "bg-gray-400",
		blue: "bg-blue-500",
		green: "bg-green-500",
	};

	const dotColors = {
		gray: "bg-gray-300",
		blue: "bg-blue-500",
		green: "bg-green-500",
	};

	return (
		<div className="space-y-4">
			<h5
				className={`text-sm font-medium ${colorClasses[color]} flex items-center gap-2`}
			>
				<div className={`w-2 h-2 ${dotColors[color]} rounded-full`}></div>
				{title}
			</h5>
			<div className="space-y-4">
				{parameters.length > 0 ? (
					parameters.map((parameter: any) => (
						<ParameterInput
							key={parameter.id}
							parameter={parameter}
							parameterValues={parameterValues}
							handleParameterValueChange={handleParameterValueChange}
							prefix={prefix}
						/>
					))
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<p className="text-sm">No unique parameters</p>
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * ParameterInput component - Renders individual parameter input based on display type
 * Handles different input types: dropdown, filter, range, and simple
 * Manages editability based on user_interface.type
 */
function ParameterInput({
	parameter,
	parameterValues,
	handleParameterValueChange,
	prefix = "",
}: ParameterInputProps) {
	const paramId = prefix ? `${prefix}_${parameter.id}` : parameter.id;

	/**
	 * Get user interface type from new or old format
	 */
	const getUserInterfaceType = (param: any) => {
		if (param.user_interface && typeof param.user_interface === "object") {
			return param.user_interface.type;
		}
		return param.user_interface; 
	};

	const userInterfaceType = getUserInterfaceType(parameter);
	const isEditable = userInterfaceType === "input";
	const isStatic = userInterfaceType === "static";

	return (
		<div key={parameter.id} className="space-y-3">
			<div className="flex items-center gap-2">
				<Label className="text-sm font-medium">{parameter.name}</Label>
				{parameter.information && (
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
						<span className="text-xs text-gray-500">Info</span>
					</div>
				)}
				{isStatic && (
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
						<span className="text-xs text-blue-500">Static</span>
					</div>
				)}
				{!isEditable && (
					<div className="flex items-center gap-1">
						<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
						<span className="text-xs text-gray-500">Read-only</span>
					</div>
				)}
			</div>
			<div className="space-y-2">
				{parameter.display_type === "dropdown" ? (
					<DropdownInput
						parameter={parameter}
						paramId={paramId}
						parameterValues={parameterValues}
						handleParameterValueChange={handleParameterValueChange}
						isEditable={isEditable}
					/>
				) : parameter.display_type === "filter" ? (
					<FilterInput
						parameter={parameter}
						paramId={paramId}
						parameterValues={parameterValues}
						handleParameterValueChange={handleParameterValueChange}
						isEditable={isEditable}
					/>
				) : parameter.display_type === "range" ? (
					<RangeInput
						parameter={parameter}
						paramId={paramId}
						parameterValues={parameterValues}
						handleParameterValueChange={handleParameterValueChange}
						isEditable={isEditable}
						formatRangeValue={formatRangeValue}
						convertPercentageToDecimal={convertPercentageToDecimal}
						convertDecimalToPercentage={convertDecimalToPercentage}
					/>
				) : (
					<SimpleInput
						parameter={parameter}
						paramId={paramId}
						parameterValues={parameterValues}
						handleParameterValueChange={handleParameterValueChange}
						isEditable={isEditable}
					/>
				)}
			</div>
		</div>
	);
}

/**
 * DropdownInput component - Renders dropdown parameter input
 */
function DropdownInput({
	parameter,
	paramId,
	parameterValues,
	handleParameterValueChange,
	isEditable,
}: DropdownInputProps) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-muted-foreground">
				Select {parameter.name}:
			</Label>
			<Select
				value={parameterValues[paramId] || ""}
				onValueChange={(value) => handleParameterValueChange(paramId, value)}
				disabled={!isEditable}
			>
				<SelectTrigger
					className={`w-full ${
						!isEditable ? "opacity-60 cursor-not-allowed" : ""
					}`}
				>
					<SelectValue placeholder={`Select an option for ${parameter.name}`} />
				</SelectTrigger>
				<SelectContent>
					{parameter.dropdown_options &&
						parameter.dropdown_options.map((option: any, index: number) => (
							<SelectItem key={index} value={option.key}>
								{option.key}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
		</div>
	);
}

/**
 * FilterInput component - Renders filter parameter input
 */
function FilterInput({
	parameter,
	paramId,
	parameterValues,
	handleParameterValueChange,
	isEditable,
}: FilterInputProps) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-muted-foreground">
				Select {parameter.name}:
			</Label>
			<Select
				value={parameterValues[paramId] || ""}
				onValueChange={(value) => handleParameterValueChange(paramId, value)}
				disabled={!isEditable}
			>
				<SelectTrigger
					className={`w-full ${
						!isEditable ? "opacity-60 cursor-not-allowed" : ""
					}`}
				>
					<SelectValue placeholder={`Select ${parameter.name}`} />
				</SelectTrigger>
				<SelectContent>
					{parameter.dropdown_options &&
						parameter.dropdown_options.map((option: any, index: number) => (
							<SelectItem key={index} value={option.value}>
								{option.value}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
		</div>
	);
}

/**
 * RangeInput component - Renders range parameter input with min/max validation
 */
function RangeInput({
	parameter,
	paramId,
	parameterValues,
	handleParameterValueChange,
	isEditable,
	formatRangeValue,
	convertPercentageToDecimal,
	convertDecimalToPercentage,
}: RangeInputProps) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-muted-foreground">
				{parameter.description || `Enter ${parameter.name}`}
			</Label>
			<Input
				type="number"
				placeholder={`Enter value between ${formatRangeValue(
					parameter.range_min || "0",
					parameter.unit
				)} and ${formatRangeValue(parameter.range_max || "∞", parameter.unit)}`}
				min={
					parameter.unit === "%"
						? formatRangeValue(parameter.range_min || "0", parameter.unit)
						: parameter.range_min
				}
				max={
					parameter.unit === "%"
						? formatRangeValue(parameter.range_max || "∞", parameter.unit)
						: parameter.range_max
				}
				step={parameter.unit === "%" ? "1" : "any"}
				value={
					parameter.unit === "%"
						? convertDecimalToPercentage(
								parameterValues[paramId] || "",
								parameter.unit
						  )
						: parameterValues[paramId] || ""
				}
				onChange={(e) => {
					if (!isEditable) return;
					const convertedValue =
						parameter.unit === "%"
							? convertPercentageToDecimal(e.target.value, parameter.unit)
							: e.target.value;
					handleParameterValueChange(paramId, convertedValue);
				}}
				onKeyDown={(e) => {
					if (!isEditable) {
						e.preventDefault();
						return;
					}

					const min =
						parameter.unit === "%"
							? parseFloat(
									formatRangeValue(parameter.range_min || "0", parameter.unit)
							  )
							: parseFloat(parameter.range_min || "0");
					const max =
						parameter.unit === "%"
							? parseFloat(
									formatRangeValue(parameter.range_max || "∞", parameter.unit)
							  )
							: parseFloat(parameter.range_max || "∞");

					// Allow: backspace, delete, tab, escape, enter, and navigation keys
					if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode)) {
						return;
					}

					// Allow decimal point for non-percentage values
					if (
						e.key === "." &&
						!e.currentTarget.value.includes(".") &&
						parameter.unit !== "%"
					) {
						return;
					}

					// Allow numbers
					if (/[0-9]/.test(e.key)) {
						return;
					}

					// Prevent all other inputs
					e.preventDefault();
				}}
				onBlur={(e) => {
					if (!isEditable) return;

					const value = parseFloat(e.target.value);
					const min =
						parameter.unit === "%"
							? parseFloat(
									formatRangeValue(parameter.range_min || "0", parameter.unit)
							  )
							: parseFloat(parameter.range_min || "0");
					const max =
						parameter.unit === "%"
							? parseFloat(
									formatRangeValue(parameter.range_max || "∞", parameter.unit)
							  )
							: parseFloat(parameter.range_max || "∞");

					// Ensure value is within range on blur
					if (isNaN(value) || value < min) {
						e.target.value = min.toString();
					} else if (value > max) {
						e.target.value = max.toString();
					}
				}}
				disabled={!isEditable}
				className={!isEditable ? "opacity-60 cursor-not-allowed" : ""}
			/>
			{parameter.range_min && parameter.range_max && (
				<div className="text-xs text-muted-foreground">
					Range: {formatRangeValue(parameter.range_min, parameter.unit)} -{" "}
					{formatRangeValue(parameter.range_max, parameter.unit)}{" "}
					{parameter.unit && `(${parameter.unit})`}
				</div>
			)}
		</div>
	);
}

/**
 * SimpleInput component - Renders simple number parameter input
 */
function SimpleInput({
	parameter,
	paramId,
	parameterValues,
	handleParameterValueChange,
	isEditable,
}: SimpleInputProps) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-muted-foreground">
				{parameter.description || `Enter ${parameter.name}`}
			</Label>
			<Input
				type="number"
				placeholder={`Enter ${parameter.name}`}
				value={parameterValues[paramId] || ""}
				onChange={(e) => {
					if (!isEditable) return;
					handleParameterValueChange(paramId, e.target.value);
				}}
				step="0.1"
				disabled={!isEditable}
				className={!isEditable ? "opacity-60 cursor-not-allowed" : ""}
			/>
		</div>
	);
}
