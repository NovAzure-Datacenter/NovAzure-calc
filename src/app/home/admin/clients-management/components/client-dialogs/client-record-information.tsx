import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { ClientData } from "@/lib/actions/clients/clients";

interface ClientRecordInformationProps {
	client: ClientData;
}

export function ClientRecordInformation({
	client,
}: ClientRecordInformationProps) {
	return (
		<Card>
			<CardContent className="pt-4 pb-4">
				<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
					<Calendar className="h-4 w-4" />
					Record Information
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<div className="font-medium text-sm text-gray-700 mb-1">
							Created
						</div>
						<div className="text-sm">
							{client.created_at
								? new Date(client.created_at).toLocaleDateString()
								: "Not available"}
						</div>
					</div>
					<div>
						<div className="font-medium text-sm text-gray-700 mb-1">
							Last Updated
						</div>
						<div className="text-sm">
							{client.updated_at
								? new Date(client.updated_at).toLocaleDateString()
								: "Not available"}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
