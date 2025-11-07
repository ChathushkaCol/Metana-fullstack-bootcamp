import { useState } from "react";

const defaultGreeting = import.meta.env.VITE_DEFAULT_GREETING ?? "Hello, world!";

export default function App() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState(defaultGreeting);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <section style={{ display: "grid", gap: 12, textAlign: "center" }}>
        <h1>
          {greeting}
          {name ? `, ${name}` : ""} 👋
        </h1>

        <label>
          name:{" "}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name…"
          />
        </label>

        <label>
          greeting:{" "}
          <input
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="Hello"
          />
        </label>

        <p style={{ opacity: 0.7, fontSize: 14 }}>
          (from env: <code>{defaultGreeting}</code>)
        </p>
      </section>
    </main>
  );
}
