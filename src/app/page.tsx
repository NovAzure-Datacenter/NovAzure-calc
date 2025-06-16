import CTA from "./_landing/components/cta/cta";
import DataSecurity from "./_landing/components/data-security/data-security";
import Features from "./_landing/components/features/features";
import Footer from "./_landing/components/footer/footer";
import Hero from "./_landing/components/hero/hero";
import CaseStudies from "./_landing/components/case-studies/case-studies";
import Stats from "./_landing/components/stats/stats";
import Testimonials from "./_landing/components/testimonials/testimonials";
import Navbar from "@/components/navbar/navbar";

export default function Home() {
	return (
		<div className="flex flex-col items-center w-full">
			<Navbar />
			<Hero />
			<Features />
			<DataSecurity />
			<Stats />
			<CaseStudies />
			<Testimonials />
			<CTA />
			<Footer />
		</div>
	);
}
