import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const hasCalendarId = !!process.env.GOOGLE_CALENDAR_ID;
  const hasCredentials = !!process.env.GOOGLE_CREDENTIALS;
  
  let credentialsValid = false;
  let errorDetails = '';
  
  if (hasCredentials) {
    try {
      const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
      credentialsValid = !!(creds.client_email && creds.private_key);
      if (!credentialsValid) {
        errorDetails = 'Credentials missing required fields';
      }
    } catch (e) {
      errorDetails = 'Failed to parse credentials JSON';
    }
  }
  
  res.status(200).json({
    status: 'API endpoint working',
    environment: {
      hasCalendarId,
      hasCredentials,
      credentialsValid,
      calendarId: hasCalendarId ? process.env.GOOGLE_CALENDAR_ID : 'NOT SET',
      serviceAccount: credentialsValid ? JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}').client_email : 'NOT SET'
    },
    errorDetails,
    timestamp: new Date().toISOString()
  });
}
