
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Parse the credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');

// Initialize Google auth
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { booking } = req.body;

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
      description: `
Client: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Service: ${booking.service}
Notes: ${booking.notes || 'No additional notes'}
Booking ID: ${booking.id}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Puerto_Rico', // Puerto Rico timezone (GMT-4)
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Puerto_Rico', // Puerto Rico timezone (GMT-4)
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
      colorId: '11', // Red color for visibility
    };

    // Insert event to calendar
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    // Send confirmation email (optional - you can add SendGrid here later)
    
    res.status(200).json({ 
      success: true, 
      eventId: response.data.id,
      eventLink: response.data.htmlLink 
    });

  } catch (error) {
    console.error('Calendar sync error:', error);
    res.status(500).json({ 
      error: 'Failed to sync with calendar',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
