import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass,
  Zap,
  Cpu,
  Layers,
  ClipboardList,
  Database,
  Activity,
  BarChart4,
  FileText,
  Bell,
  Calendar,
  Link2,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab, onAskAIClick, onLogoutClick }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'ai-agents', label: 'AI Agents', icon: Cpu },
    { id: 'modules-active', label: 'Modules (Active)', icon: Layers },
    { id: 'work-orders', label: 'Work Orders', icon: ClipboardList },
    { id: 'assets', label: 'Assets', icon: Database },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart4 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 h-screen glass-panel border-r border-brand-border bg-brand-sec/90 z-30 flex flex-col justify-between overflow-hidden"
    >
      {/* Header/Logo */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="h-16 flex items-center px-4 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent border border-brand-accent/30 glow-accent shrink-0">
              <Cpu className="w-5 h-5 fill-brand-accent/25" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-bold text-sm tracking-wide text-brand-text whitespace-nowrap leading-tight">
                  FacilityOps <span className="text-brand-accent">AI</span>
                </span>
                <span className="text-[9px] text-brand-textSec tracking-wider font-semibold uppercase">Platform</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="p-3 space-y-0.5 overflow-y-auto scrollbar-thin flex-1 max-h-[calc(100vh-270px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group ${
                    isActive 
                      ? 'text-brand-accent font-semibold bg-brand-accent/10 border border-brand-accent/20' 
                      : 'text-brand-textSec hover:text-brand-text hover:bg-brand-border/30 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110 text-brand-accent' : 'text-brand-textSec'}`} />
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && !isCollapsed && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute right-3 w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_var(--accent-color)]"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom widgets */}
      <div className="p-3 border-t border-brand-border space-y-3 shrink-0 bg-brand-sec/50">
        {/* AI Assistant Card */}
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-3 rounded-xl bg-gradient-to-br from-brand-accent/15 to-transparent border border-brand-accent/20 space-y-2 relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-brand-accent/5 blur-md" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="text-[11px] font-bold text-brand-text tracking-wide uppercase">AI Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-success"></span>
                  </span>
                  <span className="text-[9px] text-brand-success font-semibold">Online</span>
                </div>
              </div>
              <button 
                onClick={onAskAIClick}
                className="w-full py-1 text-[11px] font-bold rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors shadow-md shadow-brand-accent/15"
              >
                Ask AI
              </button>
            </motion.div>
          ) : (
            <button 
              onClick={onAskAIClick}
              className="w-full py-2.5 rounded-lg bg-brand-accent/15 border border-brand-accent/30 text-brand-accent flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all shadow-sm"
              title="Ask AI Assistant"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </AnimatePresence>

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-xl border border-brand-border bg-brand-bg/50">
          <div className="flex items-center gap-2">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=128&auto=format&fit=crop" 
              alt="Avatar"
              className="w-8 h-8 rounded-lg border border-brand-border object-cover bg-brand-card shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-xs font-bold text-brand-text truncate leading-tight">Sarah Jenkins</span>
                <span className="text-[9px] text-brand-textSec font-medium truncate">Facility Manager</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={onLogoutClick}
            className={`p-1.5 rounded-md hover:bg-brand-danger/10 hover:text-brand-danger text-brand-textSec transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full py-1.5 flex items-center justify-center rounded-lg border border-brand-border bg-brand-bg/30 hover:bg-brand-border/40 text-brand-textSec hover:text-brand-text transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
