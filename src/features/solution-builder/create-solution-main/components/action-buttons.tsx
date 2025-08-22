import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ActionButtons(props: {
	currentStep: number;
	handlePrevious: () => void;
	handleNext: () => void;
	isNextDisabled: () => boolean;
}) {
	const { currentStep, handlePrevious, handleNext, isNextDisabled } = props;
	return (
		<div className="w-full flex flex-row justify-between flex-shrink-0 ">
			<Button
				variant="outline"
				onClick={handlePrevious}
				disabled={currentStep === 1}
				className="flex items-center gap-2"
				size="sm"
			>
				<ArrowLeft className="h-4 w-4" />
				Previous
			</Button>

			{currentStep < 5 ? (
				<Button
					onClick={handleNext}
					// disabled={isNextDisabled()}
					className="flex items-center gap-2"
					size="sm"
				>
					Next
					<ArrowRight className="h-4 w-4" />
				</Button>
			) : null}
		</div>
	);
}
