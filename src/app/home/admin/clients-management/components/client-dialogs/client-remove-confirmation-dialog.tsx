import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteClient } from "@/lib/actions/clients/clients";
import { toast } from "sonner";
import type { ClientData } from "@/lib/actions/clients/clients";

interface ClientRemoveConfirmationDialogProps {
	client: ClientData | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onClientDeleted?: () => Promise<void>;
}

export function ClientRemoveConfirmationDialog({
	client,
	open,
	onOpenChange,
	onClientDeleted,
}: ClientRemoveConfirmationDialogProps) {
	const [isRemoving, setIsRemoving] = useState(false);

	const handleRemove = async () => {
		if (!client) return;

		setIsRemoving(true);
		try {
			const result = await deleteClient(client.id!);

			if (result.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Client removed successfully!");
			onOpenChange(false);

			if (onClientDeleted) {
				await onClientDeleted();
			}
		} catch (error) {
			toast.error("An unexpected error occurred while removing the client");
		} finally {
			setIsRemoving(false);
		}
	};

	if (!client) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						Remove Client
					</DialogTitle>
					<DialogDescription className="space-y-2">
						<p>
							Are you sure you want to remove the client{" "}
							<strong>&quot;{client.company_name}&quot;</strong>?
						</p>
						<p className="text-sm text-muted-foreground">
							This will permanently delete the client and all associated data
						</p>
						<p className="text-sm font-medium text-destructive">
							This action cannot be undone.
						</p>
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-3 pt-6 border-t mt-6">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						size="sm"
						disabled={isRemoving}
					>
						Cancel
					</Button>
					<Button
						onClick={handleRemove}
						size="sm"
						variant="destructive"
						disabled={isRemoving}
					>
						<Trash2 className="h-4 w-4 mr-2" />
						{isRemoving ? "Removing..." : "Remove Client"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
