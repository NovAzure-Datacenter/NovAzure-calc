import React, { useEffect, useRef, useState } from "react";
import { ParameterTable } from "./components/table";
import { TableCell } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
	TableContentProps,
	ColumnVisibility,
} from "@/features/solution-builder/types/types";
import {
	getCategoryBadgeStyle,
	getCategoryBadgeStyleForDropdown,
} from "@/utils/color-utils";
import {
	getDisplayTypeBadgeStyle,
	getUserInterfaceBadgeStyle,
} from "@/components/table-components/parameter-types";

export default function TableContent(props: TableContentProps) {
	const {
		filteredParameters,
		editingParameter,
		editData,
		setEditData,
		handleEditParameter,
		handleSaveParameter,
		handleCancelEdit,
		handleDeleteParameter,
		isAddingParameter,
		newParameterData,
		setNewParameterData,
		handleSaveNewParameter,
		handleCancelAddParameter,
		handleAddParameter,
		customCategories,
		searchQuery,
		parameters,
		activeTab,
		columnVisibility,
		setColumnVisibility,
		usedParameterIds = [],
		categories
	} = props;

	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [tableWidth, setTableWidth] = useState<number>(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateTableWidth = () => {
			if (containerRef.current) setTableWidth(containerRef.current.offsetWidth);
		};
		updateTableWidth();
		window.addEventListener("resize", updateTableWidth);
		return () => window.removeEventListener("resize", updateTableWidth);
	}, []);

	const effectiveColumnVisibility: ColumnVisibility = {
		...columnVisibility,
	};

	function calculateColumnWidths() {
		const visibleColumns = Object.entries(effectiveColumnVisibility)
			.filter(([_, isVisible]) => isVisible)
			.map(([key]) => key);

		const columnConfig = {
			parameterName: { minWidth: 120, maxWidth: 200, priority: 3 },
			category: { minWidth: 80, maxWidth: 120, priority: 2 },
			displayType: { minWidth: 90, maxWidth: 140, priority: 2 },
			value: { minWidth: 80, maxWidth: 150, priority: 2 },
			testValue: { minWidth: 70, maxWidth: 100, priority: 1 },
			unit: { minWidth: 50, maxWidth: 80, priority: 1 },
			description: { minWidth: 120, maxWidth: 100, priority: 4 },
			userInterface: { minWidth: 150, maxWidth: 300, priority: 2 },
			// output: { minWidth: 60, maxWidth: 80, priority: 1 },
			actions: { minWidth: 80, maxWidth: 100, priority: 1 },
		} as const;

		const totalMinWidth = visibleColumns.reduce((total, column) => {
			const cfg = (columnConfig as any)[column];
			return total + (cfg?.minWidth || 80);
		}, 0);

		const availableWidth = Math.max(tableWidth - 32, totalMinWidth);
		const totalPriority = visibleColumns.reduce((t, c) => {
			const cfg = (columnConfig as any)[c];
			return t + (cfg?.priority || 1);
		}, 0);
		const extraSpace = availableWidth - totalMinWidth;
		const priorityWeight = totalPriority ? extraSpace / totalPriority : 0;

		const columnWidths: Record<string, number> = {};
		visibleColumns.forEach((column) => {
			const cfg = (columnConfig as any)[column];
			const minWidth = cfg?.minWidth || 80;
			const maxWidth = cfg?.maxWidth || 200;
			const priority = cfg?.priority || 1;
			const calculated = Math.min(
				maxWidth,
				minWidth + priorityWeight * priority
			);
			columnWidths[column] = Math.max(minWidth, calculated);
		});
		return columnWidths;
	}

	function renderCell(
		isVisible: boolean,
		children: React.ReactNode,
		columnKey?: string,
		isExpanded?: boolean
	) {
		if (!isVisible) return null;
		const columnWidths = calculateColumnWidths();
		const width = columnKey ? columnWidths[columnKey] : undefined;
		const centeredColumns = [
			"category",
			"displayType",
			"value",
			"testValue",
			"unit",
			"userInterface",
			"output",
			"actions",
		];
		const isCentered = columnKey && centeredColumns.includes(columnKey);
		return (
			<TableCell
				className={`py-1 px-2 text-xs border-r border-gray-200 last:border-r-0 overflow-hidden ${
					isCentered ? "text-center" : ""
				}`}
				style={{
					width: width ? `${width}px` : "auto",
					minWidth: width ? `${width}px` : "auto",
					maxWidth: width ? `${width}px` : "none",
				}}
			>
				<div
					className={`overflow-hidden ${isCentered ? "text-center" : ""} ${
						isExpanded ? "" : "truncate"
					}`}
					style={{ width: "100%" }}
				>
					{children}
				</div>
			</TableCell>
		);
	}

	function toggleRowExpansion(parameterId: string) {
		setExpandedRows((prev) => {
			const next = new Set(prev);
			if (next.has(parameterId)) {
				next.delete(parameterId);
			} else {
				next.add(parameterId);
			}
			return next;
		});
	}

	function highlightSearchTerm(text: string, term: string) {
		if (!term.trim()) return text;
		const regex = new RegExp(`(${term})`, "gi");
		const parts = text.split(regex);
		return parts.map((part, idx) =>
			regex.test(part) ? (
				<mark
					key={idx}
					className="bg-yellow-200 text-yellow-900 px-0.5 rounded"
				>
					{part}
				</mark>
			) : (
				part
			)
		);
	}

	// function getAllAvailableCategories() {
	// 	const systemManaged = ["Global", "Industry", "Technology", "Technologies"];
	// 	const existing = Array.from(
	// 		new Set(parameters.map((p) => p.category.name))
	// 	).filter((c) => !systemManaged.includes(c));
	// 	const existingObjects = existing.map((c) => {
	// 		const param = parameters.find((p) => p.category.name === c);
	// 		return { name: c, color: param?.category.color || "gray" };
	// 	});
	// 	return [...existingObjects, ...customCategories];
	// }

	function getCategoryBadgeStyleWrapper(categoryName: string) {
		return getCategoryBadgeStyle(categoryName, parameters, customCategories);
	}
	function getCategoryBadgeStyleForDropdownWrapper(categoryName: string) {
		return getCategoryBadgeStyleForDropdown(
			categoryName,
			parameters,
			customCategories
		);
	}

	return (
		<div className="border rounded-lg" ref={containerRef}>
			<div className="max-h-[55vh] overflow-y-auto overflow-x-auto relative">
				<TooltipProvider>
					<div className="min-w-full">
						<ParameterTable
							filteredParameters={filteredParameters}
							editingParameter={editingParameter}
							editData={editData}
							setEditData={setEditData}
							handleEditParameter={handleEditParameter}
							handleSaveParameter={handleSaveParameter}
							handleCancelEdit={handleCancelEdit}
							handleDeleteParameter={handleDeleteParameter}
							isAddingParameter={isAddingParameter}
							newParameterData={newParameterData}
							setNewParameterData={setNewParameterData}
							handleSaveNewParameter={handleSaveNewParameter}
							handleCancelAddParameter={handleCancelAddParameter}
							categories={categories}
							// getAllAvailableCategories={getAllAvailableCategories}
							getCategoryBadgeStyleForDropdownWrapper={
								getCategoryBadgeStyleForDropdownWrapper
							}
							getUserInterfaceBadgeStyle={getUserInterfaceBadgeStyle}
							highlightSearchTerm={highlightSearchTerm}
							searchQuery={searchQuery}
							getCategoryBadgeStyleWrapper={getCategoryBadgeStyleWrapper}
							activeTab={activeTab}
							handleAddParameter={handleAddParameter}
							getDisplayTypeBadgeStyle={getDisplayTypeBadgeStyle}
							columnVisibility={effectiveColumnVisibility}
							setColumnVisibility={setColumnVisibility}
							renderCell={renderCell}
							expandedRows={expandedRows}
							toggleRowExpansion={toggleRowExpansion}
							usedParameterIds={usedParameterIds}
						/>
					</div>
				</TooltipProvider>
			</div>
		</div>
	);
}
