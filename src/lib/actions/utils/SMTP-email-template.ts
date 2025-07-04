import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
	try {
		const info = await transporter.sendMail({
			from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
			to,
			subject,
			html,
		});

		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending email:", error);
		throw new Error("Failed to send email");
	}
}

export function generatePasswordResetEmail(code: string) {
	return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0b519f;">Password Reset Request</h2>
            <p>You have requested to reset your password. Use the following code to proceed:</p>
            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h1 style="color: #0b519f; margin: 0; font-size: 32px;">${code}</h1>
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
    `;
}

export function generateWelcomeEmail(
	firstName: string,
	lastName: string,
	companyName: string,
	resetToken: string,
	loginEmail: string
) {
	const resetLink = `${
		process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
	}/verify?token=${resetToken}`;

	console.log("companyName", companyName);
	return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0b519f;">Welcome to NovAzure</h2>
            <p>Hello ${firstName} ${lastName},</p>
            <p>Welcome to NovAzure! Your account has been created for <strong>${companyName}</strong>.</p>
            <p><strong>Your login email:</strong> ${loginEmail}</p>
            <p>To get started, you'll need to set up your account password. Please click the button below to create your password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="background-color: #0b519f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Set Up Your Password
                </a>
            </div>
            <p>This link will expire in 1 week for security reasons.</p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
    `;
}
