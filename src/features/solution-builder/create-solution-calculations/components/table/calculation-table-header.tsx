import {
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { CalculationsTableHeaderProps } from "../../../types/types";

/**
 * CalculationsTableHeader component - Renders the table header with column definitions and tooltips
 */
export function CalculationsTableHeader({
	calculateColumnWidths,
}: CalculationsTableHeaderProps) {
	const headerColumns = [
		{
			key: "level",
			label: "Level",
			hasTooltip: true,
			tooltip: {
				title: "The calculation dependency level",
				content:
					"• Level 1: Static parameters (Company/User/Global)\n• Level 2+: Calculations that depend on other calculations\n• Higher levels depend on lower level calculations",
			},
		},
		{ key: "name", label: "Name", hasTooltip: false },
		{ key: "category", label: "Category", hasTooltip: false },
		{
			key: "formula",
			label: "Formula",
			hasTooltip: true,
			tooltip: {
				title: "Mathematical expression using parameters and operators",
				content:
					"• Use parameter names as variables\n• Supports +, -, *, /, **, ( )\n• Real-time validation and preview",
			},
		},
		{ key: "description", label: "Description", hasTooltip: false },
		{
			key: "mockResult",
			label: "Mock Result",
			hasTooltip: true,
			tooltip: {
				title: "Calculated result using current parameter values",
				content:
					"• Valid: Formula evaluates successfully\n• Error: Formula has syntax issues\n• Pending: Waiting for evaluation",
			},
		},
		{ key: "unit", label: "Unit", hasTooltip: false },
		{
			key: "displayResult",
			label: "Is display Result",
			hasTooltip: true,
			tooltip: {
				title:
					"Whether this calculation result is displayed in the results view",
				content:
					"• Yes: Result is shown in calculation results\n• No: Result is hidden from display",
			},
		},
		{
			key: "output",
			label: "Output",
			hasTooltip: true,
			tooltip: {
				title: "Whether this calculation is included in final results",
				content:
					"• Yes: Shows in value calculator\n• No: Internal calculation only",
			},
		},
		{ key: "actions", label: "Actions", hasTooltip: false },
	];

	const columnWidths = calculateColumnWidths();

	return (
		<TableHeader className="sticky top-0 bg-gray-50 z-10">
			<TableRow>
				{headerColumns.map(({ key, label, hasTooltip, tooltip }) => {
					const width = columnWidths[key];

					return (
						<TableHead
							key={key}
							className="bg-gray-50 px-2 text-xs font-medium border-r border-gray-200 last:border-r-0 overflow-hidden text-center"
							style={{
								width: width ? `${width}px` : "auto",
								minWidth: width ? `${width}px` : "auto",
								maxWidth: width ? `${width}px` : "none",
							}}
						>
							{hasTooltip && tooltip ? (
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="flex items-center gap-1 cursor-help justify-center">
											<span className="truncate">{label}</span>
											<Info className="h-3 w-3 text-muted-foreground flex-shrink-0" />
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-sm">{tooltip.title}</p>
										<p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
											{tooltip.content}
										</p>
									</TooltipContent>
								</Tooltip>
							) : (
								<span className="truncate text-center">{label}</span>
							)}
						</TableHead>
					);
				})}
			</TableRow>
		</TableHeader>
	);
} 