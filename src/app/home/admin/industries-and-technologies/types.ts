export type Technology = {
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	iconSize?: number;
	textSize?: string;
};

export type Company = {
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	iconSize?: number;
	textSize?: string;
};

export type IndustryParameter = {
	name: string;
	value: number;
	unit: string;
	description: string;
	category: "cost" | "performance" | "environmental" | "operational";
};

export type Industry = {
	id: string;
	logo: React.ComponentType<{ className?: string }>;
	name: string;
	description: string;
	technologies: Technology[];
	companies: Company[];
	status: "verified" | "pending";
	parameters: IndustryParameter[];
};