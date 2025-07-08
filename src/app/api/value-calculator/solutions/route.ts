import { NextResponse } from 'next/server';
import { getSolutionsCollection } from '../../../../lib/mongoDb/db';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const technologyId = searchParams.get('technologyId');

    if (!technologyId) {
      return NextResponse.json(
        { success: false, error: 'Technology ID is required' },
        { status: 400 }
      );
    }

    console.log('Looking for solutions for technologyId:', technologyId);

    // Find solutions directly by technology_id field
    const solutionsCollection = await getSolutionsCollection();
    const solutionDocs = await solutionsCollection.find({
      technology_id: new ObjectId(technologyId)
    }).toArray();

    console.log('Found solution documents:', solutionDocs.length);

    // Transform to consistent format
    const solutions = solutionDocs.map((sol) => ({
      id: sol._id?.toString(),
      name: sol.name || 'Unknown Solution',
      description: sol.description || ''
    }));

    return NextResponse.json({ 
      success: true, 
      data: solutions
    });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch solutions' },
      { status: 500 }
    );
  }
}
