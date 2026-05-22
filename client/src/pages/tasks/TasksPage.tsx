import { useState, useEffect } from 'react'
import TaskItem from '../../components/TaskItem';
import type { Task } from '../../types/task';
import AddTaskForm from '../../components/AddTaskForm';
import { apiFetch } from '../../lib/api';
import LogoutButton from '../../components/auth/LogoutButton';
import { CalendarEventCard } from '../../components/calendar/CalendarEventCard';

type Filter =
  | "ALL"
  | "COMPLETE"
  | "INCOMPLETE";


const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [tasksData, eventsData] = await Promise.all([
          apiFetch("/tasks"),
          apiFetch("/calendar")
        ]);

        setTasks(tasksData);
        setEvents(eventsData);

      } catch (err) {

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error has occurred");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateTask = async (title: string) => {
    const newTask = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ title })
    });

    setTasks(prev => [...prev, newTask]);
    setTitle("");
  }

  const handleUpdateTask = async (
      id: string,
      title: string
    ) => {
    const updatedTask = await apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title
      })
    });

    setTasks(prev =>
      prev.map(task =>
        task.id === id ? updatedTask : task
      )
    );
  };

  const handleDeleteTask = async (id: string) => {
    await apiFetch(`/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(prev =>
      prev.filter(task =>
        task.id !== id
      )
    );
  };

  const handleCompleteTask = async (id: string, completed: boolean) => {
    const completedTask = await apiFetch(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed
      })
    });

    setTasks(prev =>
      prev.map(task =>
        task.id === id ? completedTask : task
      )
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreateTask(title);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const sortedTasks = [...tasks].sort((a, b) =>
    +new Date(a.created_at) - +new Date(b.created_at)
  );

  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === 'COMPLETE') return task.completed;
    if (filter === 'INCOMPLETE') return !task.completed;
    return true;
  });

  console.log(events)

  return (
    <>
      <LogoutButton />
      <AddTaskForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        title={title}
      />

      <div style={{display: "flex", gap: "10px"}}>
        <button onClick={() => setFilter("ALL")}>All</button>
        <button onClick={() => setFilter("COMPLETE")}>Complete</button>
        <button onClick={() => setFilter("INCOMPLETE")}>Incomplete</button>
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>

            <TaskItem
              task={task}
              handleCompleteTask={handleCompleteTask}
              handleDeleteTask={handleDeleteTask}
              handleUpdateTask={handleUpdateTask}
            />

          </li>
        ))}
      </ul>

      {events.map((event) => (
        <CalendarEventCard
          key={event.id}
          eventId={event.id}
          title={event.title}
          startTime={event.start_time}
          endTime={event.end_time}
          type={event.type}
        />
      ))}
    </>
  )
}

export default TasksPage;
