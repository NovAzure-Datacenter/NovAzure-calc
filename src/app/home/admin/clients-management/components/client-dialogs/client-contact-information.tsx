import React, { memo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { PhoneInputWrapper } from "../phone-input-wrapper";
import type { ClientData } from "@/lib/actions/clients/clients";

interface ClientContactInformationProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
}

export const ClientContactInformation = memo(({
	client,
	isEditing,
	onFieldChange,
}: ClientContactInformationProps) => {
	const handleFieldChange = useCallback((field: keyof ClientData, value: any) => {
		onFieldChange(field, value);
	}, [onFieldChange]);

	const handleInputChange = useCallback((field: keyof ClientData) => (e: React.ChangeEvent<HTMLInputElement>) => {
		onFieldChange(field, e.target.value);
	}, [onFieldChange]);

	const handlePhoneChange = useCallback((field: keyof ClientData) => (value: string) => {
		onFieldChange(field, value || "");
	}, [onFieldChange]);

	return (
		<Card>
			<CardContent className="pt-4 pb-4">
				<h4 className="font-medium text-sm mb-3 flex items-center gap-2">
					<Mail className="h-4 w-4" />
					Contact Information
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Main Contact */}
					<div className="space-y-2">
						<div className="font-medium text-sm text-gray-700">
							Main Contact
						</div>
						<div className="bg-gray-50 rounded-lg p-3">
							{isEditing ? (
								<div className="space-y-2">
									<div className="grid grid-cols-2 gap-2">
										<Input
											value={client.main_contact_first_name || ""}
											onChange={handleInputChange("main_contact_first_name")}
											placeholder="First Name"
											className="text-sm h-8"
										/>
										<Input
											value={client.main_contact_last_name || ""}
											onChange={handleInputChange("main_contact_last_name")}
											placeholder="Last Name"
											className="text-sm h-8"
										/>
									</div>
									<Input
										value={client.main_contact_email || ""}
										onChange={handleInputChange("main_contact_email")}
										placeholder="Email"
										type="email"
										className="text-sm h-8"
									/>
									<PhoneInputWrapper
										international
										defaultCountry="US"
										value={client.main_contact_phone || ""}
										onChange={handlePhoneChange("main_contact_phone")}
										placeholder="Phone"
									/>
								</div>
							) : (
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-medium text-sm">
											{client.main_contact_first_name} {client.main_contact_last_name}
										</span>
									</div>
									{client.main_contact_email && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Mail className="h-3 w-3" />
											{client.main_contact_email}
										</div>
									)}
									{client.main_contact_phone && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Phone className="h-3 w-3" />
											{client.main_contact_phone}
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Technical Contact */}
					{(client.tech_contact_first_name ||
						client.tech_contact_email ||
						isEditing) && (
						<div className="space-y-2">
							<div className="font-medium text-sm text-gray-700">
								Technical Contact
							</div>
							<div className="bg-gray-50 rounded-lg p-3">
								{isEditing ? (
									<div className="space-y-2">
										<div className="grid grid-cols-2 gap-2">
											<Input
												value={client.tech_contact_first_name || ""}
												onChange={handleInputChange("tech_contact_first_name")}
												placeholder="First Name"
												className="text-sm h-8"
											/>
											<Input
												value={client.tech_contact_last_name || ""}
												onChange={handleInputChange("tech_contact_last_name")}
												placeholder="Last Name"
												className="text-sm h-8"
											/>
										</div>
										<Input
											value={client.tech_contact_email || ""}
											onChange={handleInputChange("tech_contact_email")}
											placeholder="Email"
											type="email"
											className="text-sm h-8"
										/>
										<PhoneInputWrapper
											international
											defaultCountry="US"
											value={client.tech_contact_phone || ""}
											onChange={handlePhoneChange("tech_contact_phone")}
											placeholder="Phone"
										/>
									</div>
								) : (
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<span className="font-medium text-sm">
												{client.tech_contact_first_name} {client.tech_contact_last_name}
											</span>
										</div>
										{client.tech_contact_email && (
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<Mail className="h-3 w-3" />
												{client.tech_contact_email}
											</div>
										)}
										{client.tech_contact_phone && (
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<Phone className="h-3 w-3" />
												{client.tech_contact_phone}
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
});

ClientContactInformation.displayName = "ClientContactInformation";
