import { Button } from "@/components/ui/button";
import { ClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";
import { SetStateAction } from "react";
import { Dispatch } from "react";

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

	const cleanParameterName = (name: string): string => {
		return name.trim()
			.replace(/\s+/g, '_')
			.replace(/,/g, '_')
			.replace(/_+/g, '_')
			.replace(/^_+|_+$/g, '');
	};

	const cleanFormula = (formula: string, parameterMapping: Map<string, string>): string => {
		let cleanedFormula = formula;
		
		const sortedParams = Array.from(parameterMapping.keys())
			.sort((a, b) => b.length - a.length);
		
		for (const originalName of sortedParams) {
			const cleanName = parameterMapping.get(originalName)!;
			if (originalName !== cleanName) {
				const escapedName = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				const regex = new RegExp(`\\b${escapedName}\\b`, 'g');
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
			return matches.map(match => match.trim()).filter(match => match.length > 0);
		};
		
		solution.parameters.forEach((param: any) => {
			if (param.formula) {
				const extractedNames = extractParameterNamesFromFormula(param.formula);
				extractedNames.forEach(name => {
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
					extractedNames.forEach(name => {
						if (!parameterNameMapping.has(name)) {
							const cleanName = cleanParameterName(name);
							parameterNameMapping.set(name, cleanName);
						}
					});
				}
			});
		}

		solution.parameters.forEach((param: any) => {
			const cleanName = cleanParameterName(param.name);
			
			if (param.provided_by === "user") {
				let value = null;
				
				if (param.display_type === "dropdown") {
					const selectedKey = parameterValues[param.id];
					if (selectedKey && param.dropdown_options) {
						const selectedOption = param.dropdown_options.find(
							(option: any) => option.key === selectedKey
						);
						value = selectedOption ? parseFloat(selectedOption.value) : null;
					}
				} else {
					const rawValue = parameterValues[param.id];
					value = rawValue !== null && rawValue !== undefined ? parseFloat(rawValue) : null;
				}
				
				if (value !== null && !isNaN(value)) {
					inputs[cleanName] = value;
				}
			}
			
			else if (param.provided_by === "company" && param.value !== undefined) {
				const numValue = parseFloat(param.value);
				if (!isNaN(numValue)) {
					inputs[cleanName] = numValue;
				}
			}
			
			const paramObject: any = {
				name: cleanName,
				type: param.provided_by === "user" ? "USER" 
					: param.provided_by === "company" ? "COMPANY" 
					: "CALCULATION"
			};
			
			if (param.provided_by === "company" && param.value !== undefined) {
				paramObject.value = parseFloat(param.value);
			}
			
			if (param.formula) {
				paramObject.formula = cleanFormula(param.formula, parameterNameMapping);
			}
			
			parameters.push(paramObject);
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
				throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
			}

			const data = await response.json();
			
			const resultArray = data.result || data;
			const dataArray = Array.isArray(resultArray) ? resultArray : [resultArray];
			
			const cleanData = dataArray.reduce((acc: Record<string, any>, value: any, index: number) => {
				if (index < requestBody.target.length) {
					acc[requestBody.target[index]] = value;
				}
				return acc;
			}, {});

			return cleanData;
		} catch (err) {
			console.error("Error calculating solution:", err);
			return null;
		}
	};

	const handleCalculate = async () => {
		console.log("Calculate button clicked");
		console.log("Comparison mode:", comparisonMode);
		console.log("Solution A:", fetchedSolutionA?.solution_name);
		console.log("Solution B:", fetchedSolutionB?.solution_name);

		if (comparisonMode === "single") {
			// Single mode - calculate only solution A
			if (!fetchedSolutionA) {
				console.error("No solution A provided for single mode");
				return;
			}

			console.log("Calculating single solution...");
			const resultA = await calculateSolution(fetchedSolutionA);
			console.log("Single calculation result:", resultA);
			
			if (resultA) {
				setResultData({
					solutionA: resultA
				});
			}
		} else if (comparisonMode === "compare") {
			// Compare mode - calculate both solutions
			if (!fetchedSolutionA || !fetchedSolutionB) {
				console.error("Both solutions required for comparison mode");
				return;
			}

			console.log("Calculating both solutions...");
			// Calculate both solutions in parallel
			const [resultA, resultB] = await Promise.all([
				calculateSolution(fetchedSolutionA),
				calculateSolution(fetchedSolutionB)
			]);

			console.log("Comparison calculation results:", { resultA, resultB });

			// Set results in a format that can be used by comparison component
			setResultData({
				solutionA: resultA,
				solutionB: resultB
			});
		}

		if (onCalculate) {
			onCalculate();
		}
	};

	return (
		<Button 
			className="px-8 py-2" 
			onClick={handleCalculate}
			disabled={disabled}
		>
			Calculate
		</Button>
	);
}