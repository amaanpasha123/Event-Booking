const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// ================= COMMON SEND FUNCTION =================
const sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await resend.emails.send({
            from: "Eventora <onboarding@resend.dev>", // default working sender
            to,
            subject,
            html,
        });

        console.log("✅ Email sent:", response);
        return true;
    } catch (error) {
        console.error("❌ FULL EMAIL ERROR:", error);
        return false;
    }
};

// ================= OTP EMAIL =================
exports.sendOtpEmail = async (email, otp, type) => {
    const subject =
        type === "account_verification"
            ? "Verify your Eventora account"
            : "OTP Verification";

    const html = `
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
    `;

    return await sendEmail({ to: email, subject, html });
};

// ================= BOOKING EMAIL =================
exports.sendBookingEmail = async (userEmail, userName, eventTitle) => {
    const subject = `🎉 Booking Confirmed: ${eventTitle}`;

    const html = `
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
    `;

    return await sendEmail({ to: userEmail, subject, html });
};