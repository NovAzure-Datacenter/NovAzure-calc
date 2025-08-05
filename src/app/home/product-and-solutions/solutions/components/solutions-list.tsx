"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Edit,
	MoreHorizontal,
	Trash2,
	Eye,
	AlertTriangle,
	Package,
	Clock,
	CheckCircle,
	Send,
	Building2,
	Cpu,
	FileText,
	Calculator,
	Settings,
} from "lucide-react";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { SolutionDialog } from "./solution-dialog";

import { toast } from "sonner";
import Loading from "@/components/loading-main";
import { SubmissionDialog } from "@/features/solution-builder/components/submission-dialog";

interface ClientSolution {
	id?: string;
	client_id: string;
	solution_name: string;
	solution_description: string;
	solution_icon?: string;
	industry_id: string;
	technology_id: string;
	selected_solution_id?: string;
	selected_solution_variant_id?: string;
	is_creating_new_solution: boolean;
	is_creating_new_variant: boolean;
	new_variant_name?: string;
	new_variant_description?: string;
	new_variant_icon?: string;
	parameters: any[];
	calculations: any[];
	status: "draft" | "pending" | "approved" | "rejected";
	created_by: string;
	created_at?: Date;
	updated_at?: Date;
}

// Extended solution interface for the dialog
interface ExtendedSolution {
	id: string;
	applicable_industries: string;
	applicable_technologies: string;
	solution_name: string;
	solution_description: string;
	solution_variants: string[];
	solution_icon?: string;
	parameters: any[];
	calculations: any[];
	status: "draft" | "pending" | "verified";
	created_by: string;
	client_id: string;
	created_at: Date;
	updated_at: Date;
	name: string;
	description: string;
	category: string;
	logo: React.ComponentType<{ className?: string }>;
	products: any[];
	parameterCount: number;
	calculationOverview: string;
}

interface SolutionsListProps {
	solutions: ClientSolution[];
	viewMode: "grid" | "table";
	isLoading: boolean;
	onRefresh: () => Promise<void>;
}

