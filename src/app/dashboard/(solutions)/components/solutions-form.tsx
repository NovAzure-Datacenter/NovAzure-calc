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
	CardFooter,
} from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Database, Server, Layers, Box } from "lucide-react";

const solutions = [
	{
		id: "kul2-3kw",
		name: "KU:L 2 (3 kW)",
		description: "Small scale edge solution",
		icon: Server,
		specs: {
			powerKW: 3,
			powerDensityPerChassis: 3,
			numberOfChassisPerRack: 1,
			powerDensityPerRack: 3
		}
	},
	{
		id: "kul2-8.6kw",
		name: "KU:L 2 (8.6 kW)",
		description: "Medium edge solution",
		icon: Cpu,
		specs: {
			powerKW: 8.6,
			powerDensityPerChassis: 8.6,
			numberOfChassisPerRack: 1,
			powerDensityPerRack: 8.6
		}
	},
	{
		id: "kul2-30.2kw",
		name: "KU:L 2 (30.2 kW)",
		description: "Large edge solution",
		icon: Layers,
		specs: {
			powerKW: 30.2,
			powerDensityPerChassis: 30.2,
			numberOfChassisPerRack: 1,
			powerDensityPerRack: 30.2
		}
	},
	{
		id: "kul2-60kw",
		name: "KU:L 2 (60 kW)",
		description: "Extra large edge solution",
		icon: Server,
		specs: {
			powerKW: 60,
			powerDensityPerChassis: 60,
			numberOfChassisPerRack: 1,
			powerDensityPerRack: 60
		}
	},
	{
		id: "kulbox-1u",
		name: "KU:L Box 1U",
		description: "1U rack unit solution",
		icon: Box,
		specs: {
			powerKW: 1.5,
			powerDensityPerChassis: 1.5,
			numberOfChassisPerRack: 1,
			powerDensityPerRack: 1.5
		}
	},
	{
		id: "kulbox-3u",
		name: "KU:L Box 3U",
		description: "3U rack unit solution",
		icon: Box,
		specs: {
			powerKW: 4.5,
			powerDensityPerChassis: 4.5,
			numberOfChassisPerRack: 1,
			powerDensityPerRack: 4.5
		}
	},
	{
		id: "jbod-box",
		name: "JBOD Box",
		description: "Just a Bunch of Disks box solution",
		icon: Database,
		specs: {
			powerKW: 2,
			powerDensityPerChassis: 2,
			numberOfChassisPerRack: 1,
			powerDensityPerRack: 2
		}
	},
	{
		id: "jbod-standard",
		name: "JBOD Standard",
		description: "Standard JBOD solution",
		icon: Database,
		specs: {
			powerKW: 5,
			powerDensityPerChassis: 5,
			numberOfChassisPerRack: 1,
			powerDensityPerRack: 5
		}
	}
];

