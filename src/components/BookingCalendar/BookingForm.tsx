import React, { useState } from 'react';
import './BookingForm.css';

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  selectedDate, 
  selectedTime, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    notes: ''
  });

  const [errors, setErrors] = useState<any>({});

  const services = [
    'Tax Preparation',
    'Bookkeeping',
    'Financial Planning',
    'Business Consulting',
    'Audit Services',
    'Payroll Services',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.service) newErrors.service = 'Please select a service';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // FIX: Format the date display properly without timezone issues
  const formatDateDisplay = () => {
    return selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="booking-form">
      <div className="form-header">
        <h3>Complete Your Booking</h3>
        <div className="booking-details">
          <p className="detail-item">
            <span className="detail-icon">📅</span>
            {formatDateDisplay()}
          </p>
          <p className="detail-item">
            <span className="detail-icon">🕐</span>
            {selectedTime}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="service">Service Required *</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={errors.service ? 'error' : ''}
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          {errors.service && <span className="error-message">{errors.service}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Any specific requirements or questions..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-confirm">
            Confirm Booking
          </button>
        </div>
      </form>

      <div className="form-notice">
        <p>
          <strong>📧 Automatic Notifications:</strong> Upon confirmation, Daniel will receive 
          an email notification and the appointment will be automatically added to his calendar.
        </p>
      </div>
    </div>
  );
};

export default BookingForm;
