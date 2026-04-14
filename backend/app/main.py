from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CMLRE Unified Data Platform",
    description="API for integrating oceanographic, taxonomic, and eDNA datasets.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.core.database import engine, Base
from app.models import models
Base.metadata.create_all(bind=engine)

from app.api import ingestion, taxonomy, analytics, otolith, edna, auth

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(ingestion.router, prefix="/api/v1/ingestion", tags=["Ingestion"])
app.include_router(taxonomy.router, prefix="/api/v1/taxonomy", tags=["Taxonomy"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(otolith.router, prefix="/api/v1/otolith", tags=["Otolith Morphology"])
app.include_router(edna.router, prefix="/api/v1/edna", tags=["eDNA Biology"])

@app.get("/")
def read_root():
    return {"message": "Welcome to CMLRE Unified Data Platform API", "status": "online"}
