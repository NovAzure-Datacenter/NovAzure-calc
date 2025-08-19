import { ParameterRowProps } from "@/features/solution-builder/types/types";
import { TableRow } from "@/components/ui/table";
import { NameCell } from "./cells/name-cell";
import { CategoryCell } from "./cells/category-cell";
import { DisplayTypeCell } from "./cells/display-type-cell";
import { ValueCell } from "./cells/value-cell";
import { TestValueCell } from "./cells/test-value-cell";
import { UnitCell } from "./cells/unit-cell";
import { DescriptionCell } from "./cells/description-cell";
import { UserInterfaceCell } from "./cells/user-interface-cell";
import { OutputCell } from "./cells/output-cell";
import { ActionsCell } from "./cells/actions-cell";
export function ParameterRow(props: ParameterRowProps) {
    const { parameter, isEditing, editData, setEditData, handleEditParameter, handleSaveParameter, handleCancelEdit, handleDeleteParameter, highlightSearchTerm, searchQuery, getCategoryBadgeStyleWrapper, getCategoryBadgeStyleForDropdownWrapper, getUserInterfaceBadgeStyle, getDisplayTypeBadgeStyle, getAllAvailableCategories, columnVisibility, editingParameter, isAddingParameter, renderCell, expandedRows, toggleRowExpansion, usedParameterIds, parameters } = props;
    
    // Calculate if parameter is unused
    const isUnused = usedParameterIds ? !usedParameterIds.includes(parameter.id) : false;
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSaveParameter(parameter.id);
		} else if (e.key === "Escape") {
			handleCancelEdit();
		}
	};

	// Check if this is a priority parameter (Global/Required)
	const category = parameter.category.name.toLowerCase();
	const isPriority = category === "global" || category === "required";

	const isSaveDisabled = () => {
		return (
			!editData.name.trim() ||
			!editData.unit.trim() ||
			!editData.category.trim() ||
			(editData.user_interface?.type === "static" &&
				((editData.display_type === "simple" && !editData.value.trim()) ||
					(editData.display_type === "range" &&
						(!editData.range_min.trim() || !editData.range_max.trim())) ||
					(editData.display_type === "dropdown" &&
						editData.dropdown_options.length === 0) ||
					(editData.display_type === "filter" &&
						editData.dropdown_options.length === 0)))
		);
	};

	const isExpanded = expandedRows.has(parameter.id);

	return (
		<TableRow
			className={`transition-all duration-200 cursor-pointer ${
				isEditing ? "bg-blue-50 border-2 border-blue-200 shadow-md" : ""
			} ${
				(editingParameter && !isEditing) || isAddingParameter
					? "opacity-40 pointer-events-none"
					: ""
			}`}
			style={{
				height: isExpanded ? "auto" : "32px",
				minHeight: "32px",
			}}
			onClick={() => !isEditing && toggleRowExpansion(parameter.id)}
		>
			<NameCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				highlightSearchTerm={highlightSearchTerm}
				searchQuery={searchQuery}
				isUnused={isUnused}
				parameter={parameter}
				renderCell={renderCell}
				handleKeyDown={handleKeyDown}
			/>
			<CategoryCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				highlightSearchTerm={highlightSearchTerm}
				searchQuery={searchQuery}
				parameter={parameter}
				renderCell={renderCell}
				getAllAvailableCategories={getAllAvailableCategories}
				getCategoryBadgeStyleWrapper={getCategoryBadgeStyleWrapper}
				getCategoryBadgeStyleForDropdownWrapper={getCategoryBadgeStyleForDropdownWrapper}
				isPriority={isPriority}
			/>
			<DisplayTypeCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				highlightSearchTerm={highlightSearchTerm}
				searchQuery={searchQuery}
				parameter={parameter}
				renderCell={renderCell}
				getDisplayTypeBadgeStyle={getDisplayTypeBadgeStyle}
				isPriority={isPriority}
			/>
			<ValueCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				highlightSearchTerm={highlightSearchTerm}
				searchQuery={searchQuery}
				parameter={parameter}
				renderCell={renderCell}
				parameters={parameters}
				handleSaveParameter={handleSaveParameter}
				handleCancelEdit={handleCancelEdit}
			/>

			<TestValueCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				highlightSearchTerm={highlightSearchTerm}
				searchQuery={searchQuery}
				parameter={parameter}
				renderCell={renderCell}
				isPriority={isPriority}
				handleKeyDown={handleKeyDown}
			/>
			<UnitCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				highlightSearchTerm={highlightSearchTerm}
				searchQuery={searchQuery}
				parameter={parameter}
				renderCell={renderCell}
				isPriority={isPriority}
			/>

			<DescriptionCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				highlightSearchTerm={highlightSearchTerm}
				searchQuery={searchQuery}
				parameter={parameter}
				renderCell={renderCell}
				isPriority={isPriority}
			/>

			<UserInterfaceCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				highlightSearchTerm={highlightSearchTerm}
				searchQuery={searchQuery}
				parameter={parameter}
				renderCell={renderCell}
				getUserInterfaceBadgeStyle={getUserInterfaceBadgeStyle}
			/>
			<OutputCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				editData={editData}
				setEditData={setEditData}
				parameter={parameter}
				renderCell={renderCell}
			/>
			<ActionsCell
				columnVisibility={columnVisibility}
				isExpanded={isExpanded}
				isEditing={isEditing}
				parameter={parameter}
				renderCell={renderCell}
				handleEditParameter={handleEditParameter}
				handleDeleteParameter={handleDeleteParameter}
				handleSaveParameter={handleSaveParameter}
				handleCancelEdit={handleCancelEdit}
				editingParameter={editingParameter}
				isAddingParameter={isAddingParameter}
				isSaveDisabled={isSaveDisabled}
			/>
		</TableRow>
	);
}