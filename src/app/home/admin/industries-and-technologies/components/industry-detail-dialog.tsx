import { Industry, IndustryParameter } from "../types";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { TechnologyIcons, CompanyIcons } from "@/components/icons/technology-company-icons";
import {
	DollarSign,
	Zap,
	Leaf,
	Settings,
	Building2,
	Edit,
	Trash2,
	Save,
	X,
	Users,
	BarChart3,
	Plus,
	AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { iconComponentToString, stringToIconComponent, iconOptions } from "@/lib/icons/lucide-icons";
import React from "react";
import { updateIndustry } from "@/lib/actions/industry/industry";
import { deleteIndustry } from "@/lib/actions/industry/industry";
import { toast } from "sonner";
import { getClients, ClientData } from "@/lib/actions/client/client";

interface IndustryDetailDialogProps {
	industry: Industry | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onIndustryDeleted?: () => Promise<void>;
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
			return <Settings className="h-4 w-4" />;
		default:
			return null;
	}
};

const groupParametersByCategory = (parameters: Industry["parameters"]) => {
	const grouped = parameters.reduce((acc, param) => {
		if (!acc[param.category]) {
			acc[param.category] = [];
		}
		acc[param.category].push(param);
		return acc;
	}, {} as Record<string, IndustryParameter[]>);

	return grouped;
};

