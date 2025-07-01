"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
	MoreHorizontal,
	Plus,
	Edit,
	Trash2,
	DollarSign,
	Zap,
	Leaf,
	Settings,
	Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Industry } from "../types";
import { TechnologyIcons, CompanyIcons } from "./icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndustryDetailDialog } from "./industry-detail-dialog";

interface IndustryDetailDialogProps {
	industry: Industry | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TableView({ data }: { data: Industry[] }) {
	const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openDropdown]);

	const handleRowClick = (industry: Industry) => {
		setSelectedIndustry(industry);
		setIsDialogOpen(true);
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedIndustry(null);
	};

	const handleDropdownButtonClick = (e: React.MouseEvent, industryName: string) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === industryName ? null : industryName);
	};

	const handleDropdownItemClick = (action: string, industryName: string) => {
		setOpenDropdown(null);
	};

	return (
		<div className="h-[calc(100vh-200px)] overflow-y-auto">
			<Card className="rounded-md border p-2">
				<TooltipProvider>
					<Table>
						<TableHeader>
							<TableRow className="border-b">
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Logo
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Name
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Description
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Technologies
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Companies
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Status
								</TableHead>
								<TableHead className="h-8 px-2 py-1 text-xs font-medium">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((industry) => (
								<TableRow
									key={industry.id}
									className="hover:bg-muted/50 cursor-pointer"
									onClick={() => handleRowClick(industry)}
								>
									<TableCell className="h-10 px-2 py-1">
										<industry.logo className="h-5 w-5" />
									</TableCell>
									<TableCell className="h-10 px-2 py-1 font-medium text-sm">
										{industry.name}
									</TableCell>
									<TableCell className="h-10 px-2 py-1 max-w-xs truncate text-sm text-muted-foreground">
										<Tooltip>
											<TooltipTrigger asChild>
												<span>{industry.description}</span>
											</TooltipTrigger>
											<TooltipContent className="max-w-xs">
												<p className="text-sm">{industry.description}</p>
											</TooltipContent>
										</Tooltip>
									</TableCell>
									<TableCell className="h-10 px-2 py-1">
										<TechnologyIcons technologies={industry.technologies} />
									</TableCell>
									<TableCell className="h-10 px-2 py-1">
										<CompanyIcons companies={industry.companies} />
									</TableCell>
									<TableCell className="h-10 px-2 py-1">
										<Badge
											variant={
												industry.status === "verified" ? "default" : "secondary"
											}
											className="text-xs px-2 py-0.5"
										>
											{industry.status}
										</Badge>
									</TableCell>
									<TableCell className="h-10 px-2 py-1">
										{/* Custom Simple Dropdown */}
										<div className="relative dropdown-container">
											<Button
												variant="ghost"
												className="h-6 w-6 p-0"
												onClick={(e) => handleDropdownButtonClick(e, industry.name)}
											>
												<MoreHorizontal className="h-3 w-3" />
											</Button>
											
											{openDropdown === industry.name && (
												<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
													<button
														className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
														onClick={() => handleDropdownItemClick('Add', industry.name)}
													>
														<Plus className="h-3 w-3" />
														Add
													</button>
													<button
														className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
														onClick={() => handleDropdownItemClick('Edit', industry.name)}
													>
														<Edit className="h-3 w-3" />
														Edit
													</button>
													<button
														className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
														onClick={() => handleDropdownItemClick('Remove', industry.name)}
													>
														<Trash2 className="h-3 w-3" />
														Remove
													</button>
												</div>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TooltipProvider>
			</Card>

			<IndustryDetailDialog
				industry={selectedIndustry}
				open={isDialogOpen}
				onOpenChange={handleDialogClose}
			/>
		</div>
	);
}


