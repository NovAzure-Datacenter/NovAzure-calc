import { closeConnection } from "../../mongoDb/dbConnect";

// Graceful shutdown handler for the application
export async function gracefulShutdown(signal: string) {
	console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
	
	try {
		// Close MongoDB connection
		await closeConnection();
		console.log('MongoDB connection closed successfully.');
		
		// Add any other cleanup tasks here
		// For example: close other database connections, file handles, etc.
		
		console.log('Graceful shutdown completed.');
		process.exit(0);
	} catch (error) {
		console.error('Error during graceful shutdown:', error);
		process.exit(1);
	}
}

// Set up process signal handlers
export function setupGracefulShutdown() {
	// Handle SIGTERM (termination signal)
	process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
	
	// Handle SIGINT (interrupt signal - Ctrl+C)
	process.on('SIGINT', () => gracefulShutdown('SIGINT'));
	
	// Handle uncaught exceptions
	process.on('uncaughtException', (error) => {
		console.error('Uncaught Exception:', error);
		gracefulShutdown('uncaughtException');
	});
	
	// Handle unhandled promise rejections
	process.on('unhandledRejection', (reason, promise) => {
		console.error('Unhandled Rejection at:', promise, 'reason:', reason);
		gracefulShutdown('unhandledRejection');
	});
} 