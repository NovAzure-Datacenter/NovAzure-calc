"use client";

import { useState, useEffect } from "react";
import { 
	X, 
	DollarSign, 
	Zap, 
	Leaf, 
	Clock, 
	TrendingUp,
	Edit,
	Trash2,
	Save,
	Plus,
	AlertTriangle,
	Building2,
	BarChart3,
	Users
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Technology, TechnologyParameter, Industry } from "../types";
import {
	iconComponentToString,
	stringToIconComponent,
	iconOptions,
} from "@/lib/icons/lucide-icons";
import { updateTechnology, deleteTechnology } from "@/lib/actions/technology/technology";
import React from "react";

interface TechnologyDetailDialogProps {
	technology: Technology | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	industries: Industry[];
	onTechnologyDeleted?: () => Promise<void>;
	onTechnologyUpdated?: () => Promise<void>;
	isEditMode?: boolean;
}

const getCategoryColor = (category: string) => {
	switch (category) {
		case "cost":
			return "bg-destructive/10 text-destructive border-destructive/20";
		case "performance":
			return "bg-primary/10 text-primary border-primary/20";
		case "environmental":
			return "bg-green-500/10 text-green-600 border-green-500/20";
		case "other":
			return "bg-purple-500/10 text-purple-600 border-purple-500/20";
		default:
			return "bg-muted text-muted-foreground border-border";
	}
};

const getCategoryIcon = (category: string) => {
	switch (category) {
		case "cost":
			return <DollarSign className="h-4 w-4" />;
		case "performance":
			return <Zap className="h-4 w-4" />;
		case "environmental":
			return <Leaf className="h-4 w-4" />;
		case "other":
			return <TrendingUp className="h-4 w-4" />;
		default:
			return null;
	}
};

const groupParametersByCategory = (parameters: Technology["parameters"]) => {
	if (!parameters) return {};
	
	const grouped = parameters.reduce((acc, param) => {
		if (!acc[param.category]) {
			acc[param.category] = [];
		}
		acc[param.category].push(param);
		return acc;
	}, {} as Record<string, TechnologyParameter[]>);

	return grouped;
};

