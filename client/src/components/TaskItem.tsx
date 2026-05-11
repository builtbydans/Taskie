import { useState } from "react";
import type {Task} from "../types/task";

type TaskItemProps = {
  task: Task;

  handleCompleteTask: (
    id: string,
    completed: boolean
  ) => Promise<void>;

  handleDeleteTask: (
    id: string
  ) => Promise<void>;

  handleUpdateTask: (
    id: string,
    title: string
  ) => Promise<void>;
};

const TaskItem = ({ handleCompleteTask, handleDeleteTask, handleUpdateTask, task }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title)

  return (
    <>
      <p>{new Date(task.created_at).toLocaleString()}</p>

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => {
          const newCompleted = !task.completed;

          handleCompleteTask(
            task.id,
            newCompleted
          );
        }}
      />

      {isEditing ? (
        <input
          value={editTitle}
          onChange={(e) =>
            setEditTitle(e.target.value)
          }
        />
      ) : (
        task.title
      )}

      <button
        onClick={() =>
          handleDeleteTask(task.id)
        }
      >
        Delete
      </button>

      <button
        onClick={async () => {
          if (isEditing) {
            await handleUpdateTask(task.id, editTitle);
            setIsEditing(false);
          } else {
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? "Save" : "Edit"}
      </button>
    </>
  )
}

export default TaskItem
