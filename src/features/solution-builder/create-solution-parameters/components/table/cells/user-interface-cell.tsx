import { UserInterfaceCellProps } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getUserInterfaceDisplayText } from "../../../services/parameters";

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
			<div className="space-y-1">
				<Select
					value={editData.user_interface?.type || "input"}
					onValueChange={(value) =>
						setEditData((prev) => ({
							...prev,
							user_interface: {
								type: value as "input" | "static" | "not_viewable",
								category: "Global",
								is_advanced: editData.user_interface?.is_advanced || false,
							},
						}))
					}
				>
					<SelectTrigger className="h-7 text-xs">
						<SelectValue>
							<span
								style={{
									color: getUserInterfaceBadgeStyle(
										editData.user_interface?.type || "input"
									).color,
								}}
							>
								{getUserInterfaceDisplayText(editData.user_interface)}
							</span>
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="input">Input</SelectItem>
						<SelectItem value="static">Static</SelectItem>
						<SelectItem value="not_viewable">Not Viewable</SelectItem>
					</SelectContent>
				</Select>
				{editData.user_interface?.type === "input" && (
					<Select
						value={editData.user_interface?.is_advanced ? "true" : "false"}
						onValueChange={(value) =>
							setEditData((prev) => ({
								...prev,
								user_interface: {
									...prev.user_interface,
									is_advanced: value === "true",
								},
							}))
						}
					>
						<SelectTrigger className="h-6 text-xs">
							<SelectValue>
								{editData.user_interface?.is_advanced ? "Advanced" : "Simple"}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="false">Simple</SelectItem>
							<SelectItem value="true">Advanced</SelectItem>
						</SelectContent>
					</Select>
				)}
			</div>
		) : (
			<div className="space-y-1">
				<Badge
					variant="outline"
					style={getUserInterfaceBadgeStyle(
						typeof parameter.user_interface === "string"
							? parameter.user_interface
							: parameter.user_interface?.type || "input"
					)}
				>
					{highlightSearchTerm(
						getUserInterfaceDisplayText(parameter.user_interface),
						searchQuery
					)}
				</Badge>
				{typeof parameter.user_interface === "object" &&
					parameter.user_interface?.type === "input" && (
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
					)}
			</div>
		),
		"userInterface",
		isExpanded
	);
} 