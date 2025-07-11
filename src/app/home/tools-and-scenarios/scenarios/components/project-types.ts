export interface ProjectData {
	id: string;
	name: string;
	description: string;
	status: "active" | "completed" | "on-hold" | "cancelled";
	start_date: string;
	end_date?: string;
	client_id: string;
	created_by: string;
	created_at: string;
	updated_at: string;
	scenario_count: number;
	industry: string[];
	technology: string[];
	project_manager?: string;
	budget?: number;
	location?: string;
	priority?: "critical" | "high" | "medium" | "low";
} 