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

export default function HighLevelConfigCard({
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
	clientSolutions: any;
	fetchedSolutionA: any | null;
	fetchedSolutionB: any | null;
	parameterValues: any;
	handleParameterValueChange: (parameterId: string, value: any) => void;
}) {
	const [isHighLevelExpanded, setIsHighLevelExpanded] = useState(false);

	// Helper function to format range values as percentages
	const formatRangeValue = (value: string, unit: string) => {
		if (unit === "%") {
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				return Math.round(numValue * 100).toString();
			}
		}
		return value;
	};

	// Helper function to convert percentage input back to decimal for storage
	const convertPercentageToDecimal = (value: string, unit: string) => {
		if (unit === "%") {
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				// Round to 4 decimal places to avoid floating point precision issues
				return (numValue / 100).toFixed(4);
			}
		}
		return value;
	};

	// Helper function to convert decimal to percentage for display
	const convertDecimalToPercentage = (value: string, unit: string) => {
		if (unit === "%") {
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				// Round to avoid floating point precision issues
				return Math.round(numValue * 100).toString();
			}
		}
		return value;
	};

	// Helper function to get parameters from a solution
	const getSolutionParameters = (solution: any) => {
		if (!solution?.parameters) return [];
		return solution.parameters.filter(
			(param: any) =>
				(param.user_interface === "input" || param.user_interface === "static")
		);
	};

	// Get parameters for both solutions
	const solutionAParameters = getSolutionParameters(fetchedSolutionA);
	const solutionBParameters = getSolutionParameters(fetchedSolutionB);

	// Determine if card should be expanded by default
	const hasContent = solutionAParameters.length > 0 || solutionBParameters.length > 0;

	// Set expansion state based on content
	useEffect(() => {
		if (hasContent && !isHighLevelExpanded) {
			setIsHighLevelExpanded(true);
		}
	}, [hasContent, isHighLevelExpanded]);

	// Find shared parameters (parameters with the same name)
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

	// Find unique parameters for each solution
	const getUniqueParameters = (solutionParams: any[], otherSolutionParams: any[]) => {
		return solutionParams.filter((param: any) => {
			return !otherSolutionParams.some(
				(otherParam: any) => otherParam.name === param.name
			);
		});
	};

	const sharedParameters = getSharedParameters();
	const uniqueParamsA = getUniqueParameters(solutionAParameters, solutionBParameters);
	const uniqueParamsB = getUniqueParameters(solutionBParameters, solutionAParameters);

	// Render parameter input based on type
	const renderParameterInput = (parameter: any, prefix: string = "") => {
		const paramId = prefix ? `${prefix}_${parameter.id}` : parameter.id;
		
		return (
			<div key={parameter.id} className="space-y-3">
				<div className="flex items-center gap-2">
					<Label className="text-sm font-medium">
						{parameter.name}
					</Label>
					{parameter.information && (
						<div className="flex items-center gap-1">
							<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
							<span className="text-xs text-gray-500">Info</span>
						</div>
					)}
				</div>
				<div className="space-y-2">
					{parameter.display_type === "dropdown" ? (
						<div className="space-y-2">
							<Label className="text-xs text-muted-foreground">
								Select {parameter.name}:
							</Label>
							<Select
								value={parameterValues[paramId] || ""}
								onValueChange={(value) =>
									handleParameterValueChange(paramId, value)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={`Select an option for ${parameter.name}`}
									/>
								</SelectTrigger>
								<SelectContent>
									{parameter.dropdown_options &&
										parameter.dropdown_options.map(
											(option: any, index: number) => (
												<SelectItem
													key={index}
													value={option.key}
												>
													{option.key}
												</SelectItem>
											)
										)}
								</SelectContent>
							</Select>
						</div>
					) : parameter.display_type === "filter" ? (
						<div className="space-y-2">
							<Label className="text-xs text-muted-foreground">
								Select {parameter.name}:
							</Label>
							<Select
								value={parameterValues[paramId] || ""}
								onValueChange={(value) =>
									handleParameterValueChange(paramId, value)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={`Select ${parameter.name}`}
									/>
								</SelectTrigger>
								<SelectContent>
									{parameter.dropdown_options &&
										parameter.dropdown_options.map(
											(option: any, index: number) => (
												<SelectItem
													key={index}
													value={option.value}
												>
													{option.value}
												</SelectItem>
											)
										)}
								</SelectContent>
							</Select>
						</div>
					) : parameter.display_type === "range" ? (
						<div className="space-y-2">
							<Label className="text-xs text-muted-foreground">
								{parameter.description ||
									`Enter ${parameter.name}`}
							</Label>
							<Input
								type="number"
								placeholder={`Enter value between ${
									formatRangeValue(parameter.range_min || "0", parameter.unit)
								} and ${formatRangeValue(parameter.range_max || "∞", parameter.unit)}`}
								min={parameter.unit === "%" ? formatRangeValue(parameter.range_min || "0", parameter.unit) : parameter.range_min}
								max={parameter.unit === "%" ? formatRangeValue(parameter.range_max || "∞", parameter.unit) : parameter.range_max}
								step={parameter.unit === "%" ? "1" : "any"}
								value={
									parameter.unit === "%" 
										? convertDecimalToPercentage(parameterValues[paramId] || "", parameter.unit)
										: parameterValues[paramId] || ""
								}
								onChange={(e) => {
									const convertedValue = parameter.unit === "%" 
										? convertPercentageToDecimal(e.target.value, parameter.unit)
										: e.target.value;
									handleParameterValueChange(paramId, convertedValue);
								}}
								onKeyDown={(e) => {
									const min = parameter.unit === "%" ? parseFloat(formatRangeValue(parameter.range_min, parameter.unit)) : parseFloat(parameter.range_min);
									const max = parameter.unit === "%" ? parseFloat(formatRangeValue(parameter.range_max, parameter.unit)) : parseFloat(parameter.range_max);

									// Allow: backspace, delete, tab, escape, enter, and navigation keys
									if (
										[
											8, 9, 27, 13, 46, 37, 38, 39, 40,
										].includes(e.keyCode)
									) {
										return;
									}

									// Allow decimal point only for non-percentage values
									if (
										e.key === "." &&
										!e.currentTarget.value.includes(".") &&
										parameter.unit !== "%"
									) {
										return;
									}

									// Allow numbers
									if (/[0-9]/.test(e.key)) {
										const currentValue = e.currentTarget.value;
										const newValue = currentValue + e.key;

										// Check if the new value would be within range
										const numValue = parseFloat(newValue);
										if (
											!isNaN(numValue) &&
											numValue >= min &&
											numValue <= max
										) {
											return;
										}
									}

									// Prevent all other inputs
									e.preventDefault();
								}}
								onBlur={(e) => {
									const value = parseFloat(e.target.value);
									const min = parameter.unit === "%" ? parseFloat(formatRangeValue(parameter.range_min, parameter.unit)) : parseFloat(parameter.range_min);
									const max = parameter.unit === "%" ? parseFloat(formatRangeValue(parameter.range_max, parameter.unit)) : parseFloat(parameter.range_max);

									// Ensure value is within range on blur
									if (isNaN(value) || value < min) {
										e.target.value = min.toString();
									} else if (value > max) {
										e.target.value = max.toString();
									}
								}}
							/>
							{parameter.range_min && parameter.range_max && (
								<div className="text-xs text-muted-foreground">
									Range: {formatRangeValue(parameter.range_min, parameter.unit)} -{" "}
									{formatRangeValue(parameter.range_max, parameter.unit)}{" "}
									{parameter.unit && `(${parameter.unit})`}
								</div>
							)}
						</div>
					) : (
						<div className="space-y-2">
							<Label className="text-xs text-muted-foreground">
								{parameter.description ||
									`Enter ${parameter.name}`}
							</Label>
							<Input
								type="number"
								placeholder={`Enter ${parameter.name}`}
								value={parameterValues[paramId] || ""}
								onChange={(e) =>
									handleParameterValueChange(paramId, e.target.value)
								}
							/>
						</div>
					)}
				</div>
			</div>
		);
	};

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
						if (target instanceof HTMLInputElement || 
							target instanceof HTMLSelectElement ||
							target.closest('button') ||
							target.closest('[role="combobox"]')) {
							return;
						}
						setIsHighLevelExpanded(!isHighLevelExpanded);
					}}
				>
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle className="text-lg">Configuration Parameters</CardTitle>
							{isHighLevelExpanded ? (
								<ChevronUp className="h-5 w-5" />
							) : (
								<ChevronDown className="h-5 w-5" />
							)}
						</div>
					</CardHeader>
					{isHighLevelExpanded && (
						<CardContent className="space-y-6">
							{comparisonMode === "single" ? (
								// Single mode - show all parameters from solution A
								<div className="space-y-4">
									{solutionAParameters.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											<p>No configuration parameters to display</p>
										</div>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{solutionAParameters.map((parameter: any) =>
												renderParameterInput(parameter)
											)}
										</div>
									)}
								</div>
							) : (
								// Compare mode - show shared and unique parameters
								<div className="space-y-8">
									{/* Shared Parameters Section */}
									{sharedParameters.length > 0 && (
										<div className="space-y-4">
											<h4 className="text-sm font-medium text-gray-700 border-b pb-2">
												Shared Parameters
											</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{sharedParameters.map((sharedParam: any) =>
													renderParameterInput(sharedParam)
												)}
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
												<div className="space-y-4">
													<h5 className="text-sm font-medium text-blue-600 flex items-center gap-2">
														<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
														Solution A Unique
													</h5>
													<div className="space-y-4">
														{uniqueParamsA.length > 0 ? (
															uniqueParamsA.map((parameter: any) =>
																renderParameterInput(parameter, "A")
															)
														) : (
															<div className="text-center py-8 text-muted-foreground">
																<p className="text-sm">No unique parameters</p>
															</div>
														)}
													</div>
												</div>

												{/* Solution B Unique Parameters */}
												<div className="space-y-4">
													<h5 className="text-sm font-medium text-green-600 flex items-center gap-2">
														<div className="w-2 h-2 bg-green-500 rounded-full"></div>
														Solution B Unique
													</h5>
													<div className="space-y-4">
														{uniqueParamsB.length > 0 ? (
															uniqueParamsB.map((parameter: any) =>
																renderParameterInput(parameter, "B")
															)
														) : (
															<div className="text-center py-8 text-muted-foreground">
																<p className="text-sm">No unique parameters</p>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>
									)}

									{/* No parameters message */}
									{solutionAParameters.length === 0 && solutionBParameters.length === 0 && (
										<div className="text-center py-8 text-muted-foreground">
											<p>No configuration parameters to display</p>
										</div>
									)}
								</div>
							)}
						</CardContent>
					)}
				</Card>
			)}
		</>
	);
}
