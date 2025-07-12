"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VALIDATION_RULES } from "@/lib/constants/calculator-config";

export interface ConfigField {
    id: string;
    label: string;
    type: "number" | "text" | "select";
    value: string | number;
    options?: string[];
    unit?: string;
    required?: boolean;
    step?: string;
    placeholder?: string;
}

interface ConfigurationSectionProps {
    title: string;
    fields: ConfigField[];
    onFieldChange: (id: string, value: string | number) => void;
}

export function ConfigurationSection({ title, fields, onFieldChange }: ConfigurationSectionProps) {
    // Track local error state for validation
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Validation handler
    const validateField = (fieldId: string, value: string | number) => {
        const rule = VALIDATION_RULES[fieldId as keyof typeof VALIDATION_RULES];
        if (!rule) return "";

        const num = Number(value);
        if (isNaN(num)) return rule.message;
        if (num < rule.min) return `${fieldId.replace(/_/g, ' ')} must be at least ${rule.min}`;
        if (num > rule.max) return `${fieldId.replace(/_/g, ' ')} must be at most ${rule.max}`;
        return "";
    };

    // Custom handler for field changes with validation
    const handleFieldChange = (id: string, value: string | number) => {
        const error = validateField(id, value);
        setFieldErrors(prev => ({
            ...prev,
            [id]: error
        }));
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
                        {field.type === "number" ? (
                            <Input
                                id={field.id}
                                type="number"
                                value={field.value as string}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                className={field.required && !field.value ? "border-red-200" : ""}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                step={field.step || "any"}
                                min={field.id === 'data_hall_capacity' ? 0.1 : undefined}
                                max={field.id === 'data_hall_capacity' ? 100 : undefined}
                            />
                        ) : field.type === "text" ? (
                            <Input
                                id={field.id}
                                type="text"
                                value={field.value as string}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                className={field.required && !field.value ? "border-red-200" : ""}
                                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            />
                        ) : (
                            <Select
                                value={field.value as string}
                                onValueChange={(value) => handleFieldChange(field.id, value)}
                                required={field.required}
                            >
                                <SelectTrigger className={field.required && !field.value ? "border-red-200" : ""}>
                                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {field.unit && (
                            <span className="text-sm text-gray-500">{field.unit}</span>
                        )}
                        {fieldErrors[field.id] && (
                            <p className="text-sm text-red-500">{fieldErrors[field.id]}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}