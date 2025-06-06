"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Database, Server, Layers, Box } from "lucide-react";
import { useState } from "react";

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
			powerDensityPerRack: 3,
		},
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
			powerDensityPerRack: 8.6,
		},
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
			powerDensityPerRack: 30.2,
		},
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
			powerDensityPerRack: 60,
		},
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
			powerDensityPerRack: 1.5,
		},
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
			powerDensityPerRack: 4.5,
		},
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
			powerDensityPerRack: 2,
		},
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
			powerDensityPerRack: 5,
		},
	},
];

// Sample data for each solution
const solutionsData = {
	"kul2-3kw": {
		// Power Specifications
		powerKW: "3.0",
		powerDensityPerChassis: "3.0",
		numberOfChassisPerRack: "1",
		powerDensityPerRack: "3.0",

		// Physical Configuration
		numberOfRacksPerRow: "4",
		cduPowerRating: "15.0",
		hybridCoolerCapacity: "100.0",
		dxSystemCapacity: "50.0",
		numberOfAHUUnits: "1",

		// Core Cooling Infrastructure CAPEX
		pumpsCDUCapex: "12000",
		manifoldCapexPerRack: "800",
		rackCapex: "1200",
		chassisCommonServerCapex: "2000",

		// Supporting Infrastructure CAPEX
		hybridCoolerCapex: "35000",
		pressurisationAHUCapex: "8000",
		dxSystemCapex: "25000",
		packagedProcessWaterPumpCapex: "12000",
		rackMountedPDUStrips: "2",
		rackMountedPDUCapex: "400",
		kerbsideDeliveryPositioningCost: "300",

		// Installation & Integration
		iceotopeGCWorksCost: "95.50",
		gcWorksSlidingScale: "85.75",
		coolantCOGSPerKW: "35.25",

		// Efficiency Metrics
		pPUE: "1.12",
		wUE: "0.20",
		actualPowerRequiredDueToLackOfFans: "7.5",
		iceotopeITCostReduction: "95.0",

		// Heat Recovery
		heatRecoveryToLiquid: "80.0",
		heatRecoveryToAir: "20.0",

		// Maintenance & Operations OPEX
		coolingMaintenanceOpexRatio: "4.0",
		countryElectricityPrice: "0.12",
		countryWaterPrice: "0.003",

		// Calculated Operational Values
		actualEnergyRequiredComputing: "26280",
		energyRequiredComputingCooling: "29433",
		waterRequiredPerYear: "15000"
	},
	"kul2-8.6kw": {
		powerKW: "8.6",
		powerDensityPerChassis: "8.6",
		numberOfChassisPerRack: "1",
		powerDensityPerRack: "8.6",
		numberOfRacksPerRow: "6",
		cduPowerRating: "50.0",
		hybridCoolerCapacity: "200.0",
		dxSystemCapacity: "80.0",
		numberOfAHUUnits: "1",
		pumpsCDUCapex: "18000",
		manifoldCapexPerRack: "1000",
		rackCapex: "1500",
		chassisCommonServerCapex: "2800",
		hybridCoolerCapex: "45000",
		pressurisationAHUCapex: "10000",
		dxSystemCapex: "30000",
		packagedProcessWaterPumpCapex: "15000",
		rackMountedPDUStrips: "3",
		rackMountedPDUCapex: "500",
		kerbsideDeliveryPositioningCost: "400",
		iceotopeGCWorksCost: "105.50",
		gcWorksSlidingScale: "90.75",
		coolantCOGSPerKW: "40.25",
		pPUE: "1.13",
		wUE: "0.22",
		actualPowerRequiredDueToLackOfFans: "8.0",
		iceotopeITCostReduction: "96.0",
		heatRecoveryToLiquid: "82.0",
		heatRecoveryToAir: "18.0",
		coolingMaintenanceOpexRatio: "4.5",
		countryElectricityPrice: "0.12",
		countryWaterPrice: "0.003",
		actualEnergyRequiredComputing: "75336",
		energyRequiredComputingCooling: "85129",
		waterRequiredPerYear: "25000"
	},
	"kul2-30.2kw": {
		powerKW: "30.2",
		powerDensityPerChassis: "30.2",
		numberOfChassisPerRack: "1",
		powerDensityPerRack: "30.2",
		numberOfRacksPerRow: "10",
		cduPowerRating: "150.0",
		hybridCoolerCapacity: "800.0",
		dxSystemCapacity: "200.0",
		numberOfAHUUnits: "2",
		pumpsCDUCapex: "25000",
		manifoldCapexPerRack: "1500",
		rackCapex: "2000",
		chassisCommonServerCapex: "3500",
		hybridCoolerCapex: "75000",
		pressurisationAHUCapex: "15000",
		dxSystemCapex: "45000",
		packagedProcessWaterPumpCapex: "20000",
		rackMountedPDUStrips: "4",
		rackMountedPDUCapex: "800",
		kerbsideDeliveryPositioningCost: "500",
		iceotopeGCWorksCost: "125.50",
		gcWorksSlidingScale: "95.75",
		coolantCOGSPerKW: "45.25",
		pPUE: "1.15",
		wUE: "0.25",
		actualPowerRequiredDueToLackOfFans: "8.5",
		iceotopeITCostReduction: "97.0",
		heatRecoveryToLiquid: "85.0",
		heatRecoveryToAir: "15.0",
		coolingMaintenanceOpexRatio: "5.0",
		countryElectricityPrice: "0.12",
		countryWaterPrice: "0.003",
		actualEnergyRequiredComputing: "264552",
		energyRequiredComputingCooling: "304235",
		waterRequiredPerYear: "75000"
	},
	"kul2-60kw": {
		powerKW: "60.0",
		powerDensityPerChassis: "60.0",
		numberOfChassisPerRack: "1",
		powerDensityPerRack: "60.0",
		numberOfRacksPerRow: "12",
		cduPowerRating: "300.0",
		hybridCoolerCapacity: "1200.0",
		dxSystemCapacity: "400.0",
		numberOfAHUUnits: "3",
		pumpsCDUCapex: "35000",
		manifoldCapexPerRack: "2000",
		rackCapex: "2500",
		chassisCommonServerCapex: "4500",
		hybridCoolerCapex: "95000",
		pressurisationAHUCapex: "20000",
		dxSystemCapex: "60000",
		packagedProcessWaterPumpCapex: "25000",
		rackMountedPDUStrips: "6",
		rackMountedPDUCapex: "1000",
		kerbsideDeliveryPositioningCost: "600",
		iceotopeGCWorksCost: "145.50",
		gcWorksSlidingScale: "100.75",
		coolantCOGSPerKW: "50.25",
		pPUE: "1.18",
		wUE: "0.28",
		actualPowerRequiredDueToLackOfFans: "9.0",
		iceotopeITCostReduction: "98.0",
		heatRecoveryToLiquid: "87.0",
		heatRecoveryToAir: "13.0",
		coolingMaintenanceOpexRatio: "5.5",
		countryElectricityPrice: "0.12",
		countryWaterPrice: "0.003",
		actualEnergyRequiredComputing: "525600",
		energyRequiredComputingCooling: "620208",
		waterRequiredPerYear: "120000"
	},
	"kulbox-1u": {
		powerKW: "1.5",
		powerDensityPerChassis: "1.5",
		numberOfChassisPerRack: "1",
		powerDensityPerRack: "1.5",
		numberOfRacksPerRow: "2",
		cduPowerRating: "10.0",
		hybridCoolerCapacity: "50.0",
		dxSystemCapacity: "25.0",
		numberOfAHUUnits: "1",
		pumpsCDUCapex: "8000",
		manifoldCapexPerRack: "600",
		rackCapex: "1000",
		chassisCommonServerCapex: "1500",
		hybridCoolerCapex: "25000",
		pressurisationAHUCapex: "6000",
		dxSystemCapex: "20000",
		packagedProcessWaterPumpCapex: "10000",
		rackMountedPDUStrips: "1",
		rackMountedPDUCapex: "300",
		kerbsideDeliveryPositioningCost: "250",
		iceotopeGCWorksCost: "85.50",
		gcWorksSlidingScale: "80.75",
		coolantCOGSPerKW: "30.25",
		pPUE: "1.10",
		wUE: "0.18",
		actualPowerRequiredDueToLackOfFans: "7.0",
		iceotopeITCostReduction: "94.0",
		heatRecoveryToLiquid: "78.0",
		heatRecoveryToAir: "22.0",
		coolingMaintenanceOpexRatio: "3.5",
		countryElectricityPrice: "0.12",
		countryWaterPrice: "0.003",
		actualEnergyRequiredComputing: "13140",
		energyRequiredComputingCooling: "14454",
		waterRequiredPerYear: "8000"
	},
	"kulbox-3u": {
		powerKW: "4.5",
		powerDensityPerChassis: "4.5",
		numberOfChassisPerRack: "1",
		powerDensityPerRack: "4.5",
		numberOfRacksPerRow: "4",
		cduPowerRating: "25.0",
		hybridCoolerCapacity: "150.0",
		dxSystemCapacity: "60.0",
		numberOfAHUUnits: "1",
		pumpsCDUCapex: "15000",
		manifoldCapexPerRack: "900",
		rackCapex: "1300",
		chassisCommonServerCapex: "2200",
		hybridCoolerCapex: "40000",
		pressurisationAHUCapex: "9000",
		dxSystemCapex: "28000",
		packagedProcessWaterPumpCapex: "14000",
		rackMountedPDUStrips: "2",
		rackMountedPDUCapex: "450",
		kerbsideDeliveryPositioningCost: "350",
		iceotopeGCWorksCost: "100.50",
		gcWorksSlidingScale: "88.75",
		coolantCOGSPerKW: "38.25",
		pPUE: "1.12",
		wUE: "0.21",
		actualPowerRequiredDueToLackOfFans: "7.8",
		iceotopeITCostReduction: "95.5",
		heatRecoveryToLiquid: "81.0",
		heatRecoveryToAir: "19.0",
		coolingMaintenanceOpexRatio: "4.2",
		countryElectricityPrice: "0.12",
		countryWaterPrice: "0.003",
		actualEnergyRequiredComputing: "39420",
		energyRequiredComputingCooling: "44150",
		waterRequiredPerYear: "18000"
	},
	"jbod-box": {
		powerKW: "2.0",
		powerDensityPerChassis: "2.0",
		numberOfChassisPerRack: "1",
		powerDensityPerRack: "2.0",
		numberOfRacksPerRow: "3",
		cduPowerRating: "12.0",
		hybridCoolerCapacity: "80.0",
		dxSystemCapacity: "30.0",
		numberOfAHUUnits: "1",
		pumpsCDUCapex: "10000",
		manifoldCapexPerRack: "700",
		rackCapex: "1100",
		chassisCommonServerCapex: "1800",
		hybridCoolerCapex: "30000",
		pressurisationAHUCapex: "7000",
		dxSystemCapex: "22000",
		packagedProcessWaterPumpCapex: "11000",
		rackMountedPDUStrips: "2",
		rackMountedPDUCapex: "350",
		kerbsideDeliveryPositioningCost: "280",
		iceotopeGCWorksCost: "90.50",
		gcWorksSlidingScale: "82.75",
		coolantCOGSPerKW: "32.25",
		pPUE: "1.11",
		wUE: "0.19",
		actualPowerRequiredDueToLackOfFans: "7.2",
		iceotopeITCostReduction: "94.5",
		heatRecoveryToLiquid: "79.0",
		heatRecoveryToAir: "21.0",
		coolingMaintenanceOpexRatio: "3.8",
		countryElectricityPrice: "0.12",
		countryWaterPrice: "0.003",
		actualEnergyRequiredComputing: "17520",
		energyRequiredComputingCooling: "19447",
		waterRequiredPerYear: "10000"
	},
	"jbod-standard": {
		powerKW: "5.0",
		powerDensityPerChassis: "5.0",
		numberOfChassisPerRack: "1",
		powerDensityPerRack: "5.0",
		numberOfRacksPerRow: "5",
		cduPowerRating: "30.0",
		hybridCoolerCapacity: "160.0",
		dxSystemCapacity: "70.0",
		numberOfAHUUnits: "1",
		pumpsCDUCapex: "16000",
		manifoldCapexPerRack: "950",
		rackCapex: "1400",
		chassisCommonServerCapex: "2400",
		hybridCoolerCapex: "42000",
		pressurisationAHUCapex: "9500",
		dxSystemCapex: "29000",
		packagedProcessWaterPumpCapex: "15000",
		rackMountedPDUStrips: "3",
		rackMountedPDUCapex: "500",
		kerbsideDeliveryPositioningCost: "380",
		iceotopeGCWorksCost: "110.50",
		gcWorksSlidingScale: "92.75",
		coolantCOGSPerKW: "42.25",
		pPUE: "1.13",
		wUE: "0.23",
		actualPowerRequiredDueToLackOfFans: "8.2",
		iceotopeITCostReduction: "96.2",
		heatRecoveryToLiquid: "83.0",
		heatRecoveryToAir: "17.0",
		coolingMaintenanceOpexRatio: "4.4",
		countryElectricityPrice: "0.12",
		countryWaterPrice: "0.003",
		actualEnergyRequiredComputing: "43800",
		energyRequiredComputingCooling: "49494",
		waterRequiredPerYear: "20000"
	}
};

