"use client";

import { useState } from "react";
import { Plus, X, Building2 } from "lucide-react";
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
import type { Industry, Technology, IndustryParameter } from "../types";

interface CreateIndustryDialogProps {
	onCreate: (industry: Omit<Industry, "id" | "status">) => void;
}

export function CreateIndustryDialog({ onCreate }: CreateIndustryDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [technologies, setTechnologies] = useState<Technology[]>([]);
	const [newTechName, setNewTechName] = useState("");
	const [parameters, setParameters] = useState<IndustryParameter[]>([]);
	
	// Parameter form state
	const [paramName, setParamName] = useState("");
	const [paramValue, setParamValue] = useState("");
	const [paramUnit, setParamUnit] = useState("");
	const [paramDescription, setParamDescription] = useState("");
	const [paramCategory, setParamCategory] = useState<IndustryParameter["category"]>("cost");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !description.trim()) return;

		const newIndustry: Omit<Industry, "id" | "status"> = {
			logo: Building2, // Default icon, could be made selectable
			name: name.trim(),
			description: description.trim(),
			technologies,
			companies: [], // Empty initially
			parameters,
		};

		onCreate(newIndustry);
		setOpen(false);
		resetForm();
	};

	const resetForm = () => {
		setName("");
		setDescription("");
		setTechnologies([]);
		setNewTechName("");
		setParameters([]);
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
			icon: Building2, 
		};
		
		setTechnologies([...technologies, newTech]);
		setNewTechName("");
	};

	const removeTechnology = (index: number) => {
		setTechnologies(technologies.filter((_, i) => i !== index));
	};

	const addParameter = () => {
		if (!paramName.trim() || !paramValue.trim() || !paramUnit.trim() || !paramDescription.trim()) return;
		
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

	const getCategoryColor = (category: IndustryParameter["category"]) => {
		switch (category) {
			case "cost": return "bg-red-100 text-red-800";
			case "performance": return "bg-blue-100 text-blue-800";
			case "environmental": return "bg-green-100 text-green-800";
			case "operational": return "bg-purple-100 text-purple-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="text-xs">
					<Plus className="h-4 w-4 mr-2" />
					New Industry
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create New Industry</DialogTitle>
					<DialogDescription>
						Add a new industry with its associated technologies and parameters.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="name">Industry Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter industry name..."
								required
							/>
						</div>
						<div>
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Describe the industry..."
								rows={3}
								required
							/>
						</div>
						
						{/* Technologies Section */}
						<div>
							<Label>Technologies</Label>
							<div className="flex gap-2 mt-2">
								<Input
									value={newTechName}
									onChange={(e) => setNewTechName(e.target.value)}
									placeholder="Add a technology..."
									onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
								/>
								<Button
									type="button"
									variant="outline"
									onClick={addTechnology}
									disabled={!newTechName.trim()}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{technologies.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3">
									{technologies.map((tech, index) => (
										<Badge key={index} variant="secondary" className="flex items-center gap-1">
											{tech.name}
											<button
												type="button"
												onClick={() => removeTechnology(index)}
												className="ml-1 hover:text-destructive"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									))}
								</div>
							)}
						</div>

						{/* Parameters Section */}
						<div>
							<Label>Industry Parameters</Label>
							<div className="grid grid-cols-2 gap-2 mt-2">
								<Input
									value={paramName}
									onChange={(e) => setParamName(e.target.value)}
									placeholder="Parameter name..."
								/>
								<Input
									value={paramValue}
									onChange={(e) => setParamValue(e.target.value)}
									placeholder="Value..."
									type="number"
									step="any"
								/>
								<Input
									value={paramUnit}
									onChange={(e) => setParamUnit(e.target.value)}
									placeholder="Unit (e.g., USD/kW, %, kg CO2/kWh)..."
								/>
								<Select value={paramCategory} onValueChange={(value: IndustryParameter["category"]) => setParamCategory(value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="cost">Cost</SelectItem>
										<SelectItem value="performance">Performance</SelectItem>
										<SelectItem value="environmental">Environmental</SelectItem>
										<SelectItem value="operational">Operational</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Textarea
								value={paramDescription}
								onChange={(e) => setParamDescription(e.target.value)}
								placeholder="Parameter description..."
								rows={2}
								className="mt-2"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={addParameter}
								disabled={!paramName.trim() || !paramValue.trim() || !paramUnit.trim() || !paramDescription.trim()}
								className="mt-2"
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Parameter
							</Button>
							
							{parameters.length > 0 && (
								<div className="space-y-2 mt-3">
									{parameters.map((param, index) => (
										<div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-medium">{param.name}</span>
													<Badge className={getCategoryColor(param.category)}>
														{param.category}
													</Badge>
												</div>
												<div className="text-sm text-gray-600 mt-1">
													{param.value} {param.unit}
												</div>
												<div className="text-xs text-gray-500 mt-1">
													{param.description}
												</div>
											</div>
											<button
												type="button"
												onClick={() => removeParameter(index)}
												className="ml-2 hover:text-destructive"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={!name.trim() || !description.trim()}>
							Create Industry
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
} 