import { useCallback } from "react";

/**
 * Hook for formula manipulation (insert, reset, rewind)
 */
export function useFormulaManipulation(
	isAddingCalculation: boolean,
	setNewCalculationData: React.Dispatch<React.SetStateAction<any>>,
	setEditData: React.Dispatch<React.SetStateAction<any>>,
	newCalculationData: any,
	editData: any
) {
	const insertIntoFormula = useCallback((text: string) => {
		if (isAddingCalculation) {
			setNewCalculationData((prev: any) => ({
				...prev,
				formula: prev.formula + text,
			}));
		} else {
			setEditData((prev: any) => ({
				...prev,
				formula: prev.formula + text,
			}));
		}
	}, [isAddingCalculation, setNewCalculationData, setEditData]);

	const resetFormula = useCallback(() => {
		if (isAddingCalculation) {
			setNewCalculationData((prev: any) => ({
				...prev,
				formula: "",
			}));
		} else {
			setEditData((prev: any) => ({
				...prev,
				formula: "",
			}));
		}
	}, [isAddingCalculation, setNewCalculationData, setEditData]);

	const rewindFormula = useCallback(() => {
		const getCurrentFormula = () => {
			if (isAddingCalculation) {
				return newCalculationData.formula;
			} else {
				return editData.formula;
			}
		};

		const setFormula = (newFormula: string) => {
			if (isAddingCalculation) {
				setNewCalculationData((prev: any) => ({
					...prev,
					formula: newFormula,
				}));
			} else {
				setEditData((prev: any) => ({
					...prev,
					formula: newFormula,
				}));
			}
		};

		const currentFormula = getCurrentFormula();

		if (!currentFormula.trim()) {
			return;
		}

		const tokens: string[] = [];
		let currentToken = "";

		const parts = currentFormula.split(/([+\-*/()])/);

		for (const part of parts) {
			if (/^[+\-*/()]$/.test(part)) {
				if (currentToken.trim()) {
					tokens.push(currentToken.trim());
					currentToken = "";
				}
				tokens.push(part);
			} else {
				currentToken += part;
			}
		}

		if (currentToken.trim()) {
			tokens.push(currentToken.trim());
		}

		if (tokens.length > 0) {
			tokens.pop();
			const newFormula = tokens.join("");
			setFormula(newFormula);
		}
	}, [isAddingCalculation, setNewCalculationData, setEditData, newCalculationData, editData]);

	return {
		insertIntoFormula,
		resetFormula,
		rewindFormula,
	};
} 