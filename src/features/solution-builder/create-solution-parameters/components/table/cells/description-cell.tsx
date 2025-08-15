import { DescriptionCellProps } from "./types";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function DescriptionCell({
	columnVisibility,
	isExpanded,
	isEditing,
	editData,
	setEditData,
	highlightSearchTerm,
	searchQuery,
	parameter,
	renderCell,
	isPriority,
}: DescriptionCellProps) {
	return renderCell(
		columnVisibility.description,
		isEditing ? (
			<Input
				value={editData.description}
				onChange={(e) =>
					setEditData((prev) => ({
						...prev,
						description: e.target.value,
					}))
				}
				className={`h-7 text-xs ${isPriority ? "bg-gray-100 cursor-not-allowed" : ""}`}
				placeholder="Description"
				disabled={isPriority}
			/>
		) : (
			<div className="flex items-center gap-2">
				<span className="text-xs text-muted-foreground max-w-xs truncate">
					{highlightSearchTerm(parameter.description, searchQuery)}
				</span>
				<Tooltip>
					<TooltipTrigger asChild>
						<Info className="h-3 w-3 text-muted-foreground cursor-help" onClick={(e) => e.stopPropagation()} />
					</TooltipTrigger>
					<TooltipContent className="max-w-xs">
						<p className="text-sm">{parameter.description}</p>
					</TooltipContent>
				</Tooltip>
			</div>
		),
		"description",
		isExpanded
	);
} 