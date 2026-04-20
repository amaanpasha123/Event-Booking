// Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const closeMenu = (e) => {
            if (!e.target.closest(".nav-root")) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const initials = user?.name?.charAt(0).toUpperCase() || "U";

    const getDashboardLink = () => {
        if (user?.role === "admin") return "/admin";
        if (user?.role === "organizer") return "/organizer/dashboard";
        return "/dashboard";
    };

    const getDashboardLabel = () => {
        if (user?.role === "admin") return "Admin Panel";
        if (user?.role === "organizer") return "Organizer Dashboard";
        return "Dashboard";
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="nav-root">
            <div className="nav-inner">

                {/* Brand */}
                <Link to="/" className="nav-brand">
                    <div className="nav-brand-icon">◉</div>
                    <span className="nav-brand-name">
                        Event<span>ora</span>
                    </span>
                </Link>

                {/* Hamburger */}
                <button
                    className={`nav-hamburger ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Links */}
                <div className={`nav-links ${menuOpen ? "open" : ""}`}>

                    <Link
                        to="/"
                        className={`nav-link ${isActive("/") ? "active-nav" : ""}`}
                    >
                        Events
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to={getDashboardLink()}
                                className="nav-link"
                            >
                                {getDashboardLabel()}
                            </Link>

                            <div className="nav-user-row">
                                <div className="nav-avatar">{initials}</div>
                                <span className="nav-username">{user.name}</span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="nav-pill nav-pill-ghost"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>

                            <Link
                                to="/register-organizer"
                                className="nav-pill nav-pill-ghost nav-hide-mobile"
                            >
                                Become Organizer
                            </Link>

                            <Link
                                to="/register"
                                className="nav-pill nav-pill-primary"
                            >
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