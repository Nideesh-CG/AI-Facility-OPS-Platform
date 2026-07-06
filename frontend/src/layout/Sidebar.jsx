import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Zap, 
  Wrench, 
  Users, 
  Shield, 
  FileText, 
  Settings as SettingsIcon, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: true },
    { id: 'energy', label: 'Energy Intelligence', icon: Zap, disabled: false },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, disabled: true },
    { id: 'occupancy', label: 'Occupancy', icon: Users, disabled: true },
    { id: 'security', label: 'Security', icon: Shield, disabled: true },
    { id: 'reports', label: 'Reports', icon: FileText, disabled: false },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, disabled: false },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 h-screen glass-panel border-r border-brand-border bg-brand-sec/80 z-30 flex flex-col justify-between overflow-hidden"
    >
      {/* Header/Logo */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent border border-brand-accent/30 glow-accent shrink-0">
              <Zap className="w-5 h-5 fill-brand-accent/25" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-semibold text-base tracking-wide text-brand-text whitespace-nowrap"
              >
                FacilityOps <span className="text-brand-accent">AI</span>
              </motion.span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <div key={item.id} className="relative">
                {item.disabled ? (
                  // Disabled items
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-textSec/40 cursor-not-allowed select-none"
                    title={`${item.label} (Under Development)`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    )}
                    {!isCollapsed && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-brand-border/20 text-brand-textSec/30 font-semibold tracking-wider uppercase">
                        Lock
                      </span>
                    )}
                  </div>
                ) : (
                  // Active items
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative ${
                      isActive 
                        ? 'text-brand-accent font-semibold bg-brand-accent/10 border border-brand-accent/20' 
                        : 'text-brand-textSec hover:text-brand-text hover:bg-brand-border/30 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-brand-accent"
                      />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Toggle Button */}
      <div className="p-3 border-t border-brand-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full py-2 flex items-center justify-center rounded-lg border border-brand-border bg-brand-bg/50 hover:bg-brand-border/30 text-brand-textSec hover:text-brand-text transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
