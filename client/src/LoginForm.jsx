import { useState } from "react";
import axios from "axios";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      onSuccess?.(data.token);
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input aria-label="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input aria-label="password" id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      {error && <div role="alert">{error}</div>}
      <button type="submit" disabled={loading}>{loading ? "Loading…" : "Login"}</button>
    </form>
  );
}
