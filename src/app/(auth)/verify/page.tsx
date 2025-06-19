import { VerifyAccountForm } from "@/app/(auth)/verify/components/verify-account-form";

export default function VerifyAccountPage() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<VerifyAccountForm />
			</div>
		</div>
	);
}
