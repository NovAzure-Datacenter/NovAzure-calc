import { Suspense } from "react";
import { LoginForm } from "@/app/(auth)/login/components/login-form";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page() {

	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/home/dashboard");
	}

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Suspense fallback={
					<div className="flex items-center justify-center p-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				}>
					<LoginForm />
				</Suspense>
			</div>
		</div>
	);
}
