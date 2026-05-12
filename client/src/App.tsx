import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TasksPage from "./pages/tasks/TasksPage";
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/auth/register"
          element={<Register />}
        />

        <Route
          path="/auth/login"
          element={<Login />}
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
