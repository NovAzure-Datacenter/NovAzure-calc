"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
	type Row,
	type Column,
	type HeaderGroup,
	type Header,
	type Cell,
} from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronDown,
	MoreHorizontal,
	UserIcon,
	CheckCircle2,
	XCircle,
	Delete,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CompanyProfileCard } from "@/components/profile-cards";
import { Separator } from "@/components/ui/separator";
import { getCompanyDetails } from "@/lib/actions/company/company";
import { useUser } from "@/hooks/useUser";
import { Badge } from "@/components/ui/badge";
import { CompanyData } from "@/app/dashboard/(account)/settings/components/types";
import AddUserDialog from "./components/addUser-dialog";
import { useState } from "react";
import { useEffect } from "react";
import { getUsersByCompany, deleteUser } from "@/lib/actions/user/user";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export type User = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	role: "admin" | "user";
	company_name: string;
	mobile_number?: string;
	work_number?: string;
	timezone?: string;
	currency?: string;
	unit_system?: string;
	profile_image?: string;
	isVerified?: boolean;
};

const createColumns = (
	handleDeleteUser: (userId: string) => Promise<void>
): ColumnDef<User>[] => [
	{
		accessorKey: "profile_image",
		header: "",
		cell: ({ row }: { row: Row<User> }) => (
			<Avatar className="h-10 w-10">
				<AvatarImage src={row.original.profile_image || "/placeholder.svg"} />
				<AvatarFallback>
					<UserIcon className="h-4 w-4" />
				</AvatarFallback>
			</Avatar>
		),
	},
	{
		accessorKey: "name",
		header: ({ column }: { column: Column<User> }) => {
			return (
				<Button
					variant="ghost"
					className="-translate-x-3 "
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }: { row: Row<User> }) => (
			<div className="capitalize text-xs">
				{row.original.first_name} {row.original.last_name}
			</div>
		),
		sortingFn: (rowA, rowB) => {
			return rowA.original.first_name.localeCompare(rowB.original.first_name);
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }: { row: Row<User> }) => (
			<div className="capitalize text-xs">{row.getValue("role")}</div>
		),
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }: { row: Row<User> }) => (
			<div className="lowercase text-xs">{row.getValue("email")}</div>
		),
	},
	{
		accessorKey: "company_name",
		header: "Company",
		cell: ({ row }: { row: Row<User> }) => (
			<div className="capitalize text-xs">{row.original.company_name}</div>
		),
	},
	{
		accessorKey: "mobile_number",
		header: "Phone Number",
		cell: ({ row }: { row: Row<User> }) => (
			<div className="capitalize text-xs">
				{row.original.mobile_number || "N/A"}
			</div>
		),
	},
	{
		accessorKey: "isVerified",
		header: "Verified",
		cell: ({ row }: { row: Row<User> }) => {
			const isVerified = row.getValue("isVerified") as boolean;
			return (
				<Badge
					variant={isVerified ? "default" : "secondary"}
					className={`flex items-center gap-1 text-xs ${
						isVerified ? "bg-green-500 hover:bg-green-600" : ""
					}`}
				>
					{isVerified ? (
						<>
							<CheckCircle2 className="h-3 w-3" />
							Verified
						</>
					) : (
						<>
							<XCircle className="h-3 w-3" />
							Unverified
						</>
					)}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }: { row: Row<User> }) => {
			const [isOpen, setIsOpen] = useState(false);
			const { user } = useUser();
			const isCurrentUser = user?._id === row.original.id;

			return (
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							disabled={isCurrentUser}
							className={isCurrentUser ? "cursor-not-allowed" : ""}
						>
							<Trash2
								className={`h-4 w-4 ${
									isCurrentUser ? "text-muted-foreground" : "text-red-500"
								}`}
							/>
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete User</DialogTitle>
							<DialogDescription>
								Are you sure you want to remove this user? This action is
								permanent and cannot be reversed.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={() => {
									handleDeleteUser(row.original.id);
									setIsOpen(false);
								}}
							>
								Delete
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);
		},
	},
];

