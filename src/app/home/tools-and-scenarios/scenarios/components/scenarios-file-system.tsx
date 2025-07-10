"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
	ChevronRight,
	Folder,
	FileText,
	ArrowLeft,
	Home,
	Building2,
	Fuel,
	Factory,
	Hospital,
	Zap,
	Wind,
	Droplets,
	Thermometer,
	Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockSavedScenarios } from "../mock-data";
import { getSolutionById } from "@/lib/actions/solution/solution";
import { getUserById } from "@/lib/actions/user/user";
import { ScenariosDialog } from "./scenarios-dialog";
import type {
	Industry,
	Technology,
} from "../../../admin/industries-and-technologies/types";
import type { SavedCalculationScenario } from "../mock-data";

interface FileSystemItem {
	id: string;
	name: string;
	type: "industry" | "technology" | "scenario";
	icon: React.ComponentType<{ className?: string }>;
	description?: string;
	status?: "verified" | "pending" | "active";
	count?: number;
}

interface BreadcrumbItem {
	id: string;
	name: string;
	type: "root" | "industry" | "technology";
}

interface ScenariosFileSystemProps {
	clientData: any;
	availableIndustries: Industry[];
	availableTechnologies: Technology[];
	isLoading: boolean;
	searchQuery: string;
}

export function ScenariosFileSystem({
	clientData,
	availableIndustries,
	availableTechnologies,
	isLoading,
	searchQuery,
}: ScenariosFileSystemProps) {
	// Navigation state
	const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([
		{ id: "root", name: "Industries", type: "root" },
	]);
	const [currentItems, setCurrentItems] = useState<FileSystemItem[]>([]);
	const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
		null
	);
	const [selectedTechnology, setSelectedTechnology] =
		useState<Technology | null>(null);
	const [filteredScenarios, setFilteredScenarios] = useState<
		SavedCalculationScenario[]
	>([]);

	// Dialog state
	const [selectedScenario, setSelectedScenario] = useState<SavedCalculationScenario | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	// Cache for solution and user data
	const [solutionCache, setSolutionCache] = useState<Record<string, any>>({});
	const [userCache, setUserCache] = useState<Record<string, string>>({});

	// State for resolved names
	const [resolvedNames, setResolvedNames] = useState<Record<string, string>>(
		{}
	);

	// Effect to resolve solution and user names when scenarios change
	useEffect(() => {
		async function resolveNames() {
			const newResolvedNames: Record<string, string> = {};

			for (const scenario of filteredScenarios) {
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

		if (filteredScenarios.length > 0) {
			resolveNames();
		}
	}, [filteredScenarios]);

	// Helper function to get resolved name
	function getResolvedName(type: "solution" | "user", id: string): string {
		const cacheKey = `${type}_${id}`;
		return resolvedNames[cacheKey] || id;
	}

	// Load industries when availableIndustries changes and we're at root level
	useEffect(() => {
		if (availableIndustries.length > 0 && currentPath.length === 1) {
			loadIndustries();
		}
	}, [availableIndustries, currentPath.length, clientData]);

	// Load industries for the current view
	function loadIndustries() {
		if (availableIndustries.length === 0 || !clientData) return;

		// Get client's selected industries
		const clientSelectedIndustries = clientData?.selected_industries || [];

		// Filter to only show industries relevant to this client
		const relevantIndustries = availableIndustries.filter((industry) =>
			clientSelectedIndustries.includes(industry.id)
		);

		const industryItems: FileSystemItem[] = relevantIndustries.map(
			(industry) => ({
				id: industry.id,
				name: industry.name,
				type: "industry" as const,
				icon: Folder,
				description: industry.description,
				status: industry.status,
				count: getScenariosForIndustry(industry.id).length,
			})
		);
		setCurrentItems(industryItems);
	}

	// Load technologies for a specific industry
	function loadTechnologiesForIndustry(industryId: string) {
		const applicableTechnologies = availableTechnologies.filter(
			(tech) =>
				tech.id &&
				tech.applicableIndustries &&
				tech.applicableIndustries.includes(industryId)
		);

		const technologyItems: FileSystemItem[] = applicableTechnologies.map(
			(tech) => ({
				id: tech.id!,
				name: tech.name,
				type: "technology" as const,
				icon: FileText,
				description: tech.description,
				status: tech.status,
				count: getScenariosForIndustryAndTechnology(industryId, tech.id!)
					.length,
			})
		);
		setCurrentItems(technologyItems);
	}

	// Load scenarios for a specific industry and technology
	function loadScenariosForIndustryAndTechnology(
		industryId: string,
		technologyId: string
	) {
		const scenarios = getScenariosForIndustryAndTechnology(
			industryId,
			technologyId
		);
		const scenarioItems: FileSystemItem[] = scenarios.map((scenario) => ({
			id: scenario.scenario_name, // Use scenario name as ID since there's no id property
			name: scenario.scenario_name,
			type: "scenario" as const,
			icon: FileText,
			description: `${scenario.solution[0] || "Unknown Solution"} - ${
				scenario.solution_variant
			}`,
			status: "verified", // Default status since it's not in the new structure
			count: undefined, // No count for scenarios
		}));
		setCurrentItems(scenarioItems);
		setFilteredScenarios(scenarios);
	}

	// Helper functions to resolve IDs to names
	function getIndustryName(industryId: string): string {
		const industry = availableIndustries.find((ind) => ind.id === industryId);
		return industry?.name || industryId;
	}

	function getTechnologyName(technologyId: string): string {
		const technology = availableTechnologies.find(
			(tech) => tech.id === technologyId
		);
		return technology?.name || technologyId;
	}

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

	function getResultInfo(results: any[]): { name: string; count: number } {
		if (!results || results.length === 0) {
			return { name: "No Results", count: 0 };
		}

		const firstResult = results[0];
		const resultKeys = Object.keys(firstResult);
		const resultName = resultKeys[0] || "Unknown";
		const resultData = firstResult[resultName];
		const dataKeys = resultData ? Object.keys(resultData) : [];

		return { name: resultName, count: dataKeys.length };
	}

	// Helper functions to get scenarios
	function getScenariosForIndustry(
		industryId: string
	): SavedCalculationScenario[] {
		return mockSavedScenarios.filter((scenario) =>
			scenario.industry.includes(industryId)
		);
	}

	function getScenariosForIndustryAndTechnology(
		industryId: string,
		technologyId: string
	): SavedCalculationScenario[] {
		return mockSavedScenarios.filter(
			(scenario) =>
				scenario.industry.includes(industryId) &&
				scenario.technology.includes(technologyId)
		);
	}

	// Navigation handlers
	function handleItemClick(item: FileSystemItem) {
		if (item.type === "industry") {
			const industry = availableIndustries.find((ind) => ind.id === item.id);
			if (industry) {
				setSelectedIndustry(industry);
				setSelectedTechnology(null);
				loadTechnologiesForIndustry(item.id);

				// Update breadcrumb
				setCurrentPath([
					{ id: "root", name: "Industries", type: "root" },
					{ id: industry.id, name: industry.name, type: "industry" },
				]);
			}
		} else if (item.type === "technology") {
			const technology = availableTechnologies.find(
				(tech) => tech.id === item.id
			);
			if (technology && selectedIndustry && technology.id) {
				setSelectedTechnology(technology);
				loadScenariosForIndustryAndTechnology(
					selectedIndustry.id,
					technology.id
				);

				// Update breadcrumb
				setCurrentPath([
					{ id: "root", name: "Industries", type: "root" },
					{
						id: selectedIndustry.id,
						name: selectedIndustry.name,
						type: "industry",
					},
					{ id: technology.id, name: technology.name, type: "technology" },
				]);
			}
		} else if (item.type === "scenario") {
			// Handle scenario selection - open dialog
			const scenario = mockSavedScenarios.find((s) => s.scenario_name === item.name);
			if (scenario) {
				setSelectedScenario(scenario);
				setDialogOpen(true);
			}
		}
	}

	function handleBreadcrumbClick(item: BreadcrumbItem) {
		if (item.type === "root") {
			setCurrentPath([{ id: "root", name: "Industries", type: "root" }]);
			setSelectedIndustry(null);
			setSelectedTechnology(null);
			loadIndustries();
		} else if (item.type === "industry") {
			const industry = availableIndustries.find((ind) => ind.id === item.id);
			if (industry) {
				setSelectedIndustry(industry);
				setSelectedTechnology(null);
				loadTechnologiesForIndustry(item.id);
				setCurrentPath([
					{ id: "root", name: "Industries", type: "root" },
					{ id: industry.id, name: industry.name, type: "industry" },
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

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-8 w-64" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className="h-32" />
					))}
				</div>
			</div>
		);
	}

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
								name: "Industries",
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
				{currentPath.length > 1 && (
					<p className="text-muted-foreground mt-1">
						{currentPath.length === 2
							? `Technologies available for ${selectedIndustry?.name}`
							: `Scenarios for ${selectedTechnology?.name} in ${selectedIndustry?.name}`}
					</p>
				)}
			</div>

			{/* File system items grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{currentItems.map((item) => {
					// Get scenario data if this is a scenario item
					const scenario =
						item.type === "scenario"
							? mockSavedScenarios.find((s) => s.scenario_name === item.name)
							: null;

					return (
						<Card
							key={item.id}
							className="cursor-pointer hover:shadow-md transition-shadow group relative"
							onClick={() => handleItemClick(item)}
						>
							{/* Status badge at top right */}
							{item.status && (
								<Badge
									variant={
										item.status === "verified"
											? "default"
											: item.status === "active"
											? "secondary"
											: "outline"
									}
									className="absolute top-2 right-2 text-xs"
								>
									{item.status}
								</Badge>
							)}

							<CardHeader className="pb-2 pt-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
											<item.icon className="h-4 w-4 text-primary" />
										</div>
										<div className="flex-1 min-w-0">
											<CardTitle className="text-sm font-medium truncate">
												{item.name}
											</CardTitle>

											{item.count !== undefined && item.type !== "scenario" && (
												<Badge variant="secondary" className="text-xs mt-1">
													{item.count} scenarios
												</Badge>
											)}

											{/* Comparison info below scenario name */}
											{item.type === "scenario" && scenario && scenario.compared_to &&
												scenario.compared_to.length > 0 && (
													<div className="mt-2">
													
														<div className="flex flex-wrap gap-1">
															<Badge variant="outline" className="text-xs">
																Compared to: {scenario.compared_to.join(", ")}
															</Badge>
														</div>
													</div>
												)}
										</div>
									</div>
									{item.type !== "scenario" && (
										<ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
									)}
								</div>
							</CardHeader>

							{/* Scenario-specific information */}
							{item.type === "scenario" && scenario && (
								<CardContent className="pt-0 pb-3 space-y-3">
									{/* Industry and Technology on same line */}
									<div>
										<div className="text-xs font-medium text-muted-foreground mb-1">
											Industry & Technology
										</div>
										<div className="flex flex-wrap gap-1">
											{scenario.industry.map((industryId, index) => (
												<Badge
													key={index}
													variant="outline"
													className="text-xs"
												>
													{getIndustryName(industryId)}
												</Badge>
											))}
											{scenario.technology.map((techId, index) => (
												<Badge
													key={index}
													variant="outline"
													className="text-xs"
												>
													{getTechnologyName(techId)}
												</Badge>
											))}
										</div>
									</div>

									{/* Solution badges */}
									<div>
										<div className="text-xs font-medium text-muted-foreground mb-1">
											Solution
										</div>
										<div className="flex flex-wrap gap-1">
											{scenario.solution.map((solutionId, index) => (
												<Badge
													key={index}
													variant="secondary"
													className="text-xs"
												>
													{getResolvedName("solution", solutionId)}
												</Badge>
											))}
											{scenario.solution_variant &&
												scenario.solution_variant !== "N/A" && (
													<Badge variant="secondary" className="text-xs">
														{scenario.solution_variant}
													</Badge>
												)}
										</div>
									</div>

									{/* Parameters and Results on same horizontal line */}
									<div>
										<div className="text-xs font-medium text-muted-foreground mb-1">
											Parameters & Results
										</div>
										<div className="flex flex-wrap gap-2">
											<Badge variant="outline" className="text-xs">
												{scenario.input_parameters?.length || 0} parameters
											</Badge>
											{scenario.results &&
												scenario.results.length > 0 &&
												(() => {
													const resultInfo = getResultInfo(scenario.results);
													return (
														<Badge variant="outline" className="text-xs">
															{resultInfo.name}: {resultInfo.count} values
														</Badge>
													);
												})()}
										</div>
									</div>
								</CardContent>
							)}

							{/* For non-scenario items, show description if available */}
							{item.type !== "scenario" && item.description && (
								<CardContent className="pt-0 pb-3">
									<p className="text-xs text-muted-foreground line-clamp-2">
										{item.description}
									</p>
								</CardContent>
							)}

							{/* User info at bottom right - always positioned at bottom */}
							{item.type === "scenario" && scenario && (
								<div className="absolute bottom-2 right-2">
									<Badge variant="outline" className="text-xs">
										{getResolvedName("user", scenario.user_id)}
									</Badge>
								</div>
							)}
						</Card>
					);
				})}
			</div>

			{/* Empty state */}
			{currentItems.length === 0 && (
				<div className="text-center py-12">
					<Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-medium mb-2">No items found</h3>
					<p className="text-muted-foreground">
						{currentPath.length === 1
							? "No industries available"
							: currentPath.length === 2
							? "No technologies available for this industry"
							: "No scenarios available for this technology"}
					</p>
				</div>
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
