# Deployment Guide: Next.js App with Integrated Backend

This guide explains how to deploy your Next.js application with the integrated TypeScript backend to Vercel.

## What We've Done

1. **Converted Python Backend to TypeScript**: The Python FastAPI backend has been converted to TypeScript and integrated as Next.js API routes.

2. **Updated API Client**: The frontend API client now uses relative URLs (`/api/calculations/*`) instead of external backend URLs.

3. **Created API Routes**: 
   - `/api/calculations/calculate` - Main calculation endpoint
   - `/api/calculations/compare` - Comparison endpoint  
   - `/api/calculations/health` - Health check endpoint

## Files Created/Modified

### New Files:
- `src/lib/services/calculations.ts` - TypeScript calculation logic
- `src/app/api/calculations/calculate/route.ts` - Calculate endpoint
- `src/app/api/calculations/compare/route.ts` - Compare endpoint
- `src/app/api/calculations/health/route.ts` - Health check endpoint
- `vercel.json` - Vercel configuration
- `DEPLOYMENT.md` - This deployment guide

### Modified Files:
- `src/lib/api/calculations.ts` - Updated to use relative URLs
- `src/app/home/tools-and-scenarios/value-calculator/components/configuration-card.tsx` - Updated API call

## Deployment Steps

### 1. Commit Your Changes
```bash
git add .
git commit -m "Integrate backend calculations into Next.js API routes"
git push origin main
```

### 2. Deploy to Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Vercel will automatically detect the changes and deploy
4. The deployment will include both frontend and backend

### 3. Verify Deployment
1. Check that your app is accessible at your Vercel URL
2. Test the calculation functionality
3. Verify API endpoints are working:
   - `https://your-app.vercel.app/api/calculations/health`
   - `https://your-app.vercel.app/api/calculations/calculate` (POST)
   - `https://your-app.vercel.app/api/calculations/compare` (POST)

## Environment Variables

No additional environment variables are needed for the calculation API since all logic is now self-contained. However, ensure your existing environment variables are set in Vercel:

- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Your app URL

## Testing Locally

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the API endpoints**:
   ```bash
   # Health check
   curl http://localhost:3000/api/calculations/health
   
   # Calculate endpoint
   curl -X POST http://localhost:3000/api/calculations/calculate \
     -H "Content-Type: application/json" \
     -d '{
       "data_hall_design_capacity_mw": 1,
       "first_year_of_operation": 2024,
       "project_location": "United States",
       "percentage_of_utilisation": 80,
       "planned_years_of_operation": 10,
       "annualised_ppue": 1.2,
       "solution_type": "air_cooling"
     }'
   ```

## Benefits of This Approach

1. **Single Deployment**: Everything runs on Vercel - no separate backend hosting
2. **Better Performance**: No cross-origin requests
3. **Simplified Maintenance**: Single codebase and deployment
4. **Cost Effective**: No additional backend hosting costs
5. **Type Safety**: Full TypeScript support across frontend and backend

## Troubleshooting

### API Routes Not Working
- Check Vercel function logs in the dashboard
- Ensure all required fields are provided in requests
- Verify the calculation service is properly imported

### Calculation Errors
- Check the browser console for detailed error messages
- Verify input data types and ranges
- Test with the health check endpoint first

### Deployment Issues
- Ensure all files are committed and pushed
- Check Vercel build logs for any TypeScript errors
- Verify `vercel.json` configuration is correct

## Migration Notes

The Python backend code has been converted to TypeScript with the following simplifications:

1. **Database Queries**: Some database-dependent calculations use default values instead of database queries
2. **Advanced Features**: Some advanced configuration options are simplified
3. **Error Handling**: Enhanced error handling with detailed error messages

If you need the full Python backend functionality, you can:
1. Deploy the Python backend separately (Railway, Render, etc.)
2. Update the API client to use the external backend URL
3. Set the `NEXT_PUBLIC_API_URL` environment variable

## Support

If you encounter issues:
1. Check the Vercel function logs
2. Test endpoints locally first
3. Verify all environment variables are set
4. Check the browser console for client-side errors 