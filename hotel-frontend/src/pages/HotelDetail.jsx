import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHotelById, updateHotel, deleteHotel } from "../api/hotelApi";
import {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../api/roomTypeApi";
import { QUERY_KEYS } from "../utils/constants";
import { formatDate } from "../utils/dateUtils";
import RoomTypeCard from "../components/roomTypes/RoomTypeCard";
import RoomTypeForm from "../components/roomTypes/RoomTypeForm";
import HotelForm from "../components/hotels/HotelForm";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { createRateAdjustment } from "../api/rateAdjustmentApi";
import RateAdjustmentForm from "../components/rateAdjustments/RateAdjustmentForm";
import RateAdjustmentHistory from "../components/rateAdjustments/RateAdjustmentHistory";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddRoomTypeModalOpen, setIsAddRoomTypeModalOpen] = useState(false);
  const [isEditRoomTypeModalOpen, setIsEditRoomTypeModalOpen] = useState(false);
  const [isDeleteRoomTypeDialogOpen, setIsDeleteRoomTypeDialogOpen] =
    useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [isAdjustRateModalOpen, setIsAdjustRateModalOpen] = useState(false);
  const [selectedRoomTypeForAdjustment, setSelectedRoomTypeForAdjustment] =
    useState(null);
  const [isViewHistoryModalOpen, setIsViewHistoryModalOpen] = useState(false);
  const [selectedRoomTypeForHistory, setSelectedRoomTypeForHistory] =
    useState(null);

  const {
    data: hotel,
    isLoading: hotelLoading,
    isError: hotelError,
    error: hotelErrorData,
    refetch: refetchHotel,
  } = useQuery({
    queryKey: [QUERY_KEYS.HOTEL, id],
    queryFn: () => getHotelById(id),
  });

  const {
    data: roomTypes,
    isLoading: roomTypesLoading,
    isError: roomTypesError,
    error: roomTypesErrorData,
    refetch: refetchRoomTypes,
  } = useQuery({
    queryKey: [QUERY_KEYS.ROOM_TYPES, id],
    queryFn: () => getRoomTypes(id),
    enabled: !!id,
  });

  // Update hotel mutation
  const updateMutation = useMutation({
    mutationFn: (formData) => updateHotel(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOTEL, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOTELS] });
      setIsEditModalOpen(false);
      alert("Hotel updated successfully!");
    },
    onError: (error) => {
      alert(error?.response?.data?.detail || "Failed to update hotel");
    },
  });

  // Delete hotel mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOTELS] });
      alert("Hotel deleted successfully!");
      navigate("/hotels");
    },
    onError: (error) => {
      alert(error?.response?.data?.detail || "Failed to delete hotel");
      setIsDeleteDialogOpen(false);
    },
  });

  // Create room type mutation
  const createRoomTypeMutation = useMutation({
    mutationFn: createRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOM_TYPES, id] });
      setIsAddRoomTypeModalOpen(false);
      alert("Room type created successfully!");
    },
    onError: (error) => {
      alert(error?.response?.data?.detail || "Failed to create room type");
    },
  });

  // Update room type mutation
  const updateRoomTypeMutation = useMutation({
    mutationFn: ({ roomTypeId, formData }) =>
      updateRoomType(roomTypeId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOM_TYPES, id] });
      setIsEditRoomTypeModalOpen(false);
      setSelectedRoomType(null);
      alert("Room type updated successfully!");
    },
    onError: (error) => {
      alert(error?.response?.data?.detail || "Failed to update room type");
    },
  });

  // Delete room type mutation
  const deleteRoomTypeMutation = useMutation({
    mutationFn: deleteRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOM_TYPES, id] });
      setIsDeleteRoomTypeDialogOpen(false);
      setSelectedRoomType(null);
      alert("Room type deleted successfully!");
    },
    onError: (error) => {
      alert(error?.response?.data?.detail || "Failed to delete room type");
    },
  });

  // Create rate adjustment mutation
  const createRateAdjustmentMutation = useMutation({
    mutationFn: createRateAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOM_TYPES, id] });
      setIsAdjustRateModalOpen(false);
      setSelectedRoomTypeForAdjustment(null);
      alert("Rate adjustment created successfully!");
    },
    onError: (error) => {
      alert(
        error?.response?.data?.detail || "Failed to create rate adjustment",
      );
    },
  });

  // Handle edit hotel
  const handleEditHotel = (formData) => {
    updateMutation.mutate(formData);
  };

  // Handle delete hotel
  const handleDeleteHotel = () => {
    deleteMutation.mutate();
  };

  // Handle create room type
  const handleCreateRoomType = (formData) => {
    createRoomTypeMutation.mutate(formData);
  };

  // Handle edit room type click
  const handleEditRoomTypeClick = (roomType) => {
    setSelectedRoomType(roomType);
    setIsEditRoomTypeModalOpen(true);
  };

  // Handle edit room type submit
  const handleEditRoomType = (formData) => {
    updateRoomTypeMutation.mutate({
      roomTypeId: selectedRoomType.id,
      formData,
    });
  };

  // Handle delete room type click
  const handleDeleteRoomTypeClick = (roomType) => {
    setSelectedRoomType(roomType);
    setIsDeleteRoomTypeDialogOpen(true);
  };

  // Handle delete room type confirm
  const handleDeleteRoomType = () => {
    if (selectedRoomType) {
      deleteRoomTypeMutation.mutate(selectedRoomType.id);
    }
  };

  // Handle adjust rate click
  const handleAdjustRateClick = (roomType) => {
    setSelectedRoomTypeForAdjustment(roomType);
    setIsAdjustRateModalOpen(true);
  };

  // Handle create rate adjustment
  const handleCreateRateAdjustment = (formData) => {
    createRateAdjustmentMutation.mutate(formData);
  };

  // Handle view history click
  const handleViewHistoryClick = (roomType) => {
    setSelectedRoomTypeForHistory(roomType);
    setIsViewHistoryModalOpen(true);
  };

  // Loading state
  if (hotelLoading) {
    return <LoadingSpinner message="Loading hotel details..." />;
  }

  // Error state
  if (hotelError) {
    return (
      <ErrorMessage
        message={
          hotelErrorData?.response?.data?.detail ||
          "Failed to load hotel details"
        }
        onRetry={refetchHotel}
      />
    );
  }

  return (
    <div>

      <button onClick={() => navigate("/hotels")} className="btn btn-secondary">
        ← Back to Hotels
      </button>

      <div className="card hotel-card">
        <div className="card-header">
          <div>
            <h1 className="heading-1">{hotel.name}</h1>
            <p className="location-text">📍 {hotel.location}</p>
          </div>
          <span
            className={`status-badge ${
              hotel.status === "active" ? "status-active" : "status-inactive"
            }`}
          >
            {hotel.status || "active"}
          </span>
        </div>

        {hotel.description && (
          <div className="description">
            <strong>Description:</strong>
            <p>{hotel.description}</p>
          </div>
        )}

        <div className="metadata">
          <span className="meta-item">
            <strong>Created:</strong> {formatDate(hotel.created_at)}
          </span>
          <span className="meta-item">
            <strong>Hotel ID:</strong> #{hotel.id}
          </span>
        </div>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={() => setIsEditModalOpen(true)}
            disabled={updateMutation.isPending}
          >
            ✏️ Edit Hotel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "🗑️ Deleting..." : "🗑️ Delete Hotel"}
          </button>
        </div>
      </div>

      <div className="room-types-section">
        <div className="room-types-header">
          <div>
            <h2 className="section-title">Room Types</h2>
            <p className="section-subtitle">
              Manage room types and pricing for this hotel
            </p>
          </div>
          <button
            className="btn btn-success"
            onClick={() => setIsAddRoomTypeModalOpen(true)}
          >
            + Add Room Type
          </button>
        </div>

        {/* Room Types Loading */}
        {roomTypesLoading && (
          <div className="center-message">
            <LoadingSpinner message="Loading room types..." />
          </div>
        )}

        {roomTypesError && (
          <ErrorMessage
            message={
              roomTypesErrorData?.response?.data?.detail ||
              "Failed to load room types"
            }
            onRetry={refetchRoomTypes}
          />
        )}

        {!roomTypesLoading && !roomTypesError && (
          <>
            {roomTypes && roomTypes.length > 0 ? (
              <div className="room-types-grid">
                {roomTypes.map((roomType) => (
                  <RoomTypeCard
                    key={roomType.id}
                    roomType={roomType}
                    onEdit={handleEditRoomTypeClick}
                    onDelete={handleDeleteRoomTypeClick}
                    onAdjustRate={handleAdjustRateClick}
                    onViewHistory={handleViewHistoryClick}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🛏️</div>
                <h3 className="empty-title">No Room Types Yet</h3>
                <p className="empty-message">
                  Add room types to start managing pricing for this hotel
                </p>
                <button
                  className="btn btn-success"
                  onClick={() => setIsAddRoomTypeModalOpen(true)}
                >
                  + Add Room Type
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Hotel"
      >
        <HotelForm
          onSubmit={handleEditHotel}
          onCancel={() => setIsEditModalOpen(false)}
          initialData={hotel}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isAddRoomTypeModalOpen}
        onClose={() => setIsAddRoomTypeModalOpen(false)}
        title={`Add Room Type - ${hotel.name}`}
      >
        <RoomTypeForm
          hotelId={parseInt(id)}
          onSubmit={handleCreateRoomType}
          onCancel={() => setIsAddRoomTypeModalOpen(false)}
          isLoading={createRoomTypeMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isEditRoomTypeModalOpen}
        onClose={() => {
          setIsEditRoomTypeModalOpen(false);
          setSelectedRoomType(null);
        }}
        title={`Edit Room Type - ${selectedRoomType?.name || ""}`}
      >
        {selectedRoomType && (
          <RoomTypeForm
            hotelId={parseInt(id)}
            onSubmit={handleEditRoomType}
            onCancel={() => {
              setIsEditRoomTypeModalOpen(false);
              setSelectedRoomType(null);
            }}
            initialData={selectedRoomType}
            isLoading={updateRoomTypeMutation.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteHotel}
        title="Delete Hotel"
        message={`Are you sure you want to delete "${hotel.name}"? This action cannot be undone and will also delete all associated room types.`}
        confirmText="Delete"
        confirmStyle="danger"
      />

      <ConfirmDialog
        isOpen={isDeleteRoomTypeDialogOpen}
        onClose={() => {
          setIsDeleteRoomTypeDialogOpen(false);
          setSelectedRoomType(null);
        }}
        onConfirm={handleDeleteRoomType}
        title="Delete Room Type"
        message={`Are you sure you want to delete "${selectedRoomType?.name}"? This action cannot be undone and will also delete all associated rate adjustments.`}
        confirmText="Delete"
        confirmStyle="danger"
      />
      <Modal
        isOpen={isAdjustRateModalOpen}
        onClose={() => {
          setIsAdjustRateModalOpen(false);
          setSelectedRoomTypeForAdjustment(null);
        }}
        title="Adjust Room Rate"
      >
        {selectedRoomTypeForAdjustment && (
          <RateAdjustmentForm
            roomType={selectedRoomTypeForAdjustment}
            onSubmit={handleCreateRateAdjustment}
            onCancel={() => {
              setIsAdjustRateModalOpen(false);
              setSelectedRoomTypeForAdjustment(null);
            }}
            isLoading={createRateAdjustmentMutation.isPending}
          />
        )}
      </Modal>

      <Modal
        isOpen={isViewHistoryModalOpen}
        onClose={() => {
          setIsViewHistoryModalOpen(false);
          setSelectedRoomTypeForHistory(null);
        }}
        title="Rate Adjustment History"
      >
        {selectedRoomTypeForHistory && (
          <RateAdjustmentHistory roomType={selectedRoomTypeForHistory} />
        )}
      </Modal>
    </div>
  );
}

export default HotelDetail;
