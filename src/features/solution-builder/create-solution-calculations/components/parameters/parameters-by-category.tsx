import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ParametersByCategoryProps } from "../../../types/types";
import { ParameterButton } from "./parameter-button";

/**
 * ParametersByCategory component - Renders parameters organized by category
 */
export function ParametersByCategory({
	groupedParameters,
	insertIntoFormula,
	className,
}: ParametersByCategoryProps) {
	return (
		<div className={className}>
			<div className="text-sm font-medium mb-3 text-blue-900">
				Available Parameters:
			</div>
			<Accordion type="multiple" className="space-y-2 max-h-60 overflow-y-auto">
				{Object.entries(groupedParameters)
					.sort(([a], [b]) => {
						// Put "Calculations" first, then sort others alphabetically
						if (a === "Calculations") return -1;
						if (b === "Calculations") return 1;
						return a.localeCompare(b);
					})
					.map(([category, params]) => (
						<AccordionItem
							key={category}
							value={category}
							className="border rounded-md"
						>
							<AccordionTrigger className="p-2 text-left hover:bg-muted/50 transition-colors bg-white">
								<span className="text-xs font-medium capitalize text-muted-foreground">
									{category} ({params.length})
								</span>
							</AccordionTrigger>
							<AccordionContent className="p-2 border-t bg-muted/20">
								<div className="flex flex-wrap gap-2">
									{(params as any[]).map((param: any) => (
										<ParameterButton
											key={param.id}
											param={param}
											insertIntoFormula={insertIntoFormula}
										/>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
			</Accordion>
		</div>
	);
} 