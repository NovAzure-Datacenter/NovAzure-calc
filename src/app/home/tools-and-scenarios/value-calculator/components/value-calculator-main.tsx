"use client";

import {
	useState,
	useEffect,
	forwardRef,
	useRef,
	useImperativeHandle,
} from "react";
import { HeaderSelectors } from "./header-selectors";
import ConfigurationCard from "./configuration-card";
import { ResultsSection } from "./results-section";
import ValueCalculatorCompareWrapper from "./value-calculator-compare-wrapper";
import { ValueCalculatorProgress } from "./value-calculator-progress";
import { Button } from "@/components/ui/button";
import type {
	ConfigField,
	ConfigFieldAPI,
	ProductConfigResponse,
	CalculationResults,
	AdvancedConfig,
} from "../types/types";

// API Function
async function fetchSolutionVariantConfig(
	solutionVariantId?: string,
	solutionName?: string
): Promise<ProductConfigResponse> {
	try {
		let url = `/api/value-calculator/solution-variant-config?`;
		if (solutionVariantId)
			url += `solutionVariantId=${encodeURIComponent(solutionVariantId)}&`;
		if (solutionName) url += `solutionName=${encodeURIComponent(solutionName)}`;
		const response = await fetch(url);
		const result = await response.json();

		if (!result.success) {
			throw new Error(
				result.error || "Failed to fetch solution variant configuration"
			);
		}

		return result.data as ProductConfigResponse;
	} catch (error) {
		console.error("Error fetching solution variant config:", error);
		throw error;
	}
}

interface ValueCalculatorMainProps {
	hideCompareButton?: boolean;
	onCalculationResult?: (result: any, valid: boolean) => void;
	isCompareMode?: boolean;
	onCompareValidityChange?: (valid: boolean) => void;
	hideResultsSection?: boolean;
	onCompareClick?: () => void;
	onIndustryChange?: (industry: string) => void;
	onTechnologyChange?: (technology: string) => void;
	inheritedIndustry?: string;
	inheritedTechnology?: string;
	isFirstCalculator?: boolean;
	isSecondCalculator?: boolean;
	hideProgress?: boolean;
	onSolutionNameChange?: (name: string) => void;
	onAdvancedConfigChange?: (config: any) => void;
}

