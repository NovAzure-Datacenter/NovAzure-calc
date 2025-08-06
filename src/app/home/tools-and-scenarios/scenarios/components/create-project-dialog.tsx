"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Calendar, MapPin, DollarSign, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ProjectData } from "./project-types";
import type { Industry, Technology } from "../../../admin/industries-and-technologies/types";
import type { LeadData } from "@/lib/actions/clients-leads/clients-leads";
import { createClientProject, type ClientProjectData } from "@/lib/actions/clients-projects/client-projects";

interface CreateProjectDialogProps {
	onCreate: (project: ProjectData) => void;
	selectedLead: LeadData | null;
	availableIndustries: Industry[];
	availableTechnologies: Technology[];
	userId: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function CreateProjectDialog({
	onCreate,
	selectedLead,
	availableIndustries,
	availableTechnologies,
	userId,
	open: externalOpen,
	onOpenChange: externalOnOpenChange,
}: CreateProjectDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Use external state if provided, otherwise use internal state
	const open = externalOpen !== undefined ? externalOpen : internalOpen;
	const setOpen = externalOnOpenChange || setInternalOpen;

	// Form data
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		status: "active" as ProjectData["status"],
		start_date: "",
		end_date: "",
		project_manager: "",
		budget: "",
		location: "",
		priority: "medium" as "critical" | "high" | "medium" | "low",
		selected_industries: [] as string[],
		selected_technologies: [] as string[],
	});

	const handleInputChange = useCallback((field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const toggleIndustrySelection = useCallback((industryId: string) => {
		setFormData((prev) => ({
			...prev,
			selected_industries: prev.selected_industries.includes(industryId)
				? prev.selected_industries.filter((id) => id !== industryId)
				: [...prev.selected_industries, industryId],
		}));
	}, []);

	const toggleTechnologySelection = useCallback((technologyId: string) => {
		setFormData((prev) => ({
			...prev,
			selected_technologies: prev.selected_technologies.includes(technologyId)
				? prev.selected_technologies.filter((id) => id !== technologyId)
				: [...prev.selected_technologies, technologyId],
		}));
	}, []);

	const resetForm = useCallback(() => {
		setFormData({
			name: "",
			description: "",
			status: "active",
			start_date: "",
			end_date: "",
			project_manager: "",
			budget: "",
			location: "",
			priority: "medium",
			selected_industries: [],
			selected_technologies: [],
		});
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (
				!formData.name.trim() ||
				!formData.description.trim() ||
				!formData.start_date ||
				!selectedLead?.client_id
			) {
				toast.error("Please fill in all mandatory fields");
				return;
			}

			setIsSubmitting(true);

			try {
				const projectData = {
					name: formData.name.trim(),
					description: formData.description.trim(),
					status: formData.status,
					start_date: new Date(formData.start_date).toISOString(),
					end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
					client_id: selectedLead.client_id,
					created_by: userId,
					industry: formData.selected_industries,
					technology: formData.selected_technologies,
					project_manager: formData.project_manager || undefined,
					budget: formData.budget ? parseFloat(formData.budget) : undefined,
					location: formData.location || undefined,
					priority: formData.priority,
				};

				const result = await createClientProject(userId, projectData);

				if (result.error) {
					toast.error(result.error);
					return;
				}

				// Convert ClientProjectData to ProjectData for the callback
				const newProject: ProjectData = {
					id: result.project!.id,
					name: result.project!.name,
					description: result.project!.description,
					status: result.project!.status || "active",
					start_date: result.project!.start_date,
					end_date: result.project!.end_date,
					client_id: result.project!.client_id,
					created_by: result.project!.created_by,
					created_at: result.project!.created_at,
					updated_at: result.project!.updated_at,
					scenario_count: result.project!.scenarios.length,
					industry: result.project!.industry,
					technology: result.project!.technology,
					project_manager: result.project!.project_manager,
					budget: result.project!.budget,
					location: result.project!.location,
					priority: result.project!.priority,
				};

				onCreate(newProject);
				
				toast.success("Project created successfully!");
				setOpen(false);
				resetForm();
			} catch (error) {
				console.error("Error creating project:", error);
				toast.error("Failed to create project. Please try again.");
			} finally {
				setIsSubmitting(false);
			}
		},
		[formData, selectedLead, userId, onCreate, setOpen, resetForm]
	);

	const isFormValid = useMemo(
		() =>
			formData.name.trim() &&
			formData.description.trim() &&
			formData.start_date &&
			selectedLead?.client_id,
		[formData.name, formData.description, formData.start_date, selectedLead]
	);

	const getPriorityVariant = (priority: string) => {
		switch (priority) {
			case "critical":
				return "destructive";
			case "high":
				return "default";
			case "medium":
				return "secondary";
			case "low":
				return "outline";
			default:
				return "outline";
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
		
			<DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
				<DialogHeader className="pb-4 px-6 pt-6">
					<DialogTitle className="text-lg">Create New Project</DialogTitle>
					<DialogDescription className="text-sm">
						Add a new project for {selectedLead?.company_name || selectedLead?.first_name}.
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6">
					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="space-y-8">
							{/* Basic Project Information */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Basic Information</h3>
								
								<div className="space-y-4">
									<div>
										<Label htmlFor="name" className="text-sm">
											Project Name *
										</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e) => handleInputChange("name", e.target.value)}
											placeholder="Enter project name"
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="description" className="text-sm">
											Description *
										</Label>
										<Textarea
											id="description"
											value={formData.description}
											onChange={(e) => handleInputChange("description", e.target.value)}
											placeholder="Describe the project objectives and scope"
											className="mt-1"
											rows={3}
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="status" className="text-sm">
												Status
											</Label>
											<Select
												value={formData.status}
												onValueChange={(value) => handleInputChange("status", value)}
											>
												<SelectTrigger className="mt-1">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="active">Active</SelectItem>
													<SelectItem value="completed">Completed</SelectItem>
													<SelectItem value="on-hold">On Hold</SelectItem>
													<SelectItem value="cancelled">Cancelled</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label htmlFor="priority" className="text-sm">
												Priority
											</Label>
											<Select
												value={formData.priority}
												onValueChange={(value) => handleInputChange("priority", value)}
											>
												<SelectTrigger className="mt-1">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="critical">Critical</SelectItem>
													<SelectItem value="high">High</SelectItem>
													<SelectItem value="medium">Medium</SelectItem>
													<SelectItem value="low">Low</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>
							</div>

							{/* Project Details */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Project Details</h3>
								
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="start_date" className="text-sm">
											Start Date *
										</Label>
										<Input
											id="start_date"
											type="date"
											value={formData.start_date}
											onChange={(e) => handleInputChange("start_date", e.target.value)}
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="end_date" className="text-sm">
											End Date
										</Label>
										<Input
											id="end_date"
											type="date"
											value={formData.end_date}
											onChange={(e) => handleInputChange("end_date", e.target.value)}
											className="mt-1"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="project_manager" className="text-sm">
											Project Manager
										</Label>
										<Input
											id="project_manager"
											value={formData.project_manager}
											onChange={(e) => handleInputChange("project_manager", e.target.value)}
											placeholder="Enter project manager name"
											className="mt-1"
										/>
									</div>

									<div>
										<Label htmlFor="budget" className="text-sm">
											Budget
										</Label>
										<Input
											id="budget"
											type="number"
											value={formData.budget}
											onChange={(e) => handleInputChange("budget", e.target.value)}
											placeholder="Enter budget amount"
											className="mt-1"
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="location" className="text-sm">
										Location
									</Label>
									<Input
										id="location"
										value={formData.location}
										onChange={(e) => handleInputChange("location", e.target.value)}
										placeholder="Enter project location"
										className="mt-1"
									/>
								</div>
							</div>

							{/* Industry and Technology Selection */}
							<div className="space-y-4">
								<h3 className="text-sm font-medium">Industries & Technologies</h3>
								
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="industries" className="text-sm">
											Industries
										</Label>
										<Select
											value={formData.selected_industries[0] || ""}
											onValueChange={(value) => {
												if (value && !formData.selected_industries.includes(value)) {
													setFormData((prev) => ({
														...prev,
														selected_industries: [...prev.selected_industries, value],
													}));
												}
											}}
										>
											<SelectTrigger className="mt-1">
												<SelectValue placeholder="Select industries" />
											</SelectTrigger>
											<SelectContent>
												{availableIndustries.map((industry) => (
													<SelectItem 
														key={industry.id} 
														value={industry.id}
														disabled={formData.selected_industries.includes(industry.id)}
													>
														{industry.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="technologies" className="text-sm">
											Technologies
										</Label>
										<Select
											value={formData.selected_technologies[0] || ""}
											onValueChange={(value) => {
												if (value && !formData.selected_technologies.includes(value)) {
													setFormData((prev) => ({
														...prev,
														selected_technologies: [...prev.selected_technologies, value],
													}));
												}
											}}
										>
											<SelectTrigger className="mt-1">
												<SelectValue placeholder="Select technologies" />
											</SelectTrigger>
											<SelectContent>
												{availableTechnologies.map((technology) => (
													<SelectItem 
														key={technology.id || technology.name} 
														value={technology.id || ""}
														disabled={formData.selected_technologies.includes(technology.id || "")}
													>
														{technology.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>

				<DialogFooter className="px-6 py-4 border-t bg-background">
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
						onClick={handleSubmit}
					>
						{isSubmitting ? "Creating..." : "Create Project"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 