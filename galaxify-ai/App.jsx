import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
// import Navbar from './components/Navbar'; // Uncomment once Navbar.jsx is created
// import Footer from './components/Footer'; // Uncomment once Footer.jsx is created

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Preview from './pages/Preview';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Public / Authentication --- */}
          <Route path="/login" element={<Login />} />
          
          {/* Redirect root to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* --- Creator Dashboard --- */}
          <Route
            path="/dashboard"
            element={
              <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                {/* <Navbar /> */}
                <main className="flex-grow">
                  <Dashboard />
                </main>
                {/* <Footer /> */}
              </div>
            }
          />

          {/* --- Theme Preview --- */}
          <Route path="/preview" element={<Preview />} />

          {/* --- Dynamic Portfolio Route --- */}
          <Route path="/portfolio/:username" element={<Portfolio />} />

          {/* --- 404 Fallback --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

          {/* --- Dynamic Portfolio Route --- */}
          <Route path="/portfolio/:username" element={<Portfolio />} />

          {/* --- 404 Fallback --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;