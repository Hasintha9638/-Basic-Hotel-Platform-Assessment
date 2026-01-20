import { useState } from 'react';

const HotelForm = ({ onSubmit, onCancel, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
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

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Hotel name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Hotel name must be at least 3 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group-spacing">
        <label className="form-label-inline">
          Hotel Name <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter hotel name"
          className={`form-input-common ${errors.name ? 'form-input-error' : ''}`}
          disabled={isLoading}
        />
        {errors.name && <span className="form-error-text">{errors.name}</span>}
      </div>

      <div className="form-group-spacing">
        <label className="form-label-inline">
          Location <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter location"
          className={`form-input-common ${errors.location ? 'form-input-error' : ''}`}
          disabled={isLoading}
        />
        {errors.location && <span className="form-error-text">{errors.location}</span>}
      </div>

      <div className="form-group-spacing">
        <label className="form-label-inline">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter hotel description (optional)"
          rows="4"
          className="form-textarea-common"
          disabled={isLoading}
        />
      </div>

      <div className="form-group-spacing">
        <label className="form-label-inline">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-select-common"
          disabled={isLoading}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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
          {isLoading ? 'Creating...' : initialData ? 'Update Hotel' : 'Create Hotel'}
        </button>
      </div>
    </form>
  );
};

export default HotelForm;
