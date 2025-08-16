"use client";

import { TableBody as UITableBody } from "@/components/ui/table";
import { ParameterRow } from "./parameter-row";
import type { ParameterTableBodyProps } from "@/features/solution-builder/types/types";
import type { Parameter } from "@/types/types";

export function TableBody({ filteredParameters, ...rowProps }: ParameterTableBodyProps) {
	if (!filteredParameters?.length) return <UITableBody />;
	return (
		<UITableBody>
			{filteredParameters.map((parameter: any) => (
				<ParameterRow key={parameter.id} parameter={parameter as Parameter} {...(rowProps as any)} />
			))}
		</UITableBody>
	);
} 