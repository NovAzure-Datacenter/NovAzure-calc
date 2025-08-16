import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddCategoryButtonProps {
	onClick: () => void;
}

/**
 * AddCategoryButton component - Renders the button to add a new category
 */
export function AddCategoryButton({ onClick }: AddCategoryButtonProps) {
	return (
		<Button
			variant="outline"
			onClick={onClick}
			size="sm"
			className="text-xs"
		>
			<Plus className="h-4 w-4" />
			Add Category
		</Button>
	);
} 