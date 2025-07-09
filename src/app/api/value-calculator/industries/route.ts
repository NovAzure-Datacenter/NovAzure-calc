import { NextResponse } from 'next/server';
import { getIndustriesCollection, getDb } from '../../../../lib/mongoDb/db';

export async function GET() {
  try {
    // First, let's see what collections exist in your database
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Get the industries collection using the correct function
    const industriesCollection = await getIndustriesCollection();
    const industryCount = await industriesCollection.countDocuments();
    console.log('Documents in industry collection:', industryCount);
    
    // Get a sample document to see the structure
    const sampleIndustry = await industriesCollection.findOne();
    console.log('Sample industry document:', sampleIndustry);
    
    // Fetch all industries
    const industries = await industriesCollection.find({}).toArray();
    console.log('Fetched industries count:', industries.length);
    
    return NextResponse.json({ 
      success: true, 
      data: industries,
      debug: {
        collections: collections.map(c => c.name),
        industryCount,
        sampleIndustry
      }
    });
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}
