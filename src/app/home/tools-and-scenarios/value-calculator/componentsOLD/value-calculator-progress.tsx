"use client";

import React from "react";

interface ValueCalculatorProgressProps {
	currentStep: number;
	selectedIndustry: string;
	selectedTechnology: string;
	selectedSolution: string;
	selectedSolutionVariant: string;
	isConfigurationComplete?: boolean;
}

export function ValueCalculatorProgress({
	currentStep,
	selectedIndustry,
	selectedTechnology,
	selectedSolution,
	selectedSolutionVariant,
	isConfigurationComplete = false,
}: ValueCalculatorProgressProps) {
	const steps = [
		{ id: 1, title: "Industry", completed: !!selectedIndustry },
		{ id: 2, title: "Technology", completed: !!selectedTechnology },
		{ id: 3, title: "Solution", completed: !!selectedSolution },
		{ id: 4, title: "Variant", completed: !!selectedSolutionVariant },
	];

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
			<div className="text-center mb-3">
				<h3 className="text-base font-semibold text-gray-900">
					Configuration Progress
				</h3>
				<p className="text-xs text-gray-600">
					Complete all steps to configure your value calculator
				</p>
			</div>

			{currentStep === 4 ? (
				// Show configuration guidance when all steps are complete
				<div className="text-center">
					<div className="text-xs">
						{isConfigurationComplete ? (
							<>
								<p className="text-green-600 font-medium mb-1">
									✓ All selections complete!
								</p>
								<p className="text-gray-600">
									Fill out the required configuration fields below before you
									can calculate your results.
								</p>
							</>
						) : (
							<>
								<p className="text-blue-600 font-medium mb-1">
									Configuration Required
								</p>
								<p className="text-gray-600">
									Please fill out all required configuration fields below to
									enable calculation.
								</p>
							</>
						)}
					</div>
				</div>
			) : (
				// Show step circles when still in progress
				<>
					<div className="flex items-center justify-center space-x-2">
						{steps.map((step, index) => (
							<div key={step.id} className="flex items-center">
								<div className="flex flex-col items-center">
									<div
										className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
											step.completed
												? "bg-primary text-primary-foreground"
												: "bg-muted text-muted-foreground"
										}`}
									>
										{step.completed ? (
											<svg
												className="w-3 h-3"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										) : (
											step.id
										)}
									</div>
									<div className="mt-1 text-xs font-medium text-gray-700 max-w-12 text-center">
										{step.title}
									</div>
								</div>
								{index < steps.length - 1 && (
									<div
										className={`w-8 h-0.5 mx-1 transition-colors ${
											step.completed ? "bg-primary" : "bg-muted"
										}`}
									/>
								)}
							</div>
						))}
					</div>

					{/* Progress Status */}
					<div className="mt-3 text-center">
						{currentStep === 0 && (
							<p className="text-xs text-gray-600">
								Start by selecting an industry
							</p>
						)}
						{currentStep === 1 && (
							<p className="text-xs text-gray-600">
								Now select a technology for your industry
							</p>
						)}
						{currentStep === 2 && (
							<p className="text-xs text-gray-600">
								Choose a solution that fits your needs
							</p>
						)}
						{currentStep === 3 && (
							<p className="text-xs text-gray-600">
								Select a solution variant to continue
							</p>
						)}
					</div>
				</>
			)}
		</div>
	);
}
