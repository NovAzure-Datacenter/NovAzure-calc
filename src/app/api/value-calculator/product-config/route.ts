import { NextResponse } from 'next/server';
import { getProductsCollection, getSolutionsCollection } from '../../../../lib/mongoDb/db';
import { ObjectId } from 'mongodb';

// Helper function to check if a product is a chassis immersion product
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkIfChassisImmersionProduct(product: any, solution: any): boolean {
  if (!product) return false;
  
  // Check product name for chassis immersion keywords
  const productName = (product.name || '').toLowerCase();
  const productDescription = (product.description || '').toLowerCase();
  
  // Check solution name and description if available
  const solutionName = (solution?.name || '').toLowerCase();
  const solutionDescription = (solution?.description || '').toLowerCase();
  
  // Combine all text to search
  const searchText = `${productName} ${productDescription} ${solutionName} ${solutionDescription}`;
  
  console.log('Checking immersion cooling keywords in:', searchText);
  
  // Look for immersion cooling keywords
  const isImmersion = searchText.includes('chassis') || 
                     searchText.includes('immersion') || 
                     searchText.includes('liquid') ||
                     searchText.includes('plc') ||
                     searchText.includes('iceotope');
  
  return isImmersion;
}

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


    // Get the product
    const productsCollection = await getProductsCollection();
    const product = await productsCollection.findOne({ 
      _id: new ObjectId(productId)
    });

    if (!product) {
      console.log('Product not found, returning default config');
      return NextResponse.json({ 
        success: true, 
        data: {
          product_id: productId,
          config_fields: [],
          global_fields_1: [],
          global_fields_2: []
        }
      });
    }


    // Get the solution to help determine product type
    let solution = null;
    if (product.solution_variant_id) {
      const solutionsCollection = await getSolutionsCollection();
      const solutionVariant = await solutionsCollection.findOne({
        _id: new ObjectId(product.solution_variant_id)
      });
      
      if (solutionVariant && solutionVariant.solution_id) {
        solution = await solutionsCollection.findOne({
          _id: new ObjectId(solutionVariant.solution_id)
        });
      }
    }

    // Check if this is a chassis immersion product
    const isChassisImmersion = checkIfChassisImmersionProduct(product, solution);

    // Always return chassis immersion config if detected
    if (isChassisImmersion) {
      
      const chassisImmersionConfig = {
        product_id: productId,
        config_fields: [
          {
            id: 'data_centre_type',
            label: 'Data Centre Type',
            type: 'select',
            value: 'Select an Option',
            options: ['Select an Option', 'General Purpose', 'HPC/AI'],
            required: true
          },
          {
            id: 'project_location',
            label: 'Project Location',
            type: 'select',
            value: 'Select an Option',
            options: ['Select an Option', 'UK', 'US', 'EU', 'Asia'],
            required: true
          },
          {
            id: 'utilisation_percentage',
            label: '% of Utilisation',
            type: 'select',
            value: 'Select an Option',
            options: ['Select an Option', '50%', '60%', '70%', '80%', '90%', '100%'],
            required: true
          },
          {
            id: 'data_hall_capacity',
            label: 'Data Hall Design Capacity MW',
            type: 'number',
            value: '',
            unit: 'MW',
            required: true,
            min_value: 0.1,
            max_value: 100
          },
          {
            id: 'planned_years_operation',
            label: 'Planned Number of Years of Operation',
            type: 'number',
            value: '',
            unit: 'years',
            required: true,
            min_value: 1,
            max_value: 30
          },
          {
            id: 'first_year_operation',
            label: 'First Year of Operation',
            type: 'select',
            value: 'Select an Option',
            options: ['Select an Option', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
            required: true
          },
          // Iceotope Configuration fields for immersion cooling
          {
            id: 'annualised_liquid_cooled_ppue',
            label: 'Annualised Liquid Cooled pPUE',
            type: 'number',
            value: '1.05',
            unit: '',
            required: true,
            min_value: 1.0,
            max_value: 2.0
          }
        ],
        global_fields_1: [],
        global_fields_2: []
      };

      return NextResponse.json({ 
        success: true, 
        data: chassisImmersionConfig
      });
    }

    // Default configuration for other products
    const defaultConfig = {
      product_id: productId,
      config_fields: [
        {
          id: 'data_centre_type',
          label: 'Data Centre Type',
          type: 'select',
          value: 'Select an Option',
          options: ['Select an Option', 'General Purpose', 'HPC/AI'],
          required: true
        },
        {
          id: 'project_location',
          label: 'Project Location',
          type: 'select',
          value: 'Select an Option',
          options: ['Select an Option', 'UK', 'US', 'EU', 'Asia'],
          required: true
        },
        {
          id: 'utilisation_percentage',
          label: '% of Utilisation',
          type: 'select',
          value: 'Select an Option',
          options: ['Select an Option', '50%', '60%', '70%', '80%', '90%', '100%'],
          required: true
        },
        {
          id: 'data_hall_capacity',
          label: 'Data Hall Design Capacity MW',
          type: 'number',
          value: '',
          unit: 'MW',
          required: true,
          min_value: 0.1,
          max_value: 100
        },
        {
          id: 'planned_years_operation',
          label: 'Planned Number of Years of Operation',
          type: 'number',
          value: '',
          unit: 'years',
          required: true,
          min_value: 1,
          max_value: 30
        },
        {
          id: 'first_year_operation',
          label: 'First Year of Operation',
          type: 'select',
          value: 'Select an Option',
          options: ['Select an Option', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
          required: true
        },
        // Air Cooling Configuration fields
        {
          id: 'air_annualized_ppue',
          label: 'Air Annualized pPUE',
          type: 'number',
          value: '1.5',
          unit: '',
          required: true,
          min_value: 1.0,
          max_value: 3.0
        },
        {
          id: 'default_air_ppue',
          label: 'Default Air Annualised pPUE for Location and Utilisation',
          type: 'number',
          value: '1.4',
          unit: '',
          required: false,
          min_value: 1.0,
          max_value: 3.0
        }
      ],
      global_fields_1: [],
      global_fields_2: []
    };

    return NextResponse.json({ 
      success: true, 
      data: defaultConfig
    });
  } catch (error) {
    console.error('Error fetching product config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product configuration' },
      { status: 500 }
    );
  }
}