const InfoField = ({
	label,
	value,
	unit = "",
}: {
	label: string;
	value: string;
	unit?: string;
}) => (
	<div className="space-y-1">
		<div className="text-sm font-medium text-muted-foreground">{label}</div>
		<div className="text-base font-semibold">
			{value}{" "}
			{unit && (
				<span className="text-sm font-normal text-muted-foreground">
					{unit}
				</span>
			)}
		</div>
	</div>
);

export default function SolutionsDisplay() {
	const [selectedSolutionId, setSelectedSolutionId] = useState("kul2-30.2kw");
	const selectedSolution = solutions.find(
		(s) => s.id === selectedSolutionId
	);

	const handleSolutionSelect = (solutionId: string) => {
		setSelectedSolutionId(solutionId);
	};

	// Get the data for the selected solution
	const currentSolutionData = solutionsData[selectedSolutionId as keyof typeof solutionsData];

	return (
		<div className="space-y-6 p-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Cooling Solutions
					</h1>
					<p className="text-muted-foreground">
						Current cooling solution specifications and parameters
					</p>
				</div>
			</div>

			{/* Solutions Carousel */}
			<Carousel
				opts={{
					align: "start",
					loop: true,
				}}
				className="w-full relative px-12"
			>
				<CarouselContent className="-ml-2 md:-ml-4">
					{solutions.map((solution) => (
						<CarouselItem
							key={solution.id}
							className="pl-2 md:pl-4 md:basis-1/4 py-2"
						>
							<Card
								className={`cursor-pointer transition-all duration-200 select-none py-2 hover:shadow-md
                  ${
										selectedSolutionId === solution.id
											? "border-primary bg-primary/5 shadow-lg scale-105"
											: "opacity-80 hover:opacity-100"
									}`}
								onClick={() => handleSolutionSelect(solution.id)}
							>
								<CardContent className="flex flex-col items-center p-2 select-none">
									<solution.icon
										className={`h-8 w-8 mb-2 transition-colors duration-200 select-none
                    ${
											selectedSolutionId === solution.id
												? "text-blue-600"
												: "text-muted-foreground"
										}`}
									/>
									<h3
										className={`font-semibold text-center transition-colors duration-200
                    ${
											selectedSolutionId === solution.id
												? "text-primary"
												: ""
										}`}
									>
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
				<CarouselPrevious className="left-0 bg-blue-600 text-white hover:bg-blue-700 hover:text-white" />
				<CarouselNext className="right-0 bg-blue-600 text-white hover:bg-blue-700 hover:text-white" />
			</Carousel>

			{/* Configuration Display */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle>
						Solution Configuration - {selectedSolution?.name}
					</CardTitle>
					<CardDescription>
						Current configuration parameters and specifications
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Tabs defaultValue="specifications" className="w-full">
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
										Power consumption and density parameters
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="Power"
											value={currentSolutionData.powerKW}
											unit="kW"
										/>
										<InfoField
											label="Power Density per Chassis"
											value={currentSolutionData.powerDensityPerChassis}
											unit="kW"
										/>
										<InfoField
											label="Number of Chassis per Rack"
											value={currentSolutionData.numberOfChassisPerRack}
										/>
										<InfoField
											label="Power Density per Rack"
											value={currentSolutionData.powerDensityPerRack}
											unit="kW/rack"
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Physical Configuration</CardTitle>
									<CardDescription>
										Physical layout and cooling system parameters
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="Number of Racks per Row"
											value={currentSolutionData.numberOfRacksPerRow}
										/>
										<InfoField
											label="CDU Power Rating"
											value={currentSolutionData.cduPowerRating}
											unit="kW"
										/>
										<InfoField
											label="Hybrid Cooler Capacity"
											value={currentSolutionData.hybridCoolerCapacity}
											unit="kW"
										/>
										<InfoField
											label="DX System Capacity"
											value={currentSolutionData.dxSystemCapacity}
											unit="kW"
										/>
										<InfoField
											label="Number of AHU Units"
											value={currentSolutionData.numberOfAHUUnits}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="costs" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Core Cooling Infrastructure (CAPEX)</CardTitle>
									<CardDescription>Core cooling system costs</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="Pumps/CDU CAPEX"
											value={currentSolutionData.pumpsCDUCapex}
											unit="$"
										/>
										<InfoField
											label="Manifold CAPEX per Rack"
											value={currentSolutionData.manifoldCapexPerRack}
											unit="$"
										/>
										<InfoField
											label="Rack CAPEX"
											value={currentSolutionData.rackCapex}
											unit="$"
										/>
										<InfoField
											label="Chassis Common + Server Specific CAPEX"
											value={currentSolutionData.chassisCommonServerCapex}
											unit="$/chassis"
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Supporting Infrastructure (CAPEX)</CardTitle>
									<CardDescription>Supporting system costs</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="Hybrid Cooler CAPEX (800 kW unit)"
											value={currentSolutionData.hybridCoolerCapex}
											unit="$"
										/>
										<InfoField
											label="Pressurisation AHU CAPEX"
											value={currentSolutionData.pressurisationAHUCapex}
											unit="$"
										/>
										<InfoField
											label="DX System CAPEX"
											value={currentSolutionData.dxSystemCapex}
											unit="$"
										/>
										<InfoField
											label="Packaged Process Water Pump Room CAPEX"
											value={currentSolutionData.packagedProcessWaterPumpCapex}
											unit="$"
										/>
										<InfoField
											label="Rack Mounted PDU Power Strips per Rack"
											value={currentSolutionData.rackMountedPDUStrips}
										/>
										<InfoField
											label="Rack Mounted PDU Power Strip CAPEX"
											value={currentSolutionData.rackMountedPDUCapex}
											unit="$"
										/>
										<InfoField
											label="Kerbside Delivery and Positioning Cost per Rack"
											value={currentSolutionData.kerbsideDeliveryPositioningCost}
											unit="$/rack"
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Installation & Integration</CardTitle>
									<CardDescription>
										Installation and integration costs
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="Iceotope GC Works Cost per kW"
											value={currentSolutionData.iceotopeGCWorksCost}
											unit="$/kW"
										/>
										<InfoField
											label="GC Works Sliding Scale"
											value={currentSolutionData.gcWorksSlidingScale}
											unit="$/kW"
										/>
										<InfoField
											label="Coolant COGS per kW Nameplate"
											value={currentSolutionData.coolantCOGSPerKW}
											unit="$/kW"
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="performance" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Efficiency Metrics</CardTitle>
									<CardDescription>
										Power and efficiency parameters
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="pPUE (Power Usage Effectiveness)"
											value={currentSolutionData.pPUE}
										/>
										<InfoField
											label="WUE (Water Usage Effectiveness)"
											value={currentSolutionData.wUE}
										/>
										<InfoField
											label="% of Actual Power Required Due to Lack of Fans"
											value={currentSolutionData.actualPowerRequiredDueToLackOfFans}
											unit="%"
										/>
										<InfoField
											label="Iceotope IT Cost Reduction Due to Less Network Cost"
											value={currentSolutionData.iceotopeITCostReduction}
											unit="%"
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Heat Recovery</CardTitle>
									<CardDescription>Heat recovery parameters</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="Heat Recovery to Liquid"
											value={currentSolutionData.heatRecoveryToLiquid}
											unit="%"
										/>
										<InfoField
											label="Heat Recovery to Air"
											value={currentSolutionData.heatRecoveryToAir}
											unit="%"
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="operations" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Maintenance & Operations (OPEX)</CardTitle>
									<CardDescription>
										Operational costs and parameters
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="Cooling Maintenance OPEX Cost per Year Ratio to CAPEX"
											value={currentSolutionData.coolingMaintenanceOpexRatio}
											unit="%"
										/>
										<InfoField
											label="Country Electricity Price"
											value={currentSolutionData.countryElectricityPrice}
											unit="$/kWh"
										/>
										<InfoField
											label="Country Water Price"
											value={currentSolutionData.countryWaterPrice}
											unit="$/L"
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Calculated Operational Values</CardTitle>
									<CardDescription>
										Calculated operational parameters
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<InfoField
											label="Actual Energy Required for Computing per Year"
											value={currentSolutionData.actualEnergyRequiredComputing}
											unit="kWh/year"
										/>
										<InfoField
											label="Energy Required for Computing and Cooling per Year"
											value={currentSolutionData.energyRequiredComputingCooling}
											unit="kWh/year"
										/>
										<InfoField
											label="Water Required per Year"
											value={currentSolutionData.waterRequiredPerYear}
											unit="L/year"
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
