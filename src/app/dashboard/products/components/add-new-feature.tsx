"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	ChevronRight,
	ChevronLeft,
	Check,
	X,
	Plus,
	Trash2,
	Building2,
	Cpu,
	Wrench,
	Package,
	Upload,
	FileText,
} from "lucide-react";
import { mockData } from "../constants";

interface Parameter {
	id: string;
	level: string;
	parameter: string;
	defaultValue: string;
	overrideValue: string;
	units: string;
	description: string;
}

interface Calculation {
	id: string;
	name: string;
	formula: string;
	result: string;
	units: string;
	description: string;
}

export interface NewProductData {
	industry: string;
	customIndustry?: string;
	technologies: string[];
	customTechnologies: string[];
	solutionName: string;
	keyFeatures: string[];
	description: string;
	valueGenerated: string;
	productCount: number;
	parameters: Parameter[];
	calculations: Calculation[];
	showCustomTechInput: boolean;
	uploadedFiles: File[];
}

interface AddNewFeatureProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: NewProductData) => void;
}

const steps = [
	{ id: 1, name: "Industry", icon: Building2 },
	{ id: 2, name: "Technology", icon: Cpu },
	{ id: 3, name: "Solution", icon: Wrench },
	{ id: 4, name: "Products", icon: Package },
	{ id: 5, name: "Documents", icon: Upload },
];

