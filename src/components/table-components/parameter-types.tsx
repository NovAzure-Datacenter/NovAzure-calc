import { Parameter } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Download } from "lucide-react";
import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

/**
 * ConditionalRulesEditor component - Manages conditional rules for parameters
 */
export function ConditionalRulesEditor({
	rules,
	onRulesChange,
	isEditing,
	filteredParameters,
}: {
	rules: Array<{ condition: string; value: string }>;
	onRulesChange: (rules: Array<{ condition: string; value: string }>) => void;
	isEditing: boolean;
	filteredParameters: Parameter[];
}) {
	const [selectedFilterId, setSelectedFilterId] = React.useState<string>("");
	const [showFilterSelector, setShowFilterSelector] =
		React.useState<boolean>(false);

	const addRule = () => {
		onRulesChange([...rules, { condition: "", value: "" }]);
	};

	const updateRule = (
		index: number,
		field: "condition" | "value",
		value: string
	) => {
		const newRules = [...rules];
		newRules[index] = { ...newRules[index], [field]: value };
		onRulesChange(newRules);
	};

	const removeRule = (index: number) => {
		onRulesChange(rules.filter((_, i) => i !== index));
	};

	const loadFromFilter = () => {
		const filterParameters = filteredParameters.filter(
			(param) =>
				param.display_type === "filter" &&
				param.dropdown_options &&
				param.dropdown_options.length > 0
		);

		if (filterParameters.length === 0) {
			return;
		}

		if (!selectedFilterId) {
			setShowFilterSelector(true);
			return;
		}

		const selectedFilter = filterParameters.find(
			(param) => param.id === selectedFilterId
		);
		if (!selectedFilter) {
			return;
		}

		const filterValues =
			selectedFilter.dropdown_options?.map((opt: any) => opt.value) || [];

		const newRules = filterValues.map((value) => ({
			condition: value,
			value: "",
		}));

		onRulesChange(newRules);
		setShowFilterSelector(false);
		setSelectedFilterId("");
	};

	const handleFilterSelection = (filterId: string) => {
		setSelectedFilterId(filterId);
		loadFromFilter();
	};

	if (!isEditing) {
		return (
			<div className="text-xs text-muted-foreground">
				{rules.length > 0 ? (
					<div className="space-y-1">
						{rules.map((rule, index) => (
							<div key={index} className="flex items-center gap-1">
								<span className="font-medium">If {rule.condition}:</span>
								<span>{rule.value}</span>
							</div>
						))}
					</div>
				) : (
					<span>No conditional rules defined</span>
				)}
			</div>
		);
	}

	const availableFilters = filteredParameters.filter(
		(param) =>
			param.display_type === "filter" &&
			param.dropdown_options &&
			param.dropdown_options.length > 0
	);

	return (
		<div className="space-y-2">
			{rules.map((rule, index) => (
				<div key={index} className="flex items-center gap-1">
					<Input
						value={rule.condition}
						onChange={(e) => updateRule(index, "condition", e.target.value)}
						className="h-6 text-xs w-24"
						placeholder="x > 10"
					/>
					<span className="text-xs">→</span>
					<Input
						value={rule.value}
						onChange={(e) => updateRule(index, "value", e.target.value)}
						className="h-6 text-xs w-20"
						placeholder="Result"
					/>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => removeRule(index)}
						className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			))}
			<div className="space-y-2">
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						onClick={addRule}
						className="h-6 text-xs"
					>
						<Plus className="h-3 w-3 mr-1" />
						Add Conditional Rule
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => {
							loadFromFilter();
						}}
						className="h-6 text-xs"
						disabled={availableFilters.length === 0}
						style={{ 
							opacity: availableFilters.length === 0 ? 0.5 : 1,
							pointerEvents: availableFilters.length === 0 ? 'none' : 'auto'
						}}
					>
						<Download className="h-3 w-3 mr-1" />
						Load from Filter ({availableFilters.length})
					</Button>
				</div>
				
				{/* Enhanced Filter Selector */}
				{showFilterSelector && (
					<div className="border rounded-md p-3 bg-muted/50 w-full">
						<div className="flex items-center justify-between mb-2">
							<p className="text-xs font-medium">
								Select a filter to load from:
							</p>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => {
									setShowFilterSelector(false);
								}}
								className="h-5 w-5 p-0"
							>
								<X className="h-3 w-3" />
							</Button>
						</div>
						
						{availableFilters.length > 0 ? (
							<div className="space-y-1 max-h-32 overflow-y-auto">
								{availableFilters.map((filter) => (
									<Button
										key={filter.id}
										size="sm"
										variant="ghost"
										onClick={() => handleFilterSelection(filter.id)}
										className="h-7 text-xs w-full justify-start text-left border-border border hover:bg-accent"
									>
										<div className="flex items-center w-full gap-2">
											<span className="truncate flex-1 text-left font-medium">
												{filter.name}
											</span>
											<span className="text-muted-foreground text-xs whitespace-nowrap">
												{filter.dropdown_options?.length || 0} options
											</span>
										</div>
									</Button>
								))}
							</div>
						) : (
							<div className="text-xs text-muted-foreground p-2">
								No filter parameters available. Create a filter parameter first.
							</div>
						)}
						
						{/* Alternative: Direct Filter Selection */}
						{availableFilters.length === 0 && (
							<div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
								<p className="font-medium text-yellow-800 mb-1">No filters found</p>
								<p className="text-yellow-700">
									To use filters in conditional rules, first create parameters with display type "filter".
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * FilterOptionsEditor component - Manages filter options for parameters
 */
export function FilterOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: {
	options: string[];
	onOptionsChange: (options: string[]) => void;
	isEditing: boolean;
}) {
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
 * DropdownOptionsEditor component - Manages dropdown options for parameters
 */
export function DropdownOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: {
	options: Array<{ key: string; value: string }>;
	onOptionsChange: (options: Array<{ key: string; value: string }>) => void;
	isEditing: boolean;
}) {
	const addOption = () => {
		onOptionsChange([...options, { key: "", value: "" }]);
	};

	const updateOption = (
		index: number,
		field: "key" | "value",
		value: string
	) => {
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

/**
 * SimpleInputEditor component - Manages simple input for parameters
 */
export function SimpleInputEditor({
	value,
	onValueChange,
	placeholder,
	handleSave,
	handleCancel,
}: {
	value: string;
	onValueChange: (value: string) => void;
	placeholder: string;
	handleSave?: () => void;
	handleCancel?: () => void;
}) {
	return (
		<Input
			value={value}
			onChange={(e) => onValueChange(e.target.value)}
			className="h-7 text-xs"
			placeholder={placeholder}
			type="number"
			onKeyDown={(e) => {
				if (e.key === "Enter" && handleSave) {
					handleSave();
				} else if (e.key === "Escape" && handleCancel) {
					handleCancel();
				}
			}}
		/>
	);
}

/**
 * RangeInputEditor component - Manages range input for parameters
 */
export function RangeInputEditor({
	rangeMin,
	rangeMax,
	onRangeChange,
}: {
	rangeMin: string;
	rangeMax: string;
	onRangeChange: (field: "range_min" | "range_max", value: string) => void;
}) {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Input
					value={rangeMin}
					onChange={(e) => onRangeChange("range_min", e.target.value)}
					className="h-7 text-xs"
					placeholder="Min"
					type="number"
					step="any"
				/>
				<span className="text-xs text-muted-foreground">to</span>
				<Input
					value={rangeMax}
					onChange={(e) => onRangeChange("range_max", e.target.value)}
					className="h-7 text-xs"
					placeholder="Max"
					type="number"
					step="any"
				/>
			</div>
		</div>
	);
}

/**
 * Gets the badge styling for display types
 */
export function getDisplayTypeBadgeStyle(displayType: string) {
	switch (displayType) {
		case "simple":
			return {
				backgroundColor: "#f0f9ff",
				color: "#1e40af",
				borderColor: "#3b82f6",
			};
		case "dropdown":
			return {
				backgroundColor: "#fef3c7",
				color: "#92400e",
				borderColor: "#f59e0b",
			};
		case "range":
			return {
				backgroundColor: "#f0fdf4",
				color: "#166534",
				borderColor: "#22c55e",
			};
		case "filter":
			return {
				backgroundColor: "#fdf2f8",
				color: "#be185d",
				borderColor: "#ec4899",
			};
		case "conditional":
			return {
				backgroundColor: "#fef7ff",
				color: "#7c3aed",
				borderColor: "#a855f7",
			};
		default:
			return {
				backgroundColor: "#f3f4f6",
				color: "#374151",
				borderColor: "#d1d5db",
			};
	}
}

/**
 * Returns color styling for user interface badges based on type
 */
export function getUserInterfaceBadgeStyle(userInterface: string) {
	switch (userInterface) {
		case "input":
			return {
				backgroundColor: "#dbeafe",
				color: "#1e40af",
				borderColor: "#3b82f6",
			};
		case "static":
			return {
				backgroundColor: "#fef3c7",
				color: "#92400e",
				borderColor: "#f59e0b",
			};
		case "not_viewable":
			return {
				backgroundColor: "#f3f4f6",
				color: "#6b7280",
				borderColor: "#d1d5db",
			};
		default:
			return {
				backgroundColor: "#f3f4f6",
				color: "#6b7280",
				borderColor: "#d1d5db",
			};
	}
}

/**
 * Renders the appropriate viewer component based on display type when viewing
 */
export function renderDisplayTypeViewer(
	displayType: string,
	parameter: any,
	highlightSearchTerm: (text: string, searchTerm: string) => any,
	searchQuery: string
) {
	switch (displayType) {
		case "dropdown":
			return parameter.dropdown_options &&
				parameter.dropdown_options.length > 0 ? (
				<div className="space-y-1">
					{parameter.dropdown_options.map((option: any, index: any) => (
						<div key={index} className="flex items-center gap-1">
							<span className="font-medium">{option.key}:</span>
							<span>{option.value}</span>
						</div>
					))}
				</div>
			) : (
				<span>No options defined</span>
			);
		case "range":
			return (
				<div className="space-y-1">
					<div className="flex items-center gap-1">
						<span className="font-medium">Min:</span>
						<span>{parameter.range_min || "Not set"}</span>
					</div>
					<div className="flex items-center gap-1">
						<span className="font-medium">Max:</span>
						<span>{parameter.range_max || "Not set"}</span>
					</div>
				</div>
			);
		case "filter":
			return parameter.dropdown_options &&
				parameter.dropdown_options.length > 0 ? (
				<div className="space-y-1">
					{parameter.dropdown_options.map((option: any, index: any) => (
						<div key={index} className="flex items-center gap-1">
							<span>{option.value}</span>
						</div>
					))}
				</div>
			) : (
				<span>No filter options defined</span>
			);
		case "conditional":
			return parameter.conditional_rules &&
				parameter.conditional_rules.length > 0 ? (
				<div className="space-y-1">
					{parameter.conditional_rules.map((rule: any, index: any) => (
						<div key={index} className="flex items-center gap-1 text-xs">
							<span className="font-medium">If {rule.condition}:</span>
							<span>{rule.value}</span>
						</div>
					))}
				</div>
			) : (
				<span>No conditional rules defined</span>
			);
		case "simple":
		default:
			return highlightSearchTerm(parameter.value, searchQuery);
	}
}

/**
 * Renders the appropriate editor component based on display type when editing
 */
export function renderDisplayTypeEditor(
	displayType: string,
	data: any,
	setData: (updater: (prev: any) => any) => void,
	filteredParameters: Parameter[] = [],
	handleSave?: () => void,
	handleCancel?: () => void
) {
	switch (displayType) {
		case "dropdown":
			return (
				<DropdownOptionsEditor
					options={data.dropdown_options}
					onOptionsChange={(options) =>
						setData((prev: any) => ({
							...prev,
							dropdown_options: options,
						}))
					}
					isEditing={true}
				/>
			);
		case "range":
			return (
				<RangeInputEditor
					rangeMin={data.range_min}
					rangeMax={data.range_max}
					onRangeChange={(field, value) =>
						setData((prev: any) => ({
							...prev,
							[field]: value,
						}))
					}
				/>
			);
		case "filter":
			return (
				<FilterOptionsEditor
					options={data.dropdown_options.map((opt: any) => opt.value)}
					onOptionsChange={(options) =>
						setData((prev: any) => ({
							...prev,
							dropdown_options: options.map((opt: any) => ({
								key: "",
								value: opt,
							})),
						}))
					}
					isEditing={true}
				/>
			);
		case "conditional":
			return (
				<ConditionalRulesEditor
					rules={data.conditional_rules || []}
					onRulesChange={(rules) =>
						setData((prev: any) => ({
							...prev,
							conditional_rules: rules,
						}))
					}
					isEditing={true}
					filteredParameters={filteredParameters}
				/>
			);
		case "simple":
		default:
			return (
				<SimpleInputEditor
					value={data.value}
					onValueChange={(value) =>
						setData((prev: any) => ({
							...prev,
							value: value,
						}))
					}
					placeholder={
						data.user_interface?.type === "static"
							? "Value *"
							: "Value (optional)"
					}
					handleSave={handleSave}
					handleCancel={handleCancel}
				/>
			);
	}
}
