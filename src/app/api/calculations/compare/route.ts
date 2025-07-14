import { NextRequest, NextResponse } from 'next/server';
import { compareSolutions } from '@/lib/services/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'data_hall_design_capacity_mw',
      'first_year_of_operation',
      'project_location',
      'percentage_of_utilisation',
      'planned_years_of_operation',
      'annualised_ppue'
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Perform comparison calculation
    const result = await compareSolutions(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Comparison calculation error:', error);
    return NextResponse.json(
      { error: 'Comparison calculation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 