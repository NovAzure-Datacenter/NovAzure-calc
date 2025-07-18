export interface Client {
	id: string;
	logo: string;
	companyName: string;
	website: string;
	mainContactEmail: string;
	userCount: number;
	productCount: number;
	productPendingCount: number;
	scenarioCount: number;
}

export const sampleClients: Client[] = [
	{
		id: "1",
		logo: "Shell",
		companyName: "Shell",
		website: "https://www.shell.com",
		mainContactEmail: "energy.solutions@shell.com",
		userCount: 45,
		productCount: 12,
		productPendingCount: 3,
		scenarioCount: 8,
	},
	{
		id: "2",
		logo: "Zap",
		companyName: "Schneider Electric",
		website: "https://www.se.com",
		mainContactEmail: "digital.solutions@se.com",
		userCount: 78,
		productCount: 18,
		productPendingCount: 5,
		scenarioCount: 15,
	},
	{
		id: "3",
		logo: "Fuel",
		companyName: "Galp",
		website: "https://www.galp.com",
		mainContactEmail: "sustainability@galp.com",
		userCount: 32,
		productCount: 8,
		productPendingCount: 2,
		scenarioCount: 6,
	},
	{
		id: "4",
		logo: "Chrome",
		companyName: "Google",
		website: "https://www.google.com",
		mainContactEmail: "cloud.energy@google.com",
		userCount: 156,
		productCount: 25,
		productPendingCount: 7,
		scenarioCount: 22,
	},
	{
		id: "5",
		logo: "Car",
		companyName: "Tesla",
		website: "https://www.tesla.com",
		mainContactEmail: "energy.products@tesla.com",
		userCount: 89,
		productCount: 15,
		productPendingCount: 4,
		scenarioCount: 12,
	},
	{
		id: "6",
		logo: "Car",
		companyName: "Ford",
		website: "https://www.ford.com",
		mainContactEmail: "ev.solutions@ford.com",
		userCount: 67,
		productCount: 11,
		productPendingCount: 3,
		scenarioCount: 9,
	},
	{
		id: "7",
		logo: "Fuel",
		companyName: "BP",
		website: "https://www.bp.com",
		mainContactEmail: "renewables@bp.com",
		userCount: 54,
		productCount: 14,
		productPendingCount: 6,
		scenarioCount: 11,
	},
	{
		id: "8",
		logo: "Building2",
		companyName: "Siemens",
		website: "https://www.siemens.com",
		mainContactEmail: "smart.infrastructure@siemens.com",
		userCount: 123,
		productCount: 21,
		productPendingCount: 8,
		scenarioCount: 18,
	},
	{
		id: "9",
		logo: "Wind",
		companyName: "Daikin",
		website: "https://www.daikin.com",
		mainContactEmail: "hvac.solutions@daikin.com",
		userCount: 41,
		productCount: 9,
		productPendingCount: 2,
		scenarioCount: 7,
	},
	{
		id: "10",
		logo: "Wrench",
		companyName: "Honeywell",
		website: "https://www.honeywell.com",
		mainContactEmail: "building.tech@honeywell.com",
		userCount: 95,
		productCount: 16,
		productPendingCount: 5,
		scenarioCount: 13,
	},
	{
		id: "11",
		logo: "Server",
		companyName: "General Electric",
		website: "https://www.ge.com",
		mainContactEmail: "industrial.solutions@ge.com",
		userCount: 112,
		productCount: 19,
		productPendingCount: 6,
		scenarioCount: 16,
	},
	{
		id: "12",
		logo: "Factory",
		companyName: "Caterpillar",
		website: "https://www.cat.com",
		mainContactEmail: "power.systems@cat.com",
		userCount: 73,
		productCount: 13,
		productPendingCount: 4,
		scenarioCount: 10,
	},
	{
		id: "13",
		logo: "Zap",
		companyName: "Bosch",
		website: "https://www.bosch.com",
		mainContactEmail: "industrial.iot@bosch.com",
		userCount: 88,
		productCount: 17,
		productPendingCount: 5,
		scenarioCount: 14,
	},
	{
		id: "14",
		logo: "Hospital",
		companyName: "Philips",
		website: "https://www.philips.com",
		mainContactEmail: "healthcare.solutions@philips.com",
		userCount: 134,
		productCount: 23,
		productPendingCount: 7,
		scenarioCount: 19,
	},
	{
		id: "15",
		logo: "Building2",
		companyName: "GE Healthcare",
		website: "https://www.gehealthcare.com",
		mainContactEmail: "medical.imaging@ge.com",
		userCount: 97,
		productCount: 15,
		productPendingCount: 4,
		scenarioCount: 12,
	},
	{
		id: "16",
		logo: "Sprout",
		companyName: "John Deere",
		website: "https://www.deere.com",
		mainContactEmail: "precision.ag@johndeere.com",
		userCount: 62,
		productCount: 10,
		productPendingCount: 3,
		scenarioCount: 8,
	},
	{
		id: "17",
		logo: "Droplets",
		companyName: "Bayer Crop Science",
		website: "https://www.cropscience.bayer.com",
		mainContactEmail: "sustainable.ag@bayer.com",
		userCount: 76,
		productCount: 14,
		productPendingCount: 5,
		scenarioCount: 11,
	},
	{
		id: "18",
		logo: "Recycle",
		companyName: "Monsanto",
		website: "https://www.monsanto.com",
		mainContactEmail: "biotech.solutions@monsanto.com",
		userCount: 58,
		productCount: 12,
		productPendingCount: 4,
		scenarioCount: 9,
	},
	{
		id: "19",
		logo: "Building",
		companyName: "Cisco",
		website: "https://www.cisco.com",
		mainContactEmail: "smart.cities@cisco.com",
		userCount: 145,
		productCount: 28,
		productPendingCount: 9,
		scenarioCount: 24,
	},
	{
		id: "20",
		logo: "Chrome",
		companyName: "IBM",
		website: "https://www.ibm.com",
		mainContactEmail: "cognitive.solutions@ibm.com",
		userCount: 167,
		productCount: 31,
		productPendingCount: 11,
		scenarioCount: 27,
	},
	{
		id: "21",
		logo: "ShoppingBag",
		companyName: "Walmart",
		website: "https://www.walmart.com",
		mainContactEmail: "retail.innovation@walmart.com",
		userCount: 234,
		productCount: 35,
		productPendingCount: 12,
		scenarioCount: 31,
	},
	{
		id: "22",
		logo: "Chrome",
		companyName: "Target",
		website: "https://www.target.com",
		mainContactEmail: "sustainability@target.com",
		userCount: 98,
		productCount: 18,
		productPendingCount: 6,
		scenarioCount: 15,
	},
	{
		id: "23",
		logo: "Droplets",
		companyName: "Tesco",
		website: "https://www.tesco.com",
		mainContactEmail: "energy.efficiency@tesco.com",
		userCount: 87,
		productCount: 16,
		productPendingCount: 5,
		scenarioCount: 13,
	},
	{
		id: "24",
		logo: "Ship",
		companyName: "Maersk",
		website: "https://www.maersk.com",
		mainContactEmail: "sustainable.shipping@maersk.com",
		userCount: 156,
		productCount: 22,
		productPendingCount: 8,
		scenarioCount: 18,
	},
	{
		id: "25",
		logo: "Fuel",
		companyName: "CMA CGM",
		website: "https://www.cma-cgm.com",
		mainContactEmail: "marine.solutions@cma-cgm.com",
		userCount: 92,
		productCount: 15,
		productPendingCount: 5,
		scenarioCount: 12,
	},
	{
		id: "26",
		logo: "Wrench",
		companyName: "Wärtsilä",
		website: "https://www.wartsila.com",
		mainContactEmail: "marine.energy@wartsila.com",
		userCount: 73,
		productCount: 13,
		productPendingCount: 4,
		scenarioCount: 10,
	},
	{
		id: "27",
		logo: "Server",
		companyName: "Intel",
		website: "https://www.intel.com",
		mainContactEmail: "data.center@intel.com",
		userCount: 189,
		productCount: 32,
		productPendingCount: 10,
		scenarioCount: 28,
	},
	{
		id: "28",
		logo: "Building2",
		companyName: "TSMC",
		website: "https://www.tsmc.com",
		mainContactEmail: "semiconductor.solutions@tsmc.com",
		userCount: 134,
		productCount: 24,
		productPendingCount: 7,
		scenarioCount: 20,
	},
	{
		id: "29",
		logo: "Zap",
		companyName: "Samsung",
		website: "https://www.samsung.com",
		mainContactEmail: "smart.energy@samsung.com",
		userCount: 201,
		productCount: 38,
		productPendingCount: 13,
		scenarioCount: 33,
	},
	{
		id: "30",
		logo: "Droplets",
		companyName: "Veolia",
		website: "https://www.veolia.com",
		mainContactEmail: "water.solutions@veolia.com",
		userCount: 118,
		productCount: 20,
		productPendingCount: 6,
		scenarioCount: 16,
	},
];
