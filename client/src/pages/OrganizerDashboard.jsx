import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const OrganizerDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        totalSeats: '',
        ticketPrice: '',
        imageUrl: ''
    });

    // ================= AUTH CHECK =================
    useEffect(() => {
        if (!user || user.role !== "organizer") {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [user]);

    // ================= FETCH DATA =================
    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events/my'),              // only my events
                api.get('/booking/organizer')       // only my bookings
            ]);

            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);

        } catch (error) {
            console.error("Error fetching organizer data", error);
        } finally {
            setLoading(false);
        }
    };

    // ================= CREATE EVENT =================
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);

            setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                category: '',
                totalSeats: '',
                ticketPrice: '',
                imageUrl: ''
            });

            setShowForm(false);
            fetchData();

        } catch (error) {
            alert(error.response?.data?.message || "Error creating event");
        }
    };

    // ================= DELETE EVENT =================
    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Delete this event?")) return;

        try {
            await api.delete(`/events/${id}`);
            fetchData();
        } catch (error) {
            alert("Error deleting event");
        }
    };

    // ================= CONFIRM BOOKING =================
    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/booking/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert("Error confirming booking");
        }
    };

    // ================= CANCEL BOOKING =================
    const handleCancelBooking = async (id) => {
        if (!window.confirm("Reject this booking?")) return;

        try {
            await api.delete(`/booking/${id}`);
            fetchData();
        } catch (error) {
            alert("Error cancelling booking");
        }
    };

    // ================= STATS =================
    const totalRevenue = bookings.reduce(
        (sum, b) =>
            b.status === "confirmed" && b.paymentStatus === "paid"
                ? sum + b.amount
                : sum,
        0
    );

    const totalBookings = bookings.length;
    const totalEvents = events.length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

    return (
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                    <h1>Organizer Dashboard</h1>
                    <p>Manage your events and bookings</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "Create Event"}
                </button>
            </div>

            {/* STATS */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <div>Events: {totalEvents}</div>
                <div>Bookings: {totalBookings}</div>
                <div>Revenue: ₹{totalRevenue}</div>
                <div>Pending: {pendingBookings}</div>
            </div>

            {/* CREATE EVENT FORM */}
            {showForm && (
                <form onSubmit={handleCreateEvent} style={{ marginBottom: "30px" }}>
                    <input placeholder="Title" required value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

                    <input placeholder="Category" required value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })} />

                    <input type="date" required value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} />

                    <input placeholder="Location" required value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })} />

                    <input type="number" placeholder="Seats" required value={formData.totalSeats}
                        onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} />

                    <input type="number" placeholder="Price" value={formData.ticketPrice}
                        onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })} />

                    <textarea placeholder="Description" required value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                    <button type="submit">Publish Event</button>
                </form>
            )}

            {/* EVENTS */}
            <h2>My Events</h2>
            {events.length === 0 ? (
                <p>No events yet</p>
            ) : (
                events.map(event => (
                    <div key={event._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                        <h3>{event.title}</h3>
                        <p>{event.category} | {event.location}</p>
                        <p>{event.availableSeats}/{event.totalSeats} seats</p>
                        <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                    </div>
                ))
            )}

            {/* BOOKINGS */}
            <h2>Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings</p>
            ) : (
                bookings.map(b => (
                    <div key={b._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                        <h4>{b.eventId?.title}</h4>
                        <p>User: {b.userId?.name}</p>
                        <p>Status: {b.status}</p>

                        {b.status === "pending" && (
                            <>
                                <button onClick={() => handleConfirmBooking(b._id, "paid")}>
                                    Approve Paid
                                </button>

                                <button onClick={() => handleConfirmBooking(b._id, "not_paid")}>
                                    Approve Unpaid
                                </button>

                                <button onClick={() => handleCancelBooking(b._id)}>
                                    Reject
                                </button>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default OrganizerDashboard;