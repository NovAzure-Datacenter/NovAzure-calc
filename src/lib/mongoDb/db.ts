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

//Solution Variants Collection
export async function getSolutionVariantsCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("solution_variants");
}

// Solutions Collection
export async function getSolutionsCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("solutions");
}

// Products Collection
export async function getProductsCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("products");
}

// Product Configuration Collection
export async function getProductConfigCollection(): Promise<Collection> {
	const db = await getDb();
	return db.collection("product_configurations");
}