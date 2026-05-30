import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
    FaTicketAlt,
    FaEnvelope,
    FaLock,
    FaUser,
    FaBuilding,
    FaCheckCircle,
    FaClock
} from "react-icons/fa";

const s = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif"
    },

    card: {
        width: "100%",
        maxWidth: "470px",
        background: "#fff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.35)"
    },

    top: {
        background: "#0a0a0f",
        padding: "32px",
        textAlign: "center"
    },

    logoRow: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginBottom: "18px"
    },

    logoIcon: {
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        background: "linear-gradient(135deg,#7c6af7,#a78bfa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
    },

    title: {
        color: "#fff",
        fontSize: "26px",
        fontWeight: "800",
        marginBottom: "6px"
    },

    sub: {
        color: "rgba(255,255,255,0.6)",
        fontSize: "14px"
    },

    body: {
        padding: "34px"
    },

    fieldWrap: {
        marginBottom: "18px"
    },

    label: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#374151",
        marginBottom: "7px",
        display: "block"
    },

    inputWrap: {
        position: "relative"
    },

    icon: {
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#9ca3af"
    },

    input: {
        width: "100%",
        padding: "13px 14px 13px 42px",
        borderRadius: "12px",
        border: "1.5px solid #e5e7eb",
        background: "#fafafa",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box"
    },

    button: {
        width: "100%",
        border: "none",
        padding: "14px",
        borderRadius: "12px",
        background: "#0a0a0f",
        color: "#fff",
        fontWeight: "700",
        fontSize: "15px",
        cursor: "pointer",
        marginTop: "8px"
    },

    success: {
        background: "#f0fdf4",
        color: "#15803d",
        border: "1px solid #bbf7d0",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "18px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },

    error: {
        background: "#fef2f2",
        color: "#dc2626",
        border: "1px solid #fecaca",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "18px",
        fontSize: "14px"
    },

    bottom: {
        marginTop: "22px",
        textAlign: "center",
        fontSize: "14px",
        color: "#6b7280"
    },

    link: {
        color: "#7c6af7",
        fontWeight: "700",
        textDecoration: "none"
    },

    // ====== NEW: Waiting screen styles ======
    waitingBody: {
        padding: "40px 34px",
        textAlign: "center"
    },

    waitingIconWrap: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "#fffbeb",
        border: "2px solid #fde68a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px auto",
        fontSize: "32px",
        color: "#d97706"
    },

    waitingTitle: {
        fontSize: "20px",
        fontWeight: "800",
        color: "#111",
        marginBottom: "12px"
    },

    waitingDesc: {
        fontSize: "14px",
        color: "#6b7280",
        lineHeight: "1.7",
        marginBottom: "28px"
    },

    waitingSteps: {
        background: "#f9fafb",
        borderRadius: "14px",
        padding: "20px",
        border: "1px solid #f0f0f0",
        marginBottom: "24px",
        textAlign: "left"
    },

    waitingStepItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "14px"
    },

    waitingStepDot: (color) => ({
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: color,
        marginTop: "5px",
        flexShrink: 0
    }),

    waitingStepText: {
        fontSize: "13px",
        color: "#374151",
        lineHeight: "1.5"
    },

    waitingStepLabel: {
        fontWeight: "700",
        color: "#111",
        display: "block",
        marginBottom: "2px"
    },

    loginBtn: {
        width: "100%",
        border: "1.5px solid #e5e7eb",
        padding: "13px",
        borderRadius: "12px",
        background: "#fff",
        color: "#374151",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif"
    }
};

