import type { VercelRequest, VercelResponse } from '@vercel/node';

module.exports = function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const hasCalendarId = !!process.env.GOOGLE_CALENDAR_ID;
  const hasCredentials = !!process.env.GOOGLE_CREDENTIALS;
  
  let credentialsValid = false;
  let serviceAccountEmail = 'NOT SET';
  let errorDetails = '';
  
  if (hasCredentials && process.env.GOOGLE_CREDENTIALS) {
    try {
      const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      credentialsValid = !!(creds.client_email && creds.private_key);
      serviceAccountEmail = creds.client_email || 'MISSING';
      
      if (!creds.client_email) {
        errorDetails += 'Missing client_email. ';
      }
      if (!creds.private_key) {
        errorDetails += 'Missing private_key. ';
      }
    } catch (e) {
      errorDetails = 'Failed to parse credentials JSON: ' + (e instanceof Error ? e.message : 'Unknown error');
    }
  } else {
    errorDetails = 'GOOGLE_CREDENTIALS environment variable not set';
  }
  
  res.status(200).json({
    status: 'API is working!',
    environment: {
      hasCalendarId: hasCalendarId,
      hasCredentials: hasCredentials,
      credentialsValid: credentialsValid,
      calendarId: hasCalendarId ? process.env.GOOGLE_CALENDAR_ID : 'NOT SET',
      serviceAccount: serviceAccountEmail
    },
    errorDetails: errorDetails || 'All checks passed!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
};
