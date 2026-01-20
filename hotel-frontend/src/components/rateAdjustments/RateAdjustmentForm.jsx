import { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';

const RateAdjustmentForm = ({
  roomType,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    adjustment_amount: '',
    effective_date: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    // Validate adjustment amount
    if (!formData.adjustment_amount) {
      newErrors.adjustment_amount = 'Adjustment amount is required';
    } else {
      const amount = parseFloat(formData.adjustment_amount);
      if (isNaN(amount)) {
        newErrors.adjustment_amount = 'Must be a valid number';
      } else if (amount === 0) {
        newErrors.adjustment_amount = 'Adjustment amount cannot be zero';
      } else if (Math.abs(amount) > 10000) {
        newErrors.adjustment_amount = 'Adjustment cannot exceed +/-$10,000';
      }
    }

    // Validate effective date
    if (!formData.effective_date) {
      newErrors.effective_date = 'Effective date is required';
    } else {
      const selectedDate = new Date(formData.effective_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.effective_date = 'Effective date cannot be in the past';
      }
    }

    // Validate reason
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason for adjustment is required';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    } else if (formData.reason.trim().length > 500) {
      newErrors.reason = 'Reason cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // Format the data for submission
      const submitData = {
        room_type_id: roomType.id,
        adjustment_amount: parseFloat(formData.adjustment_amount),
        effective_date: new Date(formData.effective_date).toISOString(),
        reason: formData.reason.trim(),
      };
      onSubmit(submitData);
    }
  };

  // Calculate new effective rate
  const calculateNewRate = () => {
    const amount = parseFloat(formData.adjustment_amount);
    if (!isNaN(amount)) {
      return roomType.base_rate + amount;
    }
    return roomType.base_rate;
  };

  const newEffectiveRate = calculateNewRate();

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const adjustmentAmount = parseFloat(formData.adjustment_amount);
  const isIncrease = adjustmentAmount >= 0;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Room Type Info */}
      <div className="rate-info-box">
        <h4 className="rate-info-title">{roomType.name}</h4>
        <div className="rate-info-row">
          <span className="rate-info-label">Current Base Rate:</span>
          <span className="rate-info-value">${roomType.base_rate?.toFixed(2)}/night</span>
        </div>
      </div>

      {/* Adjustment Amount */}
      <div className="form-group-spacing">
        <label className="form-label-inline">
          Adjustment Amount <span className="required-asterisk">*</span>
        </label>
        <div className="input-group-wrapper">
          <span className="currency-prefix-inline">$</span>
          <input
            type="number"
            name="adjustment_amount"
            value={formData.adjustment_amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            className={`form-input-common number-input-with-prefix ${errors.adjustment_amount ? 'form-input-error' : ''}`}
            disabled={isLoading}
          />
        </div>
        {errors.adjustment_amount && (
          <span className="form-error-text">{errors.adjustment_amount}</span>
        )}
        <span className="form-help-text">
          Enter positive value to increase price, negative to decrease (e.g., 50.00 or -20.00)
        </span>
      </div>

      {/* Effective Date */}
      <div className="form-group-spacing">
        <label className="form-label-inline">
          Effective Date <span className="required-asterisk">*</span>
        </label>
        <input
          type="date"
          name="effective_date"
          value={formData.effective_date}
          onChange={handleChange}
          min={getMinDate()}
          className={`form-input-common ${errors.effective_date ? 'form-input-error' : ''}`}
          disabled={isLoading}
        />
        {errors.effective_date && (
          <span className="form-error-text">{errors.effective_date}</span>
        )}
        <span className="form-help-text">
          The date when this rate adjustment will take effect
        </span>
      </div>

      {/* Reason */}
      <div className="form-group-spacing">
        <label className="form-label-inline">
          Reason for Adjustment <span className="required-asterisk">*</span>
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="e.g., Holiday season pricing increase, Off-season discount, Special event pricing"
          rows="4"
          className={`form-textarea-common ${errors.reason ? 'form-input-error' : ''}`}
          disabled={isLoading}
        />
        {errors.reason && (
          <span className="form-error-text">{errors.reason}</span>
        )}
        <span className="form-help-text">
          Provide a clear explanation for this rate change (10-500 characters)
        </span>
      </div>

      {/* Rate Preview */}
      {formData.adjustment_amount && !errors.adjustment_amount && (
        <div className={`rate-preview-box ${isIncrease ? 'rate-preview-box-increase' : 'rate-preview-box-decrease'}`}>
          <h4 className="rate-preview-title">Rate Preview</h4>
          <div className="rate-calculation">
            <div className="rate-calc-row">
              <span>Base Rate:</span>
              <span>${roomType.base_rate?.toFixed(2)}</span>
            </div>
            <div className="rate-calc-row">
              <span>Adjustment:</span>
              <span className={isIncrease ? 'amount-positive' : 'amount-negative'}>
                {isIncrease ? '+' : ''}
                ${adjustmentAmount.toFixed(2)}
              </span>
            </div>
            <div className="rate-calc-row rate-calc-total-row">
              <span><strong>New Effective Rate:</strong></span>
              <span className="rate-new-value">
                ${newEffectiveRate.toFixed(2)}/night
              </span>
            </div>
          </div>
          {formData.effective_date && (
            <div className="rate-effective-info">
              Effective from: <strong>{formatDate(formData.effective_date)}</strong>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="info-box-blue">
        <strong>Note:</strong> All previous rate adjustments will remain in history.
        This adjustment will become the active rate from the effective date onwards.
      </div>

      {/* Buttons */}
      <div className="form-button-group">
        <button
          type="button"
          onClick={onCancel}
          className="btn-cancel"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-submit-green"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Adjustment'}
        </button>
      </div>
    </form>
  );
};

export default RateAdjustmentForm;
