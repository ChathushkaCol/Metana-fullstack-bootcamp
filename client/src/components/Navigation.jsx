import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav style={{ background: "#eee", padding: "0.5rem" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/blogs">Blogs</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/admin-dash">Admin</Link></li>
      </ul>
    </nav>
  );
}
