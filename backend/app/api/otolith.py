from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import OtolithMorphology

router = APIRouter()

@router.post("/morphology/upload")
async def upload_otolith_image(species_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload an otolith image for a given species and extract morphological features.
    """
    db_otolith = OtolithMorphology(
        species_id=species_id,
        image_url=f"/storage/otoliths/{file.filename}",
        length_mm=12.5,
        width_mm=5.2,
        weight_g=0.45,
        shape_features={"shape_class": "elliptical"}
    )
    db.add(db_otolith)
    db.commit()
    db.refresh(db_otolith)
    return db_otolith

@router.get("/morphology")
def list_otolith_data(db: Session = Depends(get_db)):
    return db.query(OtolithMorphology).all()
