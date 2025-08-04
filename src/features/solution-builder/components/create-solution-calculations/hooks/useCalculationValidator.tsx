import { Calculation } from "@/app/home/product-and-solutions/types";
import { useState, useEffect } from "react";


export function useCalculationValidator(groupedParameters: any, newCalculationData: Calculation) {
    console.log("GROUPED PARAMETERS:", groupedParameters);
    const [parameters, setParameters] = useState<any[]>([])
  
    useEffect(() => {
        const unifiedParameters: any[] = [];

        // Process each category in groupedParameters
        Object.entries(groupedParameters).forEach(([categoryName, items]) => {
            if (Array.isArray(items)) {
                items.forEach((item: any) => {
                    // Determine the type based on the category or item properties
                    let paramType = "COMPANY"; // default
                    
                    if (categoryName.toLowerCase() === "calculations") {
                        paramType = "CALCULATION";
                    } else if (categoryName.toLowerCase() === "global" || categoryName.toLowerCase() === "general") {
                        // Check if it's a company parameter (static/not_viewable)
                        const userInterfaceType = typeof item.user_interface === "string" 
                            ? item.user_interface 
                            : item.user_interface?.type || "input";
                        
                        if (userInterfaceType === "static" || userInterfaceType === "not_viewable") {
                            paramType = "COMPANY";
                        } else {
                            paramType = "USER";
                        }
                    }

                    // Create the parameter object with only required fields
                    const parameterObject: any = {
                        name: item.name,
                        type: paramType,
                        // Keep original item reference for validation logic
                        originalItem: item,
                        category: categoryName.toLowerCase()
                    };

                    // Add value for parameters (general/global)
                    if (paramType === "USER" || paramType === "COMPANY") {
                        if (item.value !== undefined && item.value !== "") {
                            parameterObject.value = item.value;
                        } else if (item.test_value !== undefined && item.test_value !== "") {
                            parameterObject.value = item.test_value;
                        }
                    }

                    // Add formula for calculations
                    if (paramType === "CALCULATION" && item.formula) {
                        parameterObject.formula = item.formula;
                    }

                    unifiedParameters.push(parameterObject);
                });
            }
        });

        // Add the new calculation data
        if (newCalculationData && newCalculationData.name && newCalculationData.formula) {
            const newCalcObject = {
                name: newCalculationData.name,
                type: "CALCULATION",
                formula: newCalculationData.formula,
                category: "calculations",
                originalItem: newCalculationData
            };
            unifiedParameters.push(newCalcObject);
        }

        setParameters(unifiedParameters);
        
        // Prepare request body after parameters are set
        if (unifiedParameters.length > 0) {
            prepareRequestBodyForValidator(unifiedParameters);
        }
    }, [groupedParameters, newCalculationData]);

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

    const prepareRequestBodyForValidator = (unifiedParams: any[]) => {
        const inputs: Record<string, any> = {};
        const requestParameters: any[] = [];
        const parameterNameMapping = new Map<string, string>();

        // Build parameter name mapping from unified parameters
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

        // Extract parameter names from all formulas and add to mapping
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

            // Find the Country parameter (filter type) in unified parameters
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

        // Process unified parameters to create inputs and request parameters
        unifiedParams.forEach((param: any) => {
            const cleanName = cleanParameterName(param.name);
            const originalItem = param.originalItem;

            if (param.type === "USER") {
                // Handle USER parameters (input type)
                const userInterfaceType = typeof originalItem?.user_interface === "string" 
                    ? originalItem.user_interface 
                    : originalItem?.user_interface?.type || "input";

                let value = null;

                if (originalItem?.display_type === "dropdown") {
                    // First try to resolve based on filter (country selection)
                    value = resolveFilterBasedParameter(param, unifiedParams);
                } else if (originalItem?.display_type !== "filter") {
                    let hasValidValue = false;
                    
                    // Try to use the main value first
                    if (originalItem?.value !== undefined && originalItem.value !== "") {
                        value = parseFloat(originalItem.value);
                        if (!isNaN(value)) {
                            inputs[cleanName] = value;
                            hasValidValue = true;
                        }
                    }
                    
                    // Fallback to test_value if no valid value found
                    if (!hasValidValue && originalItem?.test_value !== undefined && originalItem.test_value !== "") {
                        value = parseFloat(originalItem.test_value);
                        if (!isNaN(value)) {
                            inputs[cleanName] = value;
                        }
                    }
                }

                // Create parameter object for USER type
                const paramObject: any = {
                    name: cleanName,
                    type: "USER",
                };

                // Only add non-filter parameters to the parameters array
                if (originalItem?.display_type !== "filter") {
                    requestParameters.push(paramObject);
                }

            } else if (param.type === "COMPANY") {
                // Handle COMPANY parameters (static/not_viewable)
                let numValue = null;

                // If parameter has dropdown options, try filter-based resolution first
                if (originalItem?.dropdown_options && originalItem.dropdown_options.length > 0) {
                    numValue = resolveFilterBasedParameter(param, unifiedParams);
                }

                // If no filter resolution or it failed, try direct value
                if (numValue === null && originalItem?.value !== undefined && originalItem.value !== "") {
                    const directValue = parseFloat(originalItem.value);
                    if (!isNaN(directValue)) {
                        numValue = directValue;
                    }
                }

                // Fallback to test_value if value is not available
                if (numValue === null && originalItem?.test_value !== undefined && originalItem.test_value !== "") {
                    const testValue = parseFloat(originalItem.test_value);
                    if (!isNaN(testValue)) {
                        numValue = testValue;
                    }
                }

                if (numValue !== null && !isNaN(numValue)) {
                    inputs[cleanName] = numValue;
                }

                // Create parameter object for COMPANY type
                const paramObject: any = {
                    name: cleanName,
                    type: "COMPANY",
                };

                // Set value for company parameters
                if (numValue !== null && !isNaN(numValue)) {
                    paramObject.value = numValue;
                }

                // Only add non-filter parameters to the parameters array
                if (originalItem?.display_type !== "filter") {
                    requestParameters.push(paramObject);
                }

            } else if (param.type === "CALCULATION") {
                // Handle CALCULATION parameters
                if (param.formula) {
                    const calcObject: any = {
                        name: cleanName,
                        type: "CALCULATION",
                        formula: cleanFormula(param.formula, parameterNameMapping),
                    };

                    // Add optional fields if they exist
                    if (originalItem?.units) calcObject.unit = originalItem.units;
                    if (originalItem?.description) calcObject.description = originalItem.description;
                    if (originalItem?.output !== undefined) calcObject.output = originalItem.output;
                    if (originalItem?.level !== undefined) calcObject.level = originalItem.level;
                    if (originalItem?.category) calcObject.category = originalItem.category;

                    requestParameters.push(calcObject);
                }
            }
        });

        // Create target list - use only the newCalculationData as the single target
        const targetList = newCalculationData && newCalculationData.name 
            ? [cleanParameterName(newCalculationData.name)]
            : [];

        const requestBody = {
            inputs,
            parameters: requestParameters,
            target: targetList,
        };

        console.log("VALIDATOR INPUTS:", inputs);
        console.log("VALIDATOR PARAMETERS:", requestParameters);
        console.log("VALIDATOR TARGET:", targetList);
        console.log("VALIDATOR REQUEST BODY:", requestBody);

        return requestBody;
    };

    const calculateCalculation = async (unifiedParams: any[]) => {
        const requestBody = prepareRequestBodyForValidator(unifiedParams);

        if (!requestBody) {
			return null;
		}

        console.log("REQUEST BODY:", requestBody);


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

            console.log("DATA ARRAY:", dataArray);
            
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
    }

    const [calculationResult, setCalculationResult] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        const getCalculationResult = async () => {
            if (parameters.length > 0) {
                const returnValue = await calculateCalculation(parameters);
                console.log("UNIFIED PARAMETERS:", returnValue);
                setCalculationResult(returnValue);
            }
        };
        
        getCalculationResult();
    }, [parameters]);

    return calculationResult;
    
    // optimistically render
    // save in db
}