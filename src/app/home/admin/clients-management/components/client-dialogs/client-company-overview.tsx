import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Users } from "lucide-react";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import { companySizeOptions } from "../../utils/constants";
import type { ClientData } from "@/lib/actions/client/client";

interface ClientCompanyOverviewProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
	onIconClick?: () => void;
}

export function ClientCompanyOverview({
	client,
	isEditing,
	onFieldChange,
	onIconClick,
}: ClientCompanyOverviewProps) {
	const IconComponent = stringToIconComponent(client.logo);

	// Generate login email if possible
	const loginEmail =
		client.mainContactFirstName &&
		client.mainContactLastName &&
		client.companyName
			? `${client.mainContactFirstName[0].toUpperCase()}${client.mainContactLastName.toLowerCase()}-${client.companyName
					.replace(/[^a-zA-Z0-9]/g, "")
					.toLowerCase()}@novazure.com`
			: undefined;

	return (
		<Card>
			<CardContent className="pt-4 pb-4">
				<div className="flex items-start gap-4">
					<div className="flex items-center justify-center w-12 h-12 border rounded-lg bg-gray-50 relative">
						{isEditing ? (
							<button
								onClick={onIconClick}
								className="w-full h-full flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
								title="Click to change icon"
							>
								<IconComponent className="h-6 w-6 text-gray-600" />
							</button>
						) : (
							<IconComponent className="h-6 w-6 text-gray-600" />
						)}
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							{isEditing ? (
								<Input
									value={client.companyName || ""}
									onChange={(e) => onFieldChange("companyName", e.target.value)}
									className="text-lg font-bold border-0 bg-transparent p-0 focus-visible:ring-0"
								/>
							) : (
								<h3 className="font-semibold text-lg">{client.companyName}</h3>
							)}
							{client.companyIndustry && (
								<Badge variant="outline" className="text-xs">
									{isEditing ? (
										<Input
											value={client.companyIndustry || ""}
											onChange={(e) =>
												onFieldChange("companyIndustry", e.target.value)
											}
											className="text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
											placeholder="Industry"
										/>
									) : (
										client.companyIndustry
									)}
								</Badge>
							)}
						</div>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							{client.website && (
								<Button
									variant="ghost"
									size="sm"
									className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
									onClick={() => window.open(client.website, "_blank")}
								>
									<ExternalLink className="h-3 w-3 mr-1" />
									{isEditing ? (
										<Input
											value={client.website || ""}
											onChange={(e) => onFieldChange("website", e.target.value)}
											className="text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
											placeholder="Website"
										/>
									) : (
										client.website
									)}
								</Button>
							)}
							{client.companySize && (
								<span className="flex items-center gap-1">
									<Users className="h-3 w-3" />
									{isEditing ? (
										<Select
											value={client.companySize}
											onValueChange={(value) =>
												onFieldChange("companySize", value)
											}
										>
											<SelectTrigger className="text-xs h-6 w-auto border-0 bg-transparent p-0">
												<SelectValue />
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
										client.companySize
									)}
								</span>
							)}
						</div>
						{loginEmail && (
							<div className="flex items-center gap-2 mt-2">
								<span className="text-xs font-medium text-gray-600">
									Login Email:
								</span>
								<span className="text-xs bg-gray-100 rounded px-2 py-1 font-mono">
									{loginEmail}
								</span>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="text-xs h-6 px-2"
									onClick={() => {
										navigator.clipboard.writeText(loginEmail);
										// Note: toast should be handled by parent component
									}}
								>
									Copy
								</Button>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
