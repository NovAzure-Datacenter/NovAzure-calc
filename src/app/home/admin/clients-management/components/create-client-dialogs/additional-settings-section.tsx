"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface AdditionalSettingsSectionProps {
	formData: {
		timezone: string;
		client_status: string;
		additional_notes: string;
	};
	onInputChange: (field: string, value: string) => void;
}

const timezoneOptions = [
	{ value: "UTC", label: "UTC" },
	{ value: "EST", label: "Eastern Standard Time" },
	{ value: "CST", label: "Central Standard Time" },
	{ value: "MST", label: "Mountain Standard Time" },
	{ value: "PST", label: "Pacific Standard Time" },
	{ value: "GMT", label: "Greenwich Mean Time" },
	{ value: "CET", label: "Central European Time" },
	{ value: "EET", label: "Eastern European Time" },
	{ value: "JST", label: "Japan Standard Time" },
	{ value: "AEST", label: "Australian Eastern Standard Time" },
];

const clientStatusOptions = [
	{ value: "active", label: "Active" },
	{ value: "prospect", label: "Prospect" },
	{ value: "on-hold", label: "On Hold" },
	{ value: "inactive", label: "Inactive" },
];

// Optimized Textarea component with local state
function OptimizedTextarea({ 
	id, 
	value: propValue, 
	onChange, 
	placeholder, 
	rows = 3,
	className = "text-xs"
}: {
	id: string;
	value: string;
	onChange: (field: string, value: string) => void;
	placeholder: string;
	rows?: number;
	className?: string;
}) {
	const [localValue, setLocalValue] = useState(propValue);

	// Update local value when prop changes (e.g., form reset)
	useEffect(() => {
		setLocalValue(propValue);
	}, [propValue]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setLocalValue(e.target.value);
	};

	const handleBlur = () => {
		if (localValue !== propValue) {
			onChange(id, localValue);
		}
	};

	return (
		<Textarea
			id={id}
			value={localValue}
			onChange={handleChange}
			onBlur={handleBlur}
			placeholder={placeholder}
			rows={rows}
			className={className}
		/>
	);
}

export function AdditionalSettingsSection({ formData, onInputChange }: AdditionalSettingsSectionProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700">
				Additional Settings
			</h3>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="timezone" className="text-xs font-medium">
						Timezone
					</Label>
					<Select
						value={formData.timezone}
						onValueChange={(value) =>
							onInputChange("timezone", value)
						}
					>
						<SelectTrigger className="text-xs h-8">
							<SelectValue placeholder="Select timezone" />
						</SelectTrigger>
						<SelectContent>
							{timezoneOptions.map((option) => (
								<SelectItem key={option.value} value={option.value} className="text-xs">
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="client_status" className="text-xs font-medium">
						Client Status
					</Label>
					<Select
						value={formData.client_status}
						onValueChange={(value) =>
							onInputChange("client_status", value)
						}
					>
						<SelectTrigger className="text-xs h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{clientStatusOptions.map((option) => (
								<SelectItem key={option.value} value={option.value} className="text-xs">
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Additional Notes */}
			<div>
				<Label htmlFor="additional_notes" className="text-xs font-medium">
					Additional Notes
				</Label>
				<OptimizedTextarea
					id="additional_notes"
					value={formData.additional_notes}
					onChange={onInputChange}
					placeholder="Any additional information about the client..."
				/>
			</div>
		</div>
	);
} 