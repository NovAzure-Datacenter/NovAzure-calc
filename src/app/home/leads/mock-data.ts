export interface Lead {
	id: string;
	first_name: string;
	last_name: string;
	contact_email: string;
	contact_phone: string;
	created_at: string;
	created_by: string;
	client_id: string;
	associated_scenarios: string[];
	last_contacted: string;
	notes: string;
}

export const mockLeads: Lead[] = [
	{
		id: "lead_001",
		first_name: "Sarah",
		last_name: "Johnson",
		contact_email: "sarah.johnson@techcorp.com",
		contact_phone: "+1 (555) 123-4567",
		created_at: "2024-01-15T10:30:00Z",
		created_by: "6867fde0df81532d965e08ff",
		client_id: "686834a57d2a3dc8bb13b486",
		associated_scenarios: ["scenario_001", "scenario_002"],
		last_contacted: "2024-01-20T14:45:00Z",
		notes:
			"Interested in cloud migration services. Follow up scheduled for next week.",
	},
	{
		id: "lead_002",
		first_name: "Michael",
		last_name: "Chen",
		contact_email: "michael.chen@startup.io",
		contact_phone: "+1 (555) 234-5678",
		created_at: "2024-01-12T09:15:00Z",
		created_by: "6867fde0df81532d965e08ff",
		client_id: "686834a57d2a3dc8bb13b486",
		associated_scenarios: ["scenario_003"],
		last_contacted: "2024-01-18T16:20:00Z",
		notes: "Looking for AI integration solutions. Budget: $50k-100k.",
	},
	{
		id: "lead_003",
		first_name: "Emily",
		last_name: "Rodriguez",
		contact_email: "emily.rodriguez@retailchain.com",
		contact_phone: "+1 (555) 345-6789",
		created_at: "2024-01-10T11:45:00Z",
		created_by: "user_001",
		client_id: "client_001",
		associated_scenarios: ["scenario_004", "scenario_005", "scenario_006"],
		last_contacted: "2024-01-22T10:30:00Z",
		notes:
			"Enterprise retail client. Multiple store locations need digital transformation.",
	},
	{
		id: "lead_004",
		first_name: "David",
		last_name: "Thompson",
		contact_email: "david.thompson@fintech.com",
		contact_phone: "+1 (555) 456-7890",
		created_at: "2024-01-08T14:20:00Z",
		created_by: "user_003",
		client_id: "client_003",
		associated_scenarios: ["scenario_007"],
		last_contacted: "2024-01-19T13:15:00Z",
		notes:
			"Fintech startup. Need compliance and security solutions. High priority.",
	},
	{
		id: "lead_005",
		first_name: "Lisa",
		last_name: "Wang",
		contact_email: "lisa.wang@healthcare.org",
		contact_phone: "+1 (555) 567-8901",
		created_at: "2024-01-05T08:30:00Z",
		created_by: "user_002",
		client_id: "client_002",
		associated_scenarios: ["scenario_008", "scenario_009"],
		last_contacted: "2024-01-21T15:45:00Z",
		notes:
			"Healthcare organization. HIPAA compliance required. Large project scope.",
	},
	{
		id: "lead_006",
		first_name: "James",
		last_name: "Williams",
		contact_email: "james.williams@manufacturing.co",
		contact_phone: "+1 (555) 678-9012",
		created_at: "2024-01-03T12:00:00Z",
		created_by: "user_001",
		client_id: "client_001",
		associated_scenarios: ["scenario_010"],
		last_contacted: "2024-01-17T09:20:00Z",
		notes: "Manufacturing company. Looking for IoT and automation solutions.",
	},
	{
		id: "lead_007",
		first_name: "Maria",
		last_name: "Garcia",
		contact_email: "maria.garcia@education.edu",
		contact_phone: "+1 (555) 789-0123",
		created_at: "2024-01-01T16:45:00Z",
		created_by: "user_003",
		client_id: "client_003",
		associated_scenarios: ["scenario_011", "scenario_012"],
		last_contacted: "2024-01-16T11:30:00Z",
		notes: "University IT department. Need student portal and LMS integration.",
	},
	{
		id: "lead_008",
		first_name: "Robert",
		last_name: "Anderson",
		contact_email: "robert.anderson@logistics.net",
		contact_phone: "+1 (555) 890-1234",
		created_at: "2023-12-28T10:15:00Z",
		created_by: "user_002",
		client_id: "client_002",
		associated_scenarios: ["scenario_013"],
		last_contacted: "2024-01-15T14:00:00Z",
		notes:
			"Logistics company. Supply chain optimization and tracking systems needed.",
	},
	{
		id: "lead_009",
		first_name: "Jennifer",
		last_name: "Taylor",
		contact_email: "jennifer.taylor@consulting.com",
		contact_phone: "+1 (555) 901-2345",
		created_at: "2023-12-25T13:30:00Z",
		created_by: "user_001",
		client_id: "client_001",
		associated_scenarios: ["scenario_014", "scenario_015"],
		last_contacted: "2024-01-14T16:45:00Z",
		notes: "Management consulting firm. Need CRM and project management tools.",
	},
	{
		id: "lead_010",
		first_name: "Christopher",
		last_name: "Brown",
		contact_email: "chris.brown@realestate.com",
		contact_phone: "+1 (555) 012-3456",
		created_at: "2023-12-22T09:00:00Z",
		created_by: "user_003",
		client_id: "client_003",
		associated_scenarios: ["scenario_016"],
		last_contacted: "2024-01-13T12:15:00Z",
		notes:
			"Real estate agency. Property management and client portal requirements.",
	},
];
