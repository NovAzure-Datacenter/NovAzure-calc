"use client";

import type React from "react";
import { Building2 } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";

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
	clients = [],
}: {
	companies: any[];
	maxVisible?: number;
	iconSize?: number;
	textSize?: string;
	clients?: Array<{ id?: string; companyName: string; logo: string }>;
}) {
	const visibleCompanies = companies.slice(0, maxVisible);
	const remainingCount = companies.length - maxVisible;

	// Function to resolve company ID to company name
	const resolveCompanyName = (company: any): string => {
		// If company is already a string (name), return it
		if (typeof company === "string") {
			return company;
		}
		// If company has a name property that's a string, return it
		if (
			company.name &&
			typeof company.name === "string" &&
			!company.name.match(/^[0-9a-fA-F]{24}$/)
		) {
			return company.name;
		}
		// If company has a name property that's an ID, resolve it
		if (company.name && typeof company.name === "string") {
			const client = clients.find((c) => c.id === company.name);
			return client ? client.companyName : company.name;
		}
		// Fallback
		return "Unknown Company";
	};

	// Function to resolve company ID to company logo
	const resolveCompanyLogo = (company: any): string => {
		// If company has a name property that's an ID, resolve it
		if (
			company.name &&
			typeof company.name === "string" &&
			company.name.match(/^[0-9a-fA-F]{24}$/)
		) {
			const client = clients.find((c) => c.id === company.name);
			return client ? client.logo : "Building2";
		}
		// If company has a name property that's not an ID (legacy text), return Building2
		if (company.name && typeof company.name === "string") {
			return "Building2";
		}
		// If company has an icon property, use it
		if (company.icon) {
			return company.icon;
		}
		// Fallback
		return "Building2";
	};

	return (
		<div className="flex items-center gap-1">
			{visibleCompanies.map((company, index) => {
				const companyName = resolveCompanyName(company);
				const companyLogo = resolveCompanyLogo(company);

				// Convert logo string to component
				const LogoComponent = stringToIconComponent(companyLogo);

				return (
					<Tooltip key={index}>
						<TooltipTrigger asChild>
							<div className="p-1 bg-gray-100 rounded">
								<LogoComponent
									className={`h-${iconSize} w-${iconSize} text-gray-600`}
								/>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p className="text-xs">{companyName}</p>
						</TooltipContent>
					</Tooltip>
				);
			})}
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
								<div key={index}>{resolveCompanyName(company)}</div>
							))}
						</div>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}
