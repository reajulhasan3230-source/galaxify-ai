import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail } from './authService';
import { createUserProfile } from './portfolioService';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { FloatingCard } from './FloatingCard';
import GalaxyBackground from './GalaxyBackground';
import SolarSystemBackground from './SolarSystemBackground';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await registerWithEmail(name, email, password);
      // Auto-assign Free plan
      await createUserProfile(user.uid, { displayName: name, email });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030213] text-white flex flex-col items-center justify-center">
      {/* Unified Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <GalaxyBackground />
        </div>
        <div className="absolute inset-0">
          <SolarSystemBackground />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        <FloatingCard depth={10}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-2 text-white">Create Account</h2>
            <p className="text-center text-gray-400 mb-8">Join the galaxy</p>

            {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" /> Register
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </FloatingCard>
      </div>
    </div>
  );
};

export default Register;