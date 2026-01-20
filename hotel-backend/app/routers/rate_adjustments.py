from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import RateAdjustment, RoomType, User
from app.schemas import RateAdjustmentCreate, RateAdjustmentResponse
from app.auth import get_current_user

router = APIRouter(prefix="/rate-adjustments", tags=["Rate Adjustments"])


@router.post("/", response_model=RateAdjustmentResponse, status_code=status.HTTP_201_CREATED)
def create_rate_adjustment(
    adjustment: RateAdjustmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify room type exists
    room_type = db.query(RoomType).filter(RoomType.id == adjustment.room_type_id).first()
    if not room_type:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    # Create adjustment
    db_adjustment = RateAdjustment(**adjustment.dict())
    db.add(db_adjustment)
    db.commit()
    db.refresh(db_adjustment)
    return db_adjustment


@router.get("/", response_model=List[RateAdjustmentResponse])
def get_rate_adjustments(
    skip: int = 0,
    limit: int = 100,
    room_type_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
  
    query = db.query(RateAdjustment)
    
    if room_type_id:
        query = query.filter(RateAdjustment.room_type_id == room_type_id)
    
    adjustments = query.order_by(RateAdjustment.effective_date.desc()).offset(skip).limit(limit).all()
    return adjustments


@router.get("/{adjustment_id}", response_model=RateAdjustmentResponse)
def get_rate_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific rate adjustment by ID"""
    adjustment = db.query(RateAdjustment).filter(RateAdjustment.id == adjustment_id).first()
    if not adjustment:
        raise HTTPException(status_code=404, detail="Rate adjustment not found")
    return adjustment


@router.get("/room-type/{room_type_id}/history", response_model=List[RateAdjustmentResponse])
def get_room_type_adjustment_history(
    room_type_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
  
    adjustments = db.query(RateAdjustment).filter(
        RateAdjustment.room_type_id == room_type_id
    ).order_by(RateAdjustment.effective_date.desc()).all()
    
    return adjustments


@router.delete("/{adjustment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rate_adjustment(
    adjustment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a rate adjustment"""
    adjustment = db.query(RateAdjustment).filter(RateAdjustment.id == adjustment_id).first()
    if not adjustment:
        raise HTTPException(status_code=404, detail="Rate adjustment not found")
    
    db.delete(adjustment)
    db.commit()
    return None