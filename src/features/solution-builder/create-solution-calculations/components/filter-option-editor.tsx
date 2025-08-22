import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterOptionsEditorProps } from "../../types/types";
import { Plus, X } from "lucide-react";

export function FilterOptionsEditor({
	options,
	onOptionsChange,
	isEditing,
}: FilterOptionsEditorProps) {
	const addOption = () => {
		onOptionsChange([...options, ""]);
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options];
		newOptions[index] = value;
		onOptionsChange(newOptions);
	};

	const removeOption = (index: number) => {
		onOptionsChange(options.filter((_, i) => i !== index));
	};

	if (!isEditing) {
		return (
			<div className="text-xs text-muted-foreground">
				{options.length > 0 ? (
					<div className="space-y-1">
						{options.map((option, index) => (
							<div key={index} className="flex items-center gap-1">
								<span>{option}</span>
							</div>
						))}
					</div>
				) : (
					<span>No filter options defined</span>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{options.map((option, index) => (
				<div key={index} className="flex items-center gap-1">
					<Input
						value={option}
						onChange={(e) => updateOption(index, e.target.value)}
						className="h-6 text-xs w-24"
						placeholder="UK, USA, UAE"
					/>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => removeOption(index)}
						className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			))}
			<Button
				size="sm"
				variant="outline"
				onClick={addOption}
				className="h-6 text-xs"
			>
				<Plus className="h-3 w-3 mr-1" />
				Add Filter Option
			</Button>
		</div>
	);
}