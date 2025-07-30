import { NextResponse } from 'next/server';
import { getSolutionVariantsCollection, getProductsCollection } from '@/lib/mongoDb/db';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const solutionId = searchParams.get('solutionId');

    if (!solutionId) {
      return NextResponse.json(
        { success: false, error: 'Solution ID is required' },
        { status: 400 }
      );
    }

    // Find solution variants that belong to this solution
    const svCollection = await getSolutionVariantsCollection();
    const solutionVariants = await svCollection.find({ 
      solution_id: new ObjectId(solutionId)
    }).toArray();

    if (!solutionVariants || solutionVariants.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    //console.log('Found solution variants:', solutionVariants.length);

    // Get all products that belong to these solution variants
    const productsCollection = await getProductsCollection();
    const solutionVariantIds = solutionVariants.map(sv => sv._id);
    
    const productDocs = await productsCollection.find({
      solution_variant_id: { $in: solutionVariantIds }
    }).toArray();

    //console.log('Found products:', productDocs.length);

    // Transform to consistent format
    const products = productDocs.map((product) => ({
      id: product._id?.toString(),
      name: product.name || 'Unknown Product',
      description: product.description || ''
    }));

    return NextResponse.json({ 
      success: true, 
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
