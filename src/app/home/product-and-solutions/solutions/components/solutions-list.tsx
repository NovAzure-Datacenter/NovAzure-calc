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
import { getSolutions, deleteSolution, submitSolutionForReview } from "@/lib/actions/solution/solution";
import { getIndustries } from "@/lib/actions/industry/industry";
import { getTechnologies } from "@/lib/actions/technology/technology";
import { SolutionDialog } from "./solution-dialog";
import { SubmissionDialog } from "./submission-dialog";
import { toast } from "sonner";
import Loading from "@/components/loading-main";

interface Solution {
	id: string;
	selected_industry: string;
	selected_technology: string;
	solution_type: string;
	solution_variant: string;
	solution_name: string;
	solution_description: string;
	custom_solution_type: string;
	custom_solution_variant: string;
	parameters: any[];
	calculations: any[];
	status: "draft" | "pending" | "verified";
	created_by: string;
	client_id: string;
	created_at: Date;
	updated_at: Date;
}

// Extended solution interface for the dialog
interface ExtendedSolution extends Solution {
	name: string;
	description: string;
	category: string;
	logo: React.ComponentType<{ className?: string }>;
	products: any[];
	parameterCount: number;
	calculationOverview: string;
}

export default function SolutionsList() {
	const [solutions, setSolutions] = useState<Solution[]>([]);
	const [industries, setIndustries] = useState<any[]>([]);
	const [technologies, setTechnologies] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);
	const [selectedSolution, setSelectedSolution] = useState<ExtendedSolution | null>(
		null
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
	const [submissionStatus, setSubmissionStatus] = useState<"success" | "error">("success");
	const [submissionMessage, setSubmissionMessage] = useState("");
	const [submittedSolutionName, setSubmittedSolutionName] = useState("");

	// Load solutions and related data
	useEffect(() => {
		async function loadData() {
			setIsLoading(true);
			try {
				// Load solutions
				const solutionsResult = await getSolutions();
				if (solutionsResult.error) {
					toast.error("Failed to load solutions");
					return;
				}
				setSolutions(solutionsResult.solutions || []);

				// Load industries
				const industriesResult = await getIndustries();
				if (industriesResult.error) {
					toast.error("Failed to load industries");
				} else {
					setIndustries(industriesResult.industries || []);
				}

				// Load technologies
				const technologiesResult = await getTechnologies();
				if (technologiesResult.error) {
					toast.error("Failed to load technologies");
				} else {
					setTechnologies(technologiesResult.technologies || []);
				}
			} catch (error) {
				console.error("Error loading data:", error);
				toast.error("Failed to load required data");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();
	}, []);

	const statusColors = {
		pending: "bg-yellow-100 text-yellow-800",
		verified: "bg-green-100 text-green-800",
		draft: "bg-gray-100 text-gray-800",
	} as const;

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <Clock className="h-3 w-3" />;
			case "verified":
				return <CheckCircle className="h-3 w-3" />;
			case "draft":
				return <Edit className="h-3 w-3" />;
			default:
				return null;
		}
	};

	const getStepIcon = (step: number) => {
		switch (step) {
			case 1:
				return <Building2 className="h-3 w-3" />;
			case 2:
				return <Cpu className="h-3 w-3" />;
			case 3:
				return <FileText className="h-3 w-3" />;
			case 4:
				return <Calculator className="h-3 w-3" />;
			case 5:
				return <Settings className="h-3 w-3" />;
			default:
				return null;
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

	// Convert database solution to dialog-compatible format
	const convertToExtendedSolution = (solution: Solution): ExtendedSolution => {
		return {
			...solution,
			name: solution.solution_name,
			description: solution.solution_description,
			category: solution.solution_type,
			logo: FileText,
			products: [], // Empty for now, could be populated from related data
			parameterCount: solution.parameters.length,
			calculationOverview: `${solution.calculations.filter(c => c.status === "valid").length} valid calculations`,
		};
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setSelectedSolution(null);
		setIsEditMode(false);
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
		const solution = solutions.find((s) => s.id === solutionId);
		if (!solution) return;

		if (action === "View") {
			setSelectedSolution(convertToExtendedSolution(solution));
			setIsEditMode(false);
			setIsDialogOpen(true);
		} else if (action === "Edit") {
			setSelectedSolution(convertToExtendedSolution(solution));
			setIsEditMode(true);
			setIsDialogOpen(true);
		} else if (action === "Remove") {
			setSelectedSolution(convertToExtendedSolution(solution));
			// Handle remove logic here
		} else if (action === "Submit for Review" && solution.status === "draft") {
			// Handle submitting draft for review
			setIsSubmitting(true);
			try {
				const result = await submitSolutionForReview(solution.id);
				if (result.error) {
					setSubmissionStatus("error");
					setSubmissionMessage(result.error);
					setShowSubmissionDialog(true);
				} else {
					setSubmissionStatus("success");
					setSubmissionMessage("Solution submitted for review successfully!");
					setSubmittedSolutionName(solution.solution_name);
					setShowSubmissionDialog(true);
					// Refresh solutions list
					const solutionsResult = await getSolutions();
					if (solutionsResult.success) {
						setSolutions(solutionsResult.solutions || []);
					}
				}
			} catch (error) {
				console.error("Error submitting for review:", error);
				setSubmissionStatus("error");
				setSubmissionMessage("Failed to submit for review. Please try again.");
				setShowSubmissionDialog(true);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleRemoveSolution = async (solutionId: string) => {
		setIsRemoving(solutionId);
		try {
			const result = await deleteSolution(solutionId);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Solution removed successfully!");
				// Remove from local state
				setSolutions(solutions.filter(s => s.id !== solutionId));
			}
		} catch (error) {
			console.error("Error removing solution:", error);
			toast.error("Failed to remove solution");
		} finally {
			setIsRemoving(null);
		}
	};

	const handleEditSolution = (solution: ExtendedSolution) => {
		console.log("Editing solution:", solution.solution_name);
		// In a real app, you would navigate to edit page or open edit form
		// For now, we'll just log the action
	};

	const handleSubmitForReview = async (solution: ExtendedSolution) => {
		setIsSubmitting(true);
		try {
			const result = await submitSolutionForReview(solution.id);
			if (result.error) {
				setSubmissionStatus("error");
				setSubmissionMessage(result.error);
				setShowSubmissionDialog(true);
			} else {
				setSubmissionStatus("success");
				setSubmissionMessage("Solution submitted for review successfully!");
				setSubmittedSolutionName(solution.solution_name);
				setShowSubmissionDialog(true);
				// Refresh solutions list
				const solutionsResult = await getSolutions();
				if (solutionsResult.success) {
					setSolutions(solutionsResult.solutions || []);
				}
			}
		} catch (error) {
			console.error("Error submitting for review:", error);
			setSubmissionStatus("error");
			setSubmissionMessage("Failed to submit for review. Please try again.");
			setShowSubmissionDialog(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Enhanced solutions with additional data for display
	const enhancedSolutions = solutions.map((solution) => ({
		...solution,
		industry: getIndustryName(solution.selected_industry),
		technology: getTechnologyName(solution.selected_technology),
		solutionType: solution.solution_type,
		solutionVariant: solution.solution_variant || "Standard",
		createdAt: new Date(solution.created_at),
		lastModified: new Date(solution.updated_at),
		createdBy: "John Doe", // This would come from user data
		completionStep:
			solution.status === "draft" ? 3 : solution.status === "pending" ? 4 : 6,
		// Mock parameters and calculations for display purposes
		parameters: solution.parameters || [],
		calculations: solution.calculations || [],
	}));

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			<div className="h-[calc(100vh-200px)] overflow-y-auto">
				<div className="overflow-x-auto">
					<Card className="rounded-md border p-2 min-w-[900px]">
						<TooltipProvider>
							<Table>
								<TableHeader>
									<TableRow className="border-b">
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-40">
											Solution
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-24">
											Industry
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-20">
											Type
										</TableHead>
										<TableHead className="h-8 px-1 py-1 text-xs font-medium w-16">
											Step
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
									{enhancedSolutions.map((solution) => (
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
													{solution.industry}
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<Badge variant="outline" className="text-xs px-1 py-0">
													{solution.solutionType}
												</Badge>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="flex items-center gap-1">
													{getStepIcon(solution.completionStep)}
													<span className="text-xs font-medium">
														{solution.completionStep}/6
													</span>
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
												<Badge
													variant="outline"
													className={`text-xs px-1 py-0 ${
														statusColors[solution.status]
													}`}
												>
													{getStatusIcon(solution.status)}
													<span className="ml-0.5 text-xs">
														{solution.status}
													</span>
												</Badge>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												<div className="text-xs text-muted-foreground">
													<div>
														{solution.lastModified.toLocaleDateString()}
													</div>
												</div>
											</TableCell>
											<TableCell className="h-10 px-1 py-1">
												{/* Custom Simple Dropdown */}
												<div className="relative dropdown-container">
													<Button
														variant="ghost"
														className="h-4 w-4 p-0"
														onClick={(e) =>
															handleDropdownButtonClick(e, solution.id)
														}
													>
														<MoreHorizontal className="h-2.5 w-2.5" />
													</Button>

													{openDropdown === solution.id && (
														<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("View", solution.id)
																}
															>
																<Eye className="h-3 w-3" />
																View
															</button>
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																onClick={() =>
																	handleDropdownItemClick("Edit", solution.id)
																}
															>
																<Edit className="h-3 w-3" />
																Edit
															</button>
															{solution.status === "draft" && (
																<button
																	className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
																	onClick={() =>
																		handleDropdownItemClick(
																			"Submit for Review",
																			solution.id
																		)
																	}
																>
																	<Send className="h-3 w-3" />
																	Submit for Review
																</button>
															)}
															<button
																className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
																onClick={() =>
																	handleDropdownItemClick(
																		"Remove",
																		solution.id
																	)
																}
																disabled={isRemoving === solution.id}
															>
																<Trash2 className="h-3 w-3" />
																{isRemoving === solution.id
																	? "Removing..."
																	: "Remove"}
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
			<SolutionDialog
				solution={selectedSolution}
				isOpen={isDialogOpen}
				onClose={handleDialogClose}
				isEditMode={isEditMode}
				onRemove={handleRemoveSolution}
				onEdit={handleEditSolution}
				onSubmitForReview={handleSubmitForReview}
				isRemoving={isRemoving}
				isSubmitting={isSubmitting}
			/>

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
