
import { Db, Collection } from "mongodb";
import { getConnectedClient } from "./dbConnect";

// These functions ensure a connection is established before returning the db or collection
export async function getDb(): Promise<Db> {
    const { db } = await getConnectedClient();
    return db;
}

export async function getUsersCollection(): Promise<Collection> {
    const db = await getDb();
    return db.collection("users");
}



