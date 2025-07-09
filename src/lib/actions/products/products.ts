"use server";

import { getProductsCollection } from "../../mongoDb/db";
import { ObjectId } from "mongodb";

export interface CreateProductData {
	name: string;
	description: string;
	model: string;
	category: string;
	efficiency: string;
	specifications: Array<{
		key: string;
		value: string;
	}>;
	features: string[];
	status: "pending" | "verified" | "draft";
	solutionId: string;
	created_by: string;
	client_id: string;
}

export interface ProductData {
	_id: string;
	name: string;
	description: string;
	model: string;
	category: string;
	efficiency: string;
	specifications: Array<{
		key: string;
		value: string;
	}>;
	features: string[];
	status: "pending" | "verified" | "draft";
	solutionId: string;
	created_by: string;
	client_id: string;
	created_at: Date;
	updated_at: Date;
}

export interface UpdateProductData {
	name?: string;
	description?: string;
	model?: string;
	category?: string;
	efficiency?: string;
	specifications?: Array<{
		key: string;
		value: string;
	}>;
	features?: string[];
	status?: "pending" | "verified" | "draft";
	solutionId?: string;
}

export async function createProduct(data: CreateProductData) {
	try {
		const productsCollection = await getProductsCollection();

		const newProduct = {
			name: data.name,
			description: data.description,
			model: data.model,
			category: data.category,
			efficiency: data.efficiency,
			specifications: data.specifications,
			features: data.features,
			status: data.status,
			solutionId: data.solutionId,
			created_by: data.created_by,
			client_id: data.client_id,
			created_at: new Date(),
			updated_at: new Date(),
		};

		const result = await productsCollection.insertOne(newProduct);

		if (!result.acknowledged) {
			return { error: "Failed to create product" };
		}

		return {
			success: true,
			product_id: result.insertedId.toString(),
			message: "Product created successfully",
		};
	} catch (error) {
		console.error("Error creating product:", error);
		return { error: "Failed to create product" };
	}
}

export async function getProducts() {
	try {
		const productsCollection = await getProductsCollection();
		const products = await productsCollection.find({}).toArray();

		return {
			success: true,
			products: products.map((product) => ({
				id: product._id.toString(),
				name: product.name,
				description: product.description,
				model: product.model,
				category: product.category,
				efficiency: product.efficiency,
				specifications: product.specifications,
				features: product.features,
				status: product.status,
				solutionId: product.solutionId,
				created_by: product.created_by,
				client_id: product.client_id,
				created_at: product.created_at,
				updated_at: product.updated_at,
			})),
		};
	} catch (error) {
		console.error("Error fetching products:", error);
		return { error: "Failed to fetch products" };
	}
}

export async function getProductById(productId: string) {
	try {
		const productsCollection = await getProductsCollection();

		const product = await productsCollection.findOne({
			_id: new ObjectId(productId),
		});

		if (!product) {
			return { error: "Product not found" };
		}

		return {
			success: true,
			product: {
				id: product._id.toString(),
				name: product.name,
				description: product.description,
				model: product.model,
				category: product.category,
				efficiency: product.efficiency,
				specifications: product.specifications,
				features: product.features,
				status: product.status,
				solutionId: product.solutionId,
				created_by: product.created_by,
				client_id: product.client_id,
				created_at: product.created_at,
				updated_at: product.updated_at,
			},
		};
	} catch (error) {
		console.error("Error fetching product:", error);
		return { error: "Failed to fetch product" };
	}
}

export async function getProductsBySolutionId(solutionId: string) {
	try {
		const productsCollection = await getProductsCollection();
		const products = await productsCollection
			.find({ solutionId: solutionId })
			.toArray();

		return {
			success: true,
			products: products.map((product) => ({
				id: product._id.toString(),
				name: product.name,
				description: product.description,
				model: product.model,
				category: product.category,
				efficiency: product.efficiency,
				specifications: product.specifications,
				features: product.features,
				status: product.status,
				solutionId: product.solutionId,
				created_by: product.created_by,
				client_id: product.client_id,
				created_at: product.created_at,
				updated_at: product.updated_at,
			})),
		};
	} catch (error) {
		console.error("Error fetching products by solution ID:", error);
		return { error: "Failed to fetch products" };
	}
}

export async function getProductsByClientId(clientId: string) {
	try {
		const productsCollection = await getProductsCollection();
		const products = await productsCollection
			.find({ client_id: clientId })
			.toArray();

		return {
			success: true,
			products: products.map((product) => ({
				id: product._id.toString(),
				name: product.name,
				description: product.description,
				model: product.model,
				category: product.category,
				efficiency: product.efficiency,
				specifications: product.specifications,
				features: product.features,
				status: product.status,
				solutionId: product.solutionId,
				created_by: product.created_by,
				client_id: product.client_id,
				created_at: product.created_at,
				updated_at: product.updated_at,
			})),
		};
	} catch (error) {
		console.error("Error fetching products by client ID:", error);
		return { error: "Failed to fetch products" };
	}
}

export async function updateProduct(
	productId: string,
	data: UpdateProductData
) {
	try {
		const productsCollection = await getProductsCollection();

		const updateData: any = {
			updated_at: new Date(),
		};

		if (data.name !== undefined) updateData.name = data.name;
		if (data.description !== undefined) updateData.description = data.description;
		if (data.model !== undefined) updateData.model = data.model;
		if (data.category !== undefined) updateData.category = data.category;
		if (data.efficiency !== undefined) updateData.efficiency = data.efficiency;
		if (data.specifications !== undefined) updateData.specifications = data.specifications;
		if (data.features !== undefined) updateData.features = data.features;
		if (data.status !== undefined) updateData.status = data.status;
		if (data.solutionId !== undefined) updateData.solutionId = data.solutionId;

		const result = await productsCollection.updateOne(
			{ _id: new ObjectId(productId) },
			{ $set: updateData }
		);

		if (!result.acknowledged) {
			return { error: "Failed to update product" };
		}

		if (result.matchedCount === 0) {
			return { error: "Product not found" };
		}

		return {
			success: true,
			message: "Product updated successfully",
		};
	} catch (error) {
		console.error("Error updating product:", error);
		return { error: "Failed to update product" };
	}
}

export async function deleteProduct(productId: string) {
	try {
		const productsCollection = await getProductsCollection();

		const result = await productsCollection.deleteOne({
			_id: new ObjectId(productId),
		});

		if (!result.acknowledged) {
			return { error: "Failed to delete product" };
		}

		if (result.deletedCount === 0) {
			return { error: "Product not found" };
		}

		return {
			success: true,
			message: "Product deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting product:", error);
		return { error: "Failed to delete product" };
	}
}
