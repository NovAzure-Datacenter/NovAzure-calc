"use client";

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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function TCOCalculator() {
    // 1. Define the initial state object
    const initialState = {
        dataCentreType: "none",
        utilisation: "none",
        yearsOfOperation: "",
        projectLocation: "none",
        dataHallCapacity: "",
        firstYear: "none",
        airCoolingPUE: "",
        liquidCoolingPUE: "",
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
        state.dataCentreType !== "none" &&
        state.utilisation !== "none" &&
        !!state.yearsOfOperation &&
        state.projectLocation !== "none" &&
        !!state.dataHallCapacity &&
        !!state.airCoolingPUE;

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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Chassis Immersion Vs. Air Cooling Solutions</h1>
                        <p className="text-muted-foreground">
                            Please ensure ALL entries are filled out before clicking show result
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button 
                                variant="outline" 
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <Info className="w-4 h-4" />
                                Definitions & Assumptions
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold">Definitions & Assumptions</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                                <Card className="overflow-x-auto border-none shadow-none">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left font-semibold px-4 py-2">Term</th>
                                                <th className="text-left font-semibold px-4 py-2">Definition</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b"><td className="px-4 py-2 font-medium">Data Centre Type</td><td className="px-4 py-2">Specifies the data center's primary workload, either General Purpose or HPC/AI, which influences cost and design benchmarks.</td></tr>
                                            <tr className="border-b"><td className="px-4 py-2 font-medium">% of Utilisation</td><td className="px-4 py-2">The actual IT power consumption as a percentage of the maximum designed IT power capacity.</td></tr>
                                            <tr className="border-b"><td className="px-4 py-2 font-medium">Planned Number of Years of Operation</td><td className="px-4 py-2">The expected operational lifespan of the cooling system, used for calculating lifetime costs.</td></tr>
                                            <tr className="border-b"><td className="px-4 py-2 font-medium">Project Location</td><td className="px-4 py-2">The country where the data center is located, which influences climate-based cooling costs and other regional benchmarks.</td></tr>
                                            <tr className="border-b"><td className="px-4 py-2 font-medium">Data Hall Design Capacity MW</td><td className="px-4 py-2">The maximum electrical power (in megawatts) that the installed IT equipment is designed to consume.</td></tr>
                                            <tr className="border-b"><td className="px-4 py-2 font-medium">First Year of Operation</td><td className="px-4 py-2">The year when the data center will begin operating, which adjusts costs for future price forecasts.</td></tr>
                                            <tr className="border-b"><td className="px-4 py-2 font-medium">Annualised Air pPUE</td><td className="px-4 py-2">Annualised partial Power Usage Effectiveness for the air cooling solution. It measures the ratio of total facility power to IT equipment power.</td></tr>
                                            <tr><td className="px-4 py-2 font-medium">Annualised Liquid Cooled pPUE</td><td className="px-4 py-2">Annualised partial Power Usage Effectiveness for the Chassis Immersion liquid cooling solution, which is generally more efficient than air cooling.</td></tr>
                                        </tbody>
                                    </table>
                                </Card>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid gap-6">
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
                                    <p className="text-sm text-muted-foreground italic">
                                        An asterisk * denotes that the field is required to view results
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col items-center mt-12 gap-6">
                    <div className="flex gap-6 mt-4">
                        <Button type="button" className="bg-[#11182A] text-white font-semibold px-10 py-4 text-lg rounded-lg" onClick={() => setState(prev => ({ ...prev, showResultTable: true }))} disabled={!allRequiredFilled}>Show Result</Button>
                        <Button type="button" className="bg-[#11182A] text-white font-semibold px-10 py-4 text-lg rounded-lg" onClick={handleReset}>Reset</Button>
                    </div>
                    {state.showResultTable && (
                        <div id="tco-dashboard-export" className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-16">
                            {/* Demonstrated Value Comparison Table */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-6 text-center">Demonstrated Value Comparison</h2>
                                <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
                                    <div className="min-w-[800px]">
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow className="bg-gray-100 border-b border-gray-300">
                                                    <TableHead className="text-left font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">Metric</TableHead>
                                                    <TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">Air Cooled Solution</TableHead>
                                                    <TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">Chassis Immersion Solution</TableHead>
                                                    <TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">Potential Saving</TableHead>
                                                    <TableHead className="text-center font-semibold text-gray-900 py-3 px-4">Potential Saving (%)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Cooling Equipment Capex (Excl: Land, Core & Shell)</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$19,566 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$18,100 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$1,466 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">7%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Total capex</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$19,566 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$18,100 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$1,466 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">7%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Annual Cooling Opex</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$4,950 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$3,151 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$1,899 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">36%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Opex for Lifetime of Operation</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$50,417 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$32,077 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">$18,339 k</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">36%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 bg-gray-100 border-t-2 border-gray-400">
                                                    <TableCell className="font-bold text-gray-900 py-4 px-4 border-r border-gray-200 text-base">Total Cost of Ownership (Excl: IT, Land, Core & Shell)</TableCell>
                                                    <TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">$69,983 k</TableCell>
                                                    <TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">$50,178 k</TableCell>
                                                    <TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">$19,805 k</TableCell>
                                                    <TableCell className="font-bold text-center py-4 px-4 text-base">28%</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                            {/* Energy and Other Consumption Comparison Table */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-6 text-center">Energy and Other Consumption Comparison</h2>
                                <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
                                    <div className="min-w-[800px]">
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow className="bg-gray-100 border-b border-gray-300">
                                                    <TableHead className="text-left font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">Metric</TableHead>
                                                    <TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">Air Cooled Solution</TableHead>
                                                    <TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">Chassis Immersion Solution</TableHead>
                                                    <TableHead className="text-center font-semibold text-gray-900 py-3 px-4 border-r border-gray-300">Potential Saving</TableHead>
                                                    <TableHead className="text-center font-semibold text-gray-900 py-3 px-4">Potential Saving (%)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">pPUE</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">1.54</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">1.13</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">0.42</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">27%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">ITUE</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">1.05</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">1.01</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">0.04</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">4%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Computing Consumption (servers including fans/pump) (kW)</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">2,050</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">1,850</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">200</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">10%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Energy Required for Cooling (MWh/year)</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">9,697</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">2,026</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">7,672</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">79%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Energy Required for Computing & Cooling (MWh/year)</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">27,655</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">18,232</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">9,424</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">34%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">CO2e from Cooling (Tonne/year)</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">1,403</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">293</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">1,110</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">79%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">CO2e from Computing & Cooling (Tonne/year)</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">4,002</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">2,638</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">1,364</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">34%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Water Usage (Litre/year)</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">8,655,756</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">1,199,244</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">7,456,512</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">86%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">Floor Space Required (sq m)</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">1,475</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">554</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">921</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">62%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200 bg-gray-50">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">N of Servers</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">5,000</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">5,000</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">-</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">0%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                                                    <TableCell className="font-medium text-gray-800 py-3 px-4 border-r border-gray-200">N of Racks</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">625</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4 border-r border-gray-200">313</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">312</TableCell>
                                                    <TableCell className="font-semibold text-center py-3 px-4">50%</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-gray-50 bg-gray-100 border-t-2 border-gray-400">
                                                    <TableCell className="font-bold text-gray-900 py-4 px-4 border-r border-gray-200 text-base">Data Hall Design Capacity (kW)</TableCell>
                                                    <TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">5,000</TableCell>
                                                    <TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">5,000</TableCell>
                                                    <TableCell className="font-bold text-center py-4 px-4 border-r border-gray-200 text-base">-</TableCell>
                                                    <TableCell className="font-bold text-center py-4 px-4 text-base">0%</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
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
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                                    <XAxis dataKey="year" stroke="#111" tick={{ fill: '#444' }} />
                                                    <YAxis stroke="#111" tick={{ fill: '#444' }} />
                                                    <RechartsTooltip contentStyle={{ background: '#fff', border: '1px solid #d1d5db', color: '#111' }} labelStyle={{ color: '#111' }} itemStyle={{ color: '#444' }} />
                                                    <Legend wrapperStyle={{ color: '#222' }} />
                                                    <Bar dataKey="energy" stackId="a" fill="#222" name="Energy" />
                                                    <Bar dataKey="cooling" stackId="a" fill="#888" name="Cooling" />
                                                    <Bar dataKey="maintenance" stackId="a" fill="#bbb" name="Maintenance" />
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
                                                    ]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#222" label>
                                                        <Cell key="capex" fill="#222" />
                                                        <Cell key="opex" fill="#888" />
                                                    </Pie>
                                                    <Legend wrapperStyle={{ color: '#222' }} />
                                                    <RechartsTooltip contentStyle={{ background: '#fff', border: '1px solid #d1d5db', color: '#111' }} labelStyle={{ color: '#111' }} itemStyle={{ color: '#444' }} />
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
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                                    <XAxis dataKey="year" stroke="#111" tick={{ fill: '#444' }} />
                                                    <YAxis stroke="#111" tick={{ fill: '#444' }} />
                                                    <RechartsTooltip contentStyle={{ background: '#fff', border: '1px solid #d1d5db', color: '#111' }} labelStyle={{ color: '#111' }} itemStyle={{ color: '#444' }} />
                                                    <Legend wrapperStyle={{ color: '#222' }} />
                                                    <Area type="monotone" dataKey="ac" name="Air Cooled" stroke="#222" fill="#222" fillOpacity={0.15} />
                                                    <Area type="monotone" dataKey="plc" name="Chassis Immersion" stroke="#888" fill="#888" fillOpacity={0.15} />
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
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                                    <XAxis dataKey="year" stroke="#111" tick={{ fill: '#444' }} />
                                                    <YAxis stroke="#111" tick={{ fill: '#444' }} />
                                                    <RechartsTooltip contentStyle={{ background: '#fff', border: '1px solid #d1d5db', color: '#111' }} labelStyle={{ color: '#111' }} itemStyle={{ color: '#444' }} />
                                                    <Legend wrapperStyle={{ color: '#222' }} />
                                                    <Line type="monotone" dataKey="ac" name="Air Cooled" stroke="#222" strokeWidth={2} />
                                                    <Line type="monotone" dataKey="plc" name="Chassis Immersion" stroke="#888" strokeWidth={2} />
                                                    <Line type="monotone" dataKey="diff" name="Cost Difference" stroke="#bbb" strokeDasharray="5 5" strokeWidth={2} />
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
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                                    <XAxis dataKey="year" stroke="#111" tick={{ fill: '#444' }} />
                                                    <YAxis stroke="#111" tick={{ fill: '#444' }} />
                                                    <RechartsTooltip contentStyle={{ background: '#fff', border: '1px solid #d1d5db', color: '#111' }} labelStyle={{ color: '#111' }} itemStyle={{ color: '#444' }} />
                                                    <Legend wrapperStyle={{ color: '#222' }} />
                                                    <Bar dataKey="ac" name="Air Cooled" fill="#222" />
                                                    <Bar dataKey="plc" name="Chassis Immersion" fill="#888" />
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

export default TCOCalculator;