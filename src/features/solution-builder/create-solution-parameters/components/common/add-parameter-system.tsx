import { Button } from "@/components/ui/button";

export default function AddParameterSystem({
	handleAddParameter,
	handleCancelAddParameter,
	isAddingParameter,
}: {
	handleAddParameter: () => void;
	handleCancelAddParameter: () => void;
	isAddingParameter: boolean;
}) {
	const handleAddParameterClick = () => {
		handleAddParameter();
	};

	const handleCancelClick = () => {
		handleCancelAddParameter();
	};

	return (
		<>
			{!isAddingParameter ? (
				<Button onClick={handleAddParameterClick} size="sm" className="text-xs">
					Add Parameter
				</Button>
			) : (
				<Button onClick={handleCancelClick} size="sm" className="text-xs" variant="outline">
					Cancel
				</Button>
			)}
		</>
	);
}
