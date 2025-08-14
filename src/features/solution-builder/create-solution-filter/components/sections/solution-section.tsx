import { SolutionSectionProps } from "@/features/solution-builder/types/types";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";
import React, { useState } from "react";
import CreateNewItemDialog from "../create-new-item-dialog";

/**
 * SolutionSection component - Renders the solution selection section
 */
export default function SolutionSection(props: SolutionSectionProps) {
	const {
		selectedSolutionId,
		availableSolutionTypes,
		canSelectSolution,
		isLoadingSolutionTypes,
		isCreatingNewSolution,
		onSolutionTypeSelect,
		getSelectedIndustry,
		getSelectedTechnology,
		getSelectedSolutionCategory,
		renderSelectionCard,
		handleCreateNewSolution,
		onFormDataChange,
		onAddNewlyCreatedSolution,
		newlyCreatedSolutions,
	} = props;

	const [isCreateSolutionDialogOpen, setIsCreateSolutionDialogOpen] =
		useState(false);
	const [solutionFormData, setSolutionFormData] = useState({
		name: "",
		description: "",
		icon: "",
	});

	const currentNewlyCreatedSolution =
		newlyCreatedSolutions.length > 0
			? newlyCreatedSolutions[newlyCreatedSolutions.length - 1]
			: null;

	const handleCreateSolution = () => {
		const tempId = `temp-${Date.now()}`;
		const newSolution = {
			id: tempId,
			name: solutionFormData.name,
			description: solutionFormData.description,
			icon: solutionFormData.icon,
			solution_id: tempId,
		};

		onAddNewlyCreatedSolution(newSolution);

		onFormDataChange({
			solutionName: solutionFormData.name,
			solutionDescription: solutionFormData.description,
			solutionIcon: solutionFormData.icon,
		});

		handleCreateNewSolution();
		setIsCreateSolutionDialogOpen(false);
		setSolutionFormData({
			name: "",
			description: "",
			icon: "",
		});
	};

	const handleSolutionFormDataChange = (
		data: Partial<{ name: string; description: string; icon: string }>
	) => {
		setSolutionFormData((prev) => ({ ...prev, ...data }));
	};

	return (
		<>
			<div className="space-y-4">
				{/* Solution Progress Indicator */}
				<div className="flex items-center gap-2 mb-2">
					<div
						className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
							selectedSolutionId || isCreatingNewSolution
								? "bg-green-500 text-white"
								: canSelectSolution
								? "bg-muted text-muted-foreground"
								: "bg-gray-200 text-gray-400"
						}`}
					>
						{selectedSolutionId || isCreatingNewSolution ? (
							<Check className="h-3 w-3" />
						) : canSelectSolution ? (
							"3"
						) : (
							"3"
						)}
					</div>
					<span
						className={`text-sm ${
							selectedSolutionId || isCreatingNewSolution
								? "font-medium"
								: canSelectSolution
								? ""
								: "text-muted-foreground"
						}`}
					>
						Solution Selection
					</span>
				</div>

				{/* Collapsed State - When solution is selected */}
				{selectedSolutionId ||
				(currentNewlyCreatedSolution && isCreatingNewSolution) ? (
					<div className="space-y-4">
						<div className="p-3 border-2 border-green-200 rounded-md bg-green-50">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Check className="h-4 w-4 text-green-600" />
									<div className="flex items-center gap-2">
										{/* Check if the selected solution is the newly created one */}
										{currentNewlyCreatedSolution &&
										(selectedSolutionId === currentNewlyCreatedSolution.id ||
											isCreatingNewSolution) ? (
											<>
												{currentNewlyCreatedSolution.icon ? (
													React.createElement(
														typeof currentNewlyCreatedSolution.icon === "string"
															? stringToIconComponent(
																	currentNewlyCreatedSolution.icon
															  )
															: currentNewlyCreatedSolution.icon,
														{ className: "h-4 w-4" }
													)
												) : (
													<div className="h-4 w-4 bg-muted rounded"></div>
												)}
												<span className="font-medium text-sm">
													{currentNewlyCreatedSolution.name}
												</span>
											</>
										) : (
											<>
												{getSelectedSolutionCategory()?.icon ? (
													React.createElement(
														(typeof getSelectedSolutionCategory()
															?.icon as unknown) === "string"
															? stringToIconComponent(
																	getSelectedSolutionCategory()?.icon as string
															  )
															: (getSelectedSolutionCategory()?.icon as any),
														{ className: "h-4 w-4" }
													)
												) : (
													<div className="h-4 w-4 bg-muted rounded"></div>
												)}
												<span className="font-medium text-sm">
													{getSelectedSolutionCategory()?.name}
												</span>
											</>
										)}
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										onSolutionTypeSelect("");
									}}
									className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
								>
									Change
								</Button>
							</div>
						</div>
					</div>
				) : (
					/* Expanded State - When no solution is selected */
					<>
						<div>
							<p className="text-xs text-muted-foreground mb-3">
								{canSelectSolution
									? `Choose a solution for ${
											getSelectedTechnology()?.name ||
											"your selected technology"
									  } in ${
											getSelectedIndustry()?.name || "your selected industry"
									  }`
									: "Please select an industry and technology first to choose available solutions"}
							</p>
						</div>

						{/* Solution Category Selection */}
						{canSelectSolution && (
							<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
								<Label className="text-xs font-medium text-muted-foreground mb-2">
									Solution Categories for{" "}
									{getSelectedTechnology()?.name || "Selected Technology"}
								</Label>
								{isLoadingSolutionTypes ? (
									<div className="flex items-center justify-center py-6">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
										<span className="ml-2 text-sm">
											Loading solution categories...
										</span>
									</div>
								) : (
									<div className="space-y-3">
										{/* Solution Categories Grid */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
											{/* Create New Solution Card - Only show if not creating new solution */}
											{!currentNewlyCreatedSolution ? (
												<div
													className="p-3 border rounded-md cursor-pointer transition-colors bg-white hover:border-primary/50"
													onClick={() => setIsCreateSolutionDialogOpen(true)}
												>
													<div className="flex items-center gap-2">
														<div className="flex items-center gap-2">
															<Plus className="h-4 w-4" />
															<span className="font-medium text-sm">
																Create New
															</span>
														</div>
													</div>
													<p className="text-xs text-muted-foreground mt-1 ml-6">
														Create a new solution category
													</p>
												</div>
											) : (
												<div
													className="p-3 border-2 border-primary rounded-md bg-primary/5 cursor-pointer transition-colors"
													onClick={() =>
														onSolutionTypeSelect(currentNewlyCreatedSolution.id)
													}
												>
													<div className="flex items-center gap-2">
														{currentNewlyCreatedSolution.icon ? (
															React.createElement(
																typeof currentNewlyCreatedSolution.icon ===
																	"string"
																	? stringToIconComponent(
																			currentNewlyCreatedSolution.icon
																	  )
																	: currentNewlyCreatedSolution.icon,
																{ className: "h-4 w-4" }
															)
														) : (
															<div className="h-4 w-4 bg-muted rounded"></div>
														)}
														<span className="font-medium text-sm">
															{currentNewlyCreatedSolution.name}
														</span>
													</div>
													<p className="text-xs text-muted-foreground mt-1 ml-6">
														{currentNewlyCreatedSolution.description}
													</p>
												</div>
											)}

											{/* Existing solution categories */}
											{availableSolutionTypes.map((solutionCategory) => (
												<div key={solutionCategory.id}>
													{renderSelectionCard(
														solutionCategory,
														solutionCategory.id,
														selectedSolutionId === solutionCategory.id,
														onSolutionTypeSelect
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</>
				)}
			</div>

			{/* Create Solution Dialog */}
			<CreateNewItemDialog
				isOpen={isCreateSolutionDialogOpen}
				onOpenChange={setIsCreateSolutionDialogOpen}
				formData={solutionFormData}
				onFormDataChange={handleSolutionFormDataChange}
				onCreate={handleCreateSolution}
				type="solution"
			/>
		</>
	);
}
