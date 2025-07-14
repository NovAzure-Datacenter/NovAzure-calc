"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import { VALIDATION_RULES } from "@/lib/constants/calculator-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
	dependencies?: {
		utilisation_percentage?: string | number;
		project_location?: string | number;
	};
}

// Country data for Air Annualized PPUE
const countryData: Record<string, Record<string, number>> = {
	"20%": {
		UK: 2.11,
		Singapore: 2.66,
		USA: 2.13,
		UAE: 3.19,
	},
	"30%": {
		UK: 1.72,
		Singapore: 2.17,
		USA: 1.74,
		UAE: 2.6,
	},
	"40%": {
		UK: 1.53,
		Singapore: 1.93,
		USA: 1.54,
		UAE: 2.32,
	},
	"50%": {
		UK: 1.42,
		Singapore: 1.79,
		USA: 1.43,
		UAE: 2.15,
	},
	"60%": {
		UK: 1.34,
		Singapore: 1.69,
		USA: 1.35,
		UAE: 2.03,
	},
	"70%": {
		UK: 1.29,
		Singapore: 1.62,
		USA: 1.3,
		UAE: 1.94,
	},
	"80%": {
		UK: 1.25,
		Singapore: 1.57,
		USA: 1.26,
		UAE: 1.88,
	},
	"90%": {
		UK: 1.21,
		Singapore: 1.53,
		USA: 1.22,
		UAE: 1.84,
	},
	"100%": {
		UK: 1.19,
		Singapore: 1.5,
		USA: 1.2,
		UAE: 1.8,
	},
};

// Tooltip information for specific fields
const FIELD_TOOLTIPS: Record<string, string> = {
	utilisation_percentage: "Actual IT power consumption vs maximum IT design.",
	planned_years_operation:
		"Expected operational lifespan of the new cooling system. The maximum number of years of operation is 20 years.",
	project_location:
		"Please choose the country where your data center is located. If you can't find it in the dropdown, pick the country that has the most similar climate.",
	data_hall_capacity:
		"The maximum amount of electrical energy consumed by or dedicated to the installed IT equipment. The value should be greater than 0.5 MW but no more than 10 MW.",
	first_year_operation:
		"Planned commencement year for the data center or hall.",
	air_annualized_ppue:
		"Typical Air Annualised pPUE (partial Power Usage Effectiveness for cooling) for the selected location at selected Load. Please ensure any inputted pPUE value is above 1.00 and below 3.00.",
};

