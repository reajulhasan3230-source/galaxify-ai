import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Code, Layers, Zap, Check, ArrowRight, Star, Globe, Smartphone, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import GalaxyBackground from './GalaxyBackground';
import SolarSystemBackground from './SolarSystemBackground';
import { FloatingCard } from './FloatingCard';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#030213] text-white overflow-x-hidden font-sans">
      
      {/* ===== UNIFIED 3D BACKGROUND (FIXED) ===== */}
      {/* Both star and planet layers are now merged into one fixed container */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <GalaxyBackground /> 
        </div>
        <div className="absolute inset-0">
          <SolarSystemBackground /> 
        </div>
      </div>

      {/* ===== SCROLLABLE CONTENT (RELATIVE) ===== */}
      {/* Content z-index ensures text is always on top of the 3D layer */}
      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto pt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
              Glaxify AI
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-white text-3d drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]">
              Create Your Own <br />
              AI-Generated Portfolio <br />
              in Seconds
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              Build a stunning, interactive 3D portfolio powered by AI. Upload your resume or describe yourself, and watch your galaxy come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button onClick={() => navigate('/register')} className="px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full font-bold text-lg text-white shadow-lg shadow-blue-500/50 hover:scale-110 transition-transform">
                Start for Free
              </button>
              <button onClick={() => navigate('/login')} className="px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full font-bold text-lg text-white hover:bg-white/10 transition-all">
                Login
              </button>
            </div>
          </motion.div>
        </section>

        {/* FEATURES GRID (GLASS STYLE) */}
        <section className="py-24 px-6 w-full max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI Generation", color: "bg-orange-500", desc: "Instantly convert text or PDFs into 3D environments." },
              { icon: Globe, title: "3D Universe", color: "bg-blue-500", desc: "Experience your career history through orbiting planets." },
              { icon: Smartphone, title: "Responsive", color: "bg-green-500", desc: "Optimized for mobile, tablet, and desktop views." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl hover:bg-white/10 transition-all">
                <div className={`${feature.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-blue-100/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING SECTION (MATCHING FIGMA) */}
        <section className="py-32 px-6 w-full max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-blue-200/50 mb-16">Start free, upgrade when you need more power.</p>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Free Plan */}
            <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-5xl font-bold mb-8">$0</div>
              <ul className="text-left space-y-4 mb-10 text-blue-100/60">
                <li className="flex items-center gap-3"><Check className="text-blue-400 w-5 h-5"/> 8-10 Preset themes</li>
                <li className="flex items-center gap-3"><Check className="text-blue-400 w-5 h-5"/> Glaxify subdomain</li>
                <li className="flex items-center gap-3"><Check className="text-blue-400 w-5 h-5"/> Basic portfolio builder</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 font-bold transition-all">Get Started Free</button>
            </div>
            {/* Pro Plan */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 backdrop-blur-3xl relative">
              <div className="absolute -top-4 right-8 px-4 py-1 bg-orange-500 text-xs font-black uppercase rounded-full">Popular</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-5xl font-bold mb-8">$12<span className="text-sm font-normal text-gray-400">/month</span></div>
              <ul className="text-left space-y-4 mb-10 text-blue-100/80">
                <li className="flex items-center gap-3"><Check className="text-blue-400 w-5 h-5"/> Unlimited custom themes</li>
                <li className="flex items-center gap-3"><Check className="text-blue-400 w-5 h-5"/> Full 3D animated portfolios</li>
                <li className="flex items-center gap-3"><Check className="text-blue-400 w-5 h-5"/> Code export (ZIP/HTML)</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold shadow-xl shadow-blue-500/40">Upgrade to Pro</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;