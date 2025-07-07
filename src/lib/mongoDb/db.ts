import { Db, Collection } from "mongodb";
import { getConnectedClient } from "./dbConnect";

// These functions ensure a connection is established before returning the db or collection
export async function getDb(): Promise<Db> {
	const { db } = await getConnectedClient();
	return db;
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