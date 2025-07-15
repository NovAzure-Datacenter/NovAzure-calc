# Docker Setup for NovAzure Calculator

This document explains how to run the NovAzure Calculator application using Docker.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and Shadcn UI
- **Backend**: FastAPI with Python 3.11 and MongoDB
- **Database**: MongoDB (external or containerized)

## 📋 Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git**
- **At least 4GB of available RAM**
- **At least 10GB of free disk space**

## ⏱️ Build Time Expectations

**Important**: The initial build process takes approximately **900 seconds (15 minutes)** due to:
- Installing Node.js dependencies (including Sharp for image optimization)
- Building Next.js application with TypeScript compilation
- Installing Python dependencies
- Building optimized production images

Subsequent builds will be much faster due to Docker layer caching.

## 🚀 Quick Start

### 1. Clone and Navigate to Project
```bash
cd /path/to/novazure-calc
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```bash
# Copy the example file
cp env.example .env

# Or create manually with these basic variables:
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/platform_db
MONGO_DETAILS=mongodb://localhost:27017
DATABASE_NAME=novazure-dev
APP_TITLE=NovAzure API
APP_VERSION=0.1.0
CLIENT_ORIGIN_URL=http://localhost:3000
SECRET_KEY=your-super-secret-key-change-this-in-production
```

### 3. Build and Start Services
```bash
# This will take approximately 15 minutes on first run
docker-compose up --build -d
```

### 4. Monitor Build Progress
```bash
# Watch the build logs
docker-compose logs -f

# Check build status
docker-compose ps
```

### 5. Access Your Application
Once the build is complete:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🐳 Docker Files Overview

### Production Files
- `Dockerfile` - Multi-stage production build for Next.js
- `docker-compose.yml` - Production orchestration
- `backend/Dockerfile` - FastAPI backend container
- `.dockerignore` - Optimizes build context

### Development Files
- `Dockerfile.dev` - Development build with hot reloading
- `docker-compose.dev.yml` - Development orchestration

## 🔧 Services

### Frontend (Next.js)
- **URL:** http://localhost:3000
- **Port:** 3000
- **Features:** Optimized production build with image optimization

### Backend (FastAPI)
- **URL:** http://localhost:8000
- **Port:** 8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/

## 🛠️ Docker Commands

### Production Commands
```bash
# Build and start all services (takes ~15 minutes first time)
docker-compose up --build -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

### Development Commands
```bash
# Start development environment with hot reloading
docker-compose -f docker-compose.dev.yml up -d

# View development logs
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Individual Service Commands
```bash
# Start only frontend
docker-compose up frontend -d

# Start only backend
docker-compose up backend -d

# Access frontend container
docker-compose exec frontend sh

# Access backend container
docker-compose exec backend bash
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Takes Too Long
**Solution**: This is normal for the first build. Subsequent builds will be faster.
```bash
# Check build progress
docker-compose logs -f

# If stuck, you can cancel and retry
# Press Ctrl+C, then run:
docker-compose up --build -d
```

#### 2. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Stop conflicting services or change ports in docker-compose.yml
```

#### 3. Memory Issues During Build
**Symptoms**: Build fails with "killed" or memory errors
**Solutions**:
- Increase Docker memory limit (8GB recommended)
- Close other applications
- Restart Docker Desktop

#### 4. Sharp Package Issues
**Symptoms**: "sharp is required" error
**Solution**: The Dockerfile is configured to handle this automatically. If issues persist:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose up --build -d
```

#### 5. MongoDB Connection Issues
```bash
# Check backend logs
docker-compose logs backend

# Test API endpoint
curl http://localhost:8000/
```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v --remove-orphans

# Remove all images and cache
docker system prune -a

# Start fresh (will take ~15 minutes)
docker-compose up --build -d
```

## 📊 Performance Tips

### For Faster Builds
1. **Use SSD storage** for Docker volumes
2. **Allocate more RAM** to Docker (8GB+ recommended)
3. **Use Docker BuildKit** (enabled by default in newer versions)
4. **Keep Docker Desktop updated**

### For Production
1. **Use multi-stage builds** (already configured)
2. **Optimize image layers** (already configured)
3. **Use .dockerignore** (already configured)
4. **Enable Docker layer caching**

## 🏭 Production Deployment

### Environment Variables
Update your `.env` file for production:


```

### Security Considerations
- Use strong, unique secrets
- Enable HTTPS
- Configure proper CORS settings
- Set up MongoDB authentication
- Use environment-specific configurations

## 📁 File Structure

```
novazure-calc/
├── Dockerfile                 # Production frontend build
├── docker-compose.yml        # Production orchestration
├── .dockerignore             # Docker build exclusions
├── next.config.js            # Next.js configuration
├── package.json              # Frontend dependencies
├── env.example               # Environment variables template
├── src/                      # Frontend source code
├── backend/
│   ├── Dockerfile           # Backend container
│   ├── requirements.txt     # Python dependencies
│   └── app/                 # Backend source code
└── README-Docker.md         # This file
```

## 🎯 Development Workflow

1. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Make changes to code** - Hot reloading will automatically update the application

3. **View logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

4. **Test production build:**
   ```bash
   docker-compose up --build -d
   ```

5. **Stop services:**
   ```bash
   docker-compose down
   ```

## 🔗 Useful Links

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **Docker Documentation:** https://docs.docker.com/

## ⚠️ Important Notes

1. **First build takes ~15 minutes** - This is normal due to dependency installation and compilation
2. **Ensure sufficient disk space** - At least 10GB free space recommended
3. **Allocate enough RAM** - 4GB+ recommended for Docker
4. **Use SSD storage** - Significantly improves build performance
5. **Keep Docker updated** - Ensures compatibility and performance

## 🆘 Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs -f`
3. Ensure all prerequisites are met
4. Try resetting everything: `docker-compose down -v && docker system prune -a`
5. Check Docker Desktop settings and resource allocation 