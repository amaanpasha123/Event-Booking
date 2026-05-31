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
    FaClock,
    FaShieldAlt   // 👈 NEW: used in payment secure note
} from "react-icons/fa";
import api from "../utils/axios";
import "../styles/OrganizerRegister.css"; // 👈 NEW: payment step styles

// ============================================================
// NO CHANGES to existing styles below — all original
// ============================================================
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

// ============================================================
// LOGO ROW — reused in all screens to avoid repetition
// ============================================================
const LogoRow = () => (
    <div style={s.logoRow}>
        <div style={s.logoIcon}>
            <FaTicketAlt />
        </div>
        <span style={{ color: "#fff", fontWeight: "800" }}>Eventora</span>
    </div>
);

const OrganizerRegister = () => {
    const navigate = useNavigate();
    const { registerOrganizer, verifyOTP } = useContext(AuthContext);

    // ── Form state ──────────────────────────────────────────
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    // ── Screen state ─────────────────────────────────────────
    const [showOTP, setShowOTP] = useState(false); // step 2
    const [showPayment, setShowPayment] = useState(false); // step 3 👈 NEW
    const [showWaiting, setShowWaiting] = useState(false); // step 4

    // ── UI state ─────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ============================================================
    // STEP 1 & 2 HANDLER — Register + OTP verify
    // ============================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!showOTP) {
                // STEP 1: Register organizer → backend saves with organizerStatus: 'pending'
                await registerOrganizer(name, email, password, company);
                setShowOTP(true); // move to OTP screen
            } else {
                // STEP 2: Verify OTP
                await verifyOTP(email, otp);

                // Clear auto-login — organizer is pending, not approved yet
                localStorage.removeItem("userInfo");
                localStorage.removeItem("token");

                setShowPayment(true); // 👈 NEW: move to payment screen instead of waiting
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // STEP 3 HANDLER — Razorpay Payment
    // ============================================================
    const handlePayment = async () => {
        setLoading(true);
        setError("");

        try {
            // 1. Call backend to create a Razorpay order of ₹2
            const { data } = await api.post("/payment/create-order");
            // data = { orderId, amount: 200, currency: "INR" }

            // 2. Configure Razorpay checkout popup
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env in client
                amount: data.amount,       // 200 paise = ₹2
                currency: data.currency,   // "INR"
                name: "Eventora",
                description: "Organizer Registration Fee",
                order_id: data.orderId,    // order created by backend

                // 3. On successful payment
                handler: async (response) => {
                    try {
                        // 4. Send payment proof to backend for verification
                        await api.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // 5. Payment verified → show waiting screen
                        setShowWaiting(true);

                    } catch (err) {
                        setError("Payment verification failed. Please contact support.");
                    }
                },

                prefill: {
                    name: name,   // pre-fill organizer name in popup
                    email: email   // pre-fill organizer email in popup
                },

                theme: {
                    color: "#0a0a0f" // match your app's dark theme
                },

                // If user closes popup without paying
                modal: {
                    ondismiss: () => {
                        setError("Payment was cancelled. Please try again.");
                        setLoading(false);
                    }
                }
            };

            // 6. Open Razorpay popup
            // window.Razorpay comes from the script tag in index.html
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            setError(err.message || "Could not initiate payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // SCREEN 4 — Waiting for admin approval
    // ============================================================
    if (showWaiting) {
        return (
            <div style={s.page}>
                <div style={s.card}>
                    <div style={s.top}>
                        <LogoRow />
                        <div style={s.title}>Request Submitted!</div>
                        <div style={s.sub}>Your organizer account is under review</div>
                    </div>

                    <div style={s.waitingBody}>
                        <div style={s.waitingIconWrap}>
                            <FaClock />
                        </div>

                        <div style={s.waitingTitle}>Waiting for Admin Approval</div>
                        <div style={s.waitingDesc}>
                            Your account has been verified and payment received. Our admin team will review your request and get back to you soon.
                        </div>

                        <div style={s.waitingSteps}>
                            <div style={{ ...s.waitingStepItem, marginBottom: "14px" }}>
                                <div style={s.waitingStepDot("#22c55e")} />
                                <div style={s.waitingStepText}>
                                    <span style={s.waitingStepLabel}>✓ Account Created</span>
                                    Your details have been saved successfully
                                </div>
                            </div>
                            <div style={{ ...s.waitingStepItem, marginBottom: "14px" }}>
                                <div style={s.waitingStepDot("#22c55e")} />
                                <div style={s.waitingStepText}>
                                    <span style={s.waitingStepLabel}>✓ Email Verified</span>
                                    Your email {email} is confirmed
                                </div>
                            </div>
                            {/* 👇 NEW step added for payment */}
                            <div style={{ ...s.waitingStepItem, marginBottom: "14px" }}>
                                <div style={s.waitingStepDot("#22c55e")} />
                                <div style={s.waitingStepText}>
                                    <span style={s.waitingStepLabel}>✓ Payment Done</span>
                                    ₹2 registration fee paid successfully
                                </div>
                            </div>
                            <div style={{ ...s.waitingStepItem, marginBottom: 0 }}>
                                <div style={s.waitingStepDot("#f59e0b")} />
                                <div style={s.waitingStepText}>
                                    <span style={s.waitingStepLabel}>⏳ Admin Approval Pending</span>
                                    You will be able to login once approved
                                </div>
                            </div>
                        </div>

                        <button style={s.loginBtn} onClick={() => navigate("/login")}>
                            Go to Login →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // SCREEN 3 — Payment page (NEW)
    // ============================================================
    if (showPayment) {
        return (
            <div style={s.page}>
                <div style={s.card}>
                    <div style={s.top}>
                        <LogoRow />
                        <div style={s.title}>Registration Fee</div>
                        <div style={s.sub}>One time payment to become an organizer</div>
                    </div>

                    <div className="payment-body">
                        {/* Show error if payment fails */}
                        {error && <div style={{ ...s.error, textAlign: "left" }}>{error}</div>}

                        {/* Amount box */}
                        <div className="payment-amount-box">
                            <div className="payment-amount-label">Amount to Pay</div>
                            <div className="payment-amount-value">₹2</div>
                            <div className="payment-amount-sub">One-time registration fee</div>
                        </div>

                        {/* What's included */}
                        <div className="payment-info-box">
                            <div className="payment-info-row">
                                <div className="payment-info-dot" />
                                Create and manage events on Eventora
                            </div>
                            <div className="payment-info-row">
                                <div className="payment-info-dot" />
                                Access to organizer dashboard
                            </div>
                            <div className="payment-info-row">
                                <div className="payment-info-dot" />
                                Manage bookings and attendees
                            </div>
                        </div>

                        {/* Pay button → opens Razorpay popup */}
                        <button
                            className="payment-btn"
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Pay ₹2 & Submit Request →"}
                        </button>

                        {/* Secure payment note */}
                        <div className="payment-secure-note">
                            <FaShieldAlt />
                            Secured by Razorpay — UPI, Cards, NetBanking accepted
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // SCREEN 1 & 2 — Register form + OTP (original, unchanged)
    // ============================================================
    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.top}>
                    <LogoRow />
                    <div style={s.title}>
                        {showOTP ? "Verify Organizer Account" : "Become Organizer"}
                    </div>
                    <div style={s.sub}>
                        {showOTP
                            ? "Enter OTP sent to your email"
                            : "Create events and grow your business"}
                    </div>
                </div>

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
