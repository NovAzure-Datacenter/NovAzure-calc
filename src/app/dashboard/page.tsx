import { Suspense } from "react";
import Loading from "@/components/loading-main";
import UnderConstruction from "@/components/under-construction";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
	return (
		<Suspense fallback={<Loading />}>
			<UnderConstruction/>
		</Suspense>
	);
}
