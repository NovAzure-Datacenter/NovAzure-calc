"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { Grid3X3, RefreshCw, Search, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { getClientByUserId } from "@/lib/actions/clients/clients";
import { getClientSolutions } from "@/lib/actions/clients-solutions/clients-solutions";
import SolutionsList from "./solutions-list";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SolutionsMain() {
	const { user } = useUser();
	const router = useRouter();
	const [clientData, setClientData] = useState<any>(null);
	const [clientSolutions, setClientSolutions] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

	const loadData = useCallback(async () => {
		if (!user) return;

		setIsLoading(true);
		try {
			// Load client data
			const clientResult = await getClientByUserId(user._id);
			if (clientResult.client) {
				setClientData(clientResult.client);

				// Load client solutions
				const solutionsResult = await getClientSolutions(clientResult.client.id!);
				if (solutionsResult.solutions) {
					setClientSolutions(solutionsResult.solutions);
				} else if (solutionsResult.error) {
					console.error("Error loading solutions:", solutionsResult.error);
					toast.error("Failed to load solutions");
				} else {
					setClientSolutions([]);
				}
			} else if (clientResult.error) {
				console.error("Error loading client:", clientResult.error);
				toast.error("Failed to load client data");
			}
		} catch (error) {
			console.error("Error loading data:", error);
			toast.error("Failed to load data");
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	// Load client data and solutions
	useEffect(() => {
		loadData();
	}, [user, loadData]);

	const handleRefresh = () => {
		loadData();
	};

	const handleCreateSolution = () => {
		router.push("/home/product-and-solutions/solutions/create");
	};

	// Filter solutions based on search query
	const filteredSolutions = clientSolutions.filter((solution) => {
		const searchTerm = searchQuery.toLowerCase();
		return (
			solution.solution_name.toLowerCase().includes(searchTerm) ||
			solution.solution_description.toLowerCase().includes(searchTerm) ||
			solution.status.toLowerCase().includes(searchTerm)
		);
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="w-full">
				<CardContent className="w-full">
					<div className="flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search solutions..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Button
								onClick={handleCreateSolution}
								size="sm"
								className="text-xs"
							>
								<Plus className="h-4 w-4 " />
								Create
							</Button>

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
			
			{/* Solutions List */}
			<SolutionsList 
				solutions={filteredSolutions}
				viewMode={viewMode}
				isLoading={isLoading}
				onRefresh={loadData}
			/>
		</div>
	);
}
