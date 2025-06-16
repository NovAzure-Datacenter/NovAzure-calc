import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Edit } from "lucide-react";
import { FormEvent } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BillingData } from "./types";

interface BillingInformationTabProps {
	billingData: BillingData;
	setBillingData: (data: BillingData) => void;
	handleBillingSubmit: (e: FormEvent) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
}

export default function BillingInformationTab({
	billingData,
	setBillingData,
	handleBillingSubmit,
	isEditing,
	setIsEditing,
}: BillingInformationTabProps) {
	return (
		<Card>  
			<CardHeader className="relative">
				<div className="flex items-center space-x-2">
					<CreditCard className="h-5 w-5" />
					<CardTitle>Billing Information</CardTitle>
				</div>
				<CardDescription>
					Manage your subscription plan and payment details.
				</CardDescription>
				{!isEditing && (
					<Button
						className="absolute top-6 right-6"
						onClick={() => {
							if (isEditing) {
								handleBillingSubmit(
									new Event("submit") as unknown as FormEvent
								);
							} else {
								setIsEditing(true);
							}
						}}
					>
						<>
							<Edit className="mr-2 h-4 w-4" /> Edit
						</>
					</Button>
				)}
			</CardHeader>
			<CardContent>
				<form onSubmit={handleBillingSubmit} className="space-y-6">
					<Separator />

					<div className="space-y-4">
						<h3 className="text-lg font-medium">Subscription Details</h3>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="plan" className="text-sm font-medium">
									Current Plan
								</Label>
								<CardDescription className="text-xs">
									Your active subscription plan.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="plan"
									value={billingData.plan}
									onChange={(e) =>
										setBillingData({ ...billingData, plan: e.target.value })
									}
									disabled={true}
								/>
								<Badge variant="secondary">{billingData.plan}</Badge>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="renewalDate" className="text-sm font-medium">
									Renewal Date
								</Label>
								<CardDescription className="text-xs">
									When your current subscription renews.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="renewalDate"
									value={billingData.renewalDate}
									onChange={(e) =>
										setBillingData({
											...billingData,
											renewalDate: e.target.value,
										})
									}
									disabled={true}
								/>
							</div>
						</div>
					</div>

					<Separator />

					<div className="space-y-4">
						<h3 className="text-lg font-medium">Payment Information</h3>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="paymentMethod" className="text-sm font-medium">
									Payment Method
								</Label>
								<CardDescription className="text-xs">
									Your linked payment method.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="paymentMethod"
									value={billingData.paymentMethod}
									onChange={(e) =>
										setBillingData({
											...billingData,
											paymentMethod: e.target.value,
										})
									}
									disabled={true}
								/>
								<div className="flex items-center text-sm text-muted-foreground">
									<CreditCard className="mr-2 h-4 w-4" />
									<span>•••• •••• •••• 4242</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col space-y-1">
								<Label htmlFor="billingEmail" className="text-sm font-medium">
									Billing Email
								</Label>
								<CardDescription className="text-xs">
									Email for billing notifications and receipts.
								</CardDescription>
							</div>
							<div className="space-y-2">
								<Input
									id="billingEmail"
									type="email"
									value={billingData.billingEmail}
									onChange={(e) =>
										setBillingData({
											...billingData,
											billingEmail: e.target.value,
										})
									}
									placeholder="billing@example.com"
									disabled={!isEditing}
								/>
							</div>
						</div>
					</div>

					{isEditing && (
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsEditing(false)}>
								{" "}
								Cancel{" "}
							</Button>
							<Button type="submit">Save Billing Settings</Button>
						</div>
					)}
				</form>
			</CardContent>
		</Card>
	);
}