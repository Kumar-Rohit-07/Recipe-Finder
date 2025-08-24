// src/main.jsx - The CORRECT setup

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/authContext';
import { BrowserRouter } from 'react-router-dom'; // Make sure this is imported
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));

// This is correct! Now AuthProvider is inside the "router club"
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);