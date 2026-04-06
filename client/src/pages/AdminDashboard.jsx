import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const s = {
    page: { maxWidth: '1280px', margin: '0 auto', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: '0 16px' },

    // Header
    header: { background: '#0a0a0f', color: '#fff', borderRadius: '20px', padding: '32px 40px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
    headerLeft: {},
    headerTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' },
    headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
    createBtn: (hover) => ({ background: hover ? '#e5e7eb' : '#fff', color: '#0a0a0f', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', transform: hover ? 'translateY(-1px)' : 'none' }),

    // Stats
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' },
    statCard: { background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    statLabel: { fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
    statValue: (color) => ({ fontSize: '32px', fontWeight: 900, color }),
    statIcon: (bg, color) => ({ width: '48px', height: '48px', borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }),

    // Form
    formCard: { background: '#fff', borderRadius: '20px', padding: '36px', marginBottom: '28px', border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    formTitle: { fontSize: '20px', fontWeight: 800, color: '#111', marginBottom: '24px' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
    formInput: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', fontFamily: 'inherit', outline: 'none', color: '#111', background: '#fafafa', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    formTextarea: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', fontFamily: 'inherit', outline: 'none', color: '#111', background: '#fafafa', boxSizing: 'border-box', height: '120px', resize: 'vertical', transition: 'border-color 0.2s' },
    formFullRow: { gridColumn: '1 / -1' },
    publishBtn: (hover) => ({ width: '100%', background: hover ? '#1a1a2e' : '#0a0a0f', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px', transition: 'all 0.2s' }),

    // Two col layout
    twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' },

    // Section
    sectionTitle: { fontSize: '20px', fontWeight: 800, color: '#111', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
    sectionBadge: (bg, color) => ({ width: '28px', height: '28px', borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }),
    listCard: { background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    listScroll: { maxHeight: '600px', overflowY: 'auto' },

    // Event item
    eventItem: (hover) => ({ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f9f9f9', background: hover ? '#fafafa' : '#fff', transition: 'background 0.15s', flexWrap: 'wrap' }),
    eventTitle: { fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '6px' },
    eventMeta: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    eventMetaItem: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6b7280', fontWeight: 500 },
    dot: (color) => ({ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }),
    deleteBtn: (hover) => ({ background: hover ? '#ef4444' : '#fef2f2', color: hover ? '#fff' : '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' }),

    // Booking item
    bookingItem: (status) => {
        const border = status === 'pending' ? '#f59e0b' : status === 'confirmed' ? '#22c55e' : '#ef4444';
        return { padding: '20px', borderBottom: '1px solid #f9f9f9', borderLeft: `4px solid ${border}` };
    },
    bookingTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' },
    bookingTitle: { fontSize: '15px', fontWeight: 700, color: '#111', lineHeight: 1.3 },
    badgesCol: { display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', flexShrink: 0 },
    statusBadge: (status) => {
        const map = { confirmed: ['#f0fdf4', '#16a34a'], cancelled: ['#fef2f2', '#dc2626'], pending: ['#fffbeb', '#d97706'] };
        const [bg, color] = map[status] || ['#f3f4f6', '#374151'];
        return { background: bg, color, fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
    },
    payBadge: (paid) => ({ background: paid ? '#eff6ff' : '#f9fafb', color: paid ? '#2563eb' : '#6b7280', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }),
    infoBox: { background: '#f9fafb', borderRadius: '10px', padding: '12px 14px', marginBottom: '12px', border: '1px solid #f0f0f0' },
    infoRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', marginBottom: '6px' },
    infoLabel: { fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', width: '52px', flexShrink: 0 },
    actionsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    approveBtn: (hover) => ({ flex: 1, minWidth: '110px', background: hover ? '#16a34a' : '#f0fdf4', color: hover ? '#fff' : '#16a34a', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '9px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }),
    greyBtn: (hover) => ({ flex: 1, minWidth: '110px', background: hover ? '#111' : '#f9fafb', color: hover ? '#fff' : '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '9px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }),
    rejectBtn: (hover) => ({ width: '72px', background: hover ? '#ef4444' : '#fef2f2', color: hover ? '#fff' : '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '9px 8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }),

    empty: { padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' },
    loading: { textAlign: 'center', padding: '80px', fontSize: '18px', fontWeight: 600, color: '#6b7280', fontFamily: "'DM Sans', sans-serif" },
};

const focusOn = (e) => { e.target.style.borderColor = '#7c6af7'; e.target.style.background = '#fff'; };
const focusOff = (e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; };

const EventItem = ({ event, onDelete }) => {
    const [hover, setHover] = useState(false);
    const [delHover, setDelHover] = useState(false);
    return (
        <li style={s.eventItem(hover)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div>
                <div style={s.eventTitle}>{event.title}</div>
                <div style={s.eventMeta}>
                    <span style={s.eventMetaItem}>
                        <span style={s.dot('#3b82f6')} />
                        {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span style={s.eventMetaItem}>
                        <span style={s.dot(event.availableSeats > 0 ? '#22c55e' : '#ef4444')} />
                        {event.availableSeats}/{event.totalSeats} seats
                    </span>
                    <span style={s.eventMetaItem}>
                        <span style={s.dot('#a78bfa')} />
                        {event.category}
                    </span>
                </div>
            </div>
            <button
                style={s.deleteBtn(delHover)}
                onMouseEnter={() => setDelHover(true)}
                onMouseLeave={() => setDelHover(false)}
                onClick={() => onDelete(event._id)}
            >✕ Delete</button>
        </li>
    );
};

const BookingItem = ({ booking, onConfirm, onCancel }) => {
    const [appHover, setAppHover] = useState(false);
    const [greyHover, setGreyHover] = useState(false);
    const [rejHover, setRejHover] = useState(false);
    return (
        <li style={s.bookingItem(booking.status)}>
            <div style={s.bookingTop}>
                <div style={s.bookingTitle}>{booking.eventId?.title || 'Deleted Event'}</div>
                <div style={s.badgesCol}>
                    <span style={s.statusBadge(booking.status)}>{booking.status}</span>
                    {booking.status !== 'cancelled' && (
                        <span style={s.payBadge(booking.paymentStatus === 'paid')}>
                            {booking.paymentStatus.replace('_', ' ')}
                        </span>
                    )}
                </div>
            </div>
            <div style={s.infoBox}>
                <div style={s.infoRow}>
                    <span style={s.infoLabel}>User</span>
                    <span style={{ fontWeight: 600 }}>{booking.userId?.name}</span>
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>({booking.userId?.email})</span>
                </div>
                <div style={s.infoRow}>
                    <span style={s.infoLabel}>Amount</span>
                    <span style={{ fontWeight: 700, color: booking.amount === 0 ? '#16a34a' : '#111' }}>
                        {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                    </span>
                </div>
                <div style={s.infoRow}>
                    <span style={s.infoLabel}>Booked</span>
                    <span>{new Date(booking.createdAt).toLocaleString()}</span>
                </div>
                {booking.eventId && (
                    <div style={{ ...s.infoRow, borderTop: '1px solid #f0f0f0', paddingTop: '8px', marginTop: '4px', marginBottom: 0 }}>
                        <span style={s.infoLabel}>Seats</span>
                        <span style={{ fontWeight: 700, color: booking.eventId.availableSeats > 0 ? '#16a34a' : '#ef4444' }}>
                            {booking.eventId.availableSeats}
                        </span>
                        <span style={{ color: '#9ca3af' }}>remaining of {booking.eventId.totalSeats}</span>
                    </div>
                )}
            </div>
            {booking.status === 'pending' && (
                <div style={s.actionsRow}>
                    <button style={s.approveBtn(appHover)} onMouseEnter={() => setAppHover(true)} onMouseLeave={() => setAppHover(false)} onClick={() => onConfirm(booking._id, 'paid')}>✓ Approve Paid</button>
                    <button style={s.greyBtn(greyHover)} onMouseEnter={() => setGreyHover(true)} onMouseLeave={() => setGreyHover(false)} onClick={() => onConfirm(booking._id, 'not_paid')}>✓ Approve Pending</button>
                    <button style={s.rejectBtn(rejHover)} onMouseEnter={() => setRejHover(true)} onMouseLeave={() => setRejHover(false)} onClick={() => onCancel(booking._id)}>✕ Reject</button>
                </div>
            )}
        </li>
    );
};

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEventForm, setShowEventForm] = useState(false);
    const [createBtnHover, setCreateBtnHover] = useState(false);
    const [publishHover, setPublishHover] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', imageUrl: '' });
    console.log("Current user in admin:", user);

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/login'); return; }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/booking/all')  // ✅ was '/booking/my'
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', imageUrl: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Delete this event?')) {
            try { await api.delete(`/events/${id}`); fetchData(); }
            catch { alert('Error deleting event'); }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try { await api.put(`/booking/${id}/confirm`, { paymentStatus }); fetchData(); }
        catch (error) { alert(error.response?.data?.message || 'Error confirming booking'); }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Reject this booking?')) {
            try { await api.delete(`/booking/${id}`); fetchData(); }
            catch { alert('Error cancelling booking'); }
        }
    };

    const totalRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0);
    const paidClients = new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    if (loading) return <div style={s.loading}>Loading admin panel...</div>;

    return (
        <div style={s.page}>
            {/* Header */}
            <div style={s.header}>
                <div style={s.headerLeft}>
                    <h1 style={s.headerTitle}>Admin Dashboard</h1>
                    <p style={s.headerSub}>Manage events and confirm bookings</p>
                </div>
                <button
                    style={s.createBtn(createBtnHover)}
                    onMouseEnter={() => setCreateBtnHover(true)}
                    onMouseLeave={() => setCreateBtnHover(false)}
                    onClick={() => setShowEventForm(!showEventForm)}
                >
                    {showEventForm ? '✕ Cancel' : '+ Create New Event'}
                </button>
            </div>

            {/* Stats */}
            <div style={s.statsGrid}>
                <div style={s.statCard}>
                    <div>
                        <div style={s.statLabel}>Total Revenue</div>
                        <div style={s.statValue('#16a34a')}>₹{totalRevenue.toLocaleString()}</div>
                    </div>
                    <div style={s.statIcon('#f0fdf4', '#16a34a')}>₹</div>
                </div>
                <div style={s.statCard}>
                    <div>
                        <div style={s.statLabel}>Paid Clients</div>
                        <div style={s.statValue('#2563eb')}>{paidClients}</div>
                    </div>
                    <div style={s.statIcon('#eff6ff', '#2563eb')}>👤</div>
                </div>
                <div style={s.statCard}>
                    <div>
                        <div style={s.statLabel}>Pending Requests</div>
                        <div style={s.statValue('#d97706')}>{pendingCount}</div>
                    </div>
                    <div style={s.statIcon('#fffbeb', '#d97706')}>⏳</div>
                </div>
            </div>

            {/* Create Event Form */}
            {showEventForm && (
                <div style={s.formCard}>
                    <div style={s.formTitle}>Create New Event</div>
                    <form onSubmit={handleCreateEvent}>
                        <div style={s.formGrid}>
                            <input required type="text" placeholder="Event Title" style={s.formInput} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} onFocus={focusOn} onBlur={focusOff} />
                            <input required type="text" placeholder="Category (e.g., Tech, Music)" style={s.formInput} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} onFocus={focusOn} onBlur={focusOff} />
                            <input required type="date" style={s.formInput} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} onFocus={focusOn} onBlur={focusOff} />
                            <input required type="text" placeholder="Location" style={s.formInput} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} onFocus={focusOn} onBlur={focusOff} />
                            <input required type="number" placeholder="Total Seats" style={s.formInput} value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} onFocus={focusOn} onBlur={focusOff} />
                            <input required type="number" placeholder="Ticket Price (0 for free)" style={s.formInput} value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} onFocus={focusOn} onBlur={focusOff} />
                            <div style={s.formFullRow}>
                                <input type="text" placeholder="Image URL (direct link to image)" style={s.formInput} value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} onFocus={focusOn} onBlur={focusOff} />
                            </div>
                            <div style={s.formFullRow}>
                                <textarea required placeholder="Event Description" style={s.formTextarea} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} onFocus={focusOn} onBlur={focusOff} />
                            </div>
                            <div style={s.formFullRow}>
                                <button type="submit" style={s.publishBtn(publishHover)} onMouseEnter={() => setPublishHover(true)} onMouseLeave={() => setPublishHover(false)}>
                                    Publish Event →
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Events + Bookings */}
            <div style={s.twoCol}>
                {/* Events */}
                <div>
                    <div style={s.sectionTitle}>
                        <span style={s.sectionBadge('#f3f4f6', '#374151')}>{events.length}</span>
                        All Events
                    </div>
                    <div style={s.listCard}>
                        <div style={s.listScroll}>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {events.length === 0
                                    ? <li style={s.empty}>No events yet.</li>
                                    : events.map(event => <EventItem key={event._id} event={event} onDelete={handleDeleteEvent} />)
                                }
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bookings */}
                <div>
                    <div style={s.sectionTitle}>
                        <span style={s.sectionBadge('#fffbeb', '#d97706')}>{bookings.length}</span>
                        Booking Requests
                    </div>
                    <div style={s.listCard}>
                        <div style={s.listScroll}>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {bookings.length === 0
                                    ? <li style={s.empty}>No bookings yet.</li>
                                    : bookings.map(booking => (
                                        <BookingItem
                                            key={booking._id}
                                            booking={booking}
                                            onConfirm={handleConfirmBooking}
                                            onCancel={handleCancelBooking}
                                        />
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


