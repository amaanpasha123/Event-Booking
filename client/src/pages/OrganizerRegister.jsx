import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
    FaTicketAlt,
    FaEnvelope,
    FaLock,
    FaUser,
    FaBuilding,
    FaCheckCircle
} from "react-icons/fa";

/*
=====================================================
ORGANIZER REGISTER PAGE
✅ Uses SAME backend register route
POST /api/auth/register

Only difference:
register(name, email, password, role)

role = "organizer"

Backend must accept role field.
=====================================================
*/

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
    }
};

const OrganizerRegister = () => {
    const navigate = useNavigate();

    /*
    AuthContext should already contain:
    register(name,email,password,role)
    verifyOTP(email,otp)
    */

    const { register, verifyOTP } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!showOTP) {
                /*
                SAME backend route used.
                role sent as organizer
                */
                await register(name, email, password, "organizer", company);

                setShowOTP(true);
            } else {
                await verifyOTP(email, otp);

                // organizer goes to organizer dashboard
                navigate("/organizer/dashboard");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

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
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                <div style={s.fieldWrap}>
                                    <label style={s.label}>
                                        Company / Brand
                                    </label>
                                    <div style={s.inputWrap}>
                                        <FaBuilding style={s.icon} />
                                        <input
                                            style={s.input}
                                            type="text"
                                            value={company}
                                            onChange={(e) =>
                                                setCompany(e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
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
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
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