import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaCalendarAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const s = {
    page: { maxWidth: '1100px', margin: '0 auto', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: '0 16px 40px' },
    loading: { textAlign: 'center', padding: '80px', fontSize: '18px', fontWeight: 600, color: '#6b7280', fontFamily: "'DM Sans', sans-serif" },

    // Profile card
    profileCard: { background: '#fff', borderRadius: '20px', padding: '32px 36px', marginBottom: '28px', border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
    avatar: { width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #0a0a0f, #374151)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, flexShrink: 0, letterSpacing: '-1px' },
    profileInfo: {},
    welcomeText: { fontSize: '26px', fontWeight: 900, color: '#0a0a0f', marginBottom: '6px', letterSpacing: '-0.5px' },
    profileMeta: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' },
    onlineDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 },
    statsRow: { marginLeft: 'auto', display: 'flex', gap: '16px', flexWrap: 'wrap' },
    statPill: (bg, color) => ({ background: bg, color, borderRadius: '12px', padding: '12px 20px', textAlign: 'center', minWidth: '80px' }),
    statNum: { fontSize: '22px', fontWeight: 900, lineHeight: 1 },
    statLbl: { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px', opacity: 0.7 },

    // Section header
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
    sectionTitle: { fontSize: '20px', fontWeight: 800, color: '#0a0a0f' },
    sectionIcon: { color: '#374151', fontSize: '18px' },

    // Empty state
    emptyCard: { background: '#fff', borderRadius: '20px', padding: '64px 24px', textAlign: 'center', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    emptyIcon: { width: '72px', height: '72px', background: '#f9fafb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px', color: '#d1d5db' },
    emptyText: { fontSize: '18px', color: '#6b7280', fontWeight: 500, marginBottom: '24px' },
    browseBtn: (hover) => ({ display: 'inline-block', background: hover ? '#1a1a2e' : '#0a0a0f', color: '#fff', fontWeight: 700, padding: '13px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', transition: 'all 0.2s', transform: hover ? 'translateY(-1px)' : 'none' }),

    // Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },

    // Booking card
    bookingCard: (hover) => ({ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', transform: hover ? 'translateY(-2px)' : 'none' }),
    cardTop: (status) => {
        const colors = { confirmed: '#0a0a0f', pending: '#92400e', cancelled: '#7f1d1d' };
        return { background: colors[status] || '#0a0a0f', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
    },
    cardEventTitle: { fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.3, flex: 1, marginRight: '10px' },
    badgesCol: { display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', flexShrink: 0 },
    statusBadge: (status) => {
        const map = { confirmed: ['rgba(74,222,128,0.2)', '#4ade80'], pending: ['rgba(251,191,36,0.2)', '#fbbf24'], cancelled: ['rgba(248,113,113,0.2)', '#f87171'] };
        const [bg, color] = map[status] || ['rgba(255,255,255,0.1)', '#fff'];
        return { background: bg, color, fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.8px', border: `1px solid ${color}40` };
    },
    payBadge: (paid) => ({ background: paid ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.08)', color: paid ? '#60a5fa' : 'rgba(255,255,255,0.5)', fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }),

    cardBody: { padding: '18px 20px', flexGrow: 1 },
    infoRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280', marginBottom: '8px' },
    infoIcon: (color) => ({ color, fontSize: '12px', flexShrink: 0 }),
    infoLabel: { fontWeight: 600, color: '#374151', marginRight: '2px' },

    deletedMsg: { color: '#dc2626', fontStyle: 'italic', fontSize: '13px', padding: '8px 0' },

    cardFooter: { padding: '12px 20px', background: '#f9fafb', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    viewLink: { color: '#0a0a0f', fontWeight: 700, fontSize: '13px', textDecoration: 'none' },
    cancelBtn: (hover) => ({ background: 'none', border: 'none', color: hover ? '#dc2626' : '#ef4444', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px', transition: 'color 0.2s', padding: 0 }),
    cancelledLabel: { width: '100%', textAlign: 'center', fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' },
};

const BookingCard = ({ booking, onCancel }) => {
    const [hover, setHover] = useState(false);
    const [cancelHover, setCancelHover] = useState(false);
    return (
        <div style={s.bookingCard(hover)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div style={s.cardTop(booking.status)}>
                <div style={s.cardEventTitle}>
                    {booking.eventId ? booking.eventId.title : 'Deleted Event'}
                </div>
                <div style={s.badgesCol}>
                    <span style={s.statusBadge(booking.status)}>{booking.status}</span>
                    {booking.status !== 'cancelled' && (
                        <span style={s.payBadge(booking.paymentStatus === 'paid')}>
                            {booking.paymentStatus.replace('_', ' ')}
                        </span>
                    )}
                </div>
            </div>

            <div style={s.cardBody}>
                {booking.eventId ? (
                    <>
                        <div style={s.infoRow}>
                            <FaCalendarAlt style={s.infoIcon('#7c6af7')} />
                            <span><span style={s.infoLabel}>Date:</span> {new Date(booking.eventId.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div style={s.infoRow}>
                            <FaMoneyBillWave style={s.infoIcon('#16a34a')} />
                            <span><span style={s.infoLabel}>Amount:</span> {booking.amount === 0 ? <span style={{ color: '#16a34a', fontWeight: 700 }}>Free</span> : `₹${booking.amount}`}</span>
                        </div>
                        <div style={s.infoRow}>
                            <FaClock style={s.infoIcon('#d97706')} />
                            <span><span style={s.infoLabel}>Requested:</span> {new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                    </>
                ) : (
                    <div style={s.deletedMsg}>Event details unavailable (deleted)</div>
                )}
            </div>

            <div style={s.cardFooter}>
                {booking.eventId && booking.status !== 'cancelled' ? (
                    <>
                        <Link to={`/events/${booking.eventId._id}`} style={s.viewLink}
                            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.target.style.textDecoration = 'none'}
                        >
                            View Event →
                        </Link>
                        <button
                            style={s.cancelBtn(cancelHover)}
                            onMouseEnter={() => setCancelHover(true)}
                            onMouseLeave={() => setCancelHover(false)}
                            onClick={() => onCancel(booking._id)}
                        >
                            <FaTimesCircle /> Cancel
                        </button>
                    </>
                ) : (
                    <div style={s.cancelledLabel}>Booking Cancelled</div>
                )}
            </div>
        </div>
    );
};

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [browseHover, setBrowseHover] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/booking/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Cancel this booking?')) {
            try { await api.delete(`/booking/${id}`); fetchBookings(); }
            catch (error) { alert(error.response?.data?.message || 'Error cancelling booking'); }
        }
    };

    if (loading) return <div style={s.loading}>Loading dashboard...</div>;

    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;

    return (
        <div style={s.page}>
            {/* Profile Card */}
            <div style={s.profileCard}>
                <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                <div style={s.profileInfo}>
                    <div style={s.welcomeText}>Welcome, {user?.name}!</div>
                    <div style={s.profileMeta}>
                        <span style={s.onlineDot} />
                        <span>{user?.email}</span>
                    </div>
                </div>
                <div style={s.statsRow}>
                    <div style={s.statPill('#f0fdf4', '#16a34a')}>
                        <div style={s.statNum}>{confirmed}</div>
                        <div style={s.statLbl}>Confirmed</div>
                    </div>
                    <div style={s.statPill('#fffbeb', '#d97706')}>
                        <div style={s.statNum}>{pending}</div>
                        <div style={s.statLbl}>Pending</div>
                    </div>
                    <div style={s.statPill('#fef2f2', '#dc2626')}>
                        <div style={s.statNum}>{cancelled}</div>
                        <div style={s.statLbl}>Cancelled</div>
                    </div>
                </div>
            </div>

            {/* Section Header */}
            <div style={s.sectionHeader}>
                <FaTicketAlt style={s.sectionIcon} />
                <h2 style={s.sectionTitle}>My Booking Requests</h2>
                <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#9ca3af' }}>{bookings.length} total</span>
            </div>

            {/* Empty State */}
            {bookings.length === 0 ? (
                <div style={s.emptyCard}>
                    <div style={s.emptyIcon}><FaTicketAlt /></div>
                    <div style={s.emptyText}>You haven't booked any events yet.</div>
                    <Link
                        to="/"
                        style={s.browseBtn(browseHover)}
                        onMouseEnter={() => setBrowseHover(true)}
                        onMouseLeave={() => setBrowseHover(false)}
                    >
                        Browse Events →
                    </Link>
                </div>
            ) : (
                <div style={s.grid}>
                    {bookings.map(booking => (
                        <BookingCard key={booking._id} booking={booking} onCancel={cancelBooking} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