const OrganizerRegister = () => {
    const navigate = useNavigate();
    const { register, verifyOTP } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [showOTP, setShowOTP] = useState(false);
    const [showWaiting, setShowWaiting] = useState(false); // 👈 NEW
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!showOTP) {
                await register(name, email, password, "organizer", company);
                setShowOTP(true);
            } else {
                await verifyOTP(email, otp);
                setShowWaiting(true); // 👈 show waiting screen instead of navigating
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // ====== NEW: Waiting for approval screen ======
    if (showWaiting) {
        return (
            <div style={s.page}>
                <div style={s.card}>
                    {/* TOP */}
                    <div style={s.top}>
                        <div style={s.logoRow}>
                            <div style={s.logoIcon}>
                                <FaTicketAlt />
                            </div>
                            <span style={{ color: "#fff", fontWeight: "800" }}>
                                Eventora
                            </span>
                        </div>
                        <div style={s.title}>Request Submitted!</div>
                        <div style={s.sub}>Your organizer account is under review</div>
                    </div>

                    {/* WAITING BODY */}
                    <div style={s.waitingBody}>

                        {/* Clock icon */}
                        <div style={s.waitingIconWrap}>
                            <FaClock />
                        </div>

                        <div style={s.waitingTitle}>Waiting for Admin Approval</div>
                        <div style={s.waitingDesc}>
                            Your account has been verified successfully. Our admin team will review your organizer request and get back to you soon.
                        </div>

                        {/* Steps */}
                        <div style={s.waitingSteps}>
                            <div style={{ ...s.waitingStepItem, marginBottom: '14px' }}>
                                <div style={s.waitingStepDot('#22c55e')} />
                                <div style={s.waitingStepText}>
                                    <span style={s.waitingStepLabel}>✓ Account Created</span>
                                    Your details have been saved successfully
                                </div>
                            </div>
                            <div style={{ ...s.waitingStepItem, marginBottom: '14px' }}>
                                <div style={s.waitingStepDot('#22c55e')} />
                                <div style={s.waitingStepText}>
                                    <span style={s.waitingStepLabel}>✓ Email Verified</span>
                                    Your email {email} is confirmed
                                </div>
                            </div>
                            <div style={{ ...s.waitingStepItem, marginBottom: 0 }}>
                                <div style={s.waitingStepDot('#f59e0b')} />
                                <div style={s.waitingStepText}>
                                    <span style={s.waitingStepLabel}>⏳ Admin Approval Pending</span>
                                    You will be able to login once approved
                                </div>
                            </div>
                        </div>

                        {/* Go to login */}
                        <button
                            style={s.loginBtn}
                            onClick={() => navigate('/login')}
                        >
                            Go to Login →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ====== Original form ======
    return (
        <div style={s.page}>
            <div style={s.card}>
                {/* TOP */}
                <div style={s.top}>
                    <div style={s.logoRow}>
                        <div style={s.logoIcon}>
                            <FaTicketAlt />
                        </div>
                        <span style={{ color: "#fff", fontWeight: "800" }}>
                            Eventora
                        </span>
                    </div>

                    <div style={s.title}>
                        {showOTP ? "Verify Organizer Account" : "Become Organizer"}
                    </div>

                    <div style={s.sub}>
                        {showOTP
                            ? "Enter OTP sent to your email"
                            : "Create events and grow your business"}
                    </div>
                </div>

                {/* BODY */}
                <div style={s.body}>
                    {error && <div style={s.error}>{error}</div>}

                    {showOTP && (
                        <div style={s.success}>
                            <FaCheckCircle />
                            OTP sent to {email}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {!showOTP ? (
                            <>
                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Full Name</label>
                                    <div style={s.inputWrap}>
                                        <FaUser style={s.icon} />
                                        <input
                                            style={s.input}
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Company / Brand</label>
                                    <div style={s.inputWrap}>
                                        <FaBuilding style={s.icon} />
                                        <input
                                            style={s.input}
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Email</label>
                                    <div style={s.inputWrap}>
                                        <FaEnvelope style={s.icon} />
                                        <input
                                            style={s.input}
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Password</label>
                                    <div style={s.inputWrap}>
                                        <FaLock style={s.icon} />
                                        <input
                                            style={s.input}
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Create password"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={s.fieldWrap}>
                                <label style={s.label}>OTP Code</label>
                                <input
                                    style={{
                                        ...s.input,
                                        textAlign: "center",
                                        letterSpacing: "10px",
                                        paddingLeft: "14px",
                                        fontSize: "24px",
                                        fontWeight: "700"
                                    }}
                                    type="text"
                                    maxLength="6"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    placeholder="000000"
                                />
                            </div>
                        )}

                        <button style={s.button} disabled={loading}>
                            {loading
                                ? "Processing..."
                                : showOTP
                                    ? "Verify & Continue →"
                                    : "Create Organizer Account →"}
                        </button>
                    </form>

                    <div style={s.bottom}>
                        Already have account?{" "}
                        <Link to="/login" style={s.link}>
                            Sign In →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerRegister;
