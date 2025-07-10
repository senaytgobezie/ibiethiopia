# Judges Management

This document explains the judges management functionality in the Beauty Competition platform.

## Overview

The judges management system allows administrators to:

1. Add new judges to the platform
2. Send login credentials to judges via email
3. View and manage existing judges
4. Track judge activity and evaluations

## Adding a New Judge

To add a new judge:

1. Navigate to the Admin Dashboard
2. Click on "Judges" in the sidebar
3. Click the "Add Judge" button
4. Fill in the required information:
   - Full Name
   - Email Address
   - Years of Experience
   - Specialty Areas (select one or more)
   - Biography (optional)
5. Check "Send login credentials via email" if you want to automatically send login details
6. Click "Add Judge"

## Email Functionality

When adding a new judge with the "Send login credentials via email" option checked, the system will:

1. Create a new user account in Supabase Auth
2. Generate a random secure password
3. Create a judge profile in the database
4. Send an email to the judge with their login credentials

The email includes:
- The judge's name and email
- The generated password
- A link to the login page
- Instructions to change the password after first login

## Managing Existing Judges

From the Judges Management page, you can:

- View all judges and their details
- Filter judges by status or specialty
- Edit judge information
- Deactivate or reactivate judges
- Delete judges (use with caution)

## Judge Status

Judges can have one of the following statuses:

- **Active**: The judge can log in and evaluate submissions
- **Inactive**: The judge cannot log in or evaluate submissions

## Database Structure

The judges information is stored in the following tables:

1. `auth.users` - Core authentication information (managed by Supabase)
2. `judges` - Judge profile information including:
   - `id` - UUID primary key
   - `user_id` - Reference to auth.users
   - `name` - Judge's full name
   - `email` - Judge's email address
   - `bio` - Judge's biography
   - `specialty` - Array of specialty areas
   - `years_experience` - Years of experience
   - `profile_image` - URL to profile image (optional)
   - `status` - Active or inactive status
   - `created_at` - Timestamp when the record was created

## Technical Implementation

The judges management functionality is implemented using:

1. Next.js server components for the admin interface
2. Supabase for authentication and database
3. Resend for email delivery
4. TypeScript for type safety

### Key Files

- `src/app/admin/judges/page.tsx` - Admin interface for managing judges
- `src/app/api/admin/add-judge/route.ts` - API endpoint for adding judges
- `src/utils/email.ts` - Email utility functions
- `src/utils/email-templates.ts` - Email templates

## Troubleshooting

### Common Issues

1. **Emails not being sent**
   - Check that Resend API key is correctly set in environment variables
   - Verify the sender email or domain is verified in Resend
   - Check server logs for any errors

2. **User created but judge profile not created**
   - This could happen if there's an error after creating the user but before creating the judge profile
   - The API will attempt to delete the created user in this case
   - Check server logs for more details

3. **Judge cannot log in**
   - Verify the judge's status is "active"
   - Check if the judge has received their credentials email
   - Ensure the judge is using the correct email address 