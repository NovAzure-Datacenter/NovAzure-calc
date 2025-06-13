import { MongoClient, Db, ServerApiVersion } from "mongodb";


if (!process.env.MONGODB_URI) {
	throw new Error("MONGODB_URI is not defined in environment variables");
}

const uri = process.env.MONGODB_URI;
const dbName = "platform_db"; 

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;


export async function getConnectedClient(): Promise<{
	client: MongoClient;
	db: Db;
}> {
	// If a connection is already cached, return it
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb };
	}

	// If no cached connection, create a new one
	const client = new MongoClient(uri, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		},
	});

	try {
		await client.connect();
		const db = client.db(dbName);

		cachedClient = client;
		cachedDb = db;

		console.log("Successfully connected to MongoDB (new connection).");
		return { client, db };
	} catch (error) {
		console.error("Could not connect to MongoDB", error);
		if (client) {
			await client.close();
		}
		throw error;
	}
}
