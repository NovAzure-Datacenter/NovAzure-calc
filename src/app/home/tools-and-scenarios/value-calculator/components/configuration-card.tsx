"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfigurationSection, type ConfigField } from "./configuration-section";

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
}: ConfigurationCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">High Level Configuration</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Advanced Configuration
                </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-gray-500">Loading configuration...</div>
                    </div>
                ) : (
                    <>
                        {/* Main configuration fields */}
                        <ConfigurationSection 
                            title="System Configuration" 
                            fields={configFields} 
                            onFieldChange={onConfigFieldChange}
                        />
                        
                        <Separator />
                        
                        {/* Global fields in two columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ConfigurationSection 
                                title="Global Fields #1" 
                                fields={globalFields1} 
                                onFieldChange={onGlobalField1Change}
                            />
                            <ConfigurationSection 
                                title="Global Fields #2" 
                                fields={globalFields2} 
                                onFieldChange={onGlobalField2Change}
                            />
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
