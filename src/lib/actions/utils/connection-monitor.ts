import { checkConnectionHealth } from "../../mongoDb/dbConnect";

interface ConnectionStats {
	totalRequests: number;
	failedRequests: number;
	lastCheck: Date;
	isHealthy: boolean;
	lastError?: string;
}

class ConnectionMonitor {
	private stats: ConnectionStats = {
		totalRequests: 0,
		failedRequests: 0,
		lastCheck: new Date(),
		isHealthy: true,
	};

	private checkInterval: NodeJS.Timeout | null = null;
	private consecutiveFailures = 0;
	private maxConsecutiveFailures = 3;

	constructor() {
		this.startMonitoring();
	}

	async recordRequest(success: boolean) {
		this.stats.totalRequests++;
		if (!success) {
			this.stats.failedRequests++;
		}
	}

	async checkHealth() {
		try {
			const isHealthy = await checkConnectionHealth();
			this.stats.isHealthy = isHealthy;
			this.stats.lastCheck = new Date();
			
			if (isHealthy) {
				this.consecutiveFailures = 0;
				this.stats.lastError = undefined;
			} else {
				this.consecutiveFailures++;
				this.stats.lastError = "Connection health check failed";
			}
			
			// If we have too many consecutive failures, reduce check frequency
			if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
				this.adjustMonitoringFrequency();
			}
			
			return isHealthy;
		} catch (error) {
			console.error('Error checking connection health:', error);
			this.stats.isHealthy = false;
			this.consecutiveFailures++;
			this.stats.lastError = error instanceof Error ? error.message : 'Unknown error';
			
			// If it's an SSL/TLS error, log it specifically
			if (error instanceof Error && (error.message.includes('SSL') || error.message.includes('TLS'))) {
				console.warn('SSL/TLS connection error detected. This may be a temporary issue with MongoDB Atlas.');
			}
			
			return false;
		}
	}

	getStats(): ConnectionStats {
		return { ...this.stats };
	}

	getHealthPercentage(): number {
		if (this.stats.totalRequests === 0) return 100;
		return ((this.stats.totalRequests - this.stats.failedRequests) / this.stats.totalRequests) * 100;
	}

	private adjustMonitoringFrequency() {
		// Stop current monitoring
		if (this.checkInterval) {
			clearInterval(this.checkInterval);
		}
		
		// Use a longer interval when there are connection issues
		const interval = this.consecutiveFailures >= this.maxConsecutiveFailures ? 60000 : 30000; // 1 minute vs 30 seconds
		
		this.checkInterval = setInterval(() => {
			this.checkHealth();
		}, interval);
		
		console.log(`Adjusted monitoring frequency to ${interval}ms due to connection issues`);
	}

	private startMonitoring() {
		// Check connection health every 30 seconds initially
		this.checkInterval = setInterval(() => {
			this.checkHealth();
		}, 30000);
	}

	stopMonitoring() {
		if (this.checkInterval) {
			clearInterval(this.checkInterval);
			this.checkInterval = null;
		}
	}

	// Method to reset monitoring when connection is restored
	resetMonitoring() {
		this.consecutiveFailures = 0;
		this.adjustMonitoringFrequency();
	}
}

// Create a singleton instance
export const connectionMonitor = new ConnectionMonitor();

// Export utility functions
export async function monitorDatabaseOperation<T>(
	operation: () => Promise<T>
): Promise<T> {
	try {
		const result = await operation();
		await connectionMonitor.recordRequest(true);
		return result;
	} catch (error) {
		await connectionMonitor.recordRequest(false);
		throw error;
	}
}

export function getConnectionStats() {
	return connectionMonitor.getStats();
}

export function getConnectionHealthPercentage() {
	return connectionMonitor.getHealthPercentage();
} 