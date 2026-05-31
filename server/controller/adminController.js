const User = require("../models/User");
const {sendOrganizerApprovalEmail} = require("../utils/email");


// GET all pending organizer requests
exports.getPendingOrganizers = async (req, res) => {
    try {
        const pendingOrganizers = await User.find({ organizerStatus: "pending" })
            .select("-password");

        res.status(200).json(pendingOrganizers);
    } catch (error) {
        console.error("Get Pending Organizers Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// PATCH approve an organizer
exports.approveOrganizer = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                role: "organizer",
                organizerStatus: "approved"
            },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await sendOrganizerApprovalEmail(user.email, user.name);

        res.status(200).json({
            message: `${user.name} has been approved as an organizer.`,
            user
        });
    } catch (error) {
        console.error("Approve Organizer Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// PATCH reject an organizer
exports.rejectOrganizer = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { organizerStatus: "rejected" },   // role stays 'user'
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: `${user.name}'s organizer request has been rejected.`,
            user
        });
    } catch (error) {
        console.error("Reject Organizer Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// GET all approved organizers
exports.getAllOrganizers = async (req, res) => {
    try {
        const organizers = await User.find({ role: "organizer" })
            .select("-password");

        res.status(200).json(organizers);
    } catch (error) {
        console.error("Get All Organizers Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// GET all users (role = user)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" })
            .select("-password");

        res.status(200).json(users);
    } catch (error) {
        console.error("Get All Users Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};