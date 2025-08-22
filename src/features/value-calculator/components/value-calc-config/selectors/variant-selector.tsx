import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ClientSolution,
	getClientSolutions,
} from "@/lib/actions/clients-solutions/clients-solutions";
import { useEffect, useState } from "react";
import { ClientData } from "@/lib/actions/clients/clients";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { stringToIconComponent } from "@/lib/icons/lucide-icons";

export default function VariantSelector(props: {
	selectedSolution: string;
	hasSelectedSolution: boolean;
	mode: "single" | "compare" | null;
	variant: "A" | "B";
	setSelectedVariant: (variant: string) => void;
	clientData: ClientData;
	setSelectedVariantData: (variantData: ClientSolution | null) => void;
}) {
	const {
		selectedSolution,
		hasSelectedSolution,
		mode,
		variant,
		setSelectedVariant,
		clientData,
		setSelectedVariantData,
	} = props;
	const [availableVariants, setAvailableVariants] = useState<ClientSolution[]>(
		[]
	);

	useEffect(() => {
		const fetchVariants = async () => {
			const variants = await getClientSolutions(clientData.id || "");

			const filteredVariants = variants.solutions?.filter((variant) => {
				return variant.solution === selectedSolution;
			});

			setAvailableVariants(filteredVariants || []);
		};
		fetchVariants();
	}, [clientData, selectedSolution]);

	const handleVariantChange = (variantId: string) => {
		setSelectedVariant(variantId);
		const variantData = availableVariants.find(
			(v) => v.solution_variant === variantId
		);
		setSelectedVariantData(variantData || null);
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<label
					className={`text-sm font-medium text-gray-700 ${
						!hasSelectedSolution ? "text-gray-100" : ""
					}`}
				>
					Variant {variant}
				</label>
				<Select
					disabled={!hasSelectedSolution}
					onValueChange={handleVariantChange}
				>
					<SelectTrigger
						className={`w-full ${
							!hasSelectedSolution
								? "bg-gray-100 cursor-not-allowed opacity-50"
								: ""
						}`}
					>
						<SelectValue placeholder="Select a variant" />
					</SelectTrigger>
					<SelectContent>
						{availableVariants.map((variant) => (
							<SelectItem
								key={variant.solution_variant}
								value={variant.solution_variant || ""}
							>
								{variant.solution_variant_name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

export function VariantSelectorCard({
	selectedVariantData,
}: {
	selectedVariantData: ClientSolution;
}) {
	return (
		selectedVariantData && (
			<Card className="border-l-4 border-l-blue-500">
				<CardContent className="p-2">
					<div className="flex items-center gap-2 mb-2">
						{selectedVariantData.solution_variant_icon && (
							<div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
								{(() => {
									const IconComponent = stringToIconComponent(
										selectedVariantData.solution_variant_icon
									);
									return <IconComponent className="w-4 h-4 text-blue-600" />;
								})()}
							</div>
						)}
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<h3 className="text-sm font-semibold text-gray-900 truncate">
									{selectedVariantData.solution_variant_name}
								</h3>
								{selectedVariantData.solution_variant_product_badge && (
									<Badge
										variant="default"
										className="text-xs bg-green-100 text-green-800 flex-shrink-0"
									>
										Product
									</Badge>
								)}
							</div>
							{selectedVariantData.solution_variant_description && (
								<p className="text-xs text-gray-600 line-clamp-2">
									{selectedVariantData.solution_variant_description}
								</p>
							)}
						</div>
					</div>
					
				</CardContent>
                
                {/* <Separator className="my-0 py-0" /> */}

                {/* Compact Parameters and Calculations Summary */}
				{/* <CardFooter className="p-2 py-0 my-0 item-center">
					<div className="flex items-center gap-4 text-xs justify-between">
						<div className="flex items-center gap-1">
							<span className="text-gray-500">Parameters:</span>
							<span className="font-medium text-gray-700">
								{selectedVariantData.parameters?.length || 0}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<span className="text-gray-500">Calculations:</span>
							<span className="font-medium text-gray-700">
								{selectedVariantData.calculations.length}
							</span>
						</div>
					</div>
				</CardFooter> */}
			</Card>
		)
	);
}
