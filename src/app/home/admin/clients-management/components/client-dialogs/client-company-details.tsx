import React, { memo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import {
	companySizeOptions,
	clientStatusOptions,
	getStatusVariant,
} from "../../utils/constants";
import type { ClientData } from "@/lib/actions/clients/clients";

interface ClientCompanyDetailsProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
}

export const ClientCompanyDetails = memo(({
	client,
	isEditing,
	onFieldChange,
}: ClientCompanyDetailsProps) => {
	const handleFieldChange = useCallback((field: keyof ClientData, value: any) => {
		onFieldChange(field, value);
	}, [onFieldChange]);

	const handleInputChange = useCallback((field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => {
		onFieldChange(field, e.target.value);
	}, [onFieldChange]);

	return (
		<Card>
			<CardContent className="pt-4 pb-4">
				<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
					<Building2 className="h-4 w-4" />
					Company Details
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<div className="font-medium text-sm text-gray-700 mb-1">
							Industry
						</div>
						{isEditing ? (
							<Input
								value={client.company_industry || ""}
								onChange={handleInputChange("company_industry")}
								placeholder="e.g., Technology, Healthcare"
								className="text-sm h-8"
							/>
						) : (
							<div className="text-sm">
								{client.company_industry || "Not specified"}
							</div>
						)}
					</div>
					<div>
						<div className="font-medium text-sm text-gray-700 mb-1">
							Company Size
						</div>
						{isEditing ? (
							<Select
								value={client.company_size || ""}
								onValueChange={(value) => handleFieldChange("company_size", value)}
							>
								<SelectTrigger className="text-sm h-8">
									<SelectValue placeholder="Select company size" />
								</SelectTrigger>
								<SelectContent>
									{companySizeOptions.map((option) => (
										<SelectItem key={option.value} value={option.value} className="text-sm">
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<div className="text-sm">
								{client.company_size || "Not specified"}
							</div>
						)}
					</div>
					<div>
						<div className="font-medium text-sm text-gray-700 mb-1">
							Client Status
						</div>
						{isEditing ? (
							<Select
								value={client.client_status || ""}
								onValueChange={(value) => handleFieldChange("client_status", value)}
							>
								<SelectTrigger className="text-sm h-8">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{clientStatusOptions.map((option) => (
										<SelectItem key={option.value} value={option.value} className="text-sm">
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<div className="text-sm">
								{client.client_status ? (
									<Badge variant={getStatusVariant(client.client_status)}>
										{clientStatusOptions.find(
											(option) => option.value === client.client_status
										)?.label || client.client_status}
									</Badge>
								) : (
									"Not specified"
								)}
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
});

ClientCompanyDetails.displayName = "ClientCompanyDetails";
