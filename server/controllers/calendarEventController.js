const supabase = require("../db/supabaseClient");
const calendarEventService = require("../services/calendarEventService")

const getCalendarEvents = async (req, res) => {
  const user_id = req.user.id;

  const {data, error} = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user_id);

    if (error) return res.status(500).json({ error: error.message});

    res.json(data);
}

const createCalendarEvent = async (req, res) => {
  const user_id = req.user.id;
  const { title, start_time, end_time, type } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const result = await calendarEventService.createCalendarEvent(
    title, user_id, start_time, end_time, type);

  if (result.error) {
    return res.status(500).json({
      message: result.error.message
    });
  }

  res.status(201).json(result.data);
}

module.exports = {
  getCalendarEvents,
  createCalendarEvent
};
