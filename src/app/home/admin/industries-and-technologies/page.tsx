"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, Grid3X3, List, Building2, Zap, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableView } from "./components/industry-list-view";
import { GridView } from "./components/industry-grid-view";
import { TechnologyList } from "./components/technology-list-view";
import { CreateIndustryDialog } from "./components/create-industry-dialog";
import { CreateTechnologyDialog } from "./components/create-technology-dialog";
import type { Industry, Technology } from "./types";
import { TechnologyGridView } from "./components/technology-grid-view";
import { getIndustries, createIndustry, deleteIndustry } from "@/lib/actions/industry/industry";
import { getTechnologies, createTechnology, deleteTechnology, updateTechnology } from "@/lib/actions/technology/technology";
import { stringToIconComponent, iconComponentToString } from "@/lib/icons/lucide-icons";
import { toast } from "sonner";

export default function IndustriesAndTechnologies() {
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");
	const [searchQuery, setSearchQuery] = useState("");
	const [industries, setIndustries] = useState<Industry[]>([]);
	const [technologies, setTechnologies] = useState<Technology[]>([]);
	const [activeTab, setActiveTab] = useState<"industries" | "technologies">(
		"industries"
	);
	const [isLoading, setIsLoading] = useState(true);

	// Load industries and technologies from MongoDB on component mount
	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			setIsLoading(true);
			
			// Load industries
			const industriesResult = await getIndustries();
			if (industriesResult.error) {
				toast.error(industriesResult.error);
				// Fallback to empty array if database fails
				setIndustries([]);
			} else {
				// Transform database data to match the Industry type
				const transformedIndustries: Industry[] = (industriesResult.industries || []).map(
					(industry) => ({
						id: industry.id,
						logo: industry.icon ? stringToIconComponent(industry.icon) : Building2,
						name: industry.name,
						description: industry.description,
						technologies: (industry.technologies || []).map((tech: any) => ({
							...tech,
							icon: tech.icon ? stringToIconComponent(tech.icon) : Building2,
						})) as Technology[],
						companies: (industry.companies || []).map((company: any) => ({
							...company,
							// Don't transform company.icon since companies only have 'name' property (client ID)
						})),
						status: industry.status,
						parameters: industry.parameters || [],
					})
				);
				setIndustries(transformedIndustries);

			}
			// Load technologies
			const technologiesResult = await getTechnologies();
			if (technologiesResult.error) {
				toast.error(technologiesResult.error);
				// Fallback to empty array if database fails
				setTechnologies([]);
			} else {
				// Transform database data to match the Technology type
				const transformedTechnologies: Technology[] = (technologiesResult.technologies || []).map(
					(technology) => ({
						id: technology.id,
						name: technology.name,
						description: technology.description,
						icon: technology.icon ? stringToIconComponent(technology.icon) : Building2,
						status: technology.status || "pending",
						applicableIndustries: technology.applicableIndustries || [],
						parameters: technology.parameters || [],
					})
				);
				setTechnologies(transformedTechnologies);
			}
		} catch (error) {
			console.error("Error loading data:", error);
			toast.error("Failed to load data");
			// Fallback to empty arrays
			setIndustries([]);
			setTechnologies([]);
		} finally {
			setIsLoading(false);
		}
	};

	const filteredIndustries = industries.filter(
		(industry) =>
			industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			industry.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredTechnologies = technologies.filter(
		(tech) =>
			tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tech.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleCreateIndustry = async (
		newIndustry: Omit<Industry, "id" | "status">
	) => {
		try {

			const optimisticIndustry: Industry = {
				...newIndustry,
				id: `temp-${Date.now()}`, 
				status: "pending"
			};
			
			setIndustries(prev => [...prev, optimisticIndustry]);
			
			// Call server action
			const result = await createIndustry({
				name: newIndustry.name,
				description: newIndustry.description,
				technologies: newIndustry.technologies
					.map(t => t.id)
					.filter((id): id is string => id !== undefined), 
				icon: iconComponentToString(newIndustry.logo),
				parameters: newIndustry.parameters
			});
			
			if (result.error) {
				// Revert optimistic update on error
				setIndustries(prev => prev.filter(i => i.id !== optimisticIndustry.id));
				toast.error(result.error);
				return;
			}
			
			// Replace optimistic item with real data
			const realIndustry: Industry = {
				...optimisticIndustry,
				id: result.industryId!
			};
			
			setIndustries(prev => 
				prev.map(i => i.id === optimisticIndustry.id ? realIndustry : i)
			);
			
			toast.success("Industry created successfully!");
		} catch (error) {
			// Revert optimistic update
			setIndustries(prev => prev.filter(i => i.id !== `temp-${Date.now()}`));
			toast.error("Failed to create industry");
		}
	};

	const handleCreateTechnology = async (newTechnology: Technology) => {
		try {
			const optimisticTechnology: Technology = {
				...newTechnology,
				id: `temp-${Date.now()}`, 
			};
			
			setTechnologies(prev => [...prev, optimisticTechnology]);
			
			const result = await createTechnology({
				name: newTechnology.name,
				description: newTechnology.description,
				icon: iconComponentToString(newTechnology.icon),
				status: newTechnology.status,
				applicableIndustries: newTechnology.applicableIndustries,
				parameters: newTechnology.parameters
			});
			
			if (result.error) {
				// Revert optimistic update on error
				setTechnologies(prev => prev.filter(t => t.id !== optimisticTechnology.id));
				toast.error(result.error);
				return;
			}
			
			const realTechnology: Technology = {
				...optimisticTechnology,
				id: result.technologyId!
			};
			
			setTechnologies(prev => 
				prev.map(t => t.id === optimisticTechnology.id ? realTechnology : t)
			);
			
			toast.success("Technology created successfully!");
		} catch (error) {
			// Revert optimistic update
			setTechnologies(prev => prev.filter(t => t.id !== `temp-${Date.now()}`));
			toast.error("Failed to create technology");
		}
	};

	const handleIndustryDeleted = async () => {
		await loadData();
	};

	const handleTechnologyDeleted = async () => {
		await loadData();
	};

	const handleTechnologyUpdated = async () => {
		await loadData();
	};

	const handleRefresh = () => {
		// Trigger a refresh of the data
		loadData();
	};

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<div className="space-y-6">
				{/* Header */}
				<Card className="w-full">
					<CardContent className="w-full">
						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search industries and technologies..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={handleRefresh}
									className="text-xs"
									disabled={isLoading}
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Refresh
								</Button>
								<CreateIndustryDialog onCreate={handleCreateIndustry} />
								<CreateTechnologyDialog onCreate={handleCreateTechnology} />

								<Button
									variant={viewMode === "grid" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("grid")}
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "table" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("table")}
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Content */}
				<Tabs
					value={activeTab}
					onValueChange={(value) =>
						setActiveTab(value as "industries" | "technologies")
					}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="industries"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground"
						>
							<Building2 className="h-4 w-4" />
							Industries ({filteredIndustries.length})
						</TabsTrigger>
						<TabsTrigger
							value="technologies"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground"
						>
							<Zap className="h-4 w-4" />
							Technologies ({filteredTechnologies.length})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="industries" className="">
						<div className="w-full">
							{viewMode === "table" ? (
								<TableView data={filteredIndustries} onIndustryDeleted={handleIndustryDeleted} />
							) : (
								<GridView data={filteredIndustries} onIndustryDeleted={handleIndustryDeleted} />
							)} 
						</div>
					</TabsContent>

					<TabsContent value="technologies" className="">
						<div className="w-full">
							{viewMode === "table" ? (
								<TechnologyList 
									technologies={filteredTechnologies} 
									industries={industries} 
									onTechnologyDeleted={handleTechnologyDeleted}
									onTechnologyUpdated={handleTechnologyUpdated}
								/>
							) : (
								<TechnologyGridView 
									data={filteredTechnologies} 
									industries={industries} 
									onTechnologyDeleted={handleTechnologyDeleted}
									onTechnologyUpdated={handleTechnologyUpdated}
								/>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
