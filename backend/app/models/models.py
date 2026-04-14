from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class SpeciesTaxonomy(Base):
    __tablename__ = "species_taxonomy"
    
    id = Column(Integer, primary_key=True, index=True)
    scientific_name = Column(String, unique=True, index=True)
    common_name = Column(String, index=True)
    kingdom = Column(String)
    phylum = Column(String)
    class_name = Column(String, name="class") # mapping 'class' as SQL column
    order = Column(String)
    family = Column(String)
    genus = Column(String)
    conservation_status = Column(String, default="Stable")

class IngestionRecord(Base):
    __tablename__ = "ingestion_records"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_type = Column(String)
    file_size = Column(String)
    upload_date = Column(DateTime, default=func.now())
    status = Column(String, default="Pending") # Pending, Verified

class OceanographicData(Base):
    __tablename__ = "oceanographic_data"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=func.now())
    latitude = Column(Float)
    longitude = Column(Float)
    temperature = Column(Float)
    salinity = Column(Float)
    dissolved_oxygen = Column(Float)
    ph_level = Column(Float)

class OtolithMorphology(Base):
    __tablename__ = "otolith_morphology"
    
    id = Column(Integer, primary_key=True, index=True)
    species_id = Column(Integer, ForeignKey("species_taxonomy.id"))
    image_url = Column(String)
    length_mm = Column(Float)
    width_mm = Column(Float)
    weight_g = Column(Float)
    shape_features = Column(JSON) # Extracted features from image

class EdnaSequence(Base):
    __tablename__ = "edna_sequence"
    
    id = Column(Integer, primary_key=True, index=True)
    sample_location_lat = Column(Float)
    sample_location_lon = Column(Float)
    sequence_data = Column(String)
    matched_species_id = Column(Integer, ForeignKey("species_taxonomy.id"), nullable=True)
    confidence_score = Column(Float, nullable=True)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=func.now())

class OTPEntry(Base):
    __tablename__ = "otp_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    code = Column(String)
    expiry = Column(DateTime)
    is_used = Column(Integer, default=0)
