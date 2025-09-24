import React, { useState } from 'react';
import { Booking } from './BookingCalendar';
import './CalendarView.css';

interface CalendarViewProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  bookings: Booking[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onDateSelect, bookings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const hasBookings = (date: Date) => {
    // FIX: Use local date formatting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return bookings.some(b => b.date === dateStr && b.status !== 'cancelled');
  };

  const isFullyBooked = (date: Date) => {
    // FIX: Use local date formatting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayBookings = bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
    return dayBookings.length >= 8; // Assuming 8 time slots per day
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const past = isPastDate(date);
      const today = isToday(date);
      const selected = isSelected(date);
      const hasAppointments = hasBookings(date);
      const fullyBooked = isFullyBooked(date);

      days.push(
        <div
          key={day}
          className={`calendar-day ${past ? 'past' : ''} ${today ? 'today' : ''} 
                     ${selected ? 'selected' : ''} ${hasAppointments ? 'has-bookings' : ''}
                     ${fullyBooked ? 'fully-booked' : ''}`}
          onClick={() => !past && onDateSelect(date)}
        >
          <span className="day-number">{day}</span>
          {hasAppointments && <span className="booking-indicator">•</span>}
          {fullyBooked && <span className="booked-label">Full</span>}
        </div>
      );
    }

    return days;
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="month-nav" onClick={handlePrevMonth}>‹</button>
        <h3 className="month-year">{monthYear}</h3>
        <button className="month-nav" onClick={handleNextMonth}>›</button>
      </div>
      
      <div className="weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {renderCalendar()}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot partial"></span>
          <span>Partial Availability</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot full"></span>
          <span>Fully Booked</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
