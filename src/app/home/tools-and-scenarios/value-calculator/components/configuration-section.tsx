"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ConfigField {
    id: string;
    label: string;
    type: "number" | "text" | "select";
    value: string | number;
    options?: string[];
    unit?: string;
    required?: boolean;
}

interface ConfigurationSectionProps {
    title: string;
    fields: ConfigField[];
    onFieldChange: (id: string, value: string | number) => void;
}

export function ConfigurationSection({ title, fields, onFieldChange }: ConfigurationSectionProps) {
    // Provide default options for dropdowns if not present
    const getOptions = (field: ConfigField) => {
        if (field.options && field.options.length > 0) return field.options;
        // Example defaults, adjust as needed for your app
        switch (field.id) {
            case "data_centre_type":
                return ["Greenfield", "HPC/AI"];
            case "project_location":
                return ["United Kingdom", "United States", "Singapore", "United Arab Emirates"];
            case "utilisation_percentage":
                return ["20","30","40","50", "60", "70", "80", "90", "100"];
            case "planned_years_operation":
                return ["5", "10", "15", "20", "25"];
            case "first_year_operation":
                return ["2025", "2026", "2027", "2028", "2029", "2030"];
            default:
                return ["Option 1", "Option 2", "Option 3"];
        }
    };

    // Track local error state for data_hall_capacity
    const [capacityError, setCapacityError] = useState<string>("");

    // Custom handler for data_hall_capacity validation
    const handleCapacityChange = (id: string, value: string | number) => {
        const num = Number(value);
        if (num < 1) {
            setCapacityError("Minimum capacity is 1 MW.");
        } else if (num > 10) {
            setCapacityError("Maximum capacity is 10 MW.");
        } else {
            setCapacityError("");
        }
        onFieldChange(id, value);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <div className="relative">
                            {field.id === "air_annualized_ppue" || field.id === "annualised_liquid_cooled_ppue" ? (
                                <Input
                                    id={field.id}
                                    type="number"
                                    value={field.value}
                                    min={0}
                                    step={0.01}
                                    onChange={(e) => onFieldChange(field.id, e.target.value)}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                    className={`pr-12 ${field.required && !field.value ? "border-red-200" : ""}`}
                                    required={field.required}
                                />
                            ) : field.id === "data_hall_capacity" ? (
                                <>
                                <Input
                                    id={field.id}
                                    type="number"
                                    min={1}
                                    step={0.1}
                                    value={field.value}
                                    max={10}
                                    onChange={(e) => handleCapacityChange(field.id, e.target.value)}
                                    placeholder="Enter data hall capacity (MW)"
                                    className={`pr-12 ${field.required && !field.value ? "border-red-200" : ""}`}
                                    required={field.required}
                                />
                                {capacityError && (
                                    <div className="text-xs text-red-500 mt-1">{capacityError}</div>
                                )}
                                </>
                            ) : (
                                <Select
                                    value={field.value as string}
                                    onValueChange={(value) => onFieldChange(field.id, value)}
                                    required={field.required}
                                >
                                    <SelectTrigger className={field.required && !field.value ? "border-red-200" : ""}>
                                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getOptions(field).map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}