"use client";

import { TableBody as UITableBody } from "@/components/ui/table";
import { ParameterRow } from "./parameter-row";
import type { ParameterTableBodyProps } from "@/features/solution-builder/types/types";
import type { Parameter } from "@/types/types";

export function TableBody({ filteredParameters, usedParameterIds = [], ...rowProps }: ParameterTableBodyProps) {
	if (!filteredParameters?.length) return <UITableBody />;
	return (
		<UITableBody>
			{filteredParameters.map((parameter: any) => {
				const isUnused = !usedParameterIds.includes(parameter.id);
				return (
					<ParameterRow 
						key={parameter.id} 
						parameter={parameter as Parameter} 
						isUnused={isUnused}
						{...(rowProps as any)} 
					/>
				);
			})}
		</UITableBody>
	);
} 