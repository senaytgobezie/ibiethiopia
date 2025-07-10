import { Resend } from 'resend';
import { judgeCredentialsTemplate, contestantRegistrationTemplate, submissionConfirmationTemplate } from './email-templates';

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY not found in environment variables. Email functionality will be mocked.');
}

interface EmailData {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html: string;
    replyTo?: string;
}

/**
 * Send an email using Resend
 * @param emailData The email data to send
 * @returns Promise resolving to the Resend response
 */
export const sendEmail = async (emailData: EmailData) => {
    try {
        if (!resendApiKey || !resend) {
            console.log('📧 Email would have been sent (RESEND_API_KEY not set):');
            console.log(JSON.stringify(emailData, null, 2));
            return { success: true, mock: true, emailData };
        }

        const { from, to, subject, html, text, replyTo } = emailData;

        console.log(`📧 Sending email to ${to} with subject "${subject}"`);

        const response = await resend.emails.send({
            from,
            to,
            subject,
            html,
            text,
            replyTo
        });

        console.log('📧 Email sent successfully:', response);
        return { success: true, response };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error };
    }
};

/**
 * Send judge credentials email
 * @param name Judge's name
 * @param email Judge's email
 * @param password Generated password
 * @returns Promise resolving to the Resend response
 */
export const sendJudgeCredentials = async (name: string, email: string, password: string) => {
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const loginUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/judges/login`
        : 'http://localhost:3000/judges/login';

    console.log(`📧 Preparing to send judge credentials to ${email} with login URL: ${loginUrl}`);

    const emailData: EmailData = {
        to: email,
        from: fromEmail,
        subject: 'Your Judge Account for Beauty Competition',
        html: judgeCredentialsTemplate(name, email, password, loginUrl),
        text: `
      Welcome to the Beauty Competition!
      
      Dear ${name},
      
      You have been registered as a judge for our beauty competition. Here are your login credentials:
      
      Email: ${email}
      Password: ${password}
      
      Please log in at: ${loginUrl}
      
      We recommend changing your password after your first login.
      
      If you have any questions, please don't hesitate to contact us.
      
      Best regards,
      The Beauty Competition Team
    `
    };

    return sendEmail(emailData);
};

/**
 * Send contestant registration confirmation email
 * @param name Contestant's name
 * @param email Contestant's email
 * @returns Promise resolving to the Resend response
 */
export const sendContestantRegistrationConfirmation = async (name: string, email: string) => {
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const loginUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/login`
        : 'http://localhost:3000/login';

    const emailData: EmailData = {
        to: email,
        from: fromEmail,
        subject: 'Welcome to the Beauty Competition',
        html: contestantRegistrationTemplate(name, loginUrl),
        text: `
      Welcome to the Beauty Competition!
      
      Dear ${name},
      
      Thank you for registering as a contestant in our beauty competition.
      
      Your registration has been received and is being processed. You can now log in to your contestant dashboard to complete your profile and submit your work.
      
      Log in at: ${loginUrl}
      
      If you have any questions or need assistance, please don't hesitate to contact our support team.
      
      Best regards,
      The Beauty Competition Team
    `
    };

    return sendEmail(emailData);
};

/**
 * Send submission confirmation email
 * @param name Contestant's name
 * @param email Contestant's email
 * @param submissionTitle Title of the submission
 * @returns Promise resolving to the Resend response
 */
export const sendSubmissionConfirmation = async (name: string, email: string, submissionTitle: string) => {
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const dashboardUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/contestant/your-work`
        : 'http://localhost:3000/contestant/your-work';

    const emailData: EmailData = {
        to: email,
        from: fromEmail,
        subject: 'Submission Received - Beauty Competition',
        html: submissionConfirmationTemplate(name, submissionTitle, dashboardUrl),
        text: `
      Submission Received
      
      Dear ${name},
      
      We have received your submission titled "${submissionTitle}".
      
      Our judges will review your work and provide feedback. You will be notified when the evaluation is complete.
      
      View your submissions at: ${dashboardUrl}
      
      Thank you for participating in our beauty competition!
      
      Best regards,
      The Beauty Competition Team
    `
    };

    return sendEmail(emailData);
}; 