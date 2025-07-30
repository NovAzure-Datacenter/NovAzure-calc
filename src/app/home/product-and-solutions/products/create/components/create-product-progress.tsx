"use client";

import React from "react";

interface CreateProductProgressProps {
	currentStep: number;
}

export function CreateProductProgress({ currentStep }: CreateProductProgressProps) {
	return (
		<div className="flex items-center justify-center space-x-3 mb-6">
			{[1, 2, 3].map((step) => (
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
					{step < 3 && (
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