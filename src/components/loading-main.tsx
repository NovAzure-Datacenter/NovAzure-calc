import { Loader2, Circle, RotateCcw, Zap } from "lucide-react";

export default function Loading() {
	return (
		<div className="min-h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-50">
			<div className="text-center space-y-8">
				{/* Animated Progress Ring */}
				<div className="relative w-24 h-24 mx-auto mb-8">
					<svg className="w-24 h-24" viewBox="0 0 24 24">
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							className="text-gray-200"
						/>
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							strokeDasharray="62.83"
							strokeDashoffset="15.71"
							className="text-blue-500"
							style={{
								animation: "spin 2s linear infinite",
								transformOrigin: "12px 12px",
							}}
						/>
					</svg>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse"></div>
					</div>
				</div>

				{/* Loading Dots */}
				<div className="flex justify-center space-x-2">
					<div
						className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
						style={{ animationDelay: "0s" }}
					></div>
					<div
						className="w-3 h-3 bg-sky-500 rounded-full animate-bounce"
						style={{ animationDelay: "0.2s" }}
					></div>
					<div
						className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
						style={{ animationDelay: "0.4s" }}
					></div>
				</div>

				{/* Main Content */}
				<div className="space-y-4">
					<h1 className="text-4xl font-bold text-gray-800">Loading</h1>
					<div className="relative">
						<p className="text-lg text-gray-600 max-w-md mx-auto">
							Please wait while we prepare everything for you...
						</p>

						{/* Floating loading particles */}
						<div className="absolute -top-2 -left-2 w-2 h-2 bg-sky-400 rounded-full animate-ping"></div>
						<div
							className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"
							style={{ animationDelay: "0.5s" }}
						></div>
					</div>
				</div>

				{/* Moving background elements */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div
						className="absolute top-1/4 left-1/4 w-4 h-4 bg-sky-300 rounded-full opacity-30 animate-bounce"
						style={{ animationDuration: "3s", animationDelay: "0s" }}
					></div>
					<div
						className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-pulse"
						style={{ animationDuration: "2s", animationDelay: "1s" }}
					></div>
					<div
						className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-sky-400 rounded-full opacity-20 animate-ping"
						style={{ animationDuration: "4s", animationDelay: "2s" }}
					></div>
					<div
						className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-bounce"
						style={{ animationDuration: "2.5s", animationDelay: "1.5s" }}
					></div>
					<div
						className="absolute top-1/2 left-1/5 w-3 h-3 bg-sky-500 rounded-full opacity-25 animate-pulse"
						style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
					></div>
				</div>
			</div>
		</div>
	);
}
