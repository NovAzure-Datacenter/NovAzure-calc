"use client";

import { UsersTableView } from "./user-table-view";
import type { User } from "../mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Grid3X3, List, Search, RefreshCw, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateUserDialog } from "./create-user-dialog";

export function UserManagementMain() {
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");
	const [searchQuery, setSearchQuery] = useState("");
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleCreateUser = async () => {
		// Trigger a refresh of the users list
		setRefreshTrigger((prev) => prev + 1);
	};

	const handleRefresh = () => {
		// Trigger a refresh of the users list
		setRefreshTrigger((prev) => prev + 1);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="w-full">
				<CardContent className="w-full">
					<div className="flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search users..."
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
							<CreateUserDialog onCreate={handleCreateUser} />
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

			<UsersTableView
				refreshTrigger={refreshTrigger}
				searchQuery={searchQuery}
			/>
		</div>
	);
}