export default function SolutionsList({ solutions, viewMode, isLoading, onRefresh }: SolutionsListProps) {
	const [industries, setIndustries] = useState<any[]>([]);
	const [technologies, setTechnologies] = useState<any[]>([]);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [selectedSolution, setSelectedSolution] = useState<ExtendedSolution | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
	const [submissionStatus, setSubmissionStatus] = useState<"success" | "error">(
		"success"
	);
	const [submissionMessage, setSubmissionMessage] = useState("");
	const [submittedSolutionName, setSubmittedSolutionName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Load industries and technologies
	useEffect(() => {
		async function loadData() {
			try {
				// Load industries
				const industriesResult = await getIndustries();
				if (industriesResult.success) {
					setIndustries(industriesResult.industries || []);
				}

				// Load technologies
				const technologiesResult = await getTechnologies();
				if (technologiesResult.success) {
					setTechnologies(technologiesResult.technologies || []);
				}
			} catch (error) {
				console.error("Error loading data:", error);
			}
		}

		loadData();
	}, []);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "draft":
				return <Clock className="h-3 w-3 text-yellow-600" />;
			case "pending":
				return <Send className="h-3 w-3 text-blue-600" />;
			case "approved":
				return <CheckCircle className="h-3 w-3 text-green-600" />;
			case "rejected":
				return <AlertTriangle className="h-3 w-3 text-red-600" />;
			default:
				return <Clock className="h-3 w-3 text-gray-600" />;
		}
	};

	const getIndustryName = (industryId: string) => {
		const industry = industries.find((i) => i.id === industryId);
		return industry?.name || "Unknown Industry";
	};

	const getTechnologyName = (technologyId: string) => {
		const technology = technologies.find((t) => t.id === technologyId);
		return technology?.name || "Unknown Technology";
	};

	const convertToExtendedSolution = (solution: ClientSolution): ExtendedSolution => {
		// Map status from client solution to dialog expected status
		const mapStatus = (status: string) => {
			switch (status) {
				case "approved":
					return "verified";
				case "rejected":
					return "draft"; // Map rejected to draft for dialog
				default:
					return status as "draft" | "pending" | "verified";
			}
		};

		return {
			id: solution.id || "",
			applicable_industries: solution.industry_id,
			applicable_technologies: solution.technology_id,
			solution_name: solution.solution_name,
			solution_description: solution.solution_description,
			solution_variants: [], // Assuming no variants for now
			solution_icon: solution.solution_icon,
			parameters: solution.parameters,
			calculations: solution.calculations,
			status: mapStatus(solution.status),
			created_by: solution.created_by,
			client_id: solution.client_id,
			created_at: solution.created_at || new Date(),
			updated_at: solution.updated_at || new Date(),
			name: solution.solution_name,
			description: solution.solution_description,
			category: "Custom",
			logo: FileText,
			products: [],
			parameterCount: solution.parameters.length,
			calculationOverview: `${solution.calculations.length} calculations configured`,
		};
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedSolution(null);
	};

	const handleDropdownButtonClick = (
		e: React.MouseEvent,
		solutionId: string
	) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === solutionId ? null : solutionId);
	};

	const handleDropdownItemClick = async (
		action: string,
		solutionId: string
	) => {
		setOpenDropdown(null);

		switch (action) {
			case "view":
				const solution = solutions.find((s) => s.id === solutionId);
				if (solution) {
					setSelectedSolution(convertToExtendedSolution(solution));
					setIsDialogOpen(true);
				}
				break;
			case "edit":
				// TODO: Implement edit functionality
				toast.info("Edit functionality coming soon");
				break;
			case "submit":
				const solutionToSubmit = solutions.find((s) => s.id === solutionId);
				if (solutionToSubmit) {
					await handleSubmitForReview(convertToExtendedSolution(solutionToSubmit));
				}
				break;
			case "delete":
				await handleRemoveSolution(solutionId);
				break;
		}
	};

	const handleRemoveSolution = async (solutionId: string) => {
		try {
			setIsRemoving(solutionId);
			// TODO: Implement delete functionality using clients-solutions
			toast.success("Solution removed successfully");
			await onRefresh();
		} catch (error) {
			console.error("Error removing solution:", error);
			toast.error("Failed to remove solution");
		} finally {
			setIsRemoving(null);
		}
	};

	const handleEditSolution = (solution: ExtendedSolution) => {
		// TODO: Implement edit functionality
		toast.info("Edit functionality coming soon");
	};

	const handleSubmitForReview = async (solution: ExtendedSolution) => {
		try {
			setIsSubmitting(true);
			// TODO: Implement submit for review functionality using clients-solutions
			setSubmissionStatus("success");
			setSubmissionMessage("Solution submitted for review successfully!");
			setSubmittedSolutionName(solution.solution_name);
			setShowSubmissionDialog(true);
			await onRefresh();
		} catch (error) {
			console.error("Error submitting for review:", error);
			setSubmissionStatus("error");
			setSubmissionMessage("Failed to submit for review. Please try again.");
			setShowSubmissionDialog(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			<div className="h-[calc(100vh-200px)] overflow-y-auto">
				<div className="overflow-x-auto">
					<Card className="rounded-md border p-2 min-w-[1000px]">
						<TooltipProvider>
							<Table>
								<TableHeader>
									<TableRow className="border-b">
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-48">
											Solution
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-24">
											Industry
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-24">
											Technology
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Icon
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Params
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Calcs
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Status
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-20">
											Modified
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-10">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{solutions.map((solution) => (
										<TableRow key={solution.id} className="hover:bg-muted/50">
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-2">
													<div className="flex items-center justify-center bg-gray-100 rounded w-4 h-4 flex-shrink-0">
														<FileText className="h-2.5 w-2.5 text-gray-600" />
													</div>
													<div className="min-w-0 flex-1">
														<div className="font-medium text-xs truncate">
															{solution.solution_name}
														</div>
														<div className="text-xs text-muted-foreground truncate">
															{solution.solution_description}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs text-muted-foreground truncate">
													{getIndustryName(solution.industry_id)}
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs text-muted-foreground truncate">
													{getTechnologyName(solution.technology_id)}
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center justify-center">
													{solution.solution_icon ? (
														<div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
															<FileText className="h-2.5 w-2.5 text-gray-600" />
														</div>
													) : (
														<div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
															<FileText className="h-2.5 w-2.5 text-gray-600" />
														</div>
													)}
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-1">
													<Package className="h-3 w-3 text-gray-600 flex-shrink-0" />
													<span className="text-xs">
														{solution.parameters.length}
													</span>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-1">
													<Calculator className="h-3 w-3 text-gray-600 flex-shrink-0" />
													<span className="text-xs">
														{solution.calculations.length}
													</span>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-1">
													{getStatusIcon(solution.status)}
													<Badge
														variant="outline"
														className={`text-xs ${
															solution.status === "approved"
																? "bg-green-50 text-green-700 border-green-200"
																: solution.status === "pending"
																? "bg-blue-50 text-blue-700 border-blue-200"
																: solution.status === "rejected"
																? "bg-red-50 text-red-700 border-red-200"
																: "bg-yellow-50 text-yellow-700 border-yellow-200"
														}`}
													>
														{solution.status}
													</Badge>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs text-muted-foreground">
													{solution.updated_at
														? new Date(solution.updated_at).toLocaleDateString()
														: solution.created_at
														? new Date(solution.created_at).toLocaleDateString()
														: "N/A"}
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="relative">
													<Button
														variant="ghost"
														size="sm"
														onClick={(e) =>
															handleDropdownButtonClick(e, solution.id!)
														}
														className="h-6 w-6 p-0"
													>
														<MoreHorizontal className="h-3 w-3" />
													</Button>
													{openDropdown === solution.id && (
														<div className="absolute right-0 top-6 z-50 w-32 bg-white border rounded-md shadow-lg py-1">
															<button
																onClick={() =>
																	handleDropdownItemClick(
																		"view",
																		solution.id!
																	)
																}
																className="w-full px-3 py-1 text-xs text-left hover:bg-gray-100 flex items-center gap-2"
															>
																<Eye className="h-3 w-3" />
																View
															</button>
															<button
																onClick={() =>
																	handleDropdownItemClick(
																		"edit",
																		solution.id!
																	)
																}
																className="w-full px-3 py-1 text-xs text-left hover:bg-gray-100 flex items-center gap-2"
															>
																<Edit className="h-3 w-3" />
																Edit
															</button>
															{solution.status === "draft" && (
																<button
																	onClick={() =>
																		handleDropdownItemClick(
																			"submit",
																			solution.id!
																		)
																	}
																	className="w-full px-3 py-1 text-xs text-left hover:bg-gray-100 flex items-center gap-2"
																>
																	<Send className="h-3 w-3" />
																	Submit
																</button>
															)}
															<button
																onClick={() =>
																	handleDropdownItemClick(
																		"delete",
																		solution.id!
																	)
																}
																className="w-full px-3 py-1 text-xs text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
															>
																<Trash2 className="h-3 w-3" />
																Delete
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
				</div>
			</div>

			{/* Solution Dialog */}
			{selectedSolution && (
				<SolutionDialog
					solution={selectedSolution}
					isOpen={isDialogOpen}
					onClose={handleDialogClose}
				/>
			)}

			{/* Submission Dialog */}
			<SubmissionDialog
				isOpen={showSubmissionDialog}
				onClose={() => setShowSubmissionDialog(false)}
				status={submissionStatus}
				message={submissionMessage}
				solutionName={submittedSolutionName}
			/>
		</>
	);
}
