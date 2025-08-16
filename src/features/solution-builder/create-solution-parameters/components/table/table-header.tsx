"use client";

import { TableHeader as UITableHeader, TableRow, TableHead } from "@/components/ui/table";
import type { ColumnVisibility, ColumnFilterProps } from "@/features/solution-builder/types/types";
import { ColumnFilter } from "./column-filter";

export interface ParameterTableHeaderProps extends ColumnFilterProps {
	columnVisibility: ColumnVisibility;
}

export function TableHeader({ columnVisibility, setColumnVisibility }: ParameterTableHeaderProps) {
	return (
		<UITableHeader>
			<TableRow>
				{columnVisibility.parameterName && <TableHead>Name</TableHead>}
				{columnVisibility.category && <TableHead>Category</TableHead>}
				{columnVisibility.displayType && <TableHead>Display</TableHead>}
				{columnVisibility.value && <TableHead>Value</TableHead>}
				{columnVisibility.testValue && <TableHead>Test</TableHead>}
				{columnVisibility.unit && <TableHead>Unit</TableHead>}
				{columnVisibility.description && <TableHead>Description</TableHead>}
				{columnVisibility.userInterface && <TableHead>UI</TableHead>}
				{columnVisibility.output && <TableHead>Output</TableHead>}
				{columnVisibility.actions && (
					<TableHead className="text-right">
						<ColumnFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
					</TableHead>
				)}
			</TableRow>
		</UITableHeader>
	);
} 