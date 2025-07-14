import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'calculations-api',
    timestamp: new Date().toISOString()
  });
} 