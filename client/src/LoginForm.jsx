import { useState } from "react";

export default function LoginForm({ onSuccess = () => {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSuccess({ email });
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-3" data-e2e="login-form">
          <label htmlFor="email" className="text-sm text-slate-600">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 outline-none
                       focus:border-sky-500 focus:ring-4 focus:ring-sky-300"
          />

          <label htmlFor="password" className="text-sm text-slate-600 mt-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-10 outline-none
                         focus:border-sky-500 focus:ring-4 focus:ring-sky-300"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-2 my-auto text-slate-500 hover:text-slate-700"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 h-11 rounded-xl bg-blue-600 text-white font-medium
                       shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Create one
          </a>
        </p>
      </section>
    </div>
  );
}
