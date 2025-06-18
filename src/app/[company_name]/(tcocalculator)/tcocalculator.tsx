import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Download } from "lucide-react";
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function TCOCalculator() {
    // 1. Define the initial state object
    const initialState = {
        valueCaptured: false,
        pocCost: "No",
        pocCostValue: "",
        userName: "",
        userEmail: "",
        deploymentType: "Greenfield",
        dataCentreType: "none",
        utilisation: "none",
        yearsOfOperation: "",
        projectLocation: "none",
        dataHallCapacity: "",
        firstYear: "none",
        airCoolingPUE: "",
        liquidCoolingPUE: "",
        iceotopePricingMethod: "",
        retrofitProjectType: "expansion",
        iceotopeRackCount: "",
        showDefinitions: false,
        showResultTable: false,
    };

    // 2. Single useState for all state
    const [state, setState] = useState(initialState);

    // 3. Update all usages: state.field, setState(prev => ({ ...prev, field: value }))
    // Example for userName:
    // value={state.userName}
    // onChange={e => setState(prev => ({ ...prev, userName: e.target.value }))}

    // 4. Update reset logic
    function handleReset() {
        setState(initialState);
    }

    // 5. Update validation logic
    const allRequiredFilled =
        !!state.userName &&
        !!state.userEmail &&
        state.dataCentreType !== "none" &&
        state.utilisation !== "none" &&
        !!state.yearsOfOperation &&
        state.projectLocation !== "none" &&
        !!state.dataHallCapacity &&
        !!state.airCoolingPUE &&
        (!state.valueCaptured || (state.iceotopePricingMethod !== "" && state.iceotopePricingMethod !== "none")) &&
        (state.pocCost !== "Yes" || !!state.pocCostValue);

    const dataCentreTypeOptions = ["General Purpose", "HPC/AI"];
    const utilisationOptions = ["20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
    const projectLocationOptions = ["USA", "UK", "Singapore", "UAE"];
    const yearOptions = Array.from({ length: 21 }, (_, i) => (2020 + i).toString());

    function handleExportPDF() {
        const dashboard = document.getElementById('tco-dashboard-export');
        if (!dashboard) return;
        html2canvas(dashboard, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('tco-dashboard.pdf');
        });
    }

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
                                                checked={state.valueCaptured}
                                                onChange={(e) => setState(prev => ({ ...prev, valueCaptured: e.target.checked }))}
                                                id="valueCaptured"
                                                className="h-4 w-4"
                                            />
                                            <label htmlFor="valueCaptured" className="text-base font-medium">
                                                Value-Captured Pricing Customisation
                                            </label>
                                        </div>
                                        {state.valueCaptured && (
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
                                                                Value captured = The percentage of value captured as margin by Chassis Immersion. Fixed Markup = Fixed unit margin for Chassis Immersion.
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <Select
                                                    value={state.iceotopePricingMethod}
                                                    onValueChange={(value: "none" | "value-captured" | "fixed-markup") =>
                                                        setState(prev => ({ ...prev, iceotopePricingMethod: value }))
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
                                                value={state.pocCost}
                                                onValueChange={(value: "No" | "Yes") => setState(prev => ({ ...prev, pocCost: value }))}
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
                                        {state.pocCost === "Yes" && (
                                            <div className="mt-2">
                                                <Label htmlFor="pocCostValue" className="text-xs text-muted-foreground mb-2 block">
                                                    PoC Cost (Excluding IT, in USD)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    id="pocCostValue"
                                                    value={state.pocCostValue}
                                                    onChange={(e) => setState(prev => ({ ...prev, pocCostValue: e.target.value }))}
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
                                        value={state.userName}
                                        onChange={(e) => setState(prev => ({ ...prev, userName: e.target.value }))}
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
                                        value={state.userEmail}
                                        onChange={(e) => setState(prev => ({ ...prev, userEmail: e.target.value }))}
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
                                        checked={state.deploymentType === "Greenfield"}
                                        onChange={(e) => setState(prev => ({ ...prev, deploymentType: e.target.value }))}
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
                                        checked={state.deploymentType === "Retrofit"}
                                        onChange={(e) => setState(prev => ({ ...prev, deploymentType: e.target.value }))}
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
                                            value={state.dataCentreType}
                                            onValueChange={(value) => setState(prev => ({ ...prev, dataCentreType: value }))}
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
                                                        Actual IT power consumption vs maximum IT design.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={state.utilisation}
                                            onValueChange={(value) => setState(prev => ({ ...prev, utilisation: value }))}
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
                                                        Expected operational lifespan of the new cooling system. The maximum number of years of operation is 20 years.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={state.yearsOfOperation}
                                            onChange={(e) => setState(prev => ({ ...prev, yearsOfOperation: e.target.value }))}
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="Enter years (max 20)"
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
                                                        Please choose the country where your data center is located. If you can't find it in the dropdown, pick the country that has the most similar climate.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={state.projectLocation}
                                            onValueChange={(value) => setState(prev => ({ ...prev, projectLocation: value }))}
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
                                    {state.deploymentType === "Greenfield" && (
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
                                                            The maximum amount of electrical energy consumed by or dedicated to the installed IT equipment. The value should be greater than 0.5 MW but no more than 10 MW.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                type="number"
                                                min="0.5"
                                                max="10"
                                                step="0.01"
                                                value={state.dataHallCapacity}
                                                onChange={(e) => setState(prev => ({ ...prev, dataHallCapacity: e.target.value }))}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="e.g. 2.5"
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
                                                        Planned commencement year for the data center or hall.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select
                                            value={state.firstYear}
                                            onValueChange={(value) => setState(prev => ({ ...prev, firstYear: value }))}
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
                            {state.deploymentType === "Greenfield" ? (
                                <div className="w-full mb-10">
                                    <h2 className="text-xl font-semibold mb-4">Cooling Configuration</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Label className="text-xs text-muted-foreground" htmlFor="airCoolingPUE" title="Annualized partial Power Usage Effectiveness for Air Cooling at selected utilization">
                                                    Annualised Air pPUE (at selected % of utilisation) *
                                                </Label>
                                                <span className="text-xs text-muted-foreground font-semibold ml-1">1.54</span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" tabIndex={0} aria-label="Info about Air Cooling pPUE" className="focus:outline-none">
                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            Typical Air Annualised pPUE (partial Power Usage Effectiveness for cooling) for the selected location at selected load.
                                                            Please ensure any inputted pPUE value is above 1.00 and below 3.00.
                                                            The suggested average market value is to the right and based on the selected load of 40%.
                                                            At 100% of load, the selected location has average market pPUE of 1.2.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    value={state.airCoolingPUE}
                                                    onChange={(e) => setState(prev => ({ ...prev, airCoolingPUE: e.target.value }))}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter value (1.00 - 3.00)"
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
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={"1.13"}
                                                    readOnly
                                                    className="w-full border rounded px-3 py-2 bg-muted cursor-not-allowed"
                                                />
                                                <span className="text-xs text-muted-foreground font-semibold ml-1">1.13</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Always show Advanced button, warning, and asterisk note below the Cooling Configuration section */}
                                    <div className="flex flex-col items-start gap-2 mt-4 mb-8">
                                        <Button disabled={!allRequiredFilled}>
                                            Advanced...
                                        </Button>
                                        {!allRequiredFilled && (
                                            <p className="text-sm text-red-600 font-medium">
                                                Please ensure all required fields are completed to access the Advanced section or show results!
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground italic">
                                            An asterisk * denotes that the field is required to view results
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full mb-10">
                                    <h2 className="text-xl font-semibold mb-4">Cooling Configuration</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Air Cooling */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Label className="text-xs text-muted-foreground" htmlFor="airCoolingPUE" title="Annualized partial Power Usage Effectiveness for Air Cooling at selected utilization">
                                                    Annualised Air pPUE (at selected % of utilisation) *
                                                </Label>
                                                <span className="text-xs text-muted-foreground font-semibold ml-1">1.54</span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" tabIndex={0} aria-label="Info about Air Cooling pPUE" className="focus:outline-none">
                                                                <Info className="w-4 h-4 text-muted-foreground" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-xs">
                                                            Typical Air Annualised pPUE (partial Power Usage Effectiveness for cooling) for the selected location at selected load.
                                                            Please ensure any inputted pPUE value is above 1.00 and below 3.00.
                                                            The suggested average market value is to the right and based on the selected load of 40%.
                                                            At 100% of load, the selected location has average market pPUE of 1.2.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={state.airCoolingPUE}
                                                    onChange={(e) => setState(prev => ({ ...prev, airCoolingPUE: e.target.value }))}
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Enter value (1.00 - 3.00)"
                                                />
                                            </div>
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
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={"1.13"}
                                                    readOnly
                                                    className="w-full border rounded px-3 py-2 bg-muted cursor-not-allowed"
                                                />
                                                <span className="text-xs text-muted-foreground font-semibold ml-1">1.13</span>
                                            </div>
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
                                                            checked={state.retrofitProjectType === "expansion"}
                                                            onChange={() => setState(prev => ({ ...prev, retrofitProjectType: "expansion" }))}
                                                            className="accent-blue-700"
                                                        />
                                                        Expansion
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="retrofitProjectType"
                                                            value="replacement"
                                                            checked={state.retrofitProjectType === "replacement"}
                                                            onChange={() => setState(prev => ({ ...prev, retrofitProjectType: "replacement" }))}
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
                                                value={state.iceotopeRackCount}
                                                onChange={(e) => setState(prev => ({ ...prev, iceotopeRackCount: e.target.value }))}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    {/* Always show Advanced button, warning, and asterisk note below the Cooling Configuration section */}
                                    <div className="flex flex-col items-start gap-2 mt-4 mb-8">
                                        <Button disabled={!allRequiredFilled}>
                                            Advanced...
                                        </Button>
                                        {!allRequiredFilled && (
                                            <p className="text-sm text-red-600 font-medium">
                                                Please ensure all required fields are completed to access the Advanced section or show results!
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground italic">
                                            An asterisk * denotes that the field is required to view results
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col items-center mt-12 gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="see-definitions"
                            className="h-5 w-5 rounded border"
                            checked={state.showDefinitions}
                            onChange={(e) => setState(prev => ({ ...prev, showDefinitions: e.target.checked }))}
                        />
                        <label htmlFor="see-definitions" className="text-lg text-muted-foreground select-none">See Definitions and Assumptions</label>
                    </div>
                    {state.showDefinitions && (
                        <div className="mt-6 space-y-8">
                            {/* Simple Definitions Table */}
                            <Card className="overflow-x-auto">
                                <h3 className="text-lg font-semibold px-4 pt-4 pb-2">General Definitions</h3>
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left font-semibold px-4 py-2">Term</th>
                                            <th className="text-left font-semibold px-4 py-2">Definition</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Greenfield</td><td className="px-4 py-2">A plan for liquid cooling adoption in undeveloped sites or outside the perimeter of existing data centre halls.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Retrofit</td><td className="px-4 py-2">A plan for liquid cooling adoption as an addition to and/or as a replacement of air-cooling systems within existing data centre halls.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Simplified section</td><td className="px-4 py-2">The Simplified section allows the Chassis Immersion Sales team to quickly demonstrate example benefits of Chassis Immersion technology to potential customers. Users can obtain valuable results from the Value Calculator with minimal inputs. The section utilises air-cooled cost figures based on widely-accepted benchmark data from a Schneider Electric model and Evaluation QS report. All costs have been updated to reflect current inflation rates.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Advanced section</td><td className="px-4 py-2">The Advanced section allows users to customise the data centre configuration to better match their specific scenarios. While default values are provided for each field (displayed on the right side), users can override these by entering their own values in the respective fields.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Data Centre Type</td><td className="px-4 py-2">The data centre type provides two options based on the typical loads for which the data centre is designed: General Purpose, suitable for a wide range of standard applications, and HPC/AI, optimised for high-performance computing and artificial intelligence workloads.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">% of Utilisation</td><td className="px-4 py-2">The percentage of utilisation refers to the actual IT power consumption relative to the maximum IT power capacity that the data center is designed to handle.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Maximum Design IT Load</td><td className="px-4 py-2">The maximum amount of electrical energy consumed by or dedicated to the installed IT equipment.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Data Hall Design Capacity</td><td className="px-4 py-2">The maximum amount of electrical energy consumed by or dedicated to the installed IT equipment is measured in megawatts (MW). This value should range between 0.5 MW and 10 MW.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Planned Number of Years of Operation</td><td className="px-4 py-2">The number of years that the new cooling system is expected to be operational in its planned form.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">First year of operation</td><td className="px-4 py-2">The first year of operation is when the planned data centre or hall will first start operating. An adjustment is added to the electricity price and capex cost in line with future price forecasts.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Expansion (Retrofit Only)</td><td className="px-4 py-2">Expansion is a retrofit scenario where existing space in an existing data centre is used to add new racks.</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">Replacement (Retrofit Only)</td><td className="px-4 py-2">Replacement is a retrofit scenario where existing air-cooled racks are replaced with new Chassis Immersion racks. The Chassis Immersion solution is compared to the alternative of upgrading by replacing the old air-cooled racks with new air-cooled racks. The cost of these upgraded air-cooled racks is assumed to be a percentage of the total new air-cooled capital expenditure (Capex).</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">UK</td><td className="px-4 py-2">Benchmark data of London Heathrow Airport</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">USA</td><td className="px-4 py-2">Benchmark data of Langley Air Force Base, Virginia</td></tr>
                                        <tr className="border-b"><td className="px-4 py-2 font-medium">UAE</td><td className="px-4 py-2">Benchmark data of AZI Airport</td></tr>
                                        <tr><td className="px-4 py-2 font-medium">Singapore</td><td className="px-4 py-2">Benchmark data of Singapore Airport</td></tr>
                                    </tbody>
                                </table>
                            </Card>
                            {/* Advanced/Technical Definitions Table */}
                            <Card className="overflow-x-auto">
                                <h3 className="text-lg font-semibold px-4 pt-4 pb-2">Technical & Advanced Definitions</h3>
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left font-semibold px-4 py-2">Term</th>
                                            <th className="text-left font-semibold px-4 py-2">Definition</th>
                                            <th className="text-left font-semibold px-4 py-2">PLC Assumption</th>
                                            <th className="text-left font-semibold px-4 py-2">Air Assumption</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Greenfield</td>
                                            <td className="px-4 py-2" colSpan={3}>A plan for liquid cooling adoption in undeveloped sites or outside the perimeter of existing data centre halls.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Retrofit</td>
                                            <td className="px-4 py-2" colSpan={3}>A plan for liquid cooling adoption as an addition to and/or as a replacement of air-cooling systems within existing data centre halls.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Waterloop in Current Data Centre? (Retrofit Only)</td>
                                            <td className="px-4 py-2" colSpan={3}>An option to select whether the data centre has an existing enclosed water loop system designed for heat removal from racks that impacts the CAPEX calculations.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Required Increase of Electrical Plant Power (Retrofit Only)</td>
                                            <td className="px-4 py-2" colSpan={3}>Additional Capex for electrical plant upgrade if Retrofit project requires enhanced capacity to support higher power density.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Air Cooling Technology</td>
                                            <td className="px-4 py-2" colSpan={3}>Typical air cooling technology for the location is shown as the default under the field. This default setting can be overridden by selecting an alternative option from the drop-down menu.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Air Cooling Capex per Rack (Including GC Works)</td>
                                            <td className="px-4 py-2" colSpan={3}>Typical Air Cooling Capex per Rack ($/rack) for the selected location and utilisation.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Capex for Air Cooling Upgrade, as Percentage of New Air Cooling Capex (Retrofit Only)</td>
                                            <td className="px-4 py-2" colSpan={3}>Capex for Air Cooling Upgrade refers to the assumed capital expenditure for upgrading air-cooled racks in a retrofit replacement scenario. In this scenario, the Chassis Immersion solution is compared to the alternative of replacing old air-cooled racks with new air-cooled racks. This cost is assumed as a percentage of the total cost of new air-cooled racks.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">KU:L 2</td>
                                            <td className="px-4 py-2" colSpan={3}>KU:L 2 is a sealed liquid-cooled chassis enclosure that simply converts standard air-cooled servers to liquid-cooled servers, with a few minor modifications – like removing the fans.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Purpose Optimised Multinode</td>
                                            <td className="px-4 py-2" colSpan={3}>Purpose Optimised Multinode is Chassis Immersion's fully bespoke chassis-level precision immersion cooling solution for servers.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">KU:L 2 JBOD</td>
                                            <td className="px-4 py-2" colSpan={3}>KU:L 2 for JBOD is an enclosure that converts standard air-cooled JBODs into liquid-cooled JBODs with minor modifications.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Purpose Optimised JBOD</td>
                                            <td className="px-4 py-2" colSpan={3}>This is Chassis Immersion's fully bespoke chassis-level precision immersion cooling solution for JBODs.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Maximum Server Rated Power</td>
                                            <td className="px-4 py-2" colSpan={3}>Maximum power per server refers to the highest electrical power consumption of a server operating at full capacity, including power consumed by internal fans.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Number of Server Refresh Cycles Over Lifetime of Operation</td>
                                            <td className="px-4 py-2" colSpan={3}>The number of times servers are refreshed within your planned number of years of operation.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Typical IT Cost/Server (incl. server, memory & network)</td>
                                            <td className="px-4 py-2" colSpan={3}>Represents the average expenditure for acquiring and setting up a server, including necessary components like memory (RAM) and network interface cards. This value impacts the total Capex cost if included.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Annual IT Maintenance (assumed as % of IT capex)</td>
                                            <td className="px-4 py-2" colSpan={3}>This is the default suggested value for annual IT maintenance. You can adjust it by directly inputting a different number.</td>
                                        </tr>
                                        {/* Section: WUE, Maintenance, Rack Floor, Rack Cooling, JBODs */}
                                        <tr className="border-b bg-muted">
                                            <td className="px-4 py-2 font-semibold">Definition</td>
                                            <td className="px-4 py-2 font-semibold">PLC Assumption</td>
                                            <td className="px-4 py-2 font-semibold">Air Assumption</td>
                                            <td className="px-4 py-2 font-semibold"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">WUE (Water Usage Effectiveness)</td>
                                            <td className="px-4 py-2">The WUE of PLC solution is</td>
                                            <td className="px-4 py-2">The WUE of Air Cooled solution is</td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Annual Maintenance Cost</td>
                                            <td className="px-4 py-2">The annual cooling maintenance cost assumption for PLC is 5% of PLC capex</td>
                                            <td className="px-4 py-2">The annual maintenance cost assumption for Air Cooled is 8% of Air Cooled capex</td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Rack Floor Space Required per Rack</td>
                                            <td className="px-4 py-2">1.77 sqm</td>
                                            <td className="px-4 py-2">2.36 sqm</td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Rack Cooling Capacity</td>
                                            <td className="px-4 py-2">#VALUE!</td>
                                            <td className="px-4 py-2">#VALUE!</td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Number of Disks per Chassis (JBOD only)</td>
                                            <td className="px-4 py-2">Number of disks per chassis in JBOD configuration for PLC is 144 disks</td>
                                            <td className="px-4 py-2">Number of disks per chassis in JBOD configuration for Air Cooled is 138 disks</td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Number of Chassis per Rack (JBOD only)</td>
                                            <td className="px-4 py-2">Number of chassis per rack in JBOD configuration for PLC is 16 chassis</td>
                                            <td className="px-4 py-2">Number of chassis per rack in JBOD configuration for Air Cooled is 10 chassis</td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Power per Disk (JBOD only)</td>
                                            <td className="px-4 py-2">Power per disk in JBOD configuration for PLC is 15 Watt</td>
                                            <td className="px-4 py-2">Power per disk in JBOD configuration for Air Cooled is 15 Watt</td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        {/* Output Section Definitions and Assumptions */}
                                        <tr className="border-b bg-muted">
                                            <td className="px-4 py-2 font-semibold" colSpan={4}>Output Section Definitions and Assumptions</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Greenfield Cooling Equipment Capex (Excl: Land, Core & Shell)</td>
                                            <td className="px-4 py-2">Total capex invested in new cooling technology, including Ground Contractual (GC) Works but excluding Land, Core and Shell, based upon Schneider Electric model benchmark data and Chassis Immersion data.</td>
                                            <td className="px-4 py-2">Total capex invested in new cooling technology, including Ground Contractual (GC) Works but excluding Land, Core and Shell, based upon Schneider Electric model benchmark data and Chassis Immersion data.</td>
                                            <td className="px-4 py-2">Total capex invested in new cooling technology, including Ground Contractual (GC) Works but excluding Land, Core and Shell, based upon Schneider Electric model benchmark data and Chassis Immersion data.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Retrofit Cooling Equipment Capex</td>
                                            <td className="px-4 py-2">Total capex invested for new cooling technology including new piping but excluding Land, Core and Shell, based upon Schneider Electric model benchmark data and Chassis Immersion data.</td>
                                            <td className="px-4 py-2">Total capex invested for new cooling technology including new piping but excluding Land, Core and Shell, based upon Schneider Electric model benchmark data and Chassis Immersion data.</td>
                                            <td className="px-4 py-2">Total capex invested for new cooling technology including new piping but excluding Land, Core and Shell, based upon Schneider Electric model benchmark data and Chassis Immersion data.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">IT Capex</td>
                                            <td className="px-4 py-2">Total Capex for IT costs refers to the overall capital expenditure required for the IT components of the solution in the given scenario.</td>
                                            <td className="px-4 py-2">IT Capex for Chassis Immersion results in a 3% reduction of the inputed cost per rack due to higher density per rack, which leads to economies of scale in switch and network-related costs.</td>
                                            <td className="px-4 py-2">Capex is calculated based on the inputted IT cost per rack, multiplied by total number of racks.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Annual Cooling Opex</td>
                                            <td className="px-4 py-2">Annual Cooling Opex includes the cost of energy required, the cost of water required, and the maintenance expenses for the cooling equipment.</td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Annual IT Maintenance</td>
                                            <td className="px-4 py-2">Annual IT Maintenance refers to the annual expenses incurred for maintaining, repairing, and servicing all IT equipment</td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Total Cost of Ownership (Excl: Land, Core & Shell)</td>
                                            <td className="px-4 py-2">Total Cost of Ownership includes the total capital expenditure (Capex) for cooling equipment and IT, as well as the total operational expenditure (Opex) over the lifetime of operation for both cooling equipment and IT, excluding land and core and shell costs.</td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Total Cost of Ownership (Excl: IT, Land, Core & Shell)</td>
                                            <td className="px-4 py-2">Total Cost of Ownership includes the total capital expenditure (Capex) for cooling equipment, and the total operational expenditure (Opex) over the lifetime of operation for cooling equipment, excluding land and core and shell costs.</td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">ITUE</td>
                                            <td className="px-4 py-2">ITUE is the ratio of the total power consumed by the server to the compute power, excluding any power used for in-server cooling.</td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Computing Consumption</td>
                                            <td className="px-4 py-2">Computing Consumption includes the power consumption of servers, encompassing both IT components and in-server fans or pumps, measured in kilowatts (kW)</td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium">CO2e from Computing and Cooling</td>
                                            <td className="px-4 py-2">CO2e for computing and cooling is calculated based on the CO2e intensity of the local electrical grid, assuming all energy consumed is sourced from the local electricity grid as of 2023. The CO2e intensity assumptions are: UK at 238 CO2e/kWh, USA at 369 CO2e/kWh, Singapore at 471 CO2e/kWh, and UAE at 561 CO2e/kWh. The grid CO2e intensity data is sourced from ourworldindata.org.</td>
                                            <td className="px-4 py-2"></td>
                                            <td className="px-4 py-2"></td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Simplified section</td>
                                            <td className="px-4 py-2" colSpan={3}>The Simplified section allows the Chassis Immersion Sales team to quickly demonstrate example benefits of Chassis Immersion technology to potential customers. Users can obtain valuable results from the Value Calculator with minimal inputs. The section utilises air-cooled cost figures based on widely-accepted benchmark data from a Schneider Electric model and Evaluation QS report. All costs have been updated to reflect current inflation rates.</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Replacement (Retrofit Only)</td>
                                            <td className="px-4 py-2" colSpan={3}>Replacement is a retrofit scenario where existing air-cooled racks are replaced with new Chassis Immersion racks. The Chassis Immersion solution is compared to the alternative of upgrading by replacing the old air-cooled racks with new air-cooled racks. The cost of these upgraded air-cooled racks is assumed to be a percentage of the total new air-cooled capital expenditure (Capex).</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium">Data Hall Design Capacity</td>
                                            <td className="px-4 py-2" colSpan={3}>The maximum amount of electrical energy consumed by or dedicated to the installed IT equipment is measured in megawatts (MW). This value should range between 0.5 MW and 10 MW.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    )}
                    <div className="flex gap-6 mt-4">
                        <Button type="button" className="bg-[#11182A] text-white font-semibold px-10 py-4 text-lg rounded-lg" onClick={() => setState(prev => ({ ...prev, showResultTable: true }))} disabled={!allRequiredFilled}>Show Result</Button>
                        <Button type="button" className="bg-[#11182A] text-white font-semibold px-10 py-4 text-lg rounded-lg" onClick={handleReset}>Reset</Button>
                    </div>
                    {state.showResultTable && (
                        <div id="tco-dashboard-export" className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-16">
                            {/* Demonstrated Value Comparison Table */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-6">Demonstrated Value Comparison</h2>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead></TableHead>
                                                <TableHead>Air Cooled Solution</TableHead>
                                                <TableHead>Chassis Immersion Solution</TableHead>
                                                <TableHead>Potential Saving</TableHead>
                                                <TableHead>Potential Saving (%)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Cooling Equipment Capex (Excl: Land, Core & Shell)</TableCell>
                                                <TableCell className="font-semibold underline">$19,566 k</TableCell>
                                                <TableCell>$18,100 k</TableCell>
                                                <TableCell>$1,466 k</TableCell>
                                                <TableCell>7%</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Total capex</TableCell>
                                                <TableCell className="font-semibold underline">$19,566 k</TableCell>
                                                <TableCell className="font-semibold">$18,100 k</TableCell>
                                                <TableCell>$1,466 k</TableCell>
                                                <TableCell>7%</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Annual Cooling Opex</TableCell>
                                                <TableCell className="font-semibold underline">$4,950 k</TableCell>
                                                <TableCell>$3,151 k</TableCell>
                                                <TableCell>$1,899 k</TableCell>
                                                <TableCell>36%</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Opex for Lifetime of Operation</TableCell>
                                                <TableCell className="font-semibold underline">$50,417 k</TableCell>
                                                <TableCell>$32,077 k</TableCell>
                                                <TableCell>$18,339 k</TableCell>
                                                <TableCell>36%</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Total Cost of Ownership (Excl: IT, Land, Core & Shell)</TableCell>
                                                <TableCell className="font-semibold underline">$69,983 k</TableCell>
                                                <TableCell>$50,178 k</TableCell>
                                                <TableCell>$19,805 k</TableCell>
                                                <TableCell>28%</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            {/* Energy and Other Consumption Comparison Table */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-6">Energy and Other Consumption Comparison</h2>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead></TableHead>
                                                <TableHead>Air Cooled Solution</TableHead>
                                                <TableHead>Chassis Immersion Solution</TableHead>
                                                <TableHead>Potential Saving</TableHead>
                                                <TableHead>Potential Saving (%)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow><TableCell>pPUE</TableCell><TableCell>1.54</TableCell><TableCell>1.13</TableCell><TableCell>0.42</TableCell><TableCell>27%</TableCell></TableRow>
                                            <TableRow><TableCell>ITUE</TableCell><TableCell>1.05</TableCell><TableCell>1.01</TableCell><TableCell>0.04</TableCell><TableCell>4%</TableCell></TableRow>
                                            <TableRow><TableCell>Computing Consumption (servers including fans/pump) (kW)</TableCell><TableCell>2,050</TableCell><TableCell>1,850</TableCell><TableCell>200</TableCell><TableCell>10%</TableCell></TableRow>
                                            <TableRow><TableCell>Energy Required for Cooling (MWh/year)</TableCell><TableCell>9,697</TableCell><TableCell>2,026</TableCell><TableCell>7,672</TableCell><TableCell>79%</TableCell></TableRow>
                                            <TableRow><TableCell>Energy Required for Computing & Cooling (MWh/year)</TableCell><TableCell>27,655</TableCell><TableCell>18,232</TableCell><TableCell>9,424</TableCell><TableCell>34%</TableCell></TableRow>
                                            <TableRow><TableCell>CO2e from Cooling (Tonne/year)</TableCell><TableCell>1,403</TableCell><TableCell>293</TableCell><TableCell>1,110</TableCell><TableCell>79%</TableCell></TableRow>
                                            <TableRow><TableCell>CO2e from Computing & Cooling (Tonne/year)</TableCell><TableCell>4,002</TableCell><TableCell>2,638</TableCell><TableCell>1,364</TableCell><TableCell>34%</TableCell></TableRow>
                                            <TableRow><TableCell>Water Usage (Litre/year)</TableCell><TableCell>8,655,756</TableCell><TableCell>1,199,244</TableCell><TableCell>7,456,512</TableCell><TableCell>86%</TableCell></TableRow>
                                            <TableRow><TableCell>Floor Space Required (sq m)</TableCell><TableCell>1,475</TableCell><TableCell>554</TableCell><TableCell>921</TableCell><TableCell>62%</TableCell></TableRow>
                                            <TableRow><TableCell>N of Servers</TableCell><TableCell>5,000</TableCell><TableCell>5,000</TableCell><TableCell>-</TableCell><TableCell>0%</TableCell></TableRow>
                                            <TableRow><TableCell>N of Racks</TableCell><TableCell>625</TableCell><TableCell>313</TableCell><TableCell>312</TableCell><TableCell>50%</TableCell></TableRow>
                                            <TableRow><TableCell>Data Hall Design Capacity (kW)</TableCell><TableCell>5,000</TableCell><TableCell>5,000</TableCell><TableCell>-</TableCell><TableCell>0%</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            {/* Data Centre Deployment Total Cost of Ownership 10 years (Excluding Land and Core&Shell) */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-6">Data Centre Deployment Total Cost of Ownership 10 years (Excluding Land and Core&Shell)</h2>
                                <Tabs defaultValue="opex" className="w-full">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="opex">Yearly OPEX Breakdown</TabsTrigger>
                                        <TabsTrigger value="capex-opex">CAPEX vs OPEX Contribution</TabsTrigger>
                                        <TabsTrigger value="cumulative">Cumulative Cost Comparison</TabsTrigger>
                                        <TabsTrigger value="payback">Payback Period</TabsTrigger>
                                        <TabsTrigger value="co2">CO₂ Emissions Comparison</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="opex">
                                        <div className="w-full h-96 bg-white rounded-lg shadow p-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={[
                                                    { year: 'Year 1', energy: 3500, cooling: 1200, maintenance: 650 },
                                                    { year: 'Year 2', energy: 3600, cooling: 1250, maintenance: 670 },
                                                    { year: 'Year 3', energy: 3700, cooling: 1300, maintenance: 690 },
                                                    { year: 'Year 4', energy: 3800, cooling: 1350, maintenance: 710 },
                                                    { year: 'Year 5', energy: 3900, cooling: 1400, maintenance: 730 },
                                                    { year: 'Year 6', energy: 4000, cooling: 1450, maintenance: 750 },
                                                    { year: 'Year 7', energy: 4100, cooling: 1500, maintenance: 770 },
                                                    { year: 'Year 8', energy: 4200, cooling: 1550, maintenance: 790 },
                                                    { year: 'Year 9', energy: 4300, cooling: 1600, maintenance: 810 },
                                                    { year: 'Year 10', energy: 4400, cooling: 1650, maintenance: 830 },
                                                ]}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" />
                                                    <YAxis />
                                                    <RechartsTooltip />
                                                    <Legend />
                                                    <Bar dataKey="energy" stackId="a" fill="#3b82f6" name="Energy" />
                                                    <Bar dataKey="cooling" stackId="a" fill="#38bdf8" name="Cooling" />
                                                    <Bar dataKey="maintenance" stackId="a" fill="#f59e42" name="Maintenance" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="capex-opex">
                                        <div className="w-full h-96 bg-white rounded-lg shadow p-4 flex items-center justify-center">
                                            <ResponsiveContainer width="60%" height="100%">
                                                <PieChart>
                                                    <Pie data={[
                                                        { name: 'CAPEX', value: 40000 },
                                                        { name: 'OPEX', value: 60000 },
                                                    ]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#3b82f6" label>
                                                        <Cell key="capex" fill="#3b82f6" />
                                                        <Cell key="opex" fill="#f59e42" />
                                                    </Pie>
                                                    <Legend />
                                                    <RechartsTooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="cumulative">
                                        <div className="w-full h-96 bg-white rounded-lg shadow p-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={[
                                                    { year: 'Year 1', ac: 24000, plc: 21000 },
                                                    { year: 'Year 2', ac: 65000, plc: 50000 },
                                                    { year: 'Year 3', ac: 29000, plc: 25000 },
                                                    { year: 'Year 4', ac: 50000, plc: 37000 },
                                                    { year: 'Year 5', ac: 33000, plc: 28000 },
                                                    { year: 'Year 6', ac: 55000, plc: 41000 },
                                                    { year: 'Year 7', ac: 44000, plc: 34000 },
                                                    { year: 'Year 8', ac: 70000, plc: 54000 },
                                                    { year: 'Year 9', ac: 60000, plc: 46000 },
                                                    { year: 'Year 10', ac: 40000, plc: 31000 },
                                                ]}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" />
                                                    <YAxis />
                                                    <RechartsTooltip />
                                                    <Legend />
                                                    <Area type="monotone" dataKey="ac" name="Air Cooled" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                                    <Area type="monotone" dataKey="plc" name="Chassis Immersion" stroke="#f59e42" fill="#f59e42" fillOpacity={0.2} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="payback">
                                        <div className="w-full h-96 bg-white rounded-lg shadow p-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={[
                                                    { year: 'Year 1', ac: 24000, plc: 21000, diff: 3000 },
                                                    { year: 'Year 2', ac: 29000, plc: 25000, diff: 4000 },
                                                    { year: 'Year 3', ac: 33000, plc: 28000, diff: 5000 },
                                                    { year: 'Year 4', ac: 40000, plc: 31000, diff: 9000 },
                                                    { year: 'Year 5', ac: 44000, plc: 34000, diff: 10000 },
                                                    { year: 'Year 6', ac: 50000, plc: 37000, diff: 13000 },
                                                    { year: 'Year 7', ac: 55000, plc: 41000, diff: 14000 },
                                                    { year: 'Year 8', ac: 60000, plc: 46000, diff: 14000 },
                                                    { year: 'Year 9', ac: 65000, plc: 50000, diff: 15000 },
                                                    { year: 'Year 10', ac: 70000, plc: 54000, diff: 16000 },
                                                ]}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" />
                                                    <YAxis />
                                                    <RechartsTooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="ac" name="Air Cooled" stroke="#3b82f6" strokeWidth={2} />
                                                    <Line type="monotone" dataKey="plc" name="Chassis Immersion" stroke="#f59e42" strokeWidth={2} />
                                                    <Line type="monotone" dataKey="diff" name="Cost Difference" stroke="#22c55e" strokeDasharray="5 5" strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="co2">
                                        <div className="w-full h-96 bg-white rounded-lg shadow p-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={[
                                                    { year: 'Year 1', ac: 1400, plc: 900 },
                                                    { year: 'Year 2', ac: 1450, plc: 950 },
                                                    { year: 'Year 3', ac: 1500, plc: 1000 },
                                                    { year: 'Year 4', ac: 1550, plc: 1050 },
                                                    { year: 'Year 5', ac: 1600, plc: 1100 },
                                                    { year: 'Year 6', ac: 1650, plc: 1150 },
                                                    { year: 'Year 7', ac: 1700, plc: 1200 },
                                                    { year: 'Year 8', ac: 1750, plc: 1250 },
                                                    { year: 'Year 9', ac: 1800, plc: 1300 },
                                                    { year: 'Year 10', ac: 1850, plc: 1350 },
                                                ]}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" />
                                                    <YAxis />
                                                    <RechartsTooltip />
                                                    <Legend />
                                                    <Bar dataKey="ac" name="Air Cooled" fill="#3b82f6" />
                                                    <Bar dataKey="plc" name="Chassis Immersion" fill="#f59e42" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                <div className="mt-6">
                                    <Button type="button" onClick={handleExportPDF}>
                                        <Download className="mr-2" /> Export as PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
