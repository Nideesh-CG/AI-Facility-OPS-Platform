import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Key, Building2, ArrowRight, ShieldCheck, RefreshCw, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GetStarted = ({ onGetStarted, triggerToast }) => {
  const { theme, toggleTheme } = useTheme();
  const [facilityId, setFacilityId] = useState('FACILITY-HQ-METRO-01');
  const [accessKey, setAccessKey] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStage, setSyncStage] = useState(0);

  const syncStages = [
    "Establishing secure BACnet tunnel...",
    "Authorizing Energy & Maintenance sub-agents...",
    "Syncing Modbus grid metrics...",
    "Core Sync Established! Directing to console..."
  ];

  const handleStart = (e) => {
    e.preventDefault();
    if (!facilityId.trim()) {
      triggerToast("Please enter a valid Facility ID");
      return;
    }

    setIsLoading(true);
    setSyncStage(0);

    // Simulate connection sync sequence
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
    <div className="min-h-screen w-full bg-brand-bg text-brand-text flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Radial Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[65%] h-[65%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full h-16 px-6 flex items-center justify-between z-10 shrink-0 border-b border-brand-border/40 bg-brand-sec/10 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent border border-brand-accent/30 glow-accent">
            <Cpu className="w-4.5 h-4.5 fill-brand-accent/25 animate-pulse" />
          </div>
          <span className="font-bold text-sm tracking-wide text-brand-text whitespace-nowrap">
            FacilityOps <span className="text-brand-accent">AI</span>
          </span>
        </div>
        
        {/* Theme Toggle in Header */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-brand-border hover:bg-brand-border/30 text-brand-textSec hover:text-brand-text transition-colors"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-brand-border bg-brand-card/45 backdrop-blur-md shadow-2xl relative overflow-hidden text-center space-y-6"
        >
          {/* Card glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

          {/* Icon Brand */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent shadow-inner relative group">
            <Cpu className="w-7 h-7" />
            <div className="absolute inset-0 rounded-2xl border-2 border-brand-accent/30 animate-ping opacity-25 group-hover:scale-110 duration-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text leading-tight">
              Agentic FacilityOps AI
            </h1>
            <p className="text-xs text-brand-textSec leading-relaxed px-4">
              Autonomous AI orchestration and sensor telemetry modeling for enterprise Building Management Systems.
            </p>
          </div>

          {/* Form / Loading State */}
          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleStart}
                className="space-y-4 text-left"
              >
                {/* Facility Selector Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block">Target Facility ID</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-brand-textSec/60" />
                    <input 
                      type="text" 
                      required
                      value={facilityId}
                      onChange={(e) => setFacilityId(e.target.value)}
                      placeholder="e.g. FACILITY-HQ-01"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Access Key Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block">Ops Tunnel Access Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-brand-textSec/60" />
                    <input 
                      type="password" 
                      required
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      placeholder="Enter credentials key..."
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="h-px bg-brand-border/60 pt-2" />

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-accent text-white hover:bg-brand-accent/90 transition-all shadow-md shadow-brand-accent/15 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] duration-200"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="sync-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 space-y-6 flex flex-col items-center justify-center"
              >
                <div className="relative w-12 h-12 flex items-center justify-center text-brand-accent">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-brand-accent/30 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-brand-text flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-success animate-bounce" />
                    <span>Synchronizing Network Core</span>
                  </div>
                  <p className="text-[11px] text-brand-textSec font-mono max-w-[280px] mx-auto leading-normal animate-pulse h-8">
                    {syncStages[syncStage]}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-brand-textSec text-[10px] border-t border-brand-border/40 shrink-0">
        <span>© 2026 Agentic FacilityOps AI Platform • Standard Sandbox Security Protocol</span>
      </footer>
    </div>
  );
};

export default GetStarted;
