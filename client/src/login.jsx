import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function InlineLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // no network – just show an alert so the E2E can assert something rendered
    setMsg("Submitted");
  }

  return (
    <form onSubmit={onSubmit} style={{ display:"grid", gap:"0.75rem", maxWidth:380 }}>
      <input
        id="email"
        aria-label="email"
        type="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        id="password"
        aria-label="password"
        type="password"
        value={pw}
        onChange={(e)=>setPw(e.target.value)}
        placeholder="Password"
      />
      {msg && <div id="alert" role="alert">{msg}</div>}
      <button type="submit">Login</button>
    </form>
  );
}

const root = document.getElementById("root");
createRoot(root).render(<InlineLogin />);

// signal to E2E that React mounted
document.body.setAttribute("data-e2e", "mounted");
