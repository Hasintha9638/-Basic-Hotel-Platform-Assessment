from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# ===== AUTH SCHEMAS =====
class Token(BaseModel):
    access_token: str
    token_type: str
    userdata: str

class LoginRequest(BaseModel):
    username: str
    password: str


# ===== HOTEL SCHEMAS =====
class HotelCreate(BaseModel):
    name: str
    location: Optional[str] = None
    description: Optional[str] = None

class HotelUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

class HotelResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    description: Optional[str]
    created_at: datetime
    status: Optional[str] = "active"

    class Config:
        from_attributes = True  # Allows conversion from SQLAlchemy model


# ===== ROOM TYPE SCHEMAS =====
class RoomTypeCreate(BaseModel):
    hotel_id: int
    name: str
    base_rate: float
    description: Optional[str] = None

class RoomTypeUpdate(BaseModel):
    name: Optional[str] = None
    base_rate: Optional[float] = None
    description: Optional[str] = None

class RoomTypeResponse(BaseModel):
    id: int
    hotel_id: int
    name: str
    base_rate: float
    description: Optional[str]
    created_at: datetime
    effective_rate: Optional[float] = None  # Calculated field
    
    class Config:
        from_attributes = True


# ===== RATE ADJUSTMENT SCHEMAS =====
class RateAdjustmentCreate(BaseModel):
    room_type_id: int
    adjustment_amount: float
    effective_date: datetime
    reason: Optional[str] = None

class RateAdjustmentResponse(BaseModel):
    id: int
    room_type_id: int
    adjustment_amount: float
    effective_date: datetime
    reason: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True