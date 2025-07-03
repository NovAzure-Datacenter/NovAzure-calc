export type Technology = {
	id?: string;
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	iconSize?: number;
	textSize?: string;
	status?: "pending" | "verified";
	applicableIndustries?: string[]; 
	parameters?: TechnologyParameter[];
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
	category: "cost" | "performance" | "environmental" | "other";
};

export type TechnologyParameter = {
	name: string;
	value: number;
	unit: string;
	description: string;
	category: "cost" | "performance" | "environmental" | "other";
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
