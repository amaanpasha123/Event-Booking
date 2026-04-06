import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaTicketAlt, FaEnvelope, FaLock, FaUser, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const s = {
    page: {
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: '24px',
    },
    card: {
        width: '100%', maxWidth: '440px', background: '#fff',
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
    },
    cardTop: {
        background: '#0a0a0f', padding: '32px 40px 28px', textAlign: 'center',
    },
    brandRow: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '10px', marginBottom: '20px',
    },
    brandIcon: {
        width: '36px', height: '36px',
        background: 'linear-gradient(135deg, #7c6af7, #a78bfa)',
        borderRadius: '10px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '16px', color: '#fff',
    },
    brandName: { fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' },
    brandAccent: { color: '#a78bfa' },
    heroTitle: { fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.4px' },
    heroSub: { fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 400 },

    // Step indicator
    stepRow: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '0', marginTop: '20px',
    },
    stepDot: (active, done) => ({
        width: '28px', height: '28px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 700,
        background: done ? '#7c6af7' : active ? '#fff' : 'rgba(255,255,255,0.15)',
        color: done ? '#fff' : active ? '#0a0a0f' : 'rgba(255,255,255,0.4)',
        transition: 'all 0.3s',
    }),
    stepLine: (done) => ({
        width: '48px', height: '2px',
        background: done ? '#7c6af7' : 'rgba(255,255,255,0.15)',
        transition: 'background 0.3s',
    }),
    stepLabel: (active, done) => ({
        fontSize: '10px', fontWeight: 600,
        color: done || active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
        marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px',
    }),

    cardBody: { padding: '32px 40px' },

    errorBox: {
        background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
        borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
        fontSize: '13px', textAlign: 'center',
    },
    successBox: {
        background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
        borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
        fontSize: '13px', display: 'flex', alignItems: 'center',
        gap: '8px', justifyContent: 'center',
    },

    fieldWrap: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '7px' },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '15px', color: '#9ca3af', fontSize: '14px', pointerEvents: 'none' },
    input: {
        width: '100%', paddingLeft: '42px', paddingRight: '16px',
        paddingTop: '12px', paddingBottom: '12px',
        borderRadius: '10px', border: '1.5px solid #e5e7eb',
        fontSize: '14px', color: '#111', fontFamily: 'inherit',
        outline: 'none', background: '#fafafa', boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    otpInput: {
        width: '100%', padding: '16px',
        borderRadius: '12px', border: '1.5px solid #e5e7eb',
        fontSize: '26px', color: '#111', fontFamily: 'monospace',
        outline: 'none', textAlign: 'center', letterSpacing: '12px',
        fontWeight: 700, boxSizing: 'border-box', background: '#fafafa',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },

    passwordHints: {
        display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px',
    },
    hint: (ok) => ({
        fontSize: '11px', padding: '3px 8px', borderRadius: '999px',
        background: ok ? '#f0fdf4' : '#f9fafb',
        color: ok ? '#16a34a' : '#9ca3af',
        border: `1px solid ${ok ? '#bbf7d0' : '#e5e7eb'}`,
        fontWeight: 500, transition: 'all 0.2s',
    }),

    submitBtn: (hover, loading) => ({
        width: '100%', background: loading ? '#6b7280' : hover ? '#1a1a2e' : '#0a0a0f',
        color: '#fff', border: 'none', borderRadius: '12px', padding: '14px',
        fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', marginTop: '8px',
        transform: hover && !loading ? 'translateY(-1px)' : 'none',
        transition: 'all 0.2s', letterSpacing: '0.2px',
    }),

    divider: {
        display: 'flex', alignItems: 'center', gap: '12px',
        margin: '20px 0', color: '#d1d5db', fontSize: '12px',
    },
    dividerLine: { flex: 1, height: '1px', background: '#f0f0f0' },
    signinRow: { textAlign: 'center', fontSize: '13px', color: '#6b7280' },
    signinLink: { color: '#7c6af7', fontWeight: 700, textDecoration: 'none' },
};

