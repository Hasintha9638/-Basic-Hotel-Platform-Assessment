from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# User table (for login)
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# Hotel table
class Hotel(Base):
    __tablename__ = "hotels"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    location = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="active")
    # Relationship: One hotel has many room types
    room_types = relationship("RoomType", back_populates="hotel", cascade="all, delete-orphan")


# Room Type table
class RoomType(Base):
    __tablename__ = "room_types"
    
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "Deluxe", "Suite"
    base_rate = Column(Float, nullable=False)  # Base price per night
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    hotel = relationship("Hotel", back_populates="room_types")
    rate_adjustments = relationship("RateAdjustment", back_populates="room_type", cascade="all, delete-orphan")


# Rate Adjustment table (with history)
class RateAdjustment(Base):
    __tablename__ = "rate_adjustments"
    
    id = Column(Integer, primary_key=True, index=True)
    room_type_id = Column(Integer, ForeignKey("room_types.id"), nullable=False)
    adjustment_amount = Column(Float, nullable=False)  # Can be positive or negative
    effective_date = Column(DateTime, nullable=False)  # When this rate takes effect
    reason = Column(Text)  # Why the adjustment was made
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    room_type = relationship("RoomType", back_populates="rate_adjustments")