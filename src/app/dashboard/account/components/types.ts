export interface PersonalData {
	first_name: string;
	last_name: string;
	email: string;
	timezone: string;
	currency: string;
	unit_system: string;
	profile_image: string;
	mobile_number: string;
	work_number: string;
	role: string;
}

export interface CompanyData {
	companyId: string;
	companyName: string;
	companyAddress: string;
	companyPhone: string;
	website: string;
	currency: string;
	logo: string;
	industry: string;
	contactEmail: string;
	country: string;
}

export interface BillingData {
	plan: string;
	renewalDate: string;
	paymentMethod: string;
	billingEmail: string;
}