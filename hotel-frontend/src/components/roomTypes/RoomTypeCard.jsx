import { formatDateShort } from '../../utils/dateUtils';

const RoomTypeCard = ({ roomType, onEdit, onDelete, onAdjustRate, onViewHistory }) => {
  const effectiveRate = roomType.base_rate;

  return (
    <div className="room-type-card">
      <div className="room-type-header">
        <h4 className="room-type-name">{roomType.name}</h4>
        <div className="rate-container">
          <span className="rate-label">Base Rate:</span>
          <span className="rate-value">${roomType.base_rate?.toFixed(2)}</span>
        </div>
      </div>

      <div className="room-type-body">
        {roomType.description && (
          <div className="room-type-info">
            <span className="room-type-label">📝 Description:</span>
            <span className="room-type-value">{roomType.description}</span>
          </div>
        )}

        <div className="room-type-info">
          <span className="room-type-label">💰 Effective Rate:</span>
          <span className="effective-rate">${effectiveRate?.toFixed(2)}/night</span>
        </div>

        {roomType.created_at && (
          <div className="room-type-info">
            <span className="room-type-label">📅 Created:</span>
            <span className="room-type-value">
              {formatDateShort(roomType.created_at)}
            </span>
          </div>
        )}
      </div>

      <div className="room-type-footer">
        <button 
          className="room-type-edit"
          onClick={() => onEdit(roomType)}
        >
          ✏️ Edit
        </button>
        <button 
          className="room-type-delete"
          onClick={() => onDelete(roomType)}
        >
          🗑️ Delete
        </button>
      </div>

      <div className="adjustment-footer">
        <button 
          className="adjust-rate-btn"
          onClick={() => onAdjustRate(roomType)}
        >
          💵 Adjust Rate
        </button>
        <button 
          className="history-btn"
          onClick={() => onViewHistory(roomType)}
        >
          📜 View History
        </button>
      </div>
    </div>
  );
};

export default RoomTypeCard;