export default function SolutionsForm() {
	const [_canEdit, _setCanEdit] = useState<boolean>(true)
	const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("specifications");
	const [formData, setFormData] = useState({
		// Main Solutions
		mainSolution: "",

		// Power Specifications
		powerKW: "",
		powerDensityPerChassis: "",
		numberOfChassisPerRack: "",
		powerDensityPerRack: "",

		// Physical Configuration
		numberOfRacksPerRow: "",
		cduPowerRating: "",
		hybridCoolerCapacity: "",
		dxSystemCapacity: "",
		numberOfAHUUnits: "",

		// Core Cooling Infrastructure CAPEX
		pumpsCDUCapex: "",
		manifoldCapexPerRack: "",
		rackCapex: "",
		chassisCommonServerCapex: "",

		// Supporting Infrastructure CAPEX
		hybridCoolerCapex: "",
		pressurisationAHUCapex: "",
		dxSystemCapex: "",
		packagedProcessWaterPumpCapex: "",
		rackMountedPDUStrips: "",
		rackMountedPDUCapex: "",
		kerbsideDeliveryPositioningCost: "",

		// Installation & Integration
		iceotopeGCWorksCost: "",
		gcWorksSlidingScale: "",
		coolantCOGSPerKW: "",

		// Efficiency Metrics
		pPUE: "",
		wUE: "",
		actualPowerRequiredDueToLackOfFans: "",
		iceotopeITCostReduction: "",

		// Heat Recovery
		heatRecoveryToLiquid: "",
		heatRecoveryToAir: "",

		// Maintenance & Operations OPEX
		coolingMaintenanceOpexRatio: "",
		countryElectricityPrice: "",
		countryWaterPrice: "",

		// Calculated Operational Values
		actualEnergyRequiredComputing: "",
		energyRequiredComputingCooling: "",
		waterRequiredPerYear: "",
	});

	const handleSolutionSelect = (solutionId: string) => {
		setSelectedSolution(solutionId);
		setActiveTab("specifications");
		const solution = solutions.find(s => s.id === solutionId);
		if (solution) {
			setFormData(prev => ({
				...prev,
				mainSolution: solution.id,
				powerKW: solution.specs.powerKW.toString(),
				powerDensityPerChassis: solution.specs.powerDensityPerChassis.toString(),
				numberOfChassisPerRack: solution.specs.numberOfChassisPerRack.toString(),
				powerDensityPerRack: solution.specs.powerDensityPerRack.toString()
			}));
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleReset = () => {
		setSelectedSolution(null);
		setFormData({
			mainSolution: "",
			powerKW: "",
			powerDensityPerChassis: "",
			numberOfChassisPerRack: "",
			powerDensityPerRack: "",
			numberOfRacksPerRow: "",
			cduPowerRating: "",
			hybridCoolerCapacity: "",
			dxSystemCapacity: "",
			numberOfAHUUnits: "",
			pumpsCDUCapex: "",
			manifoldCapexPerRack: "",
			rackCapex: "",
			chassisCommonServerCapex: "",
			hybridCoolerCapex: "",
			pressurisationAHUCapex: "",
			dxSystemCapex: "",
			packagedProcessWaterPumpCapex: "",
			rackMountedPDUStrips: "",
			rackMountedPDUCapex: "",
			kerbsideDeliveryPositioningCost: "",
			iceotopeGCWorksCost: "",
			gcWorksSlidingScale: "",
			coolantCOGSPerKW: "",
			pPUE: "",
			wUE: "",
			actualPowerRequiredDueToLackOfFans: "",
			iceotopeITCostReduction: "",
			heatRecoveryToLiquid: "",
			heatRecoveryToAir: "",
			coolingMaintenanceOpexRatio: "",
			countryElectricityPrice: "",
			countryWaterPrice: "",
			actualEnergyRequiredComputing: "",
			energyRequiredComputingCooling: "",
			waterRequiredPerYear: ""
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
	};

	return (
		<div className="space-y-6 p-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Cooling Solutions Configuration
					</h1>
					<p className="text-muted-foreground">
						Configure your edge cooling solution specifications and parameters
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Solutions Carousel */}
				<Carousel
					opts={{
						align: "start",
						loop: true,
					}}
					className="w-full relative px-12"
				>
					<CarouselContent className="-ml-2 md:-ml-4 ">
						{solutions.map((solution) => (
							<CarouselItem key={solution.id} className="pl-2 md:pl-4 md:basis-1/4 py-2">
								<Card
									className={`cursor-pointer transition-all duration-200 select-none py-2
										${selectedSolution === solution.id 
											? 'border-primary bg-primary/5 shadow-lg scale-105' 
											: 'hover:shadow-md hover:scale-102'
										}`}
									onClick={() => handleSolutionSelect(solution.id)}
								>
									<CardContent className="flex flex-col items-center p-2 select-none">
										<solution.icon className={`h-8 w-8 mb-2 transition-colors duration-200 select-none
											${selectedSolution === solution.id ? 'text-custom-dark-blue' : 'text-muted-foreground'}`} 
										/>
										<h3 className={`font-semibold text-center transition-colors duration-200
											${selectedSolution === solution.id ? 'text-primary' : ''}`}>
											{solution.name}
										</h3>
										<p className="text-sm text-muted-foreground text-center select-none">
											{solution.description}
										</p>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="left-0 bg-custom-dark-blue  text-white hover:bg-bg-custom-dark-blue/90 hover:text-white" />
					<CarouselNext className="right-0 bg-custom-dark-blue  text-white hover:bg-bg-custom-dark-blue/90 hover:text-white" />
				</Carousel>

				{selectedSolution && (
					<Card className="mt-6">
						<CardHeader>
							<CardTitle>Solution Configuration</CardTitle>
							<CardDescription>
								Configure the selected solution parameters and specifications
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<Tabs defaultValue="specifications" value={activeTab} onValueChange={setActiveTab} className="w-full">
								<TabsList className="grid w-full grid-cols-4">
									<TabsTrigger value="specifications">Specifications</TabsTrigger>
									<TabsTrigger value="costs">Costs</TabsTrigger>
									<TabsTrigger value="performance">Performance</TabsTrigger>
									<TabsTrigger value="operations">Operations</TabsTrigger>
								</TabsList>

								<TabsContent value="specifications" className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Power Specifications</CardTitle>
											<CardDescription>
												Configure power consumption and density parameters
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="powerKW">Power (kW)</Label>
													<Input
														id="powerKW"
														type="number"
														step="0.1"
														placeholder="Actual power consumption"
														value={formData.powerKW}
														onChange={(e) =>
															handleInputChange("powerKW", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="powerDensityPerChassis">
														Power Density per Chassis (kW)
													</Label>
													<Input
														id="powerDensityPerChassis"
														type="number"
														step="0.1"
														placeholder="Power density for Iceotope chassis"
														value={formData.powerDensityPerChassis}
														onChange={(e) =>
															handleInputChange(
																"powerDensityPerChassis",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="numberOfChassisPerRack">
														Number of Chassis per Rack
													</Label>
													<Input
														id="numberOfChassisPerRack"
														type="number"
														placeholder="Chassis configuration per rack"
														value={formData.numberOfChassisPerRack}
														onChange={(e) =>
															handleInputChange(
																"numberOfChassisPerRack",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="powerDensityPerRack">
														Power Density per Rack (kW/rack)
													</Label>
													<Input
														id="powerDensityPerRack"
														type="number"
														step="0.1"
														placeholder="Total power density per rack"
														value={formData.powerDensityPerRack}
														onChange={(e) =>
															handleInputChange("powerDensityPerRack", e.target.value)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Physical Configuration</CardTitle>
											<CardDescription>
												Configure physical layout and cooling system parameters
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="numberOfRacksPerRow">
														Number of Racks per Row
													</Label>
													<Input
														id="numberOfRacksPerRow"
														type="number"
														placeholder="Rack layout configuration"
														value={formData.numberOfRacksPerRow}
														onChange={(e) =>
															handleInputChange("numberOfRacksPerRow", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="cduPowerRating">
														CDU Power Rating (kW)
													</Label>
													<Input
														id="cduPowerRating"
														type="number"
														step="0.1"
														placeholder="Coolant Distribution Unit power capacity"
														value={formData.cduPowerRating}
														onChange={(e) =>
															handleInputChange("cduPowerRating", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="hybridCoolerCapacity">
														Hybrid Cooler Capacity (kW)
													</Label>
													<Input
														id="hybridCoolerCapacity"
														type="number"
														step="0.1"
														placeholder="Cooling capacity for hybrid systems"
														value={formData.hybridCoolerCapacity}
														onChange={(e) =>
															handleInputChange(
																"hybridCoolerCapacity",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="dxSystemCapacity">
														DX System Capacity (kW)
													</Label>
													<Input
														id="dxSystemCapacity"
														type="number"
														step="0.1"
														placeholder="Direct expansion system capacity"
														value={formData.dxSystemCapacity}
														onChange={(e) =>
															handleInputChange("dxSystemCapacity", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="numberOfAHUUnits">
														Number of AHU Units
													</Label>
													<Input
														id="numberOfAHUUnits"
														type="number"
														placeholder="Number of Air Handling Units required"
														value={formData.numberOfAHUUnits}
														onChange={(e) =>
															handleInputChange("numberOfAHUUnits", e.target.value)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="costs" className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Core Cooling Infrastructure (CAPEX)</CardTitle>
											<CardDescription>
												Configure core cooling system costs
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="pumpsCDUCapex">Pumps/CDU CAPEX ($)</Label>
													<Input
														id="pumpsCDUCapex"
														type="number"
														placeholder="Cost of pumps for edge solutions or CDU for data centers"
														value={formData.pumpsCDUCapex}
														onChange={(e) =>
															handleInputChange("pumpsCDUCapex", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="manifoldCapexPerRack">
														Manifold CAPEX per Rack ($)
													</Label>
													<Input
														id="manifoldCapexPerRack"
														type="number"
														placeholder="Manifold system cost per rack"
														value={formData.manifoldCapexPerRack}
														onChange={(e) =>
															handleInputChange(
																"manifoldCapexPerRack",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="rackCapex">Rack CAPEX ($)</Label>
													<Input
														id="rackCapex"
														type="number"
														placeholder="Basic rack cost"
														value={formData.rackCapex}
														onChange={(e) =>
															handleInputChange("rackCapex", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="chassisCommonServerCapex">
														Chassis Common + Server Specific CAPEX ($/chassis)
													</Label>
													<Input
														id="chassisCommonServerCapex"
														type="number"
														placeholder="Additional chassis costs"
														value={formData.chassisCommonServerCapex}
														onChange={(e) =>
															handleInputChange(
																"chassisCommonServerCapex",
																e.target.value
															)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Supporting Infrastructure (CAPEX)</CardTitle>
											<CardDescription>
												Configure supporting system costs
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="hybridCoolerCapex">
														Hybrid Cooler CAPEX (800 kW unit) ($)
													</Label>
													<Input
														id="hybridCoolerCapex"
														type="number"
														placeholder="Hybrid cooling system cost"
														value={formData.hybridCoolerCapex}
														onChange={(e) =>
															handleInputChange("hybridCoolerCapex", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="pressurisationAHUCapex">
														Pressurisation AHU CAPEX ($)
													</Label>
													<Input
														id="pressurisationAHUCapex"
														type="number"
														placeholder="Air handling unit pressurization cost"
														value={formData.pressurisationAHUCapex}
														onChange={(e) =>
															handleInputChange(
																"pressurisationAHUCapex",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="dxSystemCapex">DX System CAPEX ($)</Label>
													<Input
														id="dxSystemCapex"
														type="number"
														placeholder="Direct expansion system cost"
														value={formData.dxSystemCapex}
														onChange={(e) =>
															handleInputChange("dxSystemCapex", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="packagedProcessWaterPumpCapex">
														Packaged Process Water Pump Room CAPEX ($)
													</Label>
													<Input
														id="packagedProcessWaterPumpCapex"
														type="number"
														placeholder="Water processing system cost"
														value={formData.packagedProcessWaterPumpCapex}
														onChange={(e) =>
															handleInputChange(
																"packagedProcessWaterPumpCapex",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="rackMountedPDUStrips">
														Rack Mounted PDU Power Strips per Rack
													</Label>
													<Input
														id="rackMountedPDUStrips"
														type="number"
														placeholder="Power distribution units per rack"
														value={formData.rackMountedPDUStrips}
														onChange={(e) =>
															handleInputChange(
																"rackMountedPDUStrips",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="rackMountedPDUCapex">
														Rack Mounted PDU Power Strip CAPEX ($)
													</Label>
													<Input
														id="rackMountedPDUCapex"
														type="number"
														placeholder="PDU cost"
														value={formData.rackMountedPDUCapex}
														onChange={(e) =>
															handleInputChange("rackMountedPDUCapex", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="kerbsideDeliveryPositioningCost">
														Kerbside Delivery and Positioning Cost per Rack ($/rack)
													</Label>
													<Input
														id="kerbsideDeliveryPositioningCost"
														type="number"
														placeholder="Installation and positioning cost"
														value={formData.kerbsideDeliveryPositioningCost}
														onChange={(e) =>
															handleInputChange(
																"kerbsideDeliveryPositioningCost",
																e.target.value
															)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Installation & Integration</CardTitle>
											<CardDescription>
												Configure installation and integration costs
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="iceotopeGCWorksCost">
														Iceotope GC Works Cost per kW ($/kW)
													</Label>
													<Input
														id="iceotopeGCWorksCost"
														type="number"
														step="0.01"
														placeholder="General contractor work cost per kW"
														value={formData.iceotopeGCWorksCost}
														onChange={(e) =>
															handleInputChange("iceotopeGCWorksCost", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="gcWorksSlidingScale">
														GC Works Sliding Scale ($/kW)
													</Label>
													<Input
														id="gcWorksSlidingScale"
														type="number"
														step="0.01"
														placeholder="Sliding scale adjustment for GC work"
														value={formData.gcWorksSlidingScale}
														onChange={(e) =>
															handleInputChange("gcWorksSlidingScale", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="coolantCOGSPerKW">
														Coolant COGS per kW Nameplate ($/kW)
													</Label>
													<Input
														id="coolantCOGSPerKW"
														type="number"
														step="0.01"
														placeholder="Coolant cost of goods sold per kW"
														value={formData.coolantCOGSPerKW}
														onChange={(e) =>
															handleInputChange("coolantCOGSPerKW", e.target.value)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="performance" className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Efficiency Metrics</CardTitle>
											<CardDescription>
												Configure power and efficiency parameters
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="pPUE">
														pPUE (Power Usage Effectiveness)
													</Label>
													<Input
														id="pPUE"
														type="number"
														step="0.01"
														placeholder="Overall power efficiency ratio"
														value={formData.pPUE}
														onChange={(e) =>
															handleInputChange("pPUE", e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="wUE">WUE (Water Usage Effectiveness)</Label>
													<Input
														id="wUE"
														type="number"
														step="0.01"
														placeholder="Water efficiency ratio"
														value={formData.wUE}
														onChange={(e) => handleInputChange("wUE", e.target.value)}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="actualPowerRequiredDueToLackOfFans">
														% of Actual Power Required Due to Lack of Fans
													</Label>
													<Input
														id="actualPowerRequiredDueToLackOfFans"
														type="number"
														step="0.1"
														placeholder="Power reduction from fanless design"
														value={formData.actualPowerRequiredDueToLackOfFans}
														onChange={(e) =>
															handleInputChange(
																"actualPowerRequiredDueToLackOfFans",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="iceotopeITCostReduction">
														Iceotope IT Cost Reduction Due to Less Network Cost (%)
													</Label>
													<Input
														id="iceotopeITCostReduction"
														type="number"
														step="0.1"
														placeholder="IT cost reduction percentage (97%)"
														value={formData.iceotopeITCostReduction}
														onChange={(e) =>
															handleInputChange(
																"iceotopeITCostReduction",
																e.target.value
															)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Heat Recovery</CardTitle>
											<CardDescription>
												Configure heat recovery parameters
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="heatRecoveryToLiquid">
														Heat Recovery to Liquid (%)
													</Label>
													<Input
														id="heatRecoveryToLiquid"
														type="number"
														step="0.1"
														placeholder="Percentage of heat recovered to liquid"
														value={formData.heatRecoveryToLiquid}
														onChange={(e) =>
															handleInputChange(
																"heatRecoveryToLiquid",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="heatRecoveryToAir">
														Heat Recovery to Air (%)
													</Label>
													<Input
														id="heatRecoveryToAir"
														type="number"
														step="0.1"
														placeholder="Percentage of heat recovered to air"
														value={formData.heatRecoveryToAir}
														onChange={(e) =>
															handleInputChange("heatRecoveryToAir", e.target.value)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="operations" className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Maintenance & Operations (OPEX)</CardTitle>
											<CardDescription>
												Configure operational costs and parameters
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="coolingMaintenanceOpexRatio">
														Cooling Maintenance OPEX Cost per Year Ratio to CAPEX (%)
													</Label>
													<Input
														id="coolingMaintenanceOpexRatio"
														type="number"
														step="0.1"
														placeholder="Annual maintenance cost as % of CAPEX (5%)"
														value={formData.coolingMaintenanceOpexRatio}
														onChange={(e) =>
															handleInputChange(
																"coolingMaintenanceOpexRatio",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="countryElectricityPrice">
														Country Electricity Price ($/kWh)
													</Label>
													<Input
														id="countryElectricityPrice"
														type="number"
														step="0.001"
														placeholder="Local electricity pricing"
														value={formData.countryElectricityPrice}
														onChange={(e) =>
															handleInputChange(
																"countryElectricityPrice",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="countryWaterPrice">
														Country Water Price ($/L)
													</Label>
													<Input
														id="countryWaterPrice"
														type="number"
														step="0.001"
														placeholder="Local water pricing"
														value={formData.countryWaterPrice}
														onChange={(e) =>
															handleInputChange("countryWaterPrice", e.target.value)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Calculated Operational Values</CardTitle>
											<CardDescription>
												Configure calculated operational parameters
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="actualEnergyRequiredComputing">
														Actual Energy Required for Computing per Year (kWh/year)
													</Label>
													<Input
														id="actualEnergyRequiredComputing"
														type="number"
														placeholder="Annual computing energy needs"
														value={formData.actualEnergyRequiredComputing}
														onChange={(e) =>
															handleInputChange(
																"actualEnergyRequiredComputing",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="energyRequiredComputingCooling">
														Energy Required for Computing and Cooling per Year
														(kWh/year)
													</Label>
													<Input
														id="energyRequiredComputingCooling"
														type="number"
														placeholder="Total annual energy including cooling"
														value={formData.energyRequiredComputingCooling}
														onChange={(e) =>
															handleInputChange(
																"energyRequiredComputingCooling",
																e.target.value
															)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="waterRequiredPerYear">
														Water Required per Year (L/year)
													</Label>
													<Input
														id="waterRequiredPerYear"
														type="number"
														placeholder="Annual water consumption"
														value={formData.waterRequiredPerYear}
														onChange={(e) =>
															handleInputChange(
																"waterRequiredPerYear",
																e.target.value
															)
														}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</CardContent>
						<CardFooter className="flex justify-end space-x-4">
							<Button 
								type="button" 
								variant="outline"
								onClick={handleReset}
							>
								Reset Form
							</Button>
							<Button type="submit" disabled={!selectedSolution} className="bg-custom-dark-blue">
								Save Configuration
							</Button>
						</CardFooter>
					</Card>
				)}
			</form>
		</div>
	);
}
