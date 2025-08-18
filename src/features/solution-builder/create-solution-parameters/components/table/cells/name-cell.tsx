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
				{isUnused ? (
					<svg className="h-3 w-3 ml-1" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" fill="#ef4444" />
					</svg>
				) : (
					<svg className="h-3 w-3 ml-1" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="10" fill="#22c55e" />
					</svg>
				)}
				<span className="font-medium text-xs">
					{highlightSearchTerm(parameter.name, searchQuery)}
				</span>
			</div>
		),
		"parameterName",
		isExpanded
	);
}
