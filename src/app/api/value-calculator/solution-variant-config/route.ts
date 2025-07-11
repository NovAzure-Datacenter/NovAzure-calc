import { NextResponse } from 'next/server';
import { getCalculatorConfig } from '@/lib/constants/calculator-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const solutionName = searchParams.get('solutionName');

    // Get configuration from centralized config
    const config_fields = getCalculatorConfig(solutionName || undefined);

    return NextResponse.json({ 
      success: true, 
      data: { config_fields }
    });
  } catch (error) {
    console.error('Error fetching solution variant config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch solution variant configuration' },
      { status: 500 }
    );
  }
}
