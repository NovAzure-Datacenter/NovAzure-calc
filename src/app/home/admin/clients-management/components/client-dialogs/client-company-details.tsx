import React from "react";
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
import type { ClientData } from "@/lib/actions/client/client";

interface ClientCompanyDetailsProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
}

export function ClientCompanyDetails({
	client,
	isEditing,
	onFieldChange,
}: ClientCompanyDetailsProps) {
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
								value={client.companyIndustry || ""}
								onChange={(e) =>
									onFieldChange("companyIndustry", e.target.value)
								}
								placeholder="Industry"
								className="text-sm h-8"
							/>
						) : (
							<div className="text-sm">
								{client.companyIndustry || "Not specified"}
							</div>
						)}
					</div>
					<div>
						<div className="font-medium text-sm text-gray-700 mb-1">
							Company Size
						</div>
						{isEditing ? (
							<Select
								value={client.companySize || ""}
								onValueChange={(value) => onFieldChange("companySize", value)}
							>
								<SelectTrigger className="text-sm h-8">
									<SelectValue placeholder="Select size" />
								</SelectTrigger>
								<SelectContent>
									{companySizeOptions.map((option) => (
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
						) : (
							<div className="text-sm">
								{client.companySize || "Not specified"}
							</div>
						)}
					</div>
					<div>
						<div className="font-medium text-sm text-gray-700 mb-1">
							Client Status
						</div>
						{isEditing ? (
							<Select
								value={client.clientStatus || ""}
								onValueChange={(value) => onFieldChange("clientStatus", value)}
							>
								<SelectTrigger className="text-sm h-8">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{clientStatusOptions.map((option) => (
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
						) : (
							<Badge
								variant={getStatusVariant(client.clientStatus || "")}
								className="text-xs"
							>
								{client.clientStatus || "Unknown"}
							</Badge>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
