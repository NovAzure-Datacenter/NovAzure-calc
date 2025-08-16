import { useState } from "react";
import { toast } from "sonner";
import { Parameter } from "@/types/types";
import { ParameterEditData } from "@/features/solution-builder/types/types";
import {
	validateParameterEditData,
	getDefaultParameterEditData,
	convertParameterToEditData,
	convertEditDataToParameter,
} from "../services";

interface UseParameterStateProps {
	parameters: Parameter[];
	onParametersChange: (parameters: Parameter[]) => void;
	customCategories: Array<{ name: string; color: string }>;
	activeTab: string;
}

export function useParameterState({
	parameters,
	onParametersChange,
	customCategories,
	activeTab,
}: UseParameterStateProps) {
	const [editingParameter, setEditingParameter] = useState<string | null>(null);
	const [editData, setEditData] = useState<ParameterEditData>(getDefaultParameterEditData());

	const [isAddingParameter, setIsAddingParameter] = useState(false);
	const [newParameterData, setNewParameterData] = useState<ParameterEditData>(getDefaultParameterEditData());

	const [isParameterConfirmDialogOpen, setIsParameterConfirmDialogOpen] = useState(false);
	const [confirmParameter, setConfirmParameter] = useState<string | null>(null);

	const handleEditParameter = (parameter: Parameter) => {
		setEditingParameter(parameter.id);
		setEditData(convertParameterToEditData(parameter));
	};

	const handleSaveParameter = (parameterId: string) => {
		const otherParameters = parameters.filter(p => p.id !== parameterId);
		const validation = validateParameterEditData(editData, otherParameters);
		if (!validation.isValid) {
			toast.error(validation.errorMessage);
			return;
		}

		const currentParameter = parameters.find((p) => p.id === parameterId);
		if (!currentParameter) return;

		const updatedParameters = parameters.map((param) =>
			param.id === parameterId
				? convertEditDataToParameter(
						editData,
						currentParameter.category.color,
						parameterId
				  )
				: param
		);

		onParametersChange(updatedParameters);
		setEditingParameter(null);
		setEditData(getDefaultParameterEditData());
	};

	const handleCancelEdit = () => {
		setEditingParameter(null);
		setEditData(getDefaultParameterEditData());
	};

	const handleAddParameter = () => {
		setIsAddingParameter(true);
		setNewParameterData({
			...getDefaultParameterEditData(),
			category: activeTab === "all" || activeTab === "Global" ? "" : activeTab,
		});
	};

	const handleSaveNewParameter = () => {
		const validation = validateParameterEditData(newParameterData, parameters);
		if (!validation.isValid) {
			toast.error(validation.errorMessage);
			return;
		}

		const selectedCategory = customCategories.find(
			(cat) => cat.name === newParameterData.category
		);
		const categoryColor = selectedCategory?.color || "blue";

		const newParameter: Parameter = convertEditDataToParameter(
			newParameterData,
			categoryColor,
			`param-${Date.now()}`
		);

		onParametersChange([newParameter, ...parameters]);
		setIsAddingParameter(false);
		setNewParameterData(getDefaultParameterEditData());
	};

	const handleCancelAddParameter = () => {
		setIsAddingParameter(false);
		setNewParameterData(getDefaultParameterEditData());
	};

	const handleDeleteParameter = (parameterId: string) => {
		setConfirmParameter(parameterId);
		setIsParameterConfirmDialogOpen(true);
	};

	const handleConfirmRemoveParameter = () => {
		if (confirmParameter) {
			const updatedParameters = parameters.filter(
				(param) => param.id !== confirmParameter
			);
			onParametersChange(updatedParameters);
			setIsParameterConfirmDialogOpen(false);
			setConfirmParameter(null);
		}
	};

	return {
		// State
		editingParameter,
		editData,
		setEditData,
		isAddingParameter,
		newParameterData,
		setNewParameterData,
		isParameterConfirmDialogOpen,
		setIsParameterConfirmDialogOpen,
		confirmParameter,

		// Handlers
		handleEditParameter,
		handleSaveParameter,
		handleCancelEdit,
		handleAddParameter,
		handleSaveNewParameter,
		handleCancelAddParameter,
		handleDeleteParameter,
		handleConfirmRemoveParameter,
	};
} 