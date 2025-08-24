import React from "react";
import LoginForm from "./LoginForm.jsx";

export default function App() {
  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {/* onSuccess is optional; keep a no-op so the component renders */}
      <LoginForm onSuccess={() => {}} />
    </div>
  );
}
