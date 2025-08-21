import { useUser } from "@/hooks/useUser";
import { useCallback, useEffect, useState } from "react";

import { fetchClientInitialData } from "../../services/fetch-client-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function IndustryAndTechnologySelector(props: {
	setHasSelectedIndustryAndTechnology: (
		hasSelectedIndustryAndTechnology: boolean
	) => void;
	setClientData: (clientData: any) => void;
	setSelectedIndustryParent: (selectedIndustry: string) => void;
	setSelectedTechnologyParent: (selectedTechnology: string) => void;
	comparisonMode: "single" | "compare" | null;
}) {
	const { setHasSelectedIndustryAndTechnology, setClientData, setSelectedIndustryParent, setSelectedTechnologyParent, comparisonMode } = props;
	const { user } = useUser();
	const [industries, setIndustries] = useState<any[]>([]);
	const [technologies, setTechnologies] = useState<any[]>([]);

	const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
	const [isLoadingTechnologies, setIsLoadingTechnologies] = useState(false);

	const [selectedIndustry, setSelectedIndustry] = useState<string>("");
	const [hasSelectedIndustry, setHasSelectedIndustry] = useState(false);

	const [selectedTechnology, setSelectedTechnology] = useState<string>("");
	const [hasSelectedTechnology, setHasSelectedTechnology] = useState(false);

	const loadClientDataAndSelections = useCallback(async () => {
		if (!user?.client_id) {
			return;
		}

		try {
			setIsLoadingIndustries(true);
			setIsLoadingTechnologies(true);

			const { industries, technologies, clientData } =
				await fetchClientInitialData(user.client_id);

			setIndustries(industries);
			setTechnologies(technologies);
			setClientData(clientData);
			setSelectedIndustryParent(industries[0].id || industries[0]._id);
			setSelectedTechnologyParent(technologies[0].id || technologies[0]._id);
		} catch (error) {
			setIndustries([]);
			setTechnologies([]);
			setSelectedIndustryParent("");
			setSelectedTechnologyParent("");
		} finally {
			setIsLoadingIndustries(false);
			setIsLoadingTechnologies(false);
		}
	}, [user?.client_id]);

	useEffect(() => {
		loadClientDataAndSelections();
	}, [loadClientDataAndSelections]);

	const handleIndustryChange = (value: string) => {
		setSelectedIndustry(value);
		setHasSelectedIndustry(true);
		setSelectedIndustryParent(value);
	};

	const handleTechnologyChange = (value: string) => {
		setSelectedTechnology(value);
		setHasSelectedTechnology(true);
		setHasSelectedIndustryAndTechnology(true);
		setSelectedTechnologyParent(value);
	};

	// Reset industry and technology selection when industry/technology changes
	useEffect(() => {
		setSelectedIndustry("");
		setHasSelectedIndustry(false);
		setSelectedTechnology("");
		setHasSelectedTechnology(false);
	}, [comparisonMode]);

	return !hasSelectedTechnology ? (
		<Card className="border-2 border-dashed border-gray-200">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-base font-semibold text-blue-800">
							Industry and Technology Selector
						</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Industry Selector */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">
							Industry
						</label>
						<Select
							value={selectedIndustry}
							onValueChange={handleIndustryChange}
							disabled={isLoadingIndustries}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select an industry" />
							</SelectTrigger>
							<SelectContent>
								{industries.map((industry) => (
									<SelectItem
										key={industry.id || industry._id}
										value={industry.id || industry._id}
									>
										{industry.name || industry.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{isLoadingIndustries && (
							<p className="text-xs text-gray-500">Loading industries...</p>
						)}
					</div>

					{/* Technology Selector */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">
							Technology
						</label>
						<Select
							value={selectedTechnology}
							onValueChange={handleTechnologyChange}
							disabled={isLoadingTechnologies}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a technology" />
							</SelectTrigger>
							<SelectContent>
								{technologies.map((technology) => (
									<SelectItem
										key={technology.id || technology._id}
										value={technology.id || technology._id}
									>
										{technology.name || technology.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{isLoadingTechnologies && (
							<p className="text-xs text-gray-500">Loading technologies...</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	) : (
		<Card className="border-2 border-dashed border-gray-200 ">
			<CardHeader className="">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-base font-semibold text-blue-800">
							{hasSelectedIndustry && hasSelectedTechnology
								? "Industry and Technology Selected"
								: "Industry and Technology Selector"}
						</span>
						<span>•</span>
						<span>
							{hasSelectedIndustry && hasSelectedTechnology
								? `${
										industries.find((i) => (i.id || i._id) === selectedIndustry)
											?.name ||
										industries.find((i) => (i.id || i._id) === selectedIndustry)
											?.title
								  } and ${
										technologies.find(
											(t) => (t.id || t._id) === selectedTechnology
										)?.name ||
										technologies.find(
											(t) => (t.id || t._id) === selectedTechnology
										)?.title
								  }`
								: "Select an industry and technology to continue"}
						</span>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setHasSelectedIndustry(false);
							setHasSelectedTechnology(false);
						}}
						className="text-xs"
					>
						Change Selection
					</Button>
				</div>
			</CardHeader>
		</Card>
	);
}
