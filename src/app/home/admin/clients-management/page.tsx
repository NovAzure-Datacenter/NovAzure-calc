"use client";

import { ClientsTableView } from "./components/client-table-view";
import type { ClientData } from "@/lib/actions/client/client";
import { Card, CardContent } from "@/components/ui/card";
import { Grid3X3, List, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateClientDialog } from "./components/create-client-dialog";

export default function ClientsPage() {
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");
	const [searchQuery, setSearchQuery] = useState("");
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleCreateClient = async (newClient: ClientData) => {
		// Trigger a refresh of the clients list
		setRefreshTrigger(prev => prev + 1);
	};

	const handleRefresh = () => {
		// Trigger a refresh of the clients list
		setRefreshTrigger(prev => prev + 1);
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
									placeholder="Search clients..."
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
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Refresh
								</Button>
								<CreateClientDialog onCreate={handleCreateClient} />
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

				<ClientsTableView refreshTrigger={refreshTrigger} />
			</div>
		</div>
	);
}
