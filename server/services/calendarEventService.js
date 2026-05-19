const supabase = require("../db/supabaseClient");

const createCalendarEvent = async (
  title,
  user_id,
  start_time,
  end_time,
  type
) => {
  return await supabase
    .from("calendar_events")
    .insert([
      {
        user_id,
        title,
        start_time,
        end_time,
        type
      }
    ])
    .select()
    .single();
};

module.exports = {
  createCalendarEvent
};
