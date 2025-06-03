"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Calculator,
	Zap,
	Droplets,
	Building2,
	Thermometer,
	HelpCircle,
	ChevronDown,
	ChevronUp,
} from "lucide-react";

export default function ValueCalculator() {
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [scenario, setScenario] = useState("greenfield");
	const [dataCenterType, setDataCenterType] = useState("general");
	const [location, setLocation] = useState("uk");

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Value Calculator
					</h1>
					<p className="text-muted-foreground">
						Compare the financial and environmental benefits of Air Cooling vs
						Liquid Cooling
					</p>
				</div>
			</div>

			{/* Main Calculator */}
			<Card >
				<CardHeader>
					<CardTitle>Data Center Cooling Calculator</CardTitle>
					<CardDescription>
						Configure your data center parameters to compare cooling solutions
					</CardDescription>
				</CardHeader>

				<CardContent className="pt-6">
					<TooltipProvider>
						<div className="space-y-8 ">
							{/* Basic Configuration */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
								{/* Left Column - Radio Options */}
								<div className="space-y-6  ">
									<div className="">
										<Label className="text-base font-medium">
											Deployment Options
										</Label>
										<p className="text-sm text-muted-foreground mb-6">
											Select your deployment scenario and data center type
										</p>
									</div>

									<Separator className="my-2" />

									{/* Deployment Scenario */}
									<div className="space-y-2.5 ">
										<Label className="text-sm font-medium">
											Deployment Scenario
										</Label>
										<RadioGroup
											value={scenario}
											onValueChange={setScenario}
											className="flex flex-wrap gap-4"
										>
											<div className="flex items-center gap-2">
												<RadioGroupItem
													value="greenfield"
													id="greenfield"
													className="h-5 w-5 border-2 border-muted-foreground/20 before:h-3 before:w-3 data-[state=checked]:border-blue-600 data-[state=checked]:before:bg-blue-600"
												/>
												<div className="flex items-center gap-1.5">
													<Label
														htmlFor="greenfield"
														className="font-medium cursor-pointer"
													>
														Greenfield
													</Label>
													<Tooltip>
														<TooltipTrigger asChild>
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent
															side="right"
															className="max-w-[200px]"
														>
															<p>New undeveloped sites</p>
														</TooltipContent>
													</Tooltip>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<RadioGroupItem
													value="retrofit"
													id="retrofit"
													className="h-5 w-5 border-2 border-muted-foreground/20 "
												/>
												<div className="flex items-center gap-1.5">
													<Label
														htmlFor="retrofit"
														className="font-medium cursor-pointer"
													>
														Retrofit
													</Label>
													<Tooltip>
														<TooltipTrigger asChild>
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent
															side="right"
															className="max-w-[200px]"
														>
															<p>Existing data center halls</p>
														</TooltipContent>
													</Tooltip>
												</div>
											</div>
										</RadioGroup>

										{/* Retrofit Specific Options */}
										{scenario === "retrofit" && (
											<div className="space-y-3 pl-6 border-l-2 mt-4">
												<h3 className="text-sm font-medium text-muted-foreground">
													Retrofit Options
												</h3>
												<RadioGroup
													defaultValue="expansion"
													className="space-y-2"
												>
													<div className="flex items-center gap-2">
														<RadioGroupItem
															value="expansion"
															id="expansion"
															className="h-5 w-5 border-2 border-muted-foreground/20 before:h-3 before:w-3 data-[state=checked]:border-blue-600 data-[state=checked]:before:bg-blue-600"
														/>
														<Label
															htmlFor="expansion"
															className="text-sm cursor-pointer"
														>
															Add new racks to existing space
														</Label>
													</div>
													<div className="flex items-center gap-2">
														<RadioGroupItem
															value="replacement"
															id="replacement"
															className="h-5 w-5 border-2 border-muted-foreground/20 before:h-3 before:w-3 data-[state=checked]:border-blue-600 data-[state=checked]:before:bg-blue-600"
														/>
														<Label
															htmlFor="replacement"
															className="text-sm cursor-pointer"
														>
															Replace existing air-cooled racks
														</Label>
													</div>
												</RadioGroup>
											</div>
										)}
									</div>

									{/* Data Center Type */}
									<div className="space-y-2.5">
										<Label className="text-sm font-medium">
											Data Centre Type
										</Label>
										<RadioGroup
											value={dataCenterType}
											onValueChange={setDataCenterType}
											className="flex flex-wrap gap-4"
										>
											<div className="flex items-center gap-2">
												<RadioGroupItem
													value="general"
													id="general"
													className="h-5 w-5 border-2 border-muted-foreground/20 before:h-3 before:w-3 data-[state=checked]:border-blue-600 data-[state=checked]:before:bg-blue-600"
												/>
												<div className="flex items-center gap-1.5">
													<Label
														htmlFor="general"
														className="font-medium cursor-pointer"
													>
														General Purpose
													</Label>
													<Tooltip>
														<TooltipTrigger asChild>
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent
															side="right"
															className="max-w-[200px]"
														>
															<p>Standard applications</p>
														</TooltipContent>
													</Tooltip>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<RadioGroupItem
													value="hpc"
													id="hpc"
													className="h-5 w-5 border-2 border-muted-foreground/20 before:h-3 before:w-3 data-[state=checked]:border-blue-600 data-[state=checked]:before:bg-blue-600"
												/>
												<div className="flex items-center gap-1.5">
													<Label
														htmlFor="hpc"
														className="font-medium cursor-pointer"
													>
														HPC/AI
													</Label>
													<Tooltip>
														<TooltipTrigger asChild>
															<HelpCircle className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent
															side="right"
															className="max-w-[200px]"
														>
															<p>High-performance computing</p>
														</TooltipContent>
													</Tooltip>
												</div>
											</div>
										</RadioGroup>
									</div>
								</div>

								{/* Vertical Separator for large screens */}
								<div className="hidden lg:block absolute right-1/2 top-0 h-full w-px bg-border" />

								{/* Right Column - Basic Configurations */}
								<div className="space-y-6 ">
									<div>
										<Label className="text-base font-medium">
											Basic Configuration
										</Label>
										<p className="text-sm text-muted-foreground mb-6">
											Configure the essential parameters for your data center
										</p>
										<Separator className="my-2" />
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Location */}
											<div className="space-y-2">
												<Label htmlFor="location">Location</Label>
												<Select value={location} onValueChange={setLocation}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="uk">United Kingdom</SelectItem>
														<SelectItem value="usa">USA</SelectItem>
														<SelectItem value="uae">
															United Arab Emirates
														</SelectItem>
														<SelectItem value="singapore">Singapore</SelectItem>
													</SelectContent>
												</Select>
											</div>

											{/* Utilization */}
											<div className="space-y-2">
												<Label htmlFor="utilization">% of Utilisation</Label>
												<Input
													id="utilization"
													type="number"
													placeholder="80"
												/>
											</div>

											{/* Max Design IT Load */}
											<div className="space-y-2">
												<Label htmlFor="maxLoad">
													Maximum Design IT Load (MW)
												</Label>
												<Input
													id="maxLoad"
													type="number"
													placeholder="2.0"
													step="0.1"
												/>
											</div>

											{/* Years of Operation */}
											<div className="space-y-2">
												<Label htmlFor="years">
													Planned Years of Operation
												</Label>
												<Input id="years" type="number" placeholder="10" />
											</div>

											{/* First Year */}
											<div className="space-y-2">
												<Label htmlFor="firstYear">
													First Year of Operation
												</Label>
												<Input
													id="firstYear"
													type="number"
													placeholder="2024"
												/>
											</div>

											{/* Data Hall Capacity */}
											<div className="space-y-2">
												<Label htmlFor="hallCapacity">
													Data Hall Design Capacity (MW)
												</Label>
												<Input
													id="hallCapacity"
													type="number"
													placeholder="2.0"
													step="0.1"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Advanced Configuration */}
							{showAdvanced && (
								<div className="space-y-6 pt-6 border-t">
									<div>
										<Label className="text-base font-medium">
											Advanced Configuration
										</Label>
										<p className="text-sm text-muted-foreground mb-6">
											Configure detailed parameters for precise calculations and
											advanced scenarios
										</p>
									</div>
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										{/* Environmental Conditions */}
										<Card>
											<CardHeader>
												<CardTitle className="flex items-center gap-2">
													<Thermometer className="h-5 w-5" />
													Environmental Conditions
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="avgTemp">
														Average Temperature of Data Hall (°C)
													</Label>
													<Input id="avgTemp" type="number" placeholder="22" />
													<p className="text-xs text-gray-500">
														ASHRAE recommends 18-27°C
													</p>
												</div>

												<div className="space-y-2">
													<Label htmlFor="electricityPrice">
														Electricity Price in First Year ($/kWh)
													</Label>
													<Input
														id="electricityPrice"
														type="number"
														placeholder="0.12"
														step="0.01"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="waterPrice">Water Price ($/L)</Label>
													<Input
														id="waterPrice"
														type="number"
														placeholder="0.002"
														step="0.001"
													/>
												</div>

												{scenario === "retrofit" && (
													<>
														<div className="flex items-center space-x-2">
															<Switch id="waterloop" />
															<Label htmlFor="waterloop">
																Existing Water Loop in Data Centre
															</Label>
														</div>

														<div className="space-y-2">
															<Label htmlFor="electricalUpgrade">
																Required Electrical Plant Power Increase (%)
															</Label>
															<Input
																id="electricalUpgrade"
																type="number"
																placeholder="0"
															/>
														</div>
													</>
												)}
											</CardContent>
										</Card>

										{/* Cooling Technology */}
										<Card>
											<CardHeader>
												<CardTitle className="flex items-center gap-2">
													<Zap className="h-5 w-5" />
													Cooling Technology
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="airCoolingTech">
														Air Cooling Technology
													</Label>
													<Select>
														<SelectTrigger>
															<SelectValue placeholder="Select technology" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="crac">CRAC Units</SelectItem>
															<SelectItem value="crah">CRAH Units</SelectItem>
															<SelectItem value="inrow">
																In-Row Cooling
															</SelectItem>
															<SelectItem value="containment">
																Hot/Cold Aisle Containment
															</SelectItem>
														</SelectContent>
													</Select>
												</div>

												<div className="space-y-2">
													<Label htmlFor="airCapex">
														Air Cooling Capex per Rack ($/rack)
													</Label>
													<Input
														id="airCapex"
														type="number"
														placeholder="15000"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="iceotopeSolution">
														Iceotope Solution
													</Label>
													<Select>
														<SelectTrigger>
															<SelectValue placeholder="Select solution" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="kul2">KU:L 2</SelectItem>
															<SelectItem value="multinode">
																Purpose Optimised Multinode
															</SelectItem>
															<SelectItem value="kul2-jbod">
																KU:L 2 JBOD
															</SelectItem>
															<SelectItem value="optimised-jbod">
																Purpose Optimised JBOD
															</SelectItem>
														</SelectContent>
													</Select>
												</div>

												{scenario === "retrofit" && (
													<div className="space-y-2">
														<Label htmlFor="upgradePercentage">
															Air Cooling Upgrade Cost (% of New Capex)
														</Label>
														<Input
															id="upgradePercentage"
															type="number"
															placeholder="70"
														/>
													</div>
												)}
											</CardContent>
										</Card>

										{/* Server Configuration */}
										<Card>
											<CardHeader>
												<CardTitle>Server Configuration</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="maxServerPower">
														Maximum Server Rated Power (W)
													</Label>
													<Input
														id="maxServerPower"
														type="number"
														placeholder="400"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="refreshCycles">
														Number of Server Refresh Cycles
													</Label>
													<Input
														id="refreshCycles"
														type="number"
														placeholder="2"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="itCost">
														Typical IT Cost/Server ($)
													</Label>
													<Input id="itCost" type="number" placeholder="8000" />
												</div>

												<div className="space-y-2">
													<Label htmlFor="maintenance">
														Annual IT Maintenance (% of IT Capex)
													</Label>
													<Input
														id="maintenance"
														type="number"
														placeholder="8"
													/>
												</div>
											</CardContent>
										</Card>

										{/* JBOD Configuration */}
										<Card>
											<CardHeader>
												<CardTitle>JBOD Configuration</CardTitle>
												<CardDescription>
													Just a Bunch of Disks configuration
												</CardDescription>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="disksPerChassis">
														Number of Disks per Chassis
													</Label>
													<Input
														id="disksPerChassis"
														type="number"
														placeholder="144"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="chassisPerRack">
														Number of Chassis per Rack
													</Label>
													<Input
														id="chassisPerRack"
														type="number"
														placeholder="16"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="powerPerDisk">
														Power per Disk (W)
													</Label>
													<Input
														id="powerPerDisk"
														type="number"
														placeholder="15"
													/>
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							)}
						</div>
					</TooltipProvider>
				</CardContent>
			</Card>

			{/* Results Comparison */}
			<Card>
				<CardHeader>
					<CardTitle>Value Comparison Results</CardTitle>
					<CardDescription>
						Demonstrated benefits of Iceotope Precision Liquid Cooling vs Air
						Cooling
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Financial Comparison */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Financial Comparison</h3>
							<div className="space-y-3">
								<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
									<span className="font-medium">Cooling Equipment Capex</span>
									<Badge
										variant="secondary"
										className="bg-green-100 text-green-800"
									>
										7% Saving
									</Badge>
								</div>
								<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
									<span className="font-medium">Annual Cooling Opex</span>
									<Badge
										variant="secondary"
										className="bg-green-100 text-green-800"
									>
										46% Saving
									</Badge>
								</div>
								<div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
									<span className="font-semibold">Total Cost of Ownership</span>
									<Badge className="bg-green-600">29% Saving</Badge>
								</div>
							</div>
						</div>

						{/* Environmental Comparison */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Droplets className="h-5 w-5" />
								Environmental Impact
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
									<span className="font-medium">Energy Consumption</span>
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-800"
									>
										50% Reduction
									</Badge>
								</div>
								<div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
									<span className="font-medium">CO2 Emissions</span>
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-800"
									>
										50% Reduction
									</Badge>
								</div>
								<div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
									<span className="font-medium">Water Usage</span>
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-800"
									>
										91% Reduction
									</Badge>
								</div>
								<div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
									<span className="font-medium">Floor Space Required</span>
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-800"
									>
										63% Reduction
									</Badge>
								</div>
							</div>
						</div>
					</div>

					<Separator className="my-6" />

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" className="bg-blue-600 hover:bg-blue-700">
							Calculate Results
						</Button>
						<Button variant="outline" size="lg">
							Download Report
						</Button>
						<Button variant="outline" size="lg">
							Reset Calculator
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
