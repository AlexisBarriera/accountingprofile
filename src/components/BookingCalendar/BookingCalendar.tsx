
import React, { useState, useEffect } from 'react';
import './BookingCalendar.css';
import CalendarView from './CalendarView';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import { API_ENDPOINTS } from '../../config/constants';

export interface Booking {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const BookingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const stored = await window.persistentStorage.getItem('bookings');
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const saveBookings = async (updatedBookings: Booking[]) => {
    try {
      await window.persistentStorage.setItem('bookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setShowForm(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  // NEW: Sync with Google Calendar
  const syncWithGoogleCalendar = async (booking: Booking) => {
    try {
      const response = await fetch(API_ENDPOINTS.BOOKING, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Successfully synced with Google Calendar');
        console.log('📅 Event Link:', data.eventLink);
        
        // Optional: You can store the eventId for future updates/deletions
        // booking.googleEventId = data.eventId;
      } else {
        console.error('Failed to sync:', data.error);
        // Still save locally even if sync fails
        // You might want to add a retry mechanism here
      }
    } catch (error) {
      console.error('Error syncing with calendar:', error);
      // Still proceed with local booking even if sync fails
      // This ensures the booking is saved even if the API is down
    }
  };

  const handleBookingSubmit = async (formData: any) => {
    if (!selectedDate || !selectedTime) return;

    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      notes: formData.notes,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [...bookings, newBooking];
    await saveBookings(updatedBookings);
    
    setCurrentBooking(newBooking);
    setShowForm(false);
    setShowConfirmation(true);
    
    // Sync with Google Calendar (async - doesn't block UI)
    await syncWithGoogleCalendar(newBooking);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setSelectedDate(null);
    setSelectedTime('');
    setCurrentBooking(null);
  };

  const getBookingsForDate = (date: Date): Booking[] => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
  };

  return (
    <section id="booking" className="booking-calendar">
      <div className="booking-container">
        <div className="booking-header">
          <p className="booking-tagline">Schedule an Appointment</p>
          <h2 className="booking-title">Book Your Consultation</h2>
          <p className="booking-subtitle">
            Select a date and time that works best for you. 
            All appointments are automatically synced with our calendar.
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
            {selectedDate && !showForm && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                bookings={getBookingsForDate(selectedDate)}
              />
            )}

            {showForm && selectedDate && selectedTime && (
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSubmit={handleBookingSubmit}
                onCancel={() => setShowForm(false)}
              />
            )}

            {!selectedDate && (
              <div className="selection-placeholder">
                <div className="placeholder-icon">📅</div>
                <h3>Select a Date</h3>
                <p>Choose a date from the calendar to view available time slots</p>
              </div>
            )}
          </div>
        </div>

        {showConfirmation && currentBooking && (
          <BookingConfirmation
            booking={currentBooking}
            onClose={handleConfirmationClose}
          />
        )}

        <div className="booking-features">
          <div className="feature">
            <span className="feature-icon">✅</span>
            <h4>Instant Confirmation</h4>
            <p>Receive immediate booking confirmation via email</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📱</span>
            <h4>Calendar Sync</h4>
            <p>Automatically syncs with Google Calendar</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔔</span>
            <h4>Reminders</h4>
            <p>Get email reminders before your appointment</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
