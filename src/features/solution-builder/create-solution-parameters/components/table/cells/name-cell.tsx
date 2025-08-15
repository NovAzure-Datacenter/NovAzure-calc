import { NameCellProps } from "./types";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Circle } from "lucide-react";
import { toast } from "sonner";

export function NameCell({
	columnVisibility,
	isExpanded,
	isEditing,
	editData,
	setEditData,
	highlightSearchTerm,
	searchQuery,
	isUnused,
	parameter,
	renderCell,
	handleKeyDown,
}: NameCellProps) {
	return renderCell(
		columnVisibility.parameterName,
		isEditing ? (
			<Input
				value={editData.name}
				onChange={(e) => {
					const originalValue = e.target.value;
					const filteredValue = originalValue.replace(/[()+=\-*/]/g, "");

					if (originalValue !== filteredValue) {
						toast.error("Characters ()+-*/ are not allowed in parameter names");
					}

					setEditData((prev) => ({
						...prev,
						name: filteredValue,
					}));
				}}
				className={"h-7 text-xs"}
				placeholder="Parameter name"
				onKeyDown={handleKeyDown}
			/>
		) : (
			<div className="flex items-center gap-2">
				<span className="font-medium text-xs">
					{highlightSearchTerm(parameter.name, searchQuery)}
				</span>
				{isUnused && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Circle className="h-3 w-3 text-muted-foreground ml-1" onClick={(e) => e.stopPropagation()} />
							</TooltipTrigger>
							<TooltipContent>
								<p>This parameter is not currently used in any solution</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		),
		"parameterName",
		isExpanded
	);
}
