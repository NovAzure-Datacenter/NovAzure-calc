import { Button } from "@/components/ui/button";
import { ClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";

interface CalculateButtonProps {
	fetchedSolutionA: ClientSolution | null;
	parameterValues: Record<string, any>;
	onCalculate?: () => void;
	disabled?: boolean;
}

export default function CalculateButton({
	fetchedSolutionA,
	parameterValues,
	onCalculate,
	disabled = false,
}: CalculateButtonProps) {
	

	
	const handleCalculate = async () => {
		// Prepare the request body based on parameters
		const prepareRequestBody = () => {
			if (!fetchedSolutionA?.parameters) {
				console.log("No parameters available");
				return;
			}

			// STEP 1: Collect ALL original parameter names to build a complete mapping
			console.log("=== STEP 1: COLLECTING ALL ORIGINAL PARAMETER NAMES ===");
			const allOriginalParameterNames = new Set<string>();
			
			// Collect from fetchedSolutionA.parameters
			fetchedSolutionA.parameters.forEach((param: any) => {
				if (param.name && typeof param.name === 'string') {
					allOriginalParameterNames.add(param.name);
					console.log(`Found parameter from .parameters: "${param.name}"`);
				}
			});
			
			// Collect from fetchedSolutionA.calculations  
			if (fetchedSolutionA.calculations && Array.isArray(fetchedSolutionA.calculations)) {
				fetchedSolutionA.calculations.forEach((calc: any) => {
					if (calc.name && typeof calc.name === 'string') {
						allOriginalParameterNames.add(calc.name);
						console.log(`Found parameter from .calculations: "${calc.name}"`);
					}
				});
			}
			
			// STEP 1.5: Extract parameter names from formulas to ensure we have all variants
			console.log("\n--- Extracting parameter names from formulas ---");
			const extractParameterNamesFromFormula = (formula: string): string[] => {
				// Simple regex to find potential parameter names (word characters, spaces, underscores)
				const matches = formula.match(/[a-zA-Z_][a-zA-Z0-9_\s]+/g) || [];
				return matches.map(match => match.trim()).filter(match => match.length > 0);
			};
			
			// Extract from all parameter formulas
			fetchedSolutionA.parameters.forEach((param: any) => {
				if (param.formula) {
					const extractedNames = extractParameterNamesFromFormula(param.formula);
					extractedNames.forEach(name => {
						allOriginalParameterNames.add(name);
						console.log(`Extracted from formula "${param.formula}": "${name}"`);
					});
				}
			});
			
			// Extract from all calculation formulas
			if (fetchedSolutionA.calculations && Array.isArray(fetchedSolutionA.calculations)) {
				fetchedSolutionA.calculations.forEach((calc: any) => {
					if (calc.formula) {
						const extractedNames = extractParameterNamesFromFormula(calc.formula);
						extractedNames.forEach(name => {
							allOriginalParameterNames.add(name);
							console.log(`Extracted from calculation formula "${calc.formula}": "${name}"`);
						});
					}
				});
			}
			
			// CRITICAL: Also manually add known parameter names that might be in formulas
			// Based on the JSON output, we know "Nameplate Power" should exist
			const knownParameterVariants = [
				"Nameplate Power",
				"Test Calculation", 
				"Total Energy Consumption"
			];
			
			knownParameterVariants.forEach(name => {
				allOriginalParameterNames.add(name);
				console.log(`Manually added known parameter: "${name}"`);
			});
			
			console.log(`Total unique parameter names found: ${allOriginalParameterNames.size}`);
			
			// STEP 2: Build the complete parameter name mapping
			console.log("\n=== STEP 2: BUILDING COMPLETE PARAMETER NAME MAPPING ===");
			const parameterNameMap = new Map<string, string>();
			Array.from(allOriginalParameterNames).forEach(originalName => {
				// Clean parameter names by:
				// 1. Trimming whitespace
				// 2. Replacing spaces with underscores
				// 3. Replacing commas with underscores (commas cause parsing issues)
				// 4. Replacing multiple consecutive underscores with single underscore
				const cleanName = originalName.trim()
					.replace(/\s+/g, '_')           // spaces to underscores
					.replace(/,/g, '_')             // commas to underscores  
					.replace(/_+/g, '_')            // multiple underscores to single
					.replace(/^_+|_+$/g, '');       // remove leading/trailing underscores
				
				parameterNameMap.set(originalName, cleanName);
				console.log(`Mapping: "${originalName}" -> "${cleanName}"`);
			});
			
			// Helper function to convert parameter names in formulas
			const convertParameterNamesInFormula = (formula: string): string => {
				console.log(`\n--- Converting formula: "${formula}" ---`);
				let convertedFormula = formula;
				
				// Sort parameter names by length (longest first) to avoid partial replacements
				const sortedNames = Array.from(parameterNameMap.keys())
					.sort((a, b) => b.length - a.length);
				
				console.log("Sorted parameter names (longest first):", sortedNames);
				console.log("Available parameter mappings:");
				Array.from(parameterNameMap.entries()).forEach(([original, clean]) => {
					console.log(`  "${original}" -> "${clean}"`);
				});
				
				for (const originalName of sortedNames) {
					const underscoreName = parameterNameMap.get(originalName)!;
					
					// Only replace if the names are different
					if (originalName !== underscoreName) {
						console.log(`\nAttempting to replace "${originalName}" with "${underscoreName}"`);
						console.log(`Current formula before replacement: "${convertedFormula}"`);
						
						// Test if the original name exists in the formula
						const containsName = convertedFormula.includes(originalName);
						console.log(`Formula contains "${originalName}": ${containsName}`);
						
						if (containsName) {
							// Use word boundaries to ensure we match complete parameter names
							// This regex ensures we match the full parameter name, not partial matches
							const escapedName = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
							console.log(`Escaped regex pattern: "\\b${escapedName}\\b"`);
							
							const regex = new RegExp(`\\b${escapedName}\\b`, 'g');
							const beforeReplace = convertedFormula;
							convertedFormula = convertedFormula.replace(regex, underscoreName);
							
							if (beforeReplace !== convertedFormula) {
								console.log(`✓ SUCCESS: "${beforeReplace}" -> "${convertedFormula}"`);
							} else {
								console.log(`✗ FAILED: Regex didn't match. Trying simple replace...`);
								// Fallback: try simple string replacement
								if (convertedFormula.includes(originalName)) {
									convertedFormula = convertedFormula.replace(new RegExp(escapedName, 'g'), underscoreName);
									console.log(`✓ Simple replace worked: "${convertedFormula}"`);
								}
							}
						} else {
							console.log(`✗ "${originalName}" not found in formula`);
						}
					} else {
						console.log(`Skipping "${originalName}" (no change needed)`);
					}
				}
				
				console.log(`\n🎯 FINAL RESULT: "${formula}" -> "${convertedFormula}"`);
				console.log("--- End formula conversion ---\n");
				return convertedFormula;
			};

			// STEP 3: Process parameters and build inputs/parameters arrays
			console.log("\n=== STEP 3: PROCESSING PARAMETERS ===");
			const inputs: Record<string, any> = {};
			const parameters: any[] = [];

			// Process each parameter from fetchedSolutionA.parameters
			fetchedSolutionA.parameters.forEach((param: any) => {
				console.log(`\nProcessing parameter: "${param.name}" (provided_by: ${param.provided_by})`);
				
				if (param.provided_by === "user") {
					// Handle user-provided parameters
					let value: any = null;

					if (param.display_type === "dropdown") {
						// For dropdown, get the value from the selected key
						const selectedKey = parameterValues[param.id];
						if (selectedKey && param.dropdown_options) {
							const selectedOption = param.dropdown_options.find(
								(option: any) => option.key === selectedKey
							);
							value = selectedOption ? parseFloat(selectedOption.value) : null;
						}
					} else {
						// For simple or range inputs, use the value directly and convert to number
						const rawValue = parameterValues[param.id];
						value =
							rawValue !== null && rawValue !== undefined
								? parseFloat(rawValue)
								: null;
					}

					if (value !== null && value !== undefined && !isNaN(value)) {
						const cleanParamName = parameterNameMap.get(param.name) || param.name;
						inputs[cleanParamName] = value;
						console.log(`Added to inputs: "${cleanParamName}" = ${value}`);
					}
				} else if (param.provided_by === "company") {
					// Handle company-provided parameters - convert to number
					if (param.value !== null && param.value !== undefined) {
						const numValue = parseFloat(param.value);
						if (!isNaN(numValue)) {
							const cleanParamName = parameterNameMap.get(param.name) || param.name;
							inputs[cleanParamName] = numValue;
							console.log(`Added to inputs: "${cleanParamName}" = ${numValue}`);
						}
					}
				}

				// Determine parameter type
				const paramType = param.provided_by === "user" ? "USER" 
					: param.provided_by === "company" ? "COMPANY" 
					: "CALCULATION";
				
				// Skip CALCULATION parameters that don't have formulas
				if (paramType === "CALCULATION" && !param.formula) {
					console.warn(`Skipping CALCULATION parameter "${param.name}" - no formula provided`);
					return;
				}
				
				// Add parameter to parameters array with clean names and converted formulas
				const cleanParamName = parameterNameMap.get(param.name) || param.name;
				
				const paramObject: any = {
					name: cleanParamName,
					type: paramType
				};
				
				// Add value for COMPANY parameters
				if (param.provided_by === "company" && param.value !== undefined) {
					paramObject.value = parseFloat(param.value);
				}
				
				// Add formula for CALCULATION parameters with conversion
				if (param.formula) {
					const convertedFormula = convertParameterNamesInFormula(param.formula);
					paramObject.formula = convertedFormula;
					console.log(`Added formula to ${cleanParamName}: "${convertedFormula}"`);
				}
				
				parameters.push(paramObject);
				console.log(`✓ Added parameter:`, paramObject);
			});

			// Add calculations from fetchedSolutionA.calculations
			if (
				fetchedSolutionA.calculations &&
				Array.isArray(fetchedSolutionA.calculations)
			) {
				console.log("\n--- Processing calculations ---");
				fetchedSolutionA.calculations.forEach((calc: any) => {
					console.log(`Processing calculation: "${calc.name}"`);
					
					// Only add calculations that have formulas
					if (calc.formula) {
						const cleanCalcName = parameterNameMap.get(calc.name) || calc.name;
						const convertedFormula = convertParameterNamesInFormula(calc.formula);
						
						const calcObject: any = {
							name: cleanCalcName,
							type: "CALCULATION",
							formula: convertedFormula,
							...(calc.units && { unit: calc.units }),
							...(calc.description && { description: calc.description }),
							...(calc.output && { output: calc.output }),
							...(calc.level && { level: calc.level }),
							...(calc.category && { category: calc.category }),
						};
						
						parameters.push(calcObject);
						console.log(`✓ Added calculation:`, calcObject);
					} else {
						console.warn(`Skipping calculation ${calc.name} - no formula`);
					}
				});
			}

			const requestBody = {
				inputs,
				parameters,
				target: "TCO",
			};

			console.log("\n=== FINAL REQUEST BODY SUMMARY ===");
			console.log(`Inputs count: ${Object.keys(inputs).length}`);
			console.log(`Parameters count: ${parameters.length}`);
			console.log("Inputs:", inputs);
			console.log("Parameters with formulas:");
			parameters.forEach((param, index) => {
				if (param.formula) {
					console.log(`  ${index + 1}. ${param.name}: "${param.formula}"`);
				}
			});

			return requestBody;
		};

		const requestBody = prepareRequestBody();

		if (!requestBody) {
			console.log("No request body prepared");
			return;
		}

		// Final debug log of the exact JSON being sent
		console.log("=== EXACT JSON BEING SENT TO BACKEND ===");
		console.log(JSON.stringify(requestBody, null, 2));
		console.log("=== END DEBUG ===");

		// Make API call to backend
		try {
			console.log("Sending request to backend...");

			const response = await fetch("http://localhost:8000/api/v1/calculate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			console.log("Response status:", response.status);
			console.log("Response headers:", response.headers);

			if (!response.ok) {
				// Try to get error details
				let errorText = "";
				try {
					errorText = await response.text();
					console.log("Error response body:", errorText);
				} catch (e) {
					console.log("Could not read error response");
				}
				throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
			}

			const data = await response.json();
			console.log("Calculation result:", data);

			// You can handle the result here (e.g., update UI, show results, etc.)
		} catch (err) {
			console.error("Error calling calculation API:", err);
			console.error("Error details:", {
				message: err instanceof Error ? err.message : String(err),
				stack: err instanceof Error ? err.stack : undefined,
				name: err instanceof Error ? err.name : 'Unknown'
			});
			
			// Try a simplified test to see if the backend is working
			console.log("=== TESTING WITH SIMPLIFIED DATA ===");
			try {
				const testResponse = await fetch("http://localhost:8000/api/v1/calculate", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						inputs: { "x": 10.0, "y": 15.0 },
						parameters: [
							{ name: "x", type: "USER" },
							{ name: "y", type: "USER" },
							{ name: "a", type: "COMPANY", value: 2.0 },
							{ name: "opex", type: "CALCULATION", formula: "a*x" },
							{ name: "capex", type: "CALCULATION", formula: "a*y" },
							{ name: "TCO", type: "CALCULATION", formula: "capex+opex" }
						],
						target: "TCO"
					}),
				});
				
				if (testResponse.ok) {
					const testData = await testResponse.json();
					console.log("Simplified test successful:", testData);
					console.log("This means the backend is working, but your data has issues");
				} else {
					console.log("Simplified test also failed:", testResponse.status);
				}
			} catch (testErr) {
				console.log("Simplified test failed:", testErr);
			}
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
