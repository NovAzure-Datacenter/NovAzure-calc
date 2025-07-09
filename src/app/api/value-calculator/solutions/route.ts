import { NextResponse } from 'next/server';
import { getSolutionsCollection } from '../../../../lib/mongoDb/db';

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

    // Find solutions directly by applicable_technologies field
    const solutionsCollection = await getSolutionsCollection();
    const solutionDocs = await solutionsCollection.find({
      applicable_technologies: technologyId
    }).toArray();


    // Transform to consistent format
    const solutions = solutionDocs.map((sol) => ({
      id: sol._id?.toString(),
      name: sol.solution_name || 'Unknown Solution',
      description: sol.solution_description || ''
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
