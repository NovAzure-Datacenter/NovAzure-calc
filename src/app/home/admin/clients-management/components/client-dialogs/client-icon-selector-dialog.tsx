import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { iconOptions } from "@/lib/icons/lucide-icons";

interface ClientIconSelectorDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentIcon: string;
	onIconChange: (iconName: string) => void;
}

export function ClientIconSelectorDialog({
	open,
	onOpenChange,
	currentIcon,
	onIconChange,
}: ClientIconSelectorDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Select Client Icon</DialogTitle>
					<DialogDescription>
						Choose an icon that best represents this client
					</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
					{iconOptions.map((option) => {
						const isSelected = option.value === currentIcon;
						return (
							<button
								key={option.value}
								onClick={() => {
									onIconChange(option.value);
									onOpenChange(false);
								}}
								className={`p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
									isSelected
										? "border-primary bg-primary/10"
										: "border-border hover:border-primary/50"
								}`}
							>
								<div className="flex flex-col items-center gap-2">
									<option.icon
										className={`h-8 w-8 ${
											isSelected ? "text-primary" : "text-muted-foreground"
										}`}
									/>
								</div>
							</button>
						);
					})}
				</div>
				<div className="flex justify-end mt-4 pt-4 border-t">
					<Button
						onClick={() => onOpenChange(false)}
						variant="outline"
						size="sm"
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
