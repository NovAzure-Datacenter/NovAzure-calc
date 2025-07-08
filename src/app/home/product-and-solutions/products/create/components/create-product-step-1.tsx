"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface Solution {
	id: string;
	solution_name: string;
	solution_description: string;
	solution_type: string;
	status: "draft" | "pending" | "verified";
	created_at: Date;
	updated_at: Date;
}

interface CreateProductStep1Props {
	solutions: Solution[];
	selectedSolutionId: string;
	onSolutionSelect: (solutionId: string) => void;
}

export function CreateProductStep1({
	solutions,
	selectedSolutionId,
	onSolutionSelect,
}: CreateProductStep1Props) {
	// Helper function to render solution card
	const renderSolutionCard = (solution: Solution) => (
		<div
			key={solution.id}
			className={`p-2 border rounded-md cursor-pointer transition-colors ${
				selectedSolutionId === solution.id
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/50"
			}`}
			onClick={() => onSolutionSelect(solution.id)}
		>
			<div className="flex items-center gap-2">
				<Checkbox
					checked={selectedSolutionId === solution.id}
					onCheckedChange={() => onSolutionSelect(solution.id)}
				/>
				<div className="flex items-center gap-2 flex-1">
					<div className="h-3 w-3">
						<FileText className="h-3 w-3" />
					</div>
					<span className="font-medium text-xs">
						{solution.solution_name}
					</span>
					<Badge variant="outline" className="text-xs px-1 py-0">
						{solution.solution_type}
					</Badge>
				</div>
			</div>
			<p className="text-xs text-muted-foreground mt-1 ml-6 line-clamp-1">
				{solution.solution_description}
			</p>
			<div className="flex items-center gap-2 mt-1 ml-6">
				<Badge variant="outline" className="text-xs px-1 py-0">
					{solution.status}
				</Badge>
				<span className="text-xs text-muted-foreground">
					Created {new Date(solution.created_at).toLocaleDateString()}
				</span>
			</div>
		</div>
	);

	return (
		<div className="space-y-3">
			<div>
				<Label className="text-sm font-medium">Available Solutions</Label>
				<p className="text-xs text-muted-foreground">
					Select the solution to associate with your new product
				</p>
			</div>
			{solutions.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
					{solutions.map((solution) => 
						renderSolutionCard(solution)
					)}
				</div>
			) : (
				<div className="text-sm text-muted-foreground py-4 text-center">
					No solutions available
				</div>
			)}
		</div>
	);
} 