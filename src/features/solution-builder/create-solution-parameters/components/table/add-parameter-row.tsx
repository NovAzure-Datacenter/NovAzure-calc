"use client";

import { TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import type { AddParameterRowProps } from "@/features/solution-builder/types/types";
import { renderDisplayTypeEditor } from "@/components/table-components/parameter-types";
import { Badge } from "@/components/ui/badge";

export function AddParameterRow({
	newParameterData,
	setNewParameterData,
	handleSaveNewParameter,
	handleCancelAddParameter,
	getCategoryBadgeStyleForDropdownWrapper,
	getUserInterfaceBadgeStyle,
	getDisplayTypeBadgeStyle,
	columnVisibility,
	renderCell,
	usedParameterIds,
	parameters,
	categories,
}: AddParameterRowProps) {
	const CATEGORIES_TO_EXCLUDE = ["Use Case"];
	const availableCategories = categories.filter(
		(category) => !CATEGORIES_TO_EXCLUDE.includes(category.name)
	);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSaveNewParameter();
		else if (e.key === "Escape") handleCancelAddParameter();
	};

	const isSaveDisabled = () => {
		return (
			!newParameterData.name.trim() ||
			!newParameterData.unit.trim() ||
			!newParameterData.category.trim() ||
			(newParameterData.user_interface?.type === "static" &&
				((newParameterData.display_type === "simple" &&
					!newParameterData.value.trim()) ||
					(newParameterData.display_type === "range" &&
						(!newParameterData.range_min.trim() ||
							!newParameterData.range_max.trim())) ||
					(newParameterData.display_type === "dropdown" &&
						newParameterData.dropdown_options.length === 0) ||
					(newParameterData.display_type === "filter" &&
						newParameterData.dropdown_options.length === 0)))
		);
	};


	return (
		<TableRow className="bg-green-50 border-2 border-green-200 shadow-md">
			{renderCell(
				columnVisibility.parameterName,
				<div className="flex items-center gap-2">
					<Input
						value={newParameterData.name || ""}
						onChange={(e) => {
							const originalValue = e.target.value;
							const filteredValue = originalValue.replace(/[()+=\-*/]/g, "");
							if (originalValue !== filteredValue) {
								toast.error(
									"Characters ()+-*/ are not allowed in parameter names"
								);
							}
							setNewParameterData((prev) => ({ ...prev, name: filteredValue }));
						}}
						className="h-7 text-xs"
						placeholder="Parameter name"
						onKeyDown={handleKeyDown}
					/>
				</div>,
				"parameterName"
			)}

			{renderCell(
				columnVisibility.category,
				<Select
					value={newParameterData.category}
					onValueChange={(value) =>
						setNewParameterData((prev) => ({ ...prev, category: value }))
					}
				>
					<SelectTrigger className="h-7 text-xs">
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						{availableCategories.map((category) => (
							<SelectItem key={category.name} value={category.name}>
								<span
									style={getCategoryBadgeStyleForDropdownWrapper(category.name)}
								>
									{category.name}
								</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>,
				"category"
			)}

			{renderCell(
				columnVisibility.displayType,
				<Select
					value={newParameterData.display_type}
					onValueChange={(value) =>
						setNewParameterData((prev) => ({
							...prev,
							display_type: value as
								| "simple"
								| "dropdown"
								| "range"
								| "filter"
								| "conditional",
						}))
					}
				>
					<SelectTrigger className="h-7 text-xs">
						<SelectValue>
							<span
								style={getDisplayTypeBadgeStyle(newParameterData.display_type)}
							>
								{newParameterData.display_type || "Select type"}
							</span>
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="simple">Simple</SelectItem>
						<SelectItem value="dropdown">Dropdown</SelectItem>
						<SelectItem value="range">Range</SelectItem>
						<SelectItem value="filter">Filter</SelectItem>
						<SelectItem value="conditional">Conditional</SelectItem>
					</SelectContent>
				</Select>,
				"displayType"
			)}

			{renderCell(
				columnVisibility.value,
				renderDisplayTypeEditor(
					newParameterData.display_type,
					newParameterData,
					setNewParameterData,
					parameters || [],
					handleSaveNewParameter,
					handleCancelAddParameter
				),
				"value"
			)}

			{renderCell(
				columnVisibility.testValue,
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
					onKeyDown={handleKeyDown}
				/>,
				"testValue"
			)}

			{renderCell(
				columnVisibility.unit,
				<Input
					value={newParameterData.unit}
					onChange={(e) =>
						setNewParameterData((prev) => ({ ...prev, unit: e.target.value }))
					}
					className="h-7 text-xs"
					placeholder="Unit"
					onKeyDown={handleKeyDown}
				/>,
				"unit"
			)}

			{renderCell(
				columnVisibility.description,
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
					onKeyDown={handleKeyDown}
				/>,
				"description"
			)}

			{renderCell(
				columnVisibility.userInterface,
				<div className="space-y-2">
					{/* Headers row */}
					<div className="flex justify-between text-xs">
						<div className="text-center font-medium text-gray-600 flex-1">
							Type
						</div>
						<div className="text-center font-medium text-gray-600 flex-1">
							Modifiable
						</div>
						<div className="text-center font-medium text-gray-600 flex-1">
							Unified
						</div>
						<div className="text-center font-medium text-gray-600 flex-1">
							Output
						</div>
					</div>

					{/* Content row - Interactive */}
					<div className="flex justify-between text-xs">
						{/* First column: Simple/Advanced toggle */}
						<div className="flex justify-center flex-1">
							<button
								onClick={() =>
									setNewParameterData((prev) => ({
										...prev,
										user_interface: {
											...prev.user_interface,
											is_advanced: !prev.user_interface?.is_advanced,
										},
									}))
								}
								className="px-3 py-1 text-xs rounded-md border transition-colors cursor-pointer hover:bg-gray-50"
								style={{
									backgroundColor: newParameterData.user_interface?.is_advanced
										? "#fef3c7"
										: "#f0f9ff",
									color: newParameterData.user_interface?.is_advanced
										? "#92400e"
										: "#1e40af",
									borderColor: newParameterData.user_interface?.is_advanced
										? "#f59e0b"
										: "#3b82f6",
								}}
							>
								{newParameterData.user_interface?.is_advanced
									? "Advanced"
									: "Simple"}
							</button>
						</div>

						{/* Second column: Modifiable checkbox - editable since it's part of editData */}
						<div className="flex justify-center flex-1">
							<input
								type="checkbox"
								checked={newParameterData.is_modifiable || false}
								onChange={(e) =>
									setNewParameterData((prev) => ({
										...prev,
										is_modifiable: e.target.checked,
									}))
								}
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
							/>
						</div>

						{/* Third column: Unified checkbox */}
						<div className="flex justify-center flex-1">
							<input
								type="checkbox"
								checked={newParameterData.is_unified || false}
								onChange={(e) =>
									setNewParameterData((prev) => ({
										...prev,
										is_unified: e.target.checked,
									}))
								}
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
							/>
						</div>

						{/* Fourth column: Output checkbox */}
						<div className="flex justify-center flex-1">
							<input
								type="checkbox"
								checked={newParameterData.output || false}
								onChange={(e) =>
									setNewParameterData((prev) => ({
										...prev,
										output: e.target.checked,
									}))
								}
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
							/>
						</div>
					</div>
				</div>,
				"userInterface"
			)}

			{renderCell(
				columnVisibility.actions,
				<div className="flex items-center gap-1">
					<Button
						size="sm"
						variant="ghost"
						onClick={handleSaveNewParameter}
						className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
						disabled={isSaveDisabled()}
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
				</div>,
				"actions"
			)}
		</TableRow>
	);
}
