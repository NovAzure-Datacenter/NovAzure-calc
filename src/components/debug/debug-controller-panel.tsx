"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Bug } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccountType } from "@/contexts/account-type-context-debug";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface DebugControllerPanelProps {
	children?: React.ReactNode;
}

export function DebugControllerPanel({ children }: DebugControllerPanelProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	return (
		<div className="fixed top-4 right-4 z-50">
			<div
				className={cn(
					"flex flex-col gap-2 rounded-lg border bg-background p-2 shadow-sm transition-all duration-200 ",
					isExpanded ? "w-80" : "w-auto"
				)}
      
			>
				<div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
					<div className="flex items-center gap-2">
						<Bug className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Debug Controls</span>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="h-6 w-6"
						
					>
						{isExpanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</Button>
				</div>
				{isExpanded && (
					<div className="space-y-2 border-t pt-2">
						<AccountTypeDropdown />
						{children}
					</div>
				)}
			</div>
		</div>
	);
}

function AccountTypeDropdown() {
	const { accountType, setAccountType } = useAccountType();

	return (
		<div className="flex flex-col gap-1.5">
			<Label className="text-xs text-muted-foreground">Account Type</Label>
			<div className="flex items-center gap-2">
				<Select
					value={accountType}
					onValueChange={(value: "super-admin" | "user") =>
						setAccountType(value)
					}
				>
					<SelectTrigger className="h-8 w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="super-admin">Super Admin</SelectItem>
						<SelectItem value="user">User</SelectItem>
					</SelectContent>
				</Select>
				<Badge
					variant={accountType === "super-admin" ? "default" : "secondary"}
					className="h-8"
				>
					{accountType === "super-admin" ? "Super Admin" : "User"}
				</Badge>
			</div>
		</div>
	);
}
