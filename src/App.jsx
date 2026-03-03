import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';

// Pages
import Login from './Login'; 
import Home from './Home';
import Dashboard from './Dashboard'; 
import Portfolio from './Portfolio';
import Register from './Register';
import CreatePortfolio from './CreatePortfolio';
import Pricing from './Pricing';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen flex items-center justify-center bg-black text-red-500 p-4">Error: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to Login */}
          <Route path="/" element={<Home />} />
          
          {/* Authentication Route */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-portfolio" element={<CreatePortfolio />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Public Portfolio View */}
          <Route path="/portfolio/:username" element={<Portfolio />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function AppWithBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}