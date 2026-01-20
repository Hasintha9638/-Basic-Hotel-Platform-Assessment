import { useNavigate } from 'react-router-dom';
import { formatDateShort } from '../../utils/dateUtils';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/hotels/${hotel.id}`);
  };

  return (
    <div className="hotel-card-component">
      <div className="card-header-flex">
        <h3 className="room-type-name">{hotel.name}</h3>
        <span className={`status-badge ${
          hotel.status === 'active' ? 'status-active' : 'status-inactive'
        }`}>
          {hotel.status || 'active'}
        </span>
      </div>

      <div className="room-type-body">
        <div className="card-info">
          <span className="card-label">📍 Location:</span>
          <span className="card-value">{hotel.location || 'N/A'}</span>
        </div>

        {hotel.description && (
          <div className="card-info">
            <span className="card-label">📝 Description:</span>
            <span className="card-value">{hotel.description}</span>
          </div>
        )}

        <div className="card-info">
          <span className="card-label">📅 Created:</span>
          <span className="card-value">{formatDateShort(hotel.created_at)}</span>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #eee'}}>
        <button onClick={handleViewDetails} className="view-details-btn">
          View Details
        </button>
      </div>
    </div>
  );
};

export default HotelCard;