import { NextResponse } from 'next/server';
import { getProductConfigCollection } from '@/lib/mongoDb/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching product config for productId:', productId);

    // Get the product configuration collection
    const productConfigCollection = await getProductConfigCollection();
    
    // Find the configuration for this specific product
    const productConfig = await productConfigCollection.findOne({ 
      product_id: productId 
    });

    console.log('Found product config:', productConfig);

    if (!productConfig) {
      // Return a default/empty configuration if none found
      console.log('No product config found, returning default config');
      const defaultConfig = {
        product_id: productId,
        config_fields: [
          {
            id: 'power_consumption',
            label: 'Power Consumption',
            type: 'number',
            value: '100',
            unit: 'kW',
            required: true,
            min_value: 1,
            max_value: 10000
          },
          {
            id: 'capacity',
            label: 'System Capacity',
            type: 'number',
            value: '1000',
            unit: 'units',
            required: true,
            min_value: 1,
            max_value: 100000
          },
          {
            id: 'efficiency_rating',
            label: 'Efficiency Rating',
            type: 'select',
            value: 'high',
            options: ['low', 'medium', 'high', 'ultra'],
            required: true
          }
        ],
        global_fields_1: [
          {
            id: 'electricity_cost',
            label: 'Electricity Cost',
            type: 'number',
            value: '0.12',
            unit: '$/kWh',
            required: true,
            min_value: 0.01,
            max_value: 1.0
          },
          {
            id: 'carbon_factor',
            label: 'Carbon Emission Factor',
            type: 'number',
            value: '0.4',
            unit: 'kg CO2/kWh',
            required: true,
            min_value: 0.1,
            max_value: 2.0
          },
          {
            id: 'project_lifetime',
            label: 'Project Lifetime',
            type: 'number',
            value: '10',
            unit: 'years',
            required: true,
            min_value: 1,
            max_value: 50
          }
        ],
        global_fields_2: [
          {
            id: 'maintenance_cost',
            label: 'Annual Maintenance Cost',
            type: 'number',
            value: '5000',
            unit: '$/year',
            required: true,
            min_value: 0,
            max_value: 100000
          },
          {
            id: 'installation_cost',
            label: 'Installation Cost',
            type: 'number',
            value: '50000',
            unit: '$',
            required: true,
            min_value: 1000,
            max_value: 1000000
          },
          {
            id: 'operating_hours',
            label: 'Operating Hours per Day',
            type: 'number',
            value: '24',
            unit: 'hours',
            required: true,
            min_value: 1,
            max_value: 24
          }
        ]
      };

      return NextResponse.json({ 
        success: true, 
        data: defaultConfig,
        debug: {
          message: 'Using default configuration as no specific config found',
          productId
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: productConfig
    });
  } catch (error) {
    console.error('Error fetching product configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product configuration' },
      { status: 500 }
    );
  }
}
