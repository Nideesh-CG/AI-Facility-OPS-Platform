import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Cpu, 
  Sliders, 
  Activity, 
  Play,
  RotateCcw,
  Terminal,
  Zap,
  Wrench,
  Users,
  Shield,
  RefreshCw,
  Briefcase,
  Droplet,
  Sparkles,
  Radio,
  MessageSquare,
  Send,
  Bot,
  User,
  CheckCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';

const AgentDetailsModal = ({ isOpen, onClose, agent, onApplyConfig, triggerToast }) => {
  if (!isOpen || !agent) return null;

  const agentId = agent.id || 'energy';
  const portMap = {
    energy: 8000,
    maintenance: 8001,
    occupancy: 8002,
    security: 8003,
    water: 8004,
    cleaning: 8005,
    parking: 8006
  };
  const activePort = portMap[agentId] || 8000;

  // Active Tab: 'analytics' or 'chatbot'
  const [activeModalTab, setActiveModalTab] = useState('analytics');

  // Agent Specific Parameter States with Dual Controls (Manual Input + Slider)
  // 1. Energy
  const [hvacCop, setHvacCop] = useState(4.2);
  const [peakTariff, setPeakTariff] = useState(0.18);
  const [ecoLimit, setEcoLimit] = useState(80);

  // 2. Maintenance
  const [vibThreshold, setVibThreshold] = useState(2.5);
  const [inspectInterval, setInspectInterval] = useState(7);
  const [riskSensitivity, setRiskSensitivity] = useState('Medium');

  // 3. Occupancy
  const [targetTemp, setTargetTemp] = useState(22.5);
  const [airflowCfm, setAirflowCfm] = useState(25);
  const [maxDensity, setMaxDensity] = useState(85);

  // 4. Security
  const [motionSensitivity, setMotionSensitivity] = useState(75);
  const [securityMode, setSecurityMode] = useState('Standard');

  // 5. Cleaning
  const [sanitizationFreq, setSanitizationFreq] = useState(4);
  const [trafficTrigger, setTrafficTrigger] = useState(150);

  // 6. Parking
  const [evTariff, setEvTariff] = useState(0.25);
  const [reservedBaysPct, setReservedBaysPct] = useState(25);

  // 7. Water
  const [leakThreshold, setLeakThreshold] = useState(5.0);
  const [recycledWaterGoal, setRecycledWaterGoal] = useState(35);

  // Dedicated Agent Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello! I am the dedicated ${agent.name} AI Agent Bot. I monitor and control all tasks related to my domain on microservice port ${activePort}. Ask me any query about my duties!`,
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Dynamic Live Ticking Stream State (Updates live when sliders move!)
  const [livePoints, setLivePoints] = useState([]);
  const [logs, setLogs] = useState([]);

  // Generate stream points based on current sliders
  const generateCurrentData = useMemo(() => {
    const times = ['20:00', '20:05', '20:10', '20:15', '20:20', '20:25', '20:30', '20:35'];

    if (agentId === 'energy') {
      return times.map((t, idx) => {
        const baseLoad = 260 + idx * 12;
        const load = Math.round(baseLoad * (4.2 / (hvacCop || 4.2)) * ((ecoLimit || 80) / 100));
        const cost = Math.round(load * (peakTariff || 0.18) * 10) / 10;
        return { time: t, load, cost, peakCap: 350 };
      });
    }

    if (agentId === 'maintenance') {
      return times.map((t, idx) => {
        const wear = Math.round(15 + idx * 8 + (vibThreshold > 3.0 ? (vibThreshold - 3) * 12 : 0));
        const health = Math.max(30, 100 - wear);
        const risk = Math.min(95, Math.round(wear * (riskSensitivity === 'High' ? 1.3 : 1.0)));
        return { time: t, health, risk, vibG: Math.round(vibThreshold * 10) / 10 };
      });
    }

    if (agentId === 'occupancy') {
      return times.map((t, idx) => {
        const occ = Math.min(maxDensity || 85, [20, 35, 65, 82, 88, 78, 55, 30][idx]);
        const comfort = Math.round(100 - Math.abs((targetTemp || 22.5) - 22.0) * 8 + ((airflowCfm || 25) / 3));
        return { time: t, occupancy: occ, comfortIndex: Math.min(100, comfort) };
      });
    }

    if (agentId === 'security') {
      return times.map((t, idx) => {
        const threat = Math.round(([10, 15, 25, 45, 60, 35, 20, 12][idx]) * ((motionSensitivity || 75) / 50));
        const events = Math.round(threat / 8);
        return { time: t, threatScore: threat, cctvEvents: events };
      });
    }

    if (agentId === 'cleaning') {
      return times.map((t, idx) => {
        const decay = (idx % (sanitizationFreq || 4)) * 12;
        const hygiene = Math.max(45, 98 - decay);
        const robotCycles = Math.round((idx + 1) * ((trafficTrigger || 150) / 40));
        return { time: t, hygieneScore: hygiene, robotCycles };
      });
    }

    if (agentId === 'parking') {
      return times.map((t, idx) => {
        const bayUtil = Math.min(100, [25, 40, 75, 92, 95, 85, 60, 35][idx] + (reservedBaysPct || 25) / 5);
        const evKW = Math.round(bayUtil * (evTariff || 0.25) * 5);
        return { time: t, bayUtil: Math.round(bayUtil), evKW };
      });
    }

    // Water Management
    return times.map((t, idx) => {
      const flow = 30 + (idx % 4) * 8;
      const recycled = Math.round(flow * ((recycledWaterGoal || 35) / 100));
      return { time: t, flowLPM: flow, recycledLPM: recycled, leakLimit: (leakThreshold || 5) * 6 };
    });
  }, [
    agentId, hvacCop, peakTariff, ecoLimit, vibThreshold, inspectInterval, 
    riskSensitivity, targetTemp, airflowCfm, maxDensity, motionSensitivity, 
    sanitizationFreq, trafficTrigger, evTariff, reservedBaysPct, leakThreshold, recycledWaterGoal
  ]);

  useEffect(() => {
    setLivePoints(generateCurrentData);
  }, [generateCurrentData]);

  // 2-Second Live Ticking Loop
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const noise = (Math.random() - 0.5) * 6;

      setLivePoints(prev => {
        if (!prev || prev.length === 0) return generateCurrentData;
        return prev.map((pt, idx) => {
          if (idx === prev.length - 1) {
            return {
              ...pt,
              time: nowStr,
              load: pt.load ? Math.round(pt.load + noise) : pt.load,
              health: pt.health ? Math.min(100, Math.max(30, Math.round(pt.health + noise))) : pt.health,
              occupancy: pt.occupancy ? Math.min(100, Math.round(pt.occupancy + noise / 2)) : pt.occupancy,
              threatScore: pt.threatScore ? Math.round(pt.threatScore + noise) : pt.threatScore,
              hygieneScore: pt.hygieneScore ? Math.min(100, Math.round(pt.hygieneScore + noise / 2)) : pt.hygieneScore,
              flowLPM: pt.flowLPM ? Math.round(pt.flowLPM + noise / 2) : pt.flowLPM
            };
          }
          return pt;
        });
      });

      const logMsg = `[${nowStr}] [PID-${Math.floor(Math.random() * 8000) + 1000}] :${activePort} Realtime telemetry loop active. PID setpoints nominal.`;
      setLogs(p => [...p.slice(-12), logMsg]);

    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, activePort, generateCurrentData]);

  // Handle Dedicated Bot Messages
  const handleSendBotQuery = async (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    let reply = "";
    const qLower = queryText.toLowerCase();

    try {
      if (agentId === 'energy') {
        reply = `Energy Agent AI Bot: Current HVAC COP setpoint is ${hvacCop} with peak tariff billing at $${peakTariff}/kWh. Demand limit is capped at ${ecoLimit}%. Peak load forecasting predicts 342 kW peak at 14:00.`;
      } else if (agentId === 'maintenance') {
        reply = `Maintenance Agent AI Bot: Vibration threshold limit is set to ${vibThreshold} G with inspection every ${inspectInterval} Days. Asset health average is 92.4% with MTBF improvement of +32%.`;
      } else if (agentId === 'occupancy') {
        reply = `Occupancy Agent AI Bot: Zone setpoint target is ${targetTemp}°C with ${airflowCfm} CFM airflow. Desk occupancy is at 73% capacity with good air quality index (320 AQI).`;
      } else if (agentId === 'security') {
        reply = `Security Agent AI Bot: AI Motion sensitivity calibrated to ${motionSensitivity}%. Perimeter mode is ${securityMode}. 48 CCTV cameras active with 0 breaches detected.`;
      } else if (agentId === 'cleaning') {
        reply = `Cleaning Agent AI Bot: Sanitation frequency is every ${sanitizationFreq} Hours (${trafficTrigger} badge trigger). Cleanliness index is 95% with 24 automated robot cycles completed today.`;
      } else if (agentId === 'parking') {
        reply = `Parking Agent AI Bot: EV Charging tariff set at $${evTariff}/kWh with ${reservedBaysPct}% executive bays. 142 bays available out of 500. 16 EV chargers delivering 120.5 kW load.`;
      } else {
        reply = `Water Management Agent AI Bot: Flow leakage alert threshold is set at ${leakThreshold} L/min with ${recycledWaterGoal}% recycled greywater goal. Daily water usage is 12,500 L with 0 active leaks.`;
      }
    } catch (e) {
      reply = `${agent.name} AI Bot: Processed query regarding ${queryText}. Operational status is healthy.`;
    }

    setChatMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'bot',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsBotTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotTyping]);

  const handleApplyParameters = () => {
    const updatedParams = {
      hvacCop, peakTariff, ecoLimit, vibThreshold, inspectInterval, riskSensitivity,
      targetTemp, airflowCfm, maxDensity, motionSensitivity, securityMode,
      sanitizationFreq, trafficTrigger, evTariff, reservedBaysPct, leakThreshold, recycledWaterGoal
    };

    if (onApplyConfig) {
      onApplyConfig(agentId, updatedParams);
    }
    triggerToast(`[${agent.name}] New setpoints applied & live graph baseline updated!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-10 relative overflow-hidden text-slate-900 max-h-[92vh] flex flex-col justify-between"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight m-0">{agent.name} Intelligence</h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  REAL-TIME SYNCED
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                <span>Microservice API: <code className="text-blue-600 font-mono">http://localhost:{activePort}</code></span>
              </span>
            </div>
          </div>

          {/* Modal Tab Selector (Analytical Visualizations vs Dedicated Agent Chatbot) */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveModalTab('analytics')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeModalTab === 'analytics' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Modern Graphs & Factors
              </button>
              <button
                onClick={() => setActiveModalTab('chatbot')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeModalTab === 'chatbot' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> {agent.name} AI Bot
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: ANALYTICS & MANUAL PARAMETERS */}
        {activeModalTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1 flex-1">
            
            {/* Modern Specialized Chart (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                  Modern Specialized Analytical Graph
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Manual Number Sync Active</span>
              </div>

              <div className="h-64 bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-2xl relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  {/* ENERGY AGENT: Dual-Axis Composed Area & Line Chart */}
                  {agentId === 'energy' && (
                    <ComposedChart data={livePoints}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis yAxisId="left" stroke="#94A3B8" fontSize={10} unit="kW" />
                      <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={10} unit="$" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', color: '#FFF' }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area yAxisId="left" type="monotone" dataKey="load" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} name="Power Load (kW)" activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 3 }} />
                      <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#16A34A" strokeWidth={2.5} name="Hourly Cost ($)" activeDot={{ r: 6 }} />
                      <ReferenceLine yAxisId="left" y={350} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Peak Cap', fill: '#EF4444', fontSize: 10 }} />
                    </ComposedChart>
                  )}

                  {/* MAINTENANCE AGENT: Multi-Line Health vs Risk */}
                  {agentId === 'maintenance' && (
                    <LineChart data={livePoints}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', color: '#FFF' }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="health" stroke="#16A34A" strokeWidth={2.5} name="Health Score (%)" activeDot={{ r: 7 }} />
                      <Line type="monotone" dataKey="risk" stroke="#DC2626" strokeWidth={2.5} name="Predictive Risk (%)" activeDot={{ r: 7 }} />
                      <Line type="monotone" dataKey="vibG" stroke="#D97706" strokeWidth={2} name="Vibration (G)" />
                    </LineChart>
                  )}

                  {/* OCCUPANCY AGENT: Composed Area & Line Comfort Chart */}
                  {agentId === 'occupancy' && (
                    <ComposedChart data={livePoints}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis yAxisId="left" stroke="#94A3B8" fontSize={10} unit="%" />
                      <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', color: '#FFF' }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="occupancy" fill="#2563EB" name="Zone Occupancy (%)" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="comfortIndex" stroke="#D97706" strokeWidth={2.5} name="Comfort Index" activeDot={{ r: 7 }} />
                    </ComposedChart>
                  )}

                  {/* SECURITY AGENT: Incident & Threat Bar Histogram */}
                  {agentId === 'security' && (
                    <BarChart data={livePoints}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', color: '#FFF' }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="threatScore" fill="#9333EA" name="AI Threat Score" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cctvEvents" fill="#DC2626" name="Motion Alerts" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}

                  {/* CLEANING AGENT: Hygiene Step Area Decay */}
                  {agentId === 'cleaning' && (
                    <AreaChart data={livePoints}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', color: '#FFF' }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="stepAfter" dataKey="hygieneScore" stroke="#16A34A" fill="#16A34A" fillOpacity={0.3} name="Sanitization Hygiene (%)" activeDot={{ r: 7 }} />
                      <Line type="monotone" dataKey="robotCycles" stroke="#2563EB" strokeWidth={2} name="Robot Cleaning Runs" />
                    </AreaChart>
                  )}

                  {/* PARKING AGENT: EV Load & Bay Utilization Grouped Bar */}
                  {agentId === 'parking' && (
                    <BarChart data={livePoints}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis yAxisId="left" stroke="#94A3B8" fontSize={10} unit="%" />
                      <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={10} unit="kW" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', color: '#FFF' }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="bayUtil" fill="#2563EB" name="Bay Occupancy (%)" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="evKW" fill="#D97706" name="EV Load (kW)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}

                  {/* WATER AGENT: Supply Flow vs Recycled Water Area */}
                  {agentId === 'water' && (
                    <AreaChart data={livePoints}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} unit="L/m" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '10px', color: '#FFF' }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="flowLPM" stroke="#0284C7" fill="#0284C7" fillOpacity={0.35} name="Incomer Flow (L/m)" activeDot={{ r: 7 }} />
                      <Area type="monotone" dataKey="recycledLPM" stroke="#16A34A" fill="#16A34A" fillOpacity={0.2} name="Recycled Greywater (L/m)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">AI Neural Recommendation</span>
                <p className="text-xs text-slate-700 m-0 leading-relaxed font-medium">
                  Modifying factors via manual number input or slider immediately transforms graph baselines in real time. Click <strong>Apply Setpoints & Sync</strong> to update system control loops.
                </p>
              </div>
            </div>

            {/* Right Column: Manual Number Inputs + Sliders Dual Control (5 Columns) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between border-l border-slate-100 pl-0 lg:pl-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    Dual Controls (Number + Slider)
                  </h4>
                  <span className="text-[10px] text-blue-600 font-bold">Manual Sync</span>
                </div>

                {/* 1. ENERGY AGENT DUAL CONTROLS */}
                {agentId === 'energy' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Target HVAC COP</span>
                        <input 
                          type="number" min="2.5" max="5.0" step="0.1"
                          value={hvacCop}
                          onChange={(e) => setHvacCop(parseFloat(e.target.value) || 2.5)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="2.5" max="5.0" step="0.1" value={hvacCop}
                        onChange={(e) => setHvacCop(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Peak Electricity Tariff ($/kWh)</span>
                        <input 
                          type="number" min="0.05" max="0.30" step="0.01"
                          value={peakTariff}
                          onChange={(e) => setPeakTariff(parseFloat(e.target.value) || 0.05)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="0.05" max="0.30" step="0.01" value={peakTariff}
                        onChange={(e) => setPeakTariff(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Eco Saver Demand Limit (%)</span>
                        <input 
                          type="number" min="50" max="100" step="5"
                          value={ecoLimit}
                          onChange={(e) => setEcoLimit(parseInt(e.target.value) || 50)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="50" max="100" step="5" value={ecoLimit}
                        onChange={(e) => setEcoLimit(parseInt(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 2. MAINTENANCE DUAL CONTROLS */}
                {agentId === 'maintenance' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Vibration Anomaly Limit (G)</span>
                        <input 
                          type="number" min="1.0" max="5.0" step="0.1"
                          value={vibThreshold}
                          onChange={(e) => setVibThreshold(parseFloat(e.target.value) || 1.0)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="1.0" max="5.0" step="0.1" value={vibThreshold}
                        onChange={(e) => setVibThreshold(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Inspection Frequency (Days)</span>
                        <input 
                          type="number" min="3" max="30" step="1"
                          value={inspectInterval}
                          onChange={(e) => setInspectInterval(parseInt(e.target.value) || 3)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="3" max="30" step="1" value={inspectInterval}
                        onChange={(e) => setInspectInterval(parseInt(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 3. OCCUPANCY DUAL CONTROLS */}
                {agentId === 'occupancy' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Target Setpoint Temp (°C)</span>
                        <input 
                          type="number" min="18.0" max="26.0" step="0.5"
                          value={targetTemp}
                          onChange={(e) => setTargetTemp(parseFloat(e.target.value) || 18.0)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="18.0" max="26.0" step="0.5" value={targetTemp}
                        onChange={(e) => setTargetTemp(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Airflow Rate (CFM / Person)</span>
                        <input 
                          type="number" min="10" max="40" step="5"
                          value={airflowCfm}
                          onChange={(e) => setAirflowCfm(parseInt(e.target.value) || 10)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="10" max="40" step="5" value={airflowCfm}
                        onChange={(e) => setAirflowCfm(parseInt(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 4. SECURITY DUAL CONTROLS */}
                {agentId === 'security' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>AI Motion Sensitivity (%)</span>
                        <input 
                          type="number" min="10" max="100" step="5"
                          value={motionSensitivity}
                          onChange={(e) => setMotionSensitivity(parseInt(e.target.value) || 10)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="10" max="100" step="5" value={motionSensitivity}
                        onChange={(e) => setMotionSensitivity(parseInt(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 5. CLEANING DUAL CONTROLS */}
                {agentId === 'cleaning' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Sanitization Frequency (Hours)</span>
                        <input 
                          type="number" min="1" max="12" step="1"
                          value={sanitizationFreq}
                          onChange={(e) => setSanitizationFreq(parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="1" max="12" step="1" value={sanitizationFreq}
                        onChange={(e) => setSanitizationFreq(parseInt(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 6. PARKING DUAL CONTROLS */}
                {agentId === 'parking' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>EV Tariff ($/kWh)</span>
                        <input 
                          type="number" min="0.10" max="0.50" step="0.05"
                          value={evTariff}
                          onChange={(e) => setEvTariff(parseFloat(e.target.value) || 0.10)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="0.10" max="0.50" step="0.05" value={evTariff}
                        onChange={(e) => setEvTariff(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* 7. WATER DUAL CONTROLS */}
                {agentId === 'water' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                        <span>Flow Leakage Threshold (L/min)</span>
                        <input 
                          type="number" min="1.0" max="20.0" step="0.5"
                          value={leakThreshold}
                          onChange={(e) => setLeakThreshold(parseFloat(e.target.value) || 1.0)}
                          className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <input 
                        type="range" min="1.0" max="20.0" step="0.5" value={leakThreshold}
                        onChange={(e) => setLeakThreshold(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Terminal Console */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-blue-600" /> Log Console</span>
                    <span className="text-emerald-600 font-mono">:800{['energy','maintenance','occupancy','security','water','cleaning','parking'].indexOf(agentId)}</span>
                  </div>
                  <div className="h-24 bg-slate-950 rounded-lg p-2 font-mono text-[10px] text-emerald-400 overflow-y-auto space-y-1 border border-slate-800">
                    {logs.map((l, i) => <div key={i}>{l}</div>)}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleApplyParameters}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Apply Setpoints & Sync
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED PER-AGENT CHATBOT */}
        {activeModalTab === 'chatbot' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 bg-white p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 m-0">{agent.name} AI Assistant Bot</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Microservice :800{['energy','maintenance','occupancy','security','water','cleaning','parking'].indexOf(agentId)} Connected
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Domain Intelligence Engine</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2">
              {chatMessages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`flex gap-2.5 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs ${
                      isBot ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-200 border-slate-300 text-slate-700'
                    }`}>
                      {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed border shadow-xs ${
                        isBot ? 'bg-white border-slate-200 text-slate-800 rounded-tl-none' : 'bg-blue-600 text-white border-blue-600 rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-[9px] text-slate-400 font-mono ${isBot ? '' : 'text-right'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isBotTyping && (
                <div className="flex gap-2 text-xs text-slate-400 items-center">
                  <Bot className="w-4 h-4 text-blue-600 animate-bounce" />
                  <span>{agent.name} AI Bot is formulating response...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 relative pt-2 border-t border-slate-200 bg-white p-2 rounded-xl border">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendBotQuery(chatInput)}
                placeholder={`Ask ${agent.name} AI Bot any query...`}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <button 
                onClick={() => handleSendBotQuery(chatInput)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default AgentDetailsModal;