export function IndustryDetailDialog({
	industry,
	open,
	onOpenChange,
	onIndustryDeleted,
	isEditMode,
}: IndustryDetailDialogProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedIndustry, setEditedIndustry] = useState<Industry | null>(null);
	const [activeTab, setActiveTab] = useState("overview");
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [parameterToRemove, setParameterToRemove] = useState<number | null>(
		null
	);
	const [isSaving, setIsSaving] = useState(false);
	const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
	const [clients, setClients] = useState<ClientData[]>([]);

	useEffect(() => {
		if (industry && open) {
			setEditedIndustry({ ...industry });
			setIsEditing(isEditMode || false);
		}
	}, [industry, open, isEditMode]);

	// Load clients data to resolve company IDs to names
	const loadClients = async () => {
		try {
			const result = await getClients();
			if (result.clients) {
				setClients(result.clients);
			}
		} catch (error) {
			console.error("Error loading clients:", error);
		}
	};

	useEffect(() => {
		if (open) {
			loadClients();
		}
	}, [open]);

	const handleEdit = () => {
		setIsEditing(true);
		setEditedIndustry({ ...industry! });
		setActiveTab("parameters");
	};

	const handleSave = async () => {
		if (!editedIndustry || !industry) return;

		setIsSaving(true);
		try {
			const updateData = {
				name: editedIndustry.name,
				description: editedIndustry.description,
				icon: iconComponentToString(editedIndustry.logo),
				parameters: editedIndustry.parameters,
			};

			const result = await updateIndustry(industry.id, updateData);

			if (result.error) {
				toast.error(result.error);
				return;
			}

			Object.assign(industry, editedIndustry);
			toast.success("Industry updated successfully!");
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating industry:", error);
			toast.error("Failed to update industry. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedIndustry({ ...industry! });
	};

	const handleRemove = () => {
		setIsConfirmingRemove(true);
	};

	const handleFieldChange = (field: keyof Industry, value: any) => {
		if (editedIndustry) {
			setEditedIndustry({
				...editedIndustry,
				[field]: value,
			});
		}
	};

	const handleIconChange = (iconName: string) => {
		if (editedIndustry) {
			const selectedIconComponent = stringToIconComponent(iconName);
			setEditedIndustry({
				...editedIndustry,
				logo: selectedIconComponent,
			});
		}
	};

	const handleAddParameter = (category?: IndustryParameter["category"]) => {
		if (editedIndustry) {
			const newParameter: IndustryParameter = {
				name: "New Parameter",
				description: "Parameter description",
				value: 0,
				unit: "units",
				category: category || "other",
			};

			setEditedIndustry({
				...editedIndustry,
				parameters: [...(editedIndustry.parameters || []), newParameter],
			});
		}
	};

	const handleParameterChange = (
		index: number,
		field: keyof IndustryParameter,
		value: any
	) => {
		if (editedIndustry && editedIndustry.parameters) {
			const updatedParameters = [...editedIndustry.parameters];
			updatedParameters[index] = {
				...updatedParameters[index],
				[field]: value,
			};

			setEditedIndustry({
				...editedIndustry,
				parameters: updatedParameters,
			});
		}
	};

	const handleRemoveParameter = (index: number) => {
		setParameterToRemove(index);
	};

	const confirmRemoveParameter = () => {
		if (
			editedIndustry &&
			editedIndustry.parameters &&
			parameterToRemove !== null
		) {
			const updatedParameters = editedIndustry.parameters.filter(
				(_, i) => i !== parameterToRemove
			);
			setEditedIndustry({
				...editedIndustry,
				parameters: updatedParameters,
			});
			setParameterToRemove(null);
		}
	};

	const getParameterSummary = (parameters: Industry["parameters"]) => {
		if (!parameters || parameters.length === 0) return null;

		const categories = parameters.reduce((acc, param) => {
			acc[param.category] = (acc[param.category] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return categories;
	};

	if (!industry) return null;

	const parameterSummary = getParameterSummary(industry.parameters);
	const currentIndustry = isEditing ? editedIndustry : industry;

	if (!currentIndustry) return null;

	// Transform clients data to match CompanyIcons expected format
	const transformedClients = clients.map(client => ({
		id: client.id,
		companyName: client.company_name,
		logo: client.logo
	}));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[70vw] max-h-[90vh] flex flex-col">
				<DialogHeader className="pb-4 flex-shrink-0">
					<DialogTitle className="text-xl">Industry Details</DialogTitle>
					<DialogDescription>
						View detailed information about {currentIndustry?.name} including
						technologies, companies, and parameters.
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
									className={`${
										isEditing
											? "cursor-pointer hover:bg-muted/50 rounded transition-colors"
											: ""
									}`}
									disabled={!isEditing}
								>
									<currentIndustry.logo className="h-6 w-6 text-primary" />
								</button>
							</div>
							<div className="flex-1 min-w-0">
								{/* Name and Stats on same horizontal line */}
								<div className="flex items-center justify-between gap-3 mb-2">
									<div className="flex items-center gap-2">
										{isEditing ? (
											<div className="flex-1">
												<label className="text-xs font-medium text-muted-foreground block mb-1">
													Industry Name
												</label>
												<Input
													value={currentIndustry.name}
													onChange={(e) =>
														handleFieldChange("name", e.target.value)
													}
													className="text-lg font-bold border-0 bg-transparent p-0 focus-visible:ring-0"
												/>
											</div>
										) : (
											<h2 className="text-lg font-bold">
												{currentIndustry.name}
											</h2>
										)}
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className="text-xs">
											{currentIndustry.parameters?.length || 0} Parameters
										</Badge>
										<Badge variant="outline" className="text-xs">
											{currentIndustry.companies?.length || 0} Companies
										</Badge>
									</div>
								</div>
								{/* Description */}
								{isEditing ? (
									<div>
										<label className="text-xs font-medium text-muted-foreground block mb-1">
											Description
										</label>
										<Textarea
											value={currentIndustry.description}
											onChange={(e) =>
												handleFieldChange("description", e.target.value)
											}
											className="text-sm border-0 bg-transparent p-0 focus-visible:ring-0 resize-none"
											rows={2}
										/>
									</div>
								) : (
									<p className="text-sm text-muted-foreground">
										{currentIndustry.description}
									</p>
								)}
							</div>
						</div>
					</Card>

					{/* Tabs */}
					<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="parameters">Parameters</TabsTrigger>
							<TabsTrigger value="companies">Companies</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-4">
							<TabContentOverview
								currentIndustry={currentIndustry}
								parameterSummary={parameterSummary}
								clients={transformedClients}
							/>
						</TabsContent>

						<TabsContent value="parameters" className="space-y-4">
							<TabContentParameters
								currentIndustry={currentIndustry}
								parameterSummary={parameterSummary}
								isEditing={isEditing}
								onParameterChange={handleParameterChange}
								onAddParameter={handleAddParameter}
								onRemoveParameter={handleRemoveParameter}
							/>
						</TabsContent>

						<TabsContent value="companies" className="space-y-4">
							<Card className="border shadow-sm">
								<CardHeader>
									<CardTitle className="text-lg flex items-center gap-2">
										<Users className="h-5 w-5 text-primary" />
										Associated Companies
									</CardTitle>
									<DialogDescription>
										Companies that have selected this industry
									</DialogDescription>
								</CardHeader>
								<CardContent>
									{currentIndustry.companies &&
									currentIndustry.companies.length > 0 ? (
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<CompanyIcons
													companies={currentIndustry.companies}
													iconSize={6}
													textSize="sm"
													maxVisible={12}
													clients={transformedClients}
												/>
											</div>
										</div>
									) : (
										<div className="text-center py-8 text-muted-foreground">
											<Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
											<p className="text-sm">
												No companies associated with this industry
											</p>
										</div>
									)}
								</CardContent>
							</Card>
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
								Remove Industry
							</Button>
							<Button onClick={handleEdit} size="sm">
								<Edit className="h-4 w-4 mr-2" />
								Edit Industry
							</Button>
						</>
					)}
				</div>
			</DialogContent>

			{isConfirmingRemove && (
				<RenderIndustryRemoveDialog
					industry={industry}
					isConfirmingRemove={isConfirmingRemove}
					setIsConfirmingRemove={setIsConfirmingRemove}
					onIndustryDeleted={onIndustryDeleted}
				/>
			)}
			{parameterToRemove !== null && (
				<RenderParameterRemoveDialog
					industry={industry}
					parameterToRemove={parameterToRemove}
					setParameterToRemove={setParameterToRemove}
					confirmRemoveParameter={confirmRemoveParameter}
				/>
			)}
			{isIconSelectorOpen && (
				<RenderIconSelectorDialog
					currentIcon={currentIndustry.logo}
					isOpen={isIconSelectorOpen}
					onOpenChange={setIsIconSelectorOpen}
					onIconChange={handleIconChange}
				/>
			)}
		</Dialog>
	);
}

function TabContentOverview({
	currentIndustry,
	parameterSummary,
	clients,
}: {
	currentIndustry: Industry;
	parameterSummary?: Record<string, number> | null;
	clients: Array<{ id?: string; companyName: string; logo: string }>;
}) {
	return (
		<>
			{/* Technologies and Companies Section*/}
			<div className="grid grid-cols-2 gap-3">
				<Card className="border shadow-sm py-2 gap-1">
					<CardHeader className="">
						<CardTitle className="text-lg flex items-center gap-2">
							<Zap className="h-5 w-5 text-primary" />
							Technologies
						</CardTitle>
					</CardHeader>
					<CardContent className="my-2">
						{currentIndustry?.technologies &&
						currentIndustry.technologies.length > 0 ? (
							<div className="space-y-2">
								<TechnologyIcons
									technologies={currentIndustry.technologies}
									iconSize={6}
									textSize="sm"
									maxVisible={12}
								/>
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Zap className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
								<p className="text-sm">
									No technologies associated with this industry
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Companies Section */}
				<Card className="border shadow-sm py-2 gap-1">
					<CardHeader className="pb-3">
						<CardTitle className="text-lg flex items-center gap-2">
							<Building2 className="h-5 w-5 text-primary" />
							Companies
						</CardTitle>
					</CardHeader>
					<CardContent>
						{currentIndustry?.companies &&
						currentIndustry.companies.length > 0 ? (
							<div className="space-y-2">
								<CompanyIcons
									companies={currentIndustry.companies}
									iconSize={6}
									textSize="sm"
									maxVisible={12}
									clients={clients}
								/>
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
								<p className="text-sm">
									No companies associated with this industry
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Parameters Summary */}
			{parameterSummary && (
				<Card className="border shadow-sm py-2 gap-1 ">
					<CardHeader className="">
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
									className={`flex items-center gap-3 p-3 rounded-lg border flex-1 `}
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
	currentIndustry,
	parameterSummary,
	isEditing,
	onParameterChange,
	onAddParameter,
	onRemoveParameter,
}: {
	currentIndustry: Industry;
	parameterSummary?: Record<string, number> | null;
	isEditing?: boolean;
	onParameterChange: (
		index: number,
		field: keyof IndustryParameter,
		value: any
	) => void;
	onAddParameter: (category?: IndustryParameter["category"]) => void;
	onRemoveParameter: (index: number) => void;
}) {
	return (
		<TabsContent value="parameters" className="space-y-4">
			{currentIndustry?.parameters && currentIndustry.parameters.length > 0 ? (
				<div className="space-y-4">
					{Object.entries(
						groupParametersByCategory(currentIndustry.parameters)
					).map(([category, params]) => (
						<Card key={category} className="border shadow-sm p-4 px-0  gap-2">
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
										(param: IndustryParameter, categoryIndex: number) => {
											const globalIndex =
												currentIndustry.parameters?.findIndex(
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
													category as IndustryParameter["category"]
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
							This industry doesn't have any parameters defined yet.
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

function RenderIndustryRemoveDialog({
	industry,
	isConfirmingRemove,
	setIsConfirmingRemove,
	onIndustryDeleted,
}: {
	industry: Industry;
	isConfirmingRemove: boolean;
	setIsConfirmingRemove: (isConfirmingRemove: boolean) => void;
	onIndustryDeleted?: () => Promise<void>;
}) {
	const [isRemoving, setIsRemoving] = useState(false);

	const handleRemove = async () => {
		if (!industry) return;

		setIsRemoving(true);
		try {
			const result = await deleteIndustry(industry.id);

			if (result.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Industry removed successfully!");
			setIsConfirmingRemove(false);
			if (onIndustryDeleted) {
				await onIndustryDeleted();
			}
		} catch (error) {
			console.error("Error removing industry:", error);
			toast.error("Failed to remove industry. Please try again.");
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
						Remove Industry
					</DialogTitle>
					<DialogDescription className="space-y-2">
						<p>
							Are you sure you want to remove{" "}
							<strong>"{industry?.name}"</strong>?
						</p>
						<p className="text-sm text-muted-foreground">
							This will permanently delete the industry
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
						{isRemoving ? "Removing..." : "Remove Industry"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function RenderParameterRemoveDialog({
	industry,
	parameterToRemove,
	setParameterToRemove,
	confirmRemoveParameter,
}: {
	industry: Industry;
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
					<DialogTitle>Select Industry Icon</DialogTitle>
					<DialogDescription>
						Choose an icon that best represents this industry
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
										? "border-primary bg-primary/10"
										: "border-border hover:border-primary/50"
								}`}
							>
								<div className="flex flex-col items-center gap-2">
									<option.icon
										className={`h-8 w-8 ${
											isSelected ? "text-primary" : "text-muted-foreground"
										}`}
									/>
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
