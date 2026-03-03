import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, storage } from './firebase';
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Layout, Plus, LogOut, Settings, Star, Loader2 } from 'lucide-react';
import { extractFromPDF } from './aiService';
import { createUserProfile } from './portfolioService';
import { useTheme } from './ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { setTheme, themeId } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // 1. Upload to Firebase Storage
      const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Read file for AI
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64 = reader.result;
          
          // 3. Extract with AI
          const extractedData = await extractFromPDF(base64);
          
          // 4. Save to Firestore
          await createUserProfile(user.uid, {
            ...extractedData,
            resumeUrl: downloadURL,
            lastUpdated: new Date().toISOString()
          });
          
          setIsProcessing(false);
          alert("Portfolio generated successfully!");
        } catch (err) {
          console.error("AI Extraction Error:", err);
          setIsProcessing(false);
          alert("Failed to analyze resume. Please try again.");
        }
      };
    } catch (error) {
      console.error("Upload Error:", error);
      setIsProcessing(false);
      alert("Failed to upload resume.");
    }
  };

  const handleThemeSelect = async (selectedTheme) => {
    setTheme(selectedTheme);
    if (user) {
      await createUserProfile(user.uid, { themeId: selectedTheme });
    }
  };

  return (
    <div className="flex h-screen bg-nebula-pulse text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            GALAXIFY
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
            Menu
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/20 text-blue-300 rounded-xl border border-blue-500/30 transition-all hover:bg-blue-600/30"
          >
            <Layout className="w-5 h-5" />
            <span className="font-medium">My Portfolios</span>
          </button>
          
          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 space-y-4">
          {/* Create New Button */}
          <button 
            onClick={() => navigate('/create-portfolio')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-[0_4px_0_rgb(76,29,149)] active:shadow-none active:translate-y-[4px] transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>

          {/* Plan Info */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">Current Plan</span>
              <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600">Free</span>
            </div>
            <div className="w-full bg-gray-700 h-1.5 rounded-full mb-3">
              <div className="bg-blue-500 h-1.5 rounded-full w-1/3"></div>
            </div>
            <p className="text-xs text-gray-500 mb-3">1/3 Projects Used</p>
            
            {/* Upgrade Button */}
            <button 
              onClick={() => navigate('/pricing')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 border-b-4 border-b-white/5 active:border-b-0 active:translate-y-[4px] rounded-lg text-sm font-medium transition-all"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              Upgrade to Pro
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName || 'Creator'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">My Portfolios</h2>
              <p className="text-gray-400">Manage and customize your 3D spaces</p>
            </div>
            <div className="flex gap-3 md:hidden">
               {/* Mobile Menu Toggle Placeholder */}
               <button className="p-2 bg-white/5 rounded-lg border border-white/10">
                 <Layout className="w-5 h-5" />
               </button>
            </div>
          </header>

          {/* Existing Dashboard Content (Refactored into the main area) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Content Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. PDF Upload */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                {isProcessing && (
                  <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-blue-200 font-medium animate-pulse">Processing with AI...</p>
                  </div>
                )}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="text-9xl">📄</div>
                </div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-blue-500/20">1</span>
                  Upload Resume / CV
                </h2>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".pdf"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group/upload"
                >
                  <div className="text-4xl mb-3 group-hover/upload:scale-110 transition-transform duration-300">☁️</div>
                  <p className="text-lg text-gray-200 font-medium">Drag & drop your PDF here</p>
                  <p className="text-sm text-gray-500 mt-2">AI will extract your bio, skills, and experience automatically.</p>
                </div>
              </div>

              {/* 2. Manual Details (Placeholder) */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl opacity-75">
                 <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="bg-gray-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                  Portfolio Details
                </h2>
                 <div className="space-y-4">
                    <div className="h-10 bg-white/5 rounded-lg animate-pulse w-full"></div>
                    <div className="h-32 bg-white/5 rounded-lg animate-pulse w-full"></div>
                 </div>
              </div>
            </div>

            {/* Right Column: Theme & Preview */}
            <div className="space-y-6">
               {/* Theme Selector Placeholder */}
               <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Theme</h2>
                <div className="grid grid-cols-2 gap-3">
                  {['galaxy', 'lava', 'neon', 'forest'].map(theme => (
                    <div 
                      key={theme} 
                      onClick={() => handleThemeSelect(theme)}
                      className={`aspect-video bg-black/40 rounded-lg border flex items-center justify-center text-xs text-gray-300 cursor-pointer hover:text-white hover:shadow-lg transition-all capitalize ${
                        themeId === theme ? 'border-blue-500 shadow-blue-500/20 text-white' : 'border-white/10 hover:border-blue-500'
                      }`}
                    >
                      {theme}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Live Preview Link */}
              <div className="bg-gradient-to-br from-blue-900/40 to-violet-900/40 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 shadow-xl text-center">
                <h2 className="text-xl font-bold text-white mb-2">Your Portfolio is Live!</h2>
                <p className="text-blue-200 text-sm mb-4 truncate">galaxify.ai/portfolio/{user?.uid}</p>
                <button onClick={() => window.open(`/portfolio/${user?.uid}`, '_blank')} className="w-full py-2.5 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
                  View Live Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;