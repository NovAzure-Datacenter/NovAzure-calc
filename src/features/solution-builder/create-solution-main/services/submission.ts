import { toast } from "sonner";
import {
	createNewSolution,
	createNewSolutionVariant,
	createNewClientSolution,
	updateExistingClientSolution,
	getClientSolutions,
} from "../../api";
import { CreateSolutionData } from "../../types/types";

/**
 * Handle saving solution as draft
 */
export async function handleSaveAsDraft(
	formData: CreateSolutionData,
	clientData: any,
	userId: string,
	isExistingSolutionLoaded: boolean,
	existingSolutionId: string | null,
	isCreatingNewSolution: boolean,
	isCreatingNewVariant: boolean,
	getSelectedSolutionType: () => any,
	getSelectedSolutionVariant: () => any
) {
	try {
		// Check if we're working with an existing variant and need to find/update existing client solution
		if (!isCreatingNewVariant && formData.solution_variant && 
			formData.solution_variant !== "new" && 
			formData.solution_variant.length === 24) {
			
		
			
			// Try to find existing client solution for this variant
			try {
				const existingSolutionsResult = await getClientSolutions(clientData.id);
				
			
				
				if (existingSolutionsResult.solutions) {
					// Find the client solution that uses this variant
					const existingClientSolution = existingSolutionsResult.solutions.find(
						(solution) => solution.solution_variant === formData.solution_variant
					);
					
				
					
					if (existingClientSolution && existingClientSolution.id) {
					
						
						// Update the existing client solution
						const updateResult = await updateExistingClientSolution(
							existingClientSolution.id,
							{
								parameters: formData.parameters,
								calculations: formData.calculations,
								status: "draft",
								updated_at: new Date(),
							}
						);

						if (updateResult.success) {
							
							return {
								success: true,
								status: "success" as const,
								message: "Solution updated and saved as draft successfully!",
								solutionName: existingClientSolution.solution_name || "Updated Solution",
							};
						}
					} 
				}
			} catch (error) {
				console.warn("⚠️ Failed to find/update existing client solution, creating new one:", error);
			}
		}

		// If we reach here, we need to create a new client solution
		// This handles both new solutions/variants and existing solutions/variants that need new client entries
		
		let finalSolutionId = formData.solution;

		if (isCreatingNewSolution || formData.solution === "new") {
			const newSolution = await createNewSolution({
				solution_name: formData.solution_name,
				solution_description: formData.solution_description,
				solution_icon: formData.solution_icon,
				applicable_industries: formData.industry,
				applicable_technologies: formData.technology,
				solution_variants: [],
				parameters: formData.parameters,
				calculations: formData.calculations,
				status: "draft",
				created_by: userId,
				client_id: clientData.id,
			});

			if (newSolution.success) {
				finalSolutionId = newSolution.solution_id;
			} else {
				throw new Error("Failed to create new solution");
			}
		} else {
			// Validate existing solution ID
			if (finalSolutionId && finalSolutionId !== "new" && finalSolutionId.length !== 24) {
				throw new Error("Invalid solution ID format");
			}
		}

		let finalVariantId = formData.solution_variant;

		if (isCreatingNewVariant || formData.solution_variant === "new") {
			const newVariant = await createNewSolutionVariant({
				name: formData.solution_variant_name,
				description: formData.solution_variant_description,
				icon: formData.solution_variant_icon,
				solution_id: finalSolutionId,
				created_by: userId,
			});

			if (newVariant.success) {
				finalVariantId = newVariant.solution_variant_id;
			} else {
				throw new Error("Failed to create new solution variant");
			}
		} else {
			// Validate existing variant ID
			if (finalVariantId && finalVariantId !== "new" && finalVariantId.length !== 24) {
				throw new Error("Invalid variant ID format");
			}
		}

		let finalSolutionName: string;
		let finalSolutionDescription: string;
		let finalSolutionIcon: string;

		const selectedSolution = getSelectedSolutionType();

		if (isCreatingNewSolution || formData.solution === "new") {
			finalSolutionName = formData.solution_name;
			finalSolutionDescription = formData.solution_description;
			finalSolutionIcon = formData.solution_icon;
		} else {
			if (selectedSolution) {
				finalSolutionName =
					selectedSolution.solution_name ||
					selectedSolution.name ||
					"Unknown Solution";
				finalSolutionDescription =
					selectedSolution.solution_description ||
					selectedSolution.description ||
					"";
				finalSolutionIcon =
					selectedSolution.solution_icon || selectedSolution.icon || "";
			} else {
				finalSolutionName = "Unknown Solution";
				finalSolutionDescription = "";
				finalSolutionIcon = "";
			}
		}

		// Create new client solution entry
		await createNewClientSolution({
			client_id: clientData.id,
			solution_name: finalSolutionName,
			solution_description: finalSolutionDescription,
			solution_icon: finalSolutionIcon,
			industry: formData.industry,
			technology: formData.technology,
			solution: finalSolutionId,
			solution_variant: finalVariantId || "",
			solution_variant_name: formData.solution_variant_name,
			solution_variant_description: formData.solution_variant_description,
			solution_variant_icon: formData.solution_variant_icon,
			solution_variant_product_badge: formData.solution_variant_product_badge,
			parameters: formData.parameters,
			calculations: formData.calculations,
			categories: formData.categories,
			status: "draft",
			created_by: userId,
		});

		return {
			success: true,
			status: "success" as const,
			message: "Solution saved as draft successfully!",
			solutionName: finalSolutionName,
		};
	} catch (error) {
		console.error("Error saving draft:", error);
		return {
			success: false,
			status: "error" as const,
			message: "Failed to save solution as draft. Please try again.",
			solutionName: "",
		};
	}
}

