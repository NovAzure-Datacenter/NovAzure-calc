"use client";

import { useState, useEffect } from "react";
import { 
	Plus, 
	X, 
	Building2, 
	ChevronDown,
	Zap,
	Wind,
	Droplets,
	Server,
	Wrench,
	Recycle,
	Car,
	Fuel,
	Cpu,
	Monitor,
	Settings,
	Leaf,
	Shield,
	Gauge
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
import type { Industry, Technology, IndustryParameter } from "../types";
import { createIndustry } from "@/lib/actions/industry/industry";
import {
	createTechnology,
	getTechnologies,
} from "@/lib/actions/technology/technology";
import {
	iconComponentToString,
	stringToIconComponent,
	iconOptions,
} from "../utils/icon-utils";
import { getCreateDialogCategoryColor } from "../utils/color-utils";
import React from "react";

interface CreateIndustryDialogProps {
	onCreate: (industry: Omit<Industry, "id" | "status">) => void;
}

export function CreateIndustryDialog({ onCreate }: CreateIndustryDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [technologies, setTechnologies] = useState<Technology[]>([]);
	const [availableTechnologies, setAvailableTechnologies] = useState<
		Technology[]
	>([]);
	const [newTechName, setNewTechName] = useState("");
	const [parameters, setParameters] = useState<IndustryParameter[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState<React.ComponentType<{ className?: string }>>(Building2);
	const [paramName, setParamName] = useState("");
	const [paramValue, setParamValue] = useState("");
	const [paramUnit, setParamUnit] = useState("");
	const [paramDescription, setParamDescription] = useState("");
	const [paramCategory, setParamCategory] =
		useState<IndustryParameter["category"]>("cost");

	useEffect(() => {
		if (open) {
			loadAvailableTechnologies();
		}
	}, [open]);

	const loadAvailableTechnologies = async () => {
		try {
			setIsLoadingTechnologies(true);
			const result = await getTechnologies();

			if (result.error) {
				toast.error(result.error);
				return;
			}

			const transformedTechnologies: Technology[] = (
				result.technologies || []
			).map((technology) => ({
				id: technology.id,
				name: technology.name,
				description: technology.description,
				icon: technology.icon
					? stringToIconComponent(technology.icon)
					: Building2,
				status: technology.status || "pending",
				applicableIndustries: technology.applicableIndustries || [],
				parameters: technology.parameters || [],
			}));

			setAvailableTechnologies(transformedTechnologies);
		} catch (error) {
			console.error("Error loading technologies:", error);
			toast.error("Failed to load available technologies");
		} finally {
			setIsLoadingTechnologies(false);
		}
	};

	const handleIconChange = (iconName: string) => {
		const selectedIconComponent =
			iconOptions.find((option) => option.value === iconName)?.icon ||
			Building2;
		setSelectedIcon(selectedIconComponent);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !description.trim()) return;

		setIsSubmitting(true);

		try {
			const technologyIds: string[] = [];

			for (const tech of technologies) {
				if (tech.id && tech.id !== Date.now().toString()) {
					technologyIds.push(tech.id);
					continue;
				}

				const technologyData = {
					name: tech.name,
					description: tech.description,
					icon: tech.icon ? iconComponentToString(tech.icon) : undefined,
					status: "pending" as const,
					applicableIndustries: [],
					parameters: [],
				};

				const result = await createTechnology(technologyData);
				if (result.error) {
					toast.error(
						`Failed to create technology ${tech.name}: ${result.error}`
					);
					return;
				}
				if (result.technologyId) {
					technologyIds.push(result.technologyId);
				}
			}

			const industryData = {
				name: name.trim(),
				description: description.trim(),
				technologies: technologyIds,
				icon: iconComponentToString(selectedIcon),
				parameters: parameters,
			};

			const result = await createIndustry(industryData);

			if (result.error) {
				toast.error(result.error);
				return;
			}

			const newIndustry: Omit<Industry, "id" | "status"> = {
				logo: selectedIcon,
				name: name.trim(),
				description: description.trim(),
				technologies,
				companies: [],
				parameters,
			};

			onCreate(newIndustry);
			toast.success("Industry created successfully!");
			setOpen(false);
			resetForm();
		} catch (error) {
			console.error("Error creating industry:", error);
			toast.error("Failed to create industry. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setName("");
		setDescription("");
		setTechnologies([]);
		setNewTechName("");
		setParameters([]);
		setSelectedIcon(Building2);
		setParamName("");
		setParamValue("");
		setParamUnit("");
		setParamDescription("");
		setParamCategory("cost");
	};

	const addTechnology = () => {
		if (!newTechName.trim()) return;

		const newTech: Technology = {
			name: newTechName.trim(),
			description: `Technology for ${newTechName.trim()}`,
			icon: Building2,
			status: "pending",
			applicableIndustries: [],
			parameters: [],
		};

		setTechnologies([...technologies, newTech]);
		setNewTechName("");
	};

	const selectExistingTechnology = (tech: Technology) => {
		const isAlreadySelected = technologies.some((t) => t.id === tech.id);
		if (!isAlreadySelected) {
			setTechnologies([...technologies, tech]);
		}
	};

	const removeTechnologyById = (id: string) => {
		setTechnologies(technologies.filter((t) => t.id !== id));
	};

	const addParameter = () => {
		if (
			!paramName.trim() ||
			!paramValue.trim() ||
			!paramUnit.trim() ||
			!paramDescription.trim()
		)
			return;

		const newParam: IndustryParameter = {
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

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="text-xs">
					<Plus className="h-4 w-4 mr-2" />
					New Industry
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
				<DialogHeader className="pb-4">
					<DialogTitle className="text-lg">Create New Industry</DialogTitle>
					<DialogDescription className="text-sm">
						Add a new industry with its associated technologies and parameters.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-6">
						{/* Industry Name and Description */}
						<div>
							<Label htmlFor="name" className="text-xs font-medium">
								Industry Name
							</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter industry name..."
								className="text-xs h-8"
								required
							/>
						</div>
						<div>
							<Label htmlFor="description" className="text-xs font-medium">
								Description
							</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Describe the industry..."
								rows={2}
								className="text-xs"
								required
							/>
						</div>

						{/* Industry Icon Selection */}
						<div>
							<Label className="text-xs font-medium">Industry Icon</Label>
							<div className="flex items-center gap-2 mt-1">
								<div className="flex items-center justify-center w-8 h-8 border rounded-md bg-gray-50">
									{React.createElement(selectedIcon, { className: "h-4 w-4 text-gray-600" })}
								</div>
								<Select onValueChange={handleIconChange} value={iconComponentToString(selectedIcon)}>
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

						{/* Technologies */}
						<div>
							<Label className="text-xs font-medium">Technologies</Label>
							<div className="space-y-2 mt-1">
								{/* Technology Multi-Select */}
								<Collapsible>
									<CollapsibleTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-between h-8 text-xs"
											disabled={isLoadingTechnologies}
										>
											<span>
												{isLoadingTechnologies
													? "Loading technologies..."
													: `Select Technologies (${technologies.length} selected)`}
											</span>
											<ChevronDown className="h-3 w-3" />
										</Button>
									</CollapsibleTrigger>
									<CollapsibleContent className="mt-1">
										<div className="border rounded-md p-2 bg-gray-50">
											{isLoadingTechnologies ? (
												<div className="flex items-center justify-center py-4">
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
													<span className="ml-2 text-xs text-muted-foreground">
														Loading technologies...
													</span>
												</div>
											) : (
												<div className="grid grid-cols-2 gap-1 max-h-[150px] overflow-y-auto">
													{availableTechnologies.map((tech) => {
														const isSelected = technologies.some(
															(t) => t.id === tech.id
														);
														return (
															<div
																key={tech.id}
																className="flex items-center space-x-2 p-1 rounded hover:bg-white"
															>
																<Checkbox
																	id={tech.id || `tech-${tech.name}`}
																	checked={isSelected}
																	onCheckedChange={(checked) => {
																		if (checked) {
																			selectExistingTechnology(tech);
																		} else {
																			removeTechnologyById(tech.id || "");
																		}
																	}}
																	className="h-3 w-3"
																/>
																<label
																	htmlFor={tech.id || `tech-${tech.name}`}
																	className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
																>
																	<div className="flex items-center gap-1">
																		<tech.icon className="h-3 w-3" />
																		<span className="truncate">
																			{tech.name}
																		</span>
																	</div>
																</label>
															</div>
														);
													})}
												</div>
											)}
										</div>
									</CollapsibleContent>
								</Collapsible>

								{/* Add custom technology */}
								<div className="flex gap-2">
									<Input
										value={newTechName}
										onChange={(e) => setNewTechName(e.target.value)}
										placeholder="Or add a custom technology..."
										className="text-xs h-7"
										onKeyPress={(e) =>
											e.key === "Enter" && (e.preventDefault(), addTechnology())
										}
									/>
									<Button
										type="button"
										variant="outline"
										onClick={addTechnology}
										disabled={!newTechName.trim()}
										className="h-7 px-2"
									>
										<Plus className="h-3 w-3" />
									</Button>
								</div>

								{/* Selected technologies */}
								{technologies.length > 0 && (
									<div className="space-y-1">
										<div className="text-xs font-medium text-gray-700">
											Selected Technologies:
										</div>
										<div className="flex flex-wrap gap-1">
											{technologies.map((tech) => (
												<Badge
													key={tech.id || tech.name}
													variant="secondary"
													className="flex items-center gap-1 text-xs px-2 py-1"
												>
													{tech.icon && <tech.icon className="h-3 w-3" />}
													<span className="truncate max-w-[100px]">
														{tech.name}
													</span>
													<button
														type="button"
														onClick={() => removeTechnologyById(tech.id || "")}
														className="ml-1 hover:text-destructive"
													>
														<X className="h-3 w-3" />
													</button>
												</Badge>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Parameters */}
						<div>
							<Label className="text-xs font-medium">Industry Parameters</Label>
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
										onValueChange={(value: IndustryParameter["category"]) =>
											setParamCategory(value)
										}
									>
										<SelectTrigger className="text-xs h-7 px-3" size="sm">
											<SelectValue placeholder="Category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="cost">Cost</SelectItem>
											<SelectItem value="performance">Performance</SelectItem>
											<SelectItem value="environmental">
												Environmental
											</SelectItem>
											<SelectItem value="operational">Operational</SelectItem>
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
							disabled={!name.trim() || !description.trim() || isSubmitting}
							className="text-xs h-8"
						>
							{isSubmitting ? "Creating..." : "Create Industry"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
