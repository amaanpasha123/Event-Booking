const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/email");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");

// 🔐 Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // 🔍 STEP 1 — see exactly what frontend is sending
        console.log("==== VERIFY OTP DEBUG ====");
        console.log("Email received:", email);
        console.log("OTP received:", otp);
        console.log("OTP type:", typeof otp);
        console.log("OTP length:", otp?.length);

        // 🔍 STEP 2 — see ALL otp records for this email in DB
        const allOtps = await OTP.find({ email });
        console.log("All OTP records in DB for this email:", JSON.stringify(allOtps, null, 2));

        // 🔍 STEP 3 — try to find matching record
        const otpRecord = await OTP.findOne({
            email,
            otp,
            action: "account_verification"
        });
        console.log("Matching OTP record found:", otpRecord);

        if (!otpRecord) {
            console.log("❌ No match found — OTP or email mismatch");
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // 🔍 STEP 4 — check expiry details
        console.log("expiresAt in DB:", otpRecord.expiresAt);
        console.log("Current time:", new Date());
        console.log("Is expired?", new Date(otpRecord.expiresAt) < new Date());

        if (new Date(otpRecord.expiresAt) < new Date()) {
            await OTP.deleteMany({ email, action: "account_verification" });
            return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await OTP.deleteMany({ email, action: "account_verification" });

        res.status(200).json({
            message: "Your account is verified successfully",
            token: generateToken(user._id, user.role),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("OTP Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            if (!userExists.isVerified) {
                // User exists but not verified — resend OTP
                const otp = Math.floor(100000 + Math.random() * 900000).toString();

                await OTP.deleteMany({ email, action: "account_verification" });
                await OTP.create({
                    email,
                    otp,
                    action: "account_verification",
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
                });

                const emailSent = await sendOtpEmail(email, otp, "account_verification");

                if (!emailSent) {
                    await OTP.deleteMany({ email, action: "account_verification" });
                    return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
                }

                return res.status(200).json({
                    message: "OTP resent to your email. Please verify.",
                    email
                });
            }

            return res.status(400).json({ message: "User already exists. Please login." });
        }

        // New user — hash password and create account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            isVerified: false
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);

        await OTP.create({
            email,
            otp,
            action: "account_verification",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        const emailSent = await sendOtpEmail(email, otp, "account_verification");

        if (!emailSent) {
            // ✅ Clean up both user AND otp so they can try again fresh
            await User.deleteOne({ email });
            await OTP.deleteMany({ email, action: "account_verification" });
            return res.status(500).json({ message: "Registration failed. Could not send OTP. Please try again." });
        }

        res.status(201).json({
            message: "User registered successfully. Please verify OTP sent to email.",
            email: user.email
        });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials, please signup first" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        if (!user.isVerified && user.role === "user") {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await OTP.deleteMany({ email, action: "account_verification" });
            await OTP.create({
                email,
                otp,
                action: "account_verification",
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            });

            // ✅ Handle email failure in login too
            const emailSent = await sendOtpEmail(email, otp, "account_verification");

            if (!emailSent) {
                await OTP.deleteMany({ email, action: "account_verification" });
                return res.status(500).json({ error: "Could not send OTP email. Please try again." });
            }

            return res.status(403).json({
                error: "Account is not verified. OTP sent to your email."
            });
        }

        res.status(200).json({
            message: "Login Successfully",
            token: generateToken(user._id, user.role),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};
