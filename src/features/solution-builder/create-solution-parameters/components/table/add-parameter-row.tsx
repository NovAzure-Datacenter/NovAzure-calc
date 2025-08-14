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

export function AddParameterRow({
	newParameterData,
	setNewParameterData,
	handleSaveNewParameter,
	handleCancelAddParameter,
	getAllAvailableCategories,
	getCategoryBadgeStyleForDropdownWrapper,
	getUserInterfaceBadgeStyle,
	getDisplayTypeBadgeStyle,
	columnVisibility,
	renderCell,
	usedParameterIds,
	parameters,
}: AddParameterRowProps) {
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
				((newParameterData.display_type === "simple" && !newParameterData.value.trim()) ||
					(newParameterData.display_type === "range" &&
						(!newParameterData.range_min.trim() || !newParameterData.range_max.trim())) ||
					(newParameterData.display_type === "dropdown" && newParameterData.dropdown_options.length === 0) ||
					(newParameterData.display_type === "filter" && newParameterData.dropdown_options.length === 0)))
		);
	};

	return (
		<TableRow className="bg-green-50 border-2 border-green-200 shadow-md">
			{renderCell(
				columnVisibility.parameterName,
				<div className="flex items-center gap-2">
					<Input
						value={newParameterData.name}
						onChange={(e) => {
							const originalValue = e.target.value;
							const filteredValue = originalValue.replace(/[()+=\-*/]/g, "");
							if (originalValue !== filteredValue) {
								toast.error("Characters ()+-*/ are not allowed in parameter names");
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
					onValueChange={(value) => setNewParameterData((prev) => ({ ...prev, category: value }))}
				>
					<SelectTrigger className="h-7 text-xs">
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						{getAllAvailableCategories().length > 0 ? (
							getAllAvailableCategories().map((category) => (
								<SelectItem key={category.name} value={category.name}>
									<span style={getCategoryBadgeStyleForDropdownWrapper(category.name)}>
										{category.name}
									</span>
								</SelectItem>
							))
						) : (
							<div className="px-2 py-1.5 text-xs text-muted-foreground">No categories available.</div>
						)}
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
							display_type: value as "simple" | "dropdown" | "range" | "filter" | "conditional",
						}))
					}
				>
					<SelectTrigger className="h-7 text-xs">
						<SelectValue>
							<span style={getDisplayTypeBadgeStyle(newParameterData.display_type)}>
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
					onChange={(e) => setNewParameterData((prev) => ({ ...prev, test_value: e.target.value }))}
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
					onChange={(e) => setNewParameterData((prev) => ({ ...prev, unit: e.target.value }))}
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
					onChange={(e) => setNewParameterData((prev) => ({ ...prev, description: e.target.value }))}
					className="h-7 text-xs"
					placeholder="Description"
					onKeyDown={handleKeyDown}
				/>,
				"description"
			)}

			{renderCell(
				columnVisibility.userInterface,
				<div className="space-y-1">
					<Select
						value={newParameterData.user_interface?.type || "input"}
						onValueChange={(value) =>
							setNewParameterData((prev) => ({
								...prev,
								user_interface: {
									type: value as "input" | "static" | "not_viewable",
									category: "Global",
									is_advanced: false,
								},
							}))
						}
					>
						<SelectTrigger className="h-7 text-xs">
							<SelectValue>
								<span
									style={{
										color: getUserInterfaceBadgeStyle(newParameterData.user_interface?.type || "input").color,
									}}
								>
									{newParameterData.user_interface?.type || "Select provider"}
								</span>
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="input">Input</SelectItem>
							<SelectItem value="static">Static</SelectItem>
							<SelectItem value="not_viewable">Not Viewable</SelectItem>
						</SelectContent>
					</Select>
					{newParameterData.user_interface?.type === "input" && (
						<Select
							value={newParameterData.user_interface?.is_advanced ? "true" : "false"}
							onValueChange={(value) =>
								setNewParameterData((prev) => ({
									...prev,
									user_interface: {
										...prev.user_interface,
										is_advanced: value === "true",
									},
								}))
							}
						>
							<SelectTrigger className="h-6 text-xs">
								<SelectValue>
									{newParameterData.user_interface?.is_advanced ? "Advanced" : "Simple"}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="false">Simple</SelectItem>
								<SelectItem value="true">Advanced</SelectItem>
							</SelectContent>
						</Select>
					)}
				</div>,
				"userInterface"
			)}

			{renderCell(
				columnVisibility.output,
				<Select
					value={newParameterData.output ? "true" : "false"}
					onValueChange={(value) => setNewParameterData((prev) => ({ ...prev, output: value === "true" }))}
				>
					<SelectTrigger className="h-7 text-xs">
						<SelectValue>{newParameterData.output ? "True" : "False"}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="true">True</SelectItem>
						<SelectItem value="false">False</SelectItem>
					</SelectContent>
				</Select>,
				"output"
			)}

			{renderCell(
				columnVisibility.actions,
				<div className="flex items-center gap-1">
					<Button size="sm" variant="ghost" onClick={handleSaveNewParameter} className="h-5 w-5 p-0 text-green-600 hover:text-green-700" disabled={isSaveDisabled()}>
						<Save className="h-3 w-3" />
					</Button>
					<Button size="sm" variant="ghost" onClick={handleCancelAddParameter} className="h-5 w-5 p-0 text-red-600 hover:text-red-700">
						<X className="h-3 w-3" />
					</Button>
				</div>,
				"actions"
			)}
		</TableRow>
	);
} 