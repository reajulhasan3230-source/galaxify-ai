import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your 3D portfolio content</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-800 p-2 rounded-lg border border-gray-700">
          <div className="flex flex-col text-right hidden md:block">
            <span className="text-sm font-bold text-white">{user?.displayName || 'Creator'}</span>
            <span className="text-xs text-gray-400">{user?.email}</span>
          </div>
          <img 
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-purple-500"
          />
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-all text-sm font-bold border border-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. PDF Upload */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="text-9xl">📄</div>
            </div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Upload Resume / CV
            </h2>
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-10 text-center hover:border-purple-500 hover:bg-gray-700/30 transition-all cursor-pointer">
              <div className="text-4xl mb-3">☁️</div>
              <p className="text-lg text-gray-200 font-medium">Drag & drop your PDF here</p>
              <p className="text-sm text-gray-500 mt-2">AI will extract your bio, skills, and experience automatically.</p>
            </div>
          </div>

          {/* 2. Manual Details (Placeholder) */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg opacity-75">
             <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Portfolio Details
            </h2>
             <div className="space-y-4">
                <div className="h-10 bg-gray-700/50 rounded animate-pulse w-full"></div>
                <div className="h-32 bg-gray-700/50 rounded animate-pulse w-full"></div>
             </div>
          </div>
        </div>

        {/* Right Column: Theme & Preview */}
        <div className="space-y-6">
           {/* Theme Selector Placeholder */}
           <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Theme</h2>
            <div className="grid grid-cols-2 gap-2">
              {['Galaxy', 'Lava', 'Neon', 'Forest'].map(theme => (
                <div key={theme} className="aspect-video bg-gray-900 rounded border border-gray-600 flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:border-purple-500">
                  {theme}
                </div>
              ))}
            </div>
          </div>
          
          {/* Live Preview Link */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 border border-indigo-500/30 shadow-lg text-center">
            <h2 className="text-xl font-bold text-white mb-2">Your Portfolio is Live!</h2>
            <p className="text-indigo-200 text-sm mb-4">galaxify.ai/portfolio/{user?.displayName?.replace(/\s+/g, '').toLowerCase() || 'username'}</p>
            <button className="w-full py-2 bg-white text-indigo-900 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
              View Live Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;