export const companySizeOptions = [
	{ value: "1-10", label: "1-10 employees" },
	{ value: "11-50", label: "11-50 employees" },
	{ value: "51-100", label: "51-100 employees" },
	{ value: "101-250", label: "101-250 employees" },
	{ value: "251-500", label: "251-500 employees" },
	{ value: "500+", label: "500+ employees" },
];

export const clientStatusOptions = [
	{ value: "active", label: "Active" },
	{ value: "prospect", label: "Prospect" },
	{ value: "on-hold", label: "On Hold" },
	{ value: "inactive", label: "Inactive" },
];

export const timezoneOptions = [
	{ value: "UTC", label: "UTC" },
	{ value: "EST", label: "Eastern Standard Time" },
	{ value: "CST", label: "Central Standard Time" },
	{ value: "MST", label: "Mountain Standard Time" },
	{ value: "PST", label: "Pacific Standard Time" },
	{ value: "GMT", label: "Greenwich Mean Time" },
	{ value: "CET", label: "Central European Time" },
	{ value: "EET", label: "Eastern European Time" },
	{ value: "JST", label: "Japan Standard Time" },
	{ value: "AEST", label: "Australian Eastern Standard Time" },
];

export const getStatusVariant = (status: string) => {
	switch (status) {
		case "active":
			return "default";
		case "prospect":
			return "secondary";
		case "on-hold":
			return "outline";
		case "inactive":
			return "destructive";
		default:
			return "outline";
	}
}; 