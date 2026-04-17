import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';
import '../styles/Home.css';

/* ── FEATURE CARD ── */
const FeatureCard = ({ icon, title, desc }) => (
    <div className="h-feature-card">
        <div className="h-feature-icon">{icon}</div>
        <div>
            <div className="h-feature-title">{title}</div>
            <div className="h-feature-desc">{desc}</div>
        </div>
    </div>
);

/* ── EVENT CARD ── */
const EventCard = ({ event }) => {
    const pct = event.totalSeats
        ? Math.round((event.availableSeats / event.totalSeats) * 100)
        : 0;

    const fillClass = pct >= 50 ? 'high' : pct >= 20 ? 'medium' : 'low';
    const isFree = !event.ticketPrice || event.ticketPrice === 0;

    return (
        <div className="h-card">
            <div className="h-card-img">
                {event.imageUrl
                    ? <img src={event.imageUrl} alt={event.title} />
                    : <div className="h-card-img-fallback">{event.category || 'Event'}</div>
                }
                <div className={`h-price-badge ${isFree ? 'free' : 'paid'}`}>
                    {isFree ? 'FREE' : `₹${event.ticketPrice}`}
                </div>
            </div>

            <div className="h-card-body">
                <div className="h-card-category">{event.category}</div>
                <div className="h-card-title">{event.title}</div>

                <div className="h-card-meta">
                    <div className="h-card-meta-item">
                        <FaCalendarAlt className="h-card-meta-icon" />
                        <span>
                            {new Date(event.date).toLocaleDateString(undefined, {
                                weekday: 'short', year: 'numeric',
                                month: 'long', day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="h-card-meta-item">
                        <FaMapMarkerAlt className="h-card-meta-icon" />
                        <span>{event.location}</span>
                    </div>
                </div>

                <div className="h-progress-wrap">
                    <div className="h-progress-bg">
                        <div className={`h-progress-fill ${fillClass}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="h-progress-label">
                        {event.availableSeats} of {event.totalSeats} seats remaining
                    </div>
                    <Link to={`/events/${event._id}`} className="h-view-btn">
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
};

/* ── HOME PAGE ── */
const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = setTimeout(fetchEvents, 400);
        return () => clearTimeout(id);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-page">

            {/* ── HERO ── */}
            <div className="h-hero">
                <div className="h-hero-bg" />
                <div className="h-hero-overlay" />
                <div className="h-hero-glow" />

                <div className="h-hero-content">
                    <span className="h-hero-badge">Welcome to Eventora</span>

                    <h1 className="h-hero-title">
                        Find Your Next
                        <span className="h-hero-title-accent">Unforgettable</span>
                        Experience
                    </h1>

                    <p className="h-hero-subtitle">
                        Discover the finest conferences, music festivals, and workshops.
                        Secure your place among extraordinary moments.
                    </p>

                    <div className="h-search-wrap">
                        <FaSearch className="h-search-icon" />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            className="h-search-input"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="h-scroll-hint">Scroll</div>
            </div>

            {/* ── FEATURES ── */}
            <div className="h-features-grid">
                <FeatureCard
                    icon={<FaRegClock />}
                    title="Instant Booking"
                    desc="Secure your tickets in seconds with our streamlined checkout — no friction, no delays."
                />
                <FeatureCard
                    icon={<FaTicketAlt />}
                    title="Seamless Access"
                    desc="Download or manage your tickets anytime from your personal dashboard."
                />
                <FeatureCard
                    icon={<FaShieldAlt />}
                    title="Verified & Secure"
                    desc="Every transaction is protected by cutting-edge encryption and OTP verification."
                />
            </div>

            {/* ── EVENTS ── */}
            <div className="h-section-header">
                <h2 className="h-section-title">Upcoming Events</h2>
                <span className="h-section-count">{events.length} results found</span>
            </div>

            {loading ? (
                <div className="h-loading">
                    <div className="h-spinner" />
                    Curating events for you...
                </div>
            ) : events.length === 0 ? (
                <div className="h-empty">
                    <div className="h-empty-icon">🎭</div>
                    No events found matching your search.
                </div>
            ) : (
                <div className="h-events-grid">
                    {events.map(event => <EventCard key={event._id} event={event} />)}
                </div>
            )}

            {/* ── FOOTER ── */}
            <footer className="h-footer">
                <div className="h-footer-brand">
                    <FaTicketAlt style={{ fontSize: '20px', color: 'var(--gold)' }} />
                    <span className="h-footer-brand-name">Eventora</span>
                </div>
                <p className="h-footer-desc">
                    The most elegant way to discover and host world-class events.
                    Let's make extraordinary memories together.
                </p>
                <div className="h-footer-copy">
                    &copy; {new Date().getFullYear()} Eventora Platform · All rights reserved
                </div>
            </footer>

        </div>
    );
};

export default Home;
