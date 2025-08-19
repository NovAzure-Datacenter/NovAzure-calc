import { toast } from "sonner";
import {
	createNewSolution,
	createNewSolutionVariant,
	createNewClientSolution,
	updateExistingClientSolution,
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
	loadExistingSolutionData: (variantId: string) => void,
	getSelectedSolutionType: () => any,
	getSelectedSolutionVariant: () => any
) {
	try {
		if (isExistingSolutionLoaded && existingSolutionId) {
			const updateResult = await updateExistingClientSolution(
				existingSolutionId,
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
					solutionName: "Updated Solution",
				};
			} else {
				throw new Error(updateResult.error || "Failed to update solution");
			}
		}

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
			if (isCreatingNewVariant && finalSolutionId === "new") {
				throw new Error("Cannot create variant for non-existent solution");
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
		if (isExistingSolutionLoaded && existingSolutionId) {
			const updateResult = await updateExistingClientSolution(
				existingSolutionId,
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
					solutionName: "Updated Solution",
				};
			} else {
				throw new Error(updateResult.error || "Failed to update solution");
			}
		}

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
			if (isCreatingNewVariant && finalSolutionId === "new") {
				throw new Error("Cannot create variant for non-existent solution");
			}

			if (isCreatingNewVariant && finalSolutionId) {
				if (finalSolutionId.length !== 24) {
				}
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
