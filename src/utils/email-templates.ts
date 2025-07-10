/**
 * Email template for the base layout
 * @param content HTML content to insert in the template
 * @returns HTML string with the email template
 */
export const baseEmailTemplate = (content: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Beauty Competition</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eeeeee;
        }
        .footer {
          text-align: center;
          padding: 20px 0;
          font-size: 12px;
          color: #666666;
          border-top: 1px solid #eeeeee;
          margin-top: 30px;
        }
        .button {
          display: inline-block;
          background-color: #e91e63;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .content {
          padding: 20px 0;
        }
        .credentials-box {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #e91e63;">Beauty Competition</h1>
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Beauty Competition. All rights reserved.</p>
          <p>If you have any questions, please contact us at support@beautycompetition.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Email template for judge credentials
 * @param name Judge's name
 * @param email Judge's email
 * @param password Generated password
 * @param loginUrl URL to the login page
 * @returns HTML string with the email template
 */
export const judgeCredentialsTemplate = (
    name: string,
    email: string,
    password: string,
    loginUrl: string
): string => {
    const content = `
    <h2>Welcome to the Beauty Competition!</h2>
    <p>Dear ${name},</p>
    <p>You have been registered as a judge for our beauty competition. Here are your login credentials:</p>
    
    <div class="credentials-box">
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
    </div>
    
    <p>Please use these credentials to log in to your judge dashboard.</p>
    <a href="${loginUrl}" class="button">Log In Now</a>
    
    <p>We recommend changing your password after your first login.</p>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    <p>Best regards,<br>The Beauty Competition Team</p>
  `;

    return baseEmailTemplate(content);
};

/**
 * Email template for contestant registration confirmation
 * @param name Contestant's name
 * @param loginUrl URL to the login page
 * @returns HTML string with the email template
 */
export const contestantRegistrationTemplate = (
    name: string,
    loginUrl: string
): string => {
    const content = `
    <h2>Welcome to the Beauty Competition!</h2>
    <p>Dear ${name},</p>
    <p>Thank you for registering as a contestant in our beauty competition.</p>
    <p>Your registration has been received and is being processed. You can now log in to your contestant dashboard to complete your profile and submit your work.</p>
    
    <a href="${loginUrl}" class="button">Log In to Your Dashboard</a>
    
    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
    <p>Best regards,<br>The Beauty Competition Team</p>
  `;

    return baseEmailTemplate(content);
};

/**
 * Email template for submission confirmation
 * @param name Contestant's name
 * @param submissionTitle Title of the submission
 * @param dashboardUrl URL to the contestant dashboard
 * @returns HTML string with the email template
 */
export const submissionConfirmationTemplate = (
    name: string,
    submissionTitle: string,
    dashboardUrl: string
): string => {
    const content = `
    <h2>Submission Received</h2>
    <p>Dear ${name},</p>
    <p>We have received your submission titled <strong>"${submissionTitle}"</strong>.</p>
    <p>Our judges will review your work and provide feedback. You will be notified when the evaluation is complete.</p>
    
    <a href="${dashboardUrl}" class="button">View Your Submissions</a>
    
    <p>Thank you for participating in our beauty competition!</p>
    <p>Best regards,<br>The Beauty Competition Team</p>
  `;

    return baseEmailTemplate(content);
}; 