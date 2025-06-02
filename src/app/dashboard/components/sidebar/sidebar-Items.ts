import {
	BarChart3,
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
	Plus,
} from "lucide-react";
import { Dashboard } from "./buyers/dashboard";
import { ScenarioTemplates } from "./buyers/scenario-templates";
import { ComparisonView } from "./buyers/comparison-view";
import { FilterSort } from "./buyers/filter-sort";
import { Calculators } from "./buyers/calculators";

export const buyerSideBarItems = {
	items: [
		{
			title: "Dashboard",
			icon: BarChart3,
			component: Dashboard,
			isActive: true,
			items: [
				{
					title: "History",
					url: "#",
				},
				{
					title: "Starred",
					url: "#",
				},
				{
					title: "Settings",
					url: "#",
				},
			],
		},
		{
			title: "Calculators",
			icon: CalculatorIcon,
			component: Calculators,
			isActive: false,
			items: [
				{
					title: "UPS Efficiency Comparison",
					url: "#",
				},
				{
					title: "Alternative UPS Solution",
					url: "#",
				},
				{
					title: "Legacy UPS System",
					url: "#",
				},
				{
					title: "Browse More",
					url: "/calculators/store",
					icon: Plus
				},
			],
		},
		{
			title: "Scenario Templates",
			icon: FilesIcon,
			component: ScenarioTemplates,
			isActive: false,
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
			isActive: false,
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
			isActive: false,
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

export const sellerSideBarItems = [];

export const teams = [
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
