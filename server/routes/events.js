const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/auth");
const authorize = require("../middlewares/role");
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getMyEvents } = require("../controller/eventController");

router.get("/", getEvents);
router.get("/my", protect, authorize("admin", "organizer"), getMyEvents); // 👈 BEFORE /:id
router.get("/:id", getEventById);

router.post("/", protect, authorize("admin", "organizer"), createEvent);  // 👈 only one post route

router.put("/:id", protect, authorize("admin", "organizer"), updateEvent);
router.delete("/:id", protect, authorize("admin", "organizer"), deleteEvent);

module.exports = router;