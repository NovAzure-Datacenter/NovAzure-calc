import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface AdvancedConfigItem {
	id: string;
	name: string;
	type: "text" | "dropdown" | "checkbox";
	unit?: string;
	placeholder?: string;
	options?: string[];
}

export default function AdvancedLevelConfigCard({
    comparisonMode,
    solutionVariantA,
    solutionVariantB,
    clientSolutions,
    fetchedSolutionA,
    fetchedSolutionB,
    parameterValues,
    handleParameterValueChange,
    advancedConfigA,
    advancedConfigB,
    handleAdvancedConfigAChange,
    handleAdvancedConfigBChange,
    getAdvancedConfig,
    getAdvancedConfigForSolution,
    isAdvancedExpanded,
    setIsAdvancedExpanded,
}: {
    comparisonMode: "single" | "compare" | null;
    solutionVariantA: string;
    solutionVariantB: string;
    clientSolutions: any;
    fetchedSolutionA: any | null;
    fetchedSolutionB: any | null;
    parameterValues: any;
    handleParameterValueChange: (parameterId: string, value: any) => void;
    advancedConfigA: any;
    advancedConfigB: any;
    handleAdvancedConfigAChange: (parameterId: string, value: any) => void;
    handleAdvancedConfigBChange: (parameterId: string, value: any) => void;
    getAdvancedConfig: (solutionVariant: string) => AdvancedConfigItem[];
    getAdvancedConfigForSolution: (solutionVariant: string) => AdvancedConfigItem[];
    isAdvancedExpanded: boolean;
    setIsAdvancedExpanded: (isAdvancedExpanded: boolean) => void;
}) {
    // Helper function to format range values as percentages
    const formatRangeValue = (value: string, unit: string) => {
        if (unit === "%") {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                return Math.round(numValue * 100).toString();
            }
        }
        return value;
    };

    // Helper function to convert percentage input back to decimal for storage
    const convertPercentageToDecimal = (value: string, unit: string) => {
        if (unit === "%") {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                // Round to 4 decimal places to avoid floating point precision issues
                return (numValue / 100).toFixed(4);
            }
        }
        return value;
    };

    // Helper function to convert decimal to percentage for display
    const convertDecimalToPercentage = (value: string, unit: string) => {
        if (unit === "%") {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                // Round to avoid floating point precision issues
                return Math.round(numValue * 100).toString();
            }
        }
        return value;
    };

    // Helper function to get advanced config parameters from a solution
    const getSolutionAdvancedConfig = (solution: any) => {
        if (!solution?.parameters) return [];
        return solution.parameters.filter(
            (param: any) =>
                param.provided_by === "user" &&
                param.category?.name === "Advanced Level Configuration"
        );
    };

    // Get advanced config parameters for both solutions
    const solutionAAdvancedConfig = getSolutionAdvancedConfig(fetchedSolutionA);
    const solutionBAdvancedConfig = getSolutionAdvancedConfig(fetchedSolutionB);

    // Determine if card should be expanded by default
    const hasContent = solutionAAdvancedConfig.length > 0 || solutionBAdvancedConfig.length > 0;

    // Set expansion state based on content
    useEffect(() => {
        if (hasContent && !isAdvancedExpanded) {
            setIsAdvancedExpanded(true);
        }
    }, [hasContent, isAdvancedExpanded]);

    // Find shared parameters (parameters with the same name)
    const getSharedAdvancedConfig = () => {
        if (comparisonMode !== "compare" || !fetchedSolutionB) return [];
        
        const sharedParams: any[] = [];
        solutionAAdvancedConfig.forEach((paramA: any) => {
            const matchingParam = solutionBAdvancedConfig.find(
                (paramB: any) => paramB.name === paramA.name
            );
            if (matchingParam) {
                sharedParams.push(paramA);
            }
        });
        return sharedParams;
    };

    // Find unique parameters for each solution
    const getUniqueAdvancedConfig = (solutionParams: any[], otherSolutionParams: any[]) => {
        return solutionParams.filter((param: any) => {
            return !otherSolutionParams.some(
                (otherParam: any) => otherParam.name === param.name
            );
        });
    };

    const sharedAdvancedConfig = getSharedAdvancedConfig();
    const uniqueAdvancedConfigA = getUniqueAdvancedConfig(solutionAAdvancedConfig, solutionBAdvancedConfig);
    const uniqueAdvancedConfigB = getUniqueAdvancedConfig(solutionBAdvancedConfig, solutionAAdvancedConfig);

    // Render advanced config input based on type
    const renderAdvancedConfigInput = (config: any, prefix: string = "") => {
        const configId = prefix ? `${prefix}_${config.id}` : config.id;
        const configValue = prefix === "A" ? advancedConfigA[config.id] : 
                           prefix === "B" ? advancedConfigB[config.id] : 
                           advancedConfigA[config.id];
        const handleChange = prefix === "A" ? handleAdvancedConfigAChange :
                           prefix === "B" ? handleAdvancedConfigBChange :
                           handleAdvancedConfigAChange;
        
        return (
            <div key={config.id} className="space-y-3">
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">
                        {config.name}
                    </Label>
                    {config.information && (
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-xs text-gray-500">Info</span>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    {config.display_type === "dropdown" ? (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                Select {config.name}:
                            </Label>
                            <Select
                                value={(configValue as string) || ""}
                                onValueChange={(value) =>
                                    handleChange(config.id, value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={`Select an option for ${config.name}`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {config.dropdown_options &&
                                        config.dropdown_options.map(
                                            (option: any, index: number) => (
                                                <SelectItem
                                                    key={index}
                                                    value={option.key}
                                                >
                                                    {option.key}
                                                </SelectItem>
                                            )
                                        )}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : config.display_type === "filter" ? (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                Select {config.name}:
                            </Label>
                            <Select
                                value={(configValue as string) || ""}
                                onValueChange={(value) =>
                                    handleChange(config.id, value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={`Select ${config.name}`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {config.dropdown_options &&
                                        config.dropdown_options.map(
                                            (option: any, index: number) => (
                                                <SelectItem
                                                    key={index}
                                                    value={option.value}
                                                >
                                                    {option.value}
                                                </SelectItem>
                                            )
                                        )}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : config.type === "checkbox" ? (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={configId}
                                checked={configValue || false}
                                onCheckedChange={(checked) =>
                                    handleChange(config.id, checked)
                                }
                            />
                            <Label htmlFor={configId} className="text-sm">
                                {config.name}
                            </Label>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                {config.description ||
                                    `Enter ${config.name}`}
                            </Label>
                            <Input
                                type="number"
                                placeholder={`Enter ${config.name}`}
                                value={
                                    config.unit === "%" 
                                        ? convertDecimalToPercentage((configValue as string) || "", config.unit)
                                        : (configValue as string) || ""
                                }
                                onChange={(e) => {
                                    const convertedValue = config.unit === "%" 
                                        ? convertPercentageToDecimal(e.target.value, config.unit)
                                        : e.target.value;
                                    handleChange(config.id, convertedValue);
                                }}
                                step="0.1"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

	return (
		<>
			{((comparisonMode === "single" &&
				solutionVariantA &&
				clientSolutions.length > 0) ||
				(comparisonMode === "compare" &&
					solutionVariantA &&
					solutionVariantB &&
					clientSolutions.length > 0)) && (
				<Card
					className="w-full cursor-pointer"
					onClick={(e) => {
						// Prevent card click when clicking on input elements
						const target = e.target as HTMLElement;
						if (target instanceof HTMLInputElement || 
							target instanceof HTMLSelectElement ||
							target.closest('button') ||
							target.closest('[role="combobox"]')) {
							return;
						}
						setIsAdvancedExpanded(!isAdvancedExpanded);
					}}
				>
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle className="text-lg">Advanced Configuration</CardTitle>
							{isAdvancedExpanded ? (
								<ChevronUp className="h-5 w-5" />
							) : (
								<ChevronDown className="h-5 w-5" />
							)}
						</div>
					</CardHeader>
					{isAdvancedExpanded && (
						<CardContent className="space-y-6">
							{comparisonMode === "single" ? (
                                // Single mode - show all advanced config from solution A
								<div className="space-y-4">
                                    {solutionAAdvancedConfig.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No advanced configuration to display</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {solutionAAdvancedConfig.map((config: AdvancedConfigItem) =>
                                                renderAdvancedConfigInput(config)
                                            )}
														</div>
													)}
												</div>
                            ) : (
                                // Compare mode - show shared and unique advanced config
                                <div className="space-y-8">
                                    {/* Shared Advanced Config Section */}
                                    {sharedAdvancedConfig.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
                                                Shared Advanced Configuration
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {sharedAdvancedConfig.map((sharedConfig: AdvancedConfigItem) =>
                                                    renderAdvancedConfigInput(sharedConfig)
										)}
									</div>
								</div>
                                    )}

                                    {/* Unique Advanced Config Section */}
                                    {(uniqueAdvancedConfigA.length > 0 || uniqueAdvancedConfigB.length > 0) && (
									<div className="space-y-4">
                                            <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
                                                Solution-Specific Advanced Configuration
										</h4>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Solution A Unique Advanced Config */}
                                                <div className="space-y-4">
                                                    <h5 className="text-sm font-medium text-blue-600 flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        Solution A Unique
                                                    </h5>
										<div className="space-y-4">
                                                        {uniqueAdvancedConfigA.length > 0 ? (
                                                            uniqueAdvancedConfigA.map((config: AdvancedConfigItem) =>
                                                                renderAdvancedConfigInput(config, "A")
                                                            )
                                                        ) : (
                                                            <div className="text-center py-8 text-muted-foreground">
                                                                <p className="text-sm">No unique advanced configuration</p>
															</div>
											)}
										</div>
									</div>

                                                {/* Solution B Unique Advanced Config */}
									<div className="space-y-4">
                                                    <h5 className="text-sm font-medium text-green-600 flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        Solution B Unique
                                                    </h5>
										<div className="space-y-4">
                                                        {uniqueAdvancedConfigB.length > 0 ? (
                                                            uniqueAdvancedConfigB.map((config: AdvancedConfigItem) =>
                                                                renderAdvancedConfigInput(config, "B")
                                                            )
                                                        ) : (
                                                            <div className="text-center py-8 text-muted-foreground">
                                                                <p className="text-sm">No unique advanced configuration</p>
															</div>
														)}
													</div>
										</div>
									</div>
                                        </div>
                                    )}

                                    {/* No advanced config message */}
                                    {solutionAAdvancedConfig.length === 0 && solutionBAdvancedConfig.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No advanced configuration to display</p>
                                        </div>
                                    )}
								</div>
							)}
						</CardContent>
					)}
				</Card>
			)}
		</>
	);
}
