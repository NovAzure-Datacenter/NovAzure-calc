"use client";

import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Edit, Save, X, Info } from "lucide-react";

export interface Parameter {
	id: string;
	level: string;
	name: string;
	defaultValue: number;
	overrideValue: number | null;
	units: string;
	description: string;
	category: "performance" | "cost" | "environmental" | "operational";
}

interface ParametersConfigurationProps {
	parameters: Parameter[];
	onParametersChange: (parameters: Parameter[]) => void;
}

export function ParametersConfiguration({
	parameters,
	onParametersChange,
}: ParametersConfigurationProps) {
	const [editingParameter, setEditingParameter] = useState<string | null>(null);
	const [editData, setEditData] = useState<{
		name: string;
		overrideValue: string;
		units: string;
		description: string;
	}>({
		name: "",
		overrideValue: "",
		units: "",
		description: "",
	});

	const handleEditParameter = (parameter: Parameter) => {
		setEditingParameter(parameter.id);
		setEditData({
			name: parameter.name,
			overrideValue: parameter.overrideValue?.toString() || parameter.defaultValue.toString(),
			units: parameter.units,
			description: parameter.description,
		});
	};

	const handleSaveParameter = (parameterId: string) => {
		const numericValue = parseFloat(editData.overrideValue);
		if (isNaN(numericValue)) {
			// Handle invalid input
			return;
		}

		const currentParameter = parameters.find(p => p.id === parameterId);
		if (!currentParameter) return;

		// Only set overrideValue if it's different from the default
		const overrideValue = numericValue !== currentParameter.defaultValue ? numericValue : null;

		const updatedParameters = parameters.map((param) =>
			param.id === parameterId
				? { 
						...param, 
						name: editData.name,
						overrideValue: overrideValue,
						units: editData.units,
						description: editData.description,
					}
				: param
		);
		onParametersChange(updatedParameters);
		setEditingParameter(null);
		setEditData({
			name: "",
			overrideValue: "",
			units: "",
			description: "",
		});
	};

	const handleCancelEdit = () => {
		setEditingParameter(null);
		setEditData({
			name: "",
			overrideValue: "",
			units: "",
			description: "",
		});
	};

	const handleResetParameter = (parameterId: string) => {
		const updatedParameters = parameters.map((param) =>
			param.id === parameterId ? { ...param, overrideValue: null } : param
		);
		onParametersChange(updatedParameters);
	};

	const getLevelColor = (level: string) => {
		switch (level) {
			case "L1":
				return "bg-blue-100 text-blue-800";
			case "L2":
				return "bg-green-100 text-green-800";
			case "L3":
				return "bg-yellow-100 text-yellow-800";
			case "L4":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "performance":
				return "bg-blue-50 text-blue-700 border-blue-200";
			case "cost":
				return "bg-green-50 text-green-700 border-green-200";
			case "environmental":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			case "operational":
				return "bg-purple-50 text-purple-700 border-purple-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	return (
		<div className="space-y-6">
			{/* Scrollable Table Container */}
			<div className="border rounded-lg">
				<div className="max-h-[55vh] overflow-y-auto">
					<TooltipProvider>
						<Table>
							<TableHeader className="sticky top-0 bg-background z-10">
								<TableRow>
									<TableHead className="w-16 bg-background">Level</TableHead>
									<TableHead className="w-48 bg-background">Parameter</TableHead>
									<TableHead className="w-32 bg-background">Default Value</TableHead>
									<TableHead className="w-32 bg-background">Override Value</TableHead>
									<TableHead className="w-20 bg-background">Units</TableHead>
									<TableHead className="bg-background">Description</TableHead>
									<TableHead className="w-24 bg-background">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{parameters.map((parameter) => {
									const isEditing = editingParameter === parameter.id;
									const displayValue =
										parameter.overrideValue !== null
											? parameter.overrideValue
											: parameter.defaultValue;
									const isOverridden = parameter.overrideValue !== null;

									return (
										<TableRow
											key={parameter.id}
											className={`transition-all duration-200 ${
												isEditing 
													? "bg-blue-50 border-2 border-blue-200 shadow-md" 
													: isOverridden 
														? "bg-blue-50" 
														: ""
											} ${
												editingParameter && !isEditing 
													? "opacity-40 pointer-events-none" 
													: ""
											}`}
										>
											<TableCell>
												<Badge
													className={`text-xs ${getLevelColor(parameter.level)}`}
												>
													{parameter.level}
												</Badge>
											</TableCell>
											<TableCell>
												{isEditing ? (
													<Input
														value={editData.name}
														onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
														className="h-8 text-sm"
														placeholder="Parameter name"
													/>
												) : (
													<div className="flex items-center gap-2">
														<span className="font-medium">{parameter.name}</span>
														<Badge
															variant="outline"
															className={`text-xs ${getCategoryColor(
																parameter.category
															)}`}
														>
															{parameter.category}
														</Badge>
													</div>
												)}
											</TableCell>
											<TableCell>
												<span className="text-sm text-muted-foreground">
													{parameter.defaultValue}
												</span>
											</TableCell>
											<TableCell>
												{isEditing ? (
													<Input
														value={editData.overrideValue}
														onChange={(e) => setEditData(prev => ({ ...prev, overrideValue: e.target.value }))}
														className="h-8 text-sm"
														placeholder="Override value"
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																handleSaveParameter(parameter.id);
															} else if (e.key === "Escape") {
																handleCancelEdit();
															}
														}}
													/>
												) : (
													<div className="flex items-center gap-2">
														<span
															className={`text-sm ${
																isOverridden ? "font-medium text-blue-600" : ""
															}`}
														>
															{displayValue}
														</span>
														{isOverridden && (
															<Badge
																variant="outline"
																className="text-xs bg-blue-50 text-blue-700"
															>
																Override
															</Badge>
														)}
													</div>
												)}
											</TableCell>
											<TableCell>
												{isEditing ? (
													<Input
														value={editData.units}
														onChange={(e) => setEditData(prev => ({ ...prev, units: e.target.value }))}
														className="h-8 text-sm"
														placeholder="Units"
													/>
												) : (
													<span className="text-sm text-muted-foreground">
														{parameter.units}
													</span>
												)}
											</TableCell>
											<TableCell>
												{isEditing ? (
													<Input
														value={editData.description}
														onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
														className="h-8 text-sm"
														placeholder="Description"
													/>
												) : (
													<div className="flex items-center gap-2">
														<span className="text-sm text-muted-foreground max-w-xs truncate">
															{parameter.description}
														</span>
														<Tooltip>
															<TooltipTrigger asChild>
																<Info className="h-3 w-3 text-muted-foreground cursor-help" />
															</TooltipTrigger>
															<TooltipContent className="max-w-xs">
																<p className="text-sm">{parameter.description}</p>
															</TooltipContent>
														</Tooltip>
													</div>
												)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													{!isEditing ? (
														<>
															<Button
																size="sm"
																variant="ghost"
																onClick={() => handleEditParameter(parameter)}
																className="h-6 w-6 p-0"
																disabled={editingParameter !== null}
															>
																<Edit className="h-3 w-3" />
															</Button>
															{isOverridden && (
																<Button
																	size="sm"
																	variant="ghost"
																	onClick={() => handleResetParameter(parameter.id)}
																	className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
																	disabled={editingParameter !== null}
																>
																	<X className="h-3 w-3" />
																</Button>
															)}
														</>
													) : (
														<>
															<Button
																size="sm"
																variant="ghost"
																onClick={() => handleSaveParameter(parameter.id)}
																className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
															>
																<Save className="h-3 w-3" />
															</Button>
															<Button
																size="sm"
																variant="ghost"
																onClick={handleCancelEdit}
																className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
															>
																<X className="h-3 w-3" />
															</Button>
														</>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TooltipProvider>
				</div>
			</div>

			{/* Summary and Actions */}
			<div className="flex justify-between items-center pt-4 border-t">
				<div className="text-sm text-muted-foreground">
					<span className="font-medium">
						{parameters.filter((p) => p.overrideValue !== null).length}
					</span>{" "}
					parameters overridden
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						const resetParameters = parameters.map((param) => ({
							...param,
							overrideValue: null,
						}));
						onParametersChange(resetParameters);
					}}
					disabled={parameters.every((p) => p.overrideValue === null) || editingParameter !== null}
				>
					Reset All Overrides
				</Button>
			</div>
		</div>
	);
}
