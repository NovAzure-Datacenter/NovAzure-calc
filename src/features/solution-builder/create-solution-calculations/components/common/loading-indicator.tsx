/**
 * LoadingIndicator component
 * Shows loading state for calculations
 */
export function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
	if (!isLoading) return null;

	return (
		<div className="flex items-center justify-center py-8">
			<div className="flex items-center gap-3">
				<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
				<span className="text-sm text-muted-foreground">
					Loading calculations and global parameters...
				</span>
			</div>
		</div>
	);
} 