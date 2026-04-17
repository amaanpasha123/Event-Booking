const express = require("express");
const router = express.Router();
const {protect, admin} = require("../middlewares/auth");
const {getEvents, getEventById, createEvent,updateEvent,deleteEvent, getMyEvents} = require("../controller/eventController");
const authorize = require("../middlewares/role");


//geting home page of events...
router.get("/",getEvents);

//GET event by ID
router.get("/:id",getEventById);


//organizer creates a event...
router.post("/", protect, authorize("admin", "organizer"), createEvent);

router.get("/my", protect, authorize("admin", "organizer"), getMyEvents);


//Create Event Only Admin.....
router.post("/",protect, admin, createEvent);

//Update Event Only Admin....
router.put("/:id", protect, admin, updateEvent);

//Delete the Event only Admin...
router.delete("/:id", protect, admin, deleteEvent);

module.exports = router;

