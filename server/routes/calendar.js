const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken")

const {
  getCalendarEvents,
  createCalendarEvent,
} = require("../controllers/calendarEventController");

router.get("/", authenticateToken, getCalendarEvents);
router.post("/", authenticateToken, createCalendarEvent);

module.exports = router;
