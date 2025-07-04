"use client";

import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { iconOptions } from "@/lib/icons/lucide-icons";

interface CompanyLogoSectionProps {
	formData: {
		logo: string;
		companyName: string;
		website: string;
	};
	onInputChange: (field: string, value: string) => void;
	loginEmail: string;
}

// Optimized Input component with local state
function OptimizedInput({ 
	id, 
	value: propValue, 
	onChange, 
	placeholder, 
	required = false,
	className = "text-xs h-8"
}: {
	id: string;
	value: string;
	onChange: (field: string, value: string) => void;
	placeholder: string;
	required?: boolean;
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
			required={required}
		/>
	);
}

export function CompanyLogoSection({ formData, onInputChange, loginEmail }: CompanyLogoSectionProps) {
	const handleIconChange = (iconName: string) => {
		onInputChange("logo", iconName);
	};

	return (
		<div className="space-y-4">
			<div>
				<Label className="text-xs font-medium">Company Logo</Label>
				<div className="flex items-center gap-2 mt-1">
					<div className="flex items-center justify-center w-8 h-8 border rounded-md bg-gray-50">
						{React.createElement(
							iconOptions.find((opt) => opt.value === formData.logo)
								?.icon || Building2,
							{ className: "h-4 w-4 text-gray-600" }
						)}
					</div>
					<Select
						onValueChange={handleIconChange}
						value={formData.logo}
					>
						<SelectTrigger className="text-xs h-8 flex-1">
							<SelectValue placeholder="Select an icon" />
						</SelectTrigger>
						<SelectContent>
							{iconOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									<div className="flex items-center gap-2">
										<option.icon className="h-4 w-4" />
										<span>{option.label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Mandatory Fields */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="companyName" className="text-xs font-medium">
						Company Name <span className="text-red-500">*</span>
					</Label>
					<OptimizedInput
						id="companyName"
						value={formData.companyName}
						onChange={onInputChange}
						placeholder="Enter company name..."
						required
					/>
				</div>
				<div>
					<Label htmlFor="website" className="text-xs font-medium">
						Website <span className="text-red-500">*</span>
					</Label>
					<OptimizedInput
						id="website"
						value={formData.website}
						onChange={onInputChange}
						placeholder="https://www.example.com"
						required
					/>
				</div>
			</div>

			{/* Login Email Display */}
			{loginEmail && (
				<div>
					<Label className="text-xs font-medium text-gray-600">
						Client Login Email
					</Label>
					<div className="flex items-center gap-2 mt-1">
						<Input
							value={loginEmail}
							readOnly
							className="text-xs h-8 bg-gray-50 text-gray-700 cursor-not-allowed"
						/>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="text-xs h-8 px-2"
							onClick={() => {
								navigator.clipboard.writeText(loginEmail);
								// Note: toast will be handled by parent component
							}}
						>
							Copy
						</Button>
					</div>
					<p className="text-xs text-gray-500 mt-1">
						This email will be used for client login access
					</p>
				</div>
			)}
		</div>
	);
} 