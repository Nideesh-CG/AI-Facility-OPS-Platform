import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Cpu, Terminal, Sliders, CheckCircle, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AgentDetailsModal = ({ isOpen, onClose, agent, triggerToast }) => {
  const [priority, setPriority] = useState(agent?.diagnostics?.priority || 'high');
  const [mode, setMode] = useState('auto');

  if (!isOpen || !agent) return null;

  // Mock telemetry trend data
  const telemetryData = [
    { time: '10:00', cpu: 15, ram: 45 },
    { time: '11:00', cpu: 22, ram: 50 },
    { time: '12:00', cpu: 35, ram: 58 },
    { time: '13:00', cpu: 48, ram: 65 },
    { time: '14:00', cpu: 20, ram: 52 },
    { time: '15:00', cpu: 18, ram: 48 },
    { time: '16:00', cpu: 25, ram: 50 }
  ];

  const agentLogs = {
    energy: [
      "[18:30:11] Syncing electrical feeder sub-meter #4.",
      "[18:31:05] Calculated utility peak demand threshold. Safe limit set to 460 kW.",
      "[18:32:00] Comfort optimization: adjusted setpoints in Office Block A (+0.5C).",
      "[18:34:15] Completed hourly carbon footprint summation: 29.2 Tons."
    ],
    maintenance: [
      "[18:28:44] Audited Chiller Plant Compressor B acoustics.",
      "[18:30:02] Analyzing elevator hoist motor heat patterns (steady at 45.2C).",
      "[18:32:11] Auto-dispatched inspection work order for compressor valve seals.",
      "[18:35:18] Updated MTBF index prediction to +32% above baseline."
    ],
    occupancy: [
      "[18:22:15] Access swipe audit: 124 badge entries registered in Main Lobby.",
      "[18:25:33] Generated Sector G desk occupancy density heatmap (Avg: 64.2%).",
      "[18:30:00] Notified Energy Agent: zone meeting rooms idle, adjusting airflow.",
      "[18:34:02] Space utilization forecast finalized. Forecast confidence: 94.8%."
    ],
    security: [
      "[18:15:00] Badge authentication audit: Main Gate reader terminal nominal.",
      "[18:22:04] Video feeds evaluated (Sector C door closure: Secure).",
      "[18:28:11] Triaged false-positive badge scan alert at Entry Point C-4.",
      "[18:35:00] Zero alarms active. Access controls locking Zone E perimeter."
    ]
  }[agent.id] || ["[18:35:00] Agent initialized. Diagnostics nominal."];

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
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-2xl rounded-2xl border border-brand-border bg-brand-card p-6 shadow-2xl z-10 relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-28 h-28 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-brand-border bg-brand-bg/50 hover:bg-brand-border/80 text-brand-textSec hover:text-brand-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent shadow-inner">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text tracking-tight m-0">{agent.name} Diagnostics</h3>
            <span className="text-[10px] text-brand-textSec font-semibold uppercase tracking-wider font-mono">Module PID: {Math.floor(Math.random() * 8000) + 1000}</span>
          </div>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Side: Diagnostics and sliders */}
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1">Description</span>
              <p className="text-xs text-brand-text leading-relaxed bg-brand-bg/50 p-3 rounded-xl border border-brand-border">{agent.description}</p>
            </div>

            {/* Performance charts */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block">CPU & RAM Util (%)</span>
              <div className="h-28 border border-brand-border bg-brand-bg/30 rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryData}>
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="cpu" stroke="var(--accent-color)" fill="var(--accent-color)" fillOpacity={0.1} strokeWidth={1.5} name="CPU" />
                    <Area type="monotone" dataKey="ram" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.05} strokeWidth={1.5} name="RAM" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Parameters Adjustments */}
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-xs font-bold text-brand-text">
                <Sliders className="w-3.5 h-3.5 text-brand-accent" />
                <span>Adjust Parameters</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-brand-textSec uppercase tracking-wider block mb-1">Operational Mode</label>
                  <select 
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target.value);
                      triggerToast(`${agent.name} set to ${e.target.value} mode`);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
                  >
                    <option value="auto">Autonomous (Auto)</option>
                    <option value="semi">Semi-Autonomous</option>
                    <option value="manual">Manual Override</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-brand-textSec uppercase tracking-wider block mb-1">Sync Thread Rate</label>
                  <select 
                    defaultValue="5s"
                    onChange={(e) => triggerToast(`${agent.name} thread rate: ${e.target.value}`)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
                  >
                    <option value="1s">High Frequency (1s)</option>
                    <option value="5s">Standard (5s)</option>
                    <option value="30s">Eco-Cycle (30s)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Log console and status summary */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Status summaries */}
            <div className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border space-y-2">
              <span className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block">Agent Health Summary</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-1.5 text-xs text-brand-text font-semibold">
                  <CheckCircle className="w-4 h-4 text-brand-success" />
                  <span>State: Nominal</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-text font-semibold">
                  <Activity className="w-4 h-4 text-brand-accent" />
                  <span>Triage: Clean</span>
                </div>
              </div>
            </div>

            {/* Terminal console */}
            <div className="flex-1 flex flex-col justify-between border border-brand-border rounded-xl p-3 bg-brand-bg/80 relative min-h-[160px] md:min-h-0">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="text-[9px] text-brand-textSec uppercase tracking-wider font-bold flex items-center gap-1 font-mono">
                  <Terminal className="w-3 h-3" />
                  Telemetry Log Stream
                </div>
                <span className="text-[8px] font-mono text-brand-success bg-brand-success/10 px-1 rounded">Live</span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-[10px] text-brand-textSec space-y-1.5 pr-1 max-h-[160px] leading-relaxed select-text">
                {agentLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-brand-border/30 pb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  triggerToast(`${agent.name} parameters deployed`);
                  onClose();
                }}
                className="flex-1 py-2 text-xs font-bold rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors shadow-md shadow-brand-accent/15"
              >
                Apply Parameters
              </button>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default AgentDetailsModal;
