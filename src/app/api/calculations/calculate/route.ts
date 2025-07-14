import { NextRequest, NextResponse } from 'next/server';
import { calculateSolution } from '@/lib/services/calculations';

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
      'annualised_ppue',
      'solution_type'
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate solution type
    if (!['air_cooling', 'chassis_immersion'].includes(body.solution_type)) {
      return NextResponse.json(
        { error: 'Invalid solution_type. Must be "air_cooling" or "chassis_immersion"' },
        { status: 400 }
      );
    }

    // Perform calculation
    const result = await calculateSolution(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Calculation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 