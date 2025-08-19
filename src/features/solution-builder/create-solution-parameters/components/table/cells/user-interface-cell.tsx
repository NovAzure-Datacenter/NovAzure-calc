import { UserInterfaceCellProps } from "./types";
import { Badge } from "@/components/ui/badge";

export function UserInterfaceCell({
	columnVisibility,
	isExpanded,
	isEditing,
	editData,
	setEditData,
	highlightSearchTerm,
	searchQuery,
	parameter,
	renderCell,
	getUserInterfaceBadgeStyle,
}: UserInterfaceCellProps) {

	return renderCell(
		columnVisibility.userInterface,
		isEditing ? (
			<div className="space-y-2">
				{/* Headers row */}
				<div className="flex justify-between text-xs">
					<div className="text-center font-medium text-gray-600 flex-1">
						Type
					</div>
					<div className="text-center font-medium text-gray-600 flex-1">
						Modifiable
					</div>
					<div className="text-center font-medium text-gray-600 flex-1">
						Unified
					</div>
					<div className="text-center font-medium text-gray-600 flex-1">
						Output
					</div>
				</div>

				{/* Content row - Interactive */}
				<div className="flex justify-between text-xs">
					{/* First column: Simple/Advanced toggle */}
					<div className="flex justify-center flex-1">
						<button
							onClick={() =>
								setEditData((prev) => ({
									...prev,
									user_interface: {
										...prev.user_interface,
										is_advanced: !prev.user_interface?.is_advanced,
									},
								}))
							}
							className="px-3 py-1 text-xs rounded-md border transition-colors cursor-pointer hover:bg-gray-50"
							style={{
								backgroundColor: editData.user_interface?.is_advanced
									? "#fef3c7"
									: "#f0f9ff",
								color: editData.user_interface?.is_advanced
									? "#92400e"
									: "#1e40af",
								borderColor: editData.user_interface?.is_advanced
									? "#f59e0b"
									: "#3b82f6",
							}}
						>
							{editData.user_interface?.is_advanced ? "Advanced" : "Simple"}
						</button>
					</div>

					{/* Second column: Modifiable checkbox - editable since it's part of editData */}
					<div className="flex justify-center flex-1">
						<input
							type="checkbox"
							checked={editData.is_modifiable || false}
							onChange={(e) =>
								setEditData((prev) => ({
									...prev,
									is_modifiable: e.target.checked,
								}))
							}
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
						/>
					</div>

					{/* Third column: Unified checkbox */}
					<div className="flex justify-center flex-1">
						<input
							type="checkbox"
							checked={editData.is_unified || false}
							onChange={(e) =>
								setEditData((prev) => ({
									...prev,
									is_unified: e.target.checked,
								}))
							}
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
						/>
					</div>

					{/* Fourth column: Output checkbox */}
					<div className="flex justify-center flex-1">
						<input
							type="checkbox"
							checked={editData.output || false}
							onChange={(e) =>
								setEditData((prev) => ({
									...prev,
									output: e.target.checked,
								}))
							}
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
						/>
					</div>
				</div>
			</div>
		) : (
			<div className="space-y-2">
				{/* Headers row */}
				<div className="flex justify-between text-xs">
					<div className="text-center font-medium text-gray-600 flex-1">
						Type
					</div>
					<div className="text-center font-medium text-gray-600 flex-1">
						Modifiable
					</div>
					<div className="text-center font-medium text-gray-600 flex-1">
						Unified
					</div>
					<div className="text-center font-medium text-gray-600 flex-1">
						Output
					</div>
				</div>

				{/* Content row */}
				<div className="flex justify-between text-xs">
					{/* First column: Simple/Advanced badge */}
					<div className="flex justify-center flex-1">
						<Badge
							variant="outline"
							className="text-xs"
							style={{
								backgroundColor: parameter.user_interface?.is_advanced
									? "#fef3c7"
									: "#f0f9ff",
								color: parameter.user_interface?.is_advanced
									? "#92400e"
									: "#1e40af",
								borderColor: parameter.user_interface?.is_advanced
									? "#f59e0b"
									: "#3b82f6",
							}}
						>
							{parameter.user_interface?.is_advanced ? "Advanced" : "Simple"}
						</Badge>
					</div>

					{/* Second column: Modifiable checkbox */}
					<div className="flex justify-center flex-1">
						<input
							type="checkbox"
							checked={parameter.is_modifiable || false}
							readOnly
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						/>
					</div>

					{/* Third column: Unified checkbox */}
					<div className="flex justify-center flex-1">
						<input
							type="checkbox"
							checked={parameter.is_unified || false}
							readOnly
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						/>
					</div>

					{/* Fourth column: Output checkbox */}
					<div className="flex justify-center flex-1">
						<input
							type="checkbox"
							checked={parameter.output || false}
							readOnly
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						/>
					</div>
				</div>
			</div>
		),
		"userInterface",
		isExpanded
	);
}
