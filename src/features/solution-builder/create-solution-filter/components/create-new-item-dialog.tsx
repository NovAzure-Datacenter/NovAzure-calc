import { Dialog } from "@/components/ui/dialog";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { stringToIconComponent, iconOptions } from "@/lib/icons/lucide-icons";

interface CreateItemDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	formData: {
		name: string;
		description: string;
		icon: string;
		product_badge?: boolean
	};
	onFormDataChange: (
		data: Partial<{ name: string; description: string; icon: string; product_badge: boolean }>
	) => void;
	onCreate: () => void;
	type: "solution" | "variant";
}

/**
 * CreateItemDialog component - Unified dialog for creating new solutions or variants
 */
export default function CreateItemDialog({
	isOpen,
	onOpenChange,
	formData,
	onFormDataChange,
	onCreate,
	type,
}: CreateItemDialogProps) {
	const [isProductBadgeActive, setIsProductBadgeActive] = useState(formData.product_badge || false);
	const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

	const isVariant = type === "variant";

	const handleClose = () => {
		onOpenChange(false);
		onFormDataChange({
			name: "",
			description: "",
			icon: "",
			product_badge: false,
		});
		if (isVariant) {
			setIsProductBadgeActive(false);
		}
		setIsIconSelectorOpen(false);
	};

	const handleCreate = () => {
		onCreate();
		handleClose();
	};

	const handleIconSelect = (iconName: string) => {
		onFormDataChange({ icon: iconName });
		setIsIconSelectorOpen(false);
	};

	const getDialogContent = () => {
		if (type === "solution") {
			return {
				title: "Create New Solution",
				description:
					"Create a new solution category for your selected industry and technology",
				namePlaceholder: "Enter solution name",
				descriptionPlaceholder: "Describe what this solution does...",
				buttonText: "Create Solution",
				nameField: "solutionName",
				descriptionField: "solutionDescription",
				iconField: "solutionIcon",
			};
		} else {
			return {
				title: "Create Solution Variant",
				description: "Add a new variant to your selected solution category",
				namePlaceholder: "Enter variant name",
				descriptionPlaceholder: "Describe what this variant does...",
				buttonText: "Create Variant",
				nameField: "newVariantName",
				descriptionField: "newVariantDescription",
				iconField: "newVariantIcon",
			};
		}
	};

	const content = getDialogContent();

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-lg p-0 gap-0">
					{/* Header */}
					<DialogHeader className="px-6 py-4 border-b">
						<div className="flex items-center justify-between">
							<div>
								<DialogTitle className="text-lg font-semibold">
									{content.title}
								</DialogTitle>
								<DialogDescription className="text-sm text-muted-foreground mt-1">
									{content.description}
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					{/* Form Content */}
					<div className="px-6 py-4 space-y-4">
						<div className="flex items-center gap-3">
							{/* Icon Selector */}
							<div className="flex-shrink-0">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsIconSelectorOpen(true)}
									className="h-10 w-10 p-0 border-2 border-dashed hover:border-solid hover:border-primary/50 transition-colors"
								>
									{formData.icon ? (
										React.createElement(stringToIconComponent(formData.icon), {
											className: "h-4 w-4 text-muted-foreground",
										})
									) : (
										<Plus className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>
							</div>

							{/* Name Input */}
							<div className="flex-1">
								<Input
									id="item-name"
									value={formData.name}
									onChange={(e) => onFormDataChange({ name: e.target.value })}
									placeholder={content.namePlaceholder}
									className="h-10"
								/>
							</div>

							{/* Product Badge - Only for variants */}
							{isVariant && (
								<div className="flex-shrink-0">
									<Badge
										variant="outline"
										className={`cursor-pointer transition-all duration-200 h-10 px-3 text-sm font-medium rounded-full border-2 border-dashed ${
											isProductBadgeActive
												? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
												: "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
										}`}
										onClick={() => {
											const newValue = !isProductBadgeActive;
											setIsProductBadgeActive(newValue);
											onFormDataChange({ product_badge: newValue });
										}}
									>
										Product
									</Badge>
								</div>
							)}
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Textarea
								id="item-description"
								value={formData.description}
								onChange={(e) =>
									onFormDataChange({
										description: e.target.value,
									})
								}
								placeholder={content.descriptionPlaceholder}
								rows={3}
								className="resize-none"
							/>
						</div>
					</div>

					{/* Footer Actions */}
					<div className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-3">
						<Button variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={!formData.name.trim() || !formData.description.trim()}
						>
							{content.buttonText}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Icon Selector Dialog */}
			<Dialog open={isIconSelectorOpen} onOpenChange={setIsIconSelectorOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Select Icon</DialogTitle>
						<DialogDescription>
							Choose an icon that best represents this {type === "solution" ? "solution" : "variant"}
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
						{iconOptions.map((option) => {
							const isSelected = option.value === formData.icon;
							return (
								<button
									key={option.value}
									onClick={() => handleIconSelect(option.value)}
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
							onClick={() => setIsIconSelectorOpen(false)}
							variant="outline"
							size="sm"
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
