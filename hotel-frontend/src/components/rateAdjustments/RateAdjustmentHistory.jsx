import { useQuery } from '@tanstack/react-query';
import { getRateAdjustmentHistory } from '../../api/rateAdjustmentApi';
import { QUERY_KEYS } from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const RateAdjustmentHistory = ({ roomType }) => {
  const {
    data: adjustments,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: [QUERY_KEYS.RATE_HISTORY, roomType.id],
    queryFn: () => getRateAdjustmentHistory(roomType.id),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading adjustment history..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.detail || 'Failed to load adjustment history'}
        onRetry={refetch}
      />
    );
  }

  const isActive = (effectiveDate) => {
    return new Date(effectiveDate) <= new Date();
  };

  const getCurrentAdjustment = () => {
    if (!adjustments || adjustments.length === 0) return null;

    const activeAdjustments = adjustments
      .filter(adj => isActive(adj.effective_date))
      .sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date));

    return activeAdjustments[0] || null;
  };

  const currentAdjustment = getCurrentAdjustment();

  const calculateEffectiveRate = (adjustment) => {
    return roomType.base_rate + (adjustment?.adjustment_amount || 0);
  };

  if (!adjustments || adjustments.length === 0) {
    return (
      <div className="history-empty-state">
        <div className="history-empty-icon">📜</div>
        <h3 className="history-empty-title">No Adjustment History</h3>
        <p className="history-empty-message">
          This room type has no rate adjustments yet. The current rate is the base rate.
        </p>
        <div className="history-current-rate-box">
          <span className="history-current-rate-label">Current Rate:</span>
          <span className="history-current-rate-value">${roomType.base_rate?.toFixed(2)}/night</span>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3 className="history-room-name">{roomType.name}</h3>
        <div className="history-base-rate-info">
          <span className="history-base-rate-label">Base Rate:</span>
          <span className="history-base-rate-value">${roomType.base_rate?.toFixed(2)}</span>
        </div>
      </div>
      <div className="history-section">
        <h4 className="history-section-title">Current Effective Rate</h4>
        <div className="history-current-rate-card">
          {currentAdjustment ? (
            <>
              <div className="history-rate-breakdown">
                <div className="history-breakdown-row">
                  <span>Base Rate:</span>
                  <span>${roomType.base_rate?.toFixed(2)}</span>
                </div>
                <div className="history-breakdown-row">
                  <span>Active Adjustment:</span>
                  <span className={currentAdjustment.adjustment_amount >= 0 ? 'amount-positive' : 'amount-negative'}>
                    {currentAdjustment.adjustment_amount >= 0 ? '+' : ''}
                    ${currentAdjustment.adjustment_amount?.toFixed(2)}
                  </span>
                </div>
                <div className="history-breakdown-row history-total-row">
                  <span><strong>Effective Rate:</strong></span>
                  <span className="history-effective-rate">
                    ${calculateEffectiveRate(currentAdjustment).toFixed(2)}/night
                  </span>
                </div>
              </div>
              <div className="history-active-info">
                Active since {formatDate(currentAdjustment.effective_date)}
              </div>
            </>
          ) : (
            <div className="history-no-active">
              <p>No active adjustment. Using base rate.</p>
              <span className="history-effective-rate">
                ${roomType.base_rate?.toFixed(2)}/night
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="history-section">
        <h4 className="history-section-title">
          Adjustment History ({adjustments.length} {adjustments.length === 1 ? 'adjustment' : 'adjustments'})
        </h4>

        <div className="history-timeline">
          {adjustments
            .sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date))
            .map((adjustment, index) => {
              const isCurrentlyActive = currentAdjustment?.id === adjustment.id;
              const isPending = !isActive(adjustment.effective_date);

              return (
                <div key={adjustment.id} className="history-timeline-item">
                  <div className="history-timeline-dot">
                    <div className={`history-dot ${
                      isCurrentlyActive
                        ? 'history-dot-active'
                        : isPending
                        ? 'history-dot-pending'
                        : 'history-dot-past'
                    }`} />
                    {index < adjustments.length - 1 && (
                      <div className="history-line" />
                    )}
                  </div>

                  <div className="history-timeline-content">
                    <div className="history-adjustment-card">
                      {isCurrentlyActive && (
                        <div className="history-active-badge">Currently Active</div>
                      )}
                      {isPending && (
                        <div className="history-pending-badge">Pending</div>
                      )}

                      <div className="history-adjustment-header">
                        <div className="history-adjustment-amount">
                          <span className="history-amount-label">Adjustment:</span>
                          <span className={`history-amount-value ${
                            adjustment.adjustment_amount >= 0 ? 'amount-positive' : 'amount-negative'
                          }`}>
                            {adjustment.adjustment_amount >= 0 ? '+' : ''}
                            ${adjustment.adjustment_amount?.toFixed(2)}
                          </span>
                        </div>
                        <div className="history-new-rate-preview">
                          New Rate: ${calculateEffectiveRate(adjustment).toFixed(2)}
                        </div>
                      </div>

                      <div className="history-date-info">
                        <span className="history-date-label">Effective Date:</span>
                        <span className="history-date-value">{formatDate(adjustment.effective_date)}</span>
                      </div>

                      <div className="history-reason">
                        <span className="history-reason-label">Reason:</span>
                        <p className="history-reason-text">{adjustment.reason}</p>
                      </div>


                      <div className="history-metadata">
                        <span className="history-meta-label">Created:</span>
                        <span className="history-meta-value">{formatDateTime(adjustment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="history-summary">
        <div className="history-summary-item">
          <span className="history-summary-label">Total Adjustments:</span>
          <span className="history-summary-value">{adjustments.length}</span>
        </div>
        <div className="history-summary-item">
          <span className="history-summary-label">Active Adjustments:</span>
          <span className="history-summary-value">
            {adjustments.filter(a => isActive(a.effective_date)).length}
          </span>
        </div>
        <div className="history-summary-item">
          <span className="history-summary-label">Pending Adjustments:</span>
          <span className="history-summary-value">
            {adjustments.filter(a => !isActive(a.effective_date)).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RateAdjustmentHistory;
