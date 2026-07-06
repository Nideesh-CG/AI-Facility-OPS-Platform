import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Sun, 
  CloudSun,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';

const RightPanel = () => {
  const systemHealth = [
    { name: 'HVAC Plant', status: 'Warning', count: 2, icon: Flame, color: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20' },
    { name: 'Lighting Control', status: 'Healthy', count: 0, icon: CheckCircle2, color: 'text-brand-success bg-brand-success/10 border-brand-success/20' },
    { name: 'Data Center Cooling', status: 'Warning', count: 1, icon: AlertTriangle, color: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20' },
    { name: 'Main Power Grid', status: 'Healthy', count: 0, icon: ShieldCheck, color: 'text-brand-success bg-brand-success/10 border-brand-success/20' },
    { name: 'Elevator Banks', status: 'Healthy', count: 0, icon: ShieldCheck, color: 'text-brand-success bg-brand-success/10 border-brand-success/20' }
  ];

  return (
    <aside className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
      {/* Facility Summary Card */}
      <div className="glass-panel p-5 rounded-2xl bg-brand-card/50 border border-brand-border">
        <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Facility Scores</h3>
        
        <div className="space-y-5">
          {/* Energy Score Radial Circle */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="var(--border-color)" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="var(--accent-color)" 
                  strokeWidth="5" 
                  fill="transparent" 
                  strokeDasharray={175} 
                  strokeDashoffset={175 - (175 * 92) / 100}
                  className="transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute font-semibold text-[15px] text-brand-text">92</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-brand-text">Energy Efficiency</div>
              <div className="text-[11px] text-brand-textSec">Ranked Excellent (A+)</div>
            </div>
          </div>

          {/* Sustainability Score */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-brand-text">Sustainability Index</span>
              <span className="text-brand-success">88%</span>
            </div>
            <div className="h-1.5 w-full bg-brand-bg rounded-full overflow-hidden border border-brand-border">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-brand-success rounded-full"
              />
            </div>
          </div>

          <div className="h-px bg-brand-border" />

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border">
              <div className="text-[10px] text-brand-textSec font-medium uppercase">Carbon Red.</div>
              <div className="text-sm font-bold text-brand-text mt-1 flex items-center gap-1">
                <span>12.4%</span>
                <TrendingDown className="w-3.5 h-3.5 text-brand-success" />
              </div>
            </div>
            <div className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border">
              <div className="text-[10px] text-brand-textSec font-medium uppercase">Peak Load</div>
              <div className="text-sm font-bold text-brand-text mt-1">450.5 kW</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="glass-panel p-5 rounded-2xl bg-brand-card/50 border border-brand-border relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-brand-warning/10 rounded-full blur-xl" />
        
        <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Site Weather</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudSun className="w-10 h-10 text-brand-warning" />
            <div>
              <div className="text-2xl font-bold text-brand-text">28.5°C</div>
              <div className="text-xs text-brand-textSec">Scattered Clouds</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-brand-text">Humidity: 62%</div>
            <div className="text-[10px] text-brand-textSec">Ext. Temp: Safe</div>
          </div>
        </div>
      </div>

      {/* System Health Status Checklist */}
      <div className="glass-panel p-5 rounded-2xl bg-brand-card/50 border border-brand-border">
        <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">System Health</h3>
        
        <div className="space-y-3">
          {systemHealth.map((sys, idx) => {
            const HealthIcon = sys.icon;
            return (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border bg-brand-bg/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${sys.color}`}>
                    <HealthIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-text">{sys.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {sys.count > 0 ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-danger/10 text-brand-danger border border-brand-danger/20">
                      {sys.count} Issue{sys.count > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-success/10 text-brand-success border border-brand-success/20">
                      OK
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
