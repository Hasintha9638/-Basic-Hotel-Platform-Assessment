import { useState } from 'react';

const RoomTypeForm = ({ hotelId, onSubmit, onCancel, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    base_rate: initialData?.base_rate || '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Room type name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Room type name must be at least 3 characters';
    }

    if (!formData.base_rate) {
      newErrors.base_rate = 'Base rate is required';
    } else {
      const rate = parseFloat(formData.base_rate);
      if (isNaN(rate)) {
        newErrors.base_rate = 'Base rate must be a valid number';
      } else if (rate <= 0) {
        newErrors.base_rate = 'Base rate must be greater than 0';
      } else if (rate > 100000) {
        newErrors.base_rate = 'Base rate cannot exceed $100,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const submitData = {
        ...formData,
        hotel_id: hotelId,
        base_rate: parseFloat(formData.base_rate),
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group-spacing">
        <label className="form-label-inline">
          Room Type Name <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Deluxe Suite, Standard Room"
          className={`form-input-common ${errors.name ? 'form-input-error' : ''}`}
          disabled={isLoading}
        />
        {errors.name && <span className="form-error-text">{errors.name}</span>}
      </div>

      <div className="form-group-spacing">
        <label className="form-label-inline">
          Base Rate (per night) <span className="required-asterisk">*</span>
        </label>
        <div className="input-group-wrapper">
          <span className="currency-prefix-inline">$</span>
          <input
            type="number"
            name="base_rate"
            value={formData.base_rate}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`form-input-common number-input-with-prefix ${errors.base_rate ? 'form-input-error' : ''}`}
            disabled={isLoading}
          />
        </div>
        {errors.base_rate && <span className="form-error-text">{errors.base_rate}</span>}
        <span className="form-help-text">Enter the standard nightly rate for this room type</span>
      </div>

      <div className="form-group-spacing">
        <label className="form-label-inline">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the room type, amenities, and features (optional)"
          rows="4"
          className="form-textarea-common"
          disabled={isLoading}
        />
        <span className="form-help-text">Optional: Provide details about room size, view, amenities, etc.</span>
      </div>

      <div className="info-box-blue">
        <strong>Note:</strong> The base rate can be adjusted later using rate adjustments for specific dates or periods.
      </div>

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
          {isLoading ? 'Creating...' : initialData ? 'Update Room Type' : 'Create Room Type'}
        </button>
      </div>
    </form>
  );
};

export default RoomTypeForm;
