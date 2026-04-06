import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const s = {
    page: { maxWidth: '960px', margin: '32px auto', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: '0 16px' },
    card: { background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' },

    // Image
    imgWrap: { width: '100%', height: '340px', overflow: 'hidden', position: 'relative' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    imgFallback: { width: '100%', height: '100%', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '56px', fontWeight: 900, letterSpacing: '8px', textTransform: 'uppercase' },
    categoryOverlay: { position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '6px 14px', borderRadius: '999px', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.15)' },

    // Body layout
    body: { padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' },
    left: { flex: '1 1 340px' },
    right: { flex: '0 0 300px', width: '300px' },

    // Left side
    eventTitle: { fontSize: '32px', fontWeight: 900, color: '#0a0a0f', marginBottom: '16px', letterSpacing: '-0.7px', lineHeight: 1.2 },
    eventDesc: { fontSize: '15px', color: '#6b7280', lineHeight: 1.8, marginBottom: '28px' },

    // Organizer
    orgRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f0f0f0', marginBottom: '24px' },
    orgAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c6af7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700, flexShrink: 0 },
    orgInfo: {},
    orgLabel: { fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
    orgName: { fontSize: '13px', fontWeight: 700, color: '#111' },

    // Meta pills
    metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f0f0f0' },
    metaIcon: (color) => ({ width: '32px', height: '32px', borderRadius: '8px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: '14px', flexShrink: 0 }),
    metaLabel: { fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' },
    metaValue: { fontSize: '13px', fontWeight: 700, color: '#111' },

    // Seats bar
    seatsBarWrap: { marginTop: '20px' },
    seatsBarBg: { width: '100%', height: '6px', background: '#f0f0f0', borderRadius: '999px', marginBottom: '6px' },
    seatsBarFill: (pct) => ({ height: '6px', borderRadius: '999px', background: pct < 20 ? '#ef4444' : pct < 50 ? '#f59e0b' : '#22c55e', width: `${pct}%`, transition: 'width 0.4s' }),
    seatsLabel: { fontSize: '12px', color: '#9ca3af' },

    // Booking panel
    panel: { background: '#f9fafb', borderRadius: '20px', border: '1px solid #f0f0f0', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'sticky', top: '20px' },
    panelTitle: { fontSize: '18px', fontWeight: 800, color: '#0a0a0f', marginBottom: '20px', letterSpacing: '-0.3px' },

    // Price hero
    priceHero: { background: '#0a0a0f', borderRadius: '14px', padding: '20px', marginBottom: '20px', textAlign: 'center' },
    priceFree: { fontSize: '28px', fontWeight: 900, color: '#4ade80' },
    pricePaid: { fontSize: '28px', fontWeight: 900, color: '#fff' },
    priceSub: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' },

    // OTP input
    otpWrap: { marginBottom: '16px' },
    otpLabel: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' },
    otpHint: { background: '#f0f4ff', color: '#4f46e5', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' },
    otpInput: { width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '22px', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '10px', fontWeight: 700, outline: 'none', background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.2s' },

    // Book button
    bookBtn: (disabled, hover) => ({
        width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
        fontSize: '15px', fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', letterSpacing: '0.2px',
        background: disabled ? '#e5e7eb' : hover ? '#1a1a2e' : '#0a0a0f',
        color: disabled ? '#9ca3af' : '#fff',
        transform: !disabled && hover ? 'translateY(-1px)' : 'none',
        boxShadow: !disabled && hover ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
        transition: 'all 0.2s',
    }),

    errorBox: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', marginTop: '12px', fontSize: '13px', textAlign: 'center' },
    successBox: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', marginTop: '12px', fontSize: '13px', textAlign: 'center' },

    // Secure badge
    secureBadge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '11px', color: '#9ca3af', fontWeight: 500 },

    // States
    loadingPage: { textAlign: 'center', padding: '80px', fontSize: '18px', fontWeight: 600, color: '#6b7280', fontFamily: "'DM Sans', sans-serif" },
    errorPage: { textAlign: 'center', padding: '80px', fontSize: '18px', color: '#dc2626', fontFamily: "'DM Sans', sans-serif" },
};

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [btnHover, setBtnHover] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) { navigate('/login'); return; }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            if (!showOTP) {
                await api.post('/booking/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                // ✅ trim OTP just in case
                await api.post('/booking', { eventId: event._id, otp: otp.trim() });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                setOtp('');
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            // ✅ read both .error and .message — backend uses both
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Booking failed'
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div style={s.loadingPage}>Loading event...</div>;
    if (error && !event) return <div style={s.errorPage}>{error}</div>;

    const isSoldOut = event.availableSeats <= 0;
    const isBooked = successMsg && !showOTP;
    const seatPct = Math.round((event.availableSeats / event.totalSeats) * 100);
    const isDisabled = isSoldOut || bookingLoading || (showOTP && !otp) || isBooked;

    const btnLabel = bookingLoading ? 'Processing...'
        : isBooked ? '✓ Request Sent'
            : isSoldOut ? 'Sold Out'
                : showOTP ? 'Verify OTP & Confirm →'
                    : 'Confirm Registration →';

    return (
        <div style={s.page}>
            <div style={s.card}>
                {/* Image */}
                <div style={s.imgWrap}>
                    {event.imageUrl
                        ? <img src={event.imageUrl} alt={event.title} style={s.img} />
                        : <div style={s.imgFallback}>{event.category}</div>
                    }
                    <div style={s.categoryOverlay}>{event.category}</div>
                </div>

                {/* Body */}
                <div style={s.body}>
                    {/* Left */}
                    <div style={s.left}>
                        <h1 style={s.eventTitle}>{event.title}</h1>
                        <p style={s.eventDesc}>{event.description}</p>

                        {event.createdBy && (
                            <div style={s.orgRow}>
                                <div style={s.orgAvatar}>{event.createdBy.name?.charAt(0) || 'A'}</div>
                                <div style={s.orgInfo}>
                                    <div style={s.orgLabel}>Organized by</div>
                                    <div style={s.orgName}>{event.createdBy.name}</div>
                                </div>
                            </div>
                        )}

                        <div style={s.metaGrid}>
                            <div style={s.metaItem}>
                                <div style={s.metaIcon('#2563eb')}><FaCalendarAlt /></div>
                                <div>
                                    <div style={s.metaLabel}>Date</div>
                                    <div style={s.metaValue}>{new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                </div>
                            </div>
                            <div style={s.metaItem}>
                                <div style={s.metaIcon('#7c6af7')}><FaMapMarkerAlt /></div>
                                <div>
                                    <div style={s.metaLabel}>Location</div>
                                    <div style={s.metaValue} title={event.location}>{event.location.length > 22 ? event.location.slice(0, 22) + '…' : event.location}</div>
                                </div>
                            </div>
                            <div style={s.metaItem}>
                                <div style={s.metaIcon('#16a34a')}><FaChair /></div>
                                <div>
                                    <div style={s.metaLabel}>Seats Left</div>
                                    <div style={{ ...s.metaValue, color: event.availableSeats < 10 ? '#f59e0b' : '#111' }}>{event.availableSeats} / {event.totalSeats}</div>
                                </div>
                            </div>
                            <div style={s.metaItem}>
                                <div style={s.metaIcon('#d97706')}><FaMoneyBillWave /></div>
                                <div>
                                    <div style={s.metaLabel}>Price</div>
                                    <div style={{ ...s.metaValue, color: event.ticketPrice === 0 ? '#16a34a' : '#111' }}>{event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}</div>
                                </div>
                            </div>
                        </div>

                        <div style={s.seatsBarWrap}>
                            <div style={s.seatsBarBg}>
                                <div style={s.seatsBarFill(seatPct)} />
                            </div>
                            <div style={s.seatsLabel}>{seatPct}% seats remaining</div>
                        </div>
                    </div>

                    {/* Right — Booking Panel */}
                    <div style={s.right}>
                        <div style={s.panel}>
                            <div style={s.panelTitle}>Book Your Spot</div>

                            {/* Price hero */}
                            <div style={s.priceHero}>
                                <div style={event.ticketPrice === 0 ? s.priceFree : s.pricePaid}>
                                    {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                                </div>
                                <div style={s.priceSub}>per ticket</div>
                            </div>

                            {/* OTP */}
                            {showOTP && (
                                <div style={s.otpWrap}>
                                    <div style={s.otpHint}>
                                        <FaShieldAlt />
                                        <span>Check your email for the OTP</span>
                                    </div>
                                    <label style={s.otpLabel}>Enter 6-digit OTP</label>
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        style={s.otpInput}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        maxLength="6"
                                        onFocus={e => { e.target.style.borderColor = '#7c6af7'; e.target.style.boxShadow = '0 0 0 3px rgba(124,106,247,0.12)'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={isDisabled}
                                style={s.bookBtn(isDisabled, btnHover)}
                                onMouseEnter={() => setBtnHover(true)}
                                onMouseLeave={() => setBtnHover(false)}
                            >
                                {btnLabel}
                            </button>

                            {error && <div style={s.errorBox}>{error}</div>}
                            {successMsg && <div style={s.successBox}>{successMsg}</div>}

                            <div style={s.secureBadge}>
                                <FaShieldAlt style={{ fontSize: '11px' }} />
                                <span>Secure booking — verified by OTP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
