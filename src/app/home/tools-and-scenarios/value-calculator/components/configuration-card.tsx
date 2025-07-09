"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ConfigField , AdvancedConfig} from "../types/types";
import { ConfigurationSection } from "./configuration-section";



interface ConfigurationCardProps {
    configFields: ConfigField[];
    globalFields1: ConfigField[];
    globalFields2: ConfigField[];
    onConfigFieldChange: (id: string, value: string | number) => void;
    onGlobalField1Change: (id: string, value: string | number) => void;
    onGlobalField2Change: (id: string, value: string | number) => void;
    onCalculate: () => void;
    isCalculateDisabled: boolean;
    isLoading?: boolean;
    advancedConfig?: AdvancedConfig;
    onAdvancedConfigChange?: (config: AdvancedConfig) => void;
    selectedSolutionInfo?: {name: string, description?: string} | null;
    selectedSolutionVariant?: string;
}

export function ConfigurationCard({
    configFields,
    globalFields1,
    globalFields2,
    onConfigFieldChange,
    onGlobalField1Change,
    onGlobalField2Change,
    onCalculate,
    isCalculateDisabled,
    isLoading = false,
    advancedConfig,
    onAdvancedConfigChange,
    selectedSolutionInfo,
}: ConfigurationCardProps) {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [includeITCost, setIncludeITCost] = useState(false);

    // Function to determine if the solution is air cooling
    const isAirCoolingSolution = (solutionInfo: {name: string} | null): boolean => {
        if (!solutionInfo) return false;
        return solutionInfo.name === "Air Cooling";
    };

    // Function to determine if the solution is liquid cooling 
    const isLiquidCoolingSolution = (solutionInfo: {name: string} | null): boolean => {
        if (!solutionInfo) return false;
        return solutionInfo.name === "Liquid Cooling";
    };

    const handleAdvancedChange = (field: keyof AdvancedConfig, value: string | number) => {
        if (advancedConfig && onAdvancedConfigChange) {
            onAdvancedConfigChange({
                ...advancedConfig,
                [field]: value,
            });
        }
    };
    // Separate data center fields from cooling configuration fields
    const dataCenterFieldIds = [
        'data_centre_type',
        'project_location',
        'utilisation_percentage',
        'data_hall_capacity',
        'planned_years_operation',
        'first_year_operation'
    ];
    
    // Air Cooling Configuration fields
    const airCoolingFieldIds = [
        'air_annualized_ppue',
        'default_air_ppue'
    ];
    
    // chassis Configuration fields (for immersion cooling)
    const chassisConfigFieldIds = [
        'annualised_liquid_cooled_ppue'
    ];
    
    const dataCenterFields = configFields.filter(field => 
        dataCenterFieldIds.includes(field.id)
    );
    
    const airCoolingFields = configFields.filter(field => 
        airCoolingFieldIds.includes(field.id)
    );
    
    const chassisConfigFields = configFields.filter(field => 
        chassisConfigFieldIds.includes(field.id)
    );
    
    const otherConfigFields = configFields.filter(field => 
        !dataCenterFieldIds.includes(field.id) && 
        !airCoolingFieldIds.includes(field.id) &&
        !chassisConfigFieldIds.includes(field.id)
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">High Level Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-gray-500">Loading configuration...</div>
                    </div>
                ) : (
                    <>
                        {/* Data Center Configuration */}
                        {dataCenterFields.length > 0 && (
                            <>
                                <ConfigurationSection 
                                    title="Data Center Configuration" 
                                    fields={dataCenterFields} 
                                    onFieldChange={onConfigFieldChange}
                                />
                                <Separator />
                            </>
                        )}

                        {/* Air Cooling Configuration */}
                        {airCoolingFields.length > 0 && (
                            <>
                                <ConfigurationSection 
                                    title="Air Cooling Configuration" 
                                    fields={airCoolingFields} 
                                    onFieldChange={onConfigFieldChange}
                                />
                                <Separator />
                            </>
                        )}

                        {/* chassis Configuration */}
                        {chassisConfigFields.length > 0 && (
                            <>
                                <ConfigurationSection 
                                    title="Chassis Immersion Configuration" 
                                    fields={chassisConfigFields} 
                                    onFieldChange={onConfigFieldChange}
                                />
                                <Separator />
                            </>
                        )}

                        {/* Other System Configuration */}
                        {otherConfigFields.length > 0 && (
                            <>
                                <ConfigurationSection 
                                    title="System Configuration" 
                                    fields={otherConfigFields} 
                                    onFieldChange={onConfigFieldChange}
                                />
                                <Separator />
                            </>
                        )}
                        
                        {/* Global fields in two columns - Only show if there are fields */}
                        {(globalFields1.length > 0 || globalFields2.length > 0) && (
                            <>
                                <Separator />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {globalFields1.length > 0 && (
                                        <ConfigurationSection 
                                            title="Global Fields #1" 
                                            fields={globalFields1} 
                                            onFieldChange={onGlobalField1Change}
                                        />
                                    )}
                                    {globalFields2.length > 0 && (
                                        <ConfigurationSection 
                                            title="Global Fields #2" 
                                            fields={globalFields2} 
                                            onFieldChange={onGlobalField2Change}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                        
                        {/* Advanced Section - Only show if solution is selected */}
                        {selectedSolutionInfo && (
                            <div className="space-y-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                    className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Advanced
                                    {isAdvancedOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                                
                                {isAdvancedOpen && (
                                <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                                    <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                        <strong>Advanced Configuration:</strong> All fields in this section are optional and provide additional customization for more precise calculations.
                                    </div>
                                    <div className="space-y-8">
                                        {/* Data Centre Configuration - Advanced */}
                                        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                                                <h4 className="font-semibold text-base text-gray-800">Data Centre Configuration - Advanced</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Inlet Temperature</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter temperature"
                                                        value={advancedConfig?.inletTemperature || ''}
                                                        onChange={(e) => handleAdvancedChange('inletTemperature', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Electricity Price ($/kWh)</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.01"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter price"
                                                        value={advancedConfig?.electricityPrice || ''}
                                                        onChange={(e) => handleAdvancedChange('electricityPrice', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Water Price ($/L)</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.01"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter price"
                                                        value={advancedConfig?.waterPrice || ''}
                                                        onChange={(e) => handleAdvancedChange('waterPrice', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Waterloop?</label>
                                                    <select 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        value={advancedConfig?.waterloop || ''}
                                                        onChange={(e) => handleAdvancedChange('waterloop', e.target.value)}
                                                    >
                                                        <option value="">Select option</option>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2 space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Increase of Electrical Plant Power</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter power increase"
                                                        value={advancedConfig?.requiredElectricalPowerIncrease || ''}
                                                        onChange={(e) => handleAdvancedChange('requiredElectricalPowerIncrease', Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Air Cooling Configuration - Advanced - Only show if air cooling solution is selected */}
                                        {isAirCoolingSolution(selectedSolutionInfo || null) && (
                                            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                                <div className="flex items-center mb-4">
                                                    <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
                                                    <h4 className="font-semibold text-base text-gray-800">Air Cooling Configuration - Advanced</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cooling Alternative to be Compared with Chassis</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                                            placeholder="Enter cooling alternative"
                                                            value={advancedConfig?.coolingAlternative || ''}
                                                            onChange={(e) => handleAdvancedChange('coolingAlternative', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Air Cooling Technology in UK</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                                            placeholder="Enter technology"
                                                            value={advancedConfig?.defaultAirCoolingTechnology || ''}
                                                            onChange={(e) => handleAdvancedChange('defaultAirCoolingTechnology', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Air Chassis per Rack</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                                            placeholder="Enter number"
                                                            value={advancedConfig?.airChassisPerRack || ''}
                                                            onChange={(e) => handleAdvancedChange('airChassisPerRack', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Air Cooling Capex Cost per Rack (Including GC Works)</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                                            placeholder="Enter cost"
                                                            value={advancedConfig?.airCoolingCapexCost || ''}
                                                            onChange={(e) => handleAdvancedChange('airCoolingCapexCost', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Annual Air Cooling Maintenance (excl. IT maintenance, assumed as % of capex)</label>
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                                            placeholder="Enter percentage"
                                                            value={advancedConfig?.annualAirCoolingMaintenance || ''}
                                                            onChange={(e) => handleAdvancedChange('annualAirCoolingMaintenance', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Air WUE</label>
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                                            placeholder="Enter WUE"
                                                            value={advancedConfig?.airWUE || ''}
                                                            onChange={(e) => handleAdvancedChange('airWUE', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* PLC Configuration - Advanced - Only show if liquid cooling solution is selected */}
                                        {isLiquidCoolingSolution(selectedSolutionInfo || null) && (
                                            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                                <div className="flex items-center mb-4">
                                                    <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                                                    <h4 className="font-semibold text-base text-gray-800">PLC Configuration - Advanced</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Immersion Technology</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                            placeholder="Enter technology"
                                                            value={advancedConfig?.chassisTechnology || ''}
                                                            onChange={(e) => handleAdvancedChange('chassisTechnology', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">PLC Rack Cooling Capacity (kW/rack)</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                            placeholder="Enter capacity"
                                                            value={advancedConfig?.plcRackCoolingCapacity || ''}
                                                            onChange={(e) => handleAdvancedChange('plcRackCoolingCapacity', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Annual PLC Maintenance (excl. IT Maintenance, assumed as % of Capex)</label>
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                            placeholder="Enter percentage"
                                                            value={advancedConfig?.annualPLCMaintenance || ''}
                                                            onChange={(e) => handleAdvancedChange('annualPLCMaintenance', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Include PoC Cost</label>
                                                        <select 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                            value={advancedConfig?.includePoCCost || ''}
                                                            onChange={(e) => handleAdvancedChange('includePoCCost', e.target.value)}
                                                        >
                                                            <option value="">Select option</option>
                                                            <option value="yes">Yes</option>
                                                            <option value="no">No</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Total PoC Cost in USD</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                            placeholder="Enter cost"
                                                            value={advancedConfig?.totalPoCCost || ''}
                                                            onChange={(e) => handleAdvancedChange('totalPoCCost', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of PLC chassis per rack</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                            placeholder="Enter number"
                                                            value={advancedConfig?.plcChassisPerRack || ''}
                                                            onChange={(e) => handleAdvancedChange('plcChassisPerRack', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Space Configuration */}
                                        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <div className="w-1 h-6 bg-teal-500 rounded-full mr-3"></div>
                                                <h4 className="font-semibold text-base text-gray-800">Space Configuration</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Space Required Per Air Cooled Rack (sq m)</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.01"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                                        placeholder="Enter space"
                                                        value={advancedConfig?.floorSpacePerAirRack || ''}
                                                        onChange={(e) => handleAdvancedChange('floorSpacePerAirRack', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Space Per PLC Rack (sq m)</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.01"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                                        placeholder="Enter space"
                                                        value={advancedConfig?.floorSpacePerPLCRack || ''}
                                                        onChange={(e) => handleAdvancedChange('floorSpacePerPLCRack', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                                                    <select 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                                        value={advancedConfig?.spaceUnit || ''}
                                                        onChange={(e) => handleAdvancedChange('spaceUnit', e.target.value)}
                                                    >
                                                        <option value="">Select unit</option>
                                                        <option value="sq_m">Square meters</option>
                                                        <option value="sq_ft">Square feet</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
<div className="flex items-center space-x-2 mt-2">
  <input
    type="checkbox"
    id="include-it-cost"
    checked={includeITCost}
    onChange={e => setIncludeITCost(e.target.checked)}
    className="accent-blue-600 w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
  />
  <label htmlFor="include-it-cost" className="text-sm text-gray-700 select-none">
    Include IT Cost in calculations
  </label>
</div>

                                        {/* IT Configuration - Advanced */}
                                        {includeITCost && <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
                                                <h4 className="font-semibold text-base text-gray-800">IT Configuration - Advanced</h4>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Server Rated Max Power</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                        placeholder="Enter power"
                                                        value={advancedConfig?.serverRatedMaxPower || ''}
                                                        onChange={(e) => handleAdvancedChange('serverRatedMaxPower', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Number of Chassis per Rack for Air</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                        placeholder="Enter number"
                                                        value={advancedConfig?.maxChassisPerRackAir || ''}
                                                        onChange={(e) => handleAdvancedChange('maxChassisPerRackAir', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Air Power Per Rack (kW/rack)</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                        placeholder="Enter power"
                                                        value={advancedConfig?.totalAirPowerPerRack || ''}
                                                        onChange={(e) => handleAdvancedChange('totalAirPowerPerRack', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Include IT Cost</label>
                                                    <select 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                        value={advancedConfig?.includeITCost || ''}
                                                        onChange={(e) => handleAdvancedChange('includeITCost', e.target.value)}
                                                    >
                                                        <option value="">Select option</option>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Typical IT Cost per Server (Incl. Server, Memory and Network Cost)</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                        placeholder="Enter cost"
                                                        value={advancedConfig?.typicalITCostPerServer || ''}
                                                        onChange={(e) => handleAdvancedChange('typicalITCostPerServer', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Typical IT Cost per Server</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                        placeholder="Enter cost"
                                                        value={advancedConfig?.typicalITCostPerServerAlt || ''}
                                                        onChange={(e) => handleAdvancedChange('typicalITCostPerServerAlt', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual IT Maintenance Cost</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                        placeholder="Enter cost"
                                                        value={advancedConfig?.annualITMaintenanceCost || ''}
                                                        onChange={(e) => handleAdvancedChange('annualITMaintenanceCost', Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Server Refresh in Years</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                                        placeholder="Enter years"
                                                        value={advancedConfig?.serverRefreshYears || ''}
                                                        onChange={(e) => handleAdvancedChange('serverRefreshYears', Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            )}
                            </div>
                        )}
                        
                        {/* Required Fields Note */}
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                            <span className="text-red-500">*</span> Required fields must be completed before calculation.
                            Advanced fields are optional.
                        </div>
                        
                        <div className="flex justify-center pt-4">
                            <Button 
                                onClick={onCalculate}
                                className="px-8 py-2 bg-blue-600 hover:bg-blue-700"
                                disabled={isCalculateDisabled}
                            >
                                Compare
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