export function TechnologyDetailDialog({
	technology,
	open,
	onOpenChange,
	industries,
	onTechnologyDeleted,
	onTechnologyUpdated,
	isEditMode,
}: TechnologyDetailDialogProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedTechnology, setEditedTechnology] = useState<Technology | null>(null);
	const [activeTab, setActiveTab] = useState("overview");
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [parameterToRemove, setParameterToRemove] = useState<number | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

	// Initialize edited technology when dialog opens
	useEffect(() => {
		if (technology && open) {
			setEditedTechnology({ ...technology });
			setIsEditing(isEditMode || false);
		}
	}, [technology, open, isEditMode]);

	const handleEdit = () => {
		setIsEditing(true);
		setEditedTechnology({ ...technology! });
		setActiveTab("parameters");
	};

	const handleSave = async () => {
		if (!editedTechnology || !technology) return;

		setIsSaving(true);
		try {
			const iconString = iconComponentToString(editedTechnology.icon);
			
			const result = await updateTechnology(technology.id || "", {
				name: editedTechnology.name,
				description: editedTechnology.description,
				icon: iconString,
				status: editedTechnology.status,
				applicableIndustries: editedTechnology.applicableIndustries,
				parameters: editedTechnology.parameters,
			});

			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Technology updated successfully!");
				setIsEditing(false);
				onOpenChange(false);
				if (onTechnologyUpdated) {
					await onTechnologyUpdated();
				}
			}
		} catch (error) {
			console.error("Error updating technology:", error);
			toast.error("Failed to update technology. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedTechnology({ ...technology! });
	};

	const handleRemove = () => {
		setIsConfirmingRemove(true);
	};

	const handleFieldChange = (field: keyof Technology, value: any) => {
		if (editedTechnology) {
			setEditedTechnology({
				...editedTechnology,
				[field]: value,
			});
		}
	};

	const handleIconChange = (iconName: string) => {
		if (editedTechnology) {
			const selectedIconComponent = stringToIconComponent(iconName);
			setEditedTechnology({
				...editedTechnology,
				icon: selectedIconComponent,
			});
		}
	};

	const handleAddParameter = (category?: TechnologyParameter["category"]) => {
		if (editedTechnology) {
			const newParameter: TechnologyParameter = {
				name: "New Parameter",
				description: "Parameter description",
				value: 0,
				unit: "units",
				category: category || "other",
			};

			setEditedTechnology({
				...editedTechnology,
				parameters: [...(editedTechnology.parameters || []), newParameter],
			});
		}
	};

	const handleParameterChange = (
		index: number,
		field: keyof TechnologyParameter,
		value: any
	) => {
		if (editedTechnology && editedTechnology.parameters) {
			const updatedParameters = [...editedTechnology.parameters];
			updatedParameters[index] = {
				...updatedParameters[index],
				[field]: value,
			};

			setEditedTechnology({
				...editedTechnology,
				parameters: updatedParameters,
			});
		}
	};

	const handleRemoveParameter = (index: number) => {
		setParameterToRemove(index);
	};

	const confirmRemoveParameter = () => {
		if (
			editedTechnology &&
			editedTechnology.parameters &&
			parameterToRemove !== null
		) {
			const updatedParameters = editedTechnology.parameters.filter(
				(_, i) => i !== parameterToRemove
			);
			setEditedTechnology({
				...editedTechnology,
				parameters: updatedParameters,
			});
			setParameterToRemove(null);
		}
	};

	const getParameterSummary = (parameters: Technology["parameters"]) => {
		if (!parameters || parameters.length === 0) return null;

		const categories = parameters.reduce((acc, param) => {
			acc[param.category] = (acc[param.category] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return categories;
	};

	if (!technology) return null;

	const parameterSummary = getParameterSummary(technology.parameters);
	const currentTechnology = isEditing ? editedTechnology : technology;

	if (!currentTechnology) return null;

	const applicableIndustries = currentTechnology.applicableIndustries
		? currentTechnology.applicableIndustries
				.map((industryId) => industries.find((ind) => ind.id === industryId))
				.filter((industry): industry is Industry => industry !== undefined)
		: [];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[70vw] max-h-[90vh] flex flex-col">
				<DialogHeader className="pb-4 flex-shrink-0">
					<DialogTitle className="text-xl">Technology Details</DialogTitle>
					<DialogDescription>
						View detailed information about {currentTechnology?.name} including
						applicable industries and parameters.
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto space-y-4">
					{/* Header Section */}
					<Card className="bg-muted/50 rounded-lg px-3 py-3 mb-4">
						<div className="flex items-start gap-3 mb-3">
							<div className="bg-background p-2 rounded-lg shadow-sm relative">
								{isEditing && (
									<div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
										<Edit className="h-2.5 w-2.5" />
									</div>
								)}
								<button
									onClick={() => isEditing && setIsIconSelectorOpen(true)}
									className={`${isEditing ? 'cursor-pointer hover:bg-muted/50 rounded transition-colors' : ''}`}
									disabled={!isEditing}
								>
									<currentTechnology.icon className="h-6 w-6 text-primary" />
								</button>
							</div>
							<div className="flex-1 min-w-0">
								{/* Name and Stats on same horizontal line */}
								<div className="flex items-center justify-between gap-3 mb-2">
									<div className="flex items-center gap-2">
										{isEditing ? (
											<div className="flex-1">
												<label className="text-xs font-medium text-muted-foreground block mb-1">
													Technology Name
												</label>
												<Input
													value={currentTechnology?.name || ""}
													onChange={(e) =>
														handleFieldChange("name", e.target.value)
													}
													className="text-lg font-bold h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
												/>
											</div>
										) : (
											<h2 className="text-lg font-bold text-foreground">
												{currentTechnology?.name}
											</h2>
										)}
										{!isEditing && (
											<Badge
												variant={
													currentTechnology?.status === "verified"
														? "default"
														: "secondary"
												}
												className="text-xs px-1.5 py-0.5"
											>
												{currentTechnology?.status || "pending"}
											</Badge>
										)}
									</div>

									{/* Stats Badges */}
									<div className="flex gap-1">
										<Badge
											variant="outline"
											className="flex items-center gap-1 px-2 py-1"
										>
											<Building2 className="h-3 w-3" />
											<span className="text-xs">Industries</span>
											<span className="text-xs font-bold">
												{applicableIndustries.length}
											</span>
										</Badge>
										<Badge
											variant="outline"
											className="flex items-center gap-1 px-2 py-1"
										>
											<BarChart3 className="h-3 w-3" />
											<span className="text-xs">Params</span>
											<span className="text-xs font-bold">
												{currentTechnology?.parameters?.length || 0}
											</span>
										</Badge>
									</div>
								</div>

								{/* Icon Selection in Edit Mode */}
								{isEditing && (
									<div className="mb-3">
										<label className="text-xs font-medium text-muted-foreground block mb-1">
											Technology Icon
										</label>
										<div className="flex items-center gap-2">
											<div className="flex items-center justify-center w-8 h-8 border rounded-md bg-gray-50">
												{React.createElement(currentTechnology.icon, { className: "h-4 w-4 text-gray-600" })}
											</div>
											<Select 
												onValueChange={handleIconChange} 
												value={iconComponentToString(currentTechnology.icon)}
											>
												<SelectTrigger className="text-xs h-8 flex-1">
													<SelectValue placeholder="Select an icon" />
												</SelectTrigger>
												<SelectContent>
													{iconOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															<div className="flex items-center gap-2">
																<option.icon className="h-4 w-4" />
																<span>{option.label}</span>
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								)}

								{/* Description below */}
								{isEditing ? (
									<div className="flex-1">
										<label className="text-xs font-medium text-muted-foreground block mb-1">
											Description
										</label>
										<Textarea
											value={currentTechnology?.description || ""}
											onChange={(e) =>
												handleFieldChange("description", e.target.value)
											}
											className="text-sm resize-y border rounded-md p-2 min-h-[60px]"
											rows={2}
										/>
									</div>
								) : (
									<p className="text-muted-foreground text-sm leading-relaxed">
										{currentTechnology?.description}
									</p>
								)}
							</div>
						</div>
					</Card>

					<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
						<TabsList className="grid w-full grid-cols-2 bg-background border border-border mb-6">
							<TabsTrigger
								value="overview"
								className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground"
							>
								Overview
							</TabsTrigger>
							<TabsTrigger
								value="parameters"
								className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground"
							>
								Parameters ({currentTechnology?.parameters?.length || 0})
							</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-2">
							<TabContentOverview
								currentTechnology={currentTechnology}
								parameterSummary={parameterSummary}
								applicableIndustries={applicableIndustries}
							/>
						</TabsContent>
						<TabsContent value="parameters" className="space-y-4">
							<TabContentParameters
								currentTechnology={currentTechnology}
								parameterSummary={parameterSummary}
								isEditing={isEditing}
								onParameterChange={handleParameterChange}
								onAddParameter={handleAddParameter}
								onRemoveParameter={handleRemoveParameter}
							/>
						</TabsContent>
					</Tabs>
				</div>

				{/* Footer with Action Buttons - Always visible */}
				<div className="flex justify-end gap-3 pt-6 border-t mt-6 flex-shrink-0">
					{isEditing ? (
						<>
							<Button
								variant="outline"
								onClick={handleCancel}
								size="sm"
								disabled={isSaving}
							>
								<X className="h-4 w-4 mr-2" />
								Cancel
							</Button>
							<Button onClick={handleSave} size="sm" disabled={isSaving}>
								<Save className="h-4 w-4 mr-2" />
								{isSaving ? "Saving..." : "Save Changes"}
							</Button>
						</>
					) : (
						<>
							<Button variant="destructive" onClick={handleRemove} size="sm">
								<Trash2 className="h-4 w-4 mr-2" />
								Remove Technology
							</Button>
							<Button onClick={handleEdit} size="sm">
								<Edit className="h-4 w-4 mr-2" />
								Edit Technology
							</Button>
						</>
					)}
				</div>
			</DialogContent>

			{isConfirmingRemove && (
				<RenderTechnologyRemoveDialog
					technology={technology}
					isConfirmingRemove={isConfirmingRemove}
					setIsConfirmingRemove={setIsConfirmingRemove}
					onTechnologyDeleted={onTechnologyDeleted}
				/>
			)}
			{parameterToRemove !== null && (
				<RenderParameterRemoveDialog
					technology={technology}
					parameterToRemove={parameterToRemove}
					setParameterToRemove={setParameterToRemove}
					confirmRemoveParameter={confirmRemoveParameter}
				/>
			)}
			{isIconSelectorOpen && (
				<RenderIconSelectorDialog
					currentIcon={currentTechnology.icon}
					isOpen={isIconSelectorOpen}
					onOpenChange={setIsIconSelectorOpen}
					onIconChange={handleIconChange}
				/>
			)}
		</Dialog>
	);
}

function TabContentOverview({
	currentTechnology,
	parameterSummary,
	applicableIndustries,
}: {
	currentTechnology: Technology;
	parameterSummary?: Record<string, number> | null;
	applicableIndustries: Industry[];
}) {
	return (
		<>
			{/* Applicable Industries Section */}
			<Card className="border shadow-sm py-2 gap-1">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Building2 className="h-5 w-5 text-primary" />
						Applicable Industries
					</CardTitle>
				</CardHeader>
				<CardContent className="my-2">
					{applicableIndustries.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{applicableIndustries.map((industry) => (
								<Card key={industry.id} className="p-3">
									<CardContent className="p-0">
										<div className="flex items-center gap-3">
											<industry.logo className="h-6 w-6 flex-shrink-0" />
											<div className="min-w-0">
												<h4 className="font-medium text-sm truncate">
													{industry.name}
												</h4>
												<p className="text-xs text-muted-foreground line-clamp-2">
													{industry.description}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-muted-foreground">
							<Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
							<p className="text-sm">
								No industries associated with this technology
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Parameters Summary */}
			{parameterSummary && (
				<Card className="border shadow-sm py-2 gap-1">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-primary" />
							Parameters Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex gap-3">
							{Object.entries(parameterSummary).map(([category, count]) => (
								<div
									key={category}
									className={`flex items-center gap-3 p-3 rounded-lg border flex-1`}
								>
									{getCategoryIcon(category)}
									<div className="flex-1">
										<p className="font-medium text-sm capitalize">{category}</p>
										<p className="text-xs opacity-75">
											{count} parameter{count !== 1 ? "s" : ""}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}

function TabContentParameters({
	currentTechnology,
	parameterSummary,
	isEditing,
	onParameterChange,
	onAddParameter,
	onRemoveParameter,
}: {
	currentTechnology: Technology;
	parameterSummary?: Record<string, number> | null;
	isEditing?: boolean;
	onParameterChange: (
		index: number,
		field: keyof TechnologyParameter,
		value: any
	) => void;
	onAddParameter: (category?: TechnologyParameter["category"]) => void;
	onRemoveParameter: (index: number) => void;
}) {
	return (
		<TabsContent value="parameters" className="space-y-4">
			{currentTechnology?.parameters && currentTechnology.parameters.length > 0 ? (
				<div className="space-y-4">
					{Object.entries(
						groupParametersByCategory(currentTechnology.parameters)
					).map(([category, params]) => (
						<Card key={category} className="border shadow-sm p-4 px-0 gap-2">
							<CardHeader>
								<CardTitle className="text-base flex items-center gap-2">
									{getCategoryIcon(category)}
									{category.charAt(0).toUpperCase() + category.slice(1)}{" "}
									Parameters
									<Badge className={`${getCategoryColor(category)} border-0`}>
										{params.length}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="grid gap-3">
									{params.map(
										(param: TechnologyParameter, categoryIndex: number) => {
											const globalIndex =
												currentTechnology.parameters?.findIndex(
													(p) => p === param
												) ?? -1;

											return (
												<div
													key={globalIndex}
													className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors relative"
												>
													{isEditing && (
														<Button
															variant="default"
															size="sm"
															onClick={() => onRemoveParameter(globalIndex)}
															className="absolute -top-3 -right-3 h-6 w-6 p-0 text-muted-foreground bg-destructive/30"
														>
															<X className="h-3 w-3" />
														</Button>
													)}
													<div className="flex-1">
														{isEditing ? (
															<div className="space-y-2">
																<div className="flex items-center gap-2">
																	<label className="text-xs font-medium text-muted-foreground">
																		Name:
																	</label>
																	<Input
																		value={param.name}
																		onChange={(e) =>
																			onParameterChange(
																				globalIndex,
																				"name",
																				e.target.value
																			)
																		}
																		className="text-sm h-7 border-0 bg-transparent p-0 focus-visible:ring-0 font-semibold"
																	/>
																</div>
																<div className="flex items-center gap-2">
																	<label className="text-xs font-medium text-muted-foreground">
																		Description:
																	</label>
																	<Input
																		value={param.description}
																		onChange={(e) =>
																			onParameterChange(
																				globalIndex,
																				"description",
																				e.target.value
																			)
																		}
																		className="text-sm h-7 border-0 bg-transparent p-0 focus-visible:ring-0 text-muted-foreground"
																	/>
																</div>
															</div>
														) : (
															<>
																<div className="flex items-center gap-2 mb-1">
																	<h4 className="font-semibold text-foreground">
																		{param.name}
																	</h4>
																	<Badge
																		className={`${getCategoryColor(
																			category
																		)} border-0 text-xs`}
																	>
																		{category.charAt(0).toUpperCase() +
																			category.slice(1)}
																	</Badge>
																</div>
																<p className="text-sm text-muted-foreground">
																	{param.description}
																</p>
															</>
														)}
													</div>
													<div className="text-right ml-4">
														{isEditing ? (
															<div className="space-y-2">
																<div className="flex items-center gap-2">
																	<label className="text-xs font-medium text-muted-foreground">
																		Value:
																	</label>
																	<Input
																		value={param.value}
																		onChange={(e) =>
																			onParameterChange(
																				globalIndex,
																				"value",
																				parseFloat(e.target.value) || 0
																			)
																		}
																		className="text-sm h-7 w-20 border-0 bg-transparent p-0 focus-visible:ring-0 text-xl font-bold text-primary text-right"
																	/>
																</div>
																<div className="flex items-center gap-2">
																	<label className="text-xs font-medium text-muted-foreground">
																		Unit:
																	</label>
																	<Input
																		value={param.unit}
																		onChange={(e) =>
																			onParameterChange(
																				globalIndex,
																				"unit",
																				e.target.value
																			)
																		}
																		className="text-xs h-6 w-16 border-0 bg-transparent p-0 focus-visible:ring-0 text-muted-foreground font-medium text-right"
																	/>
																</div>
															</div>
														) : (
															<>
																<div className="text-xl font-bold text-primary">
																	{param.value}
																</div>
																<div className="text-xs text-muted-foreground font-medium">
																	{param.unit}
																</div>
															</>
														)}
													</div>
												</div>
											);
										}
									)}
								</div>
								{isEditing && (
									<div className="flex justify-end mt-4 pt-3 border-t border-border/50">
										<Button
											onClick={() =>
												onAddParameter(
													category as TechnologyParameter["category"]
												)
											}
											size="sm"
											variant="outline"
											className="flex items-center gap-2"
										>
											<Plus className="h-4 w-4" />
											Add {category.charAt(0).toUpperCase() +
												category.slice(1)}{" "}
											Parameter
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					))}

					{isEditing && (
						<div className="flex justify-center">
							<Button
								onClick={() => onAddParameter()}
								size="sm"
								variant="outline"
								className="flex items-center gap-2"
							>
								<Plus className="h-4 w-4" />
								Add New Block of Parameters
							</Button>
						</div>
					)}
				</div>
			) : (
				<Card className="border shadow-sm">
					<CardContent className="p-12 text-center">
						<BarChart3 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-foreground mb-2">
							No Parameters
						</h3>
						<p className="text-muted-foreground text-sm">
							This technology doesn&apos;t have any parameters defined yet.
						</p>
						{isEditing && (
							<Button
								onClick={() => onAddParameter()}
								size="sm"
								className="mt-4"
							>
								<Plus className="h-4 w-4 mr-2" />
								Add First Parameter
							</Button>
						)}
					</CardContent>
				</Card>
			)}
		</TabsContent>
	);
}

function RenderTechnologyRemoveDialog({
	technology,
	isConfirmingRemove,
	setIsConfirmingRemove,
	onTechnologyDeleted,
}: {
	technology: Technology;
	isConfirmingRemove: boolean;
	setIsConfirmingRemove: (isConfirmingRemove: boolean) => void;
	onTechnologyDeleted?: () => Promise<void>;
}) {
	const [isRemoving, setIsRemoving] = useState(false);

	const handleRemove = async () => {
		if (!technology) return;

		setIsRemoving(true);
		try {
			const result = await deleteTechnology(technology.id || "");
			
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Technology removed successfully!");
				setIsConfirmingRemove(false);
				if (onTechnologyDeleted) {
					await onTechnologyDeleted();
				}
			}
		} catch (error) {
			console.error("Error removing technology:", error);
			toast.error("Failed to remove technology. Please try again.");
		} finally {
			setIsRemoving(false);
		}
	};

	if (!isConfirmingRemove) return null;
	return (
		<Dialog open={isConfirmingRemove} onOpenChange={setIsConfirmingRemove}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						Remove Technology
					</DialogTitle>
					<DialogDescription className="space-y-2">
						<p>
							Are you sure you want to remove{" "}
							<strong>&quot;{technology?.name}&quot;</strong>?
						</p>
						<p className="text-sm text-muted-foreground">
							This will permanently delete the technology
						</p>

						<p className="text-sm font-medium text-destructive">
							This action cannot be undone.
						</p>
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-3 pt-6 border-t mt-6">
					<Button
						variant="outline"
						onClick={() => setIsConfirmingRemove(false)}
						size="sm"
						disabled={isRemoving}
					>
						Cancel
					</Button>
					<Button
						onClick={handleRemove}
						size="sm"
						variant="destructive"
						disabled={isRemoving}
					>
						<Trash2 className="h-4 w-4 mr-2" />
						{isRemoving ? "Removing..." : "Remove Technology"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function RenderParameterRemoveDialog({
	technology,
	parameterToRemove,
	setParameterToRemove,
	confirmRemoveParameter,
}: {
	technology: Technology;
	parameterToRemove: number | null;
	setParameterToRemove: (parameterToRemove: number | null) => void;
	confirmRemoveParameter: () => void;
}) {
	if (parameterToRemove === null) return null;

	return (
		<Dialog
			open={parameterToRemove !== null}
			onOpenChange={() => setParameterToRemove(null)}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Remove Parameter</DialogTitle>
					<DialogDescription>
						Are you sure you want to remove this parameter? This action cannot
						be undone.
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-3 pt-6 border-t mt-6">
					<Button
						variant="outline"
						onClick={() => setParameterToRemove(null)}
						size="sm"
					>
						Cancel
					</Button>
					<Button
						onClick={confirmRemoveParameter}
						size="sm"
						variant="destructive"
					>
						Remove Parameter
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function RenderIconSelectorDialog({
	currentIcon,
	isOpen,
	onOpenChange,
	onIconChange,
}: {
	currentIcon: React.ComponentType<{ className?: string }>;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onIconChange: (iconName: string) => void;
}) {
	if (!isOpen) return null;

	const currentIconName = iconComponentToString(currentIcon);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Select Technology Icon</DialogTitle>
					<DialogDescription>
						Choose an icon that best represents this technology
					</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
					{iconOptions.map((option) => {
						const isSelected = option.value === currentIconName;
						return (
							<button
								key={option.value}
								onClick={() => {
									onIconChange(option.value);
									onOpenChange(false);
								}}
								className={`p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
									isSelected 
										? 'border-primary bg-primary/10' 
										: 'border-border hover:border-primary/50'
								}`}
							>
								<div className="flex flex-col items-center gap-2">
									<option.icon className={`h-8 w-8 ${
										isSelected ? 'text-primary' : 'text-muted-foreground'
									}`} />
								</div>
							</button>
						);
					})}
				</div>
				<div className="flex justify-end mt-4 pt-4 border-t">
					<Button
						onClick={() => onOpenChange(false)}
						variant="outline"
						size="sm"
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
} 