import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AddParameterDialogProps,
	ParameterFormFieldProps,
	ParameterNameFieldProps,
	ParameterCategoryFieldProps,
	ParameterDisplayTypeFieldProps,
	ParameterValueFieldProps,
	ParameterTestValueFieldProps,
	ParameterUnitFieldProps,
	ParameterDescriptionFieldProps,
	ParameterInformationFieldProps,
	ParameterProvidedByFieldProps,
	ParameterOutputFieldProps,
	FilterOptionsEditorProps,
	DropdownOptionsEditorProps,
} from "../../types/types";

/**
 * AddParameterDialog component - Dialog for adding new parameters
 */
export function AddParameterDialog({
	isOpen,
	onOpenChange,
	newParameterData,
	setNewParameterData,
	onSaveParameter,
	onCancelParameter,
	getAllAvailableCategories,
	getCategoryBadgeStyle,
	parametersCount,
}: AddParameterDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Parameter</DialogTitle>
					<DialogDescription>
						Create a new parameter for your calculations. Current parameters: {parametersCount}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<ParameterNameField
						value={newParameterData.name}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								name: value,
							}))
						}
						placeholder="Parameter name"
					/>

					<ParameterCategoryField
						value={newParameterData.category}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								category: value,
							}))
						}
						getAllAvailableCategories={getAllAvailableCategories}
						getCategoryBadgeStyle={getCategoryBadgeStyle}
					/>

					<ParameterDisplayTypeField
						value={newParameterData.display_type}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								display_type: value as "simple" | "dropdown" | "range" | "filter",
							}))
						}
					/>

					<ParameterValueField
						displayType={newParameterData.display_type}
						value={newParameterData.value}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								value: value,
							}))
						}
						dropdownOptions={newParameterData.dropdown_options}
						onDropdownOptionsChange={(options) =>
							setNewParameterData((prev) => ({
								...prev,
								dropdown_options: options,
							}))
						}
						rangeMin={newParameterData.range_min}
						rangeMax={newParameterData.range_max}
						onRangeMinChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								range_min: value,
							}))
						}
						onRangeMaxChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								range_max: value,
							}))
						}
						userInterfaceType={newParameterData.user_interface.type}
					/>

					<ParameterTestValueField
						value={newParameterData.test_value}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								test_value: value,
							}))
						}
					/>

					<ParameterUnitField
						value={newParameterData.unit}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								unit: value,
							}))
						}
						placeholder="Unit"
					/>

					<ParameterDescriptionField
						value={newParameterData.description}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								description: value,
							}))
						}
						placeholder="Description"
					/>

					<ParameterInformationField
						value={newParameterData.information}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								information: value,
							}))
						}
						placeholder="Information"
					/>

					<ParameterProvidedByField
						value={newParameterData.user_interface.type}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								user_interface: {
									...prev.user_interface,
									type: value as "input" | "static" | "not_viewable",
								},
							}))
						}
					/>

					<ParameterOutputField
						value={newParameterData.output}
						onChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								output: value,
							}))
						}
					/>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onCancelParameter}>
						Cancel
					</Button>
					<Button 
						onClick={onSaveParameter}
						disabled={
							!newParameterData.name.trim() ||
							!newParameterData.unit.trim() ||
							(newParameterData.user_interface.type === "static" &&
								((newParameterData.display_type === "simple" && !newParameterData.value.trim()) ||
								 (newParameterData.display_type === "range" && (!newParameterData.range_min.trim() || !newParameterData.range_max.trim())) ||
								 (newParameterData.display_type === "dropdown" && newParameterData.dropdown_options.length === 0) ||
								 (newParameterData.display_type === "filter" && newParameterData.dropdown_options.length === 0)))
						}
					>
						Add Parameter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/**
 * ParameterFormField component - Generic form field wrapper
 */
function ParameterFormField({ label, required, children }: ParameterFormFieldProps) {
	return (
		<div className="grid grid-cols-4 items-center gap-4">
			<Label className="text-right">
				{label} {required && "*"}
			</Label>
			<div className="col-span-3">
				{children}
			</div>
		</div>
	);
}

/**
 * ParameterNameField component - Parameter name input field
 */
