"use client";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
	Industry,
	Technology,
	Solution,
	SolutionVariant,
} from "../types/types";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

// API Functions
async function fetchIndustries(): Promise<Industry[]> {
	try {
		const response = await fetch("/api/value-calculator/industries");
		const result = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch industries");
		}

		return result.data as Industry[];
	} catch (error) {
		console.error("Error fetching industries:", error);
		throw error;
	}
}

async function fetchTechnologies(industryId: string): Promise<Technology[]> {
	try {
		const response = await fetch(
			`/api/value-calculator/technologies?industryId=${encodeURIComponent(
				industryId
			)}`
		);
		const result = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch technologies");
		}

		return result.data as Technology[];
	} catch (error) {
		console.error("Error fetching technologies:", error);
		throw error;
	}
}

async function fetchSolutions(
	industryId: string,
	technologyId: string
): Promise<Solution[]> {
	try {
		const response = await fetch(
			`/api/value-calculator/solutions?technologyId=${encodeURIComponent(
				technologyId
			)}`
		);
		const result = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch solutions");
		}

		return result.data as Solution[];
	} catch (error) {
		console.error("Error fetching solutions:", error);
		throw error;
	}
}

async function fetchSolutionVariants(
	solutionId: string
): Promise<SolutionVariant[]> {
	try {
		const response = await fetch(
			`/api/value-calculator/solution-variants?solutionId=${encodeURIComponent(
				solutionId
			)}`
		);
		const result = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to fetch solution variants");
		}

		return result.data as SolutionVariant[];
	} catch (error) {
		console.error("Error fetching solution variants:", error);
		throw error;
	}
}

interface HeaderSelectorsProps {
	selectedIndustry: string;
	setSelectedIndustry: (value: string) => void;
	selectedTechnology: string;
	setSelectedTechnology: (value: string) => void;
	selectedSolution: string;
	setSelectedSolution: (value: string) => void;
	selectedSolutionVariant: string;
	setSelectedSolutionVariant: (value: string) => void;
	onSolutionInfoChange?: (
		solutionInfo: { name: string; description?: string } | null
	) => void;
	disableIndustry?: boolean;
	disableTechnology?: boolean;
	inheritedIndustry?: string;
	inheritedTechnology?: string;
}

