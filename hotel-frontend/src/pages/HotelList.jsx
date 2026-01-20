import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHotels, createHotel } from '../api/hotelApi';
import { QUERY_KEYS } from '../utils/constants';
import HotelCard from '../components/hotels/HotelCard';
import HotelForm from '../components/hotels/HotelForm';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const HotelList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { 
    data: hotels, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: [QUERY_KEYS.HOTELS],
    queryFn: getHotels,
  });

  const createMutation = useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOTELS] });
      setIsModalOpen(false);
      alert('Hotel created successfully!');
    },
    onError: (error) => {
      alert(error?.response?.data?.detail || 'Failed to create hotel');
    },
  });

  const handleCreateHotel = (formData) => {
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading hotels..." />;
  }

  if (isError) {
    return (
      <ErrorMessage 
        message={error?.response?.data?.detail || 'Failed to load hotels'}
        onRetry={refetch}
      />
    );
  }


  if (!hotels || hotels.length === 0) {
    return (
      <>
        <div className="empty-state">
          <div className="empty-icon">🏨</div>
          <h2 className="empty-title">No Hotels Found</h2>
          <p className="empty-message">
            Get started by creating your first hotel
          </p>
          <button 
            className="btn btn-success"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Hotel
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Hotel"
        >
          <HotelForm
            onSubmit={handleCreateHotel}
            onCancel={() => setIsModalOpen(false)}
            isLoading={createMutation.isPending}
          />
        </Modal>
      </>
    );
  }

  return (
    <>
      <div>
        <div className="hotel-list-header">
          <div>
            <h1 className="hotel-list-title">Hotels</h1>
            <p className="hotel-list-subtitle">
              Manage your hotel properties ({hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'})
            </p>
          </div>
          <button 
            className="btn btn-success"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Hotel
          </button>
        </div>

        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Hotel"
      >
        <HotelForm
          onSubmit={handleCreateHotel}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </>
  );
};

export default HotelList;
