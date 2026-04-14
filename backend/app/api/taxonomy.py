from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import SpeciesTaxonomy
from pydantic import BaseModel

class SpeciesCreate(BaseModel):
    species: str
    family: str
    common_name: str
    status: str = "Stable"

router = APIRouter()

@router.get("/tree")
def get_taxonomy_tree(db: Session = Depends(get_db)):
    """
    Retrieve the hierarchical taxonomic tree for visualization
    """
    # Dummy structure for frontend prototyping
    return {
        "name": "Animalia",
        "children": [
            {
                "name": "Chordata",
                "children": [
                    {
                        "name": "Actinopterygii",
                        "children": [{"name": "Perciformes", "species_count": 120}]
                    }
                ]
            }
        ]
    }

@router.get("/species")
def list_species(db: Session = Depends(get_db)):
    return db.query(SpeciesTaxonomy).all()

@router.post("/species")
def create_species(species: SpeciesCreate, db: Session = Depends(get_db)):
    db_species = SpeciesTaxonomy(
        scientific_name=species.species,
        common_name=species.common_name,
        family=species.family,
        conservation_status=species.status
    )
    db.add(db_species)
    db.commit()
    db.refresh(db_species)
    return db_species

@router.get("/species/{species_id}")
def get_species_details(species_id: int, db: Session = Depends(get_db)):
    return db.query(SpeciesTaxonomy).filter(SpeciesTaxonomy.id == species_id).first()
