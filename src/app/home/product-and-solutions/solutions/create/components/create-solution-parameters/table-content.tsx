import { Parameter } from "@/app/home/product-and-solutions/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Info, Save, X, Plus, Trash, Lock } from "lucide-react";
import {
	getCategoryBadgeStyle,
	getCategoryBadgeStyleForDropdown,
} from "./color-utils";

// DropdownOptionsEditor component
function DropdownOptionsEditor({
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

export default function TableContent({
	filteredParameters,
	editingParameter,
	editData,
	setEditData,
	handleEditParameter,
	handleSaveParameter,
	handleCancelEdit,
	handleDeleteParameter,
	getLevelColor,
	getCategoryColor,
	isAddingParameter,
	newParameterData,
	setNewParameterData,
	handleSaveNewParameter,
	handleCancelAddParameter,
	handleAddParameter,
	customCategories,
	searchQuery,
	parameters,
	activeTab,
}: {
	filteredParameters: Parameter[];
	editingParameter: string | null;
	editData: {
		name: string;
		value: string;
		test_value: string;
		unit: string;
		description: string;
		information: string;
		category: string;
		provided_by: string;
		input_type: string;
		output: boolean;
		display_type: "simple" | "dropdown" | "range";
		dropdown_options: Array<{ key: string; value: string }>;
		range_min: string;
		range_max: string;
	};
	setEditData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			test_value: string;
			unit: string;
			description: string;
			information: string;
			category: string;
			provided_by: string;
			input_type: string;
			output: boolean;
			display_type: "simple" | "dropdown" | "range";
			dropdown_options: Array<{ key: string; value: string }>;
			range_min: string;
			range_max: string;
		}>
	>;
	handleEditParameter: (parameter: Parameter) => void;
	handleSaveParameter: (parameterId: string) => void;
	handleCancelEdit: () => void;
	handleDeleteParameter: (parameterId: string) => void;
	getLevelColor: (level: string) => string;
	getCategoryColor: (category: string) => string;
	isAddingParameter: boolean;
	newParameterData: {
		name: string;
		value: string;
		test_value: string;
		unit: string;
		description: string;
		information: string;
		category: string;
		provided_by: string;
		input_type: string;
		output: boolean;
		display_type: "simple" | "dropdown" | "range";
		dropdown_options: Array<{ key: string; value: string }>;
		range_min: string;
		range_max: string;
	};
	setNewParameterData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			test_value: string;
			unit: string;
			description: string;
			information: string;
			category: string;
			provided_by: string;
			input_type: string;
			output: boolean;
			display_type: "simple" | "dropdown" | "range";
			dropdown_options: Array<{ key: string; value: string }>;
			range_min: string;
			range_max: string;
		}>
	>;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	handleAddParameter: () => void;
	customCategories: Array<{ name: string; color: string }>;
	searchQuery: string;
	parameters: Parameter[];
	activeTab: string;
}) {
	// Wrapper functions to match the expected signatures
	const getCategoryBadgeStyleWrapper = (categoryName: string) => {
		return getCategoryBadgeStyle(categoryName, parameters, customCategories);
	};

	const getCategoryBadgeStyleForDropdownWrapper = (categoryName: string) => {
		return getCategoryBadgeStyleForDropdown(
			categoryName,
			parameters,
			customCategories
		);
	};

	// Function to highlight search terms
	const highlightSearchTerm = (text: string, searchTerm: string) => {
		if (!searchTerm.trim()) return text;

		const regex = new RegExp(`(${searchTerm})`, "gi");
		const parts = text.split(regex);

		return parts.map((part, index) =>
			regex.test(part) ? (
				<mark
					key={index}
					className="bg-yellow-200 text-yellow-900 px-0.5 rounded"
				>
					{part}
				</mark>
			) : (
				part
			)
		);
	};

	// Function to get all available categories including configuration categories
	const getAllAvailableCategories = () => {
		const configurationCategories = [
			{ name: "High Level Configuration", color: "blue" },
			{ name: "Low Level Configuration", color: "green" },
			{ name: "Advanced Configuration", color: "purple" }
		];
		return [...configurationCategories, ...customCategories];
	};

	return (
		<div className="border rounded-lg">
			<div className="max-h-[55vh] overflow-y-auto ">
				<TooltipProvider>
					<Table>
						<TableHeader className="sticky top-0 bg-background z-10">
							<TableRow>
								<TableHead className="w-48 bg-background">
									Parameter Name
								</TableHead>
								<TableHead className="w-32 bg-background">Category</TableHead>
								<TableHead className="w-32 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Display Type
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												How the value is displayed in the calculator
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												• <strong>Simple:</strong> Text input field
												<br />• <strong>Dropdown:</strong> Select from predefined options
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-32 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Value
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												The numerical value for this parameter
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-32 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Test Value
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												A test value used for validation and testing purposes
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-20 bg-background">Unit</TableHead>
								<TableHead className="bg-background">Description</TableHead>
								<TableHead className="bg-background">Information</TableHead>
								<TableHead className="w-32 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Provided By
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												Who provides this value during the value calculator
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												• <strong>User:</strong> Client provides during
												calculation
												<br />• <strong>Company:</strong> Pre-loaded by company
												<br />• <strong>Global:</strong> System-managed
												(read-only)
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-32 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Input Type
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												Where this parameter appears in the value calculator
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												• <strong>Simple:</strong> Basic section
												<br />• <strong>Advanced:</strong> Advanced section
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-24 bg-background">
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-1 cursor-help">
												Output
												<Info className="h-3 w-3 text-muted-foreground" />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												Whether this parameter is visible during the value
												calculator
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												• <strong>True:</strong> Visible to client
												<br />• <strong>False:</strong> Hidden from client
											</p>
										</TooltipContent>
									</Tooltip>
								</TableHead>
								<TableHead className="w-24 bg-background">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isAddingParameter && (
								<TableRow className="bg-green-50 border-2 border-green-200 shadow-md">
									<TableCell className="py-2">
										<div className="flex items-center gap-2">
											<Input
												value={newParameterData.name}
												onChange={(e) =>
													setNewParameterData((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												className="h-7 text-xs"
												placeholder="Parameter name"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSaveNewParameter();
													} else if (e.key === "Escape") {
														handleCancelAddParameter();
													}
												}}
											/>
										</div>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.category}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													category: value,
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{/* Show configuration categories and custom categories */}
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
																	style={getCategoryBadgeStyleForDropdownWrapper(
																		category.name
																	)}
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
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.display_type}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													display_type: value as "simple" | "dropdown" | "range",
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue>
													{newParameterData.display_type || "Select type"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="simple">Simple</SelectItem>
												<SelectItem value="dropdown">Dropdown</SelectItem>
												<SelectItem value="range">Range</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										{newParameterData.display_type === "dropdown" ? (
											<DropdownOptionsEditor
												options={newParameterData.dropdown_options}
												onOptionsChange={(options) =>
													setNewParameterData((prev) => ({
														...prev,
														dropdown_options: options,
													}))
												}
												isEditing={true}
											/>
										) : newParameterData.display_type === "range" ? (
											<div className="space-y-2">
												<div className="flex items-center gap-2">
													<Input
														value={newParameterData.range_min}
														onChange={(e) =>
															setNewParameterData((prev) => ({
																...prev,
																range_min: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Min"
														type="number"
														step="any"
													/>
													<span className="text-xs text-muted-foreground">to</span>
													<Input
														value={newParameterData.range_max}
														onChange={(e) =>
															setNewParameterData((prev) => ({
																...prev,
																range_max: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Max"
														type="number"
														step="any"
													/>
												</div>
											</div>
										) : (
											<Input
												value={newParameterData.value}
												onChange={(e) =>
													setNewParameterData((prev) => ({
														...prev,
														value: e.target.value,
													}))
												}
												className="h-7 text-xs"
												placeholder={
													newParameterData.provided_by === "company"
														? "Value *"
														: "Value (optional)"
												}
												type="number"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSaveNewParameter();
													} else if (e.key === "Escape") {
														handleCancelAddParameter();
													}
												}}
											/>
										)}
									</TableCell>
									<TableCell className="py-2">
										<Input
											value={newParameterData.test_value}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													test_value: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Test Value"
											type="number"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleSaveNewParameter();
												} else if (e.key === "Escape") {
													handleCancelAddParameter();
												}
											}}
										/>
									</TableCell>
									<TableCell className="py-2">
										<Input
											value={newParameterData.unit}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													unit: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Unit"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleSaveNewParameter();
												} else if (e.key === "Escape") {
													handleCancelAddParameter();
												}
											}}
										/>
									</TableCell>
									<TableCell className="py-2">
										<Input
											value={newParameterData.description}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													description: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Description"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleSaveNewParameter();
												} else if (e.key === "Escape") {
													handleCancelAddParameter();
												}
											}}
										/>
									</TableCell>
									<TableCell className="py-2">
										<Input
											value={newParameterData.information}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													information: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Information"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleSaveNewParameter();
												} else if (e.key === "Escape") {
													handleCancelAddParameter();
												}
											}}
										/>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.provided_by}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													provided_by: value,
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue>
													{newParameterData.provided_by || "Select provider"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="user">User</SelectItem>
												<SelectItem value="company">Company</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.input_type}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													input_type: value,
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue>
													{newParameterData.input_type || "Select type"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="simple">Simple</SelectItem>
												<SelectItem value="advanced">Advanced</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2">
										<Select
											value={newParameterData.output ? "true" : "false"}
											onValueChange={(value) =>
												setNewParameterData((prev) => ({
													...prev,
													output: value === "true",
												}))
											}
										>
											<SelectTrigger className="h-7 text-xs">
												<SelectValue>
													{newParameterData.output ? "True" : "False"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="true">True</SelectItem>
												<SelectItem value="false">False</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
								
									<TableCell className="py-2">
										<div className="flex items-center gap-1">
											<Button
												size="sm"
												variant="ghost"
												onClick={handleSaveNewParameter}
												className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
												disabled={
													!newParameterData.name.trim() ||
													!newParameterData.unit.trim() ||
													(newParameterData.provided_by === "company" &&
														!newParameterData.value.trim())
												}
											>
												<Save className="h-3 w-3" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={handleCancelAddParameter}
												className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							)}
							{filteredParameters.length === 0 && !isAddingParameter ? (
								<TableRow>
									<TableCell colSpan={12} className="text-center py-8">
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<Info className="h-8 w-8" />
											<p className="text-sm font-medium">No parameters found</p>
											<p className="text-xs">Add parameters to get started</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredParameters.map((parameter) => {
									const isEditing = editingParameter === parameter.id;
									const isGlobal = parameter.category.name === "Global";
									const isIndustry = parameter.category.name === "Industry";
									const isTechnology = parameter.category.name === "Technology" || parameter.category.name === "Technologies";
									const isReadOnly = isGlobal || isIndustry || isTechnology;

									return (
										<TableRow
											key={parameter.id}
											className={`transition-all duration-200 h-12 ${
												isEditing
													? "bg-blue-50 border-2 border-blue-200 shadow-md"
													: ""
											} ${
												(editingParameter && !isEditing) || isAddingParameter
													? "opacity-40 pointer-events-none"
													: ""
											}`}
										>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.name}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																name: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Parameter name"
													/>
												) : (
													<div className="flex items-center gap-2">
														<span className="font-medium text-sm">
															{highlightSearchTerm(parameter.name, searchQuery)}
														</span>
													</div>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Select
														value={editData.category}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																category: value,
															}))
														}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue placeholder="Select category" />
														</SelectTrigger>
														<SelectContent>
															{/* Show configuration categories and custom categories */}
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
																				style={getCategoryBadgeStyleForDropdownWrapper(
																					category.name
																				)}
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
												) : (
													<Badge
														variant="outline"
														className="text-xs"
														style={getCategoryBadgeStyleWrapper(
															parameter.category.name
														)}
													>
														{highlightSearchTerm(
															parameter.category.name,
															searchQuery
														)}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Select
														value={editData.display_type}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																display_type: value as "simple" | "dropdown" | "range",
															}))
														}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue>
																{editData.display_type || "Select type"}
															</SelectValue>
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="simple">Simple</SelectItem>
															<SelectItem value="dropdown">Dropdown</SelectItem>
															<SelectItem value="range">Range</SelectItem>
														</SelectContent>
													</Select>
												) : (
													<Badge variant="outline" className="text-xs">
														{isReadOnly ? "—" : highlightSearchTerm(
															parameter.display_type,
															searchQuery
														)}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													editData.display_type === "dropdown" ? (
														<DropdownOptionsEditor
															options={editData.dropdown_options}
															onOptionsChange={(options) =>
																setEditData((prev) => ({
																	...prev,
																	dropdown_options: options,
																}))
															}
															isEditing={true}
														/>
														
													) : editData.display_type === "range" ? (
														<div className="space-y-2">
															<div className="flex items-center gap-2">
																<Input
																	value={editData.range_min}
																	onChange={(e) =>
																		setEditData((prev) => ({
																			...prev,
																			range_min: e.target.value,
																		}))
																	}
																	className="h-7 text-xs"
																	placeholder="Min"
																	type="number"
																	step="any"
																/>
																<span className="text-xs text-muted-foreground">to</span>
																<Input
																	value={editData.range_max}
																	onChange={(e) =>
																		setEditData((prev) => ({
																			...prev,
																			range_max: e.target.value,
																		}))
																	}
																	className="h-7 text-xs"
																	placeholder="Max"
																	type="number"
																	step="any"
																/>
															</div>
														</div>
													) : (
														<Input
															value={editData.value}
															onChange={(e) =>
																setEditData((prev) => ({
																	...prev,
																	value: e.target.value,
																}))
															}
															className="h-7 text-xs"
															placeholder={
																editData.provided_by === "company"
																	? "Value *"
																	: "Value (optional)"
															}
															type="number"
															onKeyDown={(e) => {
																if (e.key === "Enter") {
																	handleSaveParameter(parameter.id);
																} else if (e.key === "Escape") {
																	handleCancelEdit();
																}
															}}
														/>
													)
												) : (
													<span className="text-xs text-muted-foreground">
														{parameter.display_type === "dropdown" ? (
															parameter.dropdown_options && parameter.dropdown_options.length > 0 ? (
																<div className="space-y-1">
																	{parameter.dropdown_options.map((option, index) => (
																		<div key={index} className="flex items-center gap-1">
																			<span className="font-medium">{option.key}:</span>
																			<span>{option.value}</span>
																		</div>
																	))}
																</div>
															) : (
																<span>No options defined</span>
															)
														) : parameter.display_type === "range" ? (
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
														) : (
															highlightSearchTerm(parameter.value, searchQuery)
														)}
													</span>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.test_value}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																test_value: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Test Value"
														type="number"
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																handleSaveParameter(parameter.id);
															} else if (e.key === "Escape") {
																handleCancelEdit();
															}
														}}
													/>
												) : (
													<span className="text-xs text-muted-foreground">
														{highlightSearchTerm(
															parameter.test_value,
															searchQuery
														)}
													</span>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.unit}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																unit: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Unit"
													/>
												) : (
													<span className="text-xs text-muted-foreground">
														{highlightSearchTerm(parameter.unit, searchQuery)}
													</span>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.description}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																description: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Description"
													/>
												) : (
													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground max-w-xs truncate">
															{highlightSearchTerm(
																parameter.description,
																searchQuery
															)}
														</span>
														<Tooltip>
															<TooltipTrigger asChild>
																<Info className="h-3 w-3 text-muted-foreground cursor-help" />
															</TooltipTrigger>
															<TooltipContent className="max-w-xs">
																<p className="text-sm">
																	{parameter.description}
																</p>
															</TooltipContent>
														</Tooltip>
													</div>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Input
														value={editData.information}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																information: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Information"
													/>
												) : (
													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground max-w-xs truncate">
															{highlightSearchTerm(
																parameter.information,
																searchQuery
															)}
														</span>
														<Tooltip>
															<TooltipTrigger asChild>
																<Info className="h-3 w-3 text-muted-foreground cursor-help" />
															</TooltipTrigger>
															<TooltipContent className="max-w-xs">
																<p className="text-sm">
																	{parameter.information}
																</p>
															</TooltipContent>
														</Tooltip>
													</div>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													parameter.provided_by === "global" ? (
														<span className="text-xs text-muted-foreground">
															Global (Not Editable)
														</span>
													) : (
														<Select
															value={editData.provided_by}
															onValueChange={(value) =>
																setEditData((prev) => ({
																	...prev,
																	provided_by: value,
																}))
															}
														>
															<SelectTrigger className="h-7 text-xs">
																<SelectValue>
																	{editData.provided_by || "Select provider"}
																</SelectValue>
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="user">User</SelectItem>
																<SelectItem value="company">Company</SelectItem>
															</SelectContent>
														</Select>
													)
												) : (
													<Badge variant="outline" className={`${isReadOnly ? "bg-blue-50 border-blue-200" : ""}`}>
														{isReadOnly ? (
															<span className=" text-blue-800 px-2 py-1 rounded text-xs">
																NovAzure
															</span>
														) : highlightSearchTerm(
															parameter.provided_by,
															searchQuery
														)}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Select
														value={editData.input_type}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																input_type: value,
															}))
														}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue>
																{editData.input_type || "Select type"}
															</SelectValue>
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="simple">Simple</SelectItem>
															<SelectItem value="advanced">Advanced</SelectItem>
														</SelectContent>
													</Select>
												) : (
													<Badge variant="outline" className="text-xs">
														{isReadOnly ? "—" : highlightSearchTerm(
															parameter.input_type,
															searchQuery
														)}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												{isEditing ? (
													<Select
														value={editData.output ? "true" : "false"}
														onValueChange={(value) =>
															setEditData((prev) => ({
																...prev,
																output: value === "true",
															}))
														}
													>
														<SelectTrigger className="h-7 text-xs">
															<SelectValue>
																{editData.output ? "True" : "False"}
															</SelectValue>
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="true">True</SelectItem>
															<SelectItem value="false">False</SelectItem>
														</SelectContent>
													</Select>
												) : (
													<Badge variant="outline" className="text-xs">
														{isReadOnly ? "—" : (parameter.output ? "True" : "False")}
													</Badge>
												)}
											</TableCell>
											<TableCell className="py-2">
												<div className="flex items-center gap-1">
													{!isEditing ? (
														<>
															{isReadOnly ? (
																<Tooltip>
																	<TooltipTrigger asChild>
																		<Lock className="h-3 w-3 text-muted-foreground cursor-help" />
																	</TooltipTrigger>
																	<TooltipContent>
																		<p className="text-sm">
																			{isGlobal 
																				? "Global parameter - read only"
																				: isIndustry 
																				? "Industry parameter - read only"
																				: "Technology parameter - read only"
																			}
																		</p>
																	</TooltipContent>
																</Tooltip>
															) : (
																<>
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() =>
																			handleEditParameter(parameter)
																		}
																		className="h-5 w-5 p-0"
																		disabled={
																			editingParameter !== null ||
																			isAddingParameter
																		}
																	>
																		<Edit className="h-3 w-3" />
																	</Button>
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() =>
																			handleDeleteParameter(parameter.id)
																		}
																		className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
																	>
																		<Trash className="h-3 w-3" />
																	</Button>
																</>
															)}
														</>
													) : (
														<>
															<Button
																size="sm"
																variant="ghost"
																onClick={() =>
																	handleSaveParameter(parameter.id)
																}
																className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
																disabled={
																	!editData.name.trim() ||
																	!editData.unit.trim() ||
																	(editData.provided_by === "company" &&
																		!editData.value.trim())
																}
															>
																<Save className="h-3 w-3" />
															</Button>
															<Button
																size="sm"
																variant="ghost"
																onClick={handleCancelEdit}
																className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
															>
																<X className="h-3 w-3" />
															</Button>
														</>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})
							)}
							{!isAddingParameter && activeTab !== "Global" && (
								<TableRow className="border-t-2">
									<TableCell
										colSpan={12}
										className="text-center bg-muted/50 cursor-pointer py-2"
										onClick={
											isAddingParameter
												? handleCancelAddParameter
												: handleAddParameter
										}
									>
										<div className="flex items-center gap-2 justify-center text-muted-foreground">
											<Plus className="h-3 w-3" />
											<span className="text-xs">Add Parameter </span>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TooltipProvider>
			</div>
		</div>
	);
}
