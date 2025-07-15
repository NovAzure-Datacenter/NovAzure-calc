"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Plus, Eye, ArrowRight, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface DraftDialogProps {
	isOpen: boolean;
	onClose: () => void;
	status: "success" | "error";
	message: string;
	solutionName?: string;
}

export function DraftDialog({
	isOpen,
	onClose,
	status,
	message,
	solutionName,
}: DraftDialogProps) {
	const router = useRouter();

	const handleCreateNew = () => {
		onClose();
		router.push("/home/product-and-solutions/solutions/create");
	};

	const handleViewAll = () => {
		onClose();
		router.push("/home/product-and-solutions/solutions");
	};

	const getStatusIcon = () => {
		if (status === "success") {
			return <CheckCircle className="h-8 w-8 text-green-600" />;
		}
		return <XCircle className="h-8 w-8 text-red-600" />;
	};

	const getStatusTitle = () => {
		if (status === "success") {
			return "Draft Saved Successfully!";
		}
		return "Save Draft Failed";
	};

	const getStatusDescription = () => {
		if (status === "success") {
			return "Your solution has been saved as a draft. You can continue editing it later or submit it for review when ready.";
		}
		return "There was an issue saving your draft. Please try again or contact support if the problem persists.";
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="p-3 rounded-full bg-gray-100">
							{getStatusIcon()}
						</div>
					</div>
					<DialogTitle className="text-xl font-semibold text-center">
						{getStatusTitle()}
					</DialogTitle>
					<DialogDescription className="text-center space-y-3">
						<p className="text-sm text-muted-foreground">
							{getStatusDescription()}
						</p>

						{status === "success" && solutionName && (
							<div className="bg-muted/30 rounded-lg p-3">
								<div className="text-sm font-medium text-gray-900 mb-1">
									Draft Saved
								</div>
								<div className="text-sm text-gray-600">&quot;{solutionName}&quot;</div>
								<Badge
									variant="outline"
									className="text-xs mt-2 bg-gray-100 text-gray-800 border-gray-200"
								>
									Draft
								</Badge>
							</div>
						)}

						{status === "error" && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3">
								<div className="text-sm font-medium text-red-900 mb-1">
									Error Details
								</div>
								<div className="text-sm text-red-700">{message}</div>
							</div>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-3 pt-4">
					{status === "success" ? (
						<>
							<Button onClick={handleCreateNew} className="flex-1" size="lg">
								<Plus className="h-4 w-4 mr-2" />
								Create New
							</Button>
							<Button
								onClick={handleViewAll}
								variant="outline"
								className="flex-1"
								size="lg"
							>
								<Eye className="h-4 w-4 mr-2" />
								View All
							</Button>
						</>
					) : (
						<>
							<Button
								onClick={onClose}
								variant="outline"
								className="flex-1"
								size="lg"
							>
								Try Again
							</Button>
							<Button
								onClick={handleViewAll}
								variant="outline"
								className="flex-1"
								size="lg"
							>
								<Eye className="h-4 w-4 mr-2" />
								View All
							</Button>
						</>
					)}
				</div>

				{status === "success" && (
					<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
						<div className="flex items-start gap-2">
							<ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
							<div className="text-sm">
								<div className="font-medium text-blue-900 mb-1">
									What you can do next?
								</div>
								<div className="text-blue-700 space-y-1">
									<div>• Continue editing your draft later</div>
									<div>• Submit for review when ready</div>
									<div>• Create additional solutions</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
} 