export default function CompanyUsersPage() {
	const [data, setData] = useState<User[]>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [companyData, setCompanyData] = useState<CompanyData | null>(null);
	const [isLoadingCompany, setIsLoadingCompany] = useState(true);
	const [isLoadingUsers, setIsLoadingUsers] = useState(true);
	const [companyError, setCompanyError] = useState<string | null>(null);
	const [usersError, setUsersError] = useState<string | null>(null);
	const { user } = useUser();

	const handleDeleteUser = async (userId: string) => {
		try {
			const result = await deleteUser(userId);

			if (result.error) {
				toast.error("Failed to delete user", {
					description: result.error,
				});
				return;
			}

			// Remove the user from the local state
			setData((prev) => prev.filter((user) => user.id !== userId));

			toast.success("User deleted successfully");
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Failed to delete user", {
				description: "An unexpected error occurred",
			});
		}
	};

	const columns = createColumns(handleDeleteUser);

	const formatColumnId = (id: string) => {
		return id
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	useEffect(() => {
		async function fetchCompanyData() {
			if (user?.company_id) {
				try {
					setIsLoadingCompany(true);
					setCompanyError(null);
					const result = await getCompanyDetails(user.company_id);
					if (result.success && result.company) {
						const transformedData: CompanyData = {
							companyId: result.company._id.toString(),
							companyName: result.company.name || "",
							companyAddress: result.company.address || "",
							companyPhone: result.company.contact_number || "",
							website: result.company.website || "",
							currency: result.company.currency || "",
							logo: result.company.logo || "",
							industry: result.company.industry || "",
							contactEmail: result.company.contact_email || "",
							country: result.company.country || "",
						};
						setCompanyData(transformedData);
					} else {
						console.error("Failed to fetch company:", result.error);
						setCompanyError(result.error || "Failed to fetch company details");
					}
				} catch (error) {
					console.error("Error fetching company:", error);
					setCompanyError("An error occurred while fetching company details");
				} finally {
					setIsLoadingCompany(false);
				}
			} else {
				setIsLoadingCompany(false);
			}
		}
		fetchCompanyData();
	}, [user?.company_id]);

	useEffect(() => {
		async function fetchUsers() {
			if (user?.company_id) {
				try {
					setIsLoadingUsers(true);
					setUsersError(null);
					const result = await getUsersByCompany(user.company_id);
					if (result.success && result.users) {
						setData(result.users);
					} else {
						console.error("Failed to fetch users:", result.error);
						setUsersError(result.error || "Failed to fetch users");
					}
				} catch (error) {
					console.error("Error fetching users:", error);
					setUsersError("An error occurred while fetching users");
				} finally {
					setIsLoadingUsers(false);
				}
			} else {
				setIsLoadingUsers(false);
			}
		}
		fetchUsers();
	}, [user?.company_id]);

	const handleAddUser = (newUser: User) => {
		setData((prev) => [...prev, newUser]);
	};

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: (row, columnId, filterValue) => {
			const searchValue = filterValue.toLowerCase();
			const email = row.original.email.toLowerCase();
			const firstName = row.original.first_name.toLowerCase();
			const lastName = row.original.last_name.toLowerCase();
			const role = row.original.role.toLowerCase();
			const companyName = row.original.company_name.toLowerCase();
			const fullName = `${firstName} ${lastName}`;
			const isVerified = row.original.isVerified ? "verified" : "unverified";

			// Handle verification status search separately
			if (searchValue === "verified" || searchValue === "unverified") {
				return isVerified === searchValue;
			}

			return (
				email.includes(searchValue) ||
				fullName.includes(searchValue) ||
				role.includes(searchValue) ||
				companyName.includes(searchValue)
			);
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
	});

	return (
		<div className="space-y-6">
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Header */}
				<div className="space-y-2 mt-6">
					<h1 className="text-3xl font-bold tracking-tight">Company Users</h1>
					<p className="text-muted-foreground">
						Manage your company users and their permissions.
					</p>

					{isLoadingCompany ? (
						<div className="flex items-center justify-center p-4">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
						</div>
					) : companyError ? (
						<div className="text-destructive p-4">{companyError}</div>
					) : companyData ? (
						<>
							<CompanyProfileCard companyData={companyData} />
							<Separator />
						</>
					) : (
						<div className="text-muted-foreground p-4">
							No company data available
						</div>
					)}

					<Card className="p-6">
						<div className="flex flex-1 items-center justify-between mb-4">
							<Input
								placeholder="Search by name, email, role, company or verification status..."
								value={globalFilter ?? ""}
								onChange={(event) => setGlobalFilter(event.target.value)}
								className="max-w-sm"
							/>
							<div className="flex items-center space-x-2">
								<AddUserDialog
									onAddUser={handleAddUser}
									companyData={companyData}
								/>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline">
											Columns <ChevronDown className="ml-2 h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{table
											.getAllColumns()
											.filter((column: Column<User>) => column.getCanHide())
											.map((column: Column<User>) => {
												return (
													<DropdownMenuCheckboxItem
														key={column.id}
														className="capitalize"
														checked={column.getIsVisible()}
														onCheckedChange={(value) =>
															column.toggleVisibility(!!value)
														}
													>
														{formatColumnId(column.id)}
													</DropdownMenuCheckboxItem>
												);
											})}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<div className="rounded-md border">
							{isLoadingUsers ? (
								<div className="flex items-center justify-center p-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
								</div>
							) : usersError ? (
								<div className="text-destructive p-4">{usersError}</div>
							) : (
								<Table>
									<TableHeader className="bg-muted">
										{table
											.getHeaderGroups()
											.map((headerGroup: HeaderGroup<User>) => (
												<TableRow key={headerGroup.id}>
													{headerGroup.headers.map(
														(header: Header<User, unknown>) => {
															return (
																<TableHead key={header.id}>
																	{header.isPlaceholder
																		? null
																		: flexRender(
																				header.column.columnDef.header,
																				header.getContext()
																		  )}
																</TableHead>
															);
														}
													)}
												</TableRow>
											))}
									</TableHeader>
									<TableBody>
										{table.getRowModel().rows?.length ? (
											table.getRowModel().rows.map((row: Row<User>) => (
												<TableRow
													key={row.id}
													data-state={row.getIsSelected() && "selected"}
												>
													{row
														.getVisibleCells()
														.map((cell: Cell<User, unknown>) => (
															<TableCell key={cell.id}>
																{flexRender(
																	cell.column.columnDef.cell,
																	cell.getContext()
																)}
															</TableCell>
														))}
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan={columns.length}
													className="h-24 text-center"
												>
													No results.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							)}
						</div>
						<div className="flex items-center justify-end space-x-2 py-4">
							<div className="text-muted-foreground flex-1 text-sm">
								{table.getFilteredSelectedRowModel().rows.length} of{" "}
								{table.getFilteredRowModel().rows.length} row(s) selected.
							</div>
							<div className="space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
								>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
								>
									Next
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
