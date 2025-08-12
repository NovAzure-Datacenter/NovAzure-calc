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
	const userParameters = parameters.filter(param => param.user_interface === "input");
	
	// Get selected items for display
	const getSelectedIndustry = () => availableIndustries.find(i => i.id === selectedIndustry);
	const getSelectedTechnology = () => availableTechnologies.find(t => t.id === selectedTechnology);
	const getSelectedSolutionCategory = () => availableSolutionTypes.find(s => s.id === selectedSolutionId);
	
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[80vh] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Value Calculator Preview</DialogTitle>
				</DialogHeader>
				
				{/* Solution Configuration Card */}
				<Card className="w-full mb-6">
					<CardHeader>
						<CardTitle className="text-lg">Solution Configuration</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Horizontal Dropdown Layout */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Industry Selection */}
							<div className="space-y-3">
								<Label className="text-sm font-medium flex items-center gap-2">
									<Building2 className="h-4 w-4" />
									Industry
								</Label>
								<Select value={selectedIndustry} disabled>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select an industry" />
									</SelectTrigger>
									<SelectContent>
										{availableIndustries.map((industry) => (
											<SelectItem key={industry.id} value={industry.id}>
												<div className="flex items-center gap-2">
													<Building2 className="h-4 w-4" />
													{industry.name}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{getSelectedIndustry() && (
									<div className="text-xs text-muted-foreground">
										{getSelectedIndustry()?.description}
									</div>
								)}
							</div>

							{/* Technology Selection */}
							<div className="space-y-3">
								<Label className="text-sm font-medium flex items-center gap-2">
									<Cpu className="h-4 w-4" />
									Technology
								</Label>
								<Select value={selectedTechnology} disabled>
									<SelectTrigger className="w-full">
										<SelectValue placeholder={selectedIndustry ? "Select a technology" : "Select an industry first"} />
									</SelectTrigger>
									<SelectContent>
										{availableTechnologies.map((technology) => (
											<SelectItem key={technology.id} value={technology.id}>
												<div className="flex items-center gap-2">
													<Cpu className="h-4 w-4" />
													{technology.name}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{getSelectedTechnology() && (
									<div className="text-xs text-muted-foreground">
										{getSelectedTechnology()?.description}
									</div>
								)}
							</div>

							{/* Solution Selection */}
							<div className="space-y-3">
								<Label className="text-sm font-medium flex items-center gap-2">
									<Package className="h-4 w-4" />
									Solution
								</Label>
								<Select value={selectedSolutionId} disabled>
									<SelectTrigger className="w-full">
										<SelectValue placeholder={selectedTechnology ? "Select a solution" : "Select a technology first"} />
									</SelectTrigger>
									<SelectContent>
										{availableSolutionTypes.map((solution) => (
											<SelectItem key={solution.id} value={solution.id}>
												<div className="flex items-center gap-2">
													<Package className="h-4 w-4" />
													{solution.name}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{getSelectedSolutionCategory() && (
									<div className="text-xs text-muted-foreground">
										{getSelectedSolutionCategory()?.description}
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Parameters Card */}
                <Card className="w-full">
					<CardHeader>
						<CardTitle className="text-lg">High Level Configuration</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
							{userParameters.map((parameter) => (
								<div key={parameter.id} className="space-y-3">
									<div className="flex items-center gap-2">
										<Label className="text-sm font-medium">{parameter.name}</Label>
										{parameter.information && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Badge variant="outline" className="h-5 px-1.5 text-xs cursor-help">
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
										{parameter.display_type === "dropdown" ? (
											<div className="space-y-2">
												<Label className="text-xs text-muted-foreground">Select {parameter.name}:</Label>
												<Select>
													<SelectTrigger className="w-full">
														<SelectValue placeholder={`Select an option for ${parameter.name}`} />
													</SelectTrigger>
													<SelectContent>
														{parameter.dropdown_options && parameter.dropdown_options.map((option, index) => (
															<SelectItem key={index} value={option.key}>
																{option.key}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										) : parameter.display_type === "range" ? (
											<div className="space-y-2">
												<Label className="text-xs text-muted-foreground">
													{parameter.description || `Enter ${parameter.name}`}
												</Label>
												<input 
													type="number" 
													className="w-full p-2 border rounded-md text-sm"
													placeholder={`Enter value between ${parameter.range_min || '0'} and ${parameter.range_max || '∞'}`}
													min={parameter.range_min}
													max={parameter.range_max}
													step="any"
												/>
												{parameter.range_min && parameter.range_max && (
													<div className="text-xs text-muted-foreground">
														Range: {parameter.range_min} - {parameter.range_max}
													</div>
												)}
											</div>
										) : (
											<div className="space-y-2">
												<Label className="text-xs text-muted-foreground">
													{parameter.description || `Enter ${parameter.name}`}
												
												</Label>
												<input 
													type="number" 
													className="w-full p-2 border rounded-md text-sm"
													placeholder={`Enter ${parameter.name}`}
												/>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
						
						{userParameters.length === 0 && (
							<div className="text-center py-8 text-muted-foreground">
								<p>No parameters to display</p>
							</div>
						)}
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	);
}