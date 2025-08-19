import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Parameter } from "@/types/types";
import { ParameterField } from "../preview-fields/parameter-field";

interface ParametersSectionProps {
	title: string;
	parameters: Parameter[];
	isAdvanced?: boolean;
	emptyMessage?: string;
}

export function ParametersSection({ 
	title, 
	parameters, 
	isAdvanced = false, 
	emptyMessage 
}: ParametersSectionProps) {
	const filteredParameters = parameters.filter(param => 
		param.user_interface.is_advanced === isAdvanced
	);

	if (filteredParameters.length === 0 && !isAdvanced) {
		return null;
	}

	return (
		<Card className="w-full border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
			<CardHeader className="pb-4 pt-6 px-6">
				<CardTitle className="text-lg font-medium text-gray-900">{title}</CardTitle>
			</CardHeader>
			<CardContent className="px-6 pb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
					{filteredParameters.map((parameter) => (
						<ParameterField key={parameter.id} parameter={parameter} />
					))}
				</div>
				
				{filteredParameters.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						<p>{emptyMessage || `No ${isAdvanced ? 'advanced' : 'basic'} parameters to display`}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
} 