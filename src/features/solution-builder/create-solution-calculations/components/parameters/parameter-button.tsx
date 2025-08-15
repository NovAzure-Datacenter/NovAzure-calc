import { ParameterButtonProps } from "../../../types/types";

/**
 * ParameterButton component - Individual parameter button
 */
export function ParameterButton({ param, insertIntoFormula }: ParameterButtonProps) {
	const getParameterCategoryColor = (paramCategory: any) => {
		if (!paramCategory || !paramCategory.color) {
			return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
		}

		switch (paramCategory.color.toLowerCase()) {
			case "green":
				return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
			case "blue":
				return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
			case "yellow":
				return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
			case "purple":
				return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
			case "red":
				return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
			case "orange":
				return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
			case "pink":
				return "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100";
			case "indigo":
				return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
		}
	};

	return (
		<button
			type="button"
			onClick={() => insertIntoFormula(param.name)}
			className={`h-6 px-3 text-xs border rounded transition-colors ${getParameterCategoryColor(
				param.category
			)}`}
			title={`${param.name}: ${param.description}`}
		>
			{param.name}
		</button>
	);
} 