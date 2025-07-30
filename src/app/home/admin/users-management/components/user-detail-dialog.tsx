import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Edit,
	Trash2,
	Save,
	X,
	User as UserIcon,
	Mail,
	Phone,
	Calendar,
	Building,
	Target,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

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
	created_at?: string;
	last_login?: string;
	assigned_leads?: number;
}

interface UserDetailDialogProps {
	user: MongoDBUser | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUserDeleted?: () => Promise<void>;
	onUserUpdated?: () => Promise<void>;
	initialEditMode?: boolean;
}

export function UserDetailDialog({
	user,
	open,
	onOpenChange,
	onUserDeleted,
	onUserUpdated,
	initialEditMode = false,
}: UserDetailDialogProps) {
	const [isEditing, setIsEditing] = useState(initialEditMode);
	const [editedUser, setEditedUser] = useState<MongoDBUser | null>(null);
	const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Initialize edited user when editing starts
	useEffect(() => {
		if (user && open) {
			setEditedUser({ ...user });
		}
	}, [user, open]);

	// Set initial edit mode when dialog opens
	useEffect(() => {
		if (open) {
			setIsEditing(initialEditMode);
		}
	}, [open, initialEditMode]);

	const handleEdit = () => {
		setIsEditing(true);
		if (user) {
			setEditedUser({ ...user });
		}
	};

	const handleSave = async () => {
		if (!editedUser || !user) return;

		setIsSaving(true);
		try {
			// In a real implementation, this would call an API
			// For now, we'll just simulate the update
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			// Update the original user object
			Object.assign(user, editedUser);
			toast.success("User updated successfully!");
			setIsEditing(false);

			if (onUserUpdated) {
				await onUserUpdated();
			}
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Failed to update user. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		if (user) {
			setEditedUser({ ...user });
		}
	};

	const handleRemove = () => {
		setIsConfirmingRemove(true);
	};

	const handleFieldChange = (field: keyof MongoDBUser, value: any) => {
		if (!editedUser) return;
		setEditedUser({ ...editedUser, [field]: value });
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleEmailClick = (email: string) => {
		window.open(`mailto:${email}`, "_blank");
	};

	const handlePhoneClick = (phone: string) => {
		window.open(`tel:${phone}`, "_blank");
	};

	const currentUser = isEditing ? editedUser : user;

	// Early return after all hooks
	if (!user || !currentUser) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0">
				<DialogHeader className="pb-4 px-6 pt-6">
					<div>
						<DialogTitle className="text-lg">User Details</DialogTitle>
						<DialogDescription className="text-sm">
							View and manage user information
						</DialogDescription>
					</div>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6">
					<div className="space-y-8">
						{/* User Overview */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">User Overview</h3>
							<div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
								<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
									<UserIcon className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<h4 className="font-medium text-lg">
										{currentUser.first_name} {currentUser.last_name}
									</h4>
									<p className="text-sm text-muted-foreground">ID: {currentUser.id}</p>
								</div>
								<Badge
									variant={currentUser.isVerified ? "default" : "secondary"}
									className="flex items-center gap-1"
								>
									{currentUser.isVerified ? (
										<CheckCircle className="h-3 w-3" />
									) : (
										<XCircle className="h-3 w-3" />
									)}
									{currentUser.isVerified ? "Verified" : "Unverified"}
								</Badge>
							</div>
						</div>

						{/* Contact Information */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Contact Information</h3>
							<div className="grid grid-cols-1 gap-4">
								<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<div className="flex-1">
										<p className="text-sm font-medium">Login Email</p>
										<Button
											variant="link"
											className="h-auto p-0 text-sm"
											onClick={() => handleEmailClick(currentUser.email)}
										>
											{currentUser.email}
										</Button>
									</div>
								</div>
								{currentUser.original_email && currentUser.original_email !== currentUser.email && (
									<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
										<Mail className="h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm font-medium">Contact Email</p>
											<Button
												variant="link"
												className="h-auto p-0 text-sm"
												onClick={() => handleEmailClick(currentUser.original_email)}
											>
												{currentUser.original_email}
											</Button>
										</div>
									</div>
								)}
								<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<div className="flex-1">
										<p className="text-sm font-medium">Phone Number</p>
										<Button
											variant="link"
											className="h-auto p-0 text-sm"
											onClick={() => handlePhoneClick(currentUser.mobile_number)}
										>
											{currentUser.mobile_number || "Not provided"}
										</Button>
									</div>
								</div>
							</div>
						</div>

						{/* Role & Company */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Role & Company</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
									<UserIcon className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Role</p>
										<p className="text-sm text-muted-foreground">{currentUser.role}</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
									<Building className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Company</p>
										<p className="text-sm text-muted-foreground">{currentUser.company_name}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Account Information */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Account Information</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Timezone</p>
										<p className="text-sm text-muted-foreground">
											{currentUser.timezone || "UTC"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Currency</p>
										<p className="text-sm text-muted-foreground">
											{currentUser.currency || "USD"}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Account Information */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Account Information</h3>
							<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium">Date Created</p>
									<p className="text-sm text-muted-foreground">
										{currentUser.created_at ? formatDate(currentUser.created_at) : "N/A"}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Footer with Action Buttons - Always visible when editing */}
				{isEditing && (
					<div className="flex justify-end gap-3 pt-6 border-t mt-6 flex-shrink-0 px-6 pb-6">
						<Button
							variant="outline"
							onClick={handleCancel}
							size="sm"
							disabled={isSaving}
						>
							<X className="h-4 w-4 mr-2" />
							Cancel
						</Button>
						<Button onClick={handleSave} size="sm" disabled={isSaving}>
							<Save className="h-4 w-4 mr-2" />
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				)}

				{/* Footer with Action Buttons - Only visible when not editing */}
				{!isEditing && (
					<div className="flex justify-end gap-3 pt-6 border-t mt-6 flex-shrink-0 px-6 pb-6">
						<Button variant="destructive" onClick={handleRemove} size="sm">
							<Trash2 className="h-4 w-4 mr-2" />
							Remove User
						</Button>
						<Button onClick={handleEdit} size="sm">
							<Edit className="h-4 w-4 mr-2" />
							Edit User
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
