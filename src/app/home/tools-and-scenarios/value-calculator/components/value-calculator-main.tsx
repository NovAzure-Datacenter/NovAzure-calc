"use client";

import { useState, useEffect } from "react";
import { HeaderSelectors } from "./header-selectors";
import { ConfigurationCard } from "./configuration-card";
import { ResultsSection } from "./results-section";
import ValueCalculatorCompareWrapper from "./value-calculator-compare-wrapper";
import type { ConfigField, ConfigFieldAPI, ProductConfigResponse, CalculationResults, AdvancedConfig } from "../types/types";

// API Function
async function fetchSolutionVariantConfig(solutionVariantId?: string, solutionName?: string): Promise<ProductConfigResponse> {
  try {
    let url = `/api/value-calculator/solution-variant-config?`;
    if (solutionVariantId) url += `solutionVariantId=${encodeURIComponent(solutionVariantId)}&`;
    if (solutionName) url += `solutionName=${encodeURIComponent(solutionName)}`;
    const response = await fetch(url);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch solution variant configuration');
    }

    return result.data as ProductConfigResponse;
  } catch (error) {
    console.error('Error fetching solution variant config:', error);
    throw error;
  }
}


export function ValueCalculatorMain({ hideCompareButton = false }: { hideCompareButton?: boolean } = {}) {
    // Single calculator state and logic must be inside the component
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedTechnology, setSelectedTechnology] = useState("");
    const [selectedSolution, setSelectedSolution] = useState("");
    const [selectedSolutionInfo, setSelectedSolutionInfo] = useState<{name: string, description?: string} | null>(null);
    const [selectedSolutionVariant, setSelectedSolutionVariant] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [isComparing, setIsComparing] = useState(false);
    const [configFields, setConfigFields] = useState<ConfigField[]>([]);
    const [advancedConfig, setAdvancedConfig] = useState<AdvancedConfig>({
        inletTemperature: 0,
        electricityPrice: 0,
        waterPrice: 0,
        waterloop: '',
        requiredElectricalPowerIncrease: 0,
        coolingAlternative: '',
        defaultAirCoolingTechnology: '',
        airChassisPerRack: 0,
        airCoolingCapexCost: 0,
        annualAirCoolingMaintenance: 0,
        airWUE: 0,
        chassisTechnology: '',
        plcRackCoolingCapacity: 0,
        annualPLCMaintenance: 0,
        includePoCCost: '',
        totalPoCCost: 0,
        plcChassisPerRack: 0,
        serverRatedMaxPower: 0,
        maxChassisPerRackAir: 0,
        totalAirPowerPerRack: 0,
        includeITCost: '',
        typicalITCostPerServer: 0,
        typicalITCostPerServerAlt: 0,
        annualITMaintenanceCost: 0,
        serverRefreshYears: 0,
        floorSpacePerAirRack: 0,
        floorSpacePerPLCRack: 0,
        spaceUnit: '',
    });
    const [calculationRawResult, setCalculationRawResult] = useState<any>(null);
    useEffect(() => { 
        if (selectedSolutionInfo?.name) {
            setIsLoadingConfig(true);
            fetchSolutionVariantConfig(selectedSolutionVariant, selectedSolutionInfo.name)
                .then((config: ProductConfigResponse) => {
                    const convertConfigFields = (apiFields: ConfigFieldAPI[]): ConfigField[] => {
                        return apiFields.map(field => {
                            // Override options for data_centre_type
                            if (field.id === "data_centre_type") {
                                return {
                                    ...field,
                                    type: (field.type === "number" || field.type === "text" || field.type === "select") ? field.type : "select",
                                    options: ["Greenfield", "HPC/AI"],
                                    value: field.value || "",
                                    required: field.required || false
                                };
                            }
                            return {
                                id: field.id,
                                label: field.label,
                                type: (field.type === "number" || field.type === "text" || field.type === "select") 
                                    ? field.type 
                                    : "text",
                                value: field.value || "",
                                unit: field.unit,
                                options: field.options,
                                required: field.required || false
                            };
                        });
                    };
                    // Add solution_type as a config field
                    const baseFields = convertConfigFields(config.config_fields || []);
                    // Only add if not already present
                    setConfigFields(baseFields);
                })
                .catch((error) => {
                    console.error('Error fetching solution variant configuration:', error);
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
    const updateFieldValue = (fields: ConfigField[], setFields: (fields: ConfigField[]) => void, id: string, value: string | number) => {
        setFields(fields.map(field => 
            field.id === id ? { ...field, value } : field
        ));
    };
    const handleConfigFieldChange = (id: string, value: string | number) => {
        updateFieldValue(configFields, setConfigFields, id, value);
    };
    const calculateResults = () => {
        // Only use configFields for calculations now
        const getFieldValue = (fields: ConfigField[], fieldId: string): number => {
            const field = fields.find(f => f.id === fieldId);
            return field ? parseFloat(field.value?.toString() || '0') : 0;
        };
        const powerConsumption = getFieldValue(configFields, 'power_consumption') || 
                               getFieldValue(configFields, 'Power (kW)') || 
                               getFieldValue(configFields, '68512dce0500c3991f6c4bd0') || 100;
        const isChassisImmersion = configFields.some(field => field.id === 'annualised_liquid_cooled_ppue');
        const pueValue = isChassisImmersion 
          ? getFieldValue(configFields, 'annualised_liquid_cooled_ppue') || 1.05
          : 1.2;
        const advancedField = configFields.find(f => f.id === 'advanced');
        const isAdvanced = advancedField?.value === 'Yes' || advancedField?.value === 'true';
        const advancedGridField = configFields.find(f => f.id === 'advanced_grid');
        const advancedGrid = advancedGridField?.value === 'TRUE' || advancedGridField?.value === 'true';
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
        const carbonReduction = (totalEnergyConsumption * carbonFactor * efficiencyImprovement / 100) * projectLifetime;
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
        // If result is a compare (has both solutions), map as usual
        if (result && result.air_cooling_solution && result.chassis_immersion_solution) {
            setCalculationRawResult({
                airCooling: result.air_cooling_solution,
                chassisImmersion: result.chassis_immersion_solution,
            });
        } else if (result && (result.cooling_equipment_capex !== undefined)) {
            // Single solution: decide which one based on config
            // Heuristic: if configFields has 'annualised_liquid_cooled_ppue', it's chassis immersion, else air cooling
            const isChassis = configFields.some(f => f.id === 'annualised_liquid_cooled_ppue');
            setCalculationRawResult({
                airCooling: isChassis ? undefined : result,
                chassisImmersion: isChassis ? result : undefined,
            });
        } else {
            setCalculationRawResult(undefined);
        }
        setShowResults(true);
    };
    const areRequiredFieldsValid = () => {
        return configFields.every(field => {
            if (!field.required) return true;
            if (field.type === 'select') {
                return field.value && field.value !== '' && field.value !== 'Select an Option';
            } else {
                return field.value !== '' && field.value !== null && field.value !== undefined;
            }
        });
    };
    const isCalculateDisabled = !selectedIndustry || !selectedTechnology || !selectedSolution || isLoadingConfig || !areRequiredFieldsValid();
    // Reset calculator state when exiting compare mode
    const handleExitCompare = () => {
        setIsComparing(false);
        setShowResults(false);
        // Optionally reset other state here if needed
    };
    return (
        <div className="w-full">
            <div className="space-y-6 max-w-7xl mx-auto">
                {!isComparing ? (
                    <>
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
                        />
                        {/* Configuration Section */}
                        <ConfigurationCard
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
                        {/* Results Section */}
                        <ResultsSection results={results} showResults={showResults} calculationResult={calculationRawResult} />
                        {/* Compare Button */}
                        {!hideCompareButton && (
                        <div className="flex justify-center pt-4">
                            <button
                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => setIsComparing(true)}
                            >
                                Compare Another Solution
                            </button>
                        </div>
                        )}
                    </>
                ) : (
                    <ValueCalculatorCompareWrapper onBack={handleExitCompare} />
                )}
            </div>
        </div>
    );
}
