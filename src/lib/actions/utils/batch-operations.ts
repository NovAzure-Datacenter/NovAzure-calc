import { getConnectedClient } from "../../mongoDb/dbConnect";

interface BatchOperation {
	collection: string;
	operation: 'find' | 'findOne' | 'insertOne' | 'updateOne' | 'deleteOne';
	query?: any;
	update?: any;
	data?: any;
}

export async function executeBatchOperations(operations: BatchOperation[]) {
	const { db } = await getConnectedClient();
	const results = [];

	for (const op of operations) {
		try {
			const collection = db.collection(op.collection);
			let result;

			switch (op.operation) {
				case 'find':
					result = await collection.find(op.query || {}).toArray();
					break;
				case 'findOne':
					result = await collection.findOne(op.query || {});
					break;
				case 'insertOne':
					result = await collection.insertOne(op.data || {});
					break;
				case 'updateOne':
					result = await collection.updateOne(op.query || {}, op.update || {});
					break;
				case 'deleteOne':
					result = await collection.deleteOne(op.query || {});
					break;
			}
			results.push({ success: true, result });
		} catch (error) {
			console.error(`Error in batch operation ${op.operation}:`, error);
			results.push({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
		}
	}

	return results;
}

// Optimized function for loading clients with related data
export async function loadClientsWithRelatedData() {
	const { db } = await getConnectedClient();
	
	try {
		// Execute all queries in parallel
		const [clients, industries, technologies] = await Promise.all([
			db.collection('clients').find({}).toArray(),
			db.collection('industry').find({}).toArray(),
			db.collection('technologies').find({}).toArray()
		]);

		return {
			clients,
			industries,
			technologies
		};
	} catch (error) {
		console.error('Error loading data:', error);
		throw error;
	}
} 