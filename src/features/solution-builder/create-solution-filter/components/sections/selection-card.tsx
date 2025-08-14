import { Checkbox } from "@/components/ui/checkbox";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import React from "react";

interface SelectionCardProps {
	item: any;
	itemId: string;
	isSelected: boolean;
	onSelect: (id: string) => void;
	showIcon?: boolean;
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
}: SelectionCardProps) {
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
					{showIcon && item.icon && stringToIconComponent(item.icon) && (
						<div className="h-4 w-4">
							{React.createElement(stringToIconComponent(item.icon), {
								className: "h-4 w-4",
							})}
						</div>
					)}
					<span className="font-medium text-sm">{item.name}</span>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-1 ml-6">
				{item.description}
			</p>
		</div>
	);
}
