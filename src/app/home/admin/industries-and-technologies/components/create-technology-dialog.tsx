"use client";

import { useState, useEffect } from "react";
import {
	Plus,
	Building2,
	Zap,
	Wind,
	Droplets,
	Server,
	Wrench,
	Recycle,
	Car,
	Fuel,
	X,
	ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import type { Technology, TechnologyParameter } from "../types";
import { createTechnology } from "@/lib/actions/technology/technology";
import { getIndustries as getIndustriesAction } from "@/lib/actions/industry/industry";
import {
	iconComponentToString,
	stringToIconComponent,
} from "../utils/icon-utils";
import { getCreateDialogCategoryColor } from "../utils/color-utils";

const technologyStatuses = [
	{ value: "verified", label: "Verified" },
	{ value: "pending", label: "Pending" },
];

const iconOptions = [
	{ value: "Building2", label: "Building", icon: Building2 },
	{ value: "Zap", label: "Energy", icon: Zap },
	{ value: "Wind", label: "Cooling", icon: Wind },
	{ value: "Droplets", label: "Water", icon: Droplets },
	{ value: "Server", label: "Server", icon: Server },
	{ value: "Wrench", label: "Tools", icon: Wrench },
	{ value: "Recycle", label: "Recycling", icon: Recycle },
	{ value: "Car", label: "Transport", icon: Car },
	{ value: "Fuel", label: "Fuel", icon: Fuel },
];

interface CreateTechnologyDialogProps {
	onCreate: (technology: Technology) => void;
}

export function CreateTechnologyDialog({
	onCreate,
}: CreateTechnologyDialogProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		status: "pending",
		icon: Building2,
	});
	const [parameters, setParameters] = useState<TechnologyParameter[]>([]);
	const [applicableIndustries, setApplicableIndustries] = useState<string[]>(
		[]
	);
	const [availableIndustries, setAvailableIndustries] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [paramName, setParamName] = useState("");
	const [paramValue, setParamValue] = useState("");
	const [paramUnit, setParamUnit] = useState("");
	const [paramDescription, setParamDescription] = useState("");
	const [paramCategory, setParamCategory] = useState<
		"cost" | "performance" | "environmental" | "other"
	>("cost");

	useEffect(() => {
		if (open) {
			loadAvailableIndustries();
		}
	}, [open]);

	const loadAvailableIndustries = async () => {
		try {
			setIsLoadingIndustries(true);
			const result = await getIndustriesAction();

			if (result.error) {
				toast.error(result.error);
				return;
			}

			const industries = (result.industries || []).map((industry) => ({
				id: industry.id,
				name: industry.name,
			}));

			setAvailableIndustries(industries);
		} catch (error) {
			console.error("Error loading industries:", error);
			toast.error("Failed to load available industries");
		} finally {
			setIsLoadingIndustries(false);
		}
	};

	const handleInputChange = (field: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleIconChange = (iconName: string) => {
		const selectedIcon =
			iconOptions.find((option) => option.value === iconName)?.icon ||
			Building2;
		setFormData((prev) => ({ ...prev, icon: selectedIcon }));
	};

	const addParameter = () => {
		if (
			!paramName.trim() ||
			!paramValue.trim() ||
			!paramUnit.trim() ||
			!paramDescription.trim()
		)
			return;

		const newParam: TechnologyParameter = {
			name: paramName.trim(),
			value: parseFloat(paramValue) || 0,
			unit: paramUnit.trim(),
			description: paramDescription.trim(),
			category: paramCategory,
		};

		setParameters([...parameters, newParam]);
		setParamName("");
		setParamValue("");
		setParamUnit("");
		setParamDescription("");
		setParamCategory("cost");
	};

	const removeParameter = (index: number) => {
		setParameters(parameters.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name.trim() || !formData.description.trim()) return;

		setIsSubmitting(true);

		try {
			const technologyData = {
				name: formData.name.trim(),
				description: formData.description.trim(),
				icon: formData.icon ? iconComponentToString(formData.icon) : undefined,
				status: formData.status as Technology["status"],
				applicableIndustries: applicableIndustries,
				parameters: parameters,
			};

			const result = await createTechnology(technologyData);

			if (result.error) {
				toast.error(result.error);
				return;
			}

			const newTechnology: Technology = {
				id: Date.now().toString(),
				name: formData.name.trim(),
				description: formData.description.trim(),
				icon: formData.icon,
				status: formData.status as Technology["status"],
				applicableIndustries: applicableIndustries,
				parameters: parameters,
			};

			onCreate(newTechnology);
			toast.success("Technology created successfully!");
			setOpen(false);
			resetForm();
		} catch (error) {
			console.error("Error creating technology:", error);
			toast.error("Failed to create technology. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			status: "pending",
			icon: Building2,
		});
		setParameters([]);
		setApplicableIndustries([]);
		setParamName("");
		setParamValue("");
		setParamUnit("");
		setParamDescription("");
		setParamCategory("cost");
	};

	const isFormValid = formData.name.trim() && formData.description.trim();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="text-xs">
					<Plus className="h-4 w-4 mr-2" />
					New Technology
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
				<DialogHeader className="pb-4">
					<DialogTitle className="text-lg">Create New Technology</DialogTitle>
					<DialogDescription className="text-sm">
						Add a new technology with its parameters and applicable industries.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-6">
						{/* Technology Name and Description */}
						<div className="space-y-4">
							<div>
								<Label htmlFor="tech-name" className="text-xs font-medium">
									Technology Name
								</Label>
								<Input
									id="tech-name"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="Enter technology name..."
									className="text-xs h-8"
									required
								/>
							</div>
							<div>
								<Label
									htmlFor="tech-description"
									className="text-xs font-medium"
								>
									Description
								</Label>
								<Textarea
									id="tech-description"
									value={formData.description}
									onChange={(e) =>
										handleInputChange("description", e.target.value)
									}
									placeholder="Describe the technology, its benefits, and applications..."
									rows={2}
									className="text-xs"
									required
								/>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<div>
									<Label htmlFor="tech-status" className="text-xs font-medium">
										Status
									</Label>
									<Select
										value={formData.status}
										onValueChange={(value) =>
											handleInputChange("status", value)
										}
									>
										<SelectTrigger className="text-xs h-8">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{technologyStatuses.map((status) => (
												<SelectItem key={status.value} value={status.value}>
													{status.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="tech-icon" className="text-xs font-medium">
										Icon
									</Label>
									<Select onValueChange={handleIconChange}>
										<SelectTrigger className="text-xs h-8">
											<SelectValue placeholder="Select icon" />
										</SelectTrigger>
										<SelectContent>
											{iconOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													<div>
														<option.icon className="h-4 w-4" />
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Applicable Industries */}
						<div>
							<Label className="text-xs font-medium">
								Applicable Industries
							</Label>
							<div className="space-y-2 mt-1">
								<Collapsible>
									<CollapsibleTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-between h-8 text-xs"
											disabled={isLoadingIndustries}
										>
											<span>
												{isLoadingIndustries
													? "Loading industries..."
													: `Select Industries (${applicableIndustries.length} selected)`}
											</span>
											<ChevronDown className="h-3 w-3" />
										</Button>
									</CollapsibleTrigger>
									<CollapsibleContent className="mt-1">
										<div className="border rounded-md p-2 bg-gray-50">
											{isLoadingIndustries ? (
												<div className="flex items-center justify-center py-4">
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
													<span className="ml-2 text-xs text-muted-foreground">
														Loading industries...
													</span>
												</div>
											) : (
												<div className="grid grid-cols-1 gap-1 max-h-[150px] overflow-y-auto">
													{availableIndustries.map((industry) => {
														const isSelected = applicableIndustries.includes(
															industry.id
														);
														return (
															<div
																key={industry.id}
																className="flex items-center space-x-2 p-1 rounded hover:bg-white"
															>
																<Checkbox
																	id={industry.id}
																	checked={isSelected}
																	onCheckedChange={(checked) => {
																		if (checked) {
																			setApplicableIndustries([
																				...applicableIndustries,
																				industry.id,
																			]);
																		} else {
																			setApplicableIndustries(
																				applicableIndustries.filter(
																					(id) => id !== industry.id
																				)
																			);
																		}
																	}}
																	className="h-3 w-3"
																/>
																<label
																	htmlFor={industry.id}
																	className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
																>
																	{industry.name}
																</label>
															</div>
														);
													})}
												</div>
											)}
										</div>
									</CollapsibleContent>
								</Collapsible>

								{/* Selected industries display */}
								{applicableIndustries.length > 0 && (
									<div className="space-y-1">
										<div className="text-xs font-medium text-gray-700">
											Selected Industries:
										</div>
										<div className="flex flex-wrap gap-1">
											{applicableIndustries.map((industryId) => {
												const industry = availableIndustries.find(
													(i) => i.id === industryId
												);
												return (
													<Badge
														key={industryId}
														variant="secondary"
														className="flex items-center gap-1 text-xs px-2 py-1"
													>
														<span className="truncate max-w-[100px]">
															{industry?.name || industryId}
														</span>
														<button
															type="button"
															onClick={() =>
																setApplicableIndustries(
																	applicableIndustries.filter(
																		(id) => id !== industryId
																	)
																)
															}
															className="ml-1 hover:text-destructive"
														>
															<X className="h-3 w-3" />
														</button>
													</Badge>
												);
											})}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Parameters */}
						<div>
							<Label className="text-xs font-medium">
								Technology Parameters
							</Label>
							<div className="space-y-2 mt-1">
								{/* Parameter Form */}
								<div className="grid grid-cols-5 gap-1">
									<Input
										value={paramName}
										onChange={(e) => setParamName(e.target.value)}
										placeholder="Name..."
										className="text-xs h-8"
									/>
									<Input
										value={paramValue}
										onChange={(e) => setParamValue(e.target.value)}
										placeholder="Value..."
										type="number"
										step="any"
										className="text-xs h-8"
									/>
									<Input
										value={paramUnit}
										onChange={(e) => setParamUnit(e.target.value)}
										placeholder="Unit..."
										className="text-xs h-8"
									/>
									<Select
										value={paramCategory}
										onValueChange={(
											value: "cost" | "performance" | "environmental" | "other"
										) => setParamCategory(value)}
									>
										<SelectTrigger className="text-xs h-7 px-3 " size="sm">
											<SelectValue placeholder="Category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cost">Cost</SelectItem>
											<SelectItem value="performance">Performance</SelectItem>
											<SelectItem value="environmental">
												Environmental
											</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
									<Button
										type="button"
										variant="outline"
										onClick={addParameter}
										disabled={
											!paramName.trim() ||
											!paramValue.trim() ||
											!paramUnit.trim()
										}
										className="text-xs h-8 px-2"
									>
										<Plus className="h-3 w-3" />
									</Button>
								</div>
								<Input
									value={paramDescription}
									onChange={(e) => setParamDescription(e.target.value)}
									placeholder="Parameter description..."
									className="text-xs h-8"
								/>

								{/* Parameters Table */}
								{parameters.length > 0 && (
									<div className="border rounded-md overflow-hidden">
										<div className="bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 grid grid-cols-5 gap-1">
											<div>Name</div>
											<div>Value</div>
											<div>Unit</div>
											<div>Category</div>
											<div>Actions</div>
										</div>
										<ScrollArea className="h-[150px]">
											{parameters.map((param, index) => (
												<div
													key={index}
													className="px-2 py-1 text-xs border-t grid grid-cols-5 gap-1 items-center hover:bg-gray-50"
												>
													<div
														className="font-medium truncate"
														title={param.name}
													>
														{param.name}
													</div>
													<div>{param.value}</div>
													<div>{param.unit}</div>
													<div>
														<Badge
															className={`text-xs px-1 py-0 ${getCreateDialogCategoryColor(
																param.category
															)}`}
														>
															{param.category}
														</Badge>
													</div>
													<div>
														<button
															type="button"
															onClick={() => removeParameter(index)}
															className="text-red-500 hover:text-red-700"
															title={param.description}
														>
															<X className="h-3 w-3" />
														</button>
													</div>
												</div>
											))}
										</ScrollArea>
									</div>
								)}
							</div>
						</div>
					</div>
					<DialogFooter className="pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							className="text-xs h-8"
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!isFormValid || isSubmitting}
							className="text-xs h-8"
						>
							{isSubmitting ? "Creating..." : "Create Technology"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
