import { useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
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

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
