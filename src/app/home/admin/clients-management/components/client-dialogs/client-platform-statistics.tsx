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
							{client.user_count || 0}
						</div>
						<div className="text-sm text-gray-600">Users</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							{client.product_count || 0}
						</div>
						<div className="text-sm text-gray-600">Products</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-yellow-600">
							{client.product_pending_count || 0}
						</div>
						<div className="text-sm text-gray-600">Pending</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600">
							{client.scenario_count || 0}
						</div>
						<div className="text-sm text-gray-600">Scenarios</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
