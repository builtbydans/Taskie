import React from "react";

type AddTaskProps = {
  title: string;

  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AddTaskForm = ({ handleSubmit, handleChange, title }: AddTaskProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Add task title:
        <input type="text" value={title} onChange={handleChange} />
      </label>

      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
