import { Suspense } from "react";
import Loading from "@/components/loading-main";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
	return (
		<Suspense fallback={<Loading />}>
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{/* Dashboard content will be added here */}
				</div>
			</div>
		</Suspense>
	);
}
