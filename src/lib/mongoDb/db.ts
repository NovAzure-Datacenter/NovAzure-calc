import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
	throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(process.env.MONGODB_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const dbName = "platform_db";

export const db = client.db(dbName);
export const usersCollection = db.collection("users");


export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
        throw error;
    }
}

export async function disconnectFromMongoDB() {
    try {
        await client.close();
        console.log("Successfully disconnected from MongoDB.");
    } catch (error) {
        console.error("Could not disconnect from MongoDB", error);
        throw error;
    }
}