function ParameterNameField({ value, onChange, placeholder }: ParameterNameFieldProps) {
	return (
		<ParameterFormField label="Name" required>
			<Input
				id="parameter-name"
				value={value}
				onChange={(e) => {
					const originalValue = e.target.value;
					const filteredValue = originalValue.replace(/[()+=\-*/]/g, '');
					
					if (originalValue !== filteredValue) {
						toast.error("Characters ()+-*/ are not allowed in parameter names");
					}
					
					onChange(filteredValue);
				}}
				placeholder={placeholder}
			/>
		</ParameterFormField>
	);
}

/**
 * ParameterCategoryField component - Parameter category selection
 */
function ParameterCategoryField({ value, onChange, getAllAvailableCategories, getCategoryBadgeStyle }: ParameterCategoryFieldProps) {
	return (
		<ParameterFormField label="Category" required>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger>
					<SelectValue placeholder="Select category" />
				</SelectTrigger>
				<SelectContent>
					{getAllAvailableCategories().length > 0 ? (
						getAllAvailableCategories().map((category) => (
							<SelectItem
								key={category.name}
								value={category.name}
							>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="text-xs"
										style={getCategoryBadgeStyle(category.name)}
									>
										{category.name}
									</Badge>
								</div>
							</SelectItem>
						))
					) : (
						<div className="px-2 py-1.5 text-xs text-muted-foreground">
							No categories available.
						</div>
					)}
				</SelectContent>
			</Select>
		</ParameterFormField>
	);
}

/**
 * ParameterDisplayTypeField component - Display type selection
 */
function ParameterDisplayTypeField({ value, onChange }: ParameterDisplayTypeFieldProps) {
	return (
		<ParameterFormField label="Display Type">
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger>
					<SelectValue>
						{value || "Select type"}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="simple">Simple</SelectItem>
					<SelectItem value="dropdown">Dropdown</SelectItem>
					<SelectItem value="range">Range</SelectItem>
					<SelectItem value="filter">Filter</SelectItem>
				</SelectContent>
			</Select>
		</ParameterFormField>
	);
}

/**
 * ParameterValueField component - Value input based on display type
 */
function ParameterValueField({
	displayType,
	value,
	onChange,
	dropdownOptions,
	onDropdownOptionsChange,
	rangeMin,
	rangeMax,
	onRangeMinChange,
	onRangeMaxChange,
	userInterfaceType,
}: ParameterValueFieldProps) {
	return (
		<ParameterFormField label="Value">
			{displayType === "dropdown" ? (
				<DropdownOptionsEditor
					options={dropdownOptions}
					onOptionsChange={onDropdownOptionsChange}
					isEditing={true}
				/>
			) : displayType === "range" ? (
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Input
							value={rangeMin}
							onChange={(e) => onRangeMinChange(e.target.value)}
							placeholder="Min"
							type="number"
							step="any"
						/>
						<span className="text-xs text-muted-foreground">to</span>
						<Input
							value={rangeMax}
							onChange={(e) => onRangeMaxChange(e.target.value)}
							placeholder="Max"
							type="number"
							step="any"
						/>
					</div>
				</div>
			) : displayType === "filter" ? (
				<FilterOptionsEditor
					options={dropdownOptions.map(opt => opt.value)}
					onOptionsChange={(options) =>
						onDropdownOptionsChange(options.map(opt => ({ key: "", value: opt })))
					}
					isEditing={true}
				/>
			) : (
				<Input
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={
						userInterfaceType === "static"
							? "Value *"
							: "Value (optional)"
					}
					type="number"
				/>
			)}
		</ParameterFormField>
	);
}

/**
 * ParameterTestValueField component - Test value input
 */
function ParameterTestValueField({ value, onChange }: ParameterTestValueFieldProps) {
	return (
		<ParameterFormField label="Test Value">
			<Input
				id="parameter-test-value"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Test Value"
				type="number"
			/>
		</ParameterFormField>
	);
}

/**
 * ParameterUnitField component - Unit input
 */
function ParameterUnitField({ value, onChange, placeholder }: ParameterUnitFieldProps) {
	return (
		<ParameterFormField label="Unit" required>
			<Input
				id="parameter-unit"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
			/>
		</ParameterFormField>
	);
}

/**
 * ParameterDescriptionField component - Description input
 */
function ParameterDescriptionField({ value, onChange, placeholder }: ParameterDescriptionFieldProps) {
	return (
		<ParameterFormField label="Description">
			<Input
				id="parameter-description"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
			/>
		</ParameterFormField>
	);
}

