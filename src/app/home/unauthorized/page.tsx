import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
	return (
		<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-50">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
						<AlertTriangle className="h-6 w-6 text-red-600" />
					</div>
					<CardTitle className="text-xl font-semibold text-gray-900">
						Access Denied
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-gray-600 mb-4">
						You don't have permission to access this page. Please contact your
						administrator if you believe this is an error.
					</p>
					<Link href="/home">
						<Button>Return Home</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
