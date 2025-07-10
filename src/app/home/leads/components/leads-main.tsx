"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { Grid3X3, RefreshCw, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import LeadsList from "./leads-list";
import { CreateLeadDialog } from "./create-lead";
import {
	getLeadsByClientId,
	createLead,
	type LeadData,
} from "@/lib/actions/clients-leads/clients-leads";
import { useUser } from "@/hooks/useUser";

export function LeadsMain() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [leads, setLeads] = useState<LeadData[]>([]);
	const { user, isLoading: isUserLoading } = useUser();

	const handleRefresh = () => {
		loadData();
	};

	const loadData = async () => {
		if (!user?._id) {
			toast.error("User not authenticated");
			return;
		}

		setIsLoading(true);
		try {
			const result = await getLeadsByClientId(user._id);

			if (result.success && result.leads) {
				setLeads(result.leads);
			} else {
				toast.error(result.error || "Failed to load leads");
			}
		} catch (error) {
			console.error("Error loading data:", error);
			toast.error("Failed to load leads");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateLead = async (leadData: any) => {
		if (!user?._id) {
			toast.error("User not authenticated");
			return;
		}

		try {
			const result = await createLead(user._id, {
				...leadData,
				client_id: user._id,
				created_by: user._id,
			});

			if (result.success) {
				toast.success("Lead created successfully!");
				loadData(); // Refresh the leads list
			} else {
				toast.error(result.error || "Failed to create lead");
			}
		} catch (error) {
			console.error("Error creating lead:", error);
			toast.error("Failed to create lead");
		}
	};

	// Load data when user is available
	useEffect(() => {
		if (user?._id && !isUserLoading) {
			loadData();
		}
	}, [user?._id, isUserLoading]);

	// Filter leads based on search query
	const filteredLeads = leads.filter((lead) => {
		const searchTerm = searchQuery.toLowerCase();
		return (
			lead.first_name.toLowerCase().includes(searchTerm) ||
			lead.last_name.toLowerCase().includes(searchTerm) ||
			lead.contact_email.toLowerCase().includes(searchTerm) ||
			lead.contact_phone.includes(searchTerm) ||
			lead.notes.toLowerCase().includes(searchTerm)
		);
	});

	// Show loading state while user data is being fetched
	if (isUserLoading) {
		return (
			<div className="space-y-6">
				<Card className="w-full">
					<CardContent className="w-full">
						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<div className="h-10 bg-gray-200 rounded animate-pulse"></div>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
							</div>
						</div>
					</CardContent>
				</Card>
				<div className="h-[calc(100vh-200px)] flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
						<p className="text-muted-foreground">Loading leads...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="w-full">
				<CardContent className="w-full">
					<div className="flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search leads..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex items-center gap-2">
							<CreateLeadDialog onCreate={handleCreateLead} clientId={user?._id} />
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
						</div>
					</div>
				</CardContent>
			</Card>
			<LeadsList leads={filteredLeads} onLeadDeleted={loadData} />
		</div>
	);
}
