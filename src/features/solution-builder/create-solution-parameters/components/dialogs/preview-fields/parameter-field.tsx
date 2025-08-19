import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Parameter } from "@/types/types";

interface ParameterFieldProps {
	parameter: Parameter;
}

export function ParameterField({ parameter }: ParameterFieldProps) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<Label className="text-sm font-medium text-gray-700">{parameter.name}</Label>
			</div>
			<div className="space-y-2">
				{parameter.user_interface.type === "static" ? (
					<StaticField parameter={parameter} />
				) : parameter.display_type === "dropdown" || parameter.display_type === "filter" ? (
					<DropdownField parameter={parameter} />
				) : parameter.display_type === "range" ? (
					<RangeField parameter={parameter} />
				) : parameter.display_type === "simple" ? (
					<SimpleField parameter={parameter} />
				) : (
					<DefaultField parameter={parameter} />
				)}
			</div>
		</div>
	);
}

function StaticField({ parameter }: { parameter: Parameter }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">
				{parameter.description || parameter.name}
			</Label>
			<div className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 select-none pointer-events-none">
				{parameter.test_value || "No value set"}
			</div>
		</div>
	);
}

function DropdownField({ parameter }: { parameter: Parameter }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">Select {parameter.name}:</Label>
			<Select>
				<SelectTrigger className="w-full h-10 border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-gray-500">
					<SelectValue placeholder={`Select an option for ${parameter.name}`} />
				</SelectTrigger>
				<SelectContent>
					{parameter.dropdown_options && parameter.dropdown_options.map((option, index) => (
						<SelectItem key={index} value={option.value || option.key || `option-${index}`}>
							{option.value || option.key || `Option ${index + 1}`}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

function RangeField({ parameter }: { parameter: Parameter }) {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const input = e.target as HTMLInputElement;
		const value = input.value;
		const key = e.key;
		
		if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
			return;
		}
		
		if (key === '.' && !value.includes('.')) {
			return;
		}
		
		if (!/^\d$/.test(key)) {
			e.preventDefault();
			return;
		}
		
		const newValue = value + key;
		if (parameter.range_max !== undefined && parseFloat(newValue) > parseFloat(parameter.range_max.toString())) {
			e.preventDefault();
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const input = e.target as HTMLInputElement;
		const value = parseFloat(input.value);
		
		if (parameter.range_min !== undefined && value < parseFloat(parameter.range_min.toString())) {
			input.value = parameter.range_min.toString();
		} else if (parameter.range_max !== undefined && value > parseFloat(parameter.range_max.toString())) {
			input.value = parameter.range_max.toString();
		}
	};

	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">
				{parameter.description || `Enter ${parameter.name}`}
			</Label>
			<input 
				type="number" 
				className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
				placeholder={`Enter value between ${parameter.range_min || '0'} and ${parameter.range_max || '∞'}`}
				min={parameter.range_min}
				max={parameter.range_max}
				step="any"
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
			/>
			{parameter.range_min && parameter.range_max && (
				<div className="text-xs text-gray-500">
					Range: {parameter.range_min} - {parameter.range_max}
				</div>
			)}
		</div>
	);
}

function SimpleField({ parameter }: { parameter: Parameter }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">
				{parameter.description || `Enter ${parameter.name}`}
			</Label>
			<input 
				type="text" 
				className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
				placeholder={`Enter ${parameter.name}`}
			/>
		</div>
	);
}

function DefaultField({ parameter }: { parameter: Parameter }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">
				{parameter.description || `Enter ${parameter.name}`}
			</Label>
			<input 
				type="number" 
				className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
				placeholder={`Enter ${parameter.name}`}
			/>
		</div>
	);
} 