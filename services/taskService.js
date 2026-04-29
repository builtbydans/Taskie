const createTask = async (title) => {
  return await supabase
    .from("tasks")
    .insert([{ title }])
    .select()
    .single();
};
