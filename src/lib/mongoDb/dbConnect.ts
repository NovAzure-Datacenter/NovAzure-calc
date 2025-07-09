import { MongoClient, Db, ServerApiVersion } from "mongodb";


if (!process.env.MONGODB_URI) {
	throw new Error("MONGODB_URI is not defined in environment variables");
}

const uri = process.env.MONGODB_URI;
const dbName = "platform_db"; 

// Global connection cache
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let isConnecting = false;
let connectionPromise: Promise<{ client: MongoClient; db: Db }> | null = null;

export async function getConnectedClient(): Promise<{
	client: MongoClient;
	db: Db;
}> {
	// If a connection is already cached and healthy, return it
	if (cachedClient && cachedDb) {
		try {
			// Test the connection with a shorter timeout
			await cachedClient.db().admin().ping({ maxTimeMS: 5000 });
			return { client: cachedClient, db: cachedDb };
		} catch (error) {
			console.log("Cached connection failed, creating new connection...");
			cachedClient = null;
			cachedDb = null;
		}
	}

	// If already connecting, wait for the existing connection promise
	if (isConnecting && connectionPromise) {
		return connectionPromise;
	}

	// Create new connection with proper pooling
	isConnecting = true;
	connectionPromise = createNewConnection();

	try {
		const result = await connectionPromise;
		return result;
	} finally {
		isConnecting = false;
		connectionPromise = null;
	}
}

async function createNewConnection(): Promise<{ client: MongoClient; db: Db }> {
	const client = new MongoClient(uri, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		},
		// Connection pooling configuration
		maxPoolSize: 5, // Reduced from 10 to minimize connection issues
		minPoolSize: 0, // Start with 0 to avoid connection issues
		maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
		connectTimeoutMS: 15000, // Increased from 10 to 15 seconds
		socketTimeoutMS: 45000,  // 45 second socket timeout
		// Retry configuration
		retryWrites: true,
		retryReads: true,
		// Heartbeat configuration
		heartbeatFrequencyMS: 30000, // Increased from 10 to 30 seconds
		// Server selection timeout
		serverSelectionTimeoutMS: 10000, // Increased from 5 to 10 seconds
		// SSL/TLS configuration
		ssl: true,
		tls: true,
		tlsAllowInvalidCertificates: false,
		tlsAllowInvalidHostnames: false,
		// Additional connection options for better stability
		compressors: ['zlib'],
		zlibCompressionLevel: 6,
		// Connection monitoring
		monitorCommands: false, // Disable command monitoring to reduce overhead
	});

	try {
		await client.connect();
		const db = client.db(dbName);

		// Test the connection with timeout
		await db.admin().ping({ maxTimeMS: 5000 });

		cachedClient = client;
		cachedDb = db;

		console.log("Successfully connected to MongoDB with connection pooling.");
		return { client, db };
	} catch (error) {
		console.error("Could not connect to MongoDB", error);
		if (client) {
			try {
				await client.close();
			} catch (closeError) {
				console.error("Error closing client:", closeError);
			}
		}
		throw error;
	}
}

// Graceful shutdown function
export async function closeConnection(): Promise<void> {
	if (cachedClient) {
		try {
			await cachedClient.close();
			console.log("MongoDB connection closed gracefully.");
		} catch (error) {
			console.error("Error closing MongoDB connection:", error);
		} finally {
			cachedClient = null;
			cachedDb = null;
		}
	}
}

// Health check function with better error handling
export async function checkConnectionHealth(): Promise<boolean> {
	try {
		if (!cachedClient || !cachedDb) {
			return false;
		}
		
		// Use a shorter timeout for health checks
		await cachedClient.db().admin().ping({ maxTimeMS: 3000 });
		return true;
	} catch (error) {
		console.error("Connection health check failed:", error);
		
		// If it's an SSL/TLS error, try to reset the connection
		if (error instanceof Error && (error.message.includes('SSL') || error.message.includes('TLS'))) {
			console.log("SSL/TLS error detected, resetting connection...");
			try {
				await closeConnection();
			} catch (closeError) {
				console.error("Error during connection reset:", closeError);
			}
		}
		
		return false;
	}
}

// Enhanced connection function with retry logic
export async function getConnectedClientWithRetry(maxRetries: number = 3): Promise<{
	client: MongoClient;
	db: Db;
}> {
	let lastError: Error | null = null;
	
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			return await getConnectedClient();
		} catch (error) {
			lastError = error as Error;
			console.error(`Connection attempt ${attempt} failed:`, error);
			
			if (attempt < maxRetries) {
				// Wait before retrying (exponential backoff)
				const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
				console.log(`Retrying in ${delay}ms...`);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	}
	
	throw lastError || new Error("Failed to connect to MongoDB after multiple attempts");
}
