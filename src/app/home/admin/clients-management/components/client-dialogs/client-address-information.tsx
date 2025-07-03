import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { countryOptions } from "@/lib/constants/country-options";
import type { ClientData } from "@/lib/actions/client/client";

interface ClientAddressInformationProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
}

export function ClientAddressInformation({
	client,
	isEditing,
	onFieldChange,
}: ClientAddressInformationProps) {
	// Format address
	const formatAddress = () => {
		const parts = [
			client.street,
			client.city,
			client.stateProvince,
			client.zipcodePostalCode,
			client.country,
		].filter(Boolean);
		return parts.length > 0 ? parts.join(", ") : "No address provided";
	};

	return (
		<Card>
			<CardContent className="pt-4 pb-4">
				<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
					<MapPin className="h-4 w-4" />
					Address Information
				</h4>
				{isEditing ? (
					<div className="space-y-3">
						<Input
							value={client.street || ""}
							onChange={(e) => onFieldChange("street", e.target.value)}
							placeholder="Street Address"
							className="text-sm h-8"
						/>
						<div className="grid grid-cols-2 gap-3">
							<Input
								value={client.city || ""}
								onChange={(e) => onFieldChange("city", e.target.value)}
								placeholder="City"
								className="text-sm h-8"
							/>
							<Input
								value={client.stateProvince || ""}
								onChange={(e) => onFieldChange("stateProvince", e.target.value)}
								placeholder="State/Province"
								className="text-sm h-8"
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<Input
								value={client.zipcodePostalCode || ""}
								onChange={(e) =>
									onFieldChange("zipcodePostalCode", e.target.value)
								}
								placeholder="ZIP/Postal Code"
								className="text-sm h-8"
							/>
							<Select
								value={client.country || ""}
								onValueChange={(value) => onFieldChange("country", value)}
							>
								<SelectTrigger className="text-sm h-8">
									<SelectValue placeholder="Select country" />
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									{countryOptions.map((option) => (
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
					</div>
				) : (
					<div className="text-sm">{formatAddress()}</div>
				)}
			</CardContent>
		</Card>
	);
}
