import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Cpu, Package } from "lucide-react";

interface SolutionConfigurationSectionProps {
	selectedIndustry?: string;
	selectedTechnology?: string;
	selectedSolutionId?: string;
	availableIndustries?: any[];
	availableTechnologies?: any[];
	availableSolutionTypes?: any[];
}

export function SolutionConfigurationSection({
	selectedIndustry,
	selectedTechnology,
	selectedSolutionId,
	availableIndustries = [],
	availableTechnologies = [],
	availableSolutionTypes = []
}: SolutionConfigurationSectionProps) {
	const getSelectedIndustry = () => availableIndustries.find(i => i.id === selectedIndustry);
	const getSelectedTechnology = () => availableTechnologies.find(t => t.id === selectedTechnology);
	const getSelectedSolutionCategory = () => availableSolutionTypes.find(s => s.id === selectedSolutionId);

	return (
		<Card className="w-full border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
			<CardHeader className="pb-4 pt-6 px-6">
				<CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
					<Building2 className="h-5 w-5 text-gray-600" />
					Solution Configuration
				</CardTitle>
			</CardHeader>
			<CardContent className="px-6 pb-6">
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
	);
} 