"use client";

import { Table } from "@/components/ui/table";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";
import type {
	ColumnVisibility,
	ParameterTableBodyProps,
} from "@/features/solution-builder/types/types";

export interface ParameterTableProps extends ParameterTableBodyProps {
	columnVisibility: ColumnVisibility;
	setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
}

export function ParameterTable(props: ParameterTableProps) {
	const { columnVisibility } = props;

	return (
		<Table>
			<TableHeader
				columnVisibility={columnVisibility}
				setColumnVisibility={props.setColumnVisibility}
			/>
			<TableBody {...props} />
		</Table>
	);
}
