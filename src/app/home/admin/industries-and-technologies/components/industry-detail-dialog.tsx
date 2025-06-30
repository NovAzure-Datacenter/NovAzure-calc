import { Industry, IndustryParameter } from "../types";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TechnologyIcons } from "./icons";
import { CompanyIcons } from "./icons";
import { DollarSign, Zap, Leaf, Settings, Building2 } from "lucide-react";

interface IndustryDetailDialogProps {
	industry: Industry | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function IndustryDetailDialog({
	industry,
	open,
	onOpenChange,
}: IndustryDetailDialogProps) {
	const getCategoryColor = (category: string) => {
		switch (category) {
			case "cost":
				return "bg-param-cost text-param-cost";
			case "performance":
				return "bg-param-performance text-param-performance";
			case "environmental":
				return "bg-param-environmental text-param-environmental";
			case "operational":
				return "bg-param-operational text-param-operational";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "cost":
				return <DollarSign className="h-4 w-4" />;
			case "performance":
				return <Zap className="h-4 w-4" />;
			case "environmental":
				return <Leaf className="h-4 w-4" />;
			case "operational":
				return <Settings className="h-4 w-4" />;
			default:
				return null;
		}
	};

	const groupParametersByCategory = (parameters: Industry["parameters"]) => {
		const grouped = parameters.reduce((acc, param) => {
			if (!acc[param.category]) {
				acc[param.category] = [];
			}
			acc[param.category].push(param);
			return acc;
		}, {} as Record<string, IndustryParameter[]>);

		return grouped;
	};

	const getParameterSummary = (parameters: Industry["parameters"]) => {
		if (!parameters || parameters.length === 0) return null;

		const categories = parameters.reduce((acc, param) => {
			acc[param.category] = (acc[param.category] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return categories;
	};

	if (!industry) return null;

	const parameterSummary = getParameterSummary(industry.parameters);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-[60vw] max-h-[95vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl">Industry Details</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue="overview" className="w-full">
					<TabsList className="grid w-full grid-cols-2 bg-background border border-border">
						<TabsTrigger
							value="overview"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground"
						>
							Overview
						</TabsTrigger>
						<TabsTrigger
							value="parameters"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground text-muted-foreground"
						>
							Parameters ({industry.parameters?.length || 0})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="mt-4 space-y-4">
						<Card>
							<CardContent className="p-4">
								{/* Header */}
								<div className="flex items-start gap-3 mb-4">
									<industry.logo className="h-10 w-10 text-blue-600 flex-shrink-0" />
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<h2 className="text-lg font-semibold text-gray-900">
												{industry.name}
											</h2>
											<Badge
												variant={
													industry.status === "verified"
														? "default"
														: "secondary"
												}
												className="text-xs"
											>
												{industry.status}
											</Badge>
										</div>
										<p className="text-gray-600 text-sm">
											{industry.description}
										</p>
									</div>
								</div>

								<Separator className="my-4" />

								{/* Technologies and Companies */}
								<div className="flex items-start gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<Zap className="h-4 w-4 text-blue-600" />
											<span className="text-sm font-medium">
												Technology Categories
											</span>
											<Badge variant="outline" className="ml-auto text-xs">
												{industry.technologies.length}
											</Badge>
										</div>
										<TechnologyIcons
											technologies={industry.technologies}
											iconSize={5}
											textSize="xs"
										/>
									</div>

									<Separator orientation="vertical" className="mx-2 " />

									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<Building2 className="h-4 w-4 text-green-600" />
											<span className="text-sm font-medium">
												Companies with Products
											</span>
											<Badge variant="outline" className="ml-auto text-xs">
												{industry.companies.length}
											</Badge>
										</div>
										<CompanyIcons
											companies={industry.companies}
											iconSize={5}
											textSize="xs"
										/>
									</div>
								</div>

								<Separator className="my-4" />

								{/* Compact Parameters Summary */}
								{parameterSummary && (
									<div>
										<div className="flex items-center gap-2 mb-3">
											<Settings className="h-4 w-4 text-gray-600" />
											<h3 className="text-sm font-medium text-gray-900">
												Parameters Summary
											</h3>
											<Badge variant="outline" className="ml-auto text-xs">
												{industry.parameters?.length || 0}
											</Badge>
										</div>
										<div className="flex flex-wrap gap-2">
											{Object.entries(parameterSummary).map(
												([category, count]) => (
													<Badge
														key={category}
														className={`text-xs px-2 py-1 ${getCategoryColor(
															category
														)}`}
													>
														{category.charAt(0).toUpperCase() +
															category.slice(1)}
														: {count}
													</Badge>
												)
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="parameters" className="space-y-6 mt-6">
						{industry.parameters && industry.parameters.length > 0 ? (
							<div className="space-y-2">
								{Object.entries(
									groupParametersByCategory(industry.parameters)
								).map(([category, params]) => (
									<Card key={category} className="border-0 shadow-sm">
										<CardHeader>
											<CardTitle className="text-base flex items-center gap-2">
												{getCategoryIcon(category)}
												{category.charAt(0).toUpperCase() +
													category.slice(1)}{" "}
												Parameters
												<Badge className={getCategoryColor(category)}>
													{params.length}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent className="pt-0">
											<div className="space-y-1">
												{params.map(
													(param: IndustryParameter, index: number) => (
														<div
															key={index}
															className="flex items-center justify-between py-2 px-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
														>
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-0.5">
																	<h4 className="font-medium text-gray-900 text-sm">
																		{param.name}
																	</h4>
																	<Badge
																		className={`${getCategoryColor(
																			category
																		)} text-xs px-1.5 py-0.5`}
																	>
																		{category.charAt(0).toUpperCase() +
																			category.slice(1)}
																	</Badge>
																</div>
																<p className="text-xs text-gray-600">
																	{param.description}
																</p>
															</div>
															<div className="text-right ml-3">
																<div className="text-lg font-bold text-blue-600">
																	{param.value}
																</div>
																<div className="text-xs text-gray-500">
																	{param.unit}
																</div>
															</div>
														</div>
													)
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<Card>
								<CardContent className="p-8 text-center">
									<Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										No Parameters
									</h3>
									<p className="text-gray-600">
										This industry doesn't have any parameters defined yet.
									</p>
								</CardContent>
							</Card>
						)}
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
