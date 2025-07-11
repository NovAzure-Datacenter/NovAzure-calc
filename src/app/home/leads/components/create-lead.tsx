"use client";

import { useState, useEffect, useCallback } from "react";
import {
	Plus,
	User,
	Building2,
	Mail,
	Phone,
	Globe,
	FileText,
	Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface CreateLeadDialogProps {
	onCreate: (lead: any) => void;
	clientId?: string;
}

// Custom PhoneInput wrapper with Tailwind styling
function PhoneInputWrapper({
	value,
	onChange,
	onBlur,
	placeholder,
	...props
}: any) {
	return (
		<div className="relative">
			<PhoneInput
				{...props}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				className="flex items-center border border-input bg-background text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md h-8 [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:gap-1 [&_.PhoneInputCountry]:px-2 [&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountrySelect]:text-xs [&_.PhoneInputCountrySelect]:font-medium [&_.PhoneInputCountrySelect]:text-foreground [&_.PhoneInputCountrySelectArrow]:text-muted-foreground [&_.PhoneInputCountrySelectArrow]:ml-1 [&_.PhoneInputInput]:flex [&_.PhoneInputInput]:h-8 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:px-2 [&_.PhoneInputInput]:text-xs [&_.PhoneInputInput]:ring-offset-background [&_.PhoneInputInput]:placeholder:text-muted-foreground [&_.PhoneInputInput]:focus-visible:outline-none [&_.PhoneInputInput]:focus-visible:ring-0 [&_.PhoneInputInput]:focus-visible:ring-offset-0 [&_.PhoneInputInput]:disabled:cursor-not-allowed [&_.PhoneInputInput]:disabled:opacity-50 [&_.PhoneInputCountryFlag]:w-4 [&_.PhoneInputCountryFlag]:h-4 [&_.PhoneInputCountryIcon]:w-4 [&_.PhoneInputCountryIcon]:h-4"
			/>
		</div>
	);
}

// Optimized Input component with local state
function OptimizedInput({
	id,
	value: propValue,
	onChange,
	onBlur,
	placeholder,
	required = false,
	type = "text",
	className = "text-xs h-8",
}: {
	id: string;
	value: string;
	onChange: (field: string, value: string) => void;
	onBlur?: () => void;
	placeholder: string;
	required?: boolean;
	type?: string;
	className?: string;
}) {
	const [localValue, setLocalValue] = useState(propValue);

	// Update local value when prop changes (e.g., form reset)
	useEffect(() => {
		setLocalValue(propValue);
	}, [propValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocalValue(e.target.value);
	};

	const handleBlur = () => {
		if (localValue !== propValue) {
			onChange(id, localValue);
		}
		onBlur?.();
	};

	return (
		<Input
			id={id}
			value={localValue}
			onChange={handleChange}
			onBlur={handleBlur}
			placeholder={placeholder}
			className={className}
			type={type}
			required={required}
		/>
	);
}

// Contact Information Section
function ContactInformationSection({
	formData,
	onInputChange,
}: {
	formData: any;
	onInputChange: (field: string, value: string) => void;
}) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
				<User className="h-4 w-4" />
				Contact Information
			</h3>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="first_name" className="text-xs font-medium">
						First Name <span className="text-red-500">*</span>
					</Label>
					<OptimizedInput
						id="first_name"
						value={formData.first_name}
						onChange={onInputChange}
						placeholder="First name"
						required
					/>
				</div>
				<div>
					<Label htmlFor="last_name" className="text-xs font-medium">
						Last Name <span className="text-red-500">*</span>
					</Label>
					<OptimizedInput
						id="last_name"
						value={formData.last_name}
						onChange={onInputChange}
						placeholder="Last name"
						required
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="contact_email" className="text-xs font-medium">
						Email <span className="text-red-500">*</span>
					</Label>
					<OptimizedInput
						id="contact_email"
						value={formData.contact_email}
						onChange={onInputChange}
						placeholder="contact@company.com"
						type="email"
						required
					/>
				</div>
				<div>
					<Label htmlFor="contact_phone" className="text-xs font-medium">
						Phone
					</Label>
					<PhoneInputWrapper
						international
						defaultCountry="US"
						value={formData.contact_phone}
						onChange={(value: string) =>
							onInputChange("contact_phone", value || "")
						}
						placeholder="Enter phone number"
					/>
				</div>
			</div>
		</div>
	);
}

// Company Information Section
function CompanyInformationSection({
	formData,
	onInputChange,
}: {
	formData: any;
	onInputChange: (field: string, value: string) => void;
}) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
				<Building2 className="h-4 w-4" />
				Company Information
			</h3>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="company_name" className="text-xs font-medium">
						Company Name
					</Label>
					<OptimizedInput
						id="company_name"
						value={formData.company_name}
						onChange={onInputChange}
						placeholder="Company name"
					/>
				</div>
				<div>
					<Label htmlFor="website" className="text-xs font-medium">
						Website
					</Label>
					<OptimizedInput
						id="website"
						value={formData.website}
						onChange={onInputChange}
						placeholder="https://www.company.com"
						type="url"
					/>
				</div>
			</div>
		</div>
	);
}

