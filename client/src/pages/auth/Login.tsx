import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);

      navigate("/tasks");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();
  const message = location.state?.message;

  return (
    <div>
      {message && <Card>{message}</Card>}
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit">{loading ? "Logging in..." : "Login"}</Button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
