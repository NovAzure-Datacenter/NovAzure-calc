import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogHeader,
	DialogDescription,
} from "@/components/ui/dialog";
import { Parameter } from "@/types/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";

interface PreviewDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	parameters: Parameter[];
}

export default function PreviewDialog({
	isOpen,
	onOpenChange,
	parameters,
}: PreviewDialogProps) {
	const [isAdvanced, setIsAdvanced] = useState(false);
	const userInputParameters = parameters.filter(
		(parameter) => parameter.user_interface.type === "input"
	);

	const basicUnifiedParameters = userInputParameters.filter(
		(parameter) => parameter.is_unified && !parameter.user_interface.is_advanced
	);

	const basicSolutionSpecificParameters = userInputParameters.filter(
		(parameter) =>
			!parameter.is_unified && !parameter.user_interface.is_advanced
	);

	const advancedUnifiedParameters = userInputParameters.filter(
		(parameter) => parameter.is_unified && parameter.user_interface.is_advanced
	);

	const advancedSolutionSpecificParameters = userInputParameters.filter(
		(parameter) => !parameter.is_unified && parameter.user_interface.is_advanced
	);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-hidden flex flex-col min-w-[1200px]">
				<DialogHeader className="pb-6 flex-shrink-0">
					<DialogTitle className="text-xl font-semibold text-gray-900">
						Value Calculator Parameter Preview
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto pr-2">
					<DialogDescription>
						<div className="flex flex-col gap-4">
							{/* Basic Parameters */}
							<div className="flex flex-col gap-4">
								<Card>
									<CardHeader>
										<CardTitle>Basic Unified Parameter Configuration</CardTitle>
									<CardDescription>
										These are the parameters that are shared between common solutions.
									</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{basicUnifiedParameters.map((parameter) => (
												<div key={parameter.id}>
													<UserInputParameterCard parameter={parameter} />
												</div>
											))}
										</div>
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>
											Solution Specific Parameter Configuration
										</CardTitle>
									<CardDescription>
										These are the parameters that are specific to your own solution.
									</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{basicSolutionSpecificParameters.map((parameter) => (
												<div key={parameter.id}>
													<UserInputParameterCard parameter={parameter} />
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Advanced Parameters */}
							<Card className="flex flex-col gap-4 p-4">
								<div className="flex justify-center">
									<Button
										className="text-xs"
										onClick={() => setIsAdvanced(!isAdvanced)}
									>
										{isAdvanced
											? "Hide Advanced Parameters"
											: "Show Advanced Parameters"}
									</Button>
								</div>
								{isAdvanced && (
									<div className="flex flex-col gap-4">
										<Card>
											<CardHeader>
												<CardTitle>
													Advanced Unified Parameter Configuration
												</CardTitle>
											<CardDescription>
												These are the advanced parameters that are shared between
												common solutions.
											</CardDescription>
											</CardHeader>
											<CardContent>
												{advancedUnifiedParameters.map((parameter) => (
													<UserInputParameterCard key={parameter.id} parameter={parameter} />
												))}
											</CardContent>
										</Card>
										<Card>
											<CardHeader>
												<CardTitle>
													Advanced Solution Specific Parameter Configuration
												</CardTitle>
											<CardDescription>
												These are the advanced parameters that are specific to your
												own solution.
											</CardDescription>
											</CardHeader>
											<CardContent>
												{advancedSolutionSpecificParameters.map((parameter) => (
													<UserInputParameterCard key={parameter.id} parameter={parameter} />
												))}
											</CardContent>
										</Card>
									</div>
								)}
							</Card>
						</div>
					</DialogDescription>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function UserInputParameterCard({ parameter }: { parameter: Parameter }) {
	const parameterType = parameter.display_type;
	//range, dropdown, filter, simple, conditional

	switch (parameterType) {
		case "range":
			return <RangeField parameter={parameter} />;
		case "dropdown":
			return <DropdownField parameter={parameter} />;
		case "filter":
			return <DropdownField parameter={parameter} />;
		case "simple":
			return <SimpleField parameter={parameter} />;
		case "conditional":
			return (
				<Card>
					<CardHeader>
						<CardTitle>{parameter.name}</CardTitle>
					</CardHeader>
				</Card>
			);
		default:
			return (
				<Card>
					<CardHeader>
						<CardTitle>{parameter.name}</CardTitle>
					</CardHeader>
				</Card>
			);
	}
}

function StaticField({ parameter }: { parameter: Parameter }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">
				{parameter.description || parameter.name}
			</Label>
			<div className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 select-none pointer-events-none">
				{parameter.test_value || "No value set"}
			</div>
		</div>
	);
}

function DropdownField({ parameter }: { parameter: Parameter }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">Select {parameter.name}:</Label>
			<Select>
				<SelectTrigger className="w-full h-10 border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-gray-500">
					<SelectValue placeholder={`Select an option for ${parameter.name}`} />
				</SelectTrigger>
				<SelectContent>
					{parameter.dropdown_options &&
						parameter.dropdown_options.map((option, index) => (
							<SelectItem
								key={index}
								value={option.value || option.key || `option-${index}`}
							>
								{option.value || option.key || `Option ${index + 1}`}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
		</div>
	);
}

function RangeField({ parameter }: { parameter: Parameter }) {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const input = e.target as HTMLInputElement;
		const value = input.value;
		const key = e.key;

		if (
			[
				"Backspace",
				"Delete",
				"ArrowLeft",
				"ArrowRight",
				"Tab",
				"Enter",
			].includes(key)
		) {
			return;
		}

		if (key === "." && !value.includes(".")) {
			return;
		}

		if (!/^\d$/.test(key)) {
			e.preventDefault();
			return;
		}

		const newValue = value + key;
		if (
			parameter.range_max !== undefined &&
			parseFloat(newValue) > parseFloat(parameter.range_max.toString())
		) {
			e.preventDefault();
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const input = e.target as HTMLInputElement;
		const value = parseFloat(input.value);

		if (
			parameter.range_min !== undefined &&
			value < parseFloat(parameter.range_min.toString())
		) {
			input.value = parameter.range_min.toString();
		} else if (
			parameter.range_max !== undefined &&
			value > parseFloat(parameter.range_max.toString())
		) {
			input.value = parameter.range_max.toString();
		}
	};

	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">
				{parameter.description || `Enter ${parameter.name}`}
			</Label>
			<input
				type="number"
				className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
				placeholder={`Enter value between ${parameter.range_min || "0"} and ${
					parameter.range_max || "∞"
				}`}
				min={parameter.range_min}
				max={parameter.range_max}
				step="any"
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
			/>
			{parameter.range_min && parameter.range_max && (
				<div className="text-xs text-gray-500">
					Range: {parameter.range_min} - {parameter.range_max}
				</div>
			)}
		</div>
	);
}

function SimpleField({ parameter }: { parameter: Parameter }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">
				{parameter.description || `Enter ${parameter.name}`}
			</Label>
			<input
				type="text"
				className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
				placeholder={`Enter ${parameter.name}`}
			/>
		</div>
	);
}

function DefaultField({ parameter }: { parameter: Parameter }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">
				{parameter.description || `Enter ${parameter.name}`}
			</Label>
			<input
				type="number"
				className="w-full p-3 border border-gray-300 rounded-lg text-sm h-10 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
				placeholder={`Enter ${parameter.name}`}
			/>
		</div>
	);
}
