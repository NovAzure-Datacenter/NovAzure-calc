import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { PhoneInputWrapper } from "../phone-input-wrapper";
import type { ClientData } from "@/lib/actions/client/client";

interface ClientContactInformationProps {
	client: ClientData;
	isEditing: boolean;
	onFieldChange: (field: keyof ClientData, value: any) => void;
}

export function ClientContactInformation({
	client,
	isEditing,
	onFieldChange,
}: ClientContactInformationProps) {
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
											value={client.mainContactFirstName || ""}
											onChange={(e) =>
												onFieldChange("mainContactFirstName", e.target.value)
											}
											placeholder="First Name"
											className="text-sm h-8"
										/>
										<Input
											value={client.mainContactLastName || ""}
											onChange={(e) =>
												onFieldChange("mainContactLastName", e.target.value)
											}
											placeholder="Last Name"
											className="text-sm h-8"
										/>
									</div>
									<Input
										value={client.mainContactEmail || ""}
										onChange={(e) =>
											onFieldChange("mainContactEmail", e.target.value)
										}
										placeholder="Email"
										type="email"
										className="text-sm h-8"
									/>
									<PhoneInputWrapper
										international
										defaultCountry="US"
										value={client.mainContactPhone || ""}
										onChange={(value: string) =>
											onFieldChange("mainContactPhone", value || "")
										}
										placeholder="Phone"
									/>
								</div>
							) : (
								<>
									<div className="font-medium text-sm">
										{client.mainContactFirstName} {client.mainContactLastName}
									</div>
									<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
										<Mail className="h-3 w-3" />
										<Button
											variant="ghost"
											size="sm"
											className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
											onClick={() =>
												window.open(
													`mailto:${client.mainContactEmail}`,
													"_blank"
												)
											}
										>
											{client.mainContactEmail}
										</Button>
									</div>
									{client.mainContactPhone && (
										<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
											<Phone className="h-3 w-3" />
											<Button
												variant="ghost"
												size="sm"
												className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
												onClick={() =>
													window.open(
														`tel:${client.mainContactPhone}`,
														"_blank"
													)
												}
											>
												{client.mainContactPhone}
											</Button>
										</div>
									)}
								</>
							)}
						</div>
					</div>

					{/* Technical Contact */}
					{(client.techContactFirstName ||
						client.techContactEmail ||
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
												value={client.techContactFirstName || ""}
												onChange={(e) =>
													onFieldChange("techContactFirstName", e.target.value)
												}
												placeholder="First Name"
												className="text-sm h-8"
											/>
											<Input
												value={client.techContactLastName || ""}
												onChange={(e) =>
													onFieldChange("techContactLastName", e.target.value)
												}
												placeholder="Last Name"
												className="text-sm h-8"
											/>
										</div>
										<Input
											value={client.techContactEmail || ""}
											onChange={(e) =>
												onFieldChange("techContactEmail", e.target.value)
											}
											placeholder="Email"
											type="email"
											className="text-sm h-8"
										/>
										<PhoneInputWrapper
											international
											defaultCountry="US"
											value={client.techContactPhone || ""}
											onChange={(value: string) =>
												onFieldChange("techContactPhone", value || "")
											}
											placeholder="Phone"
										/>
									</div>
								) : (
									<>
										<div className="font-medium text-sm">
											{client.techContactFirstName} {client.techContactLastName}
										</div>
										{client.techContactEmail && (
											<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
												<Mail className="h-3 w-3" />
												<Button
													variant="ghost"
													size="sm"
													className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
													onClick={() =>
														window.open(
															`mailto:${client.techContactEmail}`,
															"_blank"
														)
													}
												>
													{client.techContactEmail}
												</Button>
											</div>
										)}
										{client.techContactPhone && (
											<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
												<Phone className="h-3 w-3" />
												<Button
													variant="ghost"
													size="sm"
													className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
													onClick={() =>
														window.open(
															`tel:${client.techContactPhone}`,
															"_blank"
														)
													}
												>
													{client.techContactPhone}
												</Button>
											</div>
										)}
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
