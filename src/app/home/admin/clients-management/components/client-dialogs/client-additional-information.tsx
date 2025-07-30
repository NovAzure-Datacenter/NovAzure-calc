import React, { memo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

import type { ClientData } from "@/lib/actions/clients/clients";
import { timezoneOptions } from "../../utils/constants";

interface ClientAdditionalInformationProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
}

export const ClientAdditionalInformation = memo(({
	client,
	isEditing,
	onFieldChange,
}: ClientAdditionalInformationProps) => {
	const handleFieldChange = useCallback((field: keyof ClientData, value: any) => {
		onFieldChange(field, value);
	}, [onFieldChange]);

	const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onFieldChange("additional_notes", e.target.value);
	};

	// Don't render if no additional information and not editing
	if (!client.timezone && !client.additional_notes && !isEditing) {
		return null;
	}

	return (
		<Card>
			<CardContent className="pt-4 pb-4">
				<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
					<Clock className="h-4 w-4" />
					Additional Information
				</h4>
				<div className="space-y-3">
					{isEditing ? (
						<>
							<div>
								<div className="font-medium text-sm text-gray-700 mb-1">
									Timezone
								</div>
								<Select
									value={client.timezone || ""}
									onValueChange={(value) => handleFieldChange("timezone", value)}
								>
									<SelectTrigger className="text-sm h-8">
										<SelectValue placeholder="Select timezone" />
									</SelectTrigger>
									<SelectContent>
										{timezoneOptions.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value}
												className="text-xs"
											>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<div className="font-medium text-sm text-gray-700 mb-1">
									Additional Notes
								</div>
								<Textarea
									value={client.additional_notes || ""}
									onChange={handleNotesChange}
									placeholder="Additional notes..."
									className="text-sm min-h-[80px]"
								/>
							</div>
						</>
					) : (
						<>
							{client.timezone && (
								<div>
									<div className="font-medium text-sm text-gray-700 mb-1">
										Timezone
									</div>
									<div className="text-sm">{client.timezone}</div>
								</div>
							)}
							{client.additional_notes && (
								<div>
									<div className="font-medium text-sm text-gray-700 mb-1">
										Additional Notes
									</div>
									<div className="text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-line">
										{client.additional_notes}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
});

ClientAdditionalInformation.displayName = "ClientAdditionalInformation";
