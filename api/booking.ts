const { google } = require('googleapis');

export {}; // Makes this a module

module.exports = async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check environment variables
    if (!process.env.GOOGLE_CALENDAR_ID) {
      console.error('Missing GOOGLE_CALENDAR_ID');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing calendar ID' 
      });
    }

    if (!process.env.GOOGLE_CREDENTIALS) {
      console.error('Missing GOOGLE_CREDENTIALS');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing credentials' 
      });
    }

    // Parse credentials
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      console.log('Service account:', credentials.client_email);
    } catch (e) {
      console.error('Failed to parse credentials');
      return res.status(500).json({ 
        error: 'Server configuration error: Invalid credentials format' 
      });
    }

    // Initialize Google auth
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth: auth });

    // Get booking data
    const { booking } = req.body;
    console.log('Processing booking for:', booking.name);
    console.log('Selected date:', booking.date);
    console.log('Selected time:', booking.time);

    // Parse date (YYYY-MM-DD format)
    const [year, month, day] = booking.date.split('-').map(Number);
    
    // Parse time (e.g., "1:00 PM")
    const [time, period] = booking.time.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr) || 0;
    
    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    // Create date string in Puerto Rico timezone format
    // Format: YYYY-MM-DDTHH:mm:ss
    const dateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
    
    // Create start time (treat as Puerto Rico time directly)
    const startDateTime = dateTimeStr;
    
    // Calculate end time (1 hour later)
    const endHour = hour + 1;
    const endDateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(endHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
    
    console.log('Start datetime:', startDateTime);
    console.log('End datetime:', endDateTimeStr);

    // Create calendar event with TIMEZONE-SPECIFIC times
    const event = {
      summary: `${booking.service} - ${booking.name}`,
      description: [
        `Client: ${booking.name}`,
        `Email: ${booking.email}`,
        `Phone: ${booking.phone}`,
        `Service: ${booking.service}`,
        `Notes: ${booking.notes || 'No additional notes'}`,
        `Booking ID: ${booking.id}`
      ].join('\n'),
      start: {
        dateTime: startDateTime,  // Send as local time
        timeZone: 'America/Puerto_Rico',  // Specify timezone
      },
      end: {
        dateTime: endDateTimeStr,  // Send as local time
        timeZone: 'America/Puerto_Rico',  // Specify timezone
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    console.log('Creating event with timezone:', 'America/Puerto_Rico');
    console.log('Event details:', JSON.stringify(event, null, 2));

    // Insert event to calendar
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    console.log('Event created successfully:', response.data.id);

    return res.status(200).json({ 
      success: true, 
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
      message: 'Booking confirmed and added to calendar!',
      debug: {
        requestedDate: booking.date,
        requestedTime: booking.time,
        createdStart: startDateTime,
        timezone: 'America/Puerto_Rico'
      }
    });

  } catch (error: any) {
    console.error('Calendar sync error:', error);
    
    // Specific error messages
    if (error?.code === 403) {
      return res.status(500).json({ 
        error: 'Calendar access denied. Please ensure the calendar is shared with the service account.' 
      });
    }
    
    if (error?.code === 404) {
      return res.status(500).json({ 
        error: 'Calendar not found. Please check the calendar ID.' 
      });
    }
    
    return res.status(500).json({ 
      error: `Failed to sync with calendar: ${error?.message || 'Unknown error'}` 
    });
  }
};
