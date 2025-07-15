"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	AlertTriangle,
	Trash2,
	Edit,
	Send,
	Eye,
	Building2,
	Cpu,
	Layers,
	Package,
	Calculator,
	Settings,
	ChevronDown,
	ChevronUp,
	FileText,
	Zap,
	Shield,
	Globe,
	Database,
	Cloud,
	Server,
	Monitor,
	Smartphone,
	Tablet,
	Watch,
	Headphones,
	Camera,
	Gamepad2,
	Wifi,
	Bluetooth,
	Battery,
	Power,
	Volume2,
	Mic,
	Video,
	Music,
	Image,
	File,
	Folder,
	Archive,
	Download,
	Upload,
	Share,
	Link,
	Lock,
	Unlock,
	Key,
	CreditCard,
	DollarSign,
	Gift,
	Star,
	Heart,
	ThumbsUp,
	ThumbsDown,
	Flag,
	AlertCircle,
	Info,
	CheckCircle,
	XCircle,
	HelpCircle,
	Plus,
	Minus,
	X,
	Search,
	Filter,
	SortAsc,
	SortDesc,
	Calendar,
	Clock,
	MapPin,
	Mail,
	Phone,
	MessageSquare,
	Bell,
	User,
	Users,
	UserPlus,
	UserMinus,
	UserCheck,
	UserX,
	Home,
	Building,
	Factory,
	Store,
	ShoppingCart,
	Truck,
	Plane,
	Train,
	Car,
	Bike,
	Ship,
	Rocket,
	Satellite,
} from "lucide-react";

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

interface SolutionDialogProps {
	solution: ExtendedSolution | null;
	isOpen: boolean;
	onClose: () => void;
	isEditMode?: boolean;
	onRemove?: (solutionId: string) => void;
	onEdit?: (solution: ExtendedSolution) => void;
	onSubmitForReview?: (solution: ExtendedSolution) => void;
	isRemoving?: string | null;
	isSubmitting?: boolean;
	industries?: any[];
	technologies?: any[];
	solutionVariants?: any[];
}

const statusColors = {
	pending: "bg-yellow-100 text-yellow-800",
	verified: "bg-green-100 text-green-800",
	draft: "bg-gray-100 text-gray-800",
} as const;

