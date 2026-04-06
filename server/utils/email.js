const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// ✅ Reusable Email Sender Function
const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${mailOptions.to}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error.message);
        return false;
    }
};

// ✅ OTP Email
exports.sendOtpEmail = async (email, otp, type) => {
    const subject =
        type === "account_verification"
            ? "Verify yours Event account"
            : "OTP Verification";

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: `Your OTP is ${otp}`,
        html: `
            <div style="font-family: Arial; padding: 20px; background:#f4f4f4;">
                <div style="max-width:500px;margin:auto;background:#fff;padding:20px;border-radius:10px;text-align:center;">
                    <h2>🔐 ${subject}</h2>
                    <p>Use the OTP below:</p>
                    <div style="font-size:28px;font-weight:bold;background:#eee;padding:10px;border-radius:5px;">
                        ${otp}
                    </div>
                    <p style="font-size:12px;color:gray;">Do not share this OTP.</p>
                </div>
            </div>
        `
    };

    return await sendEmail(mailOptions);
};

// ✅ Booking Confirmation Email
exports.sendBookingEmail = async (userEmail, userName, eventTitle) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `🎉 Booking Confirmed: ${eventTitle}`,
        html: `
            <div style="font-family: Arial; padding: 20px; background:#f4f4f4;">
                <div style="max-width:500px;margin:auto;background:#fff;padding:20px;border-radius:10px;">
                    
                    <h2 style="color:#2c3e50;">Hello ${userName} 👋</h2>

                    <p style="font-size:16px;">
                        Your booking for <strong>${eventTitle}</strong> is successfully confirmed 🎉
                    </p>

                    <p style="color:#555;">
                        Thank you for choosing us. We hope you enjoy the event!
                    </p>

                    <hr/>

                    <p style="font-size:12px;color:gray;">
                        If you have any questions, feel free to contact us.
                    </p>
                </div>
            </div>
        `
    };

    return await sendEmail(mailOptions);
};