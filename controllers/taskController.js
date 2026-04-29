const supabase = require("../db/supabaseClient");

const getTasks = async (req, res) => {
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

const getTaskById = async (req, res) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ message: "Task not found" });

  res.json(data);
}

const createTask = async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const result = await taskService.createTask(title);

  if (result.error) {
    return handleDbError(result.error, res);
  }

  res.status(201).json(result.data);
};

const updateTask = async (req, res) => {
  const { title, completed } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ message: "Invalid title" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (completed !== undefined) updates.completed = completed;

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ message: "Task not found" });

  res.json(data);
}

const deleteTask = async (req, res) => {
  const { error } = await supabase
  .from("tasks")
  .delete()
  .eq("id", req.params.id);

  if (error) return res.status(404).json({ message: "Task not found" });

  res.status(204).send();
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
