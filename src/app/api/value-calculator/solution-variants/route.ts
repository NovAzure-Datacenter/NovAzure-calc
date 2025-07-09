import { NextResponse } from 'next/server';
import { getSolutionVariantsCollection, getSolutionsCollection } from '@/lib/mongoDb/db';
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

    console.log('Looking for solution variants for solutionId:', solutionId);

    // First, get the solution details to check its name
    const solutionsCollection = await getSolutionsCollection();
    const solutionDoc = await solutionsCollection.findOne({
      _id: new ObjectId(solutionId)
    });

    if (!solutionDoc) {
      return NextResponse.json(
        { success: false, error: 'Solution not found' },
        { status: 404 }
      );
    }

    const solutionName = solutionDoc.solution_name || '';
    console.log('Solution name:', solutionName);

    // Find solution variants directly by solution_id field
    const svCollection = await getSolutionVariantsCollection();
    
    let solutionVariantDocs;
    
    if (solutionName.toLowerCase().includes('liquid')) {
      // For Liquid Cooling, return only Immersion Cooling variants
      solutionVariantDocs = await svCollection.find({
        solution_id: new ObjectId(solutionId),
        name: { $regex: /immersion/i }
      }).toArray();
    } else {
      // For other solutions, return all variants (default data center values)
      solutionVariantDocs = await svCollection.find({
        solution_id: new ObjectId(solutionId)
      }).toArray();
    }

    console.log('Found solution variant documents:', solutionVariantDocs.length);

    // Transform to consistent format
    const solutionVariants = solutionVariantDocs.map((sv) => ({
      id: sv._id?.toString(),
      name: sv.name || 'Unknown Solution Variant',
      description: sv.description || ''
    }));

    return NextResponse.json({ 
      success: true, 
      data: solutionVariants
    });
  } catch (error) {
    console.error('Error fetching solution variants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch solution variants' },
      { status: 500 }
    );
  }
}
