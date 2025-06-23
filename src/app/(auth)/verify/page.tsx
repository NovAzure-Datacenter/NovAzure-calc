import { Suspense } from "react";
import { VerifyAccountForm } from "@/app/(auth)/verify/components/verify-account-form";

export default function VerifyAccountPage() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Suspense fallback={
					<div className="flex items-center justify-center p-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				}>
					<VerifyAccountForm />
				</Suspense>
			</div>
		</div>
	);
}
