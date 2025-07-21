import React, { memo, useCallback, useMemo } from "react";
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
import type { ClientData } from "@/lib/actions/clients/clients";

interface ClientAddressInformationProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
}

export const ClientAddressInformation = memo(({
	client,
	isEditing,
	onFieldChange,
}: ClientAddressInformationProps) => {
	const handleFieldChange = useCallback((field: keyof ClientData, value: any) => {
		onFieldChange(field, value);
	}, [onFieldChange]);

	const handleInputChange = useCallback((field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => {
		onFieldChange(field, e.target.value);
	}, [onFieldChange]);

	// Format address
	const fullAddress = useMemo(() => {
		const parts = [
			client.street,
			client.city,
			client.state_province,
			client.zipcode_postal_code,
			client.country,
		].filter(Boolean);
		return parts.join(", ");
	}, [client.street, client.city, client.state_province, client.zipcode_postal_code, client.country]);

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
							onChange={handleInputChange("street")}
							placeholder="Street Address"
							className="text-sm h-8"
						/>
						<div className="grid grid-cols-2 gap-3">
							<Input
								value={client.city || ""}
								onChange={handleInputChange("city")}
								placeholder="City"
								className="text-sm h-8"
							/>
							<Input
								value={client.state_province || ""}
								onChange={handleInputChange("state_province")}
								placeholder="State/Province"
								className="text-sm h-8"
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<Input
								value={client.zipcode_postal_code || ""}
								onChange={handleInputChange("zipcode_postal_code")}
								placeholder="ZIP/Postal Code"
								className="text-sm h-8"
							/>
							<Select
								value={client.country || ""}
								onValueChange={(value) => handleFieldChange("country", value)}
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
					<div className="text-sm">{fullAddress}</div>
				)}
			</CardContent>
		</Card>
	);
});

ClientAddressInformation.displayName = "ClientAddressInformation";
