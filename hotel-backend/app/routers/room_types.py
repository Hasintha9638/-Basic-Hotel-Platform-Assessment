from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import RoomType, RateAdjustment, User
from app.schemas import RoomTypeCreate, RoomTypeUpdate, RoomTypeResponse
from app.auth import get_current_user

router = APIRouter(prefix="/room-types", tags=["Room Types"])


def calculate_effective_rate(room_type: RoomType, db: Session) -> float:
    """
    Calculate effective rate = base_rate + latest adjustment
    """
    # Get the latest adjustment with effective_date <= now
    latest_adjustment = db.query(RateAdjustment).filter(
        RateAdjustment.room_type_id == room_type.id,
        RateAdjustment.effective_date <= datetime.utcnow()
    ).order_by(RateAdjustment.effective_date.desc()).first()
    
    if latest_adjustment:
        return room_type.base_rate + latest_adjustment.adjustment_amount
    else:
        return room_type.base_rate


@router.post("/", response_model=RoomTypeResponse, status_code=status.HTTP_201_CREATED)
def create_room_type(
    room_type: RoomTypeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new room type"""
    db_room_type = RoomType(**room_type.dict())
    db.add(db_room_type)
    db.commit()
    db.refresh(db_room_type)
    
    # Calculate effective rate
    response = RoomTypeResponse.from_orm(db_room_type)
    response.effective_rate = calculate_effective_rate(db_room_type, db)
    return response


@router.get("/", response_model=List[RoomTypeResponse])
def get_room_types(
    skip: int = 0,
    limit: int = 100,
    hotel_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all room types, optionally filter by hotel_id"""
    query = db.query(RoomType)
    
    if hotel_id:
        query = query.filter(RoomType.hotel_id == hotel_id)
    
    room_types = query.offset(skip).limit(limit).all()
    
    # Add effective rate to each
    result = []
    for rt in room_types:
        response = RoomTypeResponse.from_orm(rt)
        response.effective_rate = calculate_effective_rate(rt, db)
        result.append(response)
    
    return result


@router.get("/{room_type_id}", response_model=RoomTypeResponse)
def get_room_type(
    room_type_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific room type by ID"""
    room_type = db.query(RoomType).filter(RoomType.id == room_type_id).first()
    if not room_type:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    response = RoomTypeResponse.from_orm(room_type)
    response.effective_rate = calculate_effective_rate(room_type, db)
    return response


@router.put("/{room_type_id}", response_model=RoomTypeResponse)
def update_room_type(
    room_type_id: int,
    room_type_update: RoomTypeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a room type"""
    room_type = db.query(RoomType).filter(RoomType.id == room_type_id).first()
    if not room_type:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    # Update only provided fields
    update_data = room_type_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(room_type, key, value)
    
    db.commit()
    db.refresh(room_type)
    
    response = RoomTypeResponse.from_orm(room_type)
    response.effective_rate = calculate_effective_rate(room_type, db)
    return response


@router.delete("/{room_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room_type(
    room_type_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a room type"""
    room_type = db.query(RoomType).filter(RoomType.id == room_type_id).first()
    if not room_type:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    db.delete(room_type)
    db.commit()
    return None