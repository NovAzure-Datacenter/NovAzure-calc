import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Parameter } from "@/types/types";

interface ConfirmCategoryRemovalDialogProps {
	isConfirmDialogOpen: boolean;
	setIsConfirmDialogOpen: (open: boolean) => void;
	confirmCategory: string;
	handleConfirmRemoveCategory: () => void;
	parameters: Parameter[];
}

export function ConfirmCategoryRemovalDialog({
	isConfirmDialogOpen,
	setIsConfirmDialogOpen,
	confirmCategory,
	handleConfirmRemoveCategory,
	parameters,
}: ConfirmCategoryRemovalDialogProps) {
	const parametersInCategory = parameters.filter(
		(param) => param.category.name === confirmCategory
	).length;

	return (
		<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirm Category Removal</DialogTitle>
					<DialogDescription>
						Are you sure you want to remove the category &quot;{confirmCategory}
						&quot;?
						<br />
						This action cannot be undone. {parametersInCategory} parameter
						{parametersInCategory !== 1 ? "s" : ""} in this category will be
						permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsConfirmDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleConfirmRemoveCategory}>
						Remove Category
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 