const express = require("express");
const router = express.Router();
const {protect, admin} = require("../middlewares/auth");
const {getEvents, getEventById, createEvent,updateEvent,deleteEvent} = require("../controller/eventController");


//geting home page of events...
router.get("/",getEvents);

//GET event by ID
router.get("/:id",getEventById);

//Create Event Only Admin.....
router.post("/",protect, admin, createEvent);

//Update Event Only Admin....
router.put("/:id", protect, admin, updateEvent);

//Delete the Event only Admin...
router.delete("/:id", protect, admin, deleteEvent);

module.exports = router;

