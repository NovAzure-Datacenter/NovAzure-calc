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
	applicable_industries: string;
	applicable_technologies: string;
}

interface CreateProductStep1Props {
	solutions: Solution[];
	industries: any[];
	technologies: any[];
	selectedSolutionId: string;
	onSolutionSelect: (solutionId: string) => void;
}

export function CreateProductStep1({
	solutions,
	industries,
	technologies,
	selectedSolutionId,
	onSolutionSelect,
}: CreateProductStep1Props) {
	// Helper function to get industry name
	const getIndustryName = (industryId: string) => {
		const industry = industries.find((i) => i.id === industryId);
		return industry?.name || industryId;
	};

	// Helper function to get technology name
	const getTechnologyName = (technologyId: string) => {
		const technology = technologies.find((t) => t.id === technologyId);
		return technology?.name || technologyId;
	};

	// Group solutions by industry and technology
	const groupedSolutions = solutions.reduce((acc, solution) => {
		const industryId = solution.applicable_industries;
		const technologyId = solution.applicable_technologies;
		
		if (!acc[industryId]) {
			acc[industryId] = {};
		}
		
		if (!acc[industryId][technologyId]) {
			acc[industryId][technologyId] = [];
		}
		
		acc[industryId][technologyId].push(solution);
		return acc;
	}, {} as Record<string, Record<string, Solution[]>>);

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
		<div className="space-y-6">
			<div>
				<Label className="text-sm font-medium">Available Solutions</Label>
				<p className="text-xs text-muted-foreground">
					Select the solution to associate with your new product
				</p>
			</div>
			
			{solutions.length > 0 ? (
				<div className="space-y-6 max-h-[500px] overflow-y-auto">
					{Object.entries(groupedSolutions).map(([industryId, technologyGroups]) => (
						<div key={industryId} className="space-y-3">
							<div className="border-b pb-2">
								<h3 className="font-semibold text-sm text-gray-900">
									{getIndustryName(industryId)}
								</h3>
							</div>
							
							{Object.entries(technologyGroups).map(([technologyId, solutionsInGroup]) => (
								<div key={technologyId} className="space-y-2 ml-4">
									<div className="border-l-2 border-gray-200 pl-3">
										<h4 className="font-medium text-xs text-gray-700 mb-2">
											{getTechnologyName(technologyId)}
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{solutionsInGroup.map((solution) => 
												renderSolutionCard(solution)
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			) : (
				<div className="text-sm text-muted-foreground py-4 text-center">
					No solutions available
				</div>
			)}
		</div>
	);
} 