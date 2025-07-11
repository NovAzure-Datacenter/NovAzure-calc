"use client";

import { Folder } from "lucide-react";

interface EmptyStateProps {
	currentPathLength: number;
}

export function EmptyState({ currentPathLength }: EmptyStateProps) {
	const getMessage = () => {
		switch (currentPathLength) {
			case 1:
				return "No customers available";
			case 2:
				return "No projects available for this customer";
			case 3:
				return "No industries available for this project";
			case 4:
				return "No technologies available for this industry";
			case 5:
				return "No scenarios available for this technology";
			default:
				return "No items found";
		}
	};

	return (
		<div className="text-center py-12">
			<Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
			<h3 className="text-lg font-medium mb-2">No items found</h3>
			<p className="text-muted-foreground">{getMessage()}</p>
		</div>
	);
} 