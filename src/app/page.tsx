import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}else{
		redirect("/home/dashboard");
	}
	//Old Home Page
	// <div className="flex flex-col items-center w-full">
	// 		{/* <Navbar />
	// 		<Hero /> */}
	// 		{/* <Features />
	// 		<DataSecurity />
	// 		<Stats />
	// 		<CaseStudies />
	// 		<Testimonials />
	// 		<CTA /> */}
	// 		{/* <Footer /> */}
	// 		<UnderConstruction/>
	// 	</div>
	
}
