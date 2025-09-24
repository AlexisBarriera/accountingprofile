import React, { useState, useEffect } from 'react';
import './BookingCalendar.css';
import CalendarView from './CalendarView';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';

export interface Booking {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const BookingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'date' | 'time' | 'form' | 'confirmation'>('date');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setCurrentStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep('form');
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedDate && selectedTime) {
      // FIX: Use local date formatting instead of ISO string
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        date: dateStr,  // Now uses local date format YYYY-MM-DD
        time: selectedTime,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        notes: formData.notes,
        status: 'pending'
      };

      // Save locally first
      const updatedBookings = [...bookings, newBooking];
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));

      try {
        // Sync with Google Calendar
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ booking: newBooking }),
        });

        const result = await response.json();

        if (result.success) {
          // Update booking status to confirmed
          const confirmedBooking = { ...newBooking, status: 'confirmed' as const };
          const confirmedBookings = updatedBookings.map(b => 
            b.id === newBooking.id ? confirmedBooking : b
          );
          setBookings(confirmedBookings);
          localStorage.setItem('bookings', JSON.stringify(confirmedBookings));
          
          setConfirmedBooking(confirmedBooking);
          setCurrentStep('confirmation');
        } else {
          throw new Error(result.error || 'Failed to sync with calendar');
        }
      } catch (error) {
        console.error('Error syncing with calendar:', error);
        // Still show confirmation but with a warning
        setConfirmedBooking(newBooking);
        setCurrentStep('confirmation');
        alert('Booking saved locally but calendar sync failed. We\'ll sync it manually.');
      }
    }
  };

  const handleFormCancel = () => {
    setCurrentStep('time');
  };

  const handleConfirmationClose = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setCurrentStep('date');
    setConfirmedBooking(null);
  };

  // Get bookings for selected date
  const getDateBookings = () => {
    if (!selectedDate) return [];
    
    // FIX: Use local date formatting for comparison
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return bookings.filter(b => b.date === dateStr);
  };

  return (
    <section id="booking" className="booking-calendar">
      <div className="booking-container">
        <div className="booking-header">
          <p className="booking-tagline">Schedule Appointment</p>
          <h2 className="booking-title">Book Your Consultation</h2>
          <p className="booking-subtitle">
            Select your preferred date and time for a professional consultation.
            Each session is 60 minutes.
          </p>
        </div>

        <div className="booking-content">
          <div className="calendar-section">
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              bookings={bookings}
            />
            
            {selectedDate && (
              <div className="booking-info">
                <h3>Selected Date</h3>
                <p>{selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            )}
          </div>

          <div className="selection-section">
            {currentStep === 'date' && (
              <div className="selection-placeholder">
                <span className="placeholder-icon">📅</span>
                <h3>Select a Date</h3>
                <p>Choose your preferred date from the calendar to view available time slots.</p>
              </div>
            )}

            {currentStep === 'time' && selectedDate && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                bookings={getDateBookings()}
              />
            )}

            {currentStep === 'form' && selectedDate && selectedTime && (
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            )}

            {currentStep === 'confirmation' && confirmedBooking && (
              <BookingConfirmation
                booking={confirmedBooking}
                onClose={handleConfirmationClose}
              />
            )}
          </div>
        </div>

        <div className="booking-features">
          <div className="feature">
            <span className="feature-icon">✅</span>
            <div>
              <h4>Instant Confirmation</h4>
              <p>Receive immediate confirmation and calendar invitation</p>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">🔄</span>
            <div>
              <h4>Automatic Sync</h4>
              <p>Appointments sync directly with our calendar system</p>
            </div>
          </div>
          <div className="feature">
            <span className="feature-icon">📧</span>
            <div>
              <h4>Email Reminders</h4>
              <p>Get reminded 24 hours before your appointment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
