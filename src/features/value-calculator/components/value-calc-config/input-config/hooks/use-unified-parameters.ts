import { useMemo } from "react";

interface UserInterface {
	is_advanced: boolean;
}

interface Parameter {
	id: string;
	name: string;
	is_unified: boolean;
	user_interface: UserInterface;
	[key: string]: any;
}

interface UnifiedParametersResult {
	/** Parameters that are unified and exist in both sets */
	inBoth: Parameter[];
	/** Parameters that are unified but only exist in one set */
	inOneOnly: Parameter[];
	/** Parameters that are unified and only exist in set A */
	isOnlyA: Parameter[];
	/** Parameters that are unified and only exist in set B */
	isOnlyB: Parameter[];
	/** Backward compatibility - same as inBoth */
	unified: Parameter[];
}

/**
 * Custom hook to analyze unified parameters across two sets
 * @param userInputParametersA - First set of parameters
 * @param userInputParametersB - Second set of parameters
 * @returns Object containing unified parameters in both sets and in one set only
 */
export function useUnifiedParameters(
	userInputParametersA: Parameter[],
	userInputParametersB: Parameter[]
): UnifiedParametersResult {
	return useMemo(() => {
		// Filter for basic unified parameters (unified and not advanced)
		const basicUnifiedParametersA = userInputParametersA.filter(
			(parameter) =>
				parameter.is_unified && !parameter.user_interface.is_advanced
		);

		const basicUnifiedParametersB = userInputParametersB.filter(
			(parameter) =>
				parameter.is_unified && !parameter.user_interface.is_advanced
		);

		// Find parameters that exist in both sets (intersection)
		const basicUnifiedParametersInBoth = basicUnifiedParametersA.filter(
			(parameterA) =>
				basicUnifiedParametersB.some(
					(parameterB) => parameterB.name === parameterA.name
				)
		);

		// Find parameters that are unified but only exist in set A
		const basicUnifiedParametersIsOnlyA = basicUnifiedParametersA.filter(
			(parameterA) =>
				!basicUnifiedParametersB.some(
					(parameterB) => parameterB.name === parameterA.name
				)
		);

		// Find parameters that are unified but only exist in set B
		const basicUnifiedParametersIsOnlyB = basicUnifiedParametersB.filter(
			(parameterB) =>
				!basicUnifiedParametersA.some(
					(parameterA) => parameterA.name === parameterB.name
				)
		);

		// Find parameters that are unified but only exist in one set (symmetric difference)
		const basicUnifiedParametersInOneOnly = [
			...basicUnifiedParametersIsOnlyA,
			...basicUnifiedParametersIsOnlyB,
		];

		return {
			inBoth: basicUnifiedParametersInBoth,
			inOneOnly: basicUnifiedParametersInOneOnly,
			isOnlyA: basicUnifiedParametersIsOnlyA,
			isOnlyB: basicUnifiedParametersIsOnlyB,
			unified: basicUnifiedParametersInBoth, 
		};
	}, [userInputParametersA, userInputParametersB]);
}
