import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.nav-root')) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name?.charAt(0).toUpperCase() || 'U';

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin';
        if (user?.role === 'organizer') return '/organizer/dashboard';
        return '/dashboard';
    };

    const getDashboardLabel = () => {
        if (user?.role === 'admin') return 'Admin Panel';
        if (user?.role === 'organizer') return 'Organizer Dashboard';
        return 'Dashboard';
    };

    return (
        <nav className="nav-root">
            <div className="nav-inner">
                {/* ── Brand ── */}
                <Link to="/" className="nav-brand">
                    <div className="nav-brand-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                            <path d="M15 5H9a7 7 0 000 14h6a7 7 0 000-14zm-6 11a4 4 0 110-8 4 4 0 010 8zm10-4a3 3 0 01-3 3v-2a1 1 0 000-2v-2a3 3 0 013 3z" />
                        </svg>
                    </div>
                    <span className="nav-brand-name">Event<span>ora</span></span>
                </Link>

                {/* ── Hamburger (mobile only) ── */}
                <button
                    className={`nav-hamburger${menuOpen ? ' open' : ''}`}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>

                {/* ── Links Drawer ── */}
                <div className={`nav-links${menuOpen ? ' open' : ''}`}>
                    <Link to="/" className="nav-link">Events</Link>

                    {user ? (
                        <>
                            <Link to={getDashboardLink()} className="nav-link">
                                {getDashboardLabel()}
                            </Link>

                            {user.role === 'admin' && (
                                <span className="nav-badge">Admin</span>
                            )}
                            {user.role === 'organizer' && (
                                <span className="nav-badge">Organizer</span>
                            )}

                            <div className="nav-divider" />

                            {/* Avatar + name row (visible in mobile drawer too) */}
                            <div className="nav-user-row">
                                <div className="nav-avatar">{initials}</div>
                                <span className="nav-link" style={{ padding: '0', color: 'rgba(255,255,255,0.85)', cursor: 'default' }}>
                                    {user.name}
                                </span>
                            </div>

                            <button onClick={handleLogout} className="nav-pill nav-pill-ghost">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="nav-divider" />
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register-organizer" className="nav-pill nav-pill-ghost nav-hide-tablet">
                                Become Organizer
                            </Link>
                            <Link to="/register" className="nav-pill nav-pill-primary">
                                Sign Up →
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
