import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name?.charAt(0).toUpperCase() || 'U';

    return (
        <>
            <style>{`
                .nav-root { font-family: 'DM Sans', 'Segoe UI', sans-serif; background: #0a0a0f; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 0 2rem; }
                .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; }
                .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
                .nav-brand-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #7c6af7, #a78bfa); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
                .nav-brand-name { font-weight: 700; font-size: 20px; color: white; letter-spacing: -0.3px; }
                .nav-brand-name span { color: #a78bfa; }
                .nav-links { display: flex; align-items: center; gap: 8px; }
                .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500; padding: 6px 12px; border-radius: 6px; transition: all 0.2s; }
                .nav-link:hover { color: white; background: rgba(255,255,255,0.07); }
                .nav-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; padding: 7px 16px; border-radius: 20px; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; }
                .nav-pill-ghost { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.1); }
                .nav-pill-ghost:hover { background: rgba(255,255,255,0.1); color: white; }
                .nav-pill-primary { background: #7c6af7; color: white; }
                .nav-pill-primary:hover { background: #6d5ce6; transform: translateY(-1px); }
                .nav-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.1); margin: 0 4px; }
                .nav-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #7c6af7, #c4b5fd); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: white; }
                .nav-badge { background: rgba(124,106,247,0.2); color: #a78bfa; font-size: 11px; padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(124,106,247,0.3); }
            `}</style>

            <nav className="nav-root">
                <div className="nav-inner">
                    <Link to="/" className="nav-brand">
                        <div className="nav-brand-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M15 5H9a7 7 0 000 14h6a7 7 0 000-14zm-6 11a4 4 0 110-8 4 4 0 010 8zm10-4a3 3 0 01-3 3v-2a1 1 0 000-2v-2a3 3 0 013 3z" />
                            </svg>
                        </div>
                        <span className="nav-brand-name">Event<span>ora</span></span>
                    </Link>

                    <div className="nav-links">
                        <Link to="/" className="nav-link">Events</Link>

                        {user ? (
                            <>
                                <Link
                                    to={
                                        user.role === 'admin' ? '/admin' :
                                            user.role === 'organizer' ? '/organizer/dashboard' :  // 👈 add this
                                                '/dashboard'
                                    }
                                    className="nav-link"
                                >
                                    {user.role === 'admin' ? 'Admin Panel' :
                                        user.role === 'organizer' ? 'Organizer Dashboard' :      // 👈 add this
                                            'Dashboard'}
                                </Link>

                                {user.role === 'admin' && (
                                    <span className="nav-badge">Admin</span>
                                )}
                                {user.role === 'organizer' && (                               // 👈 add this
                                    <span className="nav-badge">Organizer</span>
                                )}

                                <div className="nav-divider" />
                                <div className="nav-avatar">{initials}</div>
                                <button onClick={handleLogout} className="nav-pill nav-pill-ghost">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="nav-divider" />
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="register-organizer" className="nav-pill nav-pill-ghost">
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
        </>
    );
};

export default Navbar;