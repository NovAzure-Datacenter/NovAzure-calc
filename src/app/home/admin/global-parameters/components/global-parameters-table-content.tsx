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
import { Edit, Info, Save, X, Plus, Trash } from "lucide-react";
import {
	getCategoryBadgeStyle,
	getCategoryBadgeStyleForDropdown,
} from "@/app/home/product-and-solutions/solutions/create/components/create-solution-parameters/color-utils";

export default function GlobalParametersTableContent({
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
}: {
	filteredParameters: Parameter[];
	editingParameter: string | null;
	editData: {
		name: string;
		value: string;
		test_value: string;
		unit: string;
		description: string;
		category: string;
		is_modifiable: boolean;
	};
	setEditData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			test_value: string;
			unit: string;
			description: string;
			category: string;
			is_modifiable: boolean;
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
		category: string;
		is_modifiable: boolean;
	};
	setNewParameterData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: string;
			test_value: string;
			unit: string;
			description: string;
			category: string;
			is_modifiable: boolean;
		}>
	>;
	handleSaveNewParameter: () => void;
	handleCancelAddParameter: () => void;
	handleAddParameter: () => void;
	customCategories: Array<{ name: string; color: string }>;
	searchQuery: string;
	parameters: Parameter[];
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
								<TableHead className="w-20 bg-background">Modifiable</TableHead>
								<TableHead className="bg-background">Description</TableHead>
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
												{customCategories.length > 0 ? (
													customCategories.map((category) => (
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
										<Input
											value={newParameterData.value}
											onChange={(e) =>
												setNewParameterData((prev) => ({
													...prev,
													value: e.target.value,
												}))
											}
											className="h-7 text-xs"
											placeholder="Value *"
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
										<input 
											type="checkbox" 
											checked={newParameterData.is_modifiable}
											onChange={(e) => setNewParameterData(prev => ({
												...prev,
												is_modifiable: e.target.checked
											}))}
											className="h-4 w-4"
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
										<div className="flex items-center gap-1">
											<Button
												size="sm"
												variant="ghost"
												onClick={handleSaveNewParameter}
												className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
												disabled={
													!newParameterData.name.trim() ||
													!newParameterData.unit.trim() ||
													!newParameterData.value.trim()
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
									<TableCell colSpan={8} className="text-center py-8">
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
															{customCategories.length > 0 ? (
																customCategories.map((category) => (
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
													<Input
														value={editData.value}
														onChange={(e) =>
															setEditData((prev) => ({
																...prev,
																value: e.target.value,
															}))
														}
														className="h-7 text-xs"
														placeholder="Value *"
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
														{highlightSearchTerm(parameter.value, searchQuery)}
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
													<div className="flex items-center justify-center">
														<input 
															type="checkbox" 
															checked={editData.is_modifiable}
															onChange={(e) => setEditData(prev => ({
																...prev,
																is_modifiable: e.target.checked
															}))}
															className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
														/>
													</div>
												) : (
													<div className="flex items-center justify-center">
														<span className={`text-xs px-2 py-1 rounded-full ${
															parameter.is_modifiable 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-600"
														}`}>
															{parameter.is_modifiable ? "Yes" : "No"}
														</span>
													</div>
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
												<div className="flex items-center gap-1">
													{!isEditing ? (
														<>
															<Button
																size="sm"
																variant="ghost"
																onClick={() => handleEditParameter(parameter)}
																className="h-5 w-5 p-0"
																disabled={
																	editingParameter !== null || isAddingParameter
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
																	!editData.value.trim()
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
							{!isAddingParameter && (
								<TableRow className="border-t-2">
									<TableCell
										colSpan={8}
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