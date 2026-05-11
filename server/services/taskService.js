const supabase = require("../db/supabaseClient");

const createTask = async (
  title,
  user_id
) => {
  return await supabase
    .from("tasks")
    .insert([
      {
        title,
        user_id
      }
    ])
    .select()
    .single();
};

module.exports = {
  createTask
};