const focusOn = { borderColor: '#7c6af7', boxShadow: '0 0 0 3px rgba(124,106,247,0.12)', background: '#fff' };
const focusOff = { borderColor: '#e5e7eb', boxShadow: 'none', background: '#fafafa' };

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [btnHover, setBtnHover] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const pwChecks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.page}>
            <div style={s.card}>
                {/* Top dark header */}
                <div style={s.cardTop}>
                    <div style={s.brandRow}>
                        <div style={s.brandIcon}><FaTicketAlt /></div>
                        <span style={s.brandName}>Event<span style={s.brandAccent}>ora</span></span>
                    </div>
                    <h2 style={s.heroTitle}>{showOTP ? 'Almost There!' : 'Create Account'}</h2>
                    <p style={s.heroSub}>{showOTP ? 'Verify your email to get started' : 'Join Eventora — it\'s free'}</p>

                    {/* Step indicator */}
                    <div style={s.stepRow}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={s.stepDot(!showOTP, showOTP)}>
                                {showOTP ? '✓' : '1'}
                            </div>
                            <span style={s.stepLabel(!showOTP, showOTP)}>Details</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '16px' }}>
                            <div style={s.stepLine(showOTP)} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={s.stepDot(showOTP, false)}>2</div>
                            <span style={s.stepLabel(showOTP, false)}>Verify</span>
                        </div>
                    </div>
                </div>

                {/* Form body */}
                <div style={s.cardBody}>
                    {error && <div style={s.errorBox}>{error}</div>}

                    {showOTP && !error && (
                        <div style={s.successBox}>
                            <FaCheckCircle />
                            <span>OTP sent! Check your inbox at <strong>{email}</strong></span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {!showOTP ? (
                            <>
                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Full Name</label>
                                    <div style={s.inputWrap}>
                                        <FaUser style={s.inputIcon} />
                                        <input
                                            type="text" required placeholder="John Doe"
                                            style={s.input} value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onFocus={e => Object.assign(e.target.style, focusOn)}
                                            onBlur={e => Object.assign(e.target.style, focusOff)}
                                        />
                                    </div>
                                </div>

                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Email Address</label>
                                    <div style={s.inputWrap}>
                                        <FaEnvelope style={s.inputIcon} />
                                        <input
                                            type="email" required placeholder="you@example.com"
                                            style={s.input} value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={e => Object.assign(e.target.style, focusOn)}
                                            onBlur={e => Object.assign(e.target.style, focusOff)}
                                        />
                                    </div>
                                </div>

                                <div style={s.fieldWrap}>
                                    <label style={s.label}>Password</label>
                                    <div style={s.inputWrap}>
                                        <FaLock style={s.inputIcon} />
                                        <input
                                            type="password" required placeholder="Create a strong password"
                                            style={s.input} value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={e => Object.assign(e.target.style, focusOn)}
                                            onBlur={e => Object.assign(e.target.style, focusOff)}
                                        />
                                    </div>
                                    {password.length > 0 && (
                                        <div style={s.passwordHints}>
                                            <span style={s.hint(pwChecks.length)}>8+ chars</span>
                                            <span style={s.hint(pwChecks.upper)}>Uppercase</span>
                                            <span style={s.hint(pwChecks.number)}>Number</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={s.fieldWrap}>
                                <label style={s.label}>6-Digit Verification Code</label>
                                <input
                                    type="text" required placeholder="000000"
                                    style={s.otpInput} value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    maxLength="6"
                                    onFocus={e => Object.assign(e.target.style, focusOn)}
                                    onBlur={e => Object.assign(e.target.style, focusOff)}
                                />
                                <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '10px' }}>
                                    Didn't receive it?{' '}
                                    <span style={{ color: '#7c6af7', fontWeight: 600, cursor: 'pointer' }}>Resend code</span>
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={s.submitBtn(btnHover, loading)}
                            onMouseEnter={() => setBtnHover(true)}
                            onMouseLeave={() => setBtnHover(false)}
                        >
                            {loading ? 'Processing...' : showOTP ? 'Verify & Complete →' : 'Create Account →'}
                        </button>
                    </form>

                    {!showOTP && (
                        <>
                            <div style={s.divider}>
                                <div style={s.dividerLine} />
                                <span>or</span>
                                <div style={s.dividerLine} />
                            </div>
                            <div style={s.signinRow}>
                                Already have an account?{' '}
                                <Link to="/login" style={s.signinLink}>Sign in →</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
