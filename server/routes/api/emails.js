import express from 'express';
import sendEmail from '../../services/emailService.js';
import logger from '../../configs/logger.js';

const router = express.Router();
/**
 * @swagger
 * /:
 *   post:
 *     summary: Send an email
 *     description: Sends an email with the given parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient email address
 *               subject:
 *                 type: string
 *                 description: Subject of the email
 *               text:
 *                 type: string
 *                 description: Plain text content of the email
 *               html:
 *                 type: string
 *                 description: HTML content of the email
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error - Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/', async function (req, res) {
    // TODO: Add CreatedBy to this for logging within the database
    const {to, subject, text, html} = req.body;

    logger.log('info', 'Request body: ' + req.body);

    try{
        await sendEmail(to, subject, text, html);
        res.status(200).json({success: true, message: 'Email sent successfully'});
    } catch(error){
        res.status(500).json({success: false, message: 'Failed to send email'});

        logger.log('error', "Failed to send email");
    }
})

export default router;