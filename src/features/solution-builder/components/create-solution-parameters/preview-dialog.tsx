import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Parameter } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Building2, Cpu, Package, Info } from "lucide-react";

interface PreviewDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	parameters: Parameter[];
	selectedIndustry?: string;
	selectedTechnology?: string;
	selectedSolutionId?: string;
	availableIndustries?: any[];
	availableTechnologies?: any[];
	availableSolutionTypes?: any[];
}

export default function PreviewDialog({ 
	isOpen, 
	onOpenChange, 
	parameters,
	selectedIndustry,
	selectedTechnology,
	selectedSolutionId,
	availableIndustries = [],
	availableTechnologies = [],
	availableSolutionTypes = []
}: PreviewDialogProps) {
	
	// Filter parameters that are provided by user
	const userParameters = parameters.filter(param => param.user_interface.type === "input" || param.user_interface.type === "static");
	
	// Get selected items for display
	const getSelectedIndustry = () => availableIndustries.find(i => i.id === selectedIndustry);
	const getSelectedTechnology = () => availableTechnologies.find(t => t.id === selectedTechnology);
	const getSelectedSolutionCategory = () => availableSolutionTypes.find(s => s.id === selectedSolutionId);
	

	console.log(parameters)
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="w-screen max-w-none max-h-[90vh] overflow-hidden flex flex-col" style={{ width: '70vw', maxWidth: 'none' }}>
				<DialogHeader className="pb-6 flex-shrink-0">
					<DialogTitle className="text-xl font-semibold text-gray-900">Value Calculator Preview</DialogTitle>
				</DialogHeader>
				
				<div className="flex-1 overflow-y-auto pr-2 space-y-6">
					{/* Solution Configuration Card */}
					<Card className="w-full border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
						<CardHeader className="pb-4 pt-6 px-6">
							<CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
								<Building2 className="h-5 w-5 text-gray-600" />
								Solution Configuration
							</CardTitle>
						</CardHeader>
						<CardContent className="px-6 pb-6">
							{/* Horizontal Dropdown Layout */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Industry Selection */}
								<div className="space-y-3">
									<Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
										<Building2 className="h-4 w-4 text-gray-500" />
										Industry
									</Label>
									<Select value={selectedIndustry} disabled>
										<SelectTrigger className="w-full h-10 border-gray-300 bg-gray-50 text-gray-900">
											<SelectValue placeholder="Select an industry" />
										</SelectTrigger>
										<SelectContent>
											{availableIndustries.map((industry) => (
												<SelectItem key={industry.id} value={industry.id}>
													<div className="flex items-center gap-2">
														<Building2 className="h-4 w-4 text-gray-500" />
														{industry.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{getSelectedIndustry() && (
										<div className="text-xs text-gray-500 leading-relaxed">
											{getSelectedIndustry()?.description}
										</div>
									)}
								</div>

								{/* Technology Selection */}
								<div className="space-y-3">
									<Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
										<Cpu className="h-4 w-4 text-gray-500" />
										Technology
									</Label>
									<Select value={selectedTechnology} disabled>
										<SelectTrigger className="w-full h-10 border-gray-300 bg-gray-50 text-gray-900">
											<SelectValue placeholder={selectedIndustry ? "Select a technology" : "Select an industry first"} />
										</SelectTrigger>
										<SelectContent>
											{availableTechnologies.map((technology) => (
												<SelectItem key={technology.id} value={technology.id}>
													<div className="flex items-center gap-2">
														<Cpu className="h-4 w-4 text-gray-500" />
														{technology.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{getSelectedTechnology() && (
										<div className="text-xs text-gray-500 leading-relaxed">
											{getSelectedTechnology()?.description}
										</div>
									)}
								</div>

								{/* Solution Selection */}
								<div className="space-y-3">
									<Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
										<Package className="h-4 w-4 text-gray-500" />
										Solution
									</Label>
									<Select value={selectedSolutionId} disabled>
										<SelectTrigger className="w-full h-10 border-gray-300 bg-gray-50 text-gray-900">
											<SelectValue placeholder={selectedTechnology ? "Select a solution" : "Select a technology first"} />
										</SelectTrigger>
										<SelectContent>
											{availableSolutionTypes.map((solution) => (
												<SelectItem key={solution.id} value={solution.id}>
													<div className="flex items-center gap-2">
														<Package className="h-4 w-4 text-gray-500" />
														{solution.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{getSelectedSolutionCategory() && (
										<div className="text-xs text-gray-500 leading-relaxed">
											{getSelectedSolutionCategory()?.description}
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Inputs Configuration Card */}
					<Card className="w-full border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
						<CardHeader className="pb-4 pt-6 px-6">
							<CardTitle className="text-lg font-medium text-gray-900">User Inputs Configuration</CardTitle>
						</CardHeader>
						<CardContent className="px-6 pb-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
								{userParameters
									.filter(param => !param.user_interface.is_advanced)
									.map((parameter) => (
									<div key={parameter.id} className="space-y-3">
										<div className="flex items-center gap-2">
											<Label className="text-sm font-medium text-gray-700">{parameter.name}</Label>
											{parameter.information && (
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Badge variant="outline" className="h-5 px-2 text-xs cursor-help border-gray-300 text-gray-600 hover:bg-gray-50">
																<Info className="h-3 w-3" />
															</Badge>
														</TooltipTrigger>
														<TooltipContent className="max-w-xs">
															<p className="text-sm">{parameter.information}</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											)}
										</div>
										<div className="space-y-2">
											{parameter.user_interface.type === "static" ? (
												<div className="space-y-2">
													<Label className="text-xs text-gray-500">
														{parameter.description || parameter.name}
													</Label>
													<div className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 select-none pointer-events-none">
														{parameter.test_value || "No value set"}
													</div>
												</div>
											) : parameter.display_type === "dropdown" || parameter.display_type === "filter" ? (
												<div className="space-y-2">
													<Label className="text-xs text-gray-500">Select {parameter.name}:</Label>
													<Select>
														<SelectTrigger className="w-full h-10 border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-gray-500">
															<SelectValue placeholder={`Select an option for ${parameter.name}`} />
														</SelectTrigger>
														<SelectContent>
															{parameter.dropdown_options && parameter.dropdown_options.map((option, index) => (
																<SelectItem key={index} value={option.value || option.key || `option-${index}`}>
																	{option.value || option.key || `Option ${index + 1}`}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											) : parameter.display_type === "range" ? (
												<div className="space-y-2">
													<Label className="text-xs text-gray-500">
														{parameter.description || `Enter ${parameter.name}`}
													</Label>
													<input 
														type="number" 
														className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
														placeholder={`Enter value between ${parameter.range_min || '0'} and ${parameter.range_max || '∞'}`}
														min={parameter.range_min}
														max={parameter.range_max}
														step="any"
														onKeyDown={(e) => {
															// Prevent typing if the value would exceed min/max
															const input = e.target as HTMLInputElement;
															const value = input.value;
															const key = e.key;
															
															// Allow navigation keys
															if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
																return;
															}
															
															// Allow decimal point only once
															if (key === '.' && !value.includes('.')) {
																return;
															}
															
															// Allow only numbers
															if (!/^\d$/.test(key)) {
																e.preventDefault();
																return;
															}
															
															// Check if adding this digit would exceed max
															const newValue = value + key;
															if (parameter.range_max !== undefined && parseFloat(newValue) > parseFloat(parameter.range_max.toString())) {
																e.preventDefault();
															}
														}}
														onBlur={(e) => {
															// Enforce min/max on blur
															const input = e.target as HTMLInputElement;
															const value = parseFloat(input.value);
															
															if (parameter.range_min !== undefined && value < parseFloat(parameter.range_min.toString())) {
																input.value = parameter.range_min.toString();
															} else if (parameter.range_max !== undefined && value > parseFloat(parameter.range_max.toString())) {
																input.value = parameter.range_max.toString();
															}
														}}
													/>
													{parameter.range_min && parameter.range_max && (
														<div className="text-xs text-gray-500">
															Range: {parameter.range_min} - {parameter.range_max}
														</div>
													)}
												</div>
											) : parameter.display_type === "simple" ? (
												<div className="space-y-2">
													<Label className="text-xs text-gray-500">
														{parameter.description || `Enter ${parameter.name}`}
													</Label>
													<input 
														type="text" 
														className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
														placeholder={`Enter ${parameter.name}`}
													/>
												</div>
											) : (
												<div className="space-y-2">
													<Label className="text-xs text-gray-500">
														{parameter.description || `Enter ${parameter.name}`}
													</Label>
													<input 
														type="number" 
														className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
														placeholder={`Enter ${parameter.name}`}
													/>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
							
							{userParameters.filter(param => !param.user_interface.is_advanced).length === 0 && (
								<div className="text-center py-8 text-gray-500">
									<p>No basic parameters to display</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Advanced Inputs Configuration Card */}
					{userParameters.some(param => param.user_interface.is_advanced) && (
						<Card className="w-full border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
							<CardHeader className="pb-4 pt-6 px-6">
								<CardTitle className="text-lg font-medium text-gray-900">Advanced Inputs Configuration</CardTitle>
							</CardHeader>
							<CardContent className="px-6 pb-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
									{userParameters
										.filter(param => param.user_interface.is_advanced)
										.map((parameter) => (
										<div key={parameter.id} className="space-y-3">
											<div className="flex items-center gap-2">
												<Label className="text-sm font-medium text-gray-700">{parameter.name}</Label>
												{parameter.information && (
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<Badge variant="outline" className="h-5 px-2 text-xs cursor-help border-gray-300 text-gray-600 hover:bg-gray-50">
																	<Info className="h-3 w-3" />
																</Badge>
															</TooltipTrigger>
															<TooltipContent className="max-w-xs">
																<p className="text-sm">{parameter.information}</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												)}
											</div>
											<div className="space-y-2">
												{parameter.user_interface.type === "static" ? (
													<div className="space-y-2">
														<Label className="text-xs text-gray-500">
															{parameter.description || parameter.name}
														</Label>
														<div className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 select-none pointer-events-none">
															{parameter.test_value || "No value set"}
														</div>
													</div>
												) : parameter.display_type === "dropdown" || parameter.display_type === "filter" ? (
													<div className="space-y-2">
														<Label className="text-xs text-gray-500">Select {parameter.name}:</Label>
														<Select>
															<SelectTrigger className="w-full h-10 border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-gray-500">
																<SelectValue placeholder={`Select an option for ${parameter.name}`} />
															</SelectTrigger>
															<SelectContent>
																{parameter.dropdown_options && parameter.dropdown_options.map((option, index) => (
																	<SelectItem key={index} value={option.value || option.key || `option-${index}`}>
																		{option.value || option.key || `Option ${index + 1}`}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</div>
												) : parameter.display_type === "range" ? (
													<div className="space-y-2">
														<Label className="text-xs text-gray-500">
															{parameter.description || `Enter ${parameter.name}`}
														</Label>
														<input 
															type="number" 
															className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
															placeholder={`Enter value between ${parameter.range_min || '0'} and ${parameter.range_max || '∞'}`}
															min={parameter.range_min}
															max={parameter.range_max}
															step="any"
															onKeyDown={(e) => {
																// Prevent typing if the value would exceed min/max
																const input = e.target as HTMLInputElement;
																const value = input.value;
																const key = e.key;
																
																// Allow navigation keys
																if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
																return;
																}
																
																// Allow decimal point only once
																if (key === '.' && !value.includes('.')) {
																return;
																}
																
																// Allow only numbers
																if (!/^\d$/.test(key)) {
																e.preventDefault();
																return;
																}
																
																// Check if adding this digit would exceed max
																const newValue = value + key;
																if (parameter.range_max !== undefined && parseFloat(newValue) > parseFloat(parameter.range_max.toString())) {
																e.preventDefault();
																}
															}}
															onBlur={(e) => {
																// Enforce min/max on blur
																const input = e.target as HTMLInputElement;
																const value = parseFloat(input.value);
																
																if (parameter.range_min !== undefined && value < parseFloat(parameter.range_min.toString())) {
																input.value = parameter.range_min.toString();
																} else if (parameter.range_max !== undefined && value > parseFloat(parameter.range_max.toString())) {
																input.value = parameter.range_max.toString();
																}
															}}
														/>
														{parameter.range_min && parameter.range_max && (
															<div className="text-xs text-gray-500">
																Range: {parameter.range_min} - {parameter.range_max}
															</div>
														)}
													</div>
												) : parameter.display_type === "simple" ? (
													<div className="space-y-2">
														<Label className="text-xs text-gray-500">
															{parameter.description || `Enter ${parameter.name}`}
														</Label>
														<input 
															type="text" 
															className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
															placeholder={`Enter ${parameter.name}`}
														/>
													</div>
												) : (
													<div className="space-y-2">
														<Label className="text-xs text-gray-500">
															{parameter.description || `Enter ${parameter.name}`}
														</Label>
														<input 
															type="number" 
															className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
															placeholder={`Enter ${parameter.name}`}
														/>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
								
								{userParameters.filter(param => param.user_interface.is_advanced).length === 0 && (
									<div className="text-center py-8 text-gray-500">
										<p>No advanced parameters to display</p>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}