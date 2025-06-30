"use client";

import type React from "react";





export function TechnologyIcons({
	iconSize = 4,
	textSize = 'xs',
	technologies,
	maxVisible = 4,
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
				<div key={index} className="relative">
					<tech.icon className={`h-${iconSize} w-${iconSize} text-muted-foreground`} />
				</div>
			))}
			{remainingCount > 0 && (
				<div className="relative">
					<div className={`h-${iconSize} w-${iconSize} rounded-full bg-muted flex items-center justify-center`}>
						<span className={`text-${textSize}font-medium text-muted-foreground`}>
							+{remainingCount}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

export function CompanyIcons({
	companies,
	maxVisible = 4,
	iconSize = 4,
	textSize = 'xs',
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
				<div key={index} className="relative">
					<company.icon className={`h-${iconSize} w-${iconSize} text-muted-foreground`} />
				</div>
			))}
			{remainingCount > 0 && (
				<div className="relative">
						<div className={`h-${iconSize} w-${iconSize} rounded-full bg-muted flex items-center justify-center`}>
						<span className={`text-${textSize} font-medium text-muted-foreground`}>
							+{remainingCount}
						</span>
					</div>
				</div>
			)}
		</div>
	);
} 