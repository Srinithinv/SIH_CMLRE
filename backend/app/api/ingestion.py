from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import IngestionRecord
import pandas as pd
import io

router = APIRouter()

@router.post("/upload/oceanographic")
async def upload_oceanographic_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Ingest oceanographic CSV or Excel data.
    """
    contents = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents))
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(io.BytesIO(contents))
    else:
        return {"error": "Unsupported file format. Please upload CSV or Excel"}
    
    records = len(df)
    
    # Save a record of the ingestion
    db_record = IngestionRecord(
        filename=file.filename,
        file_type="CSV" if file.filename.endswith('.csv') else "EXCEL",
        file_size=f"{len(contents) / (1024 * 1024):.1f} MB",
        status="Pending"
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return {"message": f"Successfully parsed {records} oceanographic records.", "filename": file.filename, "id": db_record.id}

@router.get("/records")
def list_ingestion_records(db: Session = Depends(get_db)):
    return db.query(IngestionRecord).order_by(IngestionRecord.upload_date.desc()).all()

@router.patch("/records/{record_id}/verify")
def verify_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(IngestionRecord).filter(IngestionRecord.id == record_id).first()
    if record:
        record.status = "Verified"
        db.commit()
        return {"status": "Verified"}
    return {"error": "Record not found"}

@router.post("/upload/taxonomy")
async def upload_taxonomy(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Ingest taxonomy data
    """
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    records = len(df)
    return {"message": f"Successfully parsed {records} taxonomy records.", "filename": file.filename}
