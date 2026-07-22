import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Wrench, 
  Users, 
  Shield, 
  Cpu, 
  TrendingUp, 
  PiggyBank, 
  Activity, 
  RefreshCw, 
  Briefcase, 
  Droplet,
  Sparkles
} from 'lucide-react';

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
    
    const duration = 1200;
    const incrementTime = 20;
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

const AIAgents = ({ agentConfigs = {}, triggerToast, onDetailsClick, onOrchestrationClick, onAddModuleClick }) => {
  const [selectedTab, setSelectedTab] = useState('all');

  const kpis = [
    {
      id: 'active',
      label: "Active Agents",
      value: 7,
      trend: "100% Operational",
      icon: Cpu,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      id: 'efficiency',
      label: "Avg Efficiency Gain",
      value: 24.8,
      unit: "%",
      trend: "+3.2% vs baseline",
      icon: Activity,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      id: 'energy',
      label: "Energy Savings",
      value: 18420,
      unit: "USD",
      trend: "+12.5% MoM",
      icon: Zap,
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      id: 'cost',
      label: "Cost Savings",
      value: 32150,
      unit: "USD",
      trend: "Projected Annual",
      icon: PiggyBank,
      color: "bg-purple-50 text-purple-600 border-purple-200"
    }
  ];

  const energyConf = agentConfigs.energy || {};
  const maintConf = agentConfigs.maintenance || {};
  const occConf = agentConfigs.occupancy || {};
  const secConf = agentConfigs.security || {};
  const cleanConf = agentConfigs.cleaning || {};
  const parkConf = agentConfigs.parking || {};
  const waterConf = agentConfigs.water || {};

  const agents = [
    {
      id: 'energy',
      name: "ENERGY AGENT",
      category: "sustainability",
      icon: Zap,
      status: "Active",
      description: "Monitors electricity, HVAC, lighting, water consumption and utility optimization.",
      metrics: [
        { label: "HVAC Target", value: `${energyConf.hvacCop || 4.2} COP` },
        { label: "Tariff Rate", value: `$${(energyConf.peakTariff || 0.18).toFixed(2)}/kWh` },
        { label: "Eco Demand", value: `${energyConf.ecoLimit || 80}% Cap` }
      ]
    },
    {
      id: 'maintenance',
      name: "MAINTENANCE AGENT",
      category: "maintenance",
      icon: Wrench,
      status: "Active",
      description: "Predictive maintenance dispatches, equipment health scoring, work orders automation.",
      metrics: [
        { label: "Vib Limit", value: `${maintConf.vibThreshold || 2.5} G` },
        { label: "Inspection", value: `${maintConf.inspectInterval || 7} Days` },
        { label: "Risk Mode", value: maintConf.riskSensitivity || 'Medium' }
      ]
    },
    {
      id: 'occupancy',
      name: "OCCUPANCY AGENT",
      category: "operations",
      icon: Users,
      status: "Active",
      description: "Space utilization analysis, zone heatmaps, foot traffic profiling and climate adjustment.",
      metrics: [
        { label: "Target Setpoint", value: `${occConf.targetTemp || 22.5}°C` },
        { label: "Airflow Rate", value: `${occConf.airflowCfm || 25} CFM` },
        { label: "Max Density", value: `${occConf.maxDensity || 85}%` }
      ]
    },
    {
      id: 'security',
      name: "SECURITY AGENT",
      category: "security",
      icon: Shield,
      status: "Active",
      description: "Perimeter monitoring, CCTV anomaly detection, badge scanner door access security.",
      metrics: [
        { label: "Motion Sensitivity", value: `${secConf.motionSensitivity || 75}%` },
        { label: "Perimeter Mode", value: secConf.securityMode || 'Standard' },
        { label: "Active CCTV", value: "48 Feeds" }
      ]
    },
    {
      id: 'cleaning',
      name: "CLEANING AGENT",
      category: "operations",
      icon: RefreshCw,
      status: "Active",
      description: "Autonomous sanitation dispatch, restroom usage tracking, cleaning staff routing.",
      metrics: [
        { label: "Cleanliness Index", value: "95%" },
        { label: "Sanitize Cycle", value: `${cleanConf.sanitizationFreq || 4} Hours` },
        { label: "Traffic Trigger", value: `${cleanConf.trafficTrigger || 150} Swipes` }
      ]
    },
    {
      id: 'parking',
      name: "PARKING AGENT",
      category: "operations",
      icon: Briefcase,
      status: "Active",
      description: "EV charger allocation, parking bay occupancy tracking, automated barrier gate entry.",
      metrics: [
        { label: "EV Tariff", value: `$${(parkConf.evTariff || 0.25).toFixed(2)}/kWh` },
        { label: "Reserved Bays", value: `${parkConf.reservedBaysPct || 25}%` },
        { label: "Available Bays", value: "142 Bays" }
      ]
    },
    {
      id: 'water',
      name: "WATER MANAGEMENT",
      category: "sustainability",
      icon: Droplet,
      status: "Active",
      description: "Water meter flow analysis, leakage detection sensors, rainwater harvesting monitoring.",
      metrics: [
        { label: "Leak Threshold", value: `${waterConf.leakThreshold || 5.0} L/m` },
        { label: "Recycled Target", value: `${waterConf.recycledWaterGoal || 35}%` },
        { label: "Flow Rate", value: "42.5 L/min" }
      ]
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Agents' },
    { id: 'operations', label: 'Operations' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'security', label: 'Security' }
  ];

  const filteredAgents = selectedTab === 'all' 
    ? agents 
    : agents.filter(a => a.category === selectedTab);

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            AI Agent Fleet
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Click any agent card to inspect real-time domain graphs and adjust parameters.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onOrchestrationClick}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Cpu className="w-4 h-4 text-blue-600" /> Orchestrator Network
          </button>
          <button 
            onClick={onAddModuleClick}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
          >
            Add New Agent
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  <AnimatedCounter 
                    value={kpi.value} 
                    prefix={kpi.id === 'energy' || kpi.id === 'cost' ? "$" : ""} 
                    suffix={kpi.id === 'efficiency' ? "%" : ""}
                    decimals={kpi.id === 'efficiency' ? 1 : 0}
                  />
                </h3>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-600">{kpi.trend}</span>
                </div>
              </div>

              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${kpi.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Filter Tabs */}
      <section className="border-b border-slate-200 flex items-center justify-between pb-1">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">
          Agents: {filteredAgents.length} / {agents.length}
        </div>
      </section>

      {/* Agents Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.id}
              onClick={() => onDetailsClick(agent)}
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-wide">{agent.name}</h3>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{agent.category}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{agent.description}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  {agent.metrics.map((m, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                      <span className="text-[9px] font-bold text-slate-400 block truncate uppercase">{m.label}</span>
                      <span className="text-xs font-black text-slate-900 block mt-0.5">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetailsClick(agent);
                  }}
                  className="w-full py-2 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-bold transition-colors"
                >
                  Configure Agent Parameters & View Graph
                </button>
              </div>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
};

export default AIAgents;
