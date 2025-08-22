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

interface ConfirmParameterRemovalDialogProps {
	isConfirmDialogOpen: boolean;
	setIsConfirmDialogOpen: (open: boolean) => void;
	confirmParameter: string;
	handleConfirmRemoveParameter: () => void;
	parameters: Parameter[];
}

export function ConfirmParameterRemovalDialog({
	isConfirmDialogOpen,
	setIsConfirmDialogOpen,
	confirmParameter,
	handleConfirmRemoveParameter,
	parameters,
}: ConfirmParameterRemovalDialogProps) {
	const parameterToRemove = parameters.find(
		(param) => param.id === confirmParameter
	);
	const parameterName = parameterToRemove?.name || "Unknown Parameter";

	return (
		<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>Confirm Parameter Removal</DialogTitle>
					<DialogDescription>
						Are you sure you want to remove the parameter &quot;{parameterName}
						&quot;?
						<br />
						This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsConfirmDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleConfirmRemoveParameter}>
						Remove Parameter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 