import { Db, Collection } from "mongodb";
import { getConnectedClient, getConnectedClientWithRetry } from "./dbConnect";

// These functions ensure a connection is established before returning the db or collection
export async function getDb(): Promise<Db> {
	try {
		const { db } = await getConnectedClient();
		return db;
	} catch (error) {
		console.error("Failed to get database connection:", error);
		// Try with retry logic as fallback
		const { db } = await getConnectedClientWithRetry();
		return db;
	}
}

// Users Collection
export async function getUsersCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("users");
}

// Industries Collection
export async function getIndustriesCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("industry");
}

// Technologies Collection
export async function getTechnologiesCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("technologies");
}

// Clients Collection
export async function getClientsCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("clients");
}

// Solutions Collection
export async function getSolutionsCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("solutions");
}

export async function getSolutionVariantsCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("solution_variants");
}

// Products Collection
export async function getProductsCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("products");
}

