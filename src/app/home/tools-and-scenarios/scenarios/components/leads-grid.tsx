"use client";

import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LeadData } from "@/lib/actions/clients-leads/clients-leads";
import { ChevronRight } from "lucide-react";

interface LeadsGridProps {
	leads: LeadData[];
	onLeadClick: (lead: LeadData) => void;
	projectCounts?: Record<string, number>;
}

export function LeadsGrid({
	leads,
	onLeadClick,
	projectCounts,
}: LeadsGridProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
			{leads.map((lead) => (
				<Card
					key={lead.id}
					className="cursor-pointer hover:shadow-md transition-shadow group relative h-fit"
					onClick={() => onLeadClick(lead)}
				>
					{/* Status badge at top right */}
					{lead.status && (
						<Badge
							variant={
								lead.status === "Contacted"
									? "default"
									: lead.status === "Qualified"
									? "secondary"
									: "outline"
							}
							className="absolute top-2 right-2 text-xs"
						>
							{lead.status}
						</Badge>
					)}

					<CardHeader className="pb-2 pt-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
									<Users className="h-4 w-4 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<CardTitle className="text-sm font-medium truncate">
										{lead.company_name ||
											`${lead.first_name} ${lead.last_name}`}
									</CardTitle>

									<Badge variant="secondary" className="text-xs mt-1">
										{projectCounts?.[lead.id] || 0} projects
									</Badge>

									{/* Lead-specific information */}
									<div className="mt-2 space-y-1">
										<div className="text-xs font-medium text-foreground">
											{`${lead.first_name} ${lead.last_name}`}
										</div>
										{lead.website && (
											<div className="text-xs text-muted-foreground truncate">
												{lead.website}
											</div>
										)}
										{lead.last_contacted && (
											<div className="text-xs text-muted-foreground">
												Last contacted:{" "}
												{new Date(lead.last_contacted).toLocaleDateString()}
											</div>
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
	);
}
