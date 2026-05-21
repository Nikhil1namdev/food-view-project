const { Resend } = require('resend');

// =========================================================================
// EMAIL UTILITY (sendEmail.js)
// =========================================================================
// Uses Resend to send transactional emails (e.g., password resets)

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const data = await resend.emails.send({
            from: 'FoodView <onboarding@resend.dev>', // Update this to your verified domain in production
            to,
            subject,
            html,
        });
        
        return data;
    } catch (error) {
        console.error("Error sending email via Resend:", error);
        throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;
