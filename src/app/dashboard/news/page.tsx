"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
	Newspaper, 
	ExternalLink, 
	Calendar, 
	User, 
	Building2, 
	Zap
} from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface NewsItem {
	id: string;
	title: string;
	content: string;
	author: string;
	date: string;
	category: "company" | "application";
	readTime: string;
	link?: string;
	tags: string[];
	image?: string;
}

const companyNews: NewsItem[] = [
	{
		id: "1",
		title: "Barclays Sustainability Breakfast - NovAzure Partners Participate in Panel Discussion",
		content: "Barclays hosted their first Sustainability Breakfast on the 12th of June, where our Partners Woon-Hui Oh and Philip Cholerton had the opportunity to participate in the panel discussion. The event saw a diverse group of people come together, from small and large businesses, start-ups, and advisors, all of which are striving to drive sustainable change.",
		author: "NovAzure",
		date: "6 hours ago",
		category: "company",
		readTime: "2 min read",
		link: "https://lnkd.in/dQCaaaAP",
		tags: ["Sustainability", "Partnership", "Barclays"],
		image: "/images/news/news1.jpeg"
	},
	{
		id: "2",
		title: "Meet Andrew - Strategic Thinking Rooted in Evidence",
		content: "Our partners and clients look to Andrew for strategic thinking that is rooted in evidence and delivered with precision. He leads with a clear point of view and asks the questions others miss. His perspective helps simplify complex topics while keeping the substance intact. He challenges assumptions and brings sharp judgement to decisions. His insight helps leaders move with confidence.",
		author: "NovAzure",
		date: "5 days ago",
		category: "company",
		readTime: "1 min read",
		link: "https://lnkd.in/djrtBSTR",
		tags: ["Leadership", "Strategy", "Team"],
		image: "/images/news/news2.jpeg"
	}
];

const applicationNews: NewsItem[] = [
	{
		id: "3",
		title: "New Advanced Analytics Dashboard Released",
		content: "We've launched a comprehensive analytics dashboard that provides real-time insights into your data center performance, energy efficiency metrics, and carbon footprint tracking. The new dashboard includes customizable widgets, automated reporting, and predictive analytics capabilities.",
		author: "NovAzure Team",
		date: "2 days ago",
		category: "application",
		readTime: "3 min read",
		tags: ["Analytics", "Dashboard", "Performance"]
	},
	{
		id: "4",
		title: "Enhanced Security Features Now Available",
		content: "We've implemented advanced security measures including multi-factor authentication, role-based access control, and enhanced data encryption. These improvements ensure your sensitive data remains protected while maintaining seamless user experience.",
		author: "NovAzure Team",
		date: "1 week ago",
		category: "application",
		readTime: "2 min read",
		tags: ["Security", "Authentication", "Privacy"]
	},
	{
		id: "5",
		title: "Mobile App Beta Testing Program",
		content: "Join our exclusive beta testing program for the new NovAzure mobile application. Test cutting-edge features including real-time monitoring, push notifications, and offline capabilities. Limited spots available for early access.",
		author: "NovAzure Team",
		date: "1 week ago",
		category: "application",
		readTime: "1 min read",
		tags: ["Mobile", "Beta", "Testing"]
	},
	{
		id: "6",
		title: "API Integration Hub Launch",
		content: "Connect your existing tools and systems seamlessly with our new API Integration Hub. Support for popular platforms including Salesforce, Microsoft Dynamics, and custom REST APIs. Streamline your workflow and eliminate data silos.",
		author: "NovAzure Team",
		date: "2 weeks ago",
		category: "application",
		readTime: "4 min read",
		tags: ["API", "Integration", "Workflow"]
	},
	{
		id: "7",
		title: "Real-time Collaboration Features",
		content: "New collaborative tools allow team members to work together in real-time on projects, share insights, and coordinate efforts seamlessly. Includes live commenting, version control, and instant notifications.",
		author: "NovAzure Team",
		date: "3 weeks ago",
		category: "application",
		readTime: "2 min read",
		tags: ["Collaboration", "Real-time", "Teamwork"]
	},
	{
		id: "8",
		title: "Advanced Reporting Engine",
		content: "Our new reporting engine provides deeper insights with customizable dashboards, automated report generation, and export capabilities in multiple formats including PDF, Excel, and CSV.",
		author: "NovAzure Team",
		date: "1 month ago",
		category: "application",
		readTime: "3 min read",
		tags: ["Reporting", "Analytics", "Export"]
	}
];

