"use client";

import {
	FolderOpen,
	ChevronRight,
	Calendar,
	MapPin,
	DollarSign,
	User,
	Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectData } from "./project-types";
import { CreateProjectDialog } from "./create-project-dialog";
import type { Industry, Technology } from "../../../admin/industries-and-technologies/types";
import type { LeadData } from "@/lib/actions/clients-leads/clients-leads";
import { useState, useEffect, useRef } from "react";
import { getScenariosByProjectId } from "@/lib/actions/scenarios/scenarios";

interface ProjectsGridProps {
	projects: ProjectData[];
	onProjectClick: (project: ProjectData) => void;
	onCreateProject?: (project: ProjectData) => void;
	selectedLead: LeadData | null;
	availableIndustries: Industry[];
	availableTechnologies: Technology[];
	userId: string;
}

export function ProjectsGrid({ 
	projects, 
	onProjectClick, 
	onCreateProject,
	selectedLead,
	availableIndustries,
	availableTechnologies,
	userId,
}: ProjectsGridProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [scenarioCounts, setScenarioCounts] = useState<Record<string, number>>({});
	const [loadingCounts, setLoadingCounts] = useState<Record<string, boolean>>({});
	const fetchedProjectsRef = useRef<Set<string>>(new Set());

	// Fetch scenario counts for each project
	useEffect(() => {
		async function fetchScenarioCounts() {
			const newCounts: Record<string, number> = {};
			const newLoadingCounts: Record<string, boolean> = {};

			for (const project of projects) {
				// Skip if we already have the count for this project
				if (fetchedProjectsRef.current.has(project.id)) {
					continue;
				}

				newLoadingCounts[project.id] = true;
				setLoadingCounts(prev => ({ ...prev, [project.id]: true }));

				try {
					const result = await getScenariosByProjectId(userId, project.id);
					if (result.success && result.scenarios) {
						newCounts[project.id] = result.scenarios.length;
					} else {
						newCounts[project.id] = 0;
					}
					fetchedProjectsRef.current.add(project.id);
				} catch (error) {
					console.error(`Error fetching scenarios for project ${project.id}:`, error);
					newCounts[project.id] = 0;
					fetchedProjectsRef.current.add(project.id);
				} finally {
					setLoadingCounts(prev => ({ ...prev, [project.id]: false }));
				}
			}

			// Only update if we have new counts
			if (Object.keys(newCounts).length > 0) {
				setScenarioCounts(prev => ({ ...prev, ...newCounts }));
			}
		}

		if (projects.length > 0 && userId) {
			fetchScenarioCounts();
		}
	}, [projects, userId]);

	const getStatusVariant = (status: ProjectData["status"]) => {
		switch (status) {
			case "active":
				return "default";
			case "completed":
				return "secondary";
			case "on-hold":
				return "outline";
			case "cancelled":
				return "destructive";
			default:
				return "outline";
		}
	};

	const getPriorityVariant = (priority: ProjectData["priority"]) => {
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

	const handleCreateProject = (newProject: ProjectData) => {
		// Add the new project to the list
		// In a real implementation, this would be handled by the parent component
		//console.log("New project created:", newProject);
		// You might want to call a callback to update the projects list
		if (onCreateProject) {
			onCreateProject(newProject);
		}
	};

	const handleCreateProjectClick = () => {
		setDialogOpen(true);
	};

	return (
		<div className="space-y-4">
			{/* Create Project Dialog */}
			<CreateProjectDialog
				onCreate={handleCreateProject}
				selectedLead={selectedLead}
				availableIndustries={availableIndustries}
				availableTechnologies={availableTechnologies}
				userId={userId}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{/* Create New Project Card - Always visible */}
				<Card
					className="cursor-pointer hover:shadow-md transition-shadow group relative border-dashed border-2 border-muted-foreground/20 hover:border-primary/50"
					onClick={handleCreateProjectClick}
				>
					<CardHeader className="pb-2 pt-6">
						<div className="flex items-center justify-center h-32">
							<div className="text-center">
								<div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors mx-auto mb-3 w-fit">
									<Plus className="h-6 w-6 text-primary" />
								</div>
								<CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
									Create New Project
								</CardTitle>
								<p className="text-xs text-muted-foreground mt-1">
									Add a new project to get started
								</p>
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Existing Project Cards */}
				{projects.map((project) => (
					<Card
						key={project.id}
						className="cursor-pointer hover:shadow-md transition-shadow group relative"
						onClick={() => onProjectClick(project)}
					>
						{/* Status badge at top right */}
						{project.status && (
							<Badge
								variant={getStatusVariant(project.status)}
								className="absolute top-2 right-2 text-xs"
							>
								{project.status}
							</Badge>
						)}

						<CardHeader className="pb-2 pt-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
										<FolderOpen className="h-4 w-4 text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<CardTitle className="text-sm font-medium truncate">
											{project.name}
										</CardTitle>

										<Badge variant="secondary" className="text-xs mt-1">
											{loadingCounts[project.id] 
												? "Loading..." 
												: `${scenarioCounts[project.id] || 0} scenarios`
											}
										</Badge>

										{/* Project-specific information */}
										<div className="mt-2 space-y-1">
											{project.description && (
												<div className="text-xs text-muted-foreground line-clamp-2">
													{project.description}
												</div>
											)}

											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<Calendar className="h-3 w-3" />
												<span>
													{new Date(project.start_date).toLocaleDateString()}
													{project.end_date &&
														` - ${new Date(
															project.end_date
														).toLocaleDateString()}`}
												</span>
											</div>

											{project.location && (
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<MapPin className="h-3 w-3" />
													<span>{project.location}</span>
												</div>
											)}

											{project.budget && (
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<DollarSign className="h-3 w-3" />
													<span>${project.budget.toLocaleString()}</span>
												</div>
											)}

											{project.project_manager && (
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<User className="h-3 w-3" />
													<span>{project.project_manager}</span>
												</div>
											)}

											{project.priority && (
												<Badge
													variant={getPriorityVariant(project.priority)}
													className="text-xs"
												>
													{project.priority} priority
												</Badge>
											)}
										</div>
									</div>
								</div>
								<ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
							</div>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
}
