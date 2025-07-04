"use client";

import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface ContactInformationSectionProps {
	formData: {
		mainContactFirstName: string;
		mainContactLastName: string;
		mainContactEmail: string;
		mainContactPhone: string;
		techContactFirstName: string;
		techContactLastName: string;
		techContactEmail: string;
		techContactPhone: string;
	};
	onInputChange: (field: string, value: string) => void;
}

// Custom PhoneInput wrapper with Tailwind styling
function PhoneInputWrapper({ value, onChange, onBlur, placeholder, ...props }: any) {
	return (
		<div className="relative">
			<PhoneInput
				{...props}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				className="flex items-center border border-input bg-background text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md h-8 [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:gap-1 [&_.PhoneInputCountry]:px-2 [&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountrySelect]:text-xs [&_.PhoneInputCountrySelect]:font-medium [&_.PhoneInputCountrySelect]:text-foreground [&_.PhoneInputCountrySelectArrow]:text-muted-foreground [&_.PhoneInputCountrySelectArrow]:ml-1 [&_.PhoneInputInput]:flex [&_.PhoneInputInput]:h-8 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:px-2 [&_.PhoneInputInput]:text-xs [&_.PhoneInputInput]:ring-offset-background [&_.PhoneInputInput]:placeholder:text-muted-foreground [&_.PhoneInputInput]:focus-visible:outline-none [&_.PhoneInputInput]:focus-visible:ring-0 [&_.PhoneInputInput]:focus-visible:ring-offset-0 [&_.PhoneInputInput]:disabled:cursor-not-allowed [&_.PhoneInputInput]:disabled:opacity-50 [&_.PhoneInputCountryFlag]:w-4 [&_.PhoneInputCountryFlag]:h-4 [&_.PhoneInputCountryIcon]:w-4 [&_.PhoneInputCountryIcon]:h-4"
			/>
		</div>
	);
}

// Optimized Input component with local state
function OptimizedInput({ 
	id, 
	value: propValue, 
	onChange, 
	onBlur, 
	placeholder, 
	required = false, 
	type = "text",
	className = "text-xs h-8"
}: {
	id: string;
	value: string;
	onChange: (field: string, value: string) => void;
	onBlur?: () => void;
	placeholder: string;
	required?: boolean;
	type?: string;
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
		onBlur?.();
	};

	return (
		<Input
			id={id}
			value={localValue}
			onChange={handleChange}
			onBlur={handleBlur}
			placeholder={placeholder}
			className={className}
			type={type}
			required={required}
		/>
	);
}

export function ContactInformationSection({ formData, onInputChange }: ContactInformationSectionProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700">
				Contact Information
			</h3>

			{/* Main Contact */}
			<div className="space-y-3">
				<h4 className="text-xs font-medium text-gray-600">
					Main Contact
				</h4>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label
							htmlFor="mainContactFirstName"
							className="text-xs font-medium"
						>
							First Name <span className="text-red-500">*</span>
						</Label>
						<OptimizedInput
							id="mainContactFirstName"
							value={formData.mainContactFirstName}
							onChange={onInputChange}
							placeholder="First name"
							required
						/>
					</div>
					<div>
						<Label
							htmlFor="mainContactLastName"
							className="text-xs font-medium"
						>
							Last Name <span className="text-red-500">*</span>
						</Label>
						<OptimizedInput
							id="mainContactLastName"
							value={formData.mainContactLastName}
							onChange={onInputChange}
							placeholder="Last name"
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label
							htmlFor="mainContactEmail"
							className="text-xs font-medium"
						>
							Email <span className="text-red-500">*</span>
						</Label>
						<OptimizedInput
							id="mainContactEmail"
							value={formData.mainContactEmail}
							onChange={onInputChange}
							placeholder="contact@company.com"
							type="email"
							required
						/>
					</div>
					<div>
						<Label
							htmlFor="mainContactPhone"
							className="text-xs font-medium"
						>
							Phone
						</Label>
						<PhoneInputWrapper
							international
							defaultCountry="US"
							value={formData.mainContactPhone}
							onChange={(value: string) =>
								onInputChange("mainContactPhone", value || "")
							}
							placeholder="Enter phone number"
						/>
					</div>
				</div>
			</div>

			{/* Tech Contact */}
			<div className="space-y-3">
				<h4 className="text-xs font-medium text-gray-600">
					Technical Contact
				</h4>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label
							htmlFor="techContactFirstName"
							className="text-xs font-medium"
						>
							First Name
						</Label>
						<OptimizedInput
							id="techContactFirstName"
							value={formData.techContactFirstName}
							onChange={onInputChange}
							placeholder="First name"
						/>
					</div>
					<div>
						<Label
							htmlFor="techContactLastName"
							className="text-xs font-medium"
						>
							Last Name
						</Label>
						<OptimizedInput
							id="techContactLastName"
							value={formData.techContactLastName}
							onChange={onInputChange}
							placeholder="Last name"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label
							htmlFor="techContactEmail"
							className="text-xs font-medium"
						>
							Email
						</Label>
						<OptimizedInput
							id="techContactEmail"
							value={formData.techContactEmail}
							onChange={onInputChange}
							placeholder="tech@company.com"
							type="email"
						/>
					</div>
					<div>
						<Label
							htmlFor="techContactPhone"
							className="text-xs font-medium"
						>
							Phone
						</Label>
						<PhoneInputWrapper
							international
							defaultCountry="US"
							value={formData.techContactPhone}
							onChange={(value: string) =>
								onInputChange("techContactPhone", value || "")
							}
							placeholder="Enter phone number"
						/>
					</div>
				</div>
			</div>
		</div>
	);
} 