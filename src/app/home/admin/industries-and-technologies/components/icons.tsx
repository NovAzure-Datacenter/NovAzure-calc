"use client";

import type React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function TechnologyIcons({
	iconSize = 3,
	textSize = "xs",
	technologies,
	maxVisible = 3,
}: {
	iconSize?: number;
	textSize?: string;
	technologies: any[];
	maxVisible?: number;
}) {
	const visibleTechs = technologies.slice(0, maxVisible);
	const remainingCount = technologies.length - maxVisible;

	return (
		<div className="flex items-center gap-1">
			{visibleTechs.map((tech, index) => (
				<Tooltip key={index}>
					<TooltipTrigger asChild>
						<div className="p-1 bg-gray-100 rounded">
							<tech.icon
								className={`h-${iconSize} w-${iconSize} text-gray-600`}
							/>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p className="text-xs">{tech.name}</p>
					</TooltipContent>
				</Tooltip>
			))}
			{remainingCount > 0 && (
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="p-1 bg-gray-100 rounded text-xs font-medium">
							+{remainingCount}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<div className="text-xs">
							{technologies.slice(maxVisible).map((tech, index) => (
								<div key={index}>{tech.name}</div>
							))}
						</div>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}

export function CompanyIcons({
	companies,
	maxVisible = 3,
	iconSize = 4,
	textSize = "xs",
}: {
	companies: any[];
	maxVisible?: number;
	iconSize?: number;
	textSize?: string;
}) {
	const visibleCompanies = companies.slice(0, maxVisible);
	const remainingCount = companies.length - maxVisible;

	return (
		<div className="flex items-center gap-1">
			{visibleCompanies.map((company, index) => (
				<Tooltip key={index}>
					<TooltipTrigger asChild>
						<div className="p-1 bg-gray-100 rounded">
							<company.icon
								className={`h-${iconSize} w-${iconSize} text-gray-600`}
							/>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p className="text-xs">{company.name}</p>
					</TooltipContent>
				</Tooltip>
			))}
			{remainingCount > 0 && (
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="p-1 bg-gray-100 rounded text-xs font-medium">
							+{remainingCount}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<div className="text-xs">
							{companies.slice(maxVisible).map((company, index) => (
								<div key={index}>{company.name}</div>
							))}
						</div>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}
