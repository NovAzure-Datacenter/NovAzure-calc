interface LoadingIndicatorProps {
	isLoading: boolean;
	message?: string;
}

export function LoadingIndicator({ isLoading, message = "Loading..." }: LoadingIndicatorProps) {
	if (!isLoading) return null;

	return (
		<div className="flex items-center justify-center py-8">
			<div className="flex items-center gap-3">
				<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
				<span className="text-sm text-muted-foreground">
					{message}
				</span>
			</div>
		</div>
	);
} 