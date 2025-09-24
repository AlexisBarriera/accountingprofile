import React from 'react';
import { Booking } from './BookingCalendar';
import './TimeSlotPicker.css';

interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  bookings: Booking[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  selectedDate, 
  selectedTime, 
  onTimeSelect, 
  bookings 
}) => {
  // Business hours configuration
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const isSlotBooked = (time: string) => {
    return bookings.some(b => b.time === time && b.status !== 'cancelled');
  };

  const isSlotPast = (time: string) => {
    const now = new Date();
    const slotDate = new Date(selectedDate);
    const [hourStr, period] = time.split(' ');
    const [hour, minute] = hourStr.split(':').map(Number);
    let adjustedHour = hour;
    
    if (period === 'PM' && hour !== 12) adjustedHour += 12;
    if (period === 'AM' && hour === 12) adjustedHour = 0;
    
    slotDate.setHours(adjustedHour, minute || 0, 0, 0);
    
    return slotDate < now;
  };

  const morningSlots = timeSlots.slice(0, 3);
  const afternoonSlots = timeSlots.slice(3, 6);
  const eveningSlots = timeSlots.slice(6);

  const renderTimeSlot = (time: string) => {
    const booked = isSlotBooked(time);
    const past = isSlotPast(time);
    const selected = selectedTime === time;
    const disabled = booked || past;

    return (
      <button
        key={time}
        className={`time-slot ${selected ? 'selected' : ''} 
                   ${booked ? 'booked' : ''} ${past ? 'past' : ''}`}
        onClick={() => !disabled && onTimeSelect(time)}
        disabled={disabled}
      >
        <span className="slot-time">{time}</span>
        {booked && <span className="slot-status">Booked</span>}
        {past && !booked && <span className="slot-status">Past</span>}
      </button>
    );
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
    <div className="time-slot-picker">
      <h3>Select Time</h3>
      <p className="picker-date">
        {formatDateDisplay()}
      </p>

      <div className="time-sections">
        {morningSlots.length > 0 && (
          <div className="time-section">
            <h4>Morning</h4>
            <div className="time-grid">
              {morningSlots.map(renderTimeSlot)}
            </div>
          </div>
        )}

        {afternoonSlots.length > 0 && (
          <div className="time-section">
            <h4>Afternoon</h4>
            <div className="time-grid">
              {afternoonSlots.map(renderTimeSlot)}
            </div>
          </div>
        )}

        {eveningSlots.length > 0 && (
          <div className="time-section">
            <h4>Evening</h4>
            <div className="time-grid">
              {eveningSlots.map(renderTimeSlot)}
            </div>
          </div>
        )}
      </div>

      <div className="slot-info">
        <p>
          <span className="info-icon">ℹ️</span>
          Each appointment is 60 minutes
        </p>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
