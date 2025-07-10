# Email Setup Guide

This guide explains how to set up email functionality in the Beauty Competition platform using Resend.

## Prerequisites

1. A Resend account. You can sign up for free at [Resend](https://resend.com/).
2. Verified domain or email address in Resend.

## Setup Steps

### 1. Get Your Resend API Key

1. Log in to your Resend account.
2. Navigate to the API Keys section in the dashboard.
3. Click "Create API Key".
4. Name your API key (e.g., "Beauty Competition Platform").
5. Select appropriate permissions.
6. Click "Create API Key".
7. Copy the generated API key (you won't be able to see it again).

### 2. Configure Environment Variables

Add the following variables to your `.env.local` file:

```
# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=your_verified_email@yourdomain.com
NEXT_PUBLIC_BASE_URL=https://your-website-url.com
```

Replace:
- `your_resend_api_key_here` with the API key you copied from Resend.
- `your_verified_email@yourdomain.com` with your verified email in Resend.
- `https://your-website-url.com` with your website's URL (use `http://localhost:3000` for local development).

### 3. Verify Your Domain or Email

Before you can send emails with your own domain, you need to verify it in Resend:

1. In Resend, navigate to Domains.
2. Click "Add Domain".
3. Follow the steps to verify your domain by adding DNS records.

Alternatively, you can use a verified email address:

1. In Resend, navigate to Verified Emails.
2. Click "Add Email".
3. Enter your email address and verify it through the link sent to that email.

For testing, you can use the default `onboarding@resend.dev` sender, but for production, you should use your own domain or verified email.

### 4. Testing Email Functionality

To test if your email setup is working:

1. Add a new judge through the admin interface.
2. Check "Send login credentials via email".
3. Submit the form.
4. Check the email inbox of the judge you added.

If the email doesn't arrive:
- Check your server logs for any errors.
- Verify that your Resend API key is correct.
- Make sure your sender email is verified in Resend.
- Check your Resend dashboard for any delivery issues.

## Troubleshooting

### Emails Not Sending

If emails are not being sent:

1. Check the server logs for any errors.
2. Verify that the `RESEND_API_KEY` environment variable is set correctly.
3. Make sure your Resend account is active.
4. Check if you've reached your Resend sending limits.

### Emails Going to Spam

If emails are going to spam:

1. Make sure your domain is properly authenticated in Resend.
2. Use a professional email design.
3. Avoid spam trigger words in your subject and content.
4. Consider using your own domain with proper DKIM and SPF records.

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend React Email Documentation](https://resend.com/docs/react-email)
- [Email Deliverability Best Practices](https://resend.com/blog/email-deliverability-best-practices) 