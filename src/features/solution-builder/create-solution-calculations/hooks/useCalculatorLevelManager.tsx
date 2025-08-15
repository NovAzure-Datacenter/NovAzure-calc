import { useState, useEffect, useCallback } from "react";

interface Parameter {
	name: string;
	type: "USER" | "COMPANY" | "CALCULATION";
	level: number;
	originalItem: any;
	category: string;
	formula?: string;
}

interface UseCalculatorLevelManagerResult {
	parameters: Parameter[];
}

export function useCalculatorLevelManager(
	groupedParameters: Record<string, any[]>, 
	calculations: any[]
): UseCalculatorLevelManagerResult {
	const [parameters, setParameters] = useState<Parameter[]>([]);

	const extractParameterNamesFromFormula = useCallback((formula: string, allParams: Parameter[]): string[] => {
		const foundParams: string[] = [];
		
		const paramNames = allParams.map(p => p.name).sort((a, b) => b.length - a.length);
		const formulaLower = formula.toLowerCase();
		
		paramNames.forEach(paramName => {
			const paramNameLower = paramName.toLowerCase();
			
			const escapedParamName = paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = new RegExp(`\\b${escapedParamName}\\b`, 'gi');
			
			if (regex.test(formula)) {
				foundParams.push(paramName);
			} else if (formulaLower.includes(paramNameLower)) {
				const index = formulaLower.indexOf(paramNameLower);
				const before = index > 0 ? formulaLower[index - 1] : ' ';
				const after = index + paramNameLower.length < formulaLower.length ? 
					formulaLower[index + paramNameLower.length] : ' ';
				
				if (!/[a-zA-Z0-9]/.test(before) && !/[a-zA-Z0-9]/.test(after)) {
					foundParams.push(paramName);
				}
			}
		});
		
		return foundParams;
	}, []);

	const findParameterByName = useCallback((name: string, allParams: Parameter[]): Parameter | null => {
		const param = allParams.find(p => p.name === name);
		if (param) return param;

		const paramCaseInsensitive = allParams.find(p => p.name.toLowerCase() === name.toLowerCase());
		if (paramCaseInsensitive) return paramCaseInsensitive;

		return null;
	}, []);

	const calculateParameterLevels = useCallback((allParameters: Parameter[]): Parameter[] => {
		const processedParams = [...allParameters];
		const calculationParams = processedParams.filter(p => p.type === "CALCULATION");
		
		let changed = true;
		let iterations = 0;
		const maxIterations = 100;

		while (changed && iterations < maxIterations) {
			changed = false;
			iterations++;

			calculationParams.forEach((calcParam) => {
				if (!calcParam.formula) return;

				const referencedParamNames = extractParameterNamesFromFormula(calcParam.formula, processedParams);
				let maxReferencedLevel = 0;

				referencedParamNames.forEach((paramName) => {
					const referencedParam = findParameterByName(paramName, processedParams);
					if (referencedParam && referencedParam.level > maxReferencedLevel) {
						maxReferencedLevel = referencedParam.level;
					}
				});

				const newLevel = maxReferencedLevel > 0 ? maxReferencedLevel + 1 : 2;
				
				if (calcParam.level !== newLevel) {
					calcParam.level = newLevel;
					changed = true;
				}
			});
		}

		return processedParams.sort((a, b) => a.level - b.level);
	}, [extractParameterNamesFromFormula, findParameterByName]);

	useEffect(() => {
		const unifiedParameters: Parameter[] = [];

		Object.entries(groupedParameters).forEach(([categoryName, items]) => {
			if (Array.isArray(items)) {
				items.forEach((item: any) => {
					let paramType: "USER" | "COMPANY" | "CALCULATION" = "COMPANY";

					if (categoryName.toLowerCase() === "calculations") {
						paramType = "CALCULATION";
					} else if (
						categoryName.toLowerCase() === "global" ||
						categoryName.toLowerCase() === "general"
					) {
						const userInterfaceType =
							typeof item.user_interface === "string"
								? item.user_interface
								: item.user_interface?.type || "input";

						if (
							userInterfaceType === "static" ||
							userInterfaceType === "not_viewable"
						) {
							paramType = "COMPANY";
						} else {
							paramType = "USER";
						}
					}

					const parameterObject: Parameter = {
						name: item.name,
						type: paramType,
						level: paramType === "CALCULATION" ? 2 : 1,
						originalItem: item,
						category: categoryName.toLowerCase(),
					};

					if (paramType === "CALCULATION" && item.formula) {
						parameterObject.formula = item.formula;
					}

					unifiedParameters.push(parameterObject);
				});
			}
		});

		if (calculations && calculations.length > 0) {
			calculations.forEach((calc) => {
				if (calc.name && calc.formula) {
					const newCalcObject: Parameter = {
						name: calc.name,
						type: "CALCULATION",
						level: 2,
						formula: calc.formula,
						category: "calculations",
						originalItem: calc,
					};
					unifiedParameters.push(newCalcObject);
				}
			});
		}

		const processedParams = calculateParameterLevels(unifiedParameters);
		setParameters(processedParams);
	}, [groupedParameters, calculations, calculateParameterLevels]);

	return { parameters };
}