export default function NewsPage() {
	const _allNews = [...companyNews, ...applicationNews];

	return (
		<SidebarInset>
			<div className="flex-1 bg-gradient-to-br from-blue-50 to-sky-50 overflow-y-auto">
				<div className="w-full p-8">
					<div className="mx-auto max-w-7xl space-y-8">
						{/* Header */}
						<div className="space-y-2">
							<div className="flex items-center gap-3">
								<Newspaper className="h-8 w-8 text-blue-600" />
								<h1 className="text-3xl font-bold tracking-tight">News & Updates</h1>
							</div>
							<p className="text-muted-foreground">
								Stay informed about NovAzure company news and application updates.
							</p>
						</div>

				
						{/* News Sections */}
						<div className="grid gap-8 lg:grid-cols-3">
							{/* Company News */}
							<div className="lg:col-span-2 space-y-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Building2 className="h-5 w-5 text-blue-600" />
										<h2 className="text-xl font-semibold">Company News</h2>
									</div>
									<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
										{companyNews.length} articles
									</Badge>
								</div>

								<div className="space-y-6">
									{companyNews.map((news) => (
										<Card key={news.id} className="hover:shadow-md transition-shadow overflow-hidden">
											<div className="flex flex-col md:flex-row">
												{news.image && (
													<div className="md:w-1/3 relative">
														<Image
															src={news.image}
															alt={news.title}
															width={400}
															height={250}
															className="w-full h-48 md:h-full object-cover"
														/>
													</div>
												)}
												<div className="md:w-2/3 p-6">
													<CardHeader className="p-0 pb-4">
														<div className="flex items-start justify-between">
															<div className="space-y-2">
																<CardTitle className="text-lg leading-tight">
																	{news.title}
																</CardTitle>
																<div className="flex items-center gap-4 text-sm text-muted-foreground">
																	<div className="flex items-center gap-1">
																		<User className="h-3 w-3" />
																		{news.author}
																	</div>
																	<div className="flex items-center gap-1">
																		<Calendar className="h-3 w-3" />
																		{news.date}
																	</div>
																	<span>{news.readTime}</span>
																</div>
															</div>
															{news.link && (
																<Button variant="outline" size="sm" asChild>
																	<a href={news.link} target="_blank" rel="noopener noreferrer">
																		<ExternalLink className="h-3 w-3 mr-1" />
																		View
																	</a>
																</Button>
															)}
														</div>
														<div className="flex flex-wrap gap-2">
															{news.tags.map((tag) => (
																<Badge key={tag} variant="secondary" className="text-xs">
																	{tag}
																</Badge>
															))}
														</div>
													</CardHeader>
													<CardContent className="p-0">
														<p className="text-muted-foreground leading-relaxed">
															{news.content}
														</p>
													</CardContent>
												</div>
											</div>
										</Card>
									))}
								</div>
							</div>

							{/* Application Updates - Scrollable Card */}
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Zap className="h-5 w-5 text-green-600" />
										<h2 className="text-xl font-semibold">Application Updates</h2>
									</div>
									<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
										{applicationNews.length} updates
									</Badge>
								</div>
                               
								<Card className="h-[815px]">
									<CardHeader className="pb-4">
										<CardTitle className="text-lg">Recent Updates</CardTitle>
										<CardDescription>
											Latest features and improvements
										</CardDescription>
									</CardHeader>
                                    <Separator  />
									<CardContent className="p-0">
										<ScrollArea className="h-[630px] px-6">
											<div className="space-y-4">
												{applicationNews.map((news) => (
													<div key={news.id} className="pb-4 border-b border-border last:border-b-0">
														<div className="space-y-3">
															<div>
																<h3 className="font-semibold text-sm leading-tight">
																	{news.title}
																</h3>
																<div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
																	<div className="flex items-center gap-1">
																		<User className="h-3 w-3" />
																		{news.author}
																	</div>
																	<div className="flex items-center gap-1">
																		<Calendar className="h-3 w-3" />
																		{news.date}
																	</div>
																</div>
															</div>
															<p className="text-sm text-muted-foreground leading-relaxed">
																{news.content}
															</p>
															<div className="flex flex-wrap gap-1">
																{news.tags.map((tag) => (
																	<Badge key={tag} variant="outline" className="text-xs">
																		{tag}
																	</Badge>
																))}
															</div>
														</div>
													</div>
												))}
											</div>
										</ScrollArea>
									</CardContent>
								</Card>
							</div>
						</div>

				
					</div>
				</div>
			</div>
		</SidebarInset>
	);
}
