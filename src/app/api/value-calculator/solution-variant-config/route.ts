import { NextResponse } from 'next/server';

// Define the type for config fields
type ConfigField = {
  id: string;
  label: string;
  type: string;
  value: string;
  unit?: string;
  required: boolean;
  options?: string[];
  min_value?: number;
  max_value?: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const solutionName = searchParams.get('solutionName'); // Use solution name, not variant
    //const solutionVariantId = searchParams.get('solutionVariantId');

    // Default config fields
    const config_fields: ConfigField[] = [
      {
        id: 'data_centre_type',
        label: 'Data Centre Type',
        type: 'select',
        value: '',
        options: ['Greenfield', 'HPC/AI'],
        required: true
      },
      {
        id: 'project_location',
        label: 'Project Location',
        type: 'text',
        value: '',
        required: true
      },
      {
        id: 'utilisation_percentage',
        label: 'Utilisation Percentage',
        type: 'number',
        value: '',
        unit: '%',
        required: true
      },
      {
        id: 'data_hall_capacity',
        label: 'Data Hall Capacity',
        type: 'number',
        value: '',
        unit: 'kW',
        required: true
      },
      {
        id: 'planned_years_operation',
        label: 'Planned Years of Operation',
        type: 'number',
        value: '',
        unit: 'years',
        required: true
      },
      {
        id: 'first_year_operation',
        label: 'First Year of Operation',
        type: 'number',
        value: '',
        required: true
      }
    ];

    // Add air cooling fields if solution is air cooling
    if (solutionName && /air cooling/i.test(solutionName)) {
      config_fields.push(
        {
          id: 'air_annualized_ppue',
          label: 'Air Annualized pPUE',
          type: 'number',
          value: '',
          unit: '',
          required: true,
          min_value: 1.0,
          max_value: 3.0
        },
        {
          id: 'default_air_ppue',
          label: 'Default Air Annualised pPUE for Location and Utilisation',
          type: 'number',
          value: '#N/A',
          unit: '',
          required: false
        }
      );
    }

    // Add liquid cooling fields if solution is liquid cooling
    if (solutionName && /liquid cooling/i.test(solutionName)) {
      config_fields.push(
        {
          id: 'annualised_liquid_cooled_ppue',
          label: 'Annualised Liquid Cooled pPUE',
          type: 'number',
          value: '#N/A',
          unit: '',
          required: false
        }
      );
    }

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
