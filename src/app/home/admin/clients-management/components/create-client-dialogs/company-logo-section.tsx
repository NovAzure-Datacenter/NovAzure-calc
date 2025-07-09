"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { toast } from "sonner";

interface CompanyLogoSectionProps {
	formData: {
		logo: string;
		company_name: string;
		website: string;
		main_contact_first_name: string;
		main_contact_last_name: string;
	};
	onInputChange: (field: string, value: string) => void;
	loginEmail?: string;
}

// Function to generate login email for client
function generateClientLoginEmail(
	firstName: string,
	lastName: string,
	companyName: string
): string {
	if (!firstName || !lastName || !companyName) {
		return "";
	}

	// Clean and normalize inputs
	const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, "").toLowerCase();
	const cleanLastName = lastName.replace(/[^a-zA-Z]/g, "").toLowerCase();
	const cleanCompanyName = companyName
		.replace(/[^a-zA-Z0-9]/g, "")
		.replace(/\s+/g, "")
		.toLowerCase();

	if (!cleanFirstName || !cleanLastName || !cleanCompanyName) {
		return "";
	}

	// Generate email: firstLetter + lastName + "-" + companyName + "@novazure.com"
	const firstLetter = cleanFirstName.charAt(0).toUpperCase();
	const email = `${firstLetter}${cleanLastName}-${cleanCompanyName}@novazure.com`;

	return email;
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

	const generatedLoginEmail = useMemo(() => {
		return generateClientLoginEmail(
			formData.main_contact_first_name,
			formData.main_contact_last_name,
			formData.company_name
		);
	}, [formData.main_contact_first_name, formData.main_contact_last_name, formData.company_name]);

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
						id="company_name"
						value={formData.company_name}
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
			{generatedLoginEmail && (
				<div>
					<Label className="text-xs font-medium text-gray-600">
						Client Login Email
					</Label>
					<div className="flex items-center gap-2 mt-1">
						<Input
							value={generatedLoginEmail}
							readOnly
							className="text-xs h-8 bg-gray-50 text-gray-700 cursor-not-allowed"
						/>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="text-xs h-8 px-2"
							onClick={() => {
								navigator.clipboard.writeText(generatedLoginEmail);
								toast.success("Login email copied to clipboard!");
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

			{!generatedLoginEmail && (
				<div>
					<Label className="text-xs font-medium text-gray-600">
						Client Login Email
					</Label>
					<div className="flex items-center gap-2 mt-1">
						<Input
							value=""
							readOnly
							placeholder="Enter company name, first name, and last name to generate login email"
							className="text-xs h-8 bg-gray-50 text-gray-500 cursor-not-allowed"
						/>
					</div>
					<p className="text-xs text-gray-500 mt-1">
						Login email will be generated automatically once all required fields are filled
					</p>
				</div>
			)}
		</div>
	);
} 