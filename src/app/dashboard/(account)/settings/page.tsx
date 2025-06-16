"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Camera, CreditCard, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccountType } from "@/contexts/account-type-context-debug";

export default function AccountSettingsPage() {
	const { accountType } = useAccountType();

	// Personal profile state
	const [personalData, setPersonalData] = useState({
		firstName: "John",
		lastName: "Doe",
		email: "john.doe@company.com",
		workPhone: "+1 (555) 123-4567",
		mobilePhone: "+1 (555) 987-6543",
		jobTitle: "Product Manager",
		timeZone: "America/New_York",
		dateFormat: "MM/DD/YYYY",
		profilePicture: "",
	});

	// Company data state
	const [companyData, setCompanyData] = useState({
		companyName: "Acme Corporation",
		companyAddress: "123 Business Ave, Suite 100, New York, NY 10001",
		companyPhone: "+1 (555) 123-0000",
		website: "https://acme-corp.com",
		industry: "Technology",
		employeeCount: "51-200",
		currency: "USD",
		logo: "",
	});

	// Billing data state
	const [billingData, setBillingData] = useState({
		plan: "Professional",
		renewalDate: "2024-12-15",
		paymentMethod: "•••• •••• •••• 4242",
		billingEmail: "billing@company.com",
	});

	const handlePersonalSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Personal data updated:", personalData);
		// Handle personal data update
	};

	const handleCompanySubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Company data updated:", companyData);
		// Handle company data update
	};

	const timeZones = [
		"America/New_York",
		"America/Chicago",
		"America/Denver",
		"America/Los_Angeles",
		"Europe/London",
		"Europe/Paris",
		"Asia/Tokyo",
	];

	const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD MMM YYYY"];

	const industries = [
		"Technology",
		"Healthcare",
		"Finance",
		"Education",
		"Manufacturing",
		"Retail",
		"Other",
	];

	const employeeCounts = [
		"1-10",
		"11-50",
		"51-200",
		"201-500",
		"501-1000",
		"1000+",
	];

	const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"];

	return (
		<div className="space-y-6">
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Header */}
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Account Settings
					</h1>
					<p className="text-muted-foreground">
						Manage your account settings and preferences.
					</p>
				</div>

				{accountType === "super-admin" ? (
					<Tabs defaultValue="personal" className="space-y-6">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="personal" className="flex items-center gap-2">
								<User className="h-4 w-4" />
								Personal Profile
							</TabsTrigger>
							<TabsTrigger value="company" className="flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								Company Settings
							</TabsTrigger>
							<TabsTrigger value="billing" className="flex items-center gap-2">
								<CreditCard className="h-4 w-4" />
								Billing Information
							</TabsTrigger>
						</TabsList>

						<TabsContent value="personal">
							<Card>
								<CardHeader>
									<div className="flex items-center space-x-2">
										<User className="h-5 w-5" />
										<CardTitle>Personal Profile</CardTitle>
									</div>
									<CardDescription>
										Update your personal information and preferences.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form onSubmit={handlePersonalSubmit} className="space-y-6">
										{/* Profile Picture */}
										<div className="flex items-center space-x-4">
											<Avatar className="h-20 w-20">
												<AvatarImage
													src={personalData.profilePicture || "/placeholder.svg"}
												/>
												<AvatarFallback className="text-lg">
													{personalData.firstName[0]}
													{personalData.lastName[0]}
												</AvatarFallback>
											</Avatar>
											<div className="space-y-2">
												<Label>Profile Picture</Label>
												<Button variant="outline" size="sm">
													<Camera className="mr-2 h-4 w-4" />
													Change Photo
												</Button>
											</div>
										</div>

										<Separator />

										{/* Name Fields */}
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="firstName">First Name</Label>
												<Input
													id="firstName"
													value={personalData.firstName}
													onChange={(e) =>
														setPersonalData({
															...personalData,
															firstName: e.target.value,
														})
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="lastName">Last Name</Label>
												<Input
													id="lastName"
													value={personalData.lastName}
													onChange={(e) =>
														setPersonalData({
															...personalData,
															lastName: e.target.value,
														})
													}
												/>
											</div>
										</div>

										{/* Contact Information */}
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="email">Email Address</Label>
												<Input
													id="email"
													type="email"
													value={personalData.email}
													onChange={(e) =>
														setPersonalData({
															...personalData,
															email: e.target.value,
														})
													}
												/>
											</div>

											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="workPhone">Work Phone</Label>
													<Input
														id="workPhone"
														value={personalData.workPhone}
														onChange={(e) =>
															setPersonalData({
																...personalData,
																workPhone: e.target.value,
															})
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="mobilePhone">Mobile Phone</Label>
													<Input
														id="mobilePhone"
														value={personalData.mobilePhone}
														onChange={(e) =>
															setPersonalData({
																...personalData,
																mobilePhone: e.target.value,
															})
														}
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="jobTitle">Job Title</Label>
												<Input
													id="jobTitle"
													value={personalData.jobTitle}
													onChange={(e) =>
														setPersonalData({
															...personalData,
															jobTitle: e.target.value,
														})
													}
												/>
											</div>
										</div>

										<Separator />

										{/* Preferences */}
										<div className="space-y-4">
											<h3 className="text-lg font-medium">Preferences</h3>

											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="timeZone">Time Zone</Label>
													<Select
														value={personalData.timeZone}
														onValueChange={(value) =>
															setPersonalData({ ...personalData, timeZone: value })
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{timeZones.map((tz) => (
																<SelectItem key={tz} value={tz}>
																	{tz}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												<div className="space-y-2">
													<Label htmlFor="dateFormat">Date Format</Label>
													<Select
														value={personalData.dateFormat}
														onValueChange={(value) =>
															setPersonalData({ ...personalData, dateFormat: value })
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{dateFormats.map((format) => (
																<SelectItem key={format} value={format}>
																	{format}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>

										<Separator />

										{/* Password Section */}
										<div className="space-y-4">
											<h3 className="text-lg font-medium">Security</h3>
											<div className="space-y-2">
												<Label>Password</Label>
												<Button variant="outline" type="button">
													Change Password
												</Button>
												<p className="text-sm text-muted-foreground">
													Last changed 3 months ago
												</p>
											</div>
										</div>

										<div className="flex justify-end">
											<Button type="submit">Save Personal Settings</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="company">
							<Card>
								<CardHeader>
									<div className="flex items-center space-x-2">
										<Building2 className="h-5 w-5" />
										<CardTitle>Company Settings</CardTitle>
									</div>
									<CardDescription>
										Manage your organization's information and preferences.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleCompanySubmit} className="space-y-6">
										{/* Company Logo */}
										<div className="flex items-center space-x-4">
											<div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
												<Building2 className="h-8 w-8 text-muted-foreground" />
											</div>
											<div className="space-y-2">
												<Label>Company Logo</Label>
												<Button variant="outline" size="sm">
													<Camera className="mr-2 h-4 w-4" />
													Upload Logo
												</Button>
											</div>
										</div>

										<Separator />

										{/* Company Information */}
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="companyName">Company Name</Label>
												<Input
													id="companyName"
													value={companyData.companyName}
													onChange={(e) =>
														setCompanyData({
															...companyData,
															companyName: e.target.value,
														})
													}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="companyAddress">Company Address</Label>
												<Textarea
													id="companyAddress"
													value={companyData.companyAddress}
													onChange={(e) =>
														setCompanyData({
															...companyData,
															companyAddress: e.target.value,
														})
													}
													rows={3}
												/>
											</div>

											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="companyPhone">Company Phone</Label>
													<Input
														id="companyPhone"
														value={companyData.companyPhone}
														onChange={(e) =>
															setCompanyData({
																...companyData,
																companyPhone: e.target.value,
															})
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="website">Website</Label>
													<Input
														id="website"
														value={companyData.website}
														onChange={(e) =>
															setCompanyData({
																...companyData,
																website: e.target.value,
															})
														}
													/>
												</div>
											</div>

											<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
												<div className="space-y-2">
													<Label htmlFor="industry">Industry</Label>
													<Select
														value={companyData.industry}
														onValueChange={(value) =>
															setCompanyData({ ...companyData, industry: value })
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{industries.map((industry) => (
																<SelectItem key={industry} value={industry}>
																	{industry}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												<div className="space-y-2">
													<Label htmlFor="employeeCount">
														Number of Employees
													</Label>
													<Select
														value={companyData.employeeCount}
														onValueChange={(value) =>
															setCompanyData({
																...companyData,
																employeeCount: value,
															})
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{employeeCounts.map((count) => (
																<SelectItem key={count} value={count}>
																	{count}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												<div className="space-y-2">
													<Label htmlFor="currency">Default Currency</Label>
													<Select
														value={companyData.currency}
														onValueChange={(value) =>
															setCompanyData({ ...companyData, currency: value })
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{currencies.map((currency) => (
																<SelectItem key={currency} value={currency}>
																	{currency}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>

										<div className="flex justify-end">
											<Button type="submit">Save Company Settings</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="billing">
							<Card>
								<CardHeader>
									<div className="flex items-center space-x-2">
										<CreditCard className="h-5 w-5" />
										<CardTitle>Billing Information</CardTitle>
									</div>
									<CardDescription>
										Manage your subscription and billing details.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Current Plan</Label>
											<div className="flex items-center space-x-2">
												<Badge variant="default">{billingData.plan}</Badge>
												<Button variant="outline" size="sm">
													Upgrade
												</Button>
											</div>
										</div>

										<div className="space-y-2">
											<Label>Next Renewal</Label>
											<p className="text-sm font-medium">
												{billingData.renewalDate}
											</p>
										</div>
									</div>

									<div className="space-y-4">
										<div className="space-y-2">
											<Label>Payment Method</Label>
											<div className="flex items-center justify-between rounded-lg border p-3">
												<div className="flex items-center space-x-2">
													<CreditCard className="h-4 w-4" />
													<span className="text-sm">
														{billingData.paymentMethod}
													</span>
												</div>
												<Button variant="outline" size="sm">
													Update
												</Button>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="billingEmail">Billing Email</Label>
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
											/>
										</div>
									</div>

									<div className="flex justify-between">
										<Button variant="outline">Download Invoice</Button>
										<Button>Save Billing Settings</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				) : (
					<Card>
						<CardHeader>
							<div className="flex items-center space-x-2">
								<User className="h-5 w-5" />
								<CardTitle>Personal Profile</CardTitle>
							</div>
							<CardDescription>
								Update your personal information and preferences.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePersonalSubmit} className="space-y-6">
								{/* Profile Picture */}
								<div className="flex items-center space-x-4">
									<Avatar className="h-20 w-20">
										<AvatarImage
											src={personalData.profilePicture || "/placeholder.svg"}
										/>
										<AvatarFallback className="text-lg">
											{personalData.firstName[0]}
											{personalData.lastName[0]}
										</AvatarFallback>
									</Avatar>
									<div className="space-y-2">
										<Label>Profile Picture</Label>
										<Button variant="outline" size="sm">
											<Camera className="mr-2 h-4 w-4" />
											Change Photo
										</Button>
									</div>
								</div>

								<Separator />

								{/* Name Fields */}
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="firstName">First Name</Label>
										<Input
											id="firstName"
											value={personalData.firstName}
											onChange={(e) =>
												setPersonalData({
													...personalData,
													firstName: e.target.value,
												})
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											id="lastName"
											value={personalData.lastName}
											onChange={(e) =>
												setPersonalData({
													...personalData,
													lastName: e.target.value,
												})
											}
										/>
									</div>
								</div>

								{/* Contact Information */}
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											type="email"
											value={personalData.email}
											onChange={(e) =>
												setPersonalData({
													...personalData,
													email: e.target.value,
												})
											}
										/>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="workPhone">Work Phone</Label>
											<Input
												id="workPhone"
												value={personalData.workPhone}
												onChange={(e) =>
													setPersonalData({
														...personalData,
														workPhone: e.target.value,
													})
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="mobilePhone">Mobile Phone</Label>
											<Input
												id="mobilePhone"
												value={personalData.mobilePhone}
												onChange={(e) =>
													setPersonalData({
														...personalData,
														mobilePhone: e.target.value,
													})
												}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="jobTitle">Job Title</Label>
										<Input
											id="jobTitle"
											value={personalData.jobTitle}
											onChange={(e) =>
												setPersonalData({
													...personalData,
													jobTitle: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<Separator />

								{/* Preferences */}
								<div className="space-y-4">
									<h3 className="text-lg font-medium">Preferences</h3>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="timeZone">Time Zone</Label>
											<Select
												value={personalData.timeZone}
												onValueChange={(value) =>
													setPersonalData({ ...personalData, timeZone: value })
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{timeZones.map((tz) => (
														<SelectItem key={tz} value={tz}>
															{tz}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="dateFormat">Date Format</Label>
											<Select
												value={personalData.dateFormat}
												onValueChange={(value) =>
													setPersonalData({ ...personalData, dateFormat: value })
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{dateFormats.map((format) => (
														<SelectItem key={format} value={format}>
															{format}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>

								<Separator />

								{/* Password Section */}
								<div className="space-y-4">
									<h3 className="text-lg font-medium">Security</h3>
									<div className="space-y-2">
										<Label>Password</Label>
										<Button variant="outline" type="button">
											Change Password
										</Button>
										<p className="text-sm text-muted-foreground">
											Last changed 3 months ago
										</p>
									</div>
								</div>

								<div className="flex justify-end">
									<Button type="submit">Save Personal Settings</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
