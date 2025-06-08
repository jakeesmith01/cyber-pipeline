import 'dotenv/config';
import nodemailer from 'nodemailer';
import logger from '../configs/logger.js';

// Pulls SMTP configuration from the environment vars
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
});

/**
 * Sends an email using the SMTP transporter.
 * 'to' can be a single email address or an array of email addresses.
 * @param {string|array} to - The recipient(s) email address(es). 
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text version of the email.
 * @param {string} html - The HTML version of the email.
 */
const sendEmail = async (to, subject, text, html) => {
    try{
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: Array.isArray(to) ? to.join(',') : to,
            subject: subject,
            text: text,
            html: html,
        };

        logger.email('Sending email to:  ' + to);
        const result = await transporter.sendMail(mailOptions);
        logger.email('Email sent: '+ result.messageId);

    } catch(error){
        logger.error('Failed to send email: ' + error);

        throw error;
    }
}

/**
 * Sends a magic link email to the user
 * @param {object} emailData 
 * @param {string} emailData.to - The recipient's email address
 * @param {string} emailData.subject - The subject of the email
 * @param {string} emailData.text - The plain text version of the email
 * @param {string} emailData.html - The HTML version of the email
 */
const sendMagicLink = async (emailData) => {
    console.log(emailData)

    try{
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html,
        };

        logger.email('Sending email to: ' + emailData.to);
        const result = await transporter.sendMail(mailOptions);
        logger.email('Email sent: ' + result.messageId);
    } catch(error) {
        logger.error('Failed to send email: ' + error);
        throw error;
    }
}

export default sendEmail;
export { sendMagicLink };
