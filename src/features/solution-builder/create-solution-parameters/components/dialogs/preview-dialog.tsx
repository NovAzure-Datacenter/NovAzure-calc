import { Dialog, DialogTitle, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Parameter } from "@/types/types";
import { SolutionConfigurationSection, ParametersSection } from "./preview-sections";

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
	const userParameters = parameters.filter(param => 
		param.user_interface.type === "input" || param.user_interface.type === "static"
	);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="w-screen max-w-none max-h-[90vh] overflow-hidden flex flex-col" style={{ width: '70vw', maxWidth: 'none' }}>
				<DialogHeader className="pb-6 flex-shrink-0">
					<DialogTitle className="text-xl font-semibold text-gray-900">Value Calculator Preview</DialogTitle>
				</DialogHeader>
				
				<div className="flex-1 overflow-y-auto pr-2 space-y-6">
					<SolutionConfigurationSection
						selectedIndustry={selectedIndustry}
						selectedTechnology={selectedTechnology}
						selectedSolutionId={selectedSolutionId}
						availableIndustries={availableIndustries}
						availableTechnologies={availableTechnologies}
						availableSolutionTypes={availableSolutionTypes}
					/>

					<ParametersSection
						title="User Inputs Configuration"
						parameters={userParameters}
						isAdvanced={false}
						emptyMessage="No basic parameters to display"
					/>

					<ParametersSection
						title="Advanced Inputs Configuration"
						parameters={userParameters}
						isAdvanced={true}
						emptyMessage="No advanced parameters to display"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}