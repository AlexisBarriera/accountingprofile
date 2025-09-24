import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    // Step 1: Check environment variables
    if (!process.env.GOOGLE_CALENDAR_ID) {
      console.error('Missing GOOGLE_CALENDAR_ID');
      return res.status(500).send('A server error occurred: Missing calendar configuration');
    }

    if (!process.env.GOOGLE_CREDENTIALS) {
      console.error('Missing GOOGLE_CREDENTIALS');
      return res.status(500).send('A server error occurred: Missing authentication configuration');
    }

    // Step 2: Parse credentials
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } catch (e) {
      console.error('Failed to parse GOOGLE_CREDENTIALS:', e);
      return res.status(500).send('A server error occurred: Invalid credentials format');
    }

    // Step 3: Import googleapis (dynamic import for Vercel)
    const { google } = await import('googleapis');

    // Step 4: Initialize auth
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Step 5: Process booking
    const { booking } = req.body;
    
    // Parse date and time
    const [year, month, day] = booking.date.split('-');
    const [time, period] = booking.time.split(' ');
    const [hour, minute] = time.split(':');
    
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;

    const startDateTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hour24,
      parseInt(minute) || 0
    );

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    // Step 6: Create calendar event
    const event = {
      summary: `${booking.service} - ${booking.name}`,
      description: `Client: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nService: ${booking.service}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Puerto_Rico',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Puerto_Rico',
      },
    };

    console.log('Creating event for calendar:', process.env.GOOGLE_CALENDAR_ID);
    
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return res.status(200).json({ 
      success: true, 
      eventId: response.data.id,
      eventLink: response.data.htmlLink 
    });

  } catch (error: any) {
    console.error('Calendar API error:', error);
    
    // Check for specific Google API errors
    if (error.code === 403) {
      return res.status(500).send('A server error occurred: Calendar access denied. Please share calendar with service account.');
    }
    if (error.code === 404) {
      return res.status(500).send('A server error occurred: Calendar not found');
    }
    
    return res.status(500).send(`A server error occurred: ${error.message || 'Unknown error'}`);
  }
}
