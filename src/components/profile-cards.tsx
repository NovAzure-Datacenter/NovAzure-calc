import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Phone } from "lucide-react";
import {
	PersonalData,
	CompanyData,
} from "@/app/dashboard/(account)/settings/components/types";

interface PersonalProfileCardProps {
	personalData: PersonalData;
	companyName: string;
}

interface CompanyProfileCardProps {
	companyData: CompanyData;
}

export function PersonalProfileCard({
	personalData,
	companyName,
}: PersonalProfileCardProps) {
	return (
		<Card className="p-6 h-[180px]">
			<div className="flex flex-col space-y-6 md:flex-row md:items-center md:space-x-6 md:space-y-0 h-full">
				<div className="relative">
					<Avatar className="h-24 w-24 border-2 border-border">
						<AvatarImage
							src={personalData.profile_image || "/placeholder.svg"}
							className="object-cover"
						/>
						<AvatarFallback className="text-xl">
							{personalData.first_name[0]}
							{personalData.last_name[0]}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-1 flex-col space-y-4">
					<div className="space-y-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							{personalData.first_name} {personalData.last_name}
						</h2>
						<p className="text-sm text-muted-foreground">
							{companyName || "No company assigned"}
						</p>
						<p className="text-sm text-muted-foreground">
							{personalData.email}
						</p>
					</div>
					<div className="flex flex-wrap gap-4">
						<div className="flex items-center space-x-2">
							<Phone className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								{personalData.mobile_number || "No mobile number"}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<Building2 className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								{personalData.work_number || "No work number"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

export function CompanyProfileCard({ companyData }: CompanyProfileCardProps) {
	return (
		<Card className="p-6 h-[180px]">
			<div className="flex flex-col space-y-6 md:flex-row md:items-center md:space-x-6 md:space-y-0 h-full">
				<div className="relative">
					<Avatar className="h-24 w-24 border-2 border-border">
						<AvatarImage
							src={companyData.logo || "/placeholder.svg"}
							className="object-cover"
						/>
						<AvatarFallback className="text-xl">
							{companyData.companyName?.charAt(0)}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-1 flex-col space-y-4">
					<div className="space-y-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							{companyData.companyName}
						</h2>
						<p className="text-sm text-muted-foreground">
							{companyData.contactEmail}
						</p>
					</div>
					<div className="flex flex-wrap gap-4">
						<div className="flex items-center space-x-2">
							<Phone className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								{companyData.companyPhone || "No contact number"}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<Building2 className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								{companyData.website || "No website"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
