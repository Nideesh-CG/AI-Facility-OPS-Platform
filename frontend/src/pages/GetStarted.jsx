import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Building2, Database, Bot, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GetStarted = ({ onGetStarted, triggerToast }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [syncStage, setSyncStage] = useState(0);

  const syncStages = [
    "Setting up your organization profile...",
    "Connecting facility sensor endpoints...",
    "Activating autonomous AI sub-agents...",
    "Core Sync Established! Directing to console..."
  ];

  const handleStart = () => {
    setIsLoading(true);
    setSyncStage(0);

    const interval = setInterval(() => {
      setSyncStage(prev => {
        if (prev >= syncStages.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onGetStarted();
            setIsLoading(false);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0B1220] text-slate-800 dark:text-[#F8FAFC] flex flex-col justify-between transition-colors duration-300 select-none">
      
      {/* 1. Header Bar */}
      <header className="w-full h-16 px-6 sm:px-12 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-[#0B1220]/50 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          {/* Custom logo path matching reference loop shape */}
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-indigo-600 dark:text-indigo-500 fill-none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50 15 L82 72 C85 77, 81 83, 75 83 L25 83 C19 83, 15 77, 18 72 Z" strokeWidth="8" />
            <path d="M50 35 L68 68 L32 68 Z" fill="currentColor" fillOpacity="0.1" strokeWidth="4" />
          </svg>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-900 dark:text-white">OpsAgent</span>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Agentic Facility Ops AI Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">
          <HelpCircle className="w-4 h-4" />
          <span>Need help?</span>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-6xl mx-auto w-full space-y-12">
        
        {/* Loading overlay for sync */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-white/95 dark:bg-[#0B1220]/95 flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative w-14 h-14 flex items-center justify-center text-indigo-600">
                <RefreshCw className="w-10 h-10 animate-spin" />
                <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-indigo-600/30 animate-pulse" />
              </div>
              <div className="space-y-1.5 text-center">
                <div className="text-sm font-bold text-slate-800 dark:text-white">OpsAgent System Boot</div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 h-6">
                  {syncStages[syncStage]}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Hero Split Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          {/* Left Text */}
          <div className="md:col-span-6 text-left space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none m-0">
              Get started with <br />
              <span className="text-indigo-600 dark:text-indigo-400">OpsAgent</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8] leading-relaxed max-w-md pt-2">
              Set up your workspace in a few simple steps and let AI agents handle your facility operations.
            </p>
          </div>

          {/* Right Isometric SVG Diagram */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-[400px] h-[280px] relative">
              <svg viewBox="0 0 400 280" className="w-full h-full text-indigo-600/40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Central Platform Pedestal */}
                <ellipse cx="280" cy="180" rx="65" ry="32" fill="#E0DFFF" className="dark:fill-[#2A2B4E]" />
                <ellipse cx="280" cy="172" rx="65" ry="32" fill="#C5C2FF" className="dark:fill-[#1F203D]" />
                <ellipse cx="280" cy="165" rx="60" ry="29" fill="#EEEEFF" className="dark:fill-[#1A1A30]" stroke="#9F9CFC" strokeWidth="1.5" />
                <ellipse cx="280" cy="165" rx="40" ry="19" fill="#D6D3FF" className="dark:fill-[#25254A]" />

                {/* Floating Logo Ribbon on central platform */}
                <g className="animate-bounce" style={{ animationDuration: '4s' }}>
                  {/* Floating loop path */}
                  <path d="M280,105 L296,134 C298,137 296,140 292,140 L268,140 C264,140 262,137 264,134 Z" fill="none" stroke="#6366F1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M280,118 L288,132 L272,132 Z" fill="#6366F1" fillOpacity="0.2" stroke="#6366F1" strokeWidth="2.5" />
                </g>

                {/* Left Building Node */}
                <g transform="translate(190, 110)">
                  {/* Top Roof */}
                  <polygon points="30,20 60,5 30,-10 0,5" fill="#E2E8F0" className="dark:fill-slate-700" stroke="#CBD5E1" strokeWidth="0.5" />
                  {/* Left Side */}
                  <polygon points="0,5 30,20 30,55 0,40" fill="#CBD5E1" className="dark:fill-slate-800" />
                  {/* Right Side */}
                  <polygon points="30,20 60,5 60,40 30,55" fill="#94A3B8" className="dark:fill-slate-600" />
                  
                  {/* Floating Bar Chart over left building */}
                  <g transform="translate(15, -30)" className="text-indigo-500">
                    <rect x="0" y="8" width="5" height="12" fill="#818CF8" rx="1.5" />
                    <rect x="8" y="0" width="5" height="20" fill="#6366F1" rx="1.5" />
                    <rect x="16" y="12" width="5" height="8" fill="#C7D2FE" rx="1.5" />
                  </g>
                </g>

                {/* Right Back Building Node */}
                <g transform="translate(320, 70)">
                  <polygon points="25,18 50,5 25,-8 0,5" fill="#E2E8F0" className="dark:fill-slate-700" stroke="#CBD5E1" strokeWidth="0.5" />
                  <polygon points="0,5 25,18 25,50 0,37" fill="#CBD5E1" className="dark:fill-slate-800" />
                  <polygon points="25,18 50,5 50,37 25,50" fill="#94A3B8" className="dark:fill-slate-600" />

                  {/* Floating Checkmark over right back building */}
                  <g transform="translate(12, -25)">
                    <circle cx="12" cy="12" r="10" fill="#34D399" />
                    <path d="M8,12 L11,15 L16,9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>

                {/* Right Front Building Node */}
                <g transform="translate(290, 200)">
                  <polygon points="30,20 60,5 30,-10 0,5" fill="#E2E8F0" className="dark:fill-slate-700" stroke="#CBD5E1" strokeWidth="0.5" />
                  <polygon points="0,5 30,20 30,55 0,40" fill="#CBD5E1" className="dark:fill-slate-800" />
                  <polygon points="30,20 60,5 60,40 30,55" fill="#94A3B8" className="dark:fill-slate-600" />
                </g>
              </svg>
            </div>
          </div>
        </section>

        {/* 3. Steps Progress Header */}
        <section className="w-full text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 max-w-[220px]" />
            <span className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Start in 3 simple steps</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 max-w-[220px]" />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mx-auto" />

          {/* 3 Steps Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1E293B] shadow-xs relative overflow-hidden flex flex-col items-center text-center">
              <span className="absolute top-3 left-4 text-xs font-bold text-indigo-600/70 dark:text-indigo-400">1</span>
              <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-500/10 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Add your organization</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tell us about your organization and facilities.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1E293B] shadow-xs relative overflow-hidden flex flex-col items-center text-center">
              <span className="absolute top-3 left-4 text-xs font-bold text-indigo-600/70 dark:text-indigo-400">2</span>
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-500/10 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Connect your data</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Integrate your systems to bring in assets, work orders, and more.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1E293B] shadow-xs relative overflow-hidden flex flex-col items-center text-center">
              <span className="absolute top-3 left-4 text-xs font-bold text-indigo-600/70 dark:text-indigo-400">3</span>
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-500/10 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Activate AI agents</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose agents, set goals, and let OpsAgent get to work.
              </p>
            </div>

          </div>
        </section>

        {/* 4. Action Button & Sub-label */}
        <section className="flex flex-col items-center space-y-2">
          <button
            onClick={handleStart}
            className="px-8 py-3 rounded-xl font-bold bg-[#4F46E5] text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] duration-200 text-sm"
          >
            <span>Let's get started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide uppercase">
            Takes ~5 minutes
          </span>
        </section>

        {/* 5. Center Bottom Security alert */}
        <section className="w-full max-w-lg mx-auto">
          <div className="py-2.5 px-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/30 border border-indigo-100/40 dark:border-white/5 flex items-center justify-center gap-2 text-center text-[11px] text-slate-600 dark:text-slate-300">
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-indigo-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Your data is secure and never shared. You're in control at every step.</span>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-slate-400 dark:text-slate-600 text-[10px] border-t border-slate-100 dark:border-white/5 shrink-0 bg-slate-50/30 dark:bg-[#0B1220]/20">
        <span>© 2026 OpsAgent AI Platform • Privacy Policy • Terms of Service</span>
      </footer>
    </div>
  );
};

export default GetStarted;
