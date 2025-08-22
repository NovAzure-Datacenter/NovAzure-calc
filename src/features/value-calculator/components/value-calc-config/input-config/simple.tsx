import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ClientSolution } from "@/lib/actions/clients-solutions/clients-solutions";
import { Label } from "@/components/ui/label";
import { useUnifiedParameters } from "./hooks/use-unified-parameters";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function SimpleInputConfig({
	selectedVariantDataA,
	selectedVariantDataB,
}: {
	selectedVariantDataA: ClientSolution | null;
	selectedVariantDataB: ClientSolution | null;
}) {
	const parametersA = selectedVariantDataA?.parameters || [];
	const parametersB = selectedVariantDataB?.parameters || [];

	const userInputParametersA = parametersA.filter(
		(parameter) => parameter.user_interface.type === "input"
	);
	const userInputParametersB = parametersB.filter(
		(parameter) => parameter.user_interface.type === "input"
	);
	const { inBoth, inOneOnly, unified, isOnlyA, isOnlyB } = useUnifiedParameters(
		userInputParametersA,
		userInputParametersB
	);

	const basicSolutionSpecificParametersA = [
		...userInputParametersA.filter(
			(parameter) =>
				!parameter.is_unified && !parameter.user_interface.is_advanced
		),
		...isOnlyA,
	];

	const basicSolutionSpecificParametersB = [
		...userInputParametersB.filter(
			(parameter) =>
				!parameter.is_unified && !parameter.user_interface.is_advanced
		),
		...isOnlyB,
	];

	console.log(
		"basicSolutionSpecificParametersA",
		basicSolutionSpecificParametersA
	);
	console.log(
		"basicSolutionSpecificParametersB",
		basicSolutionSpecificParametersB
	);

	return (
		<div className="space-y-2">
			{/* Basic Unified Parameters */}
			<Card className="border-2 border-dashed border-gray-200">
				<CardHeader>
					<CardTitle>Unified Parameters</CardTitle>
					<CardDescription>
						These are the parameters that are shared between the solutions.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{unified.map((parameter) => (
							<div key={parameter.id}>
								<UserInputParameterCard parameter={parameter} />
							</div>
						))}
						{unified.length === 0 && (
							<div className="text-gray-500 text-sm col-span-full text-center py-4">
								No basic unified parameters found
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<div className="flex flex-row gap-4">
				{/* Solution A Specific Parameters */}
				<Card className="border-2 border-dashed border-blue-200">
					<CardHeader>
						<CardTitle>Solution A Specific Parameters</CardTitle>
						<CardDescription>
							These are the parameters specific to Solution A.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
							{basicSolutionSpecificParametersA.map((parameter) => (
								<div key={parameter.id}>
									<UserInputParameterCard parameter={parameter} />
								</div>
							))}
							{basicSolutionSpecificParametersA.length === 0 && (
								<div className="text-gray-500 text-sm col-span-full text-center py-4">
									No solution specific parameters found
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Solution B Specific Parameters */}
				<Card className="border-2 border-dashed border-green-200">
					<CardHeader>
						<CardTitle>Solution B Specific Parameters</CardTitle>
						<CardDescription>
							These are the parameters specific to Solution B.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
							{basicSolutionSpecificParametersB.map((parameter) => (
								<div key={parameter.id}>
									<UserInputParameterCard parameter={parameter} />
								</div>
							))}
							{basicSolutionSpecificParametersB.length === 0 && (
								<div className="text-gray-500 text-center py-4">
									No solution specific parameters found
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function UserInputParameterCard({ parameter }: { parameter: any }) {
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

function DropdownField({ parameter }: { parameter: any }) {
	return (
		<div className="space-y-2">
			<Label className="text-xs text-gray-500">Select {parameter.name}:</Label>
			<Select>
				<SelectTrigger className="w-full h-10 border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-gray-500">
					<SelectValue placeholder={`Select an option for ${parameter.name}`} />
				</SelectTrigger>
				<SelectContent>
					{parameter.dropdown_options &&
						parameter.dropdown_options.map((option: any, index: number) => (
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

function RangeField({ parameter }: { parameter: any }) {
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

function SimpleField({ parameter }: { parameter: any }) {
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
