import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { FloatingCard } from './FloatingCard';

const Pricing = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    // In a real app, this would redirect to Stripe checkout or registration with plan param
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#030213] text-white py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400">Choose the plan that fits your galaxy</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <FloatingCard depth={10}>
            <div className="p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-400 mb-8">Perfect for getting started with your 3D portfolio.</p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> 1 Basic 3D Theme (Galaxy)</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> AI Resume Parsing</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-blue-400" /> Public URL</li>
                <li className="flex items-center gap-3 text-gray-500"><X className="w-5 h-5" /> Custom Domain</li>
                <li className="flex items-center gap-3 text-gray-500"><X className="w-5 h-5" /> Remove Watermark</li>
                <li className="flex items-center gap-3 text-gray-500"><X className="w-5 h-5" /> Download Source Code</li>
              </ul>

              <button 
                onClick={() => handleSelectPlan('free')}
                className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all font-semibold"
              >
                Get Started Free
              </button>
            </div>
          </FloatingCard>

          {/* Pro Plan */}
          <FloatingCard depth={15}>
            <div className="p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-violet-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
              
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-400 mb-8">Unlock the full power of the universe.</p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-400" /> All 4+ 3D Themes (Lava, Neon, Forest)</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-400" /> AI Resume Parsing & Bio Gen</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-400" /> Custom Domain Support</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-400" /> No Watermark</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-400" /> Download React Source Code</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-violet-400" /> Priority Support</li>
              </ul>

              <button 
                onClick={() => handleSelectPlan('pro')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-violet-500/25 transition-all"
              >
                Upgrade to Pro
              </button>
            </div>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
};

export default Pricing;