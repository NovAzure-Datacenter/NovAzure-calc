"use client";

import { useState, useEffect } from "react";
import { HeaderSelectors } from "./header-selectors";
import { ConfigurationCard } from "./configuration-card";
import { ResultsSection } from "./results-section";
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

export function ValueCalculatorMain() {
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedTechnology, setSelectedTechnology] = useState("");
    const [selectedSolution, setSelectedSolution] = useState("");
    const [selectedSolutionInfo, setSelectedSolutionInfo] = useState<{name: string, description?: string} | null>(null);
    const [selectedSolutionVariant, setSelectedSolutionVariant] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    
    // Dynamic configuration fields based on selected solution variant
    const [configFields, setConfigFields] = useState<ConfigField[]>([]);

    const [globalFields1, setGlobalFields1] = useState<ConfigField[]>([]);

    const [globalFields2, setGlobalFields2] = useState<ConfigField[]>([]);

    // Advanced configuration state
    const [advancedConfig, setAdvancedConfig] = useState<AdvancedConfig>({
        // Data Centre Configuration - Advanced
        inletTemperature: 0,
        electricityPrice: 0,
        waterPrice: 0,
        waterloop: '',
        requiredElectricalPowerIncrease: 0,
        
        // Air Cooling Configuration - Advanced
        coolingAlternative: '',
        defaultAirCoolingTechnology: '',
        airChassisPerRack: 0,
        airCoolingCapexCost: 0,
        annualAirCoolingMaintenance: 0,
        airWUE: 0,
        
        // PLC Configuration - Advanced
        chassisTechnology: '',
        plcRackCoolingCapacity: 0,
        annualPLCMaintenance: 0,
        includePoCCost: '',
        totalPoCCost: 0,
        plcChassisPerRack: 0,
        
        // IT Configuration - Advanced
        serverRatedMaxPower: 0,
        maxChassisPerRackAir: 0,
        totalAirPowerPerRack: 0,
        includeITCost: '',
        typicalITCostPerServer: 0,
        typicalITCostPerServerAlt: 0,
        annualITMaintenanceCost: 0,
        serverRefreshYears: 0,
        
        // Space Configuration
        floorSpacePerAirRack: 0,
        floorSpacePerPLCRack: 0,
        spaceUnit: '',
    });

    // Fetch solution variant configuration when solution is selected
    useEffect(() => {
        if (selectedSolutionInfo?.name) {
            setIsLoadingConfig(true);
            fetchSolutionVariantConfig(selectedSolutionVariant, selectedSolutionInfo.name)
                .then((config: ProductConfigResponse) => {
                    // Convert API ConfigField types to local ConfigField types
                    const convertConfigFields = (apiFields: ConfigFieldAPI[]): ConfigField[] => {
                        return apiFields.map(field => ({
                            id: field.id,
                            label: field.label,
                            type: (field.type === "number" || field.type === "text" || field.type === "select") 
                                ? field.type 
                                : "text", // Default to text for unsupported types
                            value: field.value || "",
                            unit: field.unit,
                            options: field.options,
                            required: field.required || false
                        }));
                    };

                    setConfigFields(convertConfigFields(config.config_fields || []));
                    setGlobalFields1([]);
                    setGlobalFields2([]);
                })
                .catch((error) => {
                    console.error('Error fetching solution variant configuration:', error);
                    // Reset to default/empty fields on error
                    setConfigFields([]);
                    setGlobalFields1([]);
                    setGlobalFields2([]);
                })
                .finally(() => {
                    setIsLoadingConfig(false);
                });
        } else {
            // Clear configuration fields when no solution or variant is selected
            setConfigFields([]);
            setGlobalFields1([]);
            setGlobalFields2([]);
        }
    }, [selectedSolutionInfo, selectedSolutionVariant]);

    // Sample calculation results
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

    const handleGlobalField1Change = (id: string, value: string | number) => {
        updateFieldValue(globalFields1, setGlobalFields1, id, value);
    };

    const handleGlobalField2Change = (id: string, value: string | number) => {
        updateFieldValue(globalFields2, setGlobalFields2, id, value);
    };

    const calculateResults = () => {
        // Real calculation logic using actual field values
        const getFieldValue = (fields: ConfigField[], fieldId: string): number => {
            const field = fields.find(f => f.id === fieldId);
            return field ? parseFloat(field.value?.toString() || '0') : 0;
        };

        // Get key values from configuration fields
        const powerConsumption = getFieldValue(configFields, 'power_consumption') || 
                               getFieldValue(configFields, 'Power (kW)') || 
                               getFieldValue(configFields, '68512dce0500c3991f6c4bd0') || 100; // Default fallback

        // Check for chassis immersion specific fields
        const isChassisImmersion = configFields.some(field => field.id === 'annualised_liquid_cooled_ppue');
        const pueValue = isChassisImmersion 
          ? getFieldValue(configFields, 'annualised_liquid_cooled_ppue') || 1.05
          : 1.2; // Default PUE for air cooling

        const advancedField = configFields.find(f => f.id === 'advanced');
        const isAdvanced = advancedField?.value === 'Yes' || advancedField?.value === 'true';
        
        const advancedGridField = configFields.find(f => f.id === 'advanced_grid');
        const advancedGrid = advancedGridField?.value === 'TRUE' || advancedGridField?.value === 'true';

        const electricityCost = getFieldValue(globalFields1, 'electricity_cost') || 0.12; // $/kWh
        const carbonFactor = getFieldValue(globalFields1, 'carbon_factor') || 0.4; // kg CO2/kWh
        const projectLifetime = getFieldValue(globalFields1, 'project_lifetime') || 10; // years
        const maintenanceCost = getFieldValue(globalFields2, 'maintenance_cost') || 5000; // $/year

        // Real calculations based on your data
        const annualEnergyConsumption = powerConsumption * 8760; // kWh/year (24/7 operation)
        
        // Apply PUE factor for total energy consumption
        const totalEnergyConsumption = annualEnergyConsumption * pueValue;
        const annualEnergyCost = totalEnergyConsumption * electricityCost;
        
        // Chassis immersion typically provides better efficiency than air cooling
        const baseEfficiencyImprovement = isChassisImmersion ? 35 : 25; // Higher efficiency for immersion
        const advancedBonus = isAdvanced ? 5 : 0; // Additional efficiency if advanced features enabled
        const efficiencyImprovement = baseEfficiencyImprovement + advancedBonus;
        
        const annualSavings = annualEnergyCost * (efficiencyImprovement / 100);
        const totalSavings = (annualSavings - maintenanceCost) * projectLifetime; // Factor in maintenance costs
        
        // ROI calculation (chassis immersion typically has higher upfront cost but better long-term savings)
        const costMultiplier = isChassisImmersion ? 3.5 : 2.5; // Higher initial cost for immersion
        const solutionCost = annualSavings * costMultiplier;
        const roi = (totalSavings / solutionCost) * 100;
        const paybackPeriod = solutionCost / (annualSavings - maintenanceCost);
        
        // Carbon reduction (better with chassis immersion due to lower PUE)
        const carbonReduction = (totalEnergyConsumption * carbonFactor * efficiencyImprovement / 100) * projectLifetime;

        const realResults: CalculationResults = {
            costSavings: Math.round(totalSavings),
            energyEfficiency: efficiencyImprovement,
            roi: Math.round(roi),
            paybackPeriod: Math.round(paybackPeriod * 10) / 10, // Round to 1 decimal
            carbonReduction: Math.round(carbonReduction),
        };
        
        console.log('Calculation inputs:', {
            powerConsumption,
            pueValue,
            isChassisImmersion,
            isAdvanced,
            advancedGrid,
            electricityCost,
            carbonFactor,
            projectLifetime,
            selectedSolutionVariant,
            configFields,
            globalFields1,
            globalFields2
        });
        console.log('Calculation results:', realResults);
        
        setResults(realResults);
        setShowResults(true);
    };

    // Helper function to check if all required fields are filled
    const areRequiredFieldsValid = () => {
        const allFields = [...configFields, ...globalFields1, ...globalFields2];
        return allFields.every(field => {
            if (!field.required) return true; // Skip validation for optional fields
            
            // Check if field has a value
            if (field.type === 'select') {
                return field.value && field.value !== '' && field.value !== 'Select an Option';
            } else {
                return field.value !== '' && field.value !== null && field.value !== undefined;
            }
        });
    };

    const isCalculateDisabled = !selectedIndustry || !selectedTechnology || !selectedSolution || isLoadingConfig || !areRequiredFieldsValid();

    return (
        <div className="w-full">
            <div className="space-y-6 max-w-7xl mx-auto">

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
                    globalFields1={globalFields1}
                    globalFields2={globalFields2}
                    onConfigFieldChange={handleConfigFieldChange}
                    onGlobalField1Change={handleGlobalField1Change}
                    onGlobalField2Change={handleGlobalField2Change}
                    onCalculate={calculateResults}
                    isCalculateDisabled={isCalculateDisabled}
                    isLoading={isLoadingConfig}
                    advancedConfig={advancedConfig}
                    onAdvancedConfigChange={setAdvancedConfig}
                    selectedSolutionInfo={selectedSolutionInfo}
                    selectedSolutionVariant={selectedSolutionVariant}
                />

                {/* Results Section */}
                <ResultsSection results={results} showResults={showResults} />
            </div>
        </div>
    );
}
