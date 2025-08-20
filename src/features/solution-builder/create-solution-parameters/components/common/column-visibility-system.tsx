import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ColumnFilterProps,
	ColumnVisibility,
} from "@/features/solution-builder/types/types";
import { ChevronDown } from "lucide-react";

export default function ColumnVisibilitySystem({
	columnVisibility,
	setColumnVisibility,
}: ColumnFilterProps) {
	const options: Array<{ key: keyof ColumnVisibility; label: string }> = [
		{ key: "parameterName", label: "Parameter Name" },
		{ key: "category", label: "Category" },
		{ key: "displayType", label: "Display Type" },
		{ key: "value", label: "Value" },
		{ key: "testValue", label: "Test Value" },
		{ key: "unit", label: "Unit" },
		{ key: "description", label: "Description" },
		{ key: "userInterface", label: "User Interface" },
		{ key: "output", label: "Output" },
		{ key: "actions", label: "Actions" },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button size="sm" className="text-xs" variant="outline">
					Columns
					<ChevronDown className="ml-1 h-3 w-3" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-[200px]">
				{options.map(({ key, label }) => (
					<DropdownMenuCheckboxItem
						key={key}
						checked={columnVisibility[key]}
						onCheckedChange={(checked) =>
							setColumnVisibility((prev) => ({
								...prev,
								[key]: Boolean(checked),
							}))
						}
					>
						{label}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
