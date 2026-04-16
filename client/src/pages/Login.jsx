import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
    FaTicketAlt,
    FaEnvelope,
    FaLock,
    FaShieldAlt,
    FaUserTie // ✅ NEW ICON FOR ORGANIZER
} from "react-icons/fa";

const s = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "24px",
    },

    card: {
        width: "100%",
        maxWidth: "440px",
        background: "#fff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
    },

    cardTop: {
        background: "#0a0a0f",
        padding: "36px 40px 32px",
        textAlign: "center",
    },

    brandRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "24px",
    },

    brandIcon: {
        width: "36px",
        height: "36px",
        background: "linear-gradient(135deg, #7c6af7, #a78bfa)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
    },

    brandName: {
        fontSize: "22px",
        fontWeight: 800,
        color: "#fff",
    },

    brandNameAccent: {
        color: "#a78bfa",
    },

    heroTitle: {
        fontSize: "26px",
        fontWeight: 800,
        color: "#fff",
        marginBottom: "8px",
    },

    heroSub: {
        fontSize: "14px",
        color: "rgba(255,255,255,0.5)",
    },

    cardBody: {
        padding: "36px 40px",
    },

    errorBox: {
        background: "#fef2f2",
        color: "#dc2626",
        border: "1px solid #fecaca",
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "24px",
        fontSize: "14px",
        textAlign: "center",
    },

    otpHint: {
        background: "#f0f4ff",
        color: "#4f46e5",
        border: "1px solid #c7d2fe",
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "24px",
        fontSize: "13px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
    },

    fieldWrap: {
        marginBottom: "20px",
    },

    label: {
        display: "block",
        fontSize: "13px",
        fontWeight: 600,
        color: "#374151",
        marginBottom: "8px",
    },

    inputWrap: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },

    inputIcon: {
        position: "absolute",
        left: "16px",
        color: "#9ca3af",
    },

    input: {
        width: "100%",
        paddingLeft: "44px",
        paddingRight: "16px",
        paddingTop: "13px",
        paddingBottom: "13px",
        borderRadius: "10px",
        border: "1.5px solid #e5e7eb",
        fontSize: "15px",
        background: "#fafafa",
        outline: "none",
    },

    otpInput: {
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        border: "1.5px solid #e5e7eb",
        fontSize: "24px",
        textAlign: "center",
        letterSpacing: "10px",
        fontWeight: 700,
        background: "#fafafa",
        outline: "none",
    },

    submitBtn: {
        width: "100%",
        background: "#0a0a0f",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        padding: "15px",
        fontSize: "15px",
        fontWeight: 700,
        cursor: "pointer",
        marginTop: "8px",
    },

    divider: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        margin: "24px 0",
        color: "#d1d5db",
        fontSize: "13px",
    },

    dividerLine: {
        flex: 1,
        height: "1px",
        background: "#f0f0f0",
    },

    signupRow: {
        textAlign: "center",
        fontSize: "14px",
        color: "#6b7280",
    },

    signupLink: {
        color: "#7c6af7",
        fontWeight: 700,
        textDecoration: "none",
    },

    organizerBtn: {
        marginTop: "12px",
        width: "100%",
        padding: "13px",
        borderRadius: "12px",
        border: "1px solid #d1d5db",
        background: "#fff",
        color: "#111827",
        fontWeight: 700,
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
    }
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!showOTP) {
                const data = await login(email, password);

                // ✅ UPDATED ROLE BASED REDIRECT
                if (data.role === "admin") {
                    navigate("/admin");
                } else if (data.role === "organizer") {
                    navigate("/organizer");
                } else {
                    navigate("/dashboard");
                }

            } else {
                const data = await verifyOTP(email, otp);

                // ✅ UPDATED ROLE BASED REDIRECT AFTER OTP
                if (data.role === "admin") {
                    navigate("/admin");
                } else if (data.role === "organizer") {
                    navigate("/organizer");
                } else {
                    navigate("/dashboard");
                }
            }

        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError("Account not verified. OTP sent to your email.");
            } else {
                setError(err.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.page}>
            <div style={s.card}>

                {/* TOP SECTION */}
                <div style={s.cardTop}>
                    <div style={s.brandRow}>
                        <div style={s.brandIcon}>
                            <FaTicketAlt />
                        </div>

                        <span style={s.brandName}>
                            Event<span style={s.brandNameAccent}>ora</span>
                        </span>
                    </div>

                    <h2 style={s.heroTitle}>
                        {showOTP ? "Check Your Email" : "Welcome Back"}
                    </h2>

                    <p style={s.heroSub}>
                        {showOTP
                            ? "Enter the 6-digit code we sent you"
                            : "Sign in to your account"}
                    </p>
                </div>

                {/* BODY */}
                <div style={s.cardBody}>

                    {error && <div style={s.errorBox}>{error}</div>}

                    {showOTP && (
                        <div style={s.otpHint}>
                            <FaShieldAlt />
                            Check inbox for OTP
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {!showOTP ? (
                            <>
                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Email</label>
                                    <div style={s.inputWrap}>
                                        <FaEnvelope style={s.inputIcon} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            style={s.input}
                                        />
                                    </div>
                                </div>

                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Password</label>
                                    <div style={s.inputWrap}>
                                        <FaLock style={s.inputIcon} />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            style={s.input}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={s.fieldWrap}>
                                <label style={s.label}>OTP</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    style={s.otpInput}
                                />
                            </div>
                        )}

                        <button type="submit" style={s.submitBtn} disabled={loading}>
                            {loading
                                ? "Processing..."
                                : showOTP
                                    ? "Verify & Sign In →"
                                    : "Sign In →"}
                        </button>
                    </form>

                    <div style={s.divider}>
                        <div style={s.dividerLine}></div>
                        or
                        <div style={s.dividerLine}></div>
                    </div>

                    {/* ✅ NORMAL USER SIGNUP */}
                    <div style={s.signupRow}>
                        Dont have an account?{" "}
                        <Link to="/register" style={s.signupLink}>
                            Sign up as User →
                        </Link>
                    </div>

                    {/* ✅ NEW ORGANIZER SIGNUP BUTTON */}
                    <Link to="/register-organizer" style={s.organizerBtn}>
                        <FaUserTie />
                        Sign up as Organizer
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Login;

