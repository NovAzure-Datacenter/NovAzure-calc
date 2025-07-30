"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { countryOptions } from "@/lib/constants/country-options";

interface AddressSectionProps {
	formData: {
		street: string;
		city: string;
		state_province: string;
		zipcode_postal_code: string;
		country: string;
	};
	onInputChange: (field: string, value: string) => void;
}

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

export function AddressSection({ formData, onInputChange }: AddressSectionProps) {
	const [countrySearch, setCountrySearch] = useState("");

	// Filter countries based on search
	const filteredCountries = countryOptions.filter((country) =>
		country.label.toLowerCase().includes(countrySearch.toLowerCase())
	);

	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700">
				Address Information
			</h3>
			<div>
				<Label htmlFor="street" className="text-xs font-medium">
					Street Address
				</Label>
				<OptimizedInput
					id="street"
					value={formData.street}
					onChange={onInputChange}
					placeholder="123 Main Street"
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="city" className="text-xs font-medium">
						City
					</Label>
					<OptimizedInput
						id="city"
						value={formData.city}
						onChange={onInputChange}
						placeholder="City"
					/>
				</div>
				<div>
					<Label
						htmlFor="state_province"
						className="text-xs font-medium"
					>
						State/Province
					</Label>
					<OptimizedInput
						id="state_province"
						value={formData.state_province}
						onChange={onInputChange}
						placeholder="State/Province"
					/>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label
						htmlFor="zipcode_postal_code"
						className="text-xs font-medium"
					>
						ZIP/Postal Code
					</Label>
					<OptimizedInput
						id="zipcode_postal_code"
						value={formData.zipcode_postal_code}
						onChange={onInputChange}
						placeholder="12345"
					/>
				</div>
				<div>
					<Label htmlFor="country" className="text-xs font-medium">
						Country
					</Label>
					<Select
						value={formData.country}
						onValueChange={(value) =>
							onInputChange("country", value)
						}
					>
						<SelectTrigger className="text-xs h-8">
							<SelectValue placeholder="Select country" />
						</SelectTrigger>
						<SelectContent className="max-h-[300px]">
							<div className="flex items-center px-3 py-2 border-b">
								<Search className="h-4 w-4 text-muted-foreground mr-2" />
								<input
									placeholder="Search countries..."
									value={countrySearch}
									onChange={(e) => setCountrySearch(e.target.value)}
									className="flex-1 bg-transparent border-none outline-none text-xs placeholder:text-muted-foreground"
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
							<div className="max-h-[250px] overflow-y-auto">
								{filteredCountries.length > 0 ? (
									filteredCountries.map((option) => (
										<SelectItem key={option.value} value={option.value} className="text-xs">
											{option.label}
										</SelectItem>
									))
								) : (
									<div className="px-3 py-2 text-xs text-muted-foreground">
										No countries found
									</div>
								)}
							</div>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
} 