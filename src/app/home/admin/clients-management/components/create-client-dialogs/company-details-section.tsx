"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface CompanyDetailsSectionProps {
	formData: {
		company_industry: string;
		company_size: string;
	};
	onInputChange: (field: string, value: string) => void;
}

const companySizeOptions = [
	{ value: "1-10", label: "1-10 employees" },
	{ value: "11-50", label: "11-50 employees" },
	{ value: "51-100", label: "51-100 employees" },
	{ value: "101-250", label: "101-250 employees" },
	{ value: "251-500", label: "251-500 employees" },
	{ value: "500+", label: "500+ employees" },
];

// Optimized Input component with local state
function OptimizedInput({ 
	id, 
	value: propValue, 
	onChange, 
	placeholder, 
	className = "text-xs h-8"
}: {
	id: string;
	value: string;
	onChange: (field: string, value: string) => void;
	placeholder: string;
	className?: string;
}) {
	const [localValue, setLocalValue] = useState(propValue);

	// Update local value when prop changes (e.g., form reset)
	useEffect(() => {
		setLocalValue(propValue);
	}, [propValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocalValue(e.target.value);
	};

	const handleBlur = () => {
		if (localValue !== propValue) {
			onChange(id, localValue);
		}
	};

	return (
		<Input
			id={id}
			value={localValue}
			onChange={handleChange}
			onBlur={handleBlur}
			placeholder={placeholder}
			className={className}
		/>
	);
}

export function CompanyDetailsSection({ formData, onInputChange }: CompanyDetailsSectionProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700">
				Company Details
			</h3>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label
						htmlFor="companyIndustry"
						className="text-xs font-medium"
					>
						Company Industry
					</Label>
					<OptimizedInput
						id="company_industry"
						value={formData.company_industry}
						onChange={onInputChange}
						placeholder="e.g., Technology, Healthcare"
					/>
				</div>
				<div>
					<Label htmlFor="companySize" className="text-xs font-medium">
						Company Size
					</Label>
					<Select
						value={formData.company_size}
						onValueChange={(value) =>
							onInputChange("company_size", value)
						}
					>
						<SelectTrigger className="text-xs h-8">
							<SelectValue placeholder="Select company size" />
						</SelectTrigger>
						<SelectContent>
							{companySizeOptions.map((option) => (
								<SelectItem key={option.value} value={option.value} className="text-xs">
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
} 