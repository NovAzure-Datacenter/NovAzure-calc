import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AddParameterSystem({
	handleAddParameter,
	handleCancelAddParameter,
}: {
	handleAddParameter: () => void;
	handleCancelAddParameter: () => void;
}) {
	const [isAddingParameter, setIsAddingParameter] = useState(false);

	const handleAddParameterClick = () => {
		setIsAddingParameter(true);
		handleAddParameter();
	};

	const handleCancelClick = () => {
		setIsAddingParameter(false);
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
