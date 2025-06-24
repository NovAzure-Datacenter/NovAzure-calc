import { Construction, Hammer, HardHat, Wrench } from "lucide-react";

export default function UnderConstruction() {
	return (
        
		<div className="w-full min-h-[calc(96vh)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-50">
			<div className="text-center space-y-8 ">
				{/* Animated Construction Icons */}
				<div className="relative flex justify-center items-center space-x-4 mb-8">
					{/* Main Construction Icon with bounce */}
					<div className="animate-bounce">
						<Construction className="w-16 h-16 text-blue-500" />
					</div>

					{/* Rotating Hammer */}
					<div className="animate-spin" style={{ animationDuration: "3s" }}>
						<Hammer className="w-12 h-12 text-sky-600" />
					</div>

					{/* Floating Hard Hat */}
					<div className="animate-pulse">
						<HardHat className="w-14 h-14 text-blue-600" />
					</div>

					{/* Wiggling Wrench */}
					<div className="animate-bounce" style={{ animationDelay: "0.5s" }}>
						<Wrench className="w-10 h-10 text-sky-500 transform rotate-45 " />
					</div>
				</div>

				{/* Animated Progress Bars */}
				<div className="space-y-3 max-w-md mx-auto">
					<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-blue-400 to-sky-400 rounded-full animate-pulse"
							style={{ width: "65%" }}
						></div>
					</div>
					<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-sky-400 to-blue-400 rounded-full animate-pulse"
							style={{ width: "40%", animationDelay: "0.5s" }}
						></div>
					</div>
					<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-blue-500 to-sky-500 rounded-full animate-pulse"
							style={{ width: "80%", animationDelay: "1s" }}
						></div>
					</div>
				</div>

				{/* Main Content */}
				<div className="space-y-4">
					<h1 className="text-4xl font-bold text-gray-800">
						Under Construction
					</h1>

					<div className="relative">
						<p className="text-lg text-gray-600 max-w-md mx-auto">
							We&apos;re building something amazing! Our team is working hard to
							bring you an incredible product.
						</p>

						{/* Floating construction particles */}
						<div className="absolute -top-2 -left-2 w-2 h-2 bg-sky-400 rounded-full "></div>
						<div
							className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-400 rounded-full "
							style={{ animationDelay: "1s" }}
						></div>
					</div>

				
				</div>

				{/* Moving background elements */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div
						className="absolute top-1/4 left-1/4 w-4 h-4 bg-sky-300 rounded-full opacity-30 animate-bounce"
						style={{ animationDuration: "4s", animationDelay: "0s" }}
					></div>
					<div
						className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-bounce"
						style={{ animationDuration: "5s", animationDelay: "1s" }}
					></div>
					<div
						className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-sky-400 rounded-full opacity-20 animate-bounce"
						style={{ animationDuration: "6s", animationDelay: "2s" }}
					></div>
					<div
						className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-bounce"
						style={{ animationDuration: "3s", animationDelay: "3s" }}
					></div>
				</div>
			</div>
		</div>
	);
}
