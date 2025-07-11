"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	Mail,
	Phone,
	Calendar,
	User as UserIcon,
	Building,
	Target,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUsersByCompany, getCurrentUserClientId } from "@/lib/actions/user/user";
import { UserDetailDialog } from "./user-detail-dialog";

// Interface for MongoDB user data
interface MongoDBUser {
	id: string;
	first_name: string;
	last_name: string;
	email: string; // This is the login email
	original_email: string; // This is the contact email
	role: string;
	company_name: string;
	mobile_number: string;
	work_number: string;
	timezone: string;
	currency: string;
	unit_system: string;
	profile_image: string;
	isVerified: boolean;
	// Add fields that might be available from the database
	created_at?: string;
	last_login?: string;
	assigned_leads?: number;
}

interface UsersTableViewProps {
	refreshTrigger?: number;
	searchQuery?: string;
}

export function UsersTableView({
	refreshTrigger,
	searchQuery = "",
}: UsersTableViewProps) {
	const [users, setUsers] = useState<MongoDBUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filteredUsers, setFilteredUsers] = useState<MongoDBUser[]>([]);
	const [selectedUser, setSelectedUser] = useState<MongoDBUser | null>(null);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	// Load users data from MongoDB
	useEffect(() => {
		const loadUsers = async () => {
			setIsLoading(true);
			try {
				const currentClientId = await getCurrentUserClientId();
				if (!currentClientId) {
					toast.error("Unable to determine current user's company");
					return;
				}
				const result = await getUsersByCompany(currentClientId);
				if (result.error) {
					toast.error(result.error);
					return;
				}

				if (result.success && result.users) {
					setUsers(result.users);
				}
			} catch (error) {
				console.error("Error loading users:", error);
				toast.error("Failed to load users");
			} finally {
				setIsLoading(false);
			}
		};

		loadUsers();
	}, [refreshTrigger]);

	// Filter users based on search query
	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredUsers(users);
			return;
		}

		const filtered = users.filter((user) => {
			const searchLower = searchQuery.toLowerCase();
			return (
				user.first_name.toLowerCase().includes(searchLower) ||
				user.last_name.toLowerCase().includes(searchLower) ||
				user.email.toLowerCase().includes(searchLower) ||
				user.role.toLowerCase().includes(searchLower) ||
				user.company_name.toLowerCase().includes(searchLower)
			);
		});

		setFilteredUsers(filtered);
	}, [users, searchQuery]);

	// Handle click outside dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				openDropdown &&
				!(event.target as Element).closest(".dropdown-container")
			) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [openDropdown]);

	const handleDropdownButtonClick = (e: React.MouseEvent, userId: string) => {
		e.stopPropagation();
		setOpenDropdown(openDropdown === userId ? null : userId);
	};

	const handleDropdownItemClick = async (action: string, userId: string) => {
		setOpenDropdown(null);

		const user = users.find((u) => u.id === userId);
		if (!user) return;

		if (action === "View") {
			setSelectedUser(user);
			setIsDetailDialogOpen(true);
		} else if (action === "Edit") {
			handleEditUser(userId);
		} else if (action === "Delete") {
			handleDeleteUser(userId);
		}
	};

	const handleEditUser = (userId: string) => {
		toast.info(`Edit user ${userId} - functionality to be implemented`);
	};

	const handleDeleteUser = (userId: string) => {
		toast.info(`Delete user ${userId} - functionality to be implemented`);
	};

	const handleEmailClick = (email: string) => {
		window.open(`mailto:${email}`, "_blank");
	};

	const handlePhoneClick = (phone: string) => {
		window.open(`tel:${phone}`, "_blank");
	};

	const handleUserUpdated = async () => {
		// Trigger a refresh of the users list
		// In a real implementation, this would refetch the data
		toast.success("User updated successfully");
	};

	const handleUserDeleted = async () => {
		// Trigger a refresh of the users list
		// In a real implementation, this would refetch the data
		toast.success("User deleted successfully");
		setIsDetailDialogOpen(false);
		setSelectedUser(null);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (isLoading) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-center h-32">
						<div className="text-muted-foreground">Loading users...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<TooltipProvider>
			<div className="h-[calc(100vh-200px)] overflow-y-auto">
            <Card className="rounded-md border p-2">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[200px]">Name</TableHead>
								<TableHead>Contact</TableHead>
								<TableHead>Role & Company</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Timezone</TableHead>
								<TableHead className="w-[50px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-8">
										<div className="text-muted-foreground">
											{searchQuery
												? "No users found matching your search."
												: "No users found."}
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
													<UserIcon className="h-4 w-4 text-primary" />
												</div>
												<div>
													<div className="font-medium">
														{user.first_name} {user.last_name}
													</div>
													<div className="text-sm text-muted-foreground">
														ID: {user.id}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="space-y-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-auto p-0 text-left justify-start"
															onClick={() => handleEmailClick(user.email)}
														>
															<Mail className="h-3 w-3 mr-1" />
															<span className="text-xs">{user.email}</span>
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Click to send email</p>
													</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-auto p-0 text-left justify-start"
															onClick={() => handlePhoneClick(user.mobile_number)}
														>
															<Phone className="h-3 w-3 mr-1" />
															<span className="text-xs">{user.mobile_number || "No phone"}</span>
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Click to call</p>
													</TooltipContent>
												</Tooltip>
											</div>
										</TableCell>
										<TableCell>
											<div className="space-y-1">
												<div className="flex items-center gap-1">
													<UserIcon className="h-3 w-3 text-muted-foreground" />
													<span className="text-sm font-medium">
														{user.role}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Building className="h-3 w-3 text-muted-foreground" />
													<span className="text-xs text-muted-foreground">
														{user.company_name}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													user.isVerified ? "default" : "secondary"
												}
												className="flex items-center gap-1"
											>
												{user.isVerified ? (
													<CheckCircle className="h-3 w-3" />
												) : (
													<XCircle className="h-3 w-3" />
												)}
												{user.isVerified ? "Verified" : "Unverified"}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<Calendar className="h-3 w-3 text-muted-foreground" />
												<span className="text-xs">
													{user.created_at ? formatDate(user.created_at) : "N/A"}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<Calendar className="h-3 w-3 text-muted-foreground" />
												<span className="text-xs">
													{user.timezone || "UTC"}
												</span>
											</div>
										</TableCell>
										<TableCell>
											{/* Custom Simple Dropdown */}
											<div className="relative dropdown-container">
												<Button
													variant="ghost"
													className="h-6 w-6 p-0"
													onClick={(e) =>
														handleDropdownButtonClick(e, user.id)
													}
												>
													<MoreHorizontal className="h-3 w-3" />
												</Button>

												{openDropdown === user.id && (
													<div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px]">
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={() =>
																handleDropdownItemClick("View", user.id)
															}
														>
															<Eye className="h-3 w-3" />
															View Details
														</button>
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
															onClick={() =>
																handleDropdownItemClick("Edit", user.id)
															}
														>
															<Edit className="h-3 w-3" />
															Edit User
														</button>
														<button
															className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-destructive"
															onClick={() =>
																handleDropdownItemClick("Delete", user.id)
															}
														>
															<Trash2 className="h-3 w-3" />
															Delete User
														</button>
													</div>
												)}
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</Card>
			</div>

			{/* User Detail Dialog */}
			<UserDetailDialog
				user={selectedUser}
				open={isDetailDialogOpen}
				onOpenChange={setIsDetailDialogOpen}
				onUserDeleted={handleUserDeleted}
				onUserUpdated={handleUserUpdated}
			/>
		</TooltipProvider>
	);
}
