import { NextResponse } from 'next/server';
import { getIndustriesCollection, getTechnologiesCollection } from '@/lib/mongoDb/db';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industryId = searchParams.get('industryId');

    if (!industryId) {
      return NextResponse.json(
        { success: false, error: 'Industry ID is required' },
        { status: 400 }
      );
    }

    // Find the industry document
    const industriesCollection = await getIndustriesCollection();
    const industry = await industriesCollection.findOne({ 
      _id: new ObjectId(industryId)
    });

    if (!industry) {
      return NextResponse.json({ success: true, data: [] });
    }

    const technologyIds = industry.technologies || [];
    
    if (technologyIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Look up technology documents
    const technologiesCollection = await getTechnologiesCollection();
    const techObjectIds = technologyIds.map((techId: string) => new ObjectId(techId));
    const technologyDocs = await technologiesCollection.find({
      _id: { $in: techObjectIds }
    }).toArray();

    // Transform to consistent format
    const technologies = technologyDocs.map((tech) => ({
      id: tech._id?.toString(),
      name: tech.name || 'Unknown Technology',
      description: tech.description || ''
    }));

    return NextResponse.json({ 
      success: true, 
      data: technologies
    });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technologies' },
      { status: 500 }
    );
  }
}
