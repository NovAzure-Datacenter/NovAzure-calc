"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockSavedScenarios } from "../mock-data";
import { mockProjects } from "../mock-projects";
import { getSolutionById } from "@/lib/actions/solution/solution";
import { getUserById } from "@/lib/actions/user/user";
import {
	getLeadsByClientId,
	type LeadData,
} from "@/lib/actions/clients-leads/clients-leads";
import {
	getProjectsByClientId,
	type ClientProjectData,
} from "@/lib/actions/clients-projects/client-projects";
import {
	getScenariosByProjectId,
	type ScenarioData,
} from "@/lib/actions/scenarios/scenarios";
import { ScenariosDialog } from "./scenarios-dialog";
import { LeadsGrid } from "./leads-grid";
import { ProjectsGrid } from "./projects-grid";
import { ScenariosGrid } from "./scenarios-grid";
import { EmptyState } from "./empty-state";
import type {
	Industry,
	Technology,
} from "../../../admin/industries-and-technologies/types";
import type { SavedCalculationScenario } from "../mock-data";
import type { ProjectData } from "./project-types";

interface BreadcrumbItem {
	id: string;
	name: string;
	type: "root" | "lead" | "project";
}

interface ScenariosFileSystemProps {
	clientData: any;
	availableIndustries: Industry[];
	availableTechnologies: Technology[];
	isLoading: boolean;
	searchQuery: string;
	userId: string;
}

