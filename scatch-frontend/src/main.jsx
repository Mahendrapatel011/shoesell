import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// --- GLOBAL STYLESHEET IMPORTS ---
import './index.css'      // Basic resets
import './App.css'        // <<< --- THIS IS THE CRUCIAL LINE WE ARE ADDING
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)