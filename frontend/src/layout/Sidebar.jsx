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
  HelpCircle,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab, onAskAIClick, onLogoutClick }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'ai-agents', label: 'AI Agents', icon: Cpu },
    { id: 'modules', label: 'Modules', icon: Layers },
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
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 h-screen border-r border-slate-800 bg-[#0F172A] text-slate-300 z-30 flex flex-col justify-between overflow-hidden shadow-xl"
    >
      {/* Header / Logo */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="h-16 flex items-center px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
              360
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-bold text-sm tracking-wide text-white whitespace-nowrap leading-tight">
                  Facility 360 <span className="text-blue-400">AI</span>
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto scrollbar-thin flex-1 max-h-[calc(100vh-230px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group ${
                    isActive 
                      ? 'text-white font-semibold bg-blue-600 shadow-md shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {!isCollapsed && (
                    <span className="text-xs font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-800 space-y-2 shrink-0 bg-[#0B132B]">
        {/* AI Assistant Button */}
        {!isCollapsed ? (
          <button 
            onClick={onAskAIClick}
            className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>
        ) : (
          <button 
            onClick={onAskAIClick}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all shadow-sm"
            title="AI Assistant"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}

        {/* User Profile Bar */}
        <div className="flex items-center justify-between p-2 rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=128&auto=format&fit=crop" 
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
            />
            {!isCollapsed && (
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[11px] font-bold text-white truncate leading-tight">Sarah Jenkins</span>
                <span className="text-[9px] text-slate-400 truncate">Admin</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={onLogoutClick}
            className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full py-1 flex items-center justify-center rounded border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
