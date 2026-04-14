from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.ml_models.engine import ml_engine

router = APIRouter()

@router.get("/synthesis")
def get_cross_domain_correlation(temp: float = 28.5, salinity: float = 34.2, db: Session = Depends(get_db)):
    """
    ML predicted abundance based on ocean parameters.
    """
    prediction = ml_engine.predict_abundance(temperature=temp, salinity=salinity)
    return {
        "analysis": "Random Forest Predictive Report",
        "input_parameters": {"temperature": temp, "salinity": salinity},
        "ml_predictions": prediction
    }

@router.get("/anomaly")
def check_anomaly(temp: float = 30.0, salinity: float = 34.0, do: float = 5.0, ph: float = 8.1):
    """
    Isolation forest anomaly detection.
    """
    return ml_engine.detect_anomaly(temp, salinity, do, ph)

