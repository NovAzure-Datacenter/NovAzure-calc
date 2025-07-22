"use client";

import React from "react";

interface CreateSolutionProgressProps {
	currentStep: number;
}

export function CreateSolutionProgress({ currentStep }: CreateSolutionProgressProps) {
	const steps = [
		{ number: 1, label: "Industry, Technology & Solution" },
		{ number: 2, label: "Parameters" },
		{ number: 3, label: "Calculations" },
		{ number: 4, label: "Review & Submit" },
	];

	return (
		<div className="flex items-center justify-center space-x-3 mb-6">
			{steps.map((step, index) => (
				<div key={step.number} className="flex items-center">
					<div
						className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
							currentStep >= step.number
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						}`}
					>
						{step.number}
					</div>
					{index < steps.length - 1 && (
						<div
							className={`w-12 h-0.5 mx-1 ${
								currentStep > step.number ? "bg-primary" : "bg-muted"
							}`}
						/>
					)}
				</div>
			))}
		</div>
	);
} 