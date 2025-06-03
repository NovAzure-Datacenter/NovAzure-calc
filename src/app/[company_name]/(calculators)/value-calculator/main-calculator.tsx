"use client";

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
	Thermometer,
	HelpCircle,
	RefreshCcw,
} from "lucide-react";
import type { CalculatorInputs } from "./types";

export function MainCalculator({
	showAdvanced,
	setShowAdvanced,
	scenario,
	setScenario,
	dataCenterType,
	setDataCenterType,
	location,
	setLocation,
	calculatorInputs,
	setCalculatorInputs,
	onCalculate,
	onReset,
	isCalculating,
}: {
	showAdvanced: boolean;
	setShowAdvanced: (value: boolean) => void;
	scenario: string;
	setScenario: (value: string) => void;
	dataCenterType: string;
	setDataCenterType: (value: string) => void;
	location: string;
	setLocation: (value: string) => void;
	calculatorInputs: CalculatorInputs;
	setCalculatorInputs: (inputs: CalculatorInputs) => void;
	onCalculate: () => void;
	onReset: () => void;
	isCalculating: boolean;
}) {
	const updateInput = (
		field: keyof CalculatorInputs,
		value: number | boolean
	) => {
		setCalculatorInputs({
			...calculatorInputs,
			[field]: value,
		});
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between mb-4">
					<div className="space-y-2">
						<CardTitle>Data Center Cooling Calculator</CardTitle>
						<CardDescription>
							Configure your data center parameters to compare cooling solutions
						</CardDescription>
					</div>

					<div className="flex items-center pt-2 pr-2 gap-2">
						<div className="text-right">
							<Label className="text-sm font-medium">
								Advanced Configuration
							</Label>
						</div>
						<Switch
							id="advanced-config"
							checked={showAdvanced}
							onCheckedChange={setShowAdvanced}
						/>
					</div>
				</div>
				<Separator />
			</CardHeader>

			<CardContent>
				<TooltipProvider>
					<div className="my-6">
						{/* Basic Configuration */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
							{/* Left Column - Radio Options */}
							<div className="space-y-6">
								<div>
									<Label className="text-base font-medium">
										Deployment Options
									</Label>
									<p className="text-sm text-muted-foreground mb-6">
										Select your deployment scenario and data center type
									</p>
									<Separator className="my-6" />
									<div className="space-y-6">
										{/* Deployment Scenario */}
										<div className="space-y-2.5">
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
								</div>

								<Separator className="my-6" />
								{/* Action Buttons */}

								<div className="flex flex-col sm:flex-row gap-2">
									<Button
										size="default"
										className="bg-blue-600 hover:bg-blue-700 flex-1"
										onClick={onCalculate}
										disabled={isCalculating}
									>
										{isCalculating ? (
											<>
												<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
												Calculating...
											</>
										) : (
											<>
												<Calculator className="mr-2 h-4 w-4" />
												Calculate Results
											</>
										)}
									</Button>
									<Button
										variant="outline"
										size="default"
										className="flex-1"
										onClick={onReset}
										disabled={isCalculating}
									>
										<RefreshCcw className="mr-2 h-4 w-4" />
										Reset Calculator
									</Button>
								</div>
							</div>

							{/* Vertical Separator for large screens */}
							<div className="hidden lg:block absolute right-1/2 top-0 h-full w-px bg-border" />

							{/* Right Column - Basic Configurations */}
							<div className="space-y-6">
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
												value={calculatorInputs.utilization}
												onChange={(e) =>
													updateInput("utilization", Number(e.target.value))
												}
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
												value={calculatorInputs.maxDesignITLoad}
												onChange={(e) =>
													updateInput("maxDesignITLoad", Number(e.target.value))
												}
												step="0.1"
											/>
										</div>

										{/* Years of Operation */}
										<div className="space-y-2">
											<Label htmlFor="years">Planned Years of Operation</Label>
											<Input
												id="years"
												type="number"
												value={calculatorInputs.yearsOfOperation}
												onChange={(e) =>
													updateInput(
														"yearsOfOperation",
														Number(e.target.value)
													)
												}
											/>
										</div>

										{/* First Year */}
										<div className="space-y-2">
											<Label htmlFor="firstYear">First Year of Operation</Label>
											<Input
												id="firstYear"
												type="number"
												value={calculatorInputs.firstYear}
												onChange={(e) =>
													updateInput("firstYear", Number(e.target.value))
												}
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
												value={calculatorInputs.dataHallCapacity}
												onChange={(e) =>
													updateInput(
														"dataHallCapacity",
														Number(e.target.value)
													)
												}
												step="0.1"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Advanced Configuration */}
						{showAdvanced && (
							<div className="space-y-6 pt-6 ">
								<div>
									<Label className="text-base font-medium">
										Advanced Configuration
									</Label>
									<p className="text-sm text-muted-foreground mb-6">
										Configure detailed parameters for precise calculations and
										advanced scenarios
									</p>
								</div>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
												<Input
													id="avgTemp"
													type="number"
													value={calculatorInputs.avgTemperature}
													onChange={(e) =>
														updateInput(
															"avgTemperature",
															Number(e.target.value)
														)
													}
												/>
												<p className="text-xs text-gray-500">
													ASHRAE recommends 18-27°C
												</p>
											</div>

											<div className="space-y-2">
												<Label htmlFor="electricityPrice">
													Electricity Price in First Year (€/kWh)
												</Label>
												<Input
													id="electricityPrice"
													type="number"
													value={calculatorInputs.electricityPrice}
													onChange={(e) =>
														updateInput(
															"electricityPrice",
															Number(e.target.value)
														)
													}
													step="0.01"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="waterPrice">Water Price (€/L)</Label>
												<Input
													id="waterPrice"
													type="number"
													value={calculatorInputs.waterPrice}
													onChange={(e) =>
														updateInput("waterPrice", Number(e.target.value))
													}
													step="0.001"
												/>
											</div>

											{scenario === "retrofit" && (
												<>
													<div className="flex items-center space-x-2">
														<Switch
															id="waterloop"
															checked={calculatorInputs.existingWaterLoop}
															onCheckedChange={(checked) =>
																updateInput("existingWaterLoop", checked)
															}
														/>
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
															value={calculatorInputs.electricalUpgrade}
															onChange={(e) =>
																updateInput(
																	"electricalUpgrade",
																	Number(e.target.value)
																)
															}
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
													Air Cooling Capex per Rack (€/rack)
												</Label>
												<Input
													id="airCapex"
													type="number"
													value={calculatorInputs.airCapex}
													onChange={(e) =>
														updateInput("airCapex", Number(e.target.value))
													}
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
														value={calculatorInputs.upgradePercentage}
														onChange={(e) =>
															updateInput(
																"upgradePercentage",
																Number(e.target.value)
															)
														}
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
													value={calculatorInputs.maxServerPower}
													onChange={(e) =>
														updateInput(
															"maxServerPower",
															Number(e.target.value)
														)
													}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="refreshCycles">
													Number of Server Refresh Cycles
												</Label>
												<Input
													id="refreshCycles"
													type="number"
													value={calculatorInputs.refreshCycles}
													onChange={(e) =>
														updateInput("refreshCycles", Number(e.target.value))
													}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="itCost">
													Typical IT Cost/Server (€)
												</Label>
												<Input
													id="itCost"
													type="number"
													value={calculatorInputs.itCost}
													onChange={(e) =>
														updateInput("itCost", Number(e.target.value))
													}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="maintenance">
													Annual IT Maintenance (% of IT Capex)
												</Label>
												<Input
													id="maintenance"
													type="number"
													value={calculatorInputs.maintenance}
													onChange={(e) =>
														updateInput("maintenance", Number(e.target.value))
													}
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
													value={calculatorInputs.disksPerChassis}
													onChange={(e) =>
														updateInput(
															"disksPerChassis",
															Number(e.target.value)
														)
													}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="chassisPerRack">
													Number of Chassis per Rack
												</Label>
												<Input
													id="chassisPerRack"
													type="number"
													value={calculatorInputs.chassisPerRack}
													onChange={(e) =>
														updateInput(
															"chassisPerRack",
															Number(e.target.value)
														)
													}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="powerPerDisk">Power per Disk (W)</Label>
												<Input
													id="powerPerDisk"
													type="number"
													value={calculatorInputs.powerPerDisk}
													onChange={(e) =>
														updateInput("powerPerDisk", Number(e.target.value))
													}
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
	);
}
