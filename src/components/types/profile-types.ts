export interface PersonalData {
	first_name: string;
	last_name: string;
	email: string;
	mobile_number?: string;
	work_number?: string;
	profile_image?: string;
}

export interface CompanyData {
	companyName: string;
	contactEmail: string;
	companyPhone?: string;
	website?: string;
	logo?: string;
} 