export default function AddNewFeature({
	open,
	onOpenChange,
	onSubmit,
}: AddNewFeatureProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<NewProductData>({
		industry: "",
		customIndustry: "",
		technologies: [],
		customTechnologies: [],
		solutionName: "",
		keyFeatures: [],
		description: "",
		valueGenerated: "",
		productCount: 1,
		parameters: [
			{
				id: "1",
				level: "L1",
				parameter: "Facility Size",
				defaultValue: "1000",
				overrideValue: "1000",
				units: "m²",
				description: "Total facility floor area",
			},
			{
				id: "2",
				level: "L1",
				parameter: "Operating Hours",
				defaultValue: "24",
				overrideValue: "24",
				units: "hours/day",
				description: "Daily operational hours",
			},
		],
		calculations: [
			{
				id: "1",
				name: "Total CAPEX",
				formula: "equipment_cost + installation_cost + commissioning_cost",
				result: "140000.00",
				units: "$",
				description: "Total Capital Expenditure for the system",
			},
			{
				id: "2",
				name: "Annual OPEX",
				formula: "energy_cost + maintenance_cost + labor_cost",
				result: "142000.00",
				units: "$/year",
				description: "Annual Operating Expenditure",
			},
		],
		showCustomTechInput: false,
		uploadedFiles: [],
	});

	// Get available industries from mock data
	const availableIndustries = mockData.industries.map((industry) => ({
		value: industry.id,
		label: industry.name,
	}));

	// Get available technologies based on selected industry
	const getAvailableTechnologies = () => {
		if (!formData.industry) return [];
		const industry = mockData.industries.find(
			(ind) => ind.id === formData.industry
		);
		return (
			industry?.technologies.map((tech) => ({
				value: tech.id,
				label: tech.name,
			})) || []
		);
	};

	const [_industryOpen, _setIndustryOpen] = useState(false);
	const [_technologyOpen, _setTechnologyOpen] = useState(false);
	const [newFeature, setNewFeature] = useState("");

	const handleNext = () => {
		if (currentStep < 5) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = () => {
		onSubmit(formData);
		onOpenChange(false);
		// Reset form
		setCurrentStep(1);
		setFormData({
			industry: "",
			customIndustry: "",
			technologies: [],
			customTechnologies: [],
			solutionName: "",
			keyFeatures: [],
			description: "",
			valueGenerated: "",
			productCount: 1,
			parameters: [],
			calculations: [],
			showCustomTechInput: false,
			uploadedFiles: [],
		});
	};

	const addParameter = () => {
		const newParam: Parameter = {
			id: Date.now().toString(),
			level: "L1",
			parameter: "",
			defaultValue: "",
			overrideValue: "",
			units: "",
			description: "",
		};
		setFormData((prev) => ({
			...prev,
			parameters: [...prev.parameters, newParam],
		}));
	};

	const updateParameter = (
		id: string,
		field: keyof Parameter,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			parameters: prev.parameters.map((param) =>
				param.id === id ? { ...param, [field]: value } : param
			),
		}));
	};

	const removeParameter = (id: string) => {
		setFormData((prev) => ({
			...prev,
			parameters: prev.parameters.filter((param) => param.id !== id),
		}));
	};

	const addCalculation = () => {
		const newCalc: Calculation = {
			id: Date.now().toString(),
			name: "",
			formula: "",
			result: "",
			units: "",
			description: "",
		};
		setFormData((prev) => ({
			...prev,
			calculations: [...prev.calculations, newCalc],
		}));
	};

	const updateCalculation = (
		id: string,
		field: keyof Calculation,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			calculations: prev.calculations.map((calc) =>
				calc.id === id ? { ...calc, [field]: value } : calc
			),
		}));
	};

	const removeCalculation = (id: string) => {
		setFormData((prev) => ({
			...prev,
			calculations: prev.calculations.filter((calc) => calc.id !== id),
		}));
	};

	const addKeyFeature = () => {
		if (newFeature.trim()) {
			setFormData((prev) => ({
				...prev,
				keyFeatures: [...prev.keyFeatures, newFeature.trim()],
			}));
			setNewFeature("");
		}
	};

	const removeKeyFeature = (index: number) => {
		setFormData((prev) => ({
			...prev,
			keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
		}));
	};

	const toggleTechnology = (techId: string) => {
		setFormData((prev) => ({
			...prev,
			technologies: prev.technologies.includes(techId)
				? prev.technologies.filter((id) => id !== techId)
				: [...prev.technologies, techId],
		}));
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const newFiles = Array.from(files);
			setFormData((prev) => ({
				...prev,
				uploadedFiles: [...prev.uploadedFiles, ...newFiles],
			}));
		}
	};

	const removeFile = (index: number) => {
		setFormData((prev) => ({
			...prev,
			uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
		}));
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Building2 className="h-5 w-5" />
									<span>Industry Selection</span>
								</CardTitle>
								<CardDescription>
									Select the industry where this solution will be implemented.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
									<div className="flex flex-col space-y-1">
										<Label className="text-sm font-medium">
											Industry
										</Label>
										<CardDescription className="text-xs">
											Choose from data centers, manufacturing, buildings & HVAC, renewable energy, transportation, or custom.
										</CardDescription>
									</div>
									<div className="space-y-2">
										<Select
											value={formData.industry}
											onValueChange={(value) => {
												setFormData((prev) => ({
													...prev,
													industry: value,
												}));
											}}
										>
											<SelectTrigger className="w-full h-10">
												<SelectValue placeholder="Select industry..." />
											</SelectTrigger>
											<SelectContent>
												{availableIndustries.map((industry) => (
													<SelectItem key={industry.value} value={industry.value}>
														{industry.label}
													</SelectItem>
												))}
												<SelectItem value="custom">
													Custom Industry
												</SelectItem>
											</SelectContent>
										</Select>

										{formData.industry === "custom" && (
											<div className="mt-4">
												<Label className="text-sm font-medium">Custom Industry Name</Label>
												<Input
													placeholder="Enter custom industry name"
													value={formData.customIndustry}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															customIndustry: e.target.value,
														}))
													}
													className="mt-2"
												/>
											</div>
										)}
									</div>
								</div>

								<Separator />

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
									<div className="flex flex-col space-y-1">
										<Label className="text-sm font-medium">
											Application Area
										</Label>
										<CardDescription className="text-xs">
											Select the primary application area for this solution.
										</CardDescription>
									</div>
									<div className="space-y-2">
										<Select
											onValueChange={(value) =>
												setFormData((prev) => ({ ...prev, applicationArea: value }))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select application area" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="new-construction">
													New Construction
												</SelectItem>
												<SelectItem value="retrofit">Retrofit/Upgrade</SelectItem>
												<SelectItem value="replacement">
													Equipment Replacement
												</SelectItem>
												<SelectItem value="expansion">Capacity Expansion</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				);

			case 2:
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Cpu className="h-5 w-5" />
									<span>Technology Selection</span>
								</CardTitle>
								<CardDescription>
									Choose one or more technologies that apply to your solution.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
									<div className="flex flex-col space-y-1">
										<Label className="text-sm font-medium">
											Technologies
										</Label>
										<CardDescription className="text-xs">
											{formData.industry && formData.industry !== "custom" 
												? "Select from available technologies for your industry."
												: "Enter custom technologies for your solution."
											}
										</CardDescription>
									</div>
									<div className="space-y-2">
										{formData.industry && formData.industry !== "custom" ? (
											<>
												<Select
													onValueChange={(value) => {
														// Toggle technology selection
														toggleTechnology(value);
													}}
												>
													<SelectTrigger className="w-full h-10">
														<SelectValue placeholder="Select technologies..." />
													</SelectTrigger>
													<SelectContent>
														{getAvailableTechnologies().map((tech) => (
															<SelectItem key={tech.value} value={tech.value}>
																{tech.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>

												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => {
														setFormData((prev) => ({
															...prev,
															showCustomTechInput: true,
														}));
													}}
													className="w-full"
												>
													<Plus className="h-4 w-4 mr-2" />
													Add Custom Technology
												</Button>

												{/* Custom Technology Input */}
												{formData.showCustomTechInput && (
													<div className="mt-4 p-4 border rounded-lg bg-gray-50">
														<Label className="text-sm font-medium">Add Custom Technology</Label>
														<div className="flex gap-2 mt-2">
															<Input
																placeholder="Enter custom technology name"
																value={newFeature}
																onChange={(e) => setNewFeature(e.target.value)}
																onKeyPress={(e) => {
																	if (e.key === "Enter") {
																		if (newFeature.trim()) {
																			setFormData((prev) => ({
																				...prev,
																				customTechnologies: [...prev.customTechnologies, newFeature.trim()],
																			}));
																			setNewFeature("");
																		}
																	}
																}}
															/>
															<Button
																size="sm"
																onClick={() => {
																	if (newFeature.trim()) {
																		setFormData((prev) => ({
																			...prev,
																			customTechnologies: [...prev.customTechnologies, newFeature.trim()],
																		}));
																		setNewFeature("");
																	}
																}}
															>
																Add
															</Button>
															<Button
																size="sm"
																variant="outline"
																onClick={() => {
																	setFormData((prev) => ({
																		...prev,
																		showCustomTechInput: false,
																	}));
																	setNewFeature("");
																}}
															>
																Cancel
															</Button>
														</div>
													</div>
												)}

												{/* All Selected Technologies Display */}
												{(formData.technologies.length > 0 || formData.customTechnologies.length > 0) && (
													<div className="mt-4">
														<Label className="text-sm font-medium">
															Selected Technologies:
														</Label>
														<div className="flex flex-wrap gap-2 mt-2">
															{/* Default Technologies */}
															{formData.technologies.map((techId) => {
																const tech = getAvailableTechnologies().find(
																	(t) => t.value === techId
																);
																return (
																	<Badge
																		key={`default-${techId}`}
																		variant="secondary"
																		className="flex items-center gap-1 cursor-pointer hover:bg-red-100"
																		onClick={() => toggleTechnology(techId)}
																	>
																		{tech?.label}
																		<X className="h-3 w-3" />
																	</Badge>
																);
															})}
															{/* Custom Technologies */}
															{formData.customTechnologies.map((tech, index) => (
																<Badge
																	key={`custom-${index}`}
																	variant="secondary"
																	className="flex items-center gap-1 cursor-pointer hover:bg-red-100"
																	onClick={() =>
																		setFormData((prev) => ({
																			...prev,
																			customTechnologies:
																				prev.customTechnologies.filter(
																					(_, i) => i !== index
																				),
																		}))
																	}
																>
																	{tech}
																	<X className="h-3 w-3" />
																</Badge>
															))}
														</div>
													</div>
												)}
											</>
										) : (
											<div className="space-y-4">
												<div>
													<Label className="text-sm font-medium">Custom Technologies</Label>
													<Textarea
														placeholder="Enter technologies, one per line"
														value={formData.customTechnologies.join("\n")}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																customTechnologies: e.target.value
																	.split("\n")
																	.filter((t) => t.trim()),
															}))
														}
														className="mt-2"
														rows={4}
													/>
												</div>

												{formData.customTechnologies.length > 0 && (
													<div>
														<Label className="text-sm font-medium">
															Custom Technologies:
														</Label>
														<div className="flex flex-wrap gap-2 mt-2">
															{formData.customTechnologies.map((tech, index) => (
																<Badge
																	key={index}
																	variant="secondary"
																	className="flex items-center gap-1 cursor-pointer hover:bg-red-100"
																	onClick={() =>
																		setFormData((prev) => ({
																			...prev,
																			customTechnologies:
																				prev.customTechnologies.filter(
																					(_, i) => i !== index
																				),
																		}))
																	}
																>
																	{tech}
																	<X className="h-3 w-3" />
																</Badge>
															))}
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				);

			case 3:
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Wrench className="h-5 w-5" />
									<span>Solution Details</span>
								</CardTitle>
								<CardDescription>
									Define your solution name, features, and description.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
									<div className="flex flex-col space-y-1">
										<Label className="text-sm font-medium">Solution Name</Label>
										<CardDescription className="text-xs">
											Enter a descriptive name for your solution.
										</CardDescription>
									</div>
									<div className="space-y-2">
										<Input
											placeholder="Enter solution name"
											value={formData.solutionName}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													solutionName: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								<Separator />

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
									<div className="flex flex-col space-y-1">
										<Label className="text-sm font-medium">Key Features</Label>
										<CardDescription className="text-xs">
											Add the main features of your solution.
										</CardDescription>
									</div>
									<div className="space-y-2">
										<div className="flex gap-2">
											<Input
												placeholder="Add a key feature"
												value={newFeature}
												onChange={(e) => setNewFeature(e.target.value)}
												onKeyPress={(e) => e.key === "Enter" && addKeyFeature()}
											/>
											<Button onClick={addKeyFeature} size="sm">
												<Plus className="h-4 w-4" />
											</Button>
										</div>
										{formData.keyFeatures.length > 0 && (
											<div className="flex flex-wrap gap-2 mt-3">
												{formData.keyFeatures.map((feature, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="flex items-center gap-1 cursor-pointer hover:bg-red-100"
														onClick={() => removeKeyFeature(index)}
													>
														{feature}
														<X className="h-3 w-3" />
													</Badge>
												))}
											</div>
										)}
									</div>
								</div>

								<Separator />

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
									<div className="flex flex-col space-y-1">
										<Label className="text-sm font-medium">
											Description and Value
										</Label>
										<CardDescription className="text-xs">
											Describe the solution and the value it provides.
										</CardDescription>
									</div>
									<div className="space-y-2">
										<Textarea
											placeholder="Describe the solution and the value it provides"
											value={formData.description}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													description: e.target.value,
												}))
											}
											rows={4}
										/>
									</div>
								</div>

								<Separator />

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
									<div className="flex flex-col space-y-1">
										<Label className="text-sm font-medium">
											Product Count
										</Label>
										<CardDescription className="text-xs">
											How many products within this solution?
										</CardDescription>
									</div>
									<div className="space-y-2">
										<Input
											type="number"
											min="1"
											value={formData.productCount}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													productCount: Number.parseInt(e.target.value) || 1,
												}))
											}
											className="w-24"
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				);

			case 4:
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Package className="h-5 w-5" />
									<span>Parameters & Calculations</span>
								</CardTitle>
								<CardDescription>
									Define system parameters and financial calculations.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Tabs defaultValue="parameters" className="w-full">
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger value="parameters">Parameters</TabsTrigger>
										<TabsTrigger value="calculations">Calculations</TabsTrigger>
									</TabsList>

									<TabsContent value="parameters" className="space-y-4">
										<div className="flex justify-between items-center">
											<Label className="text-base font-medium">
												System Parameters
											</Label>
										</div>

										<div className="border rounded-lg overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Level</TableHead>
														<TableHead>Parameter</TableHead>
														<TableHead>Default Value</TableHead>
														<TableHead>Override Value</TableHead>
														<TableHead>Units</TableHead>
														<TableHead>Description</TableHead>
														<TableHead className="w-[50px]"></TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{formData.parameters.map((param, index) => (
														<TableRow key={param.id}>
															<TableCell>
																<Input
																	value={param.level}
																	onChange={(e) =>
																		updateParameter(
																			param.id,
																			"level",
																			e.target.value
																		)
																	}
																	className="w-16"
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={param.parameter}
																	onChange={(e) =>
																		updateParameter(
																			param.id,
																			"parameter",
																			e.target.value
																		)
																	}
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={param.defaultValue}
																	onChange={(e) =>
																		updateParameter(
																			param.id,
																			"defaultValue",
																			e.target.value
																		)
																	}
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={param.overrideValue}
																	onChange={(e) =>
																		updateParameter(
																			param.id,
																			"overrideValue",
																			e.target.value
																		)
																	}
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={param.units}
																	onChange={(e) =>
																		updateParameter(
																			param.id,
																			"units",
																			e.target.value
																		)
																	}
																	className="w-20"
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={param.description}
																	onChange={(e) =>
																		updateParameter(
																			param.id,
																			"description",
																			e.target.value
																		)
																	}
																/>
															</TableCell>
															<TableCell>
																{index === formData.parameters.length - 1 ? (
																	<Button
																		onClick={addParameter}
																		size="sm"
																		variant="outline"
																		className="text-green-600 hover:text-green-700"
																	>
																		<Plus className="h-4 w-4" />
																	</Button>
																) : (
																	<Button
																		onClick={() => removeParameter(param.id)}
																		size="sm"
																		variant="ghost"
																		className="text-red-500 hover:text-red-700"
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																)}
															</TableCell>
														</TableRow>
													))}
													{/* Always show at least one empty row */}
													{formData.parameters.length === 0 && (
														<TableRow>
															<TableCell>
																<Input
																	placeholder="L1"
																	className="w-16"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Enter parameter name"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Default value"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Override value"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Units"
																	className="w-20"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Description"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Button
																	onClick={addParameter}
																	size="sm"
																	variant="outline"
																	className="text-green-600 hover:text-green-700"
																>
																	<Plus className="h-4 w-4" />
																</Button>
															</TableCell>
														</TableRow>
													)}
												</TableBody>
											</Table>
										</div>
									</TabsContent>

									<TabsContent value="calculations" className="space-y-4">
										<div className="flex justify-between items-center">
											<Label className="text-base font-medium">
												Financial Calculations
											</Label>
										</div>

										<div className="border rounded-lg overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead>Name</TableHead>
														<TableHead>Formula</TableHead>
														<TableHead>Result</TableHead>
														<TableHead>Units</TableHead>
														<TableHead>Description</TableHead>
														<TableHead className="w-[50px]"></TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{formData.calculations.map((calc, index) => (
														<TableRow key={calc.id}>
															<TableCell>
																<Input
																	value={calc.name}
																	onChange={(e) =>
																		updateCalculation(
																			calc.id,
																			"name",
																			e.target.value
																		)
																	}
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={calc.formula}
																	onChange={(e) =>
																		updateCalculation(
																			calc.id,
																			"formula",
																			e.target.value
																		)
																	}
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={calc.result}
																	onChange={(e) =>
																		updateCalculation(
																			calc.id,
																			"result",
																			e.target.value
																		)
																	}
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={calc.units}
																	onChange={(e) =>
																		updateCalculation(
																			calc.id,
																			"units",
																			e.target.value
																		)
																	}
																	className="w-20"
																/>
															</TableCell>
															<TableCell>
																<Input
																	value={calc.description}
																	onChange={(e) =>
																		updateCalculation(
																			calc.id,
																			"description",
																			e.target.value
																		)
																	}
																/>
															</TableCell>
															<TableCell>
																{index === formData.calculations.length - 1 ? (
																	<Button
																		onClick={addCalculation}
																		size="sm"
																		variant="outline"
																		className="text-green-600 hover:text-green-700"
																	>
																		<Plus className="h-4 w-4" />
																	</Button>
																) : (
																	<Button
																		onClick={() => removeCalculation(calc.id)}
																		size="sm"
																		variant="ghost"
																		className="text-red-500 hover:text-red-700"
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																)}
															</TableCell>
														</TableRow>
													))}
													{/* Always show at least one empty row */}
													{formData.calculations.length === 0 && (
														<TableRow>
															<TableCell>
																<Input
																	placeholder="Calculation name"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Enter formula"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Result"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Units"
																	className="w-20"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Input
																	placeholder="Description"
																	disabled
																/>
															</TableCell>
															<TableCell>
																<Button
																	onClick={addCalculation}
																	size="sm"
																	variant="outline"
																	className="text-green-600 hover:text-green-700"
																>
																	<Plus className="h-4 w-4" />
																</Button>
															</TableCell>
														</TableRow>
													)}
												</TableBody>
											</Table>
										</div>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</div>
				);

			case 5:
				return (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Upload className="h-5 w-5" />
									<span>Document Upload</span>
								</CardTitle>
								<CardDescription>
									Upload product specifications and any additional documentation.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
									<div className="flex flex-col space-y-1">
										<Label className="text-sm font-medium">Upload Files</Label>
										<CardDescription className="text-xs">
											Add product specifications, technical documents, or any other relevant files.
										</CardDescription>
									</div>
									<div className="space-y-2">
										<div 
											className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
											onClick={() => document.getElementById('file-upload')?.click()}
										>
											<Upload className="h-8 w-8 mx-auto text-gray-400 mb-4" />
											<div className="space-y-1">
												<p className="text-sm font-medium text-gray-600">
													Click to upload files
												</p>
												<p className="text-xs text-gray-500">
													or drag and drop
												</p>
											</div>
											<input
												id="file-upload"
												type="file"
												multiple
												onChange={handleFileUpload}
												className="hidden"
												accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif"
											/>
										</div>
									</div>
								</div>

								{/* Display uploaded files */}
								{formData.uploadedFiles.length > 0 && (
									<>
										<Separator />
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
											<div className="flex flex-col space-y-1">
												<Label className="text-sm font-medium">Uploaded Files</Label>
												<CardDescription className="text-xs">
													Files that will be included with your solution.
												</CardDescription>
											</div>
											<div className="space-y-2">
												{formData.uploadedFiles.map((file, index) => (
													<div
														key={index}
														className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
													>
														<div className="flex items-center space-x-3">
															<FileText className="h-5 w-5 text-gray-500" />
															<div>
																<p className="text-sm font-medium text-gray-900">
																	{file.name}
																</p>
																<p className="text-xs text-gray-500">
																	{(file.size / 1024 / 1024).toFixed(2)} MB
																</p>
															</div>
														</div>
														<Button
															onClick={() => removeFile(index)}
															size="sm"
															variant="ghost"
															className="text-red-500 hover:text-red-700"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												))}
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent 
				className="!w-[98vw] !max-w-[1600px] max-h-[95vh] p-0 overflow-hidden"
				style={{ width: '98vw', maxWidth: '1600px' }}
			>
				<DialogTitle className="sr-only">Add New Solution</DialogTitle>
				<div className="flex h-[80vh]">
					{/* Left Sidebar - Steps */}
					<div className="w-80 bg-foreground text-white p-8 flex flex-col items-center justify-center text-center">
						<div className="mb-8">
							<h2 className="text-2xl font-bold">Get started</h2>
						</div>

						<div className="space-y-6 flex-1 flex flex-col justify-center">
							{steps.map((step) => {
								const Icon = step.icon;
								const isActive = currentStep === step.id;
								const isCompleted = currentStep > step.id;

								return (
									<div key={step.id} className="flex items-center space-x-4">
										<div
											className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
												isActive
													? "bg-white text-blue-600 border-white"
													: isCompleted
													? "bg-white/20 border-white/40 text-white"
													: "border-white/40 text-white/60"
											}`}
										>
											{isCompleted ? (
												<Check className="h-4 w-4" />
											) : (
												<Icon className="h-4 w-4" />
											)}
										</div>
										<span
											className={`text-lg ${
												isActive ? "text-white font-medium" : "text-white/80"
											}`}
										>
											{step.name}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Right Content */}
					<div className="flex-1 flex flex-col min-w-0">
						<DialogHeader className="p-6 border-b flex-shrink-0">
							<div className="flex items-center justify-center">
								<Badge variant="secondary" className="text-sm">
									STEP {currentStep}/5
								</Badge>
							</div>
						</DialogHeader>

						<div className="flex-1 p-6 overflow-y-auto min-w-0">
							{renderStepContent()}
						</div>

						{/* Footer */}
						<div className="p-6 border-t bg-gray-50 flex justify-between flex-shrink-0">
							<Button
								variant="outline"
								onClick={handlePrevious}
								disabled={currentStep === 1}
								className="flex items-center space-x-2"
							>
								<ChevronLeft className="h-4 w-4" />
								<span>Previous</span>
							</Button>

							{currentStep === 5 ? (
								<Button
									onClick={handleSubmit}
									className=""
								>
									Create Solution
								</Button>
							) : (
								<Button
									onClick={handleNext}
									className=" flex items-center space-x-2"
								>
									<span>Next Step</span>
									<ChevronRight className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
