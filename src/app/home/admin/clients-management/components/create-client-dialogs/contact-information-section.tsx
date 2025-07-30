"use client";

import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface ContactInformationSectionProps {
	formData: {
		main_contact_first_name: string;
		main_contact_last_name: string;
		main_contact_email: string;
		main_contact_phone: string;
		tech_contact_first_name: string;
		tech_contact_last_name: string;
		tech_contact_email: string;
		tech_contact_phone: string;
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
							htmlFor="main_contact_first_name"
							className="text-xs font-medium"
						>
							First Name <span className="text-red-500">*</span>
						</Label>
						<OptimizedInput
							id="main_contact_first_name"
							value={formData.main_contact_first_name}
							onChange={onInputChange}
							placeholder="First name"
							required
						/>
					</div>
					<div>
						<Label
							htmlFor="main_contact_last_name"
							className="text-xs font-medium"
						>
							Last Name <span className="text-red-500">*</span>
						</Label>
						<OptimizedInput
							id="main_contact_last_name"
							value={formData.main_contact_last_name}
							onChange={onInputChange}
							placeholder="Last name"
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label
							htmlFor="main_contact_email"
							className="text-xs font-medium"
						>
							Email <span className="text-red-500">*</span>
						</Label>
						<OptimizedInput
							id="main_contact_email"
							value={formData.main_contact_email}
							onChange={onInputChange}
							placeholder="contact@company.com"
							type="email"
							required
						/>
					</div>
					<div>
						<Label
							htmlFor="main_contact_phone"
							className="text-xs font-medium"
						>
							Phone
						</Label>
						<PhoneInputWrapper
							international
							defaultCountry="US"
							value={formData.main_contact_phone}
							onChange={(value: string) =>
								onInputChange("main_contact_phone", value || "")
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
							htmlFor="tech_contact_first_name"
							className="text-xs font-medium"
						>
							First Name
						</Label>
						<OptimizedInput
							id="tech_contact_first_name"
							value={formData.tech_contact_first_name}
							onChange={onInputChange}
							placeholder="First name"
						/>
					</div>
					<div>
						<Label
							htmlFor="tech_contact_last_name"
							className="text-xs font-medium"
						>
							Last Name
						</Label>
						<OptimizedInput
							id="tech_contact_last_name"
							value={formData.tech_contact_last_name}
							onChange={onInputChange}
							placeholder="Last name"
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label
							htmlFor="tech_contact_email"
							className="text-xs font-medium"
						>
							Email
						</Label>
						<OptimizedInput
							id="tech_contact_email"
							value={formData.tech_contact_email}
							onChange={onInputChange}
							placeholder="tech@company.com"
							type="email"
						/>
					</div>
					<div>
						<Label
							htmlFor="tech_contact_phone"
							className="text-xs font-medium"
						>
							Phone
						</Label>
						<PhoneInputWrapper
							international
							defaultCountry="US"
							value={formData.tech_contact_phone}
							onChange={(value: string) =>
								onInputChange("tech_contact_phone", value || "")
							}
							placeholder="Enter phone number"
						/>
					</div>
				</div>
			</div>
		</div>
	);
} 