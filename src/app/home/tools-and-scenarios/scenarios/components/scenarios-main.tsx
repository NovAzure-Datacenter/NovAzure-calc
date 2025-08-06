"use client";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Grid3X3, RefreshCw, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { getClientByUserId } from "@/lib/actions/clients/clients";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import { Building2 } from "lucide-react";
import type {
	Industry,
	Technology,
} from "@/app/home/admin/industries-and-technologies/types";
import { ScenariosFileSystem } from "./scenarios-file-system";

export function ScenariosMain() {
	const { user } = useUser();
	const [clientData, setClientData] = useState<any>(null);
	const [availableIndustries, setAvailableIndustries] = useState<Industry[]>([]);
	const [availableTechnologies, setAvailableTechnologies] = useState<Technology[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const loadData = useCallback(async () => {
		if (!user?._id) return;

		setIsLoading(true);
		try {
			// Get client data
			const clientResult = await getClientByUserId(user._id);
			if (clientResult.error) {
				toast.error("Failed to load client data");
				return;
			}
			setClientData(clientResult.client);

			// Load available industries
			const industriesResult = await getIndustries();
			if (industriesResult.error) {
				toast.error("Failed to load industries");
			} else {
				// Transform the API response to match the Industry type
				const transformedIndustries: Industry[] = (
					industriesResult.industries || []
				).map((industry) => ({
					id: industry.id,
					logo: industry.icon
						? stringToIconComponent(industry.icon)
						: Building2,
					name: industry.name,
					description: industry.description,
					technologies: (industry.technologies || []).map((tech: any) => ({
						...tech,
						icon: tech.icon ? stringToIconComponent(tech.icon) : Building2,
					})) as Technology[],
					companies: industry.companies || [],
					status: industry.status,
					parameters: industry.parameters || [],
				}));
				setAvailableIndustries(transformedIndustries);
			}

			// Load available technologies
			const technologiesResult = await getTechnologies();
			if (technologiesResult.error) {
				toast.error("Failed to load technologies");
			} else {
				// Transform the API response to match the Technology type
				const transformedTechnologies: Technology[] = (
					technologiesResult.technologies || []
				).map((tech) => ({
					id: tech.id,
					name: tech.name,
					description: tech.description,
					icon: tech.icon ? stringToIconComponent(tech.icon) : Building2,
					status: tech.status,
					applicableIndustries: tech.applicableIndustries || [],
					parameters: tech.parameters || [],
				}));
				setAvailableTechnologies(transformedTechnologies);
			}
		} catch (error) {
			toast.error("Failed to load required data");
		} finally {
			setIsLoading(false);
		}
	}, [user?._id]);

	useEffect(() => {
		loadData();
	}, [user?._id, loadData]);

	const handleRefresh = () => {
		loadData();
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
								placeholder="Search scenarios..."
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
						</div>
					</div>
				</CardContent>
			</Card>
			<ScenariosFileSystem
				clientData={clientData}
				availableIndustries={availableIndustries}
				availableTechnologies={availableTechnologies}
				isLoading={isLoading}
				searchQuery={searchQuery}
				userId={user?._id || ""}
			/>
		</div>
	);
}