/**
 * ParameterInformationField component - Information input
 */
function ParameterInformationField({ value, onChange, placeholder }: ParameterInformationFieldProps) {
	return (
		<ParameterFormField label="Information">
			<Input
				id="parameter-information"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
			/>
		</ParameterFormField>
	);
}

/**
 * ParameterProvidedByField component - Provided by selection
 */
function ParameterProvidedByField({ value, onChange }: ParameterProvidedByFieldProps) {
	return (
		<ParameterFormField label="Provided By">
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger>
					<SelectValue>
						{value || "Select provider"}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="input">User Input</SelectItem>
					<SelectItem value="static">Static Value</SelectItem>
					<SelectItem value="not_viewable">Not Viewable</SelectItem>
				</SelectContent>
			</Select>
		</ParameterFormField>
	);
}

/**
 * ParameterOutputField component - Output selection
 */
function ParameterOutputField({ value, onChange }: ParameterOutputFieldProps) {
	return (
		<ParameterFormField label="Output">
			<Select
				value={value ? "true" : "false"}
				onValueChange={(val) => onChange(val === "true")}
			>
				<SelectTrigger>
					<SelectValue>
						{value ? "True" : "False"}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="true">True</SelectItem>
					<SelectItem value="false">False</SelectItem>
				</SelectContent>
			</Select>
		</ParameterFormField>
	);
}

/**
 * FilterOptionsEditor component - Editor for filter options
 */
export function FilterOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: FilterOptionsEditorProps) {
	const addOption = () => {
		onOptionsChange([...options, ""]);
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options];
		newOptions[index] = value;
		onOptionsChange(newOptions);
	};

	const removeOption = (index: number) => {
		onOptionsChange(options.filter((_, i) => i !== index));
	};

	if (!isEditing) {
		return (
			<div className="text-xs text-muted-foreground">
				{options.length > 0 ? (
					<div className="space-y-1">
						{options.map((option, index) => (
							<div key={index} className="flex items-center gap-1">
								<span>{option}</span>
							</div>
						))}
					</div>
				) : (
					<span>No filter options defined</span>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{options.map((option, index) => (
				<div key={index} className="flex items-center gap-1">
					<Input
						value={option}
						onChange={(e) => updateOption(index, e.target.value)}
						className="h-6 text-xs w-24"
						placeholder="UK, USA, UAE"
					/>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => removeOption(index)}
						className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			))}
			<Button
				size="sm"
				variant="outline"
				onClick={addOption}
				className="h-6 text-xs"
			>
				<Plus className="h-3 w-3 mr-1" />
				Add Filter Option
			</Button>
		</div>
	);
}

/**
 * DropdownOptionsEditor component - Editor for dropdown options
 */
export function DropdownOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: DropdownOptionsEditorProps) {
	const addOption = () => {
		onOptionsChange([...options, { key: "", value: "" }]);
	};

	const updateOption = (index: number, field: "key" | "value", value: string) => {
		const newOptions = [...options];
		newOptions[index] = { ...newOptions[index], [field]: value };
		onOptionsChange(newOptions);
	};

	const removeOption = (index: number) => {
		onOptionsChange(options.filter((_, i) => i !== index));
	};

	if (!isEditing) {
		return (
			<div className="text-xs text-muted-foreground">
				{options.length > 0 ? (
					<div className="space-y-1">
						{options.map((option, index) => (
							<div key={index} className="flex items-center gap-1">
								<span className="font-medium">{option.key}:</span>
								<span>{option.value}</span>
							</div>
						))}
					</div>
				) : (
					<span>No options defined</span>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{options.map((option, index) => (
				<div key={index} className="flex items-center gap-1">
					<Input
						value={option.key}
						onChange={(e) => updateOption(index, "key", e.target.value)}
						className="h-6 text-xs w-20"
						placeholder="Location"
					/>
					<span className="text-xs">:</span>
					<Input
						value={option.value}
						onChange={(e) => updateOption(index, "value", e.target.value)}
						className="h-6 text-xs w-24"
						placeholder="UK, UAE, USA, Singapore"
					/>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => removeOption(index)}
						className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			))}
			<Button
				size="sm"
				variant="outline"
				onClick={addOption}
				className="h-6 text-xs"
			>
				<Plus className="h-3 w-3 mr-1" />
				Add Option
			</Button>
		</div>
	);
} 