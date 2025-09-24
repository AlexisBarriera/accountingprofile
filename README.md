
# Professional Accounting Services Website

A modern, elegant accounting services website with integrated Google Calendar booking system.

## 🌟 Features

- **Professional Design**: Elegant, sophisticated design with a warm color palette
- **Responsive Layout**: Fully responsive on all devices
- **Google Calendar Integration**: Automatic calendar sync for appointments
- **Real-time Booking**: Interactive calendar with time slot selection
- **Email Notifications**: Automatic notifications for new bookings
- **Persistent Storage**: Bookings saved locally and synced to cloud

## 📋 Setup Instructions

### Prerequisites

1. **Google Cloud Account** with Calendar API enabled
2. **Service Account** with calendar permissions
3. **Vercel Account** for deployment (free tier works)

### Step 1: Google Calendar Setup ✅ COMPLETED

You have already:
- Created a service account: `calendar-sync@accounting-website-473117.iam.gserviceaccount.com`
- Set up your calendar: `elnenealexis72@gmail.com`
- Downloaded your credentials JSON

### Step 2: Share Calendar with Service Account

**IMPORTANT**: You need to share your Google Calendar with the service account:

1. Go to [Google Calendar](https://calendar.google.com)
2. Find your calendar in the left sidebar
3. Click the three dots menu → "Settings and sharing"
4. Scroll to "Share with specific people"
5. Click "Add people"
6. Add: `calendar-sync@accounting-website-473117.iam.gserviceaccount.com`
7. Set permission to: **"Make changes to events"**
8. Click "Send"

Without this step, the booking system won't be able to create events!

### Step 3: Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `GOOGLE_CALENDAR_ID`: elnenealexis72@gmail.com
   - `GOOGLE_CREDENTIALS`: (paste the minified JSON)
4. Deploy!

## 🔒 Security Notes

- **NEVER** commit `.env.local` to version control
- Keep your service account credentials secure
- The `.gitignore` file is configured to exclude sensitive files

## 🏗️ Project Structure

```
├── api/              # Serverless functions
│   └── booking.ts    # Google Calendar sync endpoint
├── src/
│   ├── components/   # React components
│   │   ├── BookingCalendar/  # Booking system
│   │   ├── Hero/     # Landing section
│   │   ├── About/    # About section
│   │   ├── Services/ # Services section
│   │   └── Contact/  # Contact form
│   └── config/       # Configuration
└── .env.local        # Environment variables (DO NOT COMMIT)
```

## 🎨 Customization

### Update Business Information

Edit the placeholder text in components:
- `Hero.tsx`: Update taglines and descriptions
- `About.tsx`: Add your credentials and experience
- `Services.tsx`: List your specific services
- `Contact.tsx`: Add your contact details

### Modify Colors

The color scheme uses a sophisticated burgundy and gold palette:
- Primary: `#722f37` (burgundy)
- Secondary: `#d4a574` (gold)
- Background: `#faf8f5` (cream)

Update these in the CSS files to match your brand.

## 📧 Email Notifications

The system automatically sends notifications when bookings are created. To add email functionality:

1. Sign up for [SendGrid](https://sendgrid.com) (free tier available)
2. Get your API key
3. Add to environment variables
4. Uncomment email code in `api/booking.ts`

## 🚀 Production Checklist

- [x] Google Calendar API enabled
- [x] Service account created
- [x] Calendar shared with service account
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Email notifications configured (optional)

## 📞 Support

For issues with:
- **Google Calendar**: Check service account permissions
- **Deployment**: Verify environment variables in Vercel
- **Bookings**: Ensure calendar is shared with service account

## 📝 License

This project is ready for commercial use. Customize it for your accounting practice!

---

**Built with**: React, TypeScript, Google Calendar API, Vercel

**Timezone**: America/Puerto_Rico (GMT-4)
