import {
	GitCompare,
	Filter,
	CalculatorIcon,
	FilesIcon,
	AudioWaveform,
	Command,
	GalleryVerticalEnd,
	PieChart,
	Frame,
	Map,
	BookOpenIcon,
	HomeIcon,
	UsersIcon,
	Package,
} from "lucide-react";
import { ScenarioTemplates } from "./sidebar/buyers-content/scenario-templates";
import { ComparisonView } from "./sidebar/buyers-content/comparison-view";
import { FilterSort } from "./sidebar/buyers-content/filter-sort";
// import { Calculators } from "../../app/[company_name]/(calculators)/calculators";
import {
	BuyerSidebarStructure,
	DefaultItem,
	Team,
} from "./sidebar-items-types";

export const buyerSidebarTools: BuyerSidebarStructure = {
	items: [
		// {
		// 	title: "Calculators",
		// 	icon: CalculatorIcon,
		// 	component: Calculators,
		// 	isActive: true,
		// 	items: [
		// 		{
		// 			title: "Value Calculator",
		// 			url: "/home/calculators/value-calculator",
		// 		},
		// 		{
		// 			title: "Alternative UPS Solution",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Legacy UPS System",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Browse More",
		// 			url: "/calculators/store",
		// 			icon: Plus,
		// 		},
		// 	],
		// },
		{
			title: "Scenario Templates",
			icon: FilesIcon,
			component: ScenarioTemplates,
			isActive: true,
			items: [
				{
					title: "UPS Efficiency Comparison",
					url: "#",
				},
			],
		},
		{
			title: "Comparison View",
			icon: GitCompare,
			component: ComparisonView,
			isActive: true,
			items: [
				{
					title: "UPS Efficiency Comparison",
					url: "#",
				},
			],
		},
		{
			title: "Filter & Sort",
			icon: Filter,
			component: FilterSort,
			isActive: true,
			items: [
				{
					title: "UPS Efficiency Comparison",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Saved Project #1",
			url: "#",
			icon: Frame,
		},
		{
			name: "Saved Project #2",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Saved Project #3",
			url: "#",
			icon: Map,
		},
	],
};

export const sellerSideBarTools: BuyerSidebarStructure = {
	items: [
		// {
		// 	title: "Solutions",
		// 	icon: AudioWaveform,
		// 	component: SolutionsForm,
		// 	isActive: true,
		// 	url: "/solutions",
		
		// },
		// {
		// 	title: "Calculators",
		// 	icon: CalculatorIcon,
		// 	component: Calculators,
		// 	isActive: true,
		// 	items: [
		// 		{
		// 			title: "Value Calculator",
		// 			url: "/calculators/value-calculator",
		// 		},
		// 		{
		// 			title: "Legacy UPS System",
		// 			url: "/under-construction.tsx",
		// 		},
		// 		{
		// 			title: "Browse More",
		// 			url: "/calculators/store",
		// 			icon: Plus,
		// 		},
		// 	],
		// },

		{
			title: "Scenarios",
			icon: FilesIcon,
			component: ScenarioTemplates,
			isActive: true,
			items: [
				{
					title: "UPS Efficiency Comparison",
					url: "#",
				},
			],
		},
		{
			title: "Comparison View",
			icon: GitCompare,
			component: ComparisonView,
			isActive: true,
			url: "/",
		
		},
		// {
		// 	title: "Filter & Sort",
		// 	icon: Filter,
		// 	component: FilterSort,
		// 	isActive: true,
		// 	items: [
		// 		{
		// 			title: "UPS Efficiency Comparison",
		// 			url: "#",
		// 		},
		// 	],
		// },
	],
	projects: [
		{
			name: "Saved Project #1",
			url: "#",
			icon: Frame,
		},
		{
			name: "Saved Project #2",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Saved Project #3",
			url: "#",
			icon: Map,
		},
	],
};

export const adminSideBarTools: BuyerSidebarStructure = {
	items: [
		// {
		// 	title: "Calculators",
		// 	icon: CalculatorIcon,
		// 	component: Calculators,
		// 	isActive: true,
		// 	items: [
		// 		{
		// 			title: "Value Calculator",
		// 			url: "/calculators/value-calculator",
		// 		},
		// 		{
		// 			title: "Alternative UPS Solution",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Legacy UPS System",
		// 			url: "#",
		// 		},
		// 		{
		// 			title: "Browse More",
		// 			url: "/calculators/store",
		// 			icon: Plus,
		// 		},
		// 	],
		// },
		{
			title: "Scenarios",
			icon: FilesIcon,
			component: ScenarioTemplates,
			isActive: true,
			items: [
				{
					title: "UPS Efficiency Comparison",
					url: "#",
				},
			],
		},
		{
			title: "Comparison View",
			icon: GitCompare,
			component: ComparisonView,
			isActive: true,
			items: [
				{
					title: "UPS Efficiency Comparison",
					url: "#",
				},
			],
		},
		{
			title: "Filter & Sort",
			icon: Filter,
			component: FilterSort,
			isActive: true,
			items: [
				{
					title: "UPS Efficiency Comparison",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Saved Project #1",
			url: "#",
			icon: Frame,
		},
	],
};

export const defautlSideBarItems: DefaultItem[] = [
	{
		title: "Home",
		icon: HomeIcon,
		url: "/dashboard/home",
		active: true,
	},
	// { title: "Search", icon: SearchIcon, url: "/search" },
	{ 
		title: "News",
		icon: BookOpenIcon,
		url: "/dashboard/news",
		active: true,
	},
	{
		title: "Products",
		icon: Package,
		url: "/dashboard/products",
		active: true,
	},
	{
		title: "TCO Calculator",
		icon: CalculatorIcon,
		url: "/dashboard/calculator",
		active: true,
	},
	// {
	// 	title: "Solutions",
	// 	icon: AudioWaveform,
	// 	url: "/dashboard/solutions",
	// 	active: true,
	// },
	{
		title: "Users",
		icon: UsersIcon,
		url: "/dashboard/users",
		active: true,
	},
];

export const teams: Team[] = [
	{
		name: "Acme Inc",
		logo: GalleryVerticalEnd,
		plan: "Enterprise",
	},
	{
		name: "Acme Corp.",
		logo: AudioWaveform,
		plan: "Startup",
	},
	{
		name: "Evil Corp.",
		logo: Command,
		plan: "Free",
	},
];
