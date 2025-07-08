"use client";

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
}

interface ConfigurationSectionProps {
    title: string;
    fields: ConfigField[];
    onFieldChange: (id: string, value: string | number) => void;
}

export function ConfigurationSection({ title, fields, onFieldChange }: ConfigurationSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="text-sm font-medium">
                            {field.label}
                        </Label>
                        <div className="relative">
                            {field.type === "select" ? (
                                <Select 
                                    value={field.value as string} 
                                    onValueChange={(value) => onFieldChange(field.id, value)}
                                >
                                    <SelectTrigger>
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
                            ) : (
                                <>
                                    <Input
                                        id={field.id}
                                        type={field.type}
                                        value={field.value}
                                        onChange={(e) => onFieldChange(field.id, e.target.value)}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        className="pr-12"
                                    />
                                    {field.unit && (
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                                            {field.unit}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
