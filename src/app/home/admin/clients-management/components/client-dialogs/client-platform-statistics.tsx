import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import type { ClientData } from "@/lib/actions/client/client";

interface ClientPlatformStatisticsProps {
	client: ClientData;
}

export function ClientPlatformStatistics({
	client,
}: ClientPlatformStatisticsProps) {
	return (
		<Card>
			<CardContent className="pt-4 pb-4">
				<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
					<Package className="h-4 w-4" />
					Platform Statistics
				</h4>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{client.userCount || 0}
						</div>
						<div className="text-xs text-muted-foreground">Users</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							{client.productCount || 0}
						</div>
						<div className="text-xs text-muted-foreground">Products</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-yellow-600">
							{client.productPendingCount || 0}
						</div>
						<div className="text-xs text-muted-foreground">Pending</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600">
							{client.scenarioCount || 0}
						</div>
						<div className="text-xs text-muted-foreground">Scenarios</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
