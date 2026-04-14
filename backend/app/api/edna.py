from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import EdnaSequence
from app.ml_models.engine import ml_engine

router = APIRouter()

@router.post("/match")
def match_edna_sequence(sequence: str, db: Session = Depends(get_db)):
    """
    Matches an environmental DNA sequence using string alignment logic and saves the result.
    """
    result = ml_engine.simulate_edna_alignment(sequence)
    
    # Save the sequence and match result
    db_edna = EdnaSequence(
        sequence_data=sequence,
        matched_species_id=1, # Mocking a species ID for now
        confidence_score=result["match_confidence"]
    )
    db.add(db_edna)
    db.commit()
    db.refresh(db_edna)
    
    return result

@router.get("/sequences")
def list_edna_sequences(db: Session = Depends(get_db)):
    return db.query(EdnaSequence).all()
