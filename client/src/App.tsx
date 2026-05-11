import './App.css'
import { useState, useEffect } from 'react'
import TaskItem from './components/TaskItem';
import type { Task } from './types/task';
import AddTaskForm from './components/AddTaskForm';

type Filter =
  | "ALL"
  | "COMPLETE"
  | "INCOMPLETE";


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/tasks')
        if (!response.ok) {
          throw new Error('Network error');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unexpected error has occured")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTasks();
  }, [])

  const handleDeleteTask = async (id: string) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(prev =>
      prev.filter(task =>
        task.id !== id
      )
    );
  };

  const handleUpdateTask = async (
    id: string,
    title: string
  ) => {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title
      })
    });

    const updatedTask = await response.json();

    setTasks(prev =>
      prev.map(task =>
        task.id === id ? updatedTask : task
      )
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreateTask(title);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  const handleCreateTask = async (title: string) => {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });

    const newTask = await response.json();
    setTasks(prev => [...prev, newTask]);
    setTitle("");
  }

  const handleCompleteTask = async (id: string, completed: boolean) => {
    const response = await fetch (`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        completed
      })
    });

    const updatedTask = await response.json();

    setTasks(prev =>
      prev.map(task =>
        task.id === id ? updatedTask : task
      )
    )
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

  return (
    <>
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
    </>
  )
}

export default App
