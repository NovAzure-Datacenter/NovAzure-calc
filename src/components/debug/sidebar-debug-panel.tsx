"use client";

import { useState } from "react";
import { Bug, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getClientSolution, updateClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";

type AccountType = "novazure-superuser" | "novazure-user" | "company-admin" | "company-user";

interface SidebarDebugPanelProps {
	sideBarType: AccountType;
	setSideBarType: (type: AccountType) => void;
	originalAccountType?: string;
}

export function SidebarDebugPanel({ 
	sideBarType, 
	setSideBarType,
	originalAccountType 
}: SidebarDebugPanelProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [solutionId, setSolutionId] = useState("");
	const [solutionData, setSolutionData] = useState<any>(null);
	const [isLoadingSolution, setIsLoadingSolution] = useState(false);
	const [selectedKey, setSelectedKey] = useState("");
	const [isUpdatingParameters, setIsUpdatingParameters] = useState(false);
	const [selectedField, setSelectedField] = useState("");
	const [fromValue, setFromValue] = useState("");
	const [toValue, setToValue] = useState("");

	if (process.env.NODE_ENV === "production") {
		return null;
	}

	const handleFetchSolution = async () => {
		if (!solutionId.trim()) {
			toast.error("Please enter a solution ID");
			return;
		}

		setIsLoadingSolution(true);
		try {
			const result = await getClientSolution(solutionId.trim());
			
			if (result.error) {
				toast.error(result.error);
				setSolutionData(null);
			} else if (result.solution) {
				setSolutionData(result.solution);
				setSelectedKey("");
				toast.success("Solution fetched successfully!");
			}
		} catch (error) {
			console.error("Error fetching solution:", error);
			toast.error("Failed to fetch solution");
			setSolutionData(null);
		} finally {
			setIsLoadingSolution(false);
		}
	};

	const handleUpdateParameterField = async () => {
		if (!solutionData?.parameters) {
			toast.error("No solution data or parameters found");
			return;
		}

		if (!selectedField.trim() || !fromValue.trim() || !toValue.trim()) {
			toast.error("Please select a field and enter both 'from' and 'to' values");
			return;
		}

		setIsUpdatingParameters(true);
		try {
			const updatedSolution = { ...solutionData };
			
			updatedSolution.parameters = updatedSolution.parameters.map((param: any) => {
				if (selectedField === "category" && param.category?.name === fromValue.trim()) {
					return {
						...param,
						category: { name: toValue.trim(), color: "blue" }
					};
				}
				
				if (param[selectedField] === fromValue.trim()) {
					return { ...param, [selectedField]: toValue.trim() };
				}
				
				return param;
			});

			const updatedCount = updatedSolution.parameters.filter((param: any) => {
				if (selectedField === "category") {
					return param.category?.name === toValue.trim();
				}
				return param[selectedField] === toValue.trim();
			}).length;

			if (updatedCount === 0) {
				toast.warning(`No parameters found with ${selectedField} = "${fromValue.trim()}"`);
				return;
			}

			const result = await updateClientSolution(solutionId.trim(), updatedSolution);
			
			if (result.error) {
				toast.error(result.error);
			} else {
				setSolutionData(updatedSolution);
				toast.success(`Successfully updated ${updatedCount} parameters: ${selectedField} from "${fromValue.trim()}" to "${toValue.trim()}"`);
			}
		} catch (error) {
			console.error("Error updating parameters:", error);
			toast.error("Failed to update parameters");
		} finally {
			setIsUpdatingParameters(false);
		}
	};

	const handleUpdateUserInterfaceStructure = async () => {
		if (!solutionData?.parameters) {
			toast.error("No solution data or parameters found");
			return;
		}

		setIsUpdatingParameters(true);
		try {
			const updatedSolution = { ...solutionData };
			let updatedCount = 0;
			
			updatedSolution.parameters = updatedSolution.parameters.map((param: any) => {
				// Check if user_interface is currently a string and needs to be converted to object
				if (typeof param.user_interface === "string") {
					updatedCount++;
					return {
						...param,
						user_interface: {
							type: param.user_interface as "input" | "static" | "not_viewable",
							category: param.category?.name || "General",
							is_advanced: false
						}
					};
				}
				
				return param;
			});

			if (updatedCount === 0) {
				toast.warning("No parameters found with string user_interface to update");
				return;
			}

			const result = await updateClientSolution(solutionId.trim(), updatedSolution);
			
			if (result.error) {
				toast.error(result.error);
			} else {
				setSolutionData(updatedSolution);
				toast.success(`Successfully updated ${updatedCount} parameters: converted user_interface from string to object structure`);
			}
		} catch (error) {
			console.error("Error updating user_interface structure:", error);
			toast.error("Failed to update user_interface structure");
		} finally {
			setIsUpdatingParameters(false);
		}
	};

	const formatValue = (value: any): string => {
		if (value === null || value === undefined) return "null";
		if (typeof value === "object") return JSON.stringify(value, null, 2);
		if (typeof value === "boolean") return value ? "true" : "false";
		return String(value);
	};

	const getAvailableKeys = (): string[] => {
		return solutionData ? Object.keys(solutionData) : [];
	};

	const getSelectedValue = (): string => {
		if (!solutionData || !selectedKey) return "";
		
		const value = solutionData[selectedKey];
		
		if (selectedKey === "parameters" && Array.isArray(value)) {
			if (value.length === 0) return "Empty parameters array";
			return formatParameterAsList(value[0]);
		}
		
		return formatValue(value);
	};

	const formatParameterAsList = (parameter: any): string => {
		if (!parameter || typeof parameter !== "object") return "Invalid parameter";
		
		return Object.entries(parameter)
			.map(([key, value]) => `${key}: ${formatValue(value)}`)
			.join('\n');
	};

	const getAvailableParameterFields = (): string[] => {
		if (!solutionData?.parameters?.length) return [];
		
		const allFields = new Set<string>();
		solutionData.parameters.forEach((param: any) => {
			Object.keys(param).forEach(key => allFields.add(key));
		});
		
		return Array.from(allFields).sort();
	};

	return (
		<div className="fixed top-4 right-4 z-50">
			{isVisible && (
				<Card className="w-96 shadow-lg border-2 border-orange-200 max-h-[80vh] overflow-y-auto">
					<CardContent>
						{/* Debug Panel Header */}
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2">
								<Bug className="h-4 w-4 text-orange-600" />
								<span className="text-sm font-semibold text-orange-800">
									Sidebar Debug Panel
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsVisible(false)}
								className="h-6 w-6 p-0"
							>
								×
							</Button>
						</div>
						
						<div className="space-y-4">
							{/* Account Type Selector */}
							<div>
								<label className="text-xs font-medium text-gray-700 mb-1 block">
									Account Type
								</label>
								<Select value={sideBarType} onValueChange={(value: AccountType) => setSideBarType(value)}>
									<SelectTrigger className="h-8 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="novazure-superuser">NovAzure Super User</SelectItem>
										<SelectItem value="novazure-user">NovAzure User</SelectItem>
										<SelectItem value="company-admin">Company Admin</SelectItem>
										<SelectItem value="company-user">Company User</SelectItem>
									</SelectContent>
								</Select>
								<span className="text-xs text-gray-500">
									Current Account Type: {sideBarType}
								</span>
								{originalAccountType && originalAccountType !== sideBarType && (
									<div>
									<span className="text-xs text-orange-600 block">
										Original: {originalAccountType}
									</span>
									<span className="text-xs text-orange-600 block">
										Mapped: {sideBarType}
									</span>
									</div>
								)}
							</div>
							
							{/* Solution ID Input and Fetch Button */}
							<div>
								<label className="text-xs font-medium text-gray-700 mb-1 block">
									Client Solution Debug
								</label>
								<div className="flex gap-2">
									<Input
										value={solutionId}
										onChange={(e) => setSolutionId(e.target.value)}
										placeholder="Enter solution ID"
										className="h-8 text-xs"
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={handleFetchSolution}
										disabled={isLoadingSolution}
										className="h-8 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
									>
										{isLoadingSolution ? (
											"Loading..."
										) : (
											<>
												<Eye className="h-3 w-3 mr-1" />
												View
											</>
										)}
									</Button>
								</div>
							</div>

							{/* Solution Data Display with Key Selection */}
							{solutionData && (
								<div>
									<label className="text-xs font-medium text-gray-700 mb-1 block">
										Solution Data
									</label>
									<div className="bg-gray-50 p-3 rounded border text-xs max-h-60 overflow-y-auto">
										<Select value={selectedKey} onValueChange={setSelectedKey}>
											<SelectTrigger className="h-8 text-xs">
												<SelectValue placeholder="Select a key" />
											</SelectTrigger>
											<SelectContent>
												{getAvailableKeys().map(key => (
													<SelectItem key={key} value={key}>{key}</SelectItem>
												))}
											</SelectContent>
										</Select>
										{selectedKey && (
											<div className="mt-2 text-gray-600 font-mono break-all whitespace-pre-line">
												{getSelectedValue()}
											</div>
										)}
									</div>
								</div>
							)}

							{/* Parameter Field Update Tool */}
							{solutionData?.parameters && (
								<div>
									<label className="text-xs font-medium text-gray-700 mb-1 block">
										Parameter Field Update
									</label>
									<div className="space-y-2">
										{/* Field Selection Dropdown */}
										<div>
											<label className="text-xs text-gray-600 mb-1 block">Field to Update:</label>
											<Select value={selectedField} onValueChange={setSelectedField}>
												<SelectTrigger className="h-8 text-xs">
													<SelectValue placeholder="Select a field" />
												</SelectTrigger>
												<SelectContent>
													{getAvailableParameterFields().map(field => (
														<SelectItem key={field} value={field}>{field}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										{/* From/To Value Inputs */}
										<div className="flex gap-2">
											<div className="flex-1">
												<label className="text-xs text-gray-600 mb-1 block">From Value:</label>
												<Input
													value={fromValue}
													onChange={(e) => setFromValue(e.target.value)}
													placeholder="Current value"
													className="h-8 text-xs"
												/>
											</div>
											<div className="flex-1">
												<label className="text-xs text-gray-600 mb-1 block">To Value:</label>
												<Input
													value={toValue}
													onChange={(e) => setToValue(e.target.value)}
													placeholder="New value"
													className="h-8 text-xs"
												/>
											</div>
										</div>
									</div>
									{/* Update Button */}
									<Button
										variant="outline"
										size="sm"
										onClick={handleUpdateParameterField}
										disabled={isUpdatingParameters || !selectedField.trim() || !fromValue.trim() || !toValue.trim()}
										className="h-8 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100 mt-2"
									>
										{isUpdatingParameters ? (
											"Updating..."
										) : (
											<>
												<Search className="h-3 w-3 mr-1" />
												Update {selectedField} from &ldquo;{fromValue.trim()}&rdquo; to &ldquo;{toValue.trim()}&rdquo;
											</>
										)}
									</Button>
									<span className="text-xs text-gray-500 block mt-1">
										Updates all parameters with the specified field value to the specified new value
									</span>
								</div>
							)}

							{/* User Interface Structure Update Tool */}
							{solutionData?.parameters && (
								<div>
									<label className="text-xs font-medium text-gray-700 mb-1 block">
										User Interface Structure Update
								</label>
								<Button
									variant="outline"
									size="sm"
										onClick={handleUpdateUserInterfaceStructure}
										disabled={isUpdatingParameters}
										className="h-8 text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
								>
										{isUpdatingParameters ? (
											"Updating..."
										) : (
											<>
												<Search className="h-3 w-3 mr-1" />
												Convert user_interface to Object Structure
											</>
										)}
								</Button>
								<span className="text-xs text-gray-500 block mt-1">
										Converts user_interface from string to object with type and category properties
								</span>
							</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
			
			{/* Debug Panel Toggle Button (Hidden State) */}
			{!isVisible && (
				<Button
					variant="outline"
					size="sm"
					onClick={() => setIsVisible(true)}
					className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
				>
					<Bug className="h-4 w-4 mr-1" />
					Sidebar Debug
				</Button>
			)}
		</div>
	);
} 