"use client";

import React from "react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getSolutions } from "@/lib/actions/solution/solution";
import { createProduct } from "@/lib/actions/products/products";
import { CreateProductProgress } from "./create-product-progress";
import { CreateProductStep1 } from "./create-product-step-1";
import { CreateProductStep2 } from "./create-product-step-2";
import { CreateProductStep3 } from "./create-product-step-3";

interface CreateProductData {
	solutionId: string;
	name: string;
	description: string;
	model: string;
	specifications: Array<{
		key: string;
		value: string;
	}>;
	features: string[];
}

const initialFormData: CreateProductData = {
	solutionId: "",
	name: "",
	description: "",
	model: "",
	specifications: [
		{ key: "", value: "" }
	],
	features: [""],
};

export function CreateProductMain() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<CreateProductData>(initialFormData);
	const [solutions, setSolutions] = useState<any[]>([]);

	// Load solutions on component mount
	React.useEffect(() => {
		const loadSolutions = async () => {
			try {
				const result = await getSolutions();
				if (result.error) {
					toast.error("Failed to load solutions");
				} else {
					setSolutions(result.solutions || []);
				}
			} catch (error) {
				console.error("Error loading solutions:", error);
				toast.error("Failed to load solutions");
			}
		};

		loadSolutions();
	}, []);

	const selectedSolution = solutions.find((s: any) => s.id === formData.solutionId);

	const handleNext = () => {
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleFormDataChange = (updates: Partial<CreateProductData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const handleSolutionSelect = (solutionId: string) => {
		setFormData((prev) => ({ ...prev, solutionId }));
	};

	const handleFeatureChange = (index: number, value: string) => {
		setFormData((prev) => ({
			...prev,
			features: prev.features.map((feature, i) => 
				i === index ? value : feature
			)
		}));
	};

	const addFeature = () => {
		setFormData((prev) => ({
			...prev,
			features: [...prev.features, ""]
		}));
	};

	const removeFeature = (index: number) => {
		setFormData((prev) => ({
			...prev,
			features: prev.features.filter((_, i) => i !== index)
		}));
	};

	const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
		setFormData((prev) => ({
			...prev,
			specifications: prev.specifications.map((spec, i) => 
				i === index ? { ...spec, [field]: value } : spec
			)
		}));
	};

	const addSpecification = () => {
		setFormData((prev) => ({
			...prev,
			specifications: [...prev.specifications, { key: "", value: "" }]
		}));
	};

	const removeSpecification = (index: number) => {
		setFormData((prev) => ({
			...prev,
			specifications: prev.specifications.filter((_, i) => i !== index)
		}));
	};

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true);

			// Validate required fields
			if (!formData.solutionId || !formData.name || !formData.description || !formData.model) {
				toast.error("Please fill in all required fields");
				return;
			}

			// Filter out empty features and specifications
			const cleanFeatures = formData.features.filter(feature => feature.trim() !== "");
			const cleanSpecifications = formData.specifications.filter(spec => 
				spec.key.trim() !== "" && spec.value.trim() !== ""
			);

			// Get current user info (in a real app, this would come from auth context)
			const currentUser = {
				created_by: "current-user-id", // This should come from auth context
				client_id: "current-client-id", // This should come from auth context
			};

			const newProduct = {
				solutionId: formData.solutionId,
				name: formData.name,
				description: formData.description,
				model: formData.model,
				category: selectedSolution?.solution_type || "Unknown",
				efficiency: "Standard", // This could be a field in the form
				specifications: cleanSpecifications,
				features: cleanFeatures,
				status: "draft" as const,
				created_by: currentUser.created_by,
				client_id: currentUser.client_id,
			};

			const result = await createProduct(newProduct);
			
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Product created successfully!");
				router.push("/home/product-and-solutions/products");
			}
		} catch (error) {
			console.error("Error creating product:", error);
			toast.error("Failed to create product");
		} finally {
			setIsSubmitting(false);
		}
	};

	const getStepTitle = () => {
		switch (currentStep) {
			case 1:
				return "Solution Selection";
			case 2:
				return "Product Details";
			case 3:
				return "Review & Create";
			default:
				return "";
		}
	};

	const getStepDescription = () => {
		switch (currentStep) {
			case 1:
				return "Choose the solution this product belongs to";
			case 2:
				return "Define the product specifications and features";
			case 3:
				return "Review all information before creating the product";
			default:
				return "";
		}
	};

	const isNextDisabled = () => {
		switch (currentStep) {
			case 1:
				return !formData.solutionId;
			case 2:
				return !formData.name || !formData.description || !formData.model;
			default:
				return false;
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
				<p className="text-gray-600">Add a new product to your solution</p>
			</div>

			{/* Progress */}
			<CreateProductProgress currentStep={currentStep} />

			{/* Step Content */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">{getStepTitle()}</CardTitle>
					<CardDescription>{getStepDescription()}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{currentStep === 1 && (
						<CreateProductStep1
							solutions={solutions}
							selectedSolutionId={formData.solutionId}
							onSolutionSelect={handleSolutionSelect}
						/>
					)}
					{currentStep === 2 && (
						<CreateProductStep2
							formData={formData}
							onFormDataChange={handleFormDataChange}
							onFeatureChange={handleFeatureChange}
							onAddFeature={addFeature}
							onRemoveFeature={removeFeature}
							onSpecificationChange={handleSpecificationChange}
							onAddSpecification={addSpecification}
							onRemoveSpecification={removeSpecification}
						/>
					)}
					{currentStep === 3 && (
						<CreateProductStep3
							formData={formData}
							selectedSolution={selectedSolution}
						/>
					)}
				</CardContent>
			</Card>

			{/* Navigation */}
			<div className="flex justify-between">
				<Button
					variant="outline"
					onClick={handlePrevious}
					disabled={currentStep === 1}
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Previous
				</Button>

				<div className="flex gap-2">
					{currentStep < 3 ? (
						<Button
							onClick={handleNext}
							disabled={isNextDisabled()}
						>
							Next
							<ArrowRight className="h-4 w-4 ml-2" />
						</Button>
					) : (
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting || isNextDisabled()}
						>
							{isSubmitting ? "Creating..." : "Create Product"}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}