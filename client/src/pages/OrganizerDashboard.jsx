import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/OrganizerDashboard.css';

const OrganizerDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('events');

    const [formData, setFormData] = useState({
        title: '', description: '', date: '',
        location: '', category: '', totalSeats: '',
        ticketPrice: '', imageUrl: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'organizer') {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events/my'),
                api.get('/booking/organizer')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching organizer data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', imageUrl: '' });
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchData();
        } catch {
            alert('Error deleting event');
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/booking/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch {
            alert('Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Reject this booking?')) return;
        try {
            await api.delete(`/booking/${id}`);
            fetchData();
        } catch {
            alert('Error cancelling booking');
        }
    };

    const field = (key, e) => setFormData({ ...formData, [key]: e.target.value });

    const totalRevenue = bookings.reduce((sum, b) =>
        b.status === 'confirmed' && b.paymentStatus === 'paid' ? sum + b.amount : sum, 0);
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;

    if (loading) return (
        <div className="od-loading">
            <div className="od-spinner" />
            Loading your dashboard...
        </div>
    );

    return (
        <div className="od-root">
            <div className="od-inner">

                {/* ── HEADER ── */}
                <div className="od-header">
                    <div className="od-header-left">
                        <h1>Organizer Dashboard</h1>
                        <p>Welcome back, {user?.name} · Manage your events & bookings</p>
                    </div>
                    {activeTab === 'events' && (
                        <button
                            className={`od-btn-create ${showForm ? 'cancel' : ''}`}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? '✕ Cancel' : '+ Create Event'}
                        </button>
                    )}
                </div>

                {/* ── STATS ── */}
                <div className="od-stats">
                    <div className="od-stat">
                        <div className="od-stat-icon">🎪</div>
                        <div className="od-stat-value">{events.length}</div>
                        <div className="od-stat-label">Total Events</div>
                    </div>
                    <div className="od-stat">
                        <div className="od-stat-icon">🎟️</div>
                        <div className="od-stat-value">{bookings.length}</div>
                        <div className="od-stat-label">Total Bookings</div>
                    </div>
                    <div className="od-stat">
                        <div className="od-stat-icon">💰</div>
                        <div className="od-stat-value">₹{totalRevenue.toLocaleString()}</div>
                        <div className="od-stat-label">Revenue</div>
                    </div>
                    <div className="od-stat">
                        <div className="od-stat-icon">⏳</div>
                        <div className="od-stat-value">{pendingBookings}</div>
                        <div className="od-stat-label">Pending</div>
                    </div>
                </div>

                {/* ── TABS ── */}
                <div className="od-tabs">
                    <button
                        className={`od-tab ${activeTab === 'events' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('events'); setShowForm(false); }}
                    >
                        🎪 My Events
                        <span className="od-tab-count">{events.length}</span>
                    </button>
                    <button
                        className={`od-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        🎟️ Bookings
                        <span className="od-tab-count">{bookings.length}</span>
                        {pendingBookings > 0 && (
                            <span className="od-tab-badge">{pendingBookings}</span>
                        )}
                    </button>
                </div>

                {/* ── EVENTS TAB ── */}
                {activeTab === 'events' && (
                    <>
                        {showForm && (
                            <div className="od-form-wrap">
                                <div className="od-form-title">✦ New Event</div>
                                <form onSubmit={handleCreateEvent}>
                                    <div className="od-form-grid">
                                        <div className="od-field">
                                            <label>Event Title</label>
                                            <input placeholder="e.g. Tech Summit 2025" required
                                                value={formData.title} onChange={e => field('title', e)} />
                                        </div>
                                        <div className="od-field">
                                            <label>Category</label>
                                            <select value={formData.category} onChange={e => field('category', e)} required>
                                                <option value="">Select category</option>
                                                <option>Music</option>
                                                <option>Tech</option>
                                                <option>Sports</option>
                                                <option>Food</option>
                                                <option>Art</option>
                                                <option>Business</option>
                                                <option>Education</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="od-field">
                                            <label>Date</label>
                                            <input type="date" required
                                                value={formData.date} onChange={e => field('date', e)} />
                                        </div>
                                        <div className="od-field">
                                            <label>Location</label>
                                            <input placeholder="e.g. Delhi, India" required
                                                value={formData.location} onChange={e => field('location', e)} />
                                        </div>
                                        <div className="od-field">
                                            <label>Total Seats</label>
                                            <input type="number" placeholder="100" required
                                                value={formData.totalSeats} onChange={e => field('totalSeats', e)} />
                                        </div>
                                        <div className="od-field">
                                            <label>Ticket Price (₹)</label>
                                            <input type="number" placeholder="0 for free"
                                                value={formData.ticketPrice} onChange={e => field('ticketPrice', e)} />
                                        </div>
                                        <div className="od-field od-field-full">
                                            <label>Image URL</label>
                                            <input placeholder="https://..."
                                                value={formData.imageUrl} onChange={e => field('imageUrl', e)} />
                                        </div>
                                        <div className="od-field od-field-full">
                                            <label>Description</label>
                                            <textarea placeholder="Tell people what this event is about..." required
                                                value={formData.description} onChange={e => field('description', e)} />
                                        </div>
                                    </div>
                                    <div className="od-form-actions">
                                        <button type="submit" className="od-btn-submit">🚀 Publish Event</button>
                                        <button type="button" className="od-btn-cancel-form" onClick={() => setShowForm(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {events.length === 0 ? (
                            <div className="od-empty">
                                <div className="od-empty-icon">🎪</div>
                                No events yet. Click "Create Event" to get started!
                            </div>
                        ) : (
                            <div className="od-events-grid">
                                {events.map(event => {
                                    const filled = event.totalSeats
                                        ? Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)
                                        : 0;
                                    return (
                                        <div key={event._id} className="od-event-card">
                                            <div className="od-event-card-top">
                                                <h3>{event.title}</h3>
                                                <span className="od-tag od-tag-purple">{event.category}</span>
                                            </div>
                                            <div className="od-event-meta">
                                                <span>📍 {event.location}</span>
                                                <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span>🎟 {event.availableSeats}/{event.totalSeats} seats · ₹{event.ticketPrice || 'Free'}</span>
                                            </div>
                                            <div className="od-seats-bar">
                                                <div className="od-seats-fill" style={{ width: `${filled}%` }} />
                                            </div>
                                            <div className="od-event-actions">
                                                <button className="od-btn-delete" onClick={() => handleDeleteEvent(event._id)}>
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ── BOOKINGS TAB ── */}
                {activeTab === 'bookings' && (
                    <>
                        {bookings.length === 0 ? (
                            <div className="od-empty">
                                <div className="od-empty-icon">🎟️</div>
                                No bookings for your events yet.
                            </div>
                        ) : (
                            <div className="od-bookings-wrap">
                                <div className="od-booking-row header">
                                    <span>Event</span>
                                    <span>User</span>
                                    <span>Amount</span>
                                    <span>Status</span>
                                    <span>Actions</span>
                                </div>
                                {bookings.map(b => (
                                    <div key={b._id} className="od-booking-row">
                                        <span className="od-booking-event">{b.eventId?.title || '—'}</span>
                                        <span className="od-booking-user">{b.userId?.name || '—'}</span>
                                        <span className="od-booking-amount">₹{b.amount}</span>
                                        <span className={`od-status ${b.status}`}>
                                            {b.status === 'pending' ? '⏳' : b.status === 'confirmed' ? '✅' : '❌'} {b.status}
                                        </span>
                                        <div className="od-booking-btns">
                                            {b.status === 'pending' && (
                                                <>
                                                    <button className="od-btn-approve"
                                                        onClick={() => handleConfirmBooking(b._id, 'paid')}>
                                                        ✓ Paid
                                                    </button>
                                                    <button className="od-btn-approve"
                                                        onClick={() => handleConfirmBooking(b._id, 'not_paid')}
                                                        style={{ opacity: 0.7 }}>
                                                        ✓ Unpaid
                                                    </button>
                                                    <button className="od-btn-reject"
                                                        onClick={() => handleCancelBooking(b._id)}>
                                                        ✕
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default OrganizerDashboard;
