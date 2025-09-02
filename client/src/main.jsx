import "./index.css";
import "./index.css";
// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';                   // your normal app root
import LoginForm from './LoginForm';  // the form you showed

const root = ReactDOM.createRoot(document.getElementById('root'));

const path = (window.location.pathname + window.location.hash).toLowerCase();
if (path.includes('/login')) {
  // Render the login form for /login or /#/login
  root.render(<React.StrictMode><LoginForm onSuccess={() => {}} /></React.StrictMode>);
} else {
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