export function ConfigurationSection({
	title,
	fields,
	onFieldChange,
	dependencies,
}: ConfigurationSectionProps) {
	// Track local error state for validation
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [isMinimized, setIsMinimized] = useState(false);
	const prevDependencies = useRef<{
		utilisation: string | number;
		location: string | number;
	}>({ utilisation: "", location: "" });

	// Get current values for dependency checking
	const getCurrentValue = (fieldId: string) => {
		// If we have dependencies prop, use it for these specific fields
		if (
			dependencies &&
			(fieldId === "utilisation_percentage" || fieldId === "project_location")
		) {
			return dependencies[fieldId as keyof typeof dependencies] || "";
		}
		// Otherwise, look in the fields array
		const field = fields.find((f) => f.id === fieldId);
		return field?.value || "";
	};

	// Check if Air Annualized PPUE should be enabled
	const isAirPPUEEnabled = () => {
		const utilisation = getCurrentValue("utilisation_percentage");
		const location = getCurrentValue("project_location");
		return Boolean(utilisation && location);
	};

	// Get the correct PPUE value based on utilisation and location
	const getPPUEValue = () => {
		const utilisation = getCurrentValue("utilisation_percentage");
		const location = getCurrentValue("project_location");

		if (!utilisation || !location) return "";

		// Map location names to country keys
		const locationMap: Record<string, string> = {
			"United Kingdom": "UK",
			"United States": "USA",
			Singapore: "Singapore",
			"United Arab Emirates": "UAE",
		};

		const countryKey = locationMap[location];
		if (!countryKey || !countryData[utilisation]) return "";

		const countryValues = countryData[utilisation];
		if (!countryValues || !countryValues[countryKey]) return "";

		return countryValues[countryKey].toString();
	};

	// Validation handler
	const validateField = (fieldId: string, value: string | number) => {
		const rule = VALIDATION_RULES[fieldId as keyof typeof VALIDATION_RULES];
		if (!rule) return "";

		const num = Number(value);
		if (isNaN(num)) return rule.message;
		if (num < rule.min)
			return `${fieldId.replace(/_/g, " ")} must be at least ${rule.min}`;
		if (num > rule.max)
			return `${fieldId.replace(/_/g, " ")} must be at most ${rule.max}`;
		return "";
	};

	// Custom handler for field changes with validation
	const handleFieldChange = (id: string, value: string | number) => {
		const error = validateField(id, value);
		setFieldErrors((prev) => ({
			...prev,
			[id]: error,
		}));
		onFieldChange(id, value);
	};

	// Auto-update Air Annualized PPUE when dependencies change
	useEffect(() => {
		const utilisation = getCurrentValue("utilisation_percentage");
		const location = getCurrentValue("project_location");

		// Only update if dependencies actually changed
		if (
			utilisation !== prevDependencies.current.utilisation ||
			location !== prevDependencies.current.location
		) {
			prevDependencies.current = { utilisation, location };

			if (utilisation && location) {
				const ppueValue = getPPUEValue();
				if (ppueValue) {
					// Only set the default value if the field is currently empty
					const currentField = fields.find(
						(f) => f.id === "air_annualized_ppue"
					);
					if (
						currentField &&
						(!currentField.value || currentField.value === "")
					) {
						onFieldChange("air_annualized_ppue", ppueValue);
					}
				}
			}
		}
	}, [fields, dependencies]);

	// Get selected field values for minimized display
	const getFieldDisplayValue = (field: ConfigField) => {
		if (!field.value || field.value === "") return "Not set";
		return `${field.value}${field.unit ? ` ${field.unit}` : ""}`;
	};

	return (
		<TooltipProvider>
			<div className="space-y-3">
				{isMinimized ? (
					// Minimized state
					<div className="flex items-start justify-between">
						<div className="flex flex-col space-y-2 text-xs text-gray-600">
							{/* Row 1 */}
							<div className="flex items-center space-x-8">
								{fields.slice(0, Math.ceil(fields.length / 4)).map((field) => (
									<div key={field.id} className="flex items-center space-x-2">
										<span className="font-medium text-gray-500">
											{field.label}:
										</span>
										<span className="truncate max-w-24 font-semibold text-gray-900">
											{getFieldDisplayValue(field)}
										</span>
									</div>
								))}
							</div>
							{/* Row 2 */}
							<div className="flex items-center space-x-8">
								{fields
									.slice(
										Math.ceil(fields.length / 4),
										Math.ceil(fields.length / 2)
									)
									.map((field) => (
										<div key={field.id} className="flex items-center space-x-2">
											<span className="font-medium text-gray-500">
												{field.label}:
											</span>
											<span className="truncate max-w-24 font-semibold text-gray-900">
												{getFieldDisplayValue(field)}
											</span>
										</div>
									))}
							</div>
							{/* Row 3 */}
							<div className="flex items-center space-x-8">
								{fields
									.slice(
										Math.ceil(fields.length / 2),
										Math.ceil((fields.length * 3) / 4)
									)
									.map((field) => (
										<div key={field.id} className="flex items-center space-x-2">
											<span className="font-medium text-gray-500">
												{field.label}:
											</span>
											<span className="truncate max-w-24 font-semibold text-gray-900">
												{getFieldDisplayValue(field)}
											</span>
										</div>
									))}
							</div>
							{/* Row 4 */}
							<div className="flex items-center space-x-8">
								{fields
									.slice(Math.ceil((fields.length * 3) / 4))
									.map((field) => (
										<div key={field.id} className="flex items-center space-x-2">
											<span className="font-medium text-gray-500">
												{field.label}:
											</span>
											<span className="truncate max-w-24 font-semibold text-gray-900">
												{getFieldDisplayValue(field)}
											</span>
										</div>
									))}
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsMinimized(false)}
							className="h-8 px-2 text-gray-500 hover:text-gray-700"
						>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</div>
				) : (
					// Expanded state
					<>
						<div className="flex items-center justify-between">
							<h3 className="text-xs font-medium text-gray-700">{title}</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsMinimized(true)}
								className="h-8 px-2 text-gray-500 hover:text-gray-700"
							>
								<ChevronUp className="h-4 w-4" />
							</Button>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{fields.map((field) => {
								const hasTooltip = FIELD_TOOLTIPS[field.id];

								return (
									<div key={field.id} className="space-y-1">
										<div className="flex items-center gap-1.5">
											<Label htmlFor={field.id} className="text-xs font-medium">
												{field.label}
												{field.required && (
													<span className="text-red-500 ml-1">*</span>
												)}
											</Label>
											{hasTooltip && (
												<Tooltip>
													<TooltipTrigger asChild>
														<HelpCircle className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
													</TooltipTrigger>
													<TooltipContent className="max-w-xs">
														<p className="text-xs">
															{FIELD_TOOLTIPS[field.id]}
														</p>
													</TooltipContent>
												</Tooltip>
											)}
										</div>
										<div className="flex items-center gap-2">
											{field.type === "number" ? (
												<Input
													id={field.id}
													type={
														field.id === "data_hall_capacity"
															? "text"
															: "number"
													}
													value={field.value as string}
													onChange={(e) =>
														handleFieldChange(field.id, e.target.value)
													}
													disabled={
														field.id === "air_annualized_ppue" &&
														!isAirPPUEEnabled()
													}
													className={`text-xs h-8 ${
														field.id === "data_hall_capacity" ||
														field.id === "planned_years_operation" ||
														field.id === "air_annualized_ppue"
															? field.id === "air_annualized_ppue"
																? "w-36"
																: "w-24"
															: ""
													} ${
														field.required && !field.value
															? "border-red-200"
															: ""
													} ${
														field.id === "air_annualized_ppue" &&
														!isAirPPUEEnabled()
															? "bg-gray-100 cursor-not-allowed"
															: ""
													}`}
													placeholder={
														field.id === "air_annualized_ppue" &&
														!isAirPPUEEnabled()
															? "Select utilisation and location first"
															: field.placeholder ||
															  `Enter ${field.label.toLowerCase()}`
													}
													step={field.step || "any"}
													min={
														field.id === "data_hall_capacity"
															? undefined
															: undefined
													}
													max={
														field.id === "data_hall_capacity"
															? undefined
															: undefined
													}
												/>
											) : field.type === "text" ? (
												<Input
													id={field.id}
													type="text"
													value={field.value as string}
													onChange={(e) =>
														handleFieldChange(field.id, e.target.value)
													}
													className={`text-xs h-8 ${
														field.id === "planned_years_operation" ? "w-24" : ""
													} ${
														field.required && !field.value
															? "border-red-200"
															: ""
													}`}
													placeholder={
														field.id === "planned_years_operation"
															? "15"
															: field.placeholder ||
															  `Enter ${field.label.toLowerCase()}`
													}
												/>
											) : (
												<Select
													value={field.value as string}
													onValueChange={(value) =>
														handleFieldChange(field.id, value)
													}
													required={field.required}
												>
													<SelectTrigger
														className={`text-xs h-8 ${
															field.required && !field.value
																? "border-red-200"
																: ""
														}`}
													>
														<SelectValue
															placeholder={`Select ${field.label.toLowerCase()}`}
														/>
													</SelectTrigger>
													<SelectContent>
														{field.options?.map((option) => (
															<SelectItem
																key={option}
																value={option}
																className="text-xs"
															>
																{option}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
											{field.unit && (
												<Badge
													variant="outline"
													className="text-xs px-2 py-0.5 h-6 bg-gray-50 text-gray-600 border-gray-200"
												>
													{field.unit}
												</Badge>
											)}
											{field.id === "air_annualized_ppue" &&
												isAirPPUEEnabled() && (
													<Badge className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
														{getPPUEValue() || "Calculating..."}
													</Badge>
												)}
										</div>
										{fieldErrors[field.id] && (
											<p className="text-xs text-red-500">
												{fieldErrors[field.id]}
											</p>
										)}
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>
		</TooltipProvider>
	);
}
