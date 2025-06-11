# NovAzure Backend

A modern FastAPI backend for the NovAzure sustainability and data center optimization platform.

## 🚀 Tech Stack

- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern, fast web framework for building APIs with Python
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database for flexible data storage
- **[Motor](https://motor.readthedocs.io/)** - Async MongoDB driver for Python
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** - Data validation and settings management using type hints
- **[Uvicorn](https://www.uvicorn.org/)** - ASGI server for running FastAPI applications
- **[python-dotenv](https://pypi.org/project/python-dotenv/)** - Environment variable management

## 📁 Backend Structure & File Purposes

### **Root Level:**
- **`requirements.txt`** - Python dependencies (FastAPI, MongoDB, Pydantic, etc.)
- **`venv/`** - Virtual environment for isolated Python dependencies
- **`app/`** - Main application code directory

### **App Directory (`app/`):**
- **`main.py`** - FastAPI application entry point, server initialization and route registration
- **`api/`** - API version management and endpoint grouping (e.g., `/v1/` routes)
- **`routes/`** - HTTP route handlers for each feature (auth, calculators, dashboard, etc.)
- **`models/`** - Database models/schemas for MongoDB collections (User, Company, Calculator data)
- **`schemas/`** - Pydantic models for request/response validation and serialization
- **`services/`** - Business logic layer, calculator algorithms, and data processing
- **`database/`** - Database connection, configuration, and MongoDB client setup
- **`core/`** - Application configuration, settings, security, and middleware
- **`utils/`** - Helper functions, utilities, and shared functionality
- **`tests/`** - Unit tests, integration tests, and test fixtures

### **Planned Feature Alignment:**
- **Calculator endpoints** → Handle value calculations, UPS comparisons, CO2e analysis
- **User management** → Authentication, role-based access (Seller/Buyer/Admin)
- **Company workspaces** → Multi-tenant data isolation and management
- **Dashboard data** → Aggregated metrics, saved scenarios, project tracking
- **Solutions API** → Technology recommendations and integration data

## 🏗️ Architecture

This backend supports the NovAzure sustainability platform with:
- Clean separation of concerns
- Async/await patterns for high performance
- Type-safe data validation with Pydantic
- Scalable folder structure for future features
- RESTful API design principles
