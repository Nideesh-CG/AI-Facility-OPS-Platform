import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Wrench, 
  Users, 
  Shield, 
  Cpu, 
  TrendingUp, 
  PiggyBank, 
  DollarSign, 
  Activity, 
  Check, 
  MoreVertical, 
  Play, 
  Pause, 
  RefreshCw, 
  ExternalLink,
  Sliders,
  Terminal,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

// Animated Counter Helper Component
const AnimatedCounter = ({ value, suffix = "", prefix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    if (start === end) return;
    
    const duration = 1200; // ms
    const incrementTime = 20; // ms
    const steps = duration / incrementTime;
    const step = (end - start) / steps;
    
    let timer = setInterval(() => {
      start += step;
      if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <span>
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

const AIAgents = ({ triggerToast, onDetailsClick, onOrchestrationClick, onAddModuleClick }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Mock data for mini charts
  const chartData = {
    energy: [
      { day: 'M', value: 120 },
      { day: 'T', value: 140 },
      { day: 'W', value: 135 },
      { day: 'T', value: 160 },
      { day: 'F', value: 175 },
      { day: 'S', value: 190 }
    ],
    maintenance: [
      { day: 'M', value: 4 },
      { day: 'T', value: 7 },
      { day: 'W', value: 5 },
      { day: 'T', value: 8 },
      { day: 'F', value: 10 },
      { day: 'S', value: 12 }
    ],
    occupancy: [
      { day: 'M', value: 55 },
      { day: 'T', value: 60 },
      { day: 'W', value: 68 },
      { day: 'T', value: 65 },
      { day: 'F', value: 72 },
      { day: 'S', value: 78 }
    ],
    security: [
      { day: 'M', value: 2 },
      { day: 'T', value: 1 },
      { day: 'W', value: 4 },
      { day: 'T', value: 3 },
      { day: 'F', value: 1 },
      { day: 'S', value: 0 }
    ]
  };

  const kpis = [
    {
      id: 'active',
      label: "Active Modules",
      value: 4,
      unit: "",
      trend: "100% Operational",
      trendType: "good",
      icon: Cpu,
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-500"
    },
    {
      id: 'efficiency',
      label: "Avg Efficiency Gain",
      value: 24.8,
      unit: "%",
      trend: "+3.2% vs baseline",
      trendType: "good",
      icon: Activity,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-500"
    },
    {
      id: 'energy',
      label: "Energy Savings",
      value: 18420,
      unit: "USD",
      trend: "+12.5% MoM",
      trendType: "good",
      icon: Zap,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-500"
    },
    {
      id: 'cost',
      label: "Cost Savings",
      value: 32150,
      unit: "USD",
      trend: "Projected Annual",
      trendType: "good",
      icon: PiggyBank,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-500"
    }
  ];

  const agents = [
    {
      id: 'energy',
      name: "ENERGY AGENT",
      accent: "green",
      category: "sustainability",
      icon: Zap,
      status: "Active",
      description: "Monitors electricity, HVAC, lighting, water consumption and utility optimization.",
      features: [
        "Energy Monitoring",
        "HVAC Optimization",
        "Lighting Optimization",
        "Demand Forecasting"
      ],
      metrics: [
        { label: "Monthly Savings", value: "$4,850" },
        { label: "Cost Savings", value: "18.4%" },
        { label: "Forecast Accuracy", value: "98.2%" }
      ],
      chartType: "line",
      chartColor: "#10B981",
      diagnostics: { cpu: "4.2%", ram: "280MB", uptime: "14d 6h" }
    },
    {
      id: 'maintenance',
      name: "MAINTENANCE AGENT",
      accent: "blue",
      category: "maintenance",
      icon: Wrench,
      status: "Active",
      description: "Performs equipment health monitoring, predictive maintenance, and automatic work order dispatching.",
      features: [
        "Equipment Health",
        "Predictive Maintenance",
        "Work Order Generation",
        "Downtime Reduction"
      ],
      metrics: [
        { label: "MTBF Improvement", value: "+32%" },
        { label: "Work Orders Closed", value: "145" },
        { label: "Downtime Reduced", value: "40.5%" }
      ],
      chartType: "bar",
      chartColor: "#3B82F6",
      diagnostics: { cpu: "6.8%", ram: "320MB", uptime: "8d 12h" }
    },
    {
      id: 'occupancy',
      name: "OCCUPANCY AGENT",
      accent: "orange",
      category: "operations",
      icon: Users,
      status: "Active",
      description: "Optimizes office spaces, meeting rooms, and common areas by detecting occupancy patterns and heatmaps.",
      features: [
        "Space Utilization",
        "Heatmaps",
        "Workspace Optimization",
        "Usage Forecasting"
      ],
      metrics: [
        { label: "Avg Utilization", value: "64.2%" },
        { label: "Space Optimization", value: "+15%" },
        { label: "Forecast Accuracy", value: "94.8%" }
      ],
      chartType: "area",
      chartColor: "#F59E0B",
      diagnostics: { cpu: "3.5%", ram: "210MB", uptime: "21d 4h" }
    },
    {
      id: 'security',
      name: "SECURITY AGENT",
      accent: "purple",
      category: "security",
      icon: Shield,
      status: "Active",
      description: "Integrates access control, real-time threat detection, security alert triage, and video analytics.",
      features: [
        "Access Control",
        "Threat Detection",
        "Incident Alerts",
        "Video Analytics"
      ],
      metrics: [
        { label: "Security Events", value: "1,204" },
        { label: "Threat Detection Rate", value: "99.9%" },
        { label: "Incidents Resolved", value: "100%" }
      ],
      chartType: "line",
      chartColor: "#8B5CF6",
      diagnostics: { cpu: "8.1%", ram: "480MB", uptime: "5d 1h" }
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Modules' },
    { id: 'operations', label: 'Operations' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'security', label: 'Security' }
  ];

  const filteredAgents = selectedTab === 'all' 
    ? agents 
    : agents.filter(a => a.category === selectedTab || (selectedTab === 'operations' && (a.id === 'occupancy' || a.id === 'energy')));

  const handleMenuAction = (agentName, action) => {
    setActiveMenuId(null);
    triggerToast(`${action} command sent to ${agentName}`);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      {/* Main Page Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text tracking-tight m-0 flex items-center gap-2">
            AI Agent Modules
            <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" />
          </h1>
          <p className="text-xs text-brand-textSec mt-1">Autonomous AI Agents working together to optimize facility operations.</p>
        </div>
        <button 
          onClick={onAddModuleClick}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-accent text-white hover:bg-brand-accent/90 transition-all shadow-md shadow-brand-accent/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 duration-200"
        >
          Add New Module
        </button>
      </div>

      {/* Summary KPI Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-panel p-5 rounded-2xl bg-brand-card/35 border border-brand-border flex items-center justify-between relative overflow-hidden"
            >
              {/* Highlight Background Glow */}
              <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full bg-gradient-to-br ${kpi.color} blur-2xl opacity-40`} />
              
              <div className="space-y-2 z-10">
                <span className="text-xs font-semibold text-brand-textSec uppercase tracking-wider">{kpi.label}</span>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold text-brand-text tracking-tight">
                    <AnimatedCounter 
                      value={kpi.value} 
                      prefix={kpi.id === 'energy' || kpi.id === 'cost' ? "$" : ""} 
                      suffix={kpi.id === 'efficiency' ? "%" : ""}
                      decimals={kpi.id === 'efficiency' ? 1 : 0}
                    />
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-success" />
                  <span className="text-[10px] font-semibold text-brand-success">{kpi.trend}</span>
                </div>
              </div>

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} border flex items-center justify-center text-brand-text z-10 shadow-sm`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Filter Tabs Section */}
      <section className="border-b border-brand-border flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`relative px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                  isSelected ? 'text-brand-accent' : 'text-brand-textSec hover:text-brand-text hover:bg-brand-border/20'
                }`}
              >
                <span>{tab.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activeFilterTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full shadow-[0_-2px_6px_var(--accent-color)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="text-[10px] text-brand-textSec font-bold uppercase tracking-wider hidden sm:block">
          Active Modules: {filteredAgents.length} / {agents.length}
        </div>
      </section>

      {/* Module Cards Grid */}
      <section className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAgents.map((agent, index) => {
            const Icon = agent.icon;
            
            // Resolve accent colors dynamically
            const accentClasses = {
              green: {
                badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
                gradient: "from-emerald-500/5 to-transparent",
                pulse: "bg-emerald-500"
              },
              blue: {
                badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                iconBg: "bg-blue-500/10 text-blue-500 border-blue-500/25",
                gradient: "from-blue-500/5 to-transparent",
                pulse: "bg-blue-500"
              },
              orange: {
                badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/25",
                gradient: "from-amber-500/5 to-transparent",
                pulse: "bg-amber-500"
              },
              purple: {
                badge: "bg-purple-500/10 text-purple-500 border-purple-500/20",
                iconBg: "bg-purple-500/10 text-purple-500 border-purple-500/25",
                gradient: "from-purple-500/5 to-transparent",
                pulse: "bg-purple-500"
              }
            }[agent.accent];

            return (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="glass-panel rounded-2xl bg-brand-card/30 border border-brand-border overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 hover:shadow-lg hover:bg-brand-card/45 duration-300 relative group"
              >
                {/* Accent Background Gradient */}
                <div className={`absolute top-0 left-0 w-60 h-full bg-gradient-to-r ${accentClasses.gradient} pointer-events-none`} />

                {/* Left Section (6/12 Columns on lg) */}
                <div className="lg:col-span-6 space-y-4 flex flex-col justify-between z-10">
                  <div className="space-y-3">
                    {/* Title and Badges */}
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-inner ${accentClasses.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-brand-text tracking-tight m-0">{agent.name}</h2>
                        <span className="text-[10px] text-brand-textSec font-semibold uppercase tracking-wider">{agent.category} module</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${accentClasses.badge} ml-auto sm:ml-4`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accentClasses.pulse}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${accentClasses.pulse}`}></span>
                        </span>
                        {agent.status}
                      </span>
                    </div>

                    {/* Agent Description */}
                    <p className="text-xs text-brand-textSec leading-relaxed pr-4">
                      {agent.description}
                    </p>

                    {/* Features Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {agent.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-brand-text font-medium select-none">
                          <div className={`w-4 h-4 rounded-full border border-brand-border ${accentClasses.iconBg} flex items-center justify-center`}>
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Left Bottom: Live Telemetry Spark diagnostics */}
                  <div className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-brand-textSec font-mono mt-4">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-brand-textSec/70" />
                      CPU: <strong className="text-brand-text">{agent.diagnostics.cpu}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-brand-textSec/70" />
                      RAM: <strong className="text-brand-text">{agent.diagnostics.ram}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-brand-textSec/70" />
                      Uptime: <strong className="text-brand-text">{agent.diagnostics.uptime}</strong>
                    </span>
                  </div>
                </div>

                {/* Right Section (6/12 Columns on lg) */}
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-5 z-10 border-t lg:border-t-0 lg:border-l border-brand-border pt-6 lg:pt-0 lg:pl-6">
                  {/* Metrics and Numbers (4/12 columns on sm right side) */}
                  <div className="sm:col-span-5 space-y-4 flex flex-col justify-center">
                    {agent.metrics.map((metric, i) => (
                      <div key={i} className="space-y-0.5">
                        <span className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider">{metric.label}</span>
                        <div className="text-lg font-bold text-brand-text tracking-tight">{metric.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Mini-Chart Panel (7/12 columns on sm right side) */}
                  <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
                    {/* Responsive Container for Recharts */}
                    <div className="h-28 w-full border border-brand-border bg-brand-bg/40 rounded-xl p-2 relative overflow-hidden">
                      <ResponsiveContainer width="100%" height="100%">
                        {agent.chartType === 'line' ? (
                          <LineChart data={chartData[agent.id]}>
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={agent.chartColor} 
                              strokeWidth={2} 
                              dot={{ r: 2 }} 
                              activeDot={{ r: 4 }} 
                              isAnimationActive={true}
                            />
                          </LineChart>
                        ) : agent.chartType === 'bar' ? (
                          <BarChart data={chartData[agent.id]}>
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                            <Bar 
                              dataKey="value" 
                              fill={agent.chartColor} 
                              radius={[4, 4, 0, 0]} 
                              isAnimationActive={true}
                            />
                          </BarChart>
                        ) : (
                          <AreaChart data={chartData[agent.id]}>
                            <defs>
                              <linearGradient id={`grad-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={agent.chartColor} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={agent.chartColor} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke={agent.chartColor} 
                              fillOpacity={1} 
                              fill={`url(#grad-${agent.id})`} 
                              strokeWidth={2}
                              isAnimationActive={true}
                            />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                      <div className="absolute top-2 right-2 text-[9px] font-mono text-brand-textSec bg-brand-card/75 border border-brand-border px-1 py-0.5 rounded leading-none">
                        Telemetry (Live)
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onDetailsClick(agent)}
                        className="flex-1 py-2 text-xs font-bold rounded-lg border border-brand-border hover:border-brand-accent/30 text-brand-text hover:text-brand-accent bg-brand-bg/20 hover:bg-brand-accent/5 transition-all flex items-center justify-center gap-1 group/btn"
                      >
                        View Details
                        <ExternalLink className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                      
                      {/* Three Dot Action Dropdown Trigger */}
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === agent.id ? null : agent.id)}
                          className="p-2.5 rounded-lg border border-brand-border bg-brand-bg/20 hover:bg-brand-border/40 text-brand-textSec hover:text-brand-text transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        
                        {activeMenuId === agent.id && (
                          <div className="absolute bottom-full right-0 mb-1.5 w-44 rounded-xl border border-brand-border bg-brand-card shadow-lg p-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                            <button 
                              onClick={() => handleMenuAction(agent.name, "Restart")}
                              className="w-full text-left px-3 py-1.5 text-xs rounded-md text-brand-text hover:bg-brand-border/30 flex items-center gap-2"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-brand-textSec" />
                              Restart Module
                            </button>
                            <button 
                              onClick={() => handleMenuAction(agent.name, "Pause")}
                              className="w-full text-left px-3 py-1.5 text-xs rounded-md text-brand-warning hover:bg-brand-border/30 flex items-center gap-2"
                            >
                              <Pause className="w-3.5 h-3.5 text-brand-warning" />
                              Pause Agent
                            </button>
                            <button 
                              onClick={() => handleMenuAction(agent.name, "Configure")}
                              className="w-full text-left px-3 py-1.5 text-xs rounded-md text-brand-text hover:bg-brand-border/30 flex items-center gap-2"
                            >
                              <Sliders className="w-3.5 h-3.5 text-brand-textSec" />
                              Configure Agent
                            </button>
                            <div className="h-px bg-brand-border my-1" />
                            <button 
                              onClick={() => handleMenuAction(agent.name, "Diagnostics")}
                              className="w-full text-left px-3 py-1.5 text-xs rounded-md text-brand-accent hover:bg-brand-border/30 flex items-center gap-2 font-bold"
                            >
                              <Terminal className="w-3.5 h-3.5 text-brand-accent" />
                              Run Diagnostics
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* Bottom Section: Orchestration Flow */}
      <section className="glass-panel p-6 rounded-2xl bg-brand-card/25 border border-brand-border space-y-6 overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-brand-text tracking-tight m-0 flex items-center gap-2">
              AI Agents Working Together
            </h2>
            <p className="text-xs text-brand-textSec">
              Autonomous orchestration flow coordinating telemetry analysis, predictive maintenance dispatching, and threat containment.
            </p>
          </div>
          <button 
            onClick={onOrchestrationClick}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-brand-accent/15 border border-brand-accent/20 text-brand-accent hover:bg-brand-accent hover:text-white transition-all hover:scale-105 active:scale-95 duration-200"
          >
            View Orchestration Flow
          </button>
        </div>

        {/* Animated flow diagram */}
        <div className="p-6 bg-brand-bg/50 border border-brand-border rounded-xl z-10 relative flex flex-col md:flex-row justify-between items-center gap-8 py-10 md:px-12">
          {/* Energy Agent Node */}
          <div className="flex flex-col items-center space-y-2 text-center group/node">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover/node:scale-110 duration-300 relative">
              <Zap className="w-7 h-7" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-25" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-text leading-tight">Energy Agent</div>
              <div className="text-[10px] font-mono text-emerald-500">Savings Telemetry</div>
            </div>
          </div>

          {/* Connect Arrow 1 */}
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-[80px] md:max-w-none">
            <div className="relative w-full h-1 bg-brand-border rounded-full overflow-hidden hidden md:block">
              <motion.div 
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-brand-accent to-transparent"
              />
            </div>
            <ArrowRight className="w-5 h-5 text-brand-textSec md:hidden animate-bounce" />
          </div>

          {/* Maintenance Agent Node */}
          <div className="flex flex-col items-center space-y-2 text-center group/node">
            <div className="w-16 h-16 rounded-full border-2 border-blue-500 bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover/node:scale-110 duration-300 relative">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-text leading-tight">Maintenance Agent</div>
              <div className="text-[10px] font-mono text-blue-500">Predictive Dispatch</div>
            </div>
          </div>

          {/* Connect Arrow 2 */}
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-[80px] md:max-w-none">
            <div className="relative w-full h-1 bg-brand-border rounded-full overflow-hidden hidden md:block">
              <motion.div 
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-brand-accent to-transparent"
              />
            </div>
            <ArrowRight className="w-5 h-5 text-brand-textSec md:hidden animate-bounce" />
          </div>

          {/* Occupancy Agent Node */}
          <div className="flex flex-col items-center space-y-2 text-center group/node">
            <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover/node:scale-110 duration-300 relative">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-text leading-tight">Occupancy Agent</div>
              <div className="text-[10px] font-mono text-amber-500">Space Telemetry</div>
            </div>
          </div>

          {/* Connect Arrow 3 */}
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-[80px] md:max-w-none">
            <div className="relative w-full h-1 bg-brand-border rounded-full overflow-hidden hidden md:block">
              <motion.div 
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 1 }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-brand-accent to-transparent"
              />
            </div>
            <ArrowRight className="w-5 h-5 text-brand-textSec md:hidden animate-bounce" />
          </div>

          {/* Security Agent Node */}
          <div className="flex flex-col items-center space-y-2 text-center group/node">
            <div className="w-16 h-16 rounded-full border-2 border-purple-500 bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/10 group-hover/node:scale-110 duration-300 relative">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-text leading-tight">Security Agent</div>
              <div className="text-[10px] font-mono text-purple-500">Lockdowns & Access</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIAgents;
