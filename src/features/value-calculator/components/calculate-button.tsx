import { Button } from "@/components/ui/button";
import { ClientSolution } from "../api";
import { SetStateAction, useState } from "react";
import { Dispatch } from "react";
import { Loader2 } from "lucide-react";

interface CalculateButtonProps {
	fetchedSolutionA: ClientSolution | null;
	fetchedSolutionB?: ClientSolution | null;
	parameterValues: Record<string, any>;
	comparisonMode?: "single" | "compare" | null;
	onCalculate?: () => void;
	disabled?: boolean;
	setResultData: Dispatch<SetStateAction<any>>;
}

export default function CalculateButton({
	fetchedSolutionA,
	fetchedSolutionB,
	parameterValues,
	comparisonMode = "single",
	onCalculate,
	disabled = false,
	setResultData,
}: CalculateButtonProps) {
	const [isCalculating, setIsCalculating] = useState(false);
	const cleanParameterName = (name: string): string => {
		return name
			.trim()
			.replace(/\s+/g, "_")
			.replace(/,/g, "_")
			.replace(/_+/g, "_")
			.replace(/^_+|_+$/g, "");
	};

	const cleanFormula = (
		formula: string,
		parameterMapping: Map<string, string>
	): string => {
		let cleanedFormula = formula;

		const sortedParams = Array.from(parameterMapping.keys()).sort(
			(a, b) => b.length - a.length
		);

		for (const originalName of sortedParams) {
			const cleanName = parameterMapping.get(originalName)!;
			if (originalName !== cleanName) {
				const escapedName = originalName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const regex = new RegExp(`\\b${escapedName}\\b`, "g");
				cleanedFormula = cleanedFormula.replace(regex, cleanName);
			}
		}

		return cleanedFormula;
	};

	const prepareRequestBody = (solution: ClientSolution) => {
		if (!solution?.parameters) {
			return null;
		}

		const inputs: Record<string, any> = {};
		const parameters: any[] = [];
		const parameterNameMapping = new Map<string, string>();

		solution.parameters.forEach((param: any) => {
			const cleanName = cleanParameterName(param.name);
			parameterNameMapping.set(param.name, cleanName);
		});

		if (solution.calculations && Array.isArray(solution.calculations)) {
			solution.calculations.forEach((calc: any) => {
				const cleanName = cleanParameterName(calc.name);
				parameterNameMapping.set(calc.name, cleanName);
			});
		}

		const extractParameterNamesFromFormula = (formula: string): string[] => {
			const matches = formula.match(/[a-zA-Z_][a-zA-Z0-9_\s]+/g) || [];
			return matches
				.map((match) => match.trim())
				.filter((match) => match.length > 0);
		};

		solution.parameters.forEach((param: any) => {
			if (param.formula) {
				const extractedNames = extractParameterNamesFromFormula(param.formula);
				extractedNames.forEach((name) => {
					if (!parameterNameMapping.has(name)) {
						const cleanName = cleanParameterName(name);
						parameterNameMapping.set(name, cleanName);
					}
				});
			}
		});

		if (solution.calculations && Array.isArray(solution.calculations)) {
			solution.calculations.forEach((calc: any) => {
				if (calc.formula) {
					const extractedNames = extractParameterNamesFromFormula(calc.formula);
					extractedNames.forEach((name) => {
						if (!parameterNameMapping.has(name)) {
							const cleanName = cleanParameterName(name);
							parameterNameMapping.set(name, cleanName);
						}
					});
				}
			});
		}

		// Function to resolve filter-based parameters
		const resolveFilterBasedParameter = (
			param: any,
			allParameters: any[]
		): number | null => {
			if (
				param.display_type !== "dropdown" ||
				!param.dropdown_options ||
				param.dropdown_options.length === 0
			) {
				return null;
			}

			// Find the Country parameter (filter type)
			const countryParam = allParameters.find(
				(p) =>
					p.display_type === "filter" &&
					p.name.toLowerCase().includes("country")
			);

			if (!countryParam || !countryParam.dropdown_options) {
				return null;
			}

			// Get the selected country from user input
			const selectedCountry = parameterValues[countryParam.id];
			if (!selectedCountry) {
				return null;
			}

			// Find the matching option in the dropdown parameter
			const matchingOption = param.dropdown_options.find((option: any) => {
				const optionKey = option.key.toLowerCase();
				const selectedCountryLower = selectedCountry.toLowerCase();

				// Handle different formats:
				// 1. Direct match: "UK" matches "UK"
				// 2. Colon format: "UK" matches "UK: 181"
				// 3. Partial match: "UK" matches "UK, USA, UAE"

				// Direct match
				if (optionKey === selectedCountryLower) {
					return true;
				}

				// Colon format match (e.g., "UK: 181")
				if (optionKey.includes(":")) {
					const countryPart = optionKey.split(":")[0].trim().toLowerCase();
					if (countryPart === selectedCountryLower) {
						return true;
					}
				}

				// Partial match (e.g., "UK, USA, UAE")
				if (optionKey.includes(",")) {
					const countries = optionKey
						.split(",")
						.map((c: string) => c.trim().toLowerCase());
					if (countries.includes(selectedCountryLower)) {
						return true;
					}
				}

				// Contains match
				if (
					optionKey.includes(selectedCountryLower) ||
					selectedCountryLower.includes(optionKey)
				) {
					return true;
				}

				return false;
			});

			if (matchingOption) {
				return parseFloat(matchingOption.value);
			}

			return null;
		};

		solution.parameters.forEach((param: any) => {
			const userInterfaceType =
				typeof param.user_interface === "string"
					? param.user_interface
					: param.user_interface?.type || "input";

			const cleanName = cleanParameterName(param.name);
			parameterNameMapping.set(param.name, cleanName);

			// Handle USER parameters
			if (userInterfaceType === "input") {
				let numValue = null;

				// If parameter has dropdown options, try filter-based resolution first
				if (param.dropdown_options && param.dropdown_options.length > 0) {
					numValue = resolveFilterBasedParameter(param, solution.parameters);
				}

				// If no filter resolution or it failed, try user input
				if (numValue === null && parameterValues[param.id] !== undefined) {
					const userValue = parseFloat(parameterValues[param.id]);
					if (!isNaN(userValue)) {
						numValue = userValue;
					}
				}

				// If no user input, try default value
				if (numValue === null && param.test_value !== undefined) {
					const defaultValue = parseFloat(param.test_value);
					if (!isNaN(defaultValue)) {
						numValue = defaultValue;
					}
				}

				if (numValue !== null && !isNaN(numValue)) {
					inputs[cleanName] = numValue;
				}

				const paramObject: any = {
					name: cleanName,
					type: "USER",
				};

				if (numValue !== null && !isNaN(numValue)) {
					paramObject.value = numValue;
				}

				// Only add non-filter parameters to the parameters array
				if (param.display_type !== "filter") {
					parameters.push(paramObject);
				} else {
					console.log(
						`Filter parameter "${param.name}" excluded from parameters array but can be referenced in formulas`
					);
				}
			}
			// Handle STATIC and NOT_VIEWABLE parameters
			else if (userInterfaceType === "static" || userInterfaceType === "not_viewable") {
				let numValue = null;

				// If parameter has dropdown options, try filter-based resolution first
				if (param.dropdown_options && param.dropdown_options.length > 0) {
					numValue = resolveFilterBasedParameter(param, solution.parameters);
				}

				// If no filter resolution or it failed, try direct value
				if (numValue === null && param.value !== undefined) {
					const directValue = parseFloat(param.value);
					if (!isNaN(directValue)) {
						numValue = directValue;
					}
				}

				if (numValue !== null && !isNaN(numValue)) {
					inputs[cleanName] = numValue;
				} else {
					console.log(`${userInterfaceType === "static" ? "Static" : "Not viewable"} parameter "${param.name}" has no valid value`);
				}
			}

			const paramObject: any = {
				name: cleanName,
				type:
					userInterfaceType === "static" || userInterfaceType === "not_viewable"
						? "COMPANY"
						: "CALCULATION",
			};

			// Only add non-filter parameters to the parameters array
			if (param.display_type !== "filter") {
				// Set value for static and not_viewable parameters
				if (userInterfaceType === "static" || userInterfaceType === "not_viewable") {
					let paramValue = null;

					// If parameter has dropdown options, try filter-based resolution first
					if (param.dropdown_options && param.dropdown_options.length > 0) {
						paramValue = resolveFilterBasedParameter(
							param,
							solution.parameters
						);
					}

					// If no filter resolution or it failed, try direct value
					if (paramValue === null && param.value !== undefined) {
						const directValue = parseFloat(param.value);
						if (!isNaN(directValue)) {
							paramValue = directValue;
						}
					}

					if (paramValue !== null && !isNaN(paramValue)) {
						paramObject.value = paramValue;
					} else {
						console.log(
							`Company parameter object "${param.name}" has no valid value`
						);
					}
				}

				if (param.formula) {
					paramObject.formula = cleanFormula(
						param.formula,
						parameterNameMapping
					);
				}

				parameters.push(paramObject);
			} else {
				console.log(
					`Filter parameter "${param.name}" excluded from parameters array but can be referenced in formulas`
				);
			}
		});

		if (solution.calculations && Array.isArray(solution.calculations)) {
			solution.calculations.forEach((calc: any) => {
				if (calc.formula) {
					const cleanName = cleanParameterName(calc.name);

					const calcObject: any = {
						name: cleanName,
						type: "CALCULATION",
						formula: cleanFormula(calc.formula, parameterNameMapping),
						...(calc.units && { unit: calc.units }),
						...(calc.description && { description: calc.description }),
						...(calc.output && { output: calc.output }),
						...(calc.level && { level: calc.level }),
						...(calc.category && { category: calc.category }),
					};

					parameters.push(calcObject);
				}
			});
		}
		

		const targetList = solution.calculations
			.filter((item: any) => item.display_result === true)
			.map((item: any) => cleanParameterName(item.name));

			console.log("INPUTS:", inputs)
			console.log("PARAMETERS:", parameters)
			console.log("TARGET:", targetList)
		return {
			inputs,
			parameters,
			target: targetList,
		};

	};

	const calculateSolution = async (solution: ClientSolution) => {
		const requestBody = prepareRequestBody(solution);

		if (!requestBody) {
			return null;
		}

		try {
			const response = await fetch("http://localhost:8000/api/v1/calculate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`HTTP error! status: ${response.status}, body: ${errorText}`
				);
			}

			const data = await response.json();

			const resultArray = data.result || data;
			const dataArray = Array.isArray(resultArray)
				? resultArray
				: [resultArray];

			const cleanData = dataArray.reduce(
				(acc: Record<string, any>, value: any, index: number) => {
					if (index < requestBody.target.length) {
						acc[requestBody.target[index]] = value;
					}
					return acc;
				},
				{}
			);

			console.log(cleanData)

			return cleanData;
		} catch (err) {
			console.error("Error calculating solution:", err);
			return null;
		}
	};

	const handleCalculate = async () => {
		setIsCalculating(true);
		
		try {
			if (comparisonMode === "single") {
				// Single mode - calculate only solution A
				if (!fetchedSolutionA) {
					console.error("No solution A provided for single mode");
					return;
				}

				const resultA = await calculateSolution(fetchedSolutionA);

				if (resultA) {
					setResultData({
						solutionA: resultA,
					});
				}
			} else if (comparisonMode === "compare") {
				// Compare mode - calculate both solutions
				if (!fetchedSolutionA || !fetchedSolutionB) {
					console.error("Both solutions required for comparison mode");
					return;
				}

				// Calculate both solutions in parallel
				const [resultA, resultB] = await Promise.all([
					calculateSolution(fetchedSolutionA),
					calculateSolution(fetchedSolutionB),
				]);

				// Set results in a format that can be used by comparison component
				setResultData({
					solutionA: resultA,
					solutionB: resultB,
				});
			}

			// Call the onCalculate callback to trigger tab switch
			if (onCalculate) {
				onCalculate();
			}
		} catch (error) {
			console.error("Error during calculation:", error);
		} finally {
			setIsCalculating(false);
		}
	};



	return (
		<Button 
			className="px-8 py-2" 
			onClick={handleCalculate} 
			disabled={disabled || isCalculating}
		>
			{isCalculating ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Calculating...
				</>
			) : (
				"Calculate"
			)}
		</Button>
	);
}
