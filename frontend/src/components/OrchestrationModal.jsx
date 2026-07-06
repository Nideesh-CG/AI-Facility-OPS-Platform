import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Wrench, Users, Shield, Cpu, Play, Terminal, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

const OrchestrationModal = ({ isOpen, onClose, triggerToast }) => {
  const [activeEdge, setActiveEdge] = useState(0);
  const [simRunning, setSimRunning] = useState(true);
  const [logs, setLogs] = useState([
    { id: 1, time: '18:40:11', sender: 'Energy Agent', text: 'Scanned HVAC electrical load profile. Consumption at 135.6kW. Carbon footprints updated.', type: 'info' },
    { id: 2, time: '18:40:13', sender: 'Energy Agent', text: 'Dispatched peak load risk trigger to Maintenance Agent.', type: 'dispatch' },
    { id: 3, time: '18:40:17', sender: 'Maintenance Agent', text: 'Checked Chiller Compressor B thermal telemetry. Status nominal. No vibrations detected.', type: 'success' },
    { id: 4, time: '18:40:22', sender: 'Occupancy Agent', text: 'Detected 64.2% desk occupancy in Sector G. Syncing comfort settings.', type: 'info' },
    { id: 5, time: '18:40:24', sender: 'Occupancy Agent', text: 'Requested HVAC optimization via Energy Agent for Sector G.', type: 'dispatch' }
  ]);

  // Simulation loop for log streams
  useEffect(() => {
    if (!isOpen || !simRunning) return;

    const messages = [
      { sender: 'Energy Agent', text: 'Completed utility peak demand forecast. Baseline error is 1.8%. Adjusting load capping.', type: 'success' },
      { sender: 'Maintenance Agent', text: 'Generated preventive ticket #WO-2041: Gasket maintenance on main chiller.', type: 'dispatch' },
      { sender: 'Occupancy Agent', text: 'Heatmap detects zero usage in conference Room C-03. Engaging Eco-mode lighting.', type: 'info' },
      { sender: 'Security Agent', text: 'Access Control registry synced. Sector F badge authentication logs audited.', type: 'success' },
      { sender: 'Security Agent', text: 'Security Agent initiated lockdown sequence simulation (Completed: Nominal).', type: 'info' },
      { sender: 'Energy Agent', text: 'Optimized HVAC VAV box dampers in Zone 3 based on Occupancy forecasting.', type: 'success' }
    ];

    const timer = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      setLogs(prev => [
        ...prev.slice(-14), // keep last 15 logs
        {
          id: Date.now(),
          time: timeStr,
          sender: randomMsg.sender,
          text: randomMsg.text,
          type: randomMsg.type
        }
      ]);

      // Move animated flow edge
      setActiveEdge(prev => (prev + 1) % 3);
    }, 2800);

    return () => clearInterval(timer);
  }, [isOpen, simRunning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-4xl rounded-2xl border border-brand-border bg-brand-card p-6 shadow-2xl z-10 relative overflow-hidden flex flex-col md:h-[620px]"
      >
        {/* Decorative Light effect */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-brand-border bg-brand-bg/50 hover:bg-brand-border/80 text-brand-textSec hover:text-brand-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent shadow-inner">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text tracking-tight m-0 flex items-center gap-2">
              Agent Orchestration Network
              <Sparkles className="w-4 h-4 text-brand-accent" />
            </h3>
            <p className="text-[11px] text-brand-textSec mt-0.5">Real-time visualization of autonomous messages and decision telemetry.</p>
          </div>
        </div>

        {/* Body content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
          
          {/* Left Panel: Graphic Flow (5/12 columns) */}
          <div className="md:col-span-6 flex flex-col justify-between border border-brand-border rounded-xl p-4 bg-brand-bg/35 relative min-h-[220px] md:min-h-0">
            
            <div className="text-[10px] text-brand-textSec uppercase tracking-wider font-bold block">
              Node Connections
            </div>

            {/* SVG Network Visualizer */}
            <div className="relative flex-1 flex items-center justify-center py-4">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Node coordinates (simulated center points) */}
                {/* Energy: (60, 45) */}
                {/* Maintenance: (280, 45) */}
                {/* Occupancy: (280, 185) */}
                {/* Security: (60, 185) */}
                
                {/* Edges */}
                <line x1="60" y1="45" x2="280" y2="45" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="280" y1="45" x2="280" y2="185" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="280" y1="185" x2="60" y2="185" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="60" y1="185" x2="60" y2="45" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />

                {/* Animated Pulsing Signal Particles */}
                {simRunning && (
                  <>
                    {activeEdge === 0 && (
                      <circle cx="0" cy="0" r="4" fill="#10B981" className="shadow">
                        <animateMotion dur="1.8s" repeatCount="indefinite" path="M60,45 L280,45" />
                      </circle>
                    )}
                    {activeEdge === 1 && (
                      <circle cx="0" cy="0" r="4" fill="#3B82F6">
                        <animateMotion dur="1.8s" repeatCount="indefinite" path="M280,45 L280,185" />
                      </circle>
                    )}
                    {activeEdge === 2 && (
                      <circle cx="0" cy="0" r="4" fill="#F59E0B">
                        <animateMotion dur="1.8s" repeatCount="indefinite" path="M280,185 L60,185" />
                      </circle>
                    )}
                  </>
                )}
              </svg>

              {/* Node Overlays */}
              <div className="absolute inset-0 grid grid-cols-2 gap-y-16 gap-x-32 p-4">
                
                {/* Energy */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-brand-card flex items-center justify-center text-emerald-500 shadow-md">
                    <Zap className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-text mt-1 font-mono">Energy.core</span>
                </div>

                {/* Maintenance */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-500 bg-brand-card flex items-center justify-center text-blue-500 shadow-md">
                    <Wrench className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-text mt-1 font-mono">Maint.disp</span>
                </div>

                {/* Security */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-purple-500 bg-brand-card flex items-center justify-center text-purple-500 shadow-md">
                    <Shield className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-text mt-1 font-mono">Sec.guard</span>
                </div>

                {/* Occupancy */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-brand-card flex items-center justify-center text-amber-500 shadow-md">
                    <Users className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-text mt-1 font-mono">Occup.sync</span>
                </div>

              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-[11px] text-brand-textSec">
                <span className={`w-2 h-2 rounded-full ${simRunning ? 'bg-brand-success animate-ping' : 'bg-brand-textSec'}`} />
                <span>Simulation: {simRunning ? "Active" : "Paused"}</span>
              </div>
              <button
                onClick={() => {
                  setSimRunning(!simRunning);
                  triggerToast(simRunning ? "Orchestration paused" : "Orchestration resumed");
                }}
                className="px-3 py-1 rounded border border-brand-border bg-brand-card hover:bg-brand-bg/50 text-[10px] font-bold text-brand-text transition-colors"
              >
                {simRunning ? "Pause Sim" : "Resume Sim"}
              </button>
            </div>

          </div>

          {/* Right Panel: Live Logs Console (7/12 columns) */}
          <div className="md:col-span-6 flex flex-col justify-between border border-brand-border rounded-xl p-4 bg-brand-bg/60 min-h-[260px] md:min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="text-[10px] text-brand-textSec uppercase tracking-wider font-bold flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                Orchestration Telemetry Stream
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[9px] font-bold text-brand-textSec hover:text-brand-text"
              >
                Clear Log
              </button>
            </div>

            {/* Scrollable logs list */}
            <div className="flex-1 overflow-y-auto font-mono text-[10.5px] space-y-2 pr-1 max-h-[360px] leading-relaxed">
              <AnimatePresence>
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-brand-textSec/40 text-center text-xs py-10">
                    Console empty. Waiting for next message cycle...
                  </div>
                ) : (
                  logs.map((log) => {
                    const color = {
                      info: 'text-brand-textSec',
                      success: 'text-emerald-500',
                      dispatch: 'text-brand-accent'
                    }[log.type];

                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2 border-b border-brand-border/40 pb-1.5"
                      >
                        <span className="text-brand-textSec/65 shrink-0 select-none">[{log.time}]</span>
                        <div className="flex-1">
                          <span className="text-brand-text font-bold mr-1 shrink-0">{log.sender}:</span>
                          <span className={color}>{log.text}</span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 bg-brand-accent/5 rounded-xl border border-brand-accent/15 flex items-start gap-2.5 mt-4 shrink-0">
              <ShieldAlert className="w-4.5 h-4.5 text-brand-accent shrink-0 mt-0.5" />
              <div className="text-[10px] text-brand-text leading-tight">
                <strong>Orchestration Rule Engaged:</strong> Core sub-agents auto-sync utility profiles with maintenance dispatches to maximize operational safety.
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default OrchestrationModal;
