import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogHeader,
	DialogDescription,
} from "@/components/ui/dialog";
import { Parameter } from "@/types/types";

interface PreviewDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	parameters: Parameter[];
}

export default function PreviewDialog({
	isOpen,
	onOpenChange,
	parameters,
}: PreviewDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className=" overflow-hidden flex flex-col">
				<DialogHeader className="pb-6 flex-shrink-0">
					<DialogTitle className="text-xl font-semibold text-gray-900">
						Value Calculator Parameter Preview
					</DialogTitle>
				</DialogHeader>

				<DialogDescription></DialogDescription>

				<div className="flex-1 overflow-y-auto pr-2 space-y-6"></div>
			</DialogContent>
		</Dialog>
	);
}