export function ScenariosFileSystem({
	clientData,
	availableIndustries,
	availableTechnologies,
	isLoading,
	searchQuery,
	userId,
}: ScenariosFileSystemProps) {
	// Navigation state
	const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([
		{ id: "root", name: "Customers", type: "root" },
	]);
	const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
	const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
		null
	);

	// Leads state
	const [leads, setLeads] = useState<LeadData[]>([]);
	const [leadsLoading, setLeadsLoading] = useState(false);

	// Projects state
	const [projects, setProjects] = useState<ClientProjectData[]>([]);
	const [projectsLoading, setProjectsLoading] = useState(false);

	// Project counts state
	const [projectCounts, setProjectCounts] = useState<Record<string, number>>(
		{}
	);

	// Scenarios state
	const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
	const [scenariosLoading, setScenariosLoading] = useState(false);

	// Dialog state
	const [selectedScenario, setSelectedScenario] = useState<ScenarioData | null>(
		null
	);
	const [dialogOpen, setDialogOpen] = useState(false);

	// Cache for solution and user data
	const [solutionCache, setSolutionCache] = useState<Record<string, any>>({});
	const [userCache, setUserCache] = useState<Record<string, string>>({});

	// State for resolved names
	const [resolvedNames, setResolvedNames] = useState<Record<string, string>>(
		{}
	);

	// Load leads when component mounts
	useEffect(() => {
		async function loadLeads() {
			if (!userId) return;

			setLeadsLoading(true);
			try {
				const result = await getLeadsByClientId(userId);
				if (result.success && result.leads) {
					setLeads(result.leads);
				} else {
					toast.error(result.error || "Failed to load leads");
				}
			} catch (error) {
				console.error("Error loading leads:", error);
				toast.error("Failed to load leads");
			} finally {
				setLeadsLoading(false);
			}
		}

		loadLeads();
	}, [userId]);

	// Load projects for a selected lead
	const loadProjectsForLead = useCallback(
		async (lead: LeadData) => {
			setProjectsLoading(true);
			try {
				const result = await getProjectsByClientId(userId, lead.client_id);
				if (result.success && result.projects) {
					setProjects(result.projects);
					setProjectCounts((prev) => ({
						...prev,
						[lead.id]: result.projects?.length || 0,
					}));
				} else {
					toast.error(result.error || "Failed to load projects");
					setProjects([]);
					setProjectCounts((prev) => ({
						...prev,
						[lead.id]: 0,
					}));
				}
			} catch (error) {
				console.error("Error loading projects:", error);
				toast.error("Failed to load projects");
				setProjects([]);
				setProjectCounts((prev) => ({
					...prev,
					[lead.id]: 0,
				}));
			} finally {
				setProjectsLoading(false);
			}
		},
		[userId]
	);

	// Load scenarios for a selected project
	const loadScenariosForProject = useCallback(
		async (projectId: string) => {
			setScenariosLoading(true);
			try {
				const result = await getScenariosByProjectId(userId, projectId);
				if (result.success && result.scenarios) {
					setScenarios(result.scenarios);
				} else {
					toast.error(result.error || "Failed to load scenarios");
					setScenarios([]);
				}
			} catch (error) {
				console.error("Error loading scenarios:", error);
				toast.error("Failed to load scenarios");
				setScenarios([]);
			} finally {
				setScenariosLoading(false);
			}
		},
		[userId]
	);

	// Effect to resolve solution and user names when scenarios change
	useEffect(() => {
		async function resolveNames() {
			const newResolvedNames: Record<string, string> = {};

			for (const scenario of scenarios) {
				// Resolve solution names
				for (const solutionId of scenario.solution) {
					const cacheKey = `solution_${solutionId}`;
					if (!resolvedNames[cacheKey]) {
						const solutionName = await getSolutionName(solutionId);
						newResolvedNames[cacheKey] = solutionName;
					}
				}

				// Resolve user name
				const userCacheKey = `user_${scenario.user_id}`;
				if (!resolvedNames[userCacheKey]) {
					const userName = await getUserName(scenario.user_id);
					newResolvedNames[userCacheKey] = userName;
				}
			}

			if (Object.keys(newResolvedNames).length > 0) {
				setResolvedNames((prev) => ({ ...prev, ...newResolvedNames }));
			}
		}

		if (scenarios.length > 0) {
			resolveNames();
		}
	}, [scenarios]);

	// Helper function to get resolved name
	function getResolvedName(type: "solution" | "user", id: string): string {
		const cacheKey = `${type}_${id}`;
		return resolvedNames[cacheKey] || id;
	}

	// Helper functions to resolve IDs to names
	async function getSolutionName(solutionId: string): Promise<string> {
		// Check cache first
		if (solutionCache[solutionId]) {
			return solutionCache[solutionId].solution_name || solutionId;
		}

		try {
			const result = await getSolutionById(solutionId);
			if (result.success && result.solution) {
				// Cache the solution data
				setSolutionCache((prev) => ({
					...prev,
					[solutionId]: result.solution,
				}));
				return result.solution.solution_name || solutionId;
			}
		} catch (error) {
			console.error("Error fetching solution:", error);
		}

		return solutionId;
	}

	async function getUserName(userId: string): Promise<string> {
		// Check cache first
		if (userCache[userId]) {
			return userCache[userId];
		}

		try {
			const user = await getUserById(userId);
			if (user.success && user.user) {
				const userName =
					`${user.user.first_name} ${user.user.last_name}`.trim() || userId;
				setUserCache((prev) => ({
					...prev,
					[userId]: userName,
				}));
				return userName;
			}
		} catch (error) {
			console.error("Error fetching user:", error);
		}

		return userId;
	}

	// Navigation handlers
	function handleLeadClick(lead: LeadData) {
		setSelectedLead(lead);
		setSelectedProject(null);
		setScenarios([]); // Clear scenarios when changing leads

		// Update breadcrumb
		setCurrentPath([
			{ id: "root", name: "Customers", type: "root" },
			{
				id: lead.id,
				name: lead.company_name || `${lead.first_name} ${lead.last_name}`,
				type: "lead",
			},
		]);

		// Load projects for the selected lead
		loadProjectsForLead(lead);
	}

	function handleProjectClick(project: ProjectData) {
		if (!selectedLead) return;

		setSelectedProject(project);

		// Update breadcrumb
		setCurrentPath([
			{ id: "root", name: "Customers", type: "root" },
			{
				id: selectedLead.id,
				name:
					selectedLead.company_name ||
					`${selectedLead.first_name} ${selectedLead.last_name}`,
				type: "lead",
			},
			{ id: project.id, name: project.name, type: "project" },
		]);

		// Load scenarios for this project
		loadScenariosForProject(project.id);
	}

	function handleCreateProject() {
		// TODO: Implement project creation logic
		// This could open a modal, navigate to a form, or trigger an API call
		//console.log("Create new project clicked");
		toast.info("Project creation feature coming soon!");
	}

	// Handle project creation and refresh the projects list
	const handleProjectCreated = useCallback(
		async (newProject: ProjectData) => {
			// Refresh the projects list for the current lead
			if (selectedLead) {
				await loadProjectsForLead(selectedLead);
			}
		},
		[selectedLead, loadProjectsForLead]
	);

	function handleScenarioClick(scenario: ScenarioData) {
		setSelectedScenario(scenario);
		setDialogOpen(true);
	}

	function handleBreadcrumbClick(item: BreadcrumbItem) {
		if (item.type === "root") {
			setCurrentPath([{ id: "root", name: "Customers", type: "root" }]);
			setSelectedLead(null);
			setSelectedProject(null);
			setScenarios([]);
		} else if (item.type === "lead") {
			const lead = leads.find((l) => l.id === item.id);
			if (lead) {
				setSelectedLead(lead);
				setSelectedProject(null);
				setScenarios([]);
				setCurrentPath([
					{ id: "root", name: "Customers", type: "root" },
					{
						id: lead.id,
						name: lead.company_name || `${lead.first_name} ${lead.last_name}`,
						type: "lead",
					},
				]);
			}
		} else if (item.type === "project") {
			const project = mockProjects.find((p) => p.id === item.id);
			if (project && selectedLead) {
				setSelectedProject(project);
				setScenarios([]);
				setCurrentPath([
					{ id: "root", name: "Customers", type: "root" },
					{
						id: selectedLead.id,
						name:
							selectedLead.company_name ||
							`${selectedLead.first_name} ${selectedLead.last_name}`,
						type: "lead",
					},
					{ id: project.id, name: project.name, type: "project" },
				]);
			}
		}
	}

	function handleBackClick() {
		if (currentPath.length > 1) {
			const previousItem = currentPath[currentPath.length - 2];
			handleBreadcrumbClick(previousItem);
		}
	}

	// Get current items based on path
	function getCurrentItems(): (LeadData | ProjectData | ScenarioData)[] {
		if (currentPath.length === 1) {
			return leads;
		} else if (currentPath.length === 2) {
			if (!selectedLead) return [];
			// Convert ClientProjectData to ProjectData format
			return projects.map(
				(project): ProjectData => ({
					id: project.id,
					name: project.name,
					description: project.description,
					status: project.status || "active",
					start_date: project.start_date,
					end_date: project.end_date,
					client_id: project.client_id,
					created_by: project.created_by,
					created_at: project.created_at,
					updated_at: project.updated_at,
					scenario_count: project.scenarios.length,
					industry: project.industry,
					technology: project.technology,
					project_manager: project.project_manager,
					budget: project.budget,
					location: project.location,
					priority: project.priority,
				})
			);
		} else if (currentPath.length === 3) {
			if (!selectedProject) return [];

			return scenarios;
		}
		return [];
	}

	if (isLoading || leadsLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-8 w-64" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className="h-32" />
					))}
				</div>
			</div>
		);
	}

	const currentItems = getCurrentItems();

	return (
		<div className="space-y-6">
			{/* Header with breadcrumb navigation */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							handleBreadcrumbClick({
								id: "root",
								name: "Customers",
								type: "root",
							})
						}
						className="p-2"
					>
						<Home className="h-4 w-4" />
					</Button>

					{currentPath.length > 1 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleBackClick}
							className="p-2"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
					)}

					<div className="flex items-center space-x-1 text-sm text-muted-foreground">
						{currentPath.map((item, index) => (
							<div key={item.id} className="flex items-center">
								{index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
								<button
									onClick={() => handleBreadcrumbClick(item)}
									className="hover:text-foreground transition-colors"
								>
									{item.name}
								</button>
							</div>
						))}
					</div>
				</div>

				{clientData && <Badge variant="secondary">{clientData.name}</Badge>}
			</div>

			{/* Current path title */}
			<div>
				<h2 className="text-2xl font-bold">
					{currentPath[currentPath.length - 1].name}
				</h2>
				{currentPath.length === 1 && (
					<p className="text-muted-foreground mt-1">
						Select a customer to view their projects
					</p>
				)}
				{currentPath.length === 2 && (
					<p className="text-muted-foreground mt-1">
						Projects for{" "}
						{selectedLead?.company_name || selectedLead?.first_name}
					</p>
				)}
				{currentPath.length === 3 && (
					<p className="text-muted-foreground mt-1">
						Scenarios for {selectedProject?.name}
					</p>
				)}
			</div>

			{/* Render appropriate grid based on current path */}
			{currentPath.length === 1 && leads.length > 0 && (
				<LeadsGrid
					leads={leads}
					onLeadClick={handleLeadClick}
					projectCounts={projectCounts}
				/>
			)}

			{currentPath.length === 2 && (
				<ProjectsGrid
					projects={currentItems as ProjectData[]}
					onProjectClick={handleProjectClick}
					onCreateProject={handleProjectCreated}
					selectedLead={selectedLead}
					availableIndustries={availableIndustries}
					availableTechnologies={availableTechnologies}
					userId={userId}
				/>
			)}

			{currentPath.length === 3 && currentItems.length > 0 && (
				<ScenariosGrid
					scenarios={currentItems as ScenarioData[]}
					availableIndustries={availableIndustries}
					availableTechnologies={availableTechnologies}
					resolvedNames={resolvedNames}
					onScenarioClick={handleScenarioClick}
				/>
			)}

			{/* Empty state - only show for other levels, not for projects */}
			{currentPath.length !== 2 && currentItems.length === 0 && (
				<EmptyState currentPathLength={currentPath.length} />
			)}

			{/* Scenarios Dialog */}
			<ScenariosDialog
				scenario={selectedScenario}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				availableIndustries={availableIndustries}
				availableTechnologies={availableTechnologies}
				resolvedNames={resolvedNames}
			/>
		</div>
	);
}
