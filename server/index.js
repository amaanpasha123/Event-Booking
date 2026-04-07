const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/booking");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middlewares
app.use(cors({
    origin: "*", // allow all (safe for now, later restrict to your frontend URL)
    credentials: true,
}));

app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/booking', bookingRoutes);

// ✅ MongoDB Connection (:contentReference[oaicite:0]{index=0})
mongoose.connect(process.env.MONGODB_URI, { dbName: 'eventora' })
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});
// ✅ Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});