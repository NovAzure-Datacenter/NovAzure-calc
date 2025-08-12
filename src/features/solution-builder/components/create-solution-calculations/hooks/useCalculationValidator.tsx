import { useState, useEffect, useCallback } from "react";

export function useCalculationValidator(
	groupedParameters: any,
	newCalculationData: { name: string; formula: string } | null
) {
	const [parameters, setParameters] = useState<any[]>([]);
	const [isValidating, setIsValidating] = useState(false);
	const [validationResult, setValidationResult] = useState<any>(null);

	const cleanParameterName = useCallback((name: string): string => {
		return name
			.trim()
			.replace(/\s+/g, "_")
			.replace(/,/g, "_")
			.replace(/_+/g, "_")
			.replace(/^_+|_+$/g, "");
	}, []);

	const cleanFormula = useCallback((
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
	}, []);

	const prepareRequestBodyForValidator = useCallback((unifiedParams: any[]) => {
		const inputs: Record<string, any> = {};
		const requestParameters: any[] = [];
		const parameterNameMapping = new Map<string, string>();

		unifiedParams.forEach((param: any) => {
			const cleanName = cleanParameterName(param.name);
			parameterNameMapping.set(param.name, cleanName);
		});

		const extractParameterNamesFromFormula = (formula: string): string[] => {
			const matches = formula.match(/[a-zA-Z_][a-zA-Z0-9_\s]+/g) || [];
			return matches
				.map((match) => match.trim())
				.filter((match) => match.length > 0);
		};

		unifiedParams.forEach((param: any) => {
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

		const resolveFilterBasedParameter = (
			param: any,
			allUnifiedParams: any[]
		): number | null => {
			const originalItem = param.originalItem;

			if (
				!originalItem ||
				originalItem.display_type !== "dropdown" ||
				!originalItem.dropdown_options ||
				originalItem.dropdown_options.length === 0
			) {
				return null;
			}

			const countryParam = allUnifiedParams.find(
				(p) =>
					p.originalItem &&
					p.originalItem.display_type === "filter" &&
					p.name.toLowerCase().includes("country")
			);

			if (!countryParam || !countryParam.originalItem.dropdown_options) {
				return null;
			}

			return null;
		};

		unifiedParams.forEach((param: any) => {
			const cleanName = cleanParameterName(param.name);
			const originalItem = param.originalItem;

			if (param.type === "USER") {
				const userInterfaceType =
					typeof originalItem?.user_interface === "string"
						? originalItem.user_interface
						: originalItem?.user_interface?.type || "input";

				let value = null;

				if (originalItem?.display_type === "dropdown") {
					value = resolveFilterBasedParameter(param, unifiedParams);
				} else if (originalItem?.display_type !== "filter") {
					let hasValidValue = false;

					if (originalItem?.value !== undefined && originalItem.value !== "") {
						value = parseFloat(originalItem.value);
						if (!isNaN(value)) {
							inputs[cleanName] = value;
							hasValidValue = true;
						}
					}

					if (
						!hasValidValue &&
						originalItem?.test_value !== undefined &&
						originalItem.test_value !== ""
					) {
						value = parseFloat(originalItem.test_value);
						if (!isNaN(value)) {
							inputs[cleanName] = value;
						}
					}
				}

				const paramObject: any = {
					name: cleanName,
					type: "USER",
				};

				if (originalItem?.display_type !== "filter") {
					requestParameters.push(paramObject);
				}
			} else if (param.type === "COMPANY") {
				let numValue = null;

				if (
					originalItem?.dropdown_options &&
					originalItem.dropdown_options.length > 0
				) {
					numValue = resolveFilterBasedParameter(param, unifiedParams);
				}

				if (
					numValue === null &&
					originalItem?.value !== undefined &&
					originalItem.value !== ""
				) {
					const directValue = parseFloat(originalItem.value);
					if (!isNaN(directValue)) {
						numValue = directValue;
					}
				}

				if (
					numValue === null &&
					originalItem?.test_value !== undefined &&
					originalItem.test_value !== ""
				) {
					const testValue = parseFloat(originalItem.test_value);
					if (!isNaN(testValue)) {
						numValue = testValue;
					}
				}

				if (numValue !== null && !isNaN(numValue)) {
					inputs[cleanName] = numValue;
				}

				const paramObject: any = {
					name: cleanName,
					type: "COMPANY",
				};

				if (numValue !== null && !isNaN(numValue)) {
					paramObject.value = numValue;
				}

				if (originalItem?.display_type !== "filter") {
					requestParameters.push(paramObject);
				}
			} else if (param.type === "CALCULATION") {
				if (param.formula) {
					const calcObject: any = {
						name: cleanName,
						type: "CALCULATION",
						formula: cleanFormula(param.formula, parameterNameMapping),
					};

					if (originalItem?.units) calcObject.unit = originalItem.units;
					if (originalItem?.description)
						calcObject.description = originalItem.description;
					if (originalItem?.output !== undefined)
						calcObject.output = originalItem.output;
					if (originalItem?.level !== undefined)
						calcObject.level = originalItem.level;
					if (originalItem?.category)
						calcObject.category = originalItem.category;

					requestParameters.push(calcObject);
				}
			}
		});

		const targetList =
			newCalculationData && newCalculationData.name
				? [cleanParameterName(newCalculationData.name)]
				: [];

		const requestBody = {
			inputs,
			parameters: requestParameters,
			target: targetList,
		};

		return requestBody;
	}, [newCalculationData, cleanParameterName, cleanFormula]);

	useEffect(() => {
		const unifiedParameters: any[] = [];

		Object.entries(groupedParameters).forEach(([categoryName, items]) => {
			if (Array.isArray(items)) {
				items.forEach((item: any) => {
					let paramType = "COMPANY";

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

					const parameterObject: any = {
						name: item.name,
						type: paramType,
						originalItem: item,
						category: categoryName.toLowerCase(),
					};

					if (paramType === "USER" || paramType === "COMPANY") {
						if (item.value !== undefined && item.value !== "") {
							parameterObject.value = item.value;
						} else if (
							item.test_value !== undefined &&
							item.test_value !== ""
						) {
							parameterObject.value = item.test_value;
						}
					}

					if (paramType === "CALCULATION" && item.formula) {
						parameterObject.formula = item.formula;
					}

					unifiedParameters.push(parameterObject);
				});
			}
		});

		if (
			newCalculationData &&
			newCalculationData.name &&
			newCalculationData.formula
		) {
			const newCalcObject = {
				name: newCalculationData.name,
				type: "CALCULATION",
				formula: newCalculationData.formula,
				category: "calculations",
				originalItem: newCalculationData,
			};
			unifiedParameters.push(newCalcObject);
		}

		setParameters(unifiedParameters);

		if (unifiedParameters.length > 0) {
			prepareRequestBodyForValidator(unifiedParameters);
		}
	}, [groupedParameters, newCalculationData, prepareRequestBodyForValidator]);

	const calculateCalculation = useCallback(async (unifiedParams: any[]) => {
		const requestBody = prepareRequestBodyForValidator(unifiedParams);

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
			return cleanData;
		} catch (err) {
			console.error("Error calculating parameter:", err);
			return null;
		}
	}, [prepareRequestBodyForValidator]);

	const [calculationResult, setCalculationResult] = useState<Record<
		string,
		any
	> | null>(null);

	useEffect(() => {
		const getCalculationResult = async () => {
			if (parameters.length > 0) {
				const returnValue = await calculateCalculation(parameters);
				setCalculationResult(returnValue);
			}
		};

		getCalculationResult();
	}, [parameters, calculateCalculation]);

	return calculationResult;
}
