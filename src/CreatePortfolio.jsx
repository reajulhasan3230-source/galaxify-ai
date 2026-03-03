import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Layout, Palette, Wand2 } from 'lucide-react';
import { FloatingCard } from './FloatingCard'; // Ensure this import is correct

const CreatePortfolio = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedTheme, setSelectedTheme] = useState('galaxy');
  const [selectedLayout, setSelectedLayout] = useState('modern');

  const handleGenerate = () => {
    console.log('Generating portfolio...');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#030213] text-white p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          Create New Portfolio
        </h1>
        <p className="text-gray-400 mb-8">Choose how you want to build your 3D space</p>

        <div className="grid gap-8">
          {/* Step 1: Content Source */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
              Add Content
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setActiveTab('upload')}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                  activeTab === 'upload' 
                    ? 'bg-blue-600/20 border-blue-500 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Upload className="w-6 h-6" />
                <span className="font-medium">Upload PDF Resume</span>
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                  activeTab === 'manual' 
                    ? 'bg-blue-600/20 border-blue-500 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <FileText className="w-6 h-6" />
                <span className="font-medium">Manual Entry</span>
              </button>
            </div>

            <FloatingCard depth={5} className="w-full">
              <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer bg-black/20">
                {activeTab === 'upload' ? (
                  <>
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-lg font-medium mb-2">Drag & drop your resume here</p>
                    <p className="text-sm text-gray-500">Supported formats: PDF (Max 10MB)</p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-4">✍️</div>
                    <p className="text-lg font-medium mb-2">Start typing your details</p>
                    <p className="text-sm text-gray-500">We'll guide you through each section</p>
                  </>
                )}
              </div>
            </FloatingCard>
          </section>

          {/* Step 2: Theme Selection */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="bg-violet-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
              Select Theme
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Galaxy', 'Lava', 'Neon', 'Forest'].map((theme) => (
                <div
                  key={theme}
                  onClick={() => setSelectedTheme(theme.toLowerCase())}
                  className={`aspect-video rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
                    selectedTheme === theme.toLowerCase()
                      ? 'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-300 z-10">
                    {theme}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step 3: Layout Selection */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="bg-pink-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
              Select Layout
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {['Modern', 'Classic', 'Minimal'].map((layout) => (
                <button
                  key={layout}
                  onClick={() => setSelectedLayout(layout.toLowerCase())}
                  className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                    selectedLayout === layout.toLowerCase()
                      ? 'bg-pink-600/20 border-pink-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </section>

          {/* Generate Button */}
          <div className="pt-8 border-t border-white/10">
            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 hover:from-blue-500 hover:via-violet-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Generate Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;