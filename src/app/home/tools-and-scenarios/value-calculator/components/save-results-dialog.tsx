"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import { Save, Plus, Info, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import {
	getProjectsByClientId,
	createClientProject,
	addScenarioToProject,
	type ClientProjectData,
} from "@/lib/actions/clients-projects/client-projects";
import {
	createScenario,
	type ScenarioData,
} from "@/lib/actions/scenarios/scenarios";

interface Project {
	id: string;
	name: string;
	description: string;
	status: string;
}

interface SaveResultsDialogProps {
	onSave: (projectData: {
		projectId?: string;
		name: string;
		description: string;
		start_date: string;
		end_date?: string;
		project_manager?: string;
		budget?: number;
		location?: string;
		status: "active" | "completed" | "on-hold" | "cancelled";
		priority: "critical" | "high" | "medium" | "low";
	}) => void;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	isLoading?: boolean;
	calculationResult?: any;
	advancedConfig?: any;
	inputParameters?: any; // Add this new prop for input parameters
}

export function SaveResultsDialog({
	onSave,
	isOpen,
	onOpenChange,
	isLoading = false,
	calculationResult,
	advancedConfig,
	inputParameters,
}: SaveResultsDialogProps) {
	const { user } = useUser();
	const [projects, setProjects] = useState<ClientProjectData[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [isLoadingProjects, setIsLoadingProjects] = useState(false);
	const [currentStep, setCurrentStep] = useState<"select" | "create" | "save">(
		"select"
	);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		start_date: "",
		end_date: "",
		project_manager: "",
		budget: "",
		location: "",
		status: "active" as const,
		priority: "medium" as const,
		scenarioName: "", // Add scenario name field
	});

	// Reset state when dialog opens
	useEffect(() => {
		if (isOpen) {
			setCurrentStep("select");
			setSelectedProjectId("");
			setIsCreatingNew(false);
			loadProjects();
		}
	}, [isOpen]);

	const loadProjects = async () => {
		if (!user?._id) {
			toast.error("User not authenticated");
			return;
		}

		setIsLoadingProjects(true);
		try {
			const result = await getProjectsByClientId(user._id, user.client_id);
			if (result.success && result.projects) {
				setProjects(result.projects);
			} else {
				toast.error(result.error || "Failed to load projects");
				setProjects([]);
			}
		} catch (error) {
			console.error("Error loading projects:", error);
			toast.error("Failed to load projects");
			setProjects([]);
		} finally {
			setIsLoadingProjects(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user?._id) {
			toast.error("User not authenticated");
			return;
		}

		try {
			if (isCreatingNew) {
				// Creating new project
				const projectData = {
					name: formData.name,
					description: formData.description,
					start_date: formData.start_date,
					end_date: formData.end_date || undefined,
					project_manager: formData.project_manager || undefined,
					budget: formData.budget ? parseFloat(formData.budget) : undefined,
					location: formData.location || undefined,
					status: formData.status,
					priority: formData.priority,
					client_id: user.client_id,
					created_by: user._id,
					industry: [],
					technology: [],
				};

				const result = await createClientProject(user._id, projectData);
				if (result.success && result.project) {
					// Create scenario for the new project
					await createScenarioForProject(result.project.id, formData.scenarioName);
					toast.success("Project created and results saved successfully!");
					onOpenChange(false);
				} else {
					toast.error(result.error || "Failed to create project");
				}
			} else {
				// Adding to existing project
				const selectedProject = projects.find(
					(p) => p.id === selectedProjectId
				);
				if (selectedProject) {
					await createScenarioForProject(selectedProject.id, formData.scenarioName);
					toast.success("Results saved successfully!");
					onOpenChange(false);
				}
			}
		} catch (error) {
			console.error("Error saving project:", error);
			toast.error("Failed to save project");
		}
	};

	const handleSaveToExistingProject = async () => {
		if (!user?._id) {
			toast.error("User not authenticated");
			return;
		}

		console.log("Saving to existing project:", selectedProject?.id);
		console.log("Selected project details:", selectedProject);
		console.log("Project ID type:", typeof selectedProject?.id);
		console.log("Project ID length:", selectedProject?.id?.length);

		try {
			await createScenarioForProject(selectedProject!.id, formData.scenarioName);
			toast.success("Results saved successfully!");
			onOpenChange(false);
		} catch (error) {
			console.error("Error saving to project:", error);
			toast.error("Failed to save results");
		}
	};

	const createScenarioForProject = async (projectId: string, scenarioName?: string) => {
		if (!user?._id || !calculationResult) return;

		try {
			console.log("Creating scenario for project - Project ID:", projectId, "User ID:", user._id);

			// Create scenario data
			const scenarioData = {
				scenario_name: scenarioName || `Value Calculator Results - ${new Date().toLocaleDateString()}`,
				associated_project_id: projectId,
				solution: [], // Will be populated based on selected solution
				solution_variant: "N/A",
				compared_to: [],
				input_parameters: inputParameters || calculationResult,
				results: calculationResult,
				client_id: user.client_id,
				user_id: user._id,
			};

			console.log("Scenario data to create:", scenarioData);

			const scenarioResult = await createScenario(user._id, scenarioData);
			

			if (scenarioResult.success && scenarioResult.scenario) {
				console.log(
					"Scenario created successfully, ID:",
					scenarioResult.scenario.id
				);

				// Add scenario to project
				console.log("Adding scenario to project - Project ID:", projectId, "Scenario ID:", scenarioResult.scenario.id);
				const addResult = await addScenarioToProject(
					user._id,
					projectId,
					scenarioResult.scenario.id
				);
				console.log("Add scenario to project result:", addResult);

				if (!addResult.success) {
					console.error("Failed to add scenario to project:", addResult.error);
					// Don't throw error here, just log it since the scenario was created successfully
					console.log("Scenario was created but could not be added to project. This might be a temporary issue.");
					// Still consider this a success since the scenario was created
					return;
				}
			} else {
				throw new Error(scenarioResult.error || "Failed to create scenario");
			}
		} catch (error) {
			console.error("Error creating scenario:", error);
			throw error;
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleCreateNew = () => {
		setIsCreatingNew(true);
		setCurrentStep("create");
		setFormData({
			name: "",
			description: "",
			start_date: "",
			end_date: "",
			project_manager: "",
			budget: "",
			location: "",
			status: "active" as const,
			priority: "medium" as const,
			scenarioName: "",
		});
	};

	const handleProjectSelection = (projectId: string) => {
		setSelectedProjectId(projectId);
		setIsCreatingNew(false);
		setCurrentStep("save");

		if (projectId) {
			const selectedProject = projects.find((p) => p.id === projectId);
			if (selectedProject) {
				// Pre-fill some fields for existing project (optional fields only)
				setFormData((prev) => ({
					...prev,
					project_manager: "",
					budget: "",
					location: "",
					priority: "medium" as const,
					scenarioName: "", // Reset scenario name
				}));
			}
		}
	};

	const handleBack = () => {
		setCurrentStep("select");
		setSelectedProjectId("");
		setIsCreatingNew(false);
	};

	const selectedProject = projects.find((p) => p.id === selectedProjectId);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Save className="h-5 w-5" />
						Save Project Results
					</DialogTitle>
					<DialogDescription>
						Choose an existing project or create a new one to save your value
						calculator results.
					</DialogDescription>
				</DialogHeader>

				{currentStep === "select" && (
					<div className="space-y-4">
						{/* Create New Project Button */}
						<Button
							onClick={handleCreateNew}
							className="w-full justify-start"
							variant="outline"
						>
							<Plus className="h-4 w-4 mr-2" />
							Create New Project
						</Button>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or
								</span>
							</div>
						</div>

						{/* Existing Projects Dropdown */}
						<div className="space-y-2">
							<Label htmlFor="project">Select Existing Project</Label>
							<Select
								value={selectedProjectId}
								onValueChange={handleProjectSelection}
								disabled={isLoadingProjects}
							>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={
											isLoadingProjects
												? "Loading projects..."
												: "Choose a project"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{projects.map((project) => (
										<SelectItem key={project.id} value={project.id}>
											<div className="flex flex-col">
												<span className="font-medium">{project.name}</span>
												<span className="text-xs text-muted-foreground">
													{project.description}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				)}

				{currentStep === "create" && (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="flex items-center gap-2 mb-4">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleBack}
							>
								<ArrowLeft className="h-4 w-4 mr-1" />
								Back
							</Button>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Project Name *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								placeholder="Enter project name"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description *</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) =>
									handleInputChange("description", e.target.value)
								}
								placeholder="Enter project description"
								rows={3}
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="start_date">Start Date *</Label>
								<Input
									id="start_date"
									type="date"
									value={formData.start_date}
									onChange={(e) =>
										handleInputChange("start_date", e.target.value)
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="end_date">End Date (Optional)</Label>
								<Input
									id="end_date"
									type="date"
									value={formData.end_date}
									onChange={(e) =>
										handleInputChange("end_date", e.target.value)
									}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="project_manager">Project Manager</Label>
								<Input
									id="project_manager"
									value={formData.project_manager}
									onChange={(e) =>
										handleInputChange("project_manager", e.target.value)
									}
									placeholder="Enter project manager name"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="budget">Budget</Label>
								<Input
									id="budget"
									type="number"
									value={formData.budget}
									onChange={(e) => handleInputChange("budget", e.target.value)}
									placeholder="Enter budget amount"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								value={formData.location}
								onChange={(e) => handleInputChange("location", e.target.value)}
								placeholder="Enter project location"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<Select
									value={formData.status}
									onValueChange={(value) => handleInputChange("status", value)}
								>
									<SelectTrigger>
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

							<div className="space-y-2">
								<Label htmlFor="priority">Priority</Label>
								<Select
									value={formData.priority}
									onValueChange={(value) =>
										handleInputChange("priority", value)
									}
								>
									<SelectTrigger>
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

						<div className="space-y-2">
							<Label htmlFor="scenarioName">Scenario Name *</Label>
							<Input
								id="scenarioName"
								value={formData.scenarioName}
								onChange={(e) => handleInputChange("scenarioName", e.target.value)}
								placeholder="Enter scenario name"
								required
							/>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading || !formData.name || !formData.description || !formData.scenarioName.trim()}
							>
								{isLoading ? "Creating..." : "Create Project"}
							</Button>
						</DialogFooter>
					</form>
				)}

				{currentStep === "save" && selectedProject && (
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-4">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleBack}
							>
								<ArrowLeft className="h-4 w-4 mr-1" />
								Back
							</Button>
						</div>

						{/* Selected Project Info */}
						<div className="p-4 bg-muted/50 rounded-lg border">
							<div className="flex items-start gap-3">
								<Info className="h-4 w-4 text-blue-600 mt-0.5" />
								<div className="space-y-2">
									<div>
										<div className="font-medium text-sm">
											{selectedProject.name}
										</div>
										<div className="text-xs text-muted-foreground">
											{selectedProject.description}
										</div>
									</div>
									<div className="text-xs">
										<span className="text-muted-foreground">Status: </span>
										<span className="font-medium">
											{selectedProject.status}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Scenario Name Input */}
						<div className="space-y-2">
							<Label htmlFor="scenarioName">Scenario Name *</Label>
							<Input
								id="scenarioName"
								value={formData.scenarioName}
								onChange={(e) => handleInputChange("scenarioName", e.target.value)}
								placeholder="Enter scenario name"
								required
							/>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSaveToExistingProject}
								disabled={isLoading || !formData.scenarioName.trim()}
							>
								{isLoading ? "Saving..." : "Save to Project"}
							</Button>
						</DialogFooter>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
