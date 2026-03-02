import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
// import Navbar from './components/Navbar'; // Uncomment once Navbar.jsx is created
// import Footer from './components/Footer'; // Uncomment once Footer.jsx is created

// Pages
import Login from './pages/Login'; // This will need to be created
import Dashboard from './pages/Dashboard'; // This will need to be created
import Preview from './pages/Preview';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Default Route for Testing --- */}
          {/* Redirect root to the Preview page for now. Change this to "/login" when ready. */}
          <Route path="/" element={<Navigate to="/preview" replace />} />
          
          {/* --- Public / Authentication (Commented out until Login.jsx is created) --- */}
          {/* <Route path="/login" element={<Login />} /> */}

          {/* --- Creator Dashboard (Commented out until Dashboard.jsx is created) --- */}
          {/* <Route
            path="/dashboard"
            element={
              <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                <Navbar />
                <main className="flex-grow">
                  <Dashboard />
                </main>
                <Footer />
              </div>
            }
          /> */}

          {/* --- Theme Preview --- */}
          <Route path="/preview" element={<Preview />} />

<!--
[PROMPT_SUGGESTION]Create the `src/pages/Login.jsx` component so I can enable the login route.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Create placeholder files for `Navbar.jsx`, `Footer.jsx`, and `Dashboard.jsx` to resolve the remaining imports.[/PROMPT_SUGGESTION]
