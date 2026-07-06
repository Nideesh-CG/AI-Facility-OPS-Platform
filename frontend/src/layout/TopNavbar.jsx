import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  Building2, 
  ChevronDown 
} from 'lucide-react';

const TopNavbar = ({ sidebarCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());
  const [showFacilityDropdown, setShowFacilityDropdown] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState("HQ Metro Facility 01");

  const facilities = [
    "HQ Metro Facility 01",
    "Warehouse North 02",
    "Research Campus East",
    "Austin Data Block C"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <header className="fixed top-0 right-0 h-16 glass-panel border-b border-brand-border bg-brand-sec/80 z-20 flex items-center justify-between px-6 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '72px' : '260px' }}
    >
      {/* Left Side: Facility Selector & Live Badge */}
      <div className="flex items-center gap-4">
        {/* Facility Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowFacilityDropdown(!showFacilityDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-bg/50 hover:bg-brand-border/30 text-brand-text font-medium text-sm transition-colors"
          >
            <Building2 className="w-4 h-4 text-brand-accent" />
            <span>{selectedFacility}</span>
            <ChevronDown className="w-3.5 h-3.5 text-brand-textSec" />
          </button>
          
          {showFacilityDropdown && (
            <div className="absolute top-full left-0 mt-1 w-56 rounded-lg border border-brand-border bg-brand-card shadow-lg p-1 z-50">
              {facilities.map((fac) => (
                <button
                  key={fac}
                  onClick={() => {
                    setSelectedFacility(fac);
                    setShowFacilityDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                    selectedFacility === fac 
                      ? 'bg-brand-accent/10 text-brand-accent font-semibold' 
                      : 'text-brand-textSec hover:text-brand-text hover:bg-brand-border/30'
                  }`}
                >
                  {fac}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Monitoring Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border border-brand-danger/20 bg-brand-danger/5 text-brand-danger text-[11px] font-semibold tracking-wider uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-danger opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-danger"></span>
          </span>
          Live Monitoring
        </div>
      </div>

      {/* Right Side: Clock, Search, Actions */}
      <div className="flex items-center gap-5">
        {/* Digital Clock */}
        <div className="hidden md:flex flex-col text-right font-mono select-none">
          <span className="text-[13px] font-semibold text-brand-text leading-tight">{formatTime(time)}</span>
          <span className="text-[10px] font-medium text-brand-textSec tracking-wide">{formatDate(time)}</span>
        </div>

        <div className="h-6 w-px bg-brand-border hidden md:block" />

        {/* Search Bar */}
        <div className="relative max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-textSec" />
          <input 
            type="text" 
            placeholder="Search telemetry..."
            className="w-48 lg:w-60 pl-9 pr-3 py-1.5 rounded-lg border border-brand-border bg-brand-bg/50 focus:bg-brand-bg focus:border-brand-accent text-brand-text text-sm placeholder-brand-textSec/50 focus:outline-none transition-all"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-brand-border hover:bg-brand-border/30 text-brand-textSec hover:text-brand-text transition-colors"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg border border-brand-border hover:bg-brand-border/30 text-brand-textSec hover:text-brand-text relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-danger"></span>
        </button>

        <div className="h-6 w-px bg-brand-border" />

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
            alt="Profile"
            className="w-8 h-8 rounded-lg border border-brand-border object-cover bg-brand-card"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-brand-text">Sarah Jenkins</span>
            <span className="text-[10px] text-brand-textSec font-medium">Ops Commander</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
