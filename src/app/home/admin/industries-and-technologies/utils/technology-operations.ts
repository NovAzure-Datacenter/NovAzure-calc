import { Technology } from "../types";

/**
 * Removes a technology by its ID
 * This function is designed to be easily integrated with MongoDB later
 *
 * @param technologyId - The ID of the technology to remove
 * @returns Promise<boolean> - Returns true if removal was successful, false otherwise
 */
export async function removeTechnology(technologyId: string): Promise<boolean> {
	try {
		// TODO: Replace this mock implementation with actual MongoDB operation
		// Example MongoDB implementation:
		// const result = await db.collection('technologies').deleteOne({ _id: new ObjectId(technologyId) });
		// return result.deletedCount > 0;

		// Mock implementation for now
		//console.log(`Removing technology with ID: ${technologyId}`);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Simulate successful removal (you can modify this to simulate failures)
		const success = Math.random() > 0.1; // 90% success rate for testing

		if (success) {
			//console.log(`Successfully removed technology with ID: ${technologyId}`);
			return true;
		} else {
			console.error(`Failed to remove technology with ID: ${technologyId}`);
			return false;
		}
	} catch (error) {
		console.error("Error removing technology:", error);
		return false;
	}
}

/**
 * Removes multiple technologies by their IDs
 *
 * @param technologyIds - Array of technology IDs to remove
 * @returns Promise<{ success: string[], failed: string[] }> - Returns arrays of successful and failed removals
 */
export async function removeMultipleTechnologies(technologyIds: string[]): Promise<{
	success: string[];
	failed: string[];
}> {
	const success: string[] = [];
	const failed: string[] = [];

	for (const id of technologyIds) {
		const result = await removeTechnology(id);
		if (result) {
			success.push(id);
		} else {
			failed.push(id);
		}
	}

	return { success, failed };
}

/**
 * Validates if a technology can be removed
 * This can be extended to check for dependencies, permissions, etc.
 *
 * @param technology - The technology to validate for removal
 * @returns Promise<{ canRemove: boolean; reason?: string }> - Returns validation result
 */
export async function validateTechnologyRemoval(technology: Technology): Promise<{
	canRemove: boolean;
	reason?: string;
}> {
	try {
		// TODO: Add actual validation logic here
		// Examples:
		// - Check if user has permission to remove this technology
		// - Check if technology is referenced by other entities
		// - Check if technology is currently in use by industries

		// Mock validation for now
		if (technology.status === "verified") {
			// Simulate some verification that might prevent removal
			const canRemove = Math.random() > 0.3; // 70% chance of being removable

			if (!canRemove) {
				return {
					canRemove: false,
					reason:
						"This verified technology cannot be removed due to active dependencies",
				};
			}
		}

		return { canRemove: true };
	} catch (error) {
		console.error("Error validating technology removal:", error);
		return {
			canRemove: false,
			reason: "Validation failed due to an error",
		};
	}
}

/**
 * Handles the complete removal process including validation
 *
 * @param technology - The technology to remove
 * @returns Promise<{ success: boolean; message: string }> - Returns operation result
 */
export async function handleTechnologyRemoval(technology: Technology): Promise<{
	success: boolean;
	message: string;
}> {
	try {
		// First validate if the technology can be removed
		const validation = await validateTechnologyRemoval(technology);

		if (!validation.canRemove) {
			return {
				success: false,
				message: validation.reason || "Technology cannot be removed",
			};
		}

		// Proceed with removal
		const removed = await removeTechnology(technology.id || "");

		if (removed) {
			return {
				success: true,
				message: `Successfully removed technology: ${technology.name}`,
			};
		} else {
			return {
				success: false,
				message: `Failed to remove technology: ${technology.name}`,
			};
		}
	} catch (error) {
		console.error("Error in handleTechnologyRemoval:", error);
		return {
			success: false,
			message: "An unexpected error occurred during removal",
		};
	}
} 