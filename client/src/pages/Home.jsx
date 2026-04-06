import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const styles = {
    page: { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f7f7f8', color: '#111' },

    // Hero
    hero: { position: 'relative', background: '#000', borderRadius: '24px', overflow: 'hidden', marginBottom: '56px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' },
    heroBg: { position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35 },
    heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 50%, transparent 100%)' },
    heroContent: { position: 'relative', zIndex: 10, padding: '80px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    heroBadge: { background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', padding: '6px 18px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block' },
    heroTitle: { fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1.5px' },
    heroTitleAccent: { background: 'linear-gradient(90deg, #d1d5db, #6b7280)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '40px', maxWidth: '600px', lineHeight: 1.7, fontWeight: 400 },
    searchWrap: { width: '100%', maxWidth: '600px', position: 'relative', display: 'flex', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: '22px', color: '#9ca3af', fontSize: '18px', pointerEvents: 'none' },
    searchInput: { width: '100%', paddingLeft: '56px', paddingRight: '24px', paddingTop: '18px', paddingBottom: '18px', borderRadius: '999px', fontSize: '16px', color: '#111', background: 'rgba(255,255,255,0.96)', border: '2px solid transparent', outline: 'none', fontFamily: 'inherit', fontWeight: 500, boxSizing: 'border-box', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },

    // Features
    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '56px' },
    featureCard: { background: '#fff', padding: '36px 28px', borderRadius: '18px', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' },
    featureIcon: { width: '60px', height: '60px', background: '#111', color: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '20px' },
    featureTitle: { fontSize: '17px', fontWeight: 700, color: '#111', marginBottom: '10px' },
    featureDesc: { fontSize: '14px', color: '#6b7280', lineHeight: 1.65 },

    // Events section
    sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' },
    sectionTitle: { fontSize: '28px', fontWeight: 800, color: '#111', letterSpacing: '-0.5px' },
    sectionCount: { fontSize: '14px', color: '#6b7280', fontWeight: 500 },

    // Loading / empty
    loading: { textAlign: 'center', padding: '80px 0', fontSize: '18px', color: '#6b7280', fontWeight: 600 },
    empty: { textAlign: 'center', padding: '80px 0', fontSize: '18px', color: '#9ca3af' },

    // Events grid
    eventsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' },
    card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', border: '1px solid #f0f0f0', transition: 'box-shadow 0.2s, transform 0.2s' },
    cardImg: { height: '200px', background: '#e5e7eb', overflow: 'hidden', position: 'relative' },
    cardImgEl: { width: '100%', height: '100%', objectFit: 'cover' },
    cardImgFallback: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e5e7eb', color: '#6b7280', fontWeight: 700, fontSize: '22px' },
    priceBadge: { position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    cardBody: { padding: '22px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
    cardCategory: { fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
    cardTitle: { fontSize: '19px', fontWeight: 700, color: '#111', marginBottom: '14px', lineHeight: 1.3 },
    cardMeta: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
    cardMetaItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' },
    cardMetaIcon: { color: '#9ca3af', flexShrink: 0 },
    progressWrap: { marginTop: 'auto' },
    progressBg: { width: '100%', background: '#e5e7eb', borderRadius: '999px', height: '6px', marginBottom: '6px' },
    progressBar: (pct) => ({ height: '6px', borderRadius: '999px', background: pct < 20 ? '#ef4444' : pct < 50 ? '#f59e0b' : '#111', width: `${pct}%`, transition: 'width 0.4s' }),
    progressLabel: { fontSize: '12px', color: '#9ca3af', marginBottom: '16px' },
    viewBtn: { display: 'block', width: '100%', textAlign: 'center', background: '#f3f4f6', color: '#111', fontWeight: 600, padding: '11px 0', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s', boxSizing: 'border-box' },

    // Footer
    footer: { marginTop: 'auto', paddingTop: '56px', paddingBottom: '32px', borderTop: '1px solid #e5e7eb', textAlign: 'center' },
    footerBrand: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' },
    footerBrandName: { fontSize: '20px', fontWeight: 700, color: '#111' },
    footerDesc: { color: '#6b7280', fontSize: '14px', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.65 },
    footerCopy: { fontSize: '12px', color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' },
};

const FeatureCard = ({ icon, title, desc }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            style={{ ...styles.featureCard, transform: hovered ? 'translateY(-4px)' : 'none', boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04)' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={styles.featureIcon}>{icon}</div>
            <div style={styles.featureTitle}>{title}</div>
            <div style={styles.featureDesc}>{desc}</div>
        </div>
    );
};

const EventCard = ({ event }) => {
    const [hovered, setHovered] = useState(false);
    const pct = Math.round((event.availableSeats / event.totalSeats) * 100);
    return (
        <div
            style={{ ...styles.card, transform: hovered ? 'translateY(-3px)' : 'none', boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={styles.cardImg}>
                {event.imageUrl
                    ? <img src={event.imageUrl} alt={event.title} style={styles.cardImgEl} />
                    : <div style={styles.cardImgFallback}>{event.category || 'Event'}</div>
                }
                <div style={styles.priceBadge}>
                    {event.ticketPrice === 0
                        ? <span style={{ color: '#16a34a' }}>FREE</span>
                        : <span style={{ color: '#111' }}>₹{event.ticketPrice}</span>
                    }
                </div>
            </div>
            <div style={styles.cardBody}>
                <div style={styles.cardCategory}>{event.category}</div>
                <div style={styles.cardTitle}>{event.title}</div>
                <div style={styles.cardMeta}>
                    <div style={styles.cardMetaItem}>
                        <FaCalendarAlt style={styles.cardMetaIcon} />
                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div style={styles.cardMetaItem}>
                        <FaMapMarkerAlt style={styles.cardMetaIcon} />
                        <span>{event.location}</span>
                    </div>
                </div>
                <div style={styles.progressWrap}>
                    <div style={styles.progressBg}>
                        <div style={styles.progressBar(pct)} />
                    </div>
                    <div style={styles.progressLabel}>{event.availableSeats} of {event.totalSeats} seats remaining</div>
                    <Link
                        to={`/events/${event._id}`}
                        style={styles.viewBtn}
                        onMouseEnter={e => e.target.style.background = '#e5e7eb'}
                        onMouseLeave={e => e.target.style.background = '#f3f4f6'}
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => { fetchEvents(); }, 400);
        return () => clearTimeout(timeoutId);
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
        <div style={styles.page}>
            {/* Hero */}
            <div style={styles.hero}>
                <div style={styles.heroBg} />
                <div style={styles.heroOverlay} />
                <div style={styles.heroContent}>
                    <span style={styles.heroBadge}>Welcome to Eventora</span>
                    <h1 style={styles.heroTitle}>
                        Find Your Next <br />
                        <span style={styles.heroTitleAccent}>Unforgettable</span> Experience
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Discover the best tech conferences, music festivals, and workshops happening near you. Secure your spot today.
                    </p>
                    <div style={styles.searchWrap}>
                        <FaSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            style={styles.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={e => e.target.style.borderColor = '#6b7280'}
                            onBlur={e => e.target.style.borderColor = 'transparent'}
                        />
                    </div>
                </div>
            </div>

            {/* Features */}
            <div style={styles.featuresGrid}>
                <FeatureCard icon={<FaRegClock />} title="Fast Booking" desc="Secure your tickets instantly with our streamlined booking infrastructure built for speed." />
                <FeatureCard icon={<FaTicketAlt />} title="Seamless Access" desc="Download tickets instantly or manage them right from your personal dashboard with ease." />
                <FeatureCard icon={<FaShieldAlt />} title="Secure Platform" desc="All transactions are protected by cutting-edge security and 2FA OTP technology." />
            </div>

            {/* Events */}
            <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Upcoming Events</h2>
                <span style={styles.sectionCount}>{events.length} results found</span>
            </div>

            {loading ? (
                <div style={styles.loading}>Loading events...</div>
            ) : events.length === 0 ? (
                <div style={styles.empty}>No events found matching your search.</div>
            ) : (
                <div style={styles.eventsGrid}>
                    {events.map(event => <EventCard key={event._id} event={event} />)}
                </div>
            )}

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerBrand}>
                    <FaTicketAlt style={{ fontSize: '22px', color: '#111' }} />
                    <span style={styles.footerBrandName}>Eventora</span>
                </div>
                <p style={styles.footerDesc}>
                    The simplest, most dynamic way to discover and host world-class events. Let's make memories together.
                </p>
                <div style={styles.footerCopy}>
                    &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
