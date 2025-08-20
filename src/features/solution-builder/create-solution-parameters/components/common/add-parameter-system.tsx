import { Button } from "@/components/ui/button";

export default function AddParameterSystem({
	handleAddParameter,
	handleCancelAddParameter,
}: {
	handleAddParameter: () => void;
	handleCancelAddParameter: () => void;
}) {
	return (
		<Button onClick={handleAddParameter} size="sm" className="text-xs">
			{" "}
			Add Parameter
		</Button>
	);
}
