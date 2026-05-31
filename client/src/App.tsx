import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/register" element={<Register />} />

        <Route path="/auth/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
