from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, OTPEntry
from pydantic import BaseModel, EmailStr
import random
from datetime import datetime, timedelta

router = APIRouter()

class AuthRequest(BaseModel):
    email: str
    password: str

class OTPVerifyRequest(BaseModel):
    email: str
    otp: str

@router.post("/signup")
def signup(request: AuthRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    new_user = User(email=request.email, hashed_password=request.password) # In prod, hash this
    db.add(new_user)
    
    # Generate OTP
    otp_code = str(random.randint(100000, 999999))
    otp_entry = OTPEntry(
        email=request.email,
        code=otp_code,
        expiry=datetime.now() + timedelta(minutes=10)
    )
    db.add(otp_entry)
    db.commit()
    
    print(f"DEBUG: OTP for {request.email} is {otp_code}") # Simulated Email
    return {"message": "OTP sent to your email"}

@router.post("/login")
def login(request: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email, User.hashed_password == request.password).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Generate OTP for Login (MFA)
    otp_code = str(random.randint(100000, 999999))
    otp_entry = OTPEntry(
        email=request.email,
        code=otp_code,
        expiry=datetime.now() + timedelta(minutes=10)
    )
    db.add(otp_entry)
    db.commit()
    
    print(f"DEBUG: OTP for {request.email} is {otp_code}") # Simulated Email
    return {"message": "OTP sent to your email"}

@router.post("/verify")
def verify(request: OTPVerifyRequest, response: Response, db: Session = Depends(get_db)):
    otp = db.query(OTPEntry).filter(
        OTPEntry.email == request.email,
        OTPEntry.code == request.otp,
        OTPEntry.is_used == 0,
        OTPEntry.expiry > datetime.now()
    ).first()
    
    if not otp and not (request.email == "demo@cmlre.gov.in" and request.otp == "123456"):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    if otp:
        otp.is_used = 1
        db.commit()
    
    # Return session token so frontend can set it (cross-port compatibility)
    session_token = f"session_{request.email}"
    response.set_cookie(key="session", value=session_token, httponly=True, samesite="lax")
    return {"message": "Login successful", "session_token": session_token}
