"use client";

import React from "react";

interface CreateSolutionProgressProps {
	currentStep: number;
}

export function CreateSolutionProgress({ currentStep }: CreateSolutionProgressProps) {
	return (
		<div className="flex items-center justify-center space-x-3 mb-6">
			{[1, 2, 3, 4, 5, 6].map((step) => (
				<div key={step} className="flex items-center">
					<div
						className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
							currentStep >= step
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						}`}
					>
						{step}
					</div>
					{step < 6 && (
						<div
							className={`w-12 h-0.5 mx-1 ${
								currentStep > step ? "bg-primary" : "bg-muted"
							}`}
						/>
					)}
				</div>
			))}
		</div>
	);
} 