export function SolutionDialog({
	solution,
	isOpen,
	onClose,
	isEditMode = false,
	onRemove,
	onEdit,
	onSubmitForReview,
	isRemoving,
	isSubmitting,
	industries = [],
	technologies = [],
	solutionVariants = [],
}: SolutionDialogProps) {
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [expandedParameters, setExpandedParameters] = useState(false);
	const [expandedCalculations, setExpandedCalculations] = useState(false);

	if (!solution) return null;

	const getIndustryName = (industryId: string) => {
		const industry = industries.find((i) => i.id === industryId);
		return industry?.name || industryId;
	};

	const getTechnologyName = (technologyId: string) => {
		const technology = technologies.find((t) => t.id === technologyId);
		return technology?.name || technologyId;
	};

	const getIconComponent = (iconName: string) => {
		const iconMap: {
			[key: string]: React.ComponentType<{ className?: string }>;
		} = {
			Package,
			Settings,
			FileText,
			Zap,
			Shield,
			Globe,
			Database,
			Cloud,
			Server,
			Monitor,
			Smartphone,
			Tablet,
			Watch,
			Headphones,
			Camera,
			Gamepad2,
			Wifi,
			Bluetooth,
			Battery,
			Power,
			Volume2,
			Mic,
			Video,
			Music,
			Image,
			File,
			Folder,
			Archive,
			Download,
			Upload,
			Share,
			Link,
			Lock,
			Unlock,
			Key,
			CreditCard,
			DollarSign,
			Gift,
			Star,
			Heart,
			ThumbsUp,
			ThumbsDown,
			Flag,
			AlertCircle,
			Info,
			CheckCircle,
			XCircle,
			HelpCircle,
			Plus,
			Minus,
			X,
			Search,
			Filter,
			SortAsc,
			SortDesc,
			Calendar,
			Clock,
			MapPin,
			Mail,
			Phone,
			MessageSquare,
			Bell,
			User,
			Users,
			UserPlus,
			UserMinus,
			UserCheck,
			UserX,
			Home,
			Building,
			Factory,
			Store,
			ShoppingCart,
			Truck,
			Plane,
			Train,
			Car,
			Bike,
			Ship,
			Rocket,
			Satellite,
			Building2,
			Cpu,
			Layers,
			Calculator,
		};

		return iconMap[iconName] || FileText;
	};

	const handleRemove = () => {
		setIsConfirmingRemove(true);
	};

	const handleEdit = () => {
		if (onEdit) {
			onEdit(solution);
		}
		onClose();
	};

	const handleSubmitForReview = () => {
		if (onSubmitForReview) {
			onSubmitForReview(solution);
		}
		onClose();
	};

	const toggleParameters = () => {
		setExpandedParameters(!expandedParameters);
	};

	const toggleCalculations = () => {
		setExpandedCalculations(!expandedCalculations);
	};

	return (
		<>
			{/* Solution Detail Dialog */}
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="min-w-[900px] max-h-[85vh] flex flex-col">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3 text-xl">
							<div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
								<solution.logo className="h-6 w-6 text-gray-600" />
							</div>
							<div>
								<div className="font-semibold">{solution.name}</div>
								<div className="text-sm font-normal text-muted-foreground">
									{solution.category}
								</div>
							</div>
						</DialogTitle>
					</DialogHeader>

					{/* Scrollable Content */}
					<div className="flex-1 overflow-y-auto px-6">
						<div className="space-y-6 pt-4">
							{/* Description Section */}
							<div className="bg-muted/30 rounded-lg p-4">
								<h4 className="font-semibold text-sm text-gray-900 mb-2">
									Description
								</h4>
								<p className="text-sm text-gray-600 leading-relaxed">
									{solution.description}
								</p>
							</div>

							{/* Key Information Grid */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
								<div className="bg-muted/30 rounded-lg p-3">
									<h4 className="font-medium text-sm text-gray-900 mb-1 flex items-center gap-2">
										<Building2 className="h-3 w-3" />
										Industry
									</h4>
									<p className="text-sm text-gray-600">
										{getIndustryName(solution.applicable_industries)}
									</p>
								</div>
								<div className="bg-muted/30 rounded-lg p-3">
									<h4 className="font-medium text-sm text-gray-900 mb-1 flex items-center gap-2">
										<Cpu className="h-3 w-3" />
										Technology
									</h4>
									<p className="text-sm text-gray-600">
										{getTechnologyName(solution.applicable_technologies)}
									</p>
								</div>
								<div className="bg-muted/30 rounded-lg p-3">
									<h4 className="font-medium text-sm text-gray-900 mb-1">
										Status
									</h4>
									<Badge
										variant="outline"
										className={`text-xs px-2 py-1 ${
											statusColors[solution.status as keyof typeof statusColors]
										}`}
									>
										{solution.status}
									</Badge>
								</div>
								<div className="bg-muted/30 rounded-lg p-3">
									<h4 className="font-medium text-sm text-gray-900 mb-1 flex items-center gap-2">
										<Layers className="h-3 w-3" />
										Variants
									</h4>
									<p className="text-sm text-gray-600">
										{solution.solution_variants.length}
									</p>
								</div>
							</div>

							{/* Configuration Overview */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div className="bg-muted/30 rounded-lg p-4">
									<div className="flex items-center justify-between mb-3">
										<h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
											<Package className="h-4 w-4" />
											Parameters ({solution.parameters.length})
										</h4>
										{solution.parameters.length > 3 && (
											<Button
												variant="ghost"
												size="sm"
												onClick={toggleParameters}
												className="h-6 px-2 text-xs"
											>
												{expandedParameters ? (
													<>
														<ChevronUp className="h-3 w-3 mr-1" />
														Show Less
													</>
												) : (
													<>
														<ChevronDown className="h-3 w-3 mr-1" />
														Show All
													</>
												)}
											</Button>
										)}
									</div>
									<div
										className={`space-y-2 ${
											!expandedParameters ? "space-y-1" : ""
										}`}
									>
										{solution.parameters.length > 0 ? (
											solution.parameters
												.slice(
													0,
													expandedParameters ? solution.parameters.length : 3
												)
												.map((param, index) => (
													<div
														key={index}
														className={`bg-white rounded border ${
															!expandedParameters ? "p-1.5" : "p-2"
														}`}
													>
														<div className="flex items-center justify-between">
															<span
																className={`font-medium ${
																	!expandedParameters ? "text-xs" : "text-sm"
																}`}
															>
																{param.name}
															</span>
															<Badge variant="outline" className="text-xs">
																{param.type}
															</Badge>
														</div>
														{expandedParameters && param.description && (
															<p className="text-xs text-muted-foreground mt-1">
																{param.description}
															</p>
														)}
														{expandedParameters &&
															param.value !== undefined && (
																<div className="mt-1">
																	<span className="text-xs text-muted-foreground">
																		Value:{" "}
																	</span>
																	<span className="text-xs font-medium">
																		{param.value}
																	</span>
																</div>
															)}
													</div>
												))
										) : (
											<p className="text-sm text-muted-foreground">
												No parameters configured
											</p>
										)}
										{!expandedParameters && solution.parameters.length > 3 && (
											<p className="text-xs text-muted-foreground">
												+{solution.parameters.length - 3} more parameters
											</p>
										)}
									</div>
								</div>

								<div className="bg-muted/30 rounded-lg p-4">
									<div className="flex items-center justify-between mb-3">
										<h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
											<Calculator className="h-4 w-4" />
											Calculations ({solution.calculations.length})
										</h4>
										{solution.calculations.length > 3 && (
											<Button
												variant="ghost"
												size="sm"
												onClick={toggleCalculations}
												className="h-6 px-2 text-xs"
											>
												{expandedCalculations ? (
													<>
														<ChevronUp className="h-3 w-3 mr-1" />
														Show Less
													</>
												) : (
													<>
														<ChevronDown className="h-3 w-3 mr-1" />
														Show All
													</>
												)}
											</Button>
										)}
									</div>
									<div
										className={`space-y-2 ${
											!expandedCalculations ? "space-y-1" : ""
										}`}
									>
										{solution.calculations.length > 0 ? (
											solution.calculations
												.slice(
													0,
													expandedCalculations
														? solution.calculations.length
														: 3
												)
												.map((calc, index) => (
													<div
														key={index}
														className={`bg-white rounded border ${
															!expandedCalculations ? "p-1.5" : "p-2"
														}`}
													>
														<div className="flex items-center justify-between">
															<span
																className={`font-medium ${
																	!expandedCalculations ? "text-xs" : "text-sm"
																}`}
															>
																{calc.name}
															</span>
															<Badge
																variant={
																	calc.status === "valid"
																		? "default"
																		: "destructive"
																}
																className="text-xs"
															>
																{calc.status}
															</Badge>
														</div>
														{expandedCalculations && calc.description && (
															<p className="text-xs text-muted-foreground mt-1">
																{calc.description}
															</p>
														)}
														{expandedCalculations && calc.formula && (
															<div className="mt-1">
																<span className="text-xs text-muted-foreground">
																	Formula:{" "}
																</span>
																<code className="text-xs bg-gray-100 px-1 rounded">
																	{calc.formula}
																</code>
															</div>
														)}
														{expandedCalculations &&
															calc.result !== undefined && (
																<div className="mt-1">
																	<span className="text-xs text-muted-foreground">
																		Result:{" "}
																	</span>
																	<span className="text-xs font-medium">
																		{calc.result}
																	</span>
																</div>
															)}
													</div>
												))
										) : (
											<p className="text-sm text-muted-foreground">
												No calculations configured
											</p>
										)}
										{!expandedCalculations &&
											solution.calculations.length > 3 && (
												<p className="text-xs text-muted-foreground">
													+{solution.calculations.length - 3} more calculations
												</p>
											)}
									</div>
								</div>
							</div>

							{/* Solution Variants Section */}
							{solutionVariants.length > 0 && (
								<div className="bg-muted/30 rounded-lg p-4">
									<h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
										<Layers className="h-4 w-4" />
										Solution Variants ({solutionVariants.length})
									</h4>
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
										{solutionVariants.map((variant, index) => (
											<div key={index} className="bg-white rounded p-3 border">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
															{(() => {
																const IconComponent = getIconComponent(
																	variant.icon || "FileText"
																);
																return <IconComponent className="h-4 w-4" />;
															})()}
														</div>
														<span className="text-sm font-medium">
															{variant.name}
														</span>
													</div>
												</div>
												<p className="text-xs text-muted-foreground mt-1">
													{variant.description}
												</p>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Dialog Footer - Always Visible */}
					<DialogFooter className="flex items-center justify-between pt-6 border-t mt-6 flex-shrink-0">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Eye className="h-4 w-4" />
							<span>Solution Details</span>
						</div>
						<div className="flex items-center gap-2">
							{/* Edit Button */}
							<Button
								variant="outline"
								size="sm"
								onClick={handleEdit}
								disabled={isRemoving === solution.id || isSubmitting}
							>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</Button>

							{/* Submit for Review Button (only for drafts) */}
							{solution.status === "draft" && (
								<Button
									variant="default"
									size="sm"
									onClick={handleSubmitForReview}
									disabled={isRemoving === solution.id || isSubmitting}
								>
									<Send className="h-4 w-4 mr-2" />
									{isSubmitting ? "Submitting..." : "Submit for Review"}
								</Button>
							)}

							{/* Remove Button */}
							<Button
								variant="destructive"
								size="sm"
								onClick={handleRemove}
								disabled={isRemoving === solution.id || isSubmitting}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isRemoving === solution.id ? "Removing..." : "Remove"}
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Confirmation Dialog for Remove */}
			{isConfirmingRemove && (
				<Dialog open={isConfirmingRemove} onOpenChange={setIsConfirmingRemove}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-destructive" />
								Remove Solution
							</DialogTitle>
							<DialogDescription className="space-y-2">
								<p>
									Are you sure you want to remove{" "}
									<strong>&quot;{solution.name}&quot;</strong>?
								</p>
								<p className="text-sm text-muted-foreground">
									This will permanently delete the solution and all associated
									data
								</p>
								<p className="text-sm font-medium text-destructive">
									This action cannot be undone.
								</p>
							</DialogDescription>
						</DialogHeader>
						<div className="flex justify-end gap-3 pt-6 border-t mt-6">
							<Button
								variant="outline"
								onClick={() => setIsConfirmingRemove(false)}
								size="sm"
								disabled={isRemoving === solution.id}
							>
								Cancel
							</Button>
							<Button
								onClick={async () => {
									if (onRemove) {
										onRemove(solution.id);
									}
									setIsConfirmingRemove(false);
								}}
								size="sm"
								variant="destructive"
								disabled={isRemoving === solution.id}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isRemoving === solution.id ? "Removing..." : "Remove Solution"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
