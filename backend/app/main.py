from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.calculate import router as calculation_router

app = FastAPI(
    title="Parameter Calculator API",
    description="A calculation engine for parameter dependencies",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calculation_router, prefix="/api/v1", tags=["calculations"])


async def root():
    return {"message": "Parameter Calculator API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
    )
