import React from 'react';
import { Booking } from './BookingCalendar';
import './BookingConfirmation.css';

interface BookingConfirmationProps {
  booking: Booking;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  const formatDate = (dateStr: string) => {
    // FIX: Parse date components manually to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="confirmation-overlay" onClick={onClose}>
      <div className="confirmation-modal" onClick={e => e.stopPropagation()}>
        <div className="confirmation-header">
          <div className="success-icon">✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Your appointment has been successfully scheduled</p>
        </div>

        <div className="confirmation-details">
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{formatDate(booking.date)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{booking.time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Service:</span>
            <span className="detail-value">{booking.service}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Booking ID:</span>
            <span className="detail-value">{booking.id}</span>
          </div>
        </div>

        <div className="confirmation-notifications">
          <h3>What happens next?</h3>
          <ul>
            <li>
              <span className="check">✓</span>
              <div>
                <strong>Email Confirmation</strong>
                <p>You'll receive a confirmation email at {booking.email}</p>
              </div>
            </li>
            <li>
              <span className="check">✓</span>
              <div>
                <strong>Calendar Sync</strong>
                <p>Daniel has been notified and the appointment is added to his calendar</p>
              </div>
            </li>
            <li>
              <span className="check">✓</span>
              <div>
                <strong>Reminder</strong>
                <p>You'll receive a reminder 24 hours before your appointment</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="confirmation-actions">
          <button className="btn-add-calendar">
            📅 Add to My Calendar
          </button>
          <button className="btn-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