/**
 * Handle submitting solution for review
 */
export async function handleSubmitForReview(
	formData: CreateSolutionData,
	clientData: any,
	userId: string,
	isExistingSolutionLoaded: boolean,
	existingSolutionId: string | null,
	isCreatingNewSolution: boolean,
	isCreatingNewVariant: boolean,
	getSelectedSolutionType: () => any,
	getSelectedSolutionVariant: () => any
) {
	try {
		// Check if we're working with an existing variant and need to find/update existing client solution
		if (!isCreatingNewVariant && formData.solution_variant && 
			formData.solution_variant !== "new" && 
			formData.solution_variant.length === 24) {
			
		
			
			// Try to find existing client solution for this variant
			try {
				const existingSolutionsResult = await getClientSolutions(clientData.id);
				
				
				
				if (existingSolutionsResult.solutions) {
					// Find the client solution that uses this variant
					const existingClientSolution = existingSolutionsResult.solutions.find(
						(solution) => solution.solution_variant === formData.solution_variant
					);
					
					
					
					if (existingClientSolution && existingClientSolution.id) {
					
						
						// Update the existing client solution
						const updateResult = await updateExistingClientSolution(
							existingClientSolution.id,
							{
								parameters: formData.parameters,
								calculations: formData.calculations,
								status: "pending",
								updated_at: new Date(),
							}
						);

						if (updateResult.success) {
							
							return {
								success: true,
								status: "success" as const,
								message: "Solution updated and submitted for review successfully!",
								solutionName: existingClientSolution.solution_name || "Updated Solution",
							};
						}
					} 
				}
			} catch (error) {
				console.warn("⚠️ Failed to find/update existing client solution, creating new one:", error);
			}
		}

		// If we reach here, we need to create a new client solution
		// This handles both new solutions/variants and existing solutions/variants that need new client entries
		
		let finalSolutionId = formData.solution;

		if (isCreatingNewSolution || formData.solution === "new") {
			const newSolution = await createNewSolution({
				solution_name: formData.solution_name,
				solution_description: formData.solution_description,
				solution_icon: formData.solution_icon,
				applicable_industries: formData.industry,
				applicable_technologies: formData.technology,
				solution_variants: [],
				parameters: formData.parameters,
				calculations: formData.calculations,
				status: "pending",
				created_by: userId,
				client_id: clientData.id,
			});

			if (newSolution.success) {
				finalSolutionId = newSolution.solution_id;
			} else {
				throw new Error("Failed to create new solution");
			}
		} else {
			// Validate existing solution ID
			if (finalSolutionId && finalSolutionId !== "new" && finalSolutionId.length !== 24) {
				throw new Error("Invalid solution ID format");
			}
		}

		let finalVariantId = formData.solution_variant;

		if (isCreatingNewVariant || formData.solution_variant === "new") {
			const newVariant = await createNewSolutionVariant({
				name: formData.solution_variant_name,
				description: formData.solution_variant_description,
				icon: formData.solution_variant_icon,
				solution_id: finalSolutionId,
				created_by: userId,
			});

			if (newVariant.success) {
				finalVariantId = newVariant.solution_variant_id;
			} else {
				throw new Error("Failed to create new solution variant");
			}
		} else {
			// Validate existing variant ID
			if (finalVariantId && finalVariantId !== "new" && finalVariantId.length !== 24) {
				throw new Error("Invalid variant ID format");
			}
		}

		let finalSolutionName: string;
		let finalSolutionDescription: string;
		let finalSolutionIcon: string;

		const selectedSolution = getSelectedSolutionType();

		if (isCreatingNewSolution || formData.solution === "new") {
			finalSolutionName = formData.solution_name;
			finalSolutionDescription = formData.solution_description;
			finalSolutionIcon = formData.solution_icon;
		} else {
			if (selectedSolution) {
				finalSolutionName =
					selectedSolution.solution_name ||
					selectedSolution.name ||
					"Unknown Solution";
				finalSolutionDescription =
					selectedSolution.solution_description ||
					selectedSolution.description ||
					"";
				finalSolutionIcon =
					selectedSolution.solution_icon || selectedSolution.icon || "";
			} else {
				finalSolutionName = "Unknown Solution";
				finalSolutionDescription = "";
				finalSolutionIcon = "";
			}
		}

		// Create new client solution entry
		await createNewClientSolution({
			client_id: clientData.id,
			solution_name: finalSolutionName,
			solution_description: finalSolutionDescription,
			solution_icon: finalSolutionIcon,
			industry: formData.industry,
			technology: formData.technology,
			solution: finalSolutionId,
			solution_variant: finalVariantId || "",
			solution_variant_name: formData.solution_variant_name,
			solution_variant_description: formData.solution_variant_description,
			solution_variant_icon: formData.solution_variant_icon,
			solution_variant_product_badge: formData.solution_variant_product_badge,
			parameters: formData.parameters,
			calculations: formData.calculations,
			categories: formData.categories,
			status: "pending",
			created_by: userId,
		});

		return {
			success: true,
			status: "success" as const,
			message: "Solution submitted for review successfully!",
			solutionName: finalSolutionName,
		};
	} catch (error) {
		console.error("Error submitting solution:", error);
		return {
			success: false,
			status: "error" as const,
			message: "Failed to submit solution for review. Please try again.",
			solutionName: "",
		};
	}
}