const ValueCalculatorMain = forwardRef(function ValueCalculatorMain(
	{
		hideCompareButton = false,
		onCalculationResult,
		isCompareMode = false,
		onCompareValidityChange,
		hideResultsSection = false,
		onCompareClick,
		onIndustryChange,
		onTechnologyChange,
		inheritedIndustry,
		inheritedTechnology,
		isFirstCalculator = false,
		isSecondCalculator = false,
		hideProgress = false,
		onSolutionNameChange,
		onAdvancedConfigChange,
	}: ValueCalculatorMainProps,
	ref
) {
	// Single calculator state and logic must be inside the component
	const [selectedIndustry, setSelectedIndustry] = useState("");
	const [selectedTechnology, setSelectedTechnology] = useState("");
	const [selectedSolution, setSelectedSolution] = useState("");
	const [selectedSolutionInfo, setSelectedSolutionInfo] = useState<{
		name: string;
		description?: string;
	} | null>(null);
	const [selectedSolutionVariant, setSelectedSolutionVariant] = useState("");
	const [showResults, setShowResults] = useState(false);
	const [isLoadingConfig, setIsLoadingConfig] = useState(false);
	const [configFields, setConfigFields] = useState<ConfigField[]>([]);
	const [advancedConfig, setAdvancedConfig] = useState<AdvancedConfig>({
		inletTemperature: 0,
		electricityPrice: 0,
		waterPrice: 0,
		waterloop: "",
		requiredElectricalPowerIncrease: 0,
		coolingAlternative: "",
		defaultAirCoolingTechnology: "",
		airChassisPerRack: 0,
		airCoolingCapexCost: 0,
		annualAirCoolingMaintenance: 0,
		airWUE: 0,
		chassisTechnology: "",
		plcRackCoolingCapacity: 0,
		annualPLCMaintenance: 0,
		includePoCCost: "",
		totalPoCCost: 0,
		plcChassisPerRack: 0,
		serverRatedMaxPower: 0,
		maxChassisPerRackAir: 0,
		totalAirPowerPerRack: 0,
		includeITCost: "",
		typicalITCostPerServer: 0,
		typicalITCostPerServerAlt: 0,
		annualITMaintenanceCost: 0,
		serverRefreshYears: 0,
		floorSpacePerAirRack: 0,
		floorSpacePerPLCRack: 0,
		spaceUnit: "",
	});
	const [calculationRawResult, setCalculationRawResult] = useState<any>(null);

	// Handle inherited industry and technology for second calculator
	useEffect(() => {
		if (isSecondCalculator && inheritedIndustry && inheritedTechnology) {
			// Only update if the values are different to avoid unnecessary re-renders
			if (selectedIndustry !== inheritedIndustry) {
				setSelectedIndustry(inheritedIndustry);
			}
			if (selectedTechnology !== inheritedTechnology) {
				setSelectedTechnology(inheritedTechnology);
			}
		}
	}, [
		inheritedIndustry,
		inheritedTechnology,
		isSecondCalculator,
		selectedIndustry,
		selectedTechnology,
	]);

	// Handle callbacks for first calculator
	useEffect(() => {
		if (isFirstCalculator && onIndustryChange) {
			onIndustryChange(selectedIndustry);
		}
	}, [selectedIndustry, isFirstCalculator, onIndustryChange]);

	useEffect(() => {
		if (isFirstCalculator && onTechnologyChange) {
			onTechnologyChange(selectedTechnology);
		}
	}, [selectedTechnology, isFirstCalculator, onTechnologyChange]);

	useEffect(() => {
		if (onSolutionNameChange && selectedSolutionInfo?.name) {
			onSolutionNameChange(selectedSolutionInfo.name);
		}
	}, [selectedSolutionInfo?.name, onSolutionNameChange]);

	useEffect(() => {
		if (onAdvancedConfigChange) {
			onAdvancedConfigChange(advancedConfig);
		}
	}, [advancedConfig, onAdvancedConfigChange]);

	useEffect(() => {
		if (selectedSolutionInfo?.name) {
			setIsLoadingConfig(true);
			fetchSolutionVariantConfig(
				selectedSolutionVariant,
				selectedSolutionInfo.name
			)
				.then((config: ProductConfigResponse) => {
					const convertConfigFields = (
						apiFields: ConfigFieldAPI[]
					): ConfigField[] => {
						return apiFields.map((field) => {
							return {
								id: field.id,
								label: field.label,
								type:
									field.type === "number" ||
									field.type === "text" ||
									field.type === "select"
										? field.type
										: "text",
								value: field.value || "",
								unit: field.unit,
								options: field.options,
								required: field.required || false,
							};
						});
					};
					// Add solution_type as a config field
					const baseFields = convertConfigFields(config.config_fields || []);
					// Only add if not already present
					setConfigFields(baseFields);
				})
				.catch((error) => {
					console.error(
						"Error fetching solution variant configuration:",
						error
					);
					setConfigFields([]);
				})
				.finally(() => {
					setIsLoadingConfig(false);
				});
		} else {
			setConfigFields([]);
		}
	}, [selectedSolutionInfo, selectedSolutionVariant]);
	const [results, setResults] = useState<CalculationResults>({
		costSavings: 0,
		energyEfficiency: 0,
		roi: 0,
		paybackPeriod: 0,
		carbonReduction: 0,
	});
	const updateFieldValue = (
		fields: ConfigField[],
		setFields: (fields: ConfigField[]) => void,
		id: string,
		value: string | number
	) => {
		setFields(
			fields.map((field) => (field.id === id ? { ...field, value } : field))
		);
	};
	const handleConfigFieldChange = (id: string, value: string | number) => {
		updateFieldValue(configFields, setConfigFields, id, value);
	};
	const calculateResults = () => {
		// Only use configFields for calculations now
		const getFieldValue = (fields: ConfigField[], fieldId: string): number => {
			const field = fields.find((f) => f.id === fieldId);
			return field ? parseFloat(field.value?.toString() || "0") : 0;
		};
		const powerConsumption =
			getFieldValue(configFields, "power_consumption") ||
			getFieldValue(configFields, "Power (kW)") ||
			getFieldValue(configFields, "68512dce0500c3991f6c4bd0") ||
			100;
		const isChassisImmersion = configFields.some(
			(field) => field.id === "annualised_liquid_cooled_ppue"
		);
		const pueValue = isChassisImmersion
			? getFieldValue(configFields, "annualised_liquid_cooled_ppue") || 1.05
			: 1.2;
		const advancedField = configFields.find((f) => f.id === "advanced");
		const isAdvanced =
			advancedField?.value === "Yes" || advancedField?.value === "true";
		const advancedGridField = configFields.find(
			(f) => f.id === "advanced_grid"
		);
		const advancedGrid =
			advancedGridField?.value === "TRUE" ||
			advancedGridField?.value === "true";
		// Set default values
		const electricityCost = 0.12;
		const carbonFactor = 0.4;
		const projectLifetime = 10;
		const maintenanceCost = 5000;
		const annualEnergyConsumption = powerConsumption * 8760;
		const totalEnergyConsumption = annualEnergyConsumption * pueValue;
		const annualEnergyCost = totalEnergyConsumption * electricityCost;
		const baseEfficiencyImprovement = isChassisImmersion ? 35 : 25;
		const advancedBonus = isAdvanced ? 5 : 0;
		const efficiencyImprovement = baseEfficiencyImprovement + advancedBonus;
		const annualSavings = annualEnergyCost * (efficiencyImprovement / 100);
		const totalSavings = (annualSavings - maintenanceCost) * projectLifetime;
		const costMultiplier = isChassisImmersion ? 3.5 : 2.5;
		const solutionCost = annualSavings * costMultiplier;
		const roi = (totalSavings / solutionCost) * 100;
		const paybackPeriod = solutionCost / (annualSavings - maintenanceCost);
		const carbonReduction =
			((totalEnergyConsumption * carbonFactor * efficiencyImprovement) / 100) *
			projectLifetime;
		const realResults: CalculationResults = {
			costSavings: Math.round(totalSavings),
			energyEfficiency: efficiencyImprovement,
			roi: Math.round(roi),
			paybackPeriod: Math.round(paybackPeriod * 10) / 10,
			carbonReduction: Math.round(carbonReduction),
		};
		setResults(realResults);
		setShowResults(true);
	};
	const handleCalculationResult = (result: any) => {
		// Store the raw result directly
		setCalculationRawResult(result);
		setShowResults(true);

		// If in compare mode, propagate result and validity
		if (isCompareMode && onCalculationResult) {
			// Defer state update to after render to avoid React warning
			setTimeout(() => {
				onCalculationResult(result, areRequiredFieldsValid());
			}, 0);
		} else if (onCalculationResult) {
			setTimeout(() => {
				onCalculationResult(result, areRequiredFieldsValid());
			}, 0);
		}
	};
	const areRequiredFieldsValid = () => {
		const valid = configFields.every((field) => {
			if (!field.required) return true;
			if (field.type === "select") {
				return (
					field.value &&
					field.value !== "" &&
					field.value !== "Select an Option"
				);
			} else {
				return (
					field.value !== "" &&
					field.value !== null &&
					field.value !== undefined
				);
			}
		});
		return valid;
	};

	// Use useEffect to handle validity change callback to avoid setState during render
	useEffect(() => {
		if (isCompareMode && onCompareValidityChange) {
			const valid = areRequiredFieldsValid();
			onCompareValidityChange(valid);
		}
	}, [configFields, isCompareMode, onCompareValidityChange]);

	// Auto-trigger calculation when fields change in compare mode
	useEffect(() => {
		if (isCompareMode && areRequiredFieldsValid() && configCardRef.current) {
			// Small delay to ensure the field change is processed
			const timeoutId = setTimeout(() => {
				if (configCardRef.current && configCardRef.current.runCalculation) {
					configCardRef.current.runCalculation();
				}
			}, 300);

			return () => clearTimeout(timeoutId);
		}
	}, [configFields, isCompareMode]);
	const isCalculateDisabled =
		!selectedIndustry ||
		!selectedTechnology ||
		!selectedSolution ||
		isLoadingConfig ||
		!areRequiredFieldsValid();

	// Check if all header selectors are filled out
	const areHeaderSelectorsComplete = () => {
		return (
			selectedIndustry &&
			selectedTechnology &&
			selectedSolution &&
			selectedSolutionVariant
		);
	};

	// Calculate current step based on header selector completions
	const getCurrentStep = () => {
		if (selectedSolutionVariant) return 4;
		if (selectedSolution) return 3;
		if (selectedTechnology) return 2;
		if (selectedIndustry) return 1;
		return 0;
	};

	// Ref to call runCalculation on ConfigurationCard
	const configCardRef = useRef<any>(null);

	// Convert configFields to input parameters format for scenario storage
	const getInputParameters = () => {
		const inputParams: any = {};
		configFields.forEach((field) => {
			inputParams[field.id] = field.value;
		});
		return inputParams;
	};

	// Expose runCalculation to parent via ref
	useImperativeHandle(ref, () => ({
		runCalculation: () => {
			if (configCardRef.current && configCardRef.current.runCalculation) {
				configCardRef.current.runCalculation();
			}
		},
	}));

	return (
		<div className="w-full">
			<div className="space-y-6 max-w-7xl mx-auto">
				{/* Progress Indicator */}
				{!hideProgress && (
					<div className="relative">
						<ValueCalculatorProgress
							currentStep={getCurrentStep()}
							selectedIndustry={selectedIndustry}
							selectedTechnology={selectedTechnology}
							selectedSolution={selectedSolution}
							selectedSolutionVariant={selectedSolutionVariant}
							isConfigurationComplete={areRequiredFieldsValid()}
						/>
						{!hideCompareButton && onCompareClick && (
							<Button
								variant="outline"
								size="sm"
								onClick={onCompareClick}
								className="absolute top-4 right-4 h-8 px-3 text-xs"
							>
								Compare to Another Solution
							</Button>
						)}
					</div>
				)}

				{/* Header Selectors */}
				<HeaderSelectors
					selectedIndustry={selectedIndustry}
					setSelectedIndustry={setSelectedIndustry}
					selectedTechnology={selectedTechnology}
					setSelectedTechnology={setSelectedTechnology}
					selectedSolution={selectedSolution}
					setSelectedSolution={setSelectedSolution}
					selectedSolutionVariant={selectedSolutionVariant}
					setSelectedSolutionVariant={setSelectedSolutionVariant}
					onSolutionInfoChange={setSelectedSolutionInfo}
					disableIndustry={isSecondCalculator}
					disableTechnology={isSecondCalculator}
					inheritedIndustry={inheritedIndustry}
					inheritedTechnology={inheritedTechnology}
				/>

				{/* Configuration Section */}
				{areHeaderSelectorsComplete() ? (
					<ConfigurationCard
						ref={configCardRef}
						configFields={configFields}
						onConfigFieldChange={handleConfigFieldChange}
						onCalculationResult={handleCalculationResult}
						isCalculateDisabled={isCalculateDisabled}
						isLoading={isLoadingConfig}
						advancedConfig={advancedConfig}
						onAdvancedConfigChange={setAdvancedConfig}
						selectedSolutionInfo={selectedSolutionInfo}
						selectedSolutionVariant={selectedSolutionVariant}
						hideCompareButton={hideCompareButton}
					/>
				) : null}
				{/* Results Section */}
				{!hideResultsSection && (
					<ResultsSection
						results={results}
						showResults={showResults}
						calculationResult={calculationRawResult}
						advancedConfig={advancedConfig}
						inputParameters={getInputParameters()}
					/>
				)}
			</div>
		</div>
	);
});

export default ValueCalculatorMain;