// Lead Details Section
function LeadDetailsSection({
	formData,
	onInputChange,
}: {
	formData: any;
	onInputChange: (field: string, value: string) => void;
}) {
	const statusOptions = [
		{ value: "New", label: "New" },
		{ value: "Contacted", label: "Contacted" },
		{ value: "Qualified", label: "Qualified" },
		{ value: "Converted", label: "Converted" },
	];

	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
				<Calendar className="h-4 w-4" />
				Lead Details
			</h3>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="status" className="text-xs font-medium">
						Status
					</Label>
					<Select
						value={formData.status}
						onValueChange={(value) => onInputChange("status", value)}
					>
						<SelectTrigger className="text-xs h-8">
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							{statusOptions.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
									className="text-xs"
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="last_contacted" className="text-xs font-medium">
						Last Contacted
					</Label>
					<OptimizedInput
						id="last_contacted"
						value={formData.last_contacted}
						onChange={onInputChange}
						placeholder="YYYY-MM-DD"
						type="date"
					/>
				</div>
			</div>
		</div>
	);
}

// Notes Section
function NotesSection({
	formData,
	onInputChange,
}: {
	formData: any;
	onInputChange: (field: string, value: string) => void;
}) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
				<FileText className="h-4 w-4" />
				Notes
			</h3>

			<div>
				<Label htmlFor="notes" className="text-xs font-medium">
					Additional Notes
				</Label>
				<Textarea
					id="notes"
					value={formData.notes}
					onChange={(e) => onInputChange("notes", e.target.value)}
					placeholder="Enter any additional notes about this lead..."
					className="text-xs min-h-[80px] resize-none"
				/>
			</div>
		</div>
	);
}

export function CreateLeadDialog({
	onCreate,
	clientId,
}: CreateLeadDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form data
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		contact_email: "",
		contact_phone: "",
		company_name: "",
		website: "",
		status: "New",
		last_contacted: new Date().toISOString().split("T")[0], // Today's date
		notes: "",
		client_id: clientId || "",
		associated_scenarios: [] as string[],
	});

	const handleInputChange = useCallback((field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (
				!formData.first_name.trim() ||
				!formData.last_name.trim() ||
				!formData.contact_email.trim()
			) {
				toast.error("Please fill in all mandatory fields");
				return;
			}

			setIsSubmitting(true);

			try {
				const leadData = {
					first_name: formData.first_name.trim(),
					last_name: formData.last_name.trim(),
					contact_email: formData.contact_email.trim(),
					contact_phone: formData.contact_phone.trim(),
					company_name: formData.company_name.trim(),
					website: formData.website.trim(),
					status: formData.status,
					last_contacted: formData.last_contacted,
					notes: formData.notes.trim(),
					client_id: formData.client_id,
					associated_scenarios: formData.associated_scenarios,
				};

				// Call the onCreate callback
				onCreate(leadData);

				// Reset form
				setFormData({
					first_name: "",
					last_name: "",
					contact_email: "",
					contact_phone: "",
					company_name: "",
					website: "",
					status: "New",
					last_contacted: new Date().toISOString().split("T")[0],
					notes: "",
					client_id: clientId || "",
					associated_scenarios: [],
				});

				setOpen(false);
				toast.success("Lead created successfully!");
			} catch (error) {
				console.error("Error creating lead:", error);
				toast.error("Failed to create lead");
			} finally {
				setIsSubmitting(false);
			}
		},
		[formData, onCreate, clientId]
	);

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			// Reset form when dialog closes
			setFormData({
				first_name: "",
				last_name: "",
				contact_email: "",
				contact_phone: "",
				company_name: "",
				website: "",
				status: "New",
				last_contacted: new Date().toISOString().split("T")[0],
				notes: "",
				client_id: clientId || "",
				associated_scenarios: [],
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size="sm" className="h-8">
					<Plus className="h-3 w-3 mr-1" />
					Create Lead
				</Button>
			</DialogTrigger>
			<DialogContent className="min-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Plus className="h-5 w-5" />
						Create New Lead
					</DialogTitle>
					<DialogDescription>
						Add a new lead to your pipeline. Fill in the required information
						below.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-6">
						<ContactInformationSection
							formData={formData}
							onInputChange={handleInputChange}
						/>
						<CompanyInformationSection
							formData={formData}
							onInputChange={handleInputChange}
						/>
						<LeadDetailsSection
							formData={formData}
							onInputChange={handleInputChange}
						/>
						<NotesSection
							formData={formData}
							onInputChange={handleInputChange}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create Lead"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
