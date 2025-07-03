"use client";

import { useState } from "react";
import { Bug, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cleanupIndustryCompanies } from "@/lib/actions/industry/industry";

type AccountType = "novazure-superuser" | "novazure-user" | "company-admin" | "company-user";

interface SidebarDebugPanelProps {
	sideBarType: AccountType;
	setSideBarType: (type: AccountType) => void;
	originalAccountType?: string;
}

export function SidebarDebugPanel({ 
	sideBarType, 
	setSideBarType,
	originalAccountType 
}: SidebarDebugPanelProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isCleaning, setIsCleaning] = useState(false);

	if (process.env.NODE_ENV === "production") {
		return null;
	}

	const handleCleanupIndustries = async () => {
		setIsCleaning(true);
		try {
			const result = await cleanupIndustryCompanies();
			
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(
					`Cleaned up ${result.cleanedCount} text-based entries from ${result.totalIndustries} industries!`
				);
			}
		} catch (error) {
			console.error("Error during cleanup:", error);
			toast.error("Failed to clean up industries");
		} finally {
			setIsCleaning(false);
		}
	};

	return (
		<div className="fixed top-4 right-4 z-50">
			{isVisible && (
				<Card className="w-80 shadow-lg border-2 border-orange-200">
					<CardContent className="">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2">
								<Bug className="h-4 w-4 text-orange-600" />
								<span className="text-sm font-semibold text-orange-800">
									Sidebar Debug Panel
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsVisible(false)}
								className="h-6 w-6 p-0"
							>
								×
							</Button>
						</div>
						
						<div className="space-y-3">
							<div>
								<label className="text-xs font-medium text-gray-700 mb-1 block">
									Account Type
								</label>
								<Select value={sideBarType} onValueChange={(value: AccountType) => setSideBarType(value)}>
									<SelectTrigger className="h-8 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="novazure-superuser">NovAzure Super User</SelectItem>
										<SelectItem value="novazure-user">NovAzure User</SelectItem>
										<SelectItem value="company-admin">Company Admin</SelectItem>
										<SelectItem value="company-user">Company User</SelectItem>
									</SelectContent>
								</Select>
								<span className="text-xs text-gray-500">
									Current Account Type: {sideBarType}
								</span>
								{originalAccountType && originalAccountType !== sideBarType && (
									<div>
									<span className="text-xs text-orange-600 block">
										Original: {originalAccountType}
									</span>
									<span className="text-xs text-orange-600 block">
										Mapped: {sideBarType}
									</span>
									</div>
								)}
							</div>
							
							<div>
								<label className="text-xs font-medium text-gray-700 mb-1 block">
									Database Cleanup
								</label>
								<Button
									variant="outline"
									size="sm"
									onClick={handleCleanupIndustries}
									disabled={isCleaning}
									className="w-full h-8 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
								>
									<Trash2 className="h-3 w-3 mr-1" />
									{isCleaning ? "Cleaning..." : "Clean Industry Companies"}
								</Button>
								<span className="text-xs text-gray-500 block mt-1">
									Removes text-based entries from industry companies arrays
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
			
			{!isVisible && (
				<Button
					variant="outline"
					size="sm"
					onClick={() => setIsVisible(true)}
					className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
				>
					<Bug className="h-4 w-4 mr-1" />
					Sidebar Debug
				</Button>
			)}
		</div>
	);
} 