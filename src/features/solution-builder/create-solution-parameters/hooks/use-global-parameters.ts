import { useEffect } from "react";
import { Parameter } from "@/types/types";
import { loadGlobalParametersIfNeeded } from "../services";

interface UseGlobalParametersProps {
	parameters: Parameter[];
	onParametersChange: (parameters: Parameter[]) => void;
}

export function useGlobalParameters({
	parameters,
	onParametersChange,
}: UseGlobalParametersProps) {
	useEffect(() => {
		loadGlobalParametersIfNeeded(parameters, onParametersChange);
	}, [parameters.length, onParametersChange]);

	return {};
} 