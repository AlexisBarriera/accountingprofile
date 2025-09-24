const { google } = require('googleapis');

module.exports = async function handler(req, res) {
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

    // Parse date and time
    const [year, month, day] = booking.date.split('-');
    const [time, period] = booking.time.split(' ');
    const [hour, minute] = time.split(':');
    
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;

    // Create start and end times
    const startDateTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hour24,
      parseInt(minute) || 0
    );

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    // Create calendar event
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
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Puerto_Rico',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Puerto_Rico',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    console.log('Creating event on calendar:', process.env.GOOGLE_CALENDAR_ID);

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
      message: 'Booking confirmed and added to calendar!'
    });

  } catch (error) {
    console.error('Calendar sync error:', error);
    
    // Specific error messages
    if (error.code === 403) {
      return res.status(500).json({ 
        error: 'Calendar access denied. Please ensure the calendar is shared with the service account.' 
      });
    }
    
    if (error.code === 404) {
      return res.status(500).json({ 
        error: 'Calendar not found. Please check the calendar ID.' 
      });
    }
    
    return res.status(500).json({ 
      error: `Failed to sync with calendar: ${error.message || 'Unknown error'}` 
    });
  }
};
