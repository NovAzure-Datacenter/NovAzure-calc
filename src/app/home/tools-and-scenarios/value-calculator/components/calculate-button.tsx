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
	
	// Function to validate and clean parameters
// Function to validate and clean parameters
const validateAndCleanParameters = (parameters: any[]) => {
	const cleanedParameters = [];
	
	for (const param of parameters) {
		// Skip parameters with invalid names
		if (!param.name || typeof param.name !== 'string') {
			console.warn("Skipping parameter with invalid name:", param);
			continue;
		}
		
		// Clean the parameter object
		const cleanedParam: any = {
			name: param.name,
			type: param.type
		};
		
		// Add value for COMPANY parameters
		if (param.type === "COMPANY" && param.value !== undefined) {
			const numValue = parseFloat(param.value);
			if (!isNaN(numValue)) {
				cleanedParam.value = numValue;
			} else {
				console.warn(`Invalid value for COMPANY parameter ${param.name}:`, param.value);
				continue;
			}
		}
		
		// Add formula for CALCULATION parameters - only if formula exists
		if (param.type === "CALCULATION") {
			if (param.formula) {
				// Clean up formula syntax
				let cleanedFormula = param.formula;
				
				// Fix common formula issues
				cleanedFormula = cleanedFormula.replace(/\s*-\s*/g, '-'); // Remove spaces around minus
				cleanedFormula = cleanedFormula.replace(/\s*\+\s*/g, '+'); // Remove spaces around plus
				cleanedFormula = cleanedFormula.replace(/\s*\*\s*/g, '*'); // Remove spaces around multiply
				cleanedFormula = cleanedFormula.replace(/\s*\/\s*/g, '/'); // Remove spaces around divide
				
				// Fix parameter name references
				cleanedFormula = cleanedFormula.replace(/Nameplate Power\s+/g, 'Nameplate Power '); // Match exact parameter name
				
				cleanedParam.formula = cleanedFormula;
				console.log(`Formula for ${param.name}: "${param.formula}" -> "${cleanedFormula}"`);
			} else {
				console.warn(`Skipping CALCULATION parameter ${param.name} - no formula provided`);
				continue;
			}
		}
		
		cleanedParameters.push(cleanedParam);
	}
	
	return cleanedParameters;
};
	
	const handleCalculate = async () => {
		// Prepare the request body based on parameters
		const prepareRequestBody = () => {
			if (!fetchedSolutionA?.parameters) {
				console.log("No parameters available");
				return;
			}

			const inputs: Record<string, any> = {};
			const parameters: any[] = [];

			// Process each parameter
			fetchedSolutionA.parameters.forEach((param: any) => {
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
						inputs[param.name] = value;
					}
				} else if (param.provided_by === "company") {
					// Handle company-provided parameters - convert to number
					if (param.value !== null && param.value !== undefined) {
						const numValue = parseFloat(param.value);
						if (!isNaN(numValue)) {
							inputs[param.name] = numValue;
						}
					}
				}

				// Add parameter to parameters array
				parameters.push({
					name: param.name,
					type:
						param.provided_by === "user"
							? "USER"
							: param.provided_by === "company"
							? "COMPANY"
							: "CALCULATION",
					...(param.provided_by === "company" && {
						value: parseFloat(param.value),
					}),
					...(param.formula && { formula: param.formula }),
				});
			});

			// Add calculations from fetchedSolutionA.calculations
			if (
				fetchedSolutionA.calculations &&
				Array.isArray(fetchedSolutionA.calculations)
			) {
				fetchedSolutionA.calculations.forEach((calc: any) => {
					// Only add calculations that have formulas
					if (calc.formula) {
						parameters.push({
							name: calc.name,
							type: "CALCULATION",
							formula: calc.formula,
							...(calc.units && { unit: calc.units }),
							...(calc.description && { description: calc.description }),
							...(calc.output && { output: calc.output }),
							...(calc.level && { level: calc.level }),
							...(calc.category && { category: calc.category }),
						});
					}
				});
			}

			const requestBody = {
				inputs,
				parameters,
				target: ["Cooling_Equipment_Capex"],
			};

			return requestBody;
		};

		const requestBody = prepareRequestBody();

		if (!requestBody) {
			console.log("No request body prepared");
			return;
		}

		// Debug: Log the exact request body
		console.log("=== DEBUG: Request Body ===");
		console.log("Inputs:", requestBody.inputs);
		console.log("Cleaned parameters count:", requestBody.parameters.length);
		console.log("First few parameters:", requestBody.parameters.slice(0, 3));
		console.log("Target:", requestBody.target);
		
		// Log all parameters for debugging
		console.log("=== ALL PARAMETERS ===");
		requestBody.parameters.forEach((param, index) => {
			console.log(`${index + 1}. ${param.name} (${param.type}):`, param);
		});
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
