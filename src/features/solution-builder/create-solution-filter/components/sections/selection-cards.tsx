import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import React from "react";

interface SelectionCardProps {
	item: any;
	itemId: string;
	isSelected: boolean;
	onSelect: (id: string) => void;
	showIcon?: boolean;
	cardType: "solution" | "variant" | "default";
}

/**
 * SelectionCard component - Renders a selectable card for industries, technologies, and solutions
 */
export default function SelectionCard({
	item,
	itemId,
	isSelected,
	onSelect,
	showIcon = true,
	cardType,
}: SelectionCardProps) {
	return (
		<>
			{cardType === "solution" && (
				<SolutionCard
					item={item}
					itemId={itemId}
					isSelected={isSelected}
					onSelect={onSelect}
					showIcon={showIcon}
				/>
			)}
			{cardType === "variant" && (
				<VariantCard
					item={item}
					itemId={itemId}
					isSelected={isSelected}
					onSelect={onSelect}
					showIcon={showIcon}
				/>
			)}
			{cardType === "default" && (
				<DefaultCard
					item={item}
					itemId={itemId}
					isSelected={isSelected}
					onSelect={onSelect}
					showIcon={showIcon}
				/>
			)}
		</>
	);
}

function DefaultCard({
	item,
	itemId,
	isSelected,
	onSelect,
	showIcon = true,
}: Omit<SelectionCardProps, "cardType">) {
	const iconComponent = item.icon ? stringToIconComponent(item.icon) : null;

	return (
		<div
			className={`p-3 border rounded-md cursor-pointer transition-colors ${
				isSelected
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/50"
			}`}
			onClick={() => onSelect(itemId)}
		>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2">
					{showIcon && item.icon && (
						<div className="h-4 w-4">
							{iconComponent ? (
								React.createElement(iconComponent, {
									className: "h-4 w-4",
								})
							) : (
								<div className="h-4 w-4 bg-muted rounded flex items-center justify-center text-xs">
									{item.icon.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
					)}
					<span className="font-medium text-sm">
						{item.name || "Unnamed Item"}
					</span>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-1 ml-6">
				{item.description || "No description available"}
			</p>
		</div>
	);
}

function SolutionCard({
	item,
	itemId,
	isSelected,
	onSelect,
	showIcon = true,
}: Omit<SelectionCardProps, "cardType">) {
	const iconComponent = item.solution_icon
		? stringToIconComponent(item.solution_icon)
		: null;

	return (
		<div
			className={`p-3 border rounded-md cursor-pointer transition-colors ${
				isSelected
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/50"
			}`}
			onClick={() => onSelect(itemId)}
		>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2">
					{showIcon && item.solution_icon && (
						<div className="h-4 w-4">
							{iconComponent ? (
								React.createElement(iconComponent, {
									className: "h-4 w-4",
								})
							) : (
								<div className="h-4 w-4 bg-muted rounded flex items-center justify-center text-xs">
									{item.solution_icon.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
					)}
					<span className="font-medium text-sm">
						{item.solution_name || "Unnamed Solution"}
					</span>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-1 ml-6">
				{item.solution_description || "No description available"}
			</p>
		</div>
	);
}

function VariantCard({
	item,
	itemId,
	isSelected,
	onSelect,
	showIcon = true,
}: Omit<SelectionCardProps, "cardType">) {
	const iconComponent = item.icon ? stringToIconComponent(item.icon) : null;

	return (
		<div
			className={`p-3 border rounded-md cursor-pointer transition-colors ${
				isSelected
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/50"
			}`}
			onClick={() => onSelect(itemId)}
		>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2">
					{showIcon && item.icon && (
						<div className="h-4 w-4">
							{iconComponent ? (
								React.createElement(iconComponent, {
									className: "h-4 w-4",
								})
							) : (
								<div className="h-4 w-4 bg-muted rounded flex items-center justify-center text-xs">
									{item.icon.charAt(0).toUpperCase()}
								</div>
							)}
						</div>
					)}
					<span className="font-medium text-sm">
						{item.name || "Unnamed Variant"}
					</span>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-1 ml-6">
				{item.description || "No description available"}
			</p>
		</div>
	);
}