export function HeaderSelectors({
	selectedIndustry,
	setSelectedIndustry,
	selectedTechnology,
	setSelectedTechnology,
	selectedSolution,
	setSelectedSolution,
	selectedSolutionVariant,
	setSelectedSolutionVariant,
	onSolutionInfoChange,
	disableIndustry = false,
	disableTechnology = false,
	inheritedIndustry,
	inheritedTechnology,
}: HeaderSelectorsProps) {
	const [industries, setIndustries] = useState<Industry[]>([]);
	const [technologies, setTechnologies] = useState<Technology[]>([]);
	const [solutions, setSolutions] = useState<Solution[]>([]);
	const [solutionVariants, setSolutionVariants] = useState<SolutionVariant[]>(
		[]
	);
	const [isMinimized, setIsMinimized] = useState(false);
	const [userManuallyToggled, setUserManuallyToggled] = useState(false);

	const [loading, setLoading] = useState({
		industries: false,
		technologies: false,
		solutions: false,
		solutionVariants: false,
	});

	// Check if all selections are complete
	const isConfigurationComplete =
		selectedIndustry &&
		selectedTechnology &&
		selectedSolution &&
		selectedSolutionVariant;

	// Auto-minimize when configuration is complete (only if user hasn't manually toggled)
	useEffect(() => {
		if (isConfigurationComplete && !isMinimized && !userManuallyToggled) {
			setIsMinimized(true);
		}
	}, [isConfigurationComplete, isMinimized, userManuallyToggled]);

	// Handle inherited values for second calculator
	useEffect(() => {
		if (inheritedIndustry && inheritedTechnology) {
			setSelectedIndustry(inheritedIndustry);
			setSelectedTechnology(inheritedTechnology);
		}
	}, [inheritedIndustry, inheritedTechnology]);

	// Ensure solutions are loaded when inherited values are set
	useEffect(() => {
		if (
			inheritedIndustry &&
			inheritedTechnology &&
			selectedIndustry === inheritedIndustry &&
			selectedTechnology === inheritedTechnology
		) {
			// This will trigger the solutions useEffect
		}
	}, [
		inheritedIndustry,
		inheritedTechnology,
		selectedIndustry,
		selectedTechnology,
	]);

	// Force reload technologies and solutions when inherited values are set
	useEffect(() => {
		if (inheritedIndustry && inheritedTechnology) {
			// Force reload technologies
			const loadTechnologies = async () => {
				setLoading((prev) => ({ ...prev, technologies: true }));
				try {
					const data = await fetchTechnologies(inheritedIndustry);
					setTechnologies(data);
				} catch (error) {
					console.error(
						"Failed to load technologies for inherited values:",
						error
					);
					setTechnologies([]);
				} finally {
					setLoading((prev) => ({ ...prev, technologies: false }));
				}
			};

			// Force reload solutions
			const loadSolutions = async () => {
				setLoading((prev) => ({ ...prev, solutions: true }));
				try {
					const data = await fetchSolutions(
						inheritedIndustry,
						inheritedTechnology
					);
					setSolutions(data);
				} catch (error) {
					console.error(
						"Failed to load solutions for inherited values:",
						error
					);
					setSolutions([]);
				} finally {
					setLoading((prev) => ({ ...prev, solutions: false }));
				}
			};

			loadTechnologies().then(() => {
				// Load solutions after technologies are loaded
				loadSolutions();
			});
		}
	}, [inheritedIndustry, inheritedTechnology]);

	// Simple handlers that just pass the ID directly
	const handleIndustryChange = (value: string) => {
		setSelectedIndustry(value);
	};

	const handleTechnologyChange = (value: string) => {
		setSelectedTechnology(value);
	};

	const handleSolutionChange = (value: string) => {
		setSelectedSolution(value);

		// Find the selected solution info and pass it back
		if (onSolutionInfoChange) {
			const selectedSolutionObj = solutions.find((sol) => sol.id === value);
			if (selectedSolutionObj) {
				onSolutionInfoChange({
					name: selectedSolutionObj.name,
					description: selectedSolutionObj.description,
				});
			} else {
				onSolutionInfoChange(null);
			}
		}
	};

	const handleSolutionVariantChange = (value: string) => {
		setSelectedSolutionVariant(value);
	};

	// Debug handlers for chevron buttons
	const handleMinimize = () => {
		setUserManuallyToggled(true);
		setIsMinimized(true);
	};

	const handleExpand = () => {
		setUserManuallyToggled(true);
		setIsMinimized(false);
	};

	// Fetch industries on component mount
	useEffect(() => {
		const loadIndustries = async () => {
			setLoading((prev) => ({ ...prev, industries: true }));
			try {
				const data = await fetchIndustries();
				setIndustries(data);
			} catch (error) {
				console.error("Failed to load industries:", error);
				setIndustries([]);
			} finally {
				setLoading((prev) => ({ ...prev, industries: false }));
			}
		};

		loadIndustries();
	}, []);

	// Fetch technologies when industry changes
	useEffect(() => {
		const loadTechnologies = async () => {
			if (!selectedIndustry) {
				setTechnologies([]);
				return;
			}

			setLoading((prev) => ({ ...prev, technologies: true }));
			try {
				const data = await fetchTechnologies(selectedIndustry);
				setTechnologies(data);
			} catch (error) {
				console.error("Failed to load technologies:", error);
				setTechnologies([]);
			} finally {
				setLoading((prev) => ({ ...prev, technologies: false }));
			}
		};

		loadTechnologies();
		// Reset downstream selections only if not inheriting values
		if (!inheritedIndustry || !inheritedTechnology) {
			setSelectedTechnology("");
			setSelectedSolution("");
			setSelectedSolutionVariant("");
		}
	}, [selectedIndustry, inheritedIndustry, inheritedTechnology]);

	// Fetch solutions when technology changes
	useEffect(() => {
		const loadSolutions = async () => {
			if (!selectedIndustry || !selectedTechnology) {
				setSolutions([]);
				return;
			}

			setLoading((prev) => ({ ...prev, solutions: true }));
			try {
				const data = await fetchSolutions(selectedIndustry, selectedTechnology);
				setSolutions(data);
			} catch (error) {
				console.error("Failed to load solutions:", error);
				setSolutions([]);
			} finally {
				setLoading((prev) => ({ ...prev, solutions: false }));
			}
		};

		loadSolutions();
		// Reset downstream selections only if not inheriting values
		if (!inheritedIndustry || !inheritedTechnology) {
			setSelectedSolution("");
			setSelectedSolutionVariant("");
		}
	}, [
		selectedIndustry,
		selectedTechnology,
		inheritedIndustry,
		inheritedTechnology,
	]);

	// Fetch solution variants when solution changes
	useEffect(() => {
		const loadSolutionVariants = async () => {
			if (!selectedSolution) {
				setSolutionVariants([]);
				return;
			}

			setLoading((prev) => ({ ...prev, solutionVariants: true }));
			try {
				const data = await fetchSolutionVariants(selectedSolution);
				setSolutionVariants(data);

				// Automatically select the first available solution variant
				if (data.length > 0) {
					setSelectedSolutionVariant(data[0].id);
				} else {
					setSelectedSolutionVariant("");
				}
			} catch (error) {
				console.error("Failed to load solution variants:", error);
				setSolutionVariants([]);
				setSelectedSolutionVariant("");
			} finally {
				setLoading((prev) => ({ ...prev, solutionVariants: false }));
			}
		};

		loadSolutionVariants();
		// Remove the manual reset since we're auto-selecting the first option
		// setSelectedSolutionVariant("");
	}, [selectedSolution]);

	// Get selected item names for display
	const getSelectedIndustryName = () => {
		return (
			industries.find((i) => i.id === selectedIndustry)?.name ||
			industries.find((i) => (i as any)._id === selectedIndustry)?.name ||
			"Inherited from first calculator"
		);
	};

	const getSelectedTechnologyName = () => {
		return (
			technologies.find((t) => t.id === selectedTechnology)?.name ||
			technologies.find((t) => (t as any)._id === selectedTechnology)?.name ||
			"Inherited from first calculator"
		);
	};

	const getSelectedSolutionName = () => {
		return (
			solutions.find((s) => s.id === selectedSolution)?.name ||
			"Unknown Solution"
		);
	};

	const getSelectedSolutionVariantName = () => {
		return (
			solutionVariants.find((v) => v.id === selectedSolutionVariant)?.name ||
			"Unknown Variant"
		);
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4">
			{isMinimized ? (
				// Minimized state
				<div className="flex flex-col space-y-3">
					{/* First row - Industry and Technology (if not inherited) */}
					{(!inheritedIndustry || !inheritedTechnology) && (
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-6 text-xs text-gray-600">
								{!inheritedIndustry && (
									<div className="flex items-center space-x-1">
										<span className="font-medium text-gray-500">Industry:</span>
										<span className="truncate max-w-32 font-semibold text-gray-900">
											{getSelectedIndustryName()}
										</span>
									</div>
								)}
								{!inheritedTechnology && (
									<div className="flex items-center space-x-1">
										<span className="font-medium text-gray-500">
											Technology:
										</span>
										<span className="truncate max-w-32 font-semibold text-gray-900">
											{getSelectedTechnologyName()}
										</span>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Second row - Solution and Variant */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-6 text-xs text-gray-600">
							<div className="flex items-center space-x-1">
								<span className="font-medium text-gray-500">Solution:</span>
								<span className="truncate max-w-40 font-semibold text-gray-900">
									{getSelectedSolutionName()}
								</span>
							</div>
							<div className="flex items-center space-x-1">
								<span className="font-medium text-gray-500">Variant:</span>
								<span className="truncate max-w-40 font-semibold text-gray-900">
									{getSelectedSolutionVariantName()}
								</span>
							</div>
						</div>
						{isConfigurationComplete && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleExpand}
								className="h-8 px-2 text-gray-500 hover:text-gray-700"
							>
								<ChevronDown className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			) : (
				// Expanded state
				<>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900">
							Value Calculator Configuration
						</h2>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleMinimize}
							className="h-8 px-2 text-gray-500 hover:text-gray-700"
						>
							<ChevronUp className="h-4 w-4" />
						</Button>
					</div>

					<div
						className={`grid grid-cols-1 md:grid-cols-2 ${
							inheritedIndustry && inheritedTechnology
								? "lg:grid-cols-2"
								: "lg:grid-cols-4"
						} gap-3`}
					>
						{/* Industry Selector - Only show if not inherited */}
						{!inheritedIndustry && (
							<div className="space-y-1 min-w-0">
								<Label htmlFor="industry" className="text-xs">
									Industry
								</Label>
								{disableIndustry ? (
									<input
										type="text"
										value={getSelectedIndustryName()}
										disabled
										className="w-full px-2 py-1.5 bg-gray-50 rounded-md border border-gray-200 text-gray-700 text-sm font-medium cursor-not-allowed"
										readOnly
									/>
								) : (
									<Select
										value={selectedIndustry}
										onValueChange={handleIndustryChange}
									>
										<SelectTrigger id="industry" className="w-full h-8 text-sm">
											<SelectValue
												placeholder={
													loading.industries ? "Loading..." : "Select Industry"
												}
											/>
										</SelectTrigger>
										<SelectContent className="max-w-[300px]">
											{industries.map((industry) => {
												// Handle both id and _id fields from MongoDB
												const industryId =
													industry.id ||
													(industry as { _id?: string })._id ||
													"";
												return (
													<SelectItem
														key={industryId}
														value={industryId}
														className="max-w-[280px] text-sm"
													>
														<div className="flex items-center">
															<span className="truncate" title={industry.name}>
																{industry.name}
															</span>
														</div>
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								)}
							</div>
						)}

						{/* Technology Selector - Only show if not inherited */}
						{!inheritedTechnology && (
							<div className="space-y-1 min-w-0">
								<Label htmlFor="technology" className="text-xs">
									Technology
								</Label>
								{disableTechnology ? (
									<input
										type="text"
										value={getSelectedTechnologyName()}
										disabled
										className="w-full px-2 py-1.5 bg-gray-50 rounded-md border border-gray-200 text-gray-700 text-sm font-medium cursor-not-allowed"
										readOnly
									/>
								) : (
									<Select
										value={selectedTechnology}
										onValueChange={handleTechnologyChange}
										disabled={!selectedIndustry || loading.technologies}
									>
										<SelectTrigger
											id="technology"
											className="w-full h-8 text-sm"
										>
											<span className="block w-full truncate text-sm text-left">
												{!selectedIndustry
													? "Select Industry First"
													: loading.technologies
													? "Loading..."
													: selectedTechnology &&
													  technologies.find(
															(t) => t.id === selectedTechnology
													  )?.name
													? technologies.find(
															(t) => t.id === selectedTechnology
													  )?.name
													: "Select Technology"}
											</span>
										</SelectTrigger>
										<SelectContent className="max-w-[300px]">
											{technologies.map((tech) => (
												<SelectItem
													key={tech.id}
													value={tech.id}
													className="max-w-[280px] text-sm"
												>
													<span className="truncate" title={tech.name}>
														{tech.name}
													</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</div>
						)}

						{/* Solution Selector */}
						<div className="space-y-1 min-w-0">
							<Label htmlFor="solution" className="text-xs">
								Solution
							</Label>
							<Select
								value={selectedSolution}
								onValueChange={handleSolutionChange}
								disabled={!selectedTechnology || loading.solutions}
							>
								<SelectTrigger id="solution" className="w-full h-8 text-sm">
									<span className="block w-full truncate text-sm text-left">
										{!selectedTechnology
											? "Select Technology First"
											: loading.solutions
											? "Loading..."
											: selectedSolution &&
											  solutions.find((s) => s.id === selectedSolution)?.name
											? solutions.find((s) => s.id === selectedSolution)?.name
											: `Select Solution (${solutions.length} available)`}
									</span>
								</SelectTrigger>
								<SelectContent className="max-w-[300px]">
									{solutions.map((solution) => (
										<SelectItem
											key={solution.id}
											value={solution.id}
											className="max-w-[280px] text-sm"
										>
											<span className="truncate" title={solution.name}>
												{solution.name}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Solution Variant Selector */}
						<div className="space-y-1 min-w-0">
							<Label htmlFor="solutionVariant" className="text-xs">
								Solution Variant
							</Label>
							<Select
								value={selectedSolutionVariant}
								onValueChange={handleSolutionVariantChange}
								disabled={!selectedSolution || loading.solutionVariants}
							>
								<SelectTrigger
									id="solutionVariant"
									className="w-full h-8 text-sm"
								>
									<span className="block w-full truncate text-sm text-left">
										{!selectedSolution
											? "Select Solution First"
											: loading.solutionVariants
											? "Loading..."
											: selectedSolutionVariant &&
											  solutionVariants.find(
													(v) => v.id === selectedSolutionVariant
											  )?.name
											? solutionVariants.find(
													(v) => v.id === selectedSolutionVariant
											  )?.name
											: "Select Solution Variant"}
									</span>
								</SelectTrigger>
								<SelectContent className="max-w-[300px]">
									{solutionVariants.map((variant) => (
										<SelectItem
											key={variant.id}
											value={variant.id}
											className="max-w-[280px] text-sm"
										>
											<span className="truncate" title={variant.name}>
												{variant.name}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
