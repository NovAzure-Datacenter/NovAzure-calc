import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TCOCalculator() {
    const [valueCaptured, setValueCaptured] = useState(false);
    const [pocCost, setPocCost] = useState("No");
    const [pocCostValue, setPocCostValue] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [deploymentType, setDeploymentType] = useState("Greenfield");

    const [dataCentreType, setDataCentreType] = useState("none");
    const [utilisation, setUtilisation] = useState("none");
    const [yearsOfOperation, setYearsOfOperation] = useState("");
    const [projectLocation, setProjectLocation] = useState("none");
    const [dataHallCapacity, setDataHallCapacity] = useState("");
    const [firstYear, setFirstYear] = useState("none");

    const [airCoolingPUE, setAirCoolingPUE] = useState("");
    const [liquidCoolingPUE, setLiquidCoolingPUE] = useState("");

    const [iceotopePricingMethod, setIceotopePricingMethod] = useState("");

    const [retrofitProjectType, setRetrofitProjectType] = useState("expansion");
    const [iceotopeRackCount, setIceotopeRackCount] = useState("");

    const dataCentreTypeOptions = ["General Purpose", "HPC/AI"];
    const utilisationOptions = ["25%", "50%", "75%", "100%"];
    const projectLocationOptions = ["USA", "UK", "Singapore", "UAE"];
    const yearOptions = Array.from({ length: 21 }, (_, i) => (2020 + i).toString());

    return (
        <div className="flex justify-center w-full min-h-screen bg-muted">
            <div className="w-full max-w-5xl space-y-6 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chassis Immersion Vs. Air Cooling Solutions</h1>
                    <p className="text-muted-foreground">
                        Please ensure ALL entries are filled out before clicking show result
                    </p>
                </div>
                <div className="grid gap-6">
                    <Card className="shadow-lg">
                        <CardContent>
                            <div className="w-full mb-6 rounded-md p-4 bg-white/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    {/* Left column: Value-Captured Pricing Customisation */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={valueCaptured}
                                                onChange={(e) => setValueCaptured(e.target.checked)}
                                                id="valueCaptured"
                                                className="h-4 w-4"
                                            />
                                            <label htmlFor="valueCaptured" className="text-base font-medium">
                                                Value-Captured Pricing Customisation
                                            </label>
                                        </div>
                                        {valueCaptured && (
                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <Label className="text-xs text-muted-foreground" htmlFor="iceotopePricingMethod">
                                                        Iceotope Pricing Method
                                                    </Label>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button type="button" tabIndex={0} aria-label="Info about pricing method" className="focus:outline-none">
                                                                    <Info className="w-4 h-4 text-muted-foreground" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="max-w-xs">
                                                                Value captured = The percentage of value captured as margin by Iceotope. Fixed Markup = Fixed unit margin for Iceotope.
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <Select
                                                    value={iceotopePricingMethod}
                                                    onValueChange={(value: "none" | "value-captured" | "fixed-markup") =>
                                                        setIceotopePricingMethod(value)
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Select an Option</SelectItem>
                                                        <SelectItem value="value-captured">Value captured (%)</SelectItem>
                                                        <SelectItem value="fixed-markup">Fixed markup ($/kW)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                    {/* Right column: PoC Cost */}
                                    <div>
                                        <div className="flex flex-wrap items-center gap-x-4">
                                            <Label htmlFor="pocCost" className="text-base font-medium mb-0 whitespace-nowrap">
                                                Include Proof of Concept (PoC) Cost
                                            </Label>
                                            <Select
                                                value={pocCost}
                                                onValueChange={(value: "No" | "Yes") => setPocCost(value)}
                                            >
                                                <SelectTrigger className="h-10 w-28">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="No">No</SelectItem>
                                                    <SelectItem value="Yes">Yes</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {pocCost === "Yes" && (
                                            <div className="mt-2">
                                                <Label htmlFor="pocCostValue" className="text-xs text-muted-foreground mb-2 block">
                                                    PoC Cost (Excluding IT, in USD)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    id="pocCostValue"
                                                    value={pocCostValue}
                                                    onChange={(e) => setPocCostValue(e.target.value)}
                                                    className="w-full border rounded px-3 py-2 placeholder:text-muted-foreground"
                                                    placeholder="e.g. 15000"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardContent>
                            {/* User Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                                <div>
                                    <Label className="text-xs text-muted-foreground mb-2" htmlFor="userName">
                                        User Name *
                                    </Label>
                                    <Input
                                        id="userName"
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        title="Enter your full name"
                                        placeholder="Type your User Name"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground mb-2" htmlFor="userEmail">
                                        User Email *
                                    </Label>
                                    <Input
                                        id="userEmail"
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        title="Enter a valid email address"
                                        placeholder="Type your Email address"
                                    />
                                </div>
                            </div>
                            {/* Deployment Type */}
                            <div className="flex gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="deployment"
                                        value="Greenfield"
                                        checked={deploymentType === "Greenfield"}
                                        onChange={(e) => setDeploymentType(e.target.value)}
                                        id="greenfield"
                                    />
                                    <label htmlFor="greenfield" className="flex items-center gap-1">
                                        Greenfield
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button type="button" tabIndex={0} className="focus:outline-none">
                                                        <Info className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="max-w-xs">
                                                    Adopting liquid cooling in new, undeveloped areas or beyond the current boundaries of existing data center buildings.
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="deployment"
                                        value="Retrofit"
                                        checked={deploymentType === "Retrofit"}
                                        onChange={(e) => setDeploymentType(e.target.value)}
                                        id="retrofit"
                                    />
                                    <label htmlFor="retrofit" className="flex items-center gap-1">
                                        Retrofit
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button type="button" tabIndex={0} className="focus:outline-none">
                                                        <Info className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="max-w-xs">
                                                    Integrating liquid cooling into existing data centers as a new addition.
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardContent>
                            {/* Data Centre Configuration */}
                            <div className="w-full mb-10">
                                <h2 className="text-xl font-semibold mb-4">Data Centre Configuration</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="mb-1 flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground mb-2" htmlFor="dataCentreType">
                                                Data Centre Type *
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button type="button" tabIndex={0} className="focus:outline-none">
                                                            <Info className="w-4 h-4 text-muted-foreground" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-xs">
                                                        Type of facility this configuration applies to (e.g., Colocation, Enterprise)
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={dataCentreType}
                                            onValueChange={setDataCentreType}
                                        >
                                            <SelectTrigger className="h-8 w-full">
                                                <SelectValue placeholder="Select an Option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Select an Option</SelectItem>
                                                {dataCentreTypeOptions.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground" htmlFor="utilisation">
                                                % of Utilisation *
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button type="button" tabIndex={0} aria-label="Info about utilisation" className="focus:outline-none">
                                                            <Info className="w-4 h-4 text-muted-foreground" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-xs">
                                                        Expected utilization percentage of the data centre infrastructure.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={utilisation}
                                            onValueChange={setUtilisation}
                                        >
                                            <SelectTrigger className="h-8 w-full">
                                                <SelectValue placeholder="Select an Option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Select an Option</SelectItem>
                                                {utilisationOptions.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground" htmlFor="yearsOfOperation">
                                                Planned Number of Years of Operation *
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button type="button" tabIndex={0} aria-label="Info about years of operation" className="focus:outline-none">
                                                            <Info className="w-4 h-4 text-muted-foreground" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-xs">
                                                        Estimated operational lifespan of the data centre.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={yearsOfOperation}
                                            onChange={(e) => setYearsOfOperation(e.target.value)}
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground" htmlFor="projectLocation">
                                                Project Location *
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button type="button" tabIndex={0} aria-label="Info about project location" className="focus:outline-none">
                                                            <Info className="w-4 h-4 text-muted-foreground" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-xs">
                                                        Select the country or region where the data centre project will be located.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={projectLocation}
                                            onValueChange={setProjectLocation}
                                        >
                                            <SelectTrigger className="h-8 w-full">
                                                <SelectValue placeholder="Select an Option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Select an Option</SelectItem>
                                                {projectLocationOptions.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {deploymentType === "Greenfield" && (
                                        <div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <Label className="text-xs text-muted-foreground" htmlFor="dataHallCapacity">
                                                    Data Hall Design Capacity MW *
                                                </Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" tabIndex={0} aria-label="Info about data hall capacity" className="focus:outline-none">
                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            Size of the data hall in Megawatts (MW).
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={dataHallCapacity}
                                                onChange={(e) => setDataHallCapacity(e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground" htmlFor="firstYear">
                                                First Year of Operation *
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button type="button" tabIndex={0} aria-label="Info about first year of operation" className="focus:outline-none">
                                                            <Info className="w-4 h-4 text-muted-foreground" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-xs">
                                                        Year in which operations are expected to begin.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={firstYear}
                                            onValueChange={setFirstYear}
                                        >
                                            <SelectTrigger className="h-8 w-full">
                                                <SelectValue placeholder="Select an Option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Select an Option</SelectItem>
                                                {yearOptions.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            {/* Cooling Configuration */}
                            {deploymentType === "Greenfield" ? (
                                <div className="w-full mb-10">
                                    <h2 className="text-xl font-semibold mb-4">Cooling Configuration</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-md font-semibold">Air Cooling</h3>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" tabIndex={0} aria-label="Info about Air Cooling" className="focus:outline-none">
                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            Air Cooling refers to traditional data center cooling using chilled air to dissipate heat from IT equipment. Enter the annualized partial Power Usage Effectiveness (pPUE) for your air-cooled setup.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Label className="text-xs text-muted-foreground mb-2" htmlFor="airCoolingPUE" title="Annualized partial Power Usage Effectiveness for Air Cooling at selected utilization">
                                                Annualised Air pPUE (at selected % of utilisation) *
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={airCoolingPUE}
                                                    onChange={(e) => setAirCoolingPUE(e.target.value)}
                                                    className="w-full border rounded px-3 py-2"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-md font-semibold">Chassis Immersion Precision Liquid Cooling</h3>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" tabIndex={0} aria-label="Info about Chassis Immersion Precision Liquid Cooling" className="focus:outline-none">
                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            Chassis Immersion is our advanced liquid cooling solution, providing efficient thermal management for high-density compute environments. Select your configuration and enter the required values for accurate TCO calculation.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Label className="text-xs text-muted-foreground mb-2" htmlFor="liquidCoolingPUE" title="Annualized partial Power Usage Effectiveness for Chassis Immersion Liquid Cooling">
                                                Annualised Liquid Cooled pPUE at selected % of load:
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={liquidCoolingPUE}
                                                onChange={(e) => setLiquidCoolingPUE(e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full mb-10">
                                    <h2 className="text-xl font-semibold mb-4">Cooling Configuration</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Air Cooling */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-md font-semibold">Air Cooling</h3>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" tabIndex={0} aria-label="Info about Air Cooling" className="focus:outline-none">
                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            Air Cooling refers to traditional data center cooling using chilled air to dissipate heat from IT equipment. Enter the annualized partial Power Usage Effectiveness (pPUE) for your air-cooled setup.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Label className="text-xs text-muted-foreground mb-2" htmlFor="airCoolingPUE">
                                                Annualised Air pPUE (at selected % of utilisation) *
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={airCoolingPUE}
                                                onChange={(e) => setAirCoolingPUE(e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        {/* Chassis Immersion Precision Liquid Cooling */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-md font-semibold">Chassis Immersion Precision Liquid Cooling</h3>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" tabIndex={0} aria-label="Info about Chassis Immersion Precision Liquid Cooling" className="focus:outline-none">
                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            Chassis Immersion is our advanced liquid cooling solution, providing efficient thermal management for high-density compute environments. Select your configuration and enter the required values for accurate TCO calculation.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Label className="text-xs text-muted-foreground mb-2" htmlFor="liquidCoolingPUE">
                                                Annualised Liquid Cooled pPUE at selected % of load:
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={liquidCoolingPUE}
                                                onChange={(e) => setLiquidCoolingPUE(e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                            <div className="mt-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">Retrofit project type</span>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button type="button" tabIndex={0} aria-label="Info about Retrofit project type" className="focus:outline-none">
                                                                    <Info className="w-4 h-4 text-muted-foreground" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="max-w-xs">
                                                                Select whether this retrofit is an Expansion (adding new racks to existing infrastructure) or a Replacement (replacing existing racks with Chassis Immersion racks).
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="retrofitProjectType"
                                                            value="expansion"
                                                            checked={retrofitProjectType === "expansion"}
                                                            onChange={() => setRetrofitProjectType("expansion")}
                                                            className="accent-blue-700"
                                                        />
                                                        Expansion
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="retrofitProjectType"
                                                            value="replacement"
                                                            checked={retrofitProjectType === "replacement"}
                                                            onChange={() => setRetrofitProjectType("replacement")}
                                                            className="accent-blue-700"
                                                        />
                                                        Replacement
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Number of Chassis Immersion Racks and Calculated Capacity */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Label className="text-xs text-muted-foreground" htmlFor="chassisImmersionRackCount">
                                                    Number of Chassis Immersion Racks to Put In *
                                                </Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" tabIndex={0} aria-label="Info about Chassis Immersion Racks" className="focus:outline-none">
                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            Enter the total number of Chassis Immersion racks you are planning to install as part of this retrofit project. This is a required field for accurate calculations.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={iceotopeRackCount}
                                                onChange={(e) => setIceotopeRackCount(e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground italic mb-6">
                                An asterisk * denotes that the field is required to view results
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col items-center mt-12 gap-6">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="see-definitions" className="h-5 w-5 rounded border" />
                        <label htmlFor="see-definitions" className="text-lg text-muted-foreground select-none">See Definitions and Assumptions</label>
                    </div>
                    <div className="flex gap-6 mt-4">
                        <Button type="button" className="bg-[#11182A] text-white font-semibold px-10 py-4 text-lg rounded-lg">Show Result</Button>
                        <Button type="button" className="bg-[#11182A] text-white font-semibold px-10 py-4 text-lg rounded-lg">Reset</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
