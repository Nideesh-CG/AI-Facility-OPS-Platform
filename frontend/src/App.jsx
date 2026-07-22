import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './layout/Sidebar';
import TopNavbar from './layout/TopNavbar';
import Footer from './layout/Footer';

// Subcomponents
import SensorTable from './components/SensorTable';

// Modals & Drawers
import AIAgents from './pages/AIAgents';
import GetStarted from './pages/GetStarted';
import AddModuleModal from './components/AddModuleModal';
import AddWorkOrderModal from './components/AddWorkOrderModal';
import AddScheduleModal from './components/AddScheduleModal';
import AskAIDrawer from './components/AskAIDrawer';
import OrchestrationModal from './components/OrchestrationModal';
import AgentDetailsModal from './components/AgentDetailsModal';

// Charts
import {
  RealTimeEnergyChart,
  DailyEnergyBarChart,
  WeeklyTrendAreaChart,
  MonthlyComposedChart
} from './components/charts/EnergyCharts';

// Icons
import {
  Zap,
  DollarSign,
  Activity,
  Droplet,
  TrendingUp,
  FileText,
  Download,
  CheckCircle,
  Sliders,
  Bell,
  Cpu,
  Wrench,
  Users,
  Shield,
  Compass,
  ClipboardList,
  Database,
  Link,
  Plus,
  RefreshCw,
  Briefcase,
  Layers,
  Search,
  Lock,
  User,
  Globe,
  Sliders as SlidersIcon,
  BellRing,
  AlertTriangle,
  Check,
  ChevronRight,
  MapPin,
  Clock,
  Eye,
  Trash2,
  CheckSquare
} from 'lucide-react';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAskAIDrawerOpen, setIsAskAIDrawerOpen] = useState(false);
  const [isOrchestrationModalOpen, setIsOrchestrationModalOpen] = useState(false);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);

  // Shared Agent Setpoints Config State
  const [agentConfigs, setAgentConfigs] = useState({
    energy: { hvacCop: 4.2, peakTariff: 0.18, ecoLimit: 80 },
    maintenance: { vibThreshold: 2.5, inspectInterval: 7, riskSensitivity: 'Medium' },
    occupancy: { targetTemp: 22.5, airflowCfm: 25, maxDensity: 85 },
    security: { motionSensitivity: 75, securityMode: 'Standard' },
    cleaning: { sanitizationFreq: 4, trafficTrigger: 150 },
    parking: { evTariff: 0.25, reservedBaysPct: 25 },
    water: { leakThreshold: 5.0, recycledWaterGoal: 35 }
  });

  // Work Orders state
  const [workOrdersList, setWorkOrdersList] = useState([
    { id: 'WO-1001', asset: 'AC unit', priority: 'High', status: 'In Progress', assignedTo: 'John Doe', dueDate: '12 May' },
    { id: 'WO-1002', asset: 'Lift-1', priority: 'Medium', status: 'Pending', assignedTo: 'Jane Smith', dueDate: '13 May' },
    { id: 'WO-1003', asset: 'Camera', priority: 'High', status: 'In Progress', assignedTo: 'Alex Lee', dueDate: '14 May' },
    { id: 'WO-1004', asset: 'Camera-20', priority: 'Low', status: 'Completed', assignedTo: 'David M.', dueDate: '10 May' }
  ]);

  // Schedules state
  const [schedulesList, setSchedulesList] = useState([
    { id: 'SCH-1', date: '12 May', activity: 'AC Maintenance', time: '09:00 AM', status: 'Completed' },
    { id: 'SCH-2', date: '13 May', activity: 'Generator Check', time: '11:00 AM', status: 'Pending' },
    { id: 'SCH-3', date: '14 May', activity: 'Lift Inspection', time: '02:00 PM', status: 'Pending' },
    { id: 'SCH-4', date: '15 May', activity: 'Fire Drill', time: '10:30 AM', status: 'Upcoming' }
  ]);

  // Alerts state
  const [alertsList, setAlertsList] = useState([
    { id: 'ALT-01', title: 'Water leakage detected', location: 'Floor 2', severity: 'critical', time: '2 min ago' },
    { id: 'ALT-02', title: 'Elevator malfunction', location: 'Lift-1', severity: 'warning', time: '5 min ago' },
    { id: 'ALT-03', title: 'High energy usage', location: 'Floor 3', severity: 'warning', time: '10 min ago' },
    { id: 'ALT-04', title: 'Door left open', location: 'Main Gate', severity: 'info', time: '15 min ago' }
  ]);

  // Settings State
  const [profileName, setProfileName] = useState('Sarah Jenkins');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const [woSearch, setWoSearch] = useState('');
  const [woStatusFilter, setWoStatusFilter] = useState('All');
  const [woPriorityFilter, setWoPriorityFilter] = useState('All');

  // Live Streaming Telemetry Data State
  const [apiData, setApiData] = useState({
    kpis: { totalEnergy: { value: 12450 } },
    charts: {
      hourlyEnergyData: Array.from({ length: 24 }, (_, i) => ({ timeDisplay: `${i}:00`, electricity: 300 + (i%5)*20, hvac: 130 + (i%3)*15 })),
      dailyEnergyData: [
        { date: 'Mon', electricity: 12450, hvac: 5600, lighting: 2490, equipment: 3110, elevators: 1250 },
        { date: 'Tue', electricity: 12800, hvac: 5760, lighting: 2560, equipment: 3200, elevators: 1280 },
        { date: 'Wed', electricity: 12100, hvac: 5445, lighting: 2420, equipment: 3025, elevators: 1210 },
        { date: 'Thu', electricity: 12650, hvac: 5692, lighting: 2530, equipment: 3162, elevators: 1266 },
        { date: 'Fri', electricity: 13100, hvac: 5895, lighting: 2620, equipment: 3275, elevators: 1310 },
        { date: 'Sat', electricity: 9800, hvac: 4410, lighting: 1960, equipment: 2450, elevators: 980 },
        { date: 'Sun', electricity: 8900, hvac: 4005, lighting: 1780, equipment: 2225, elevators: 890 }
      ]
    },
    overview: {
      weekly_savings_trend: [
        { name: 'Mon', electricity: 12000 },
        { name: 'Tue', electricity: 12450 },
        { name: 'Wed', electricity: 11800 },
        { name: 'Thu', electricity: 12100 },
        { name: 'Fri', electricity: 12900 },
        { name: 'Sat', electricity: 9500 },
        { name: 'Sun', electricity: 8800 }
      ]
    }
  });

  // Real-Time Live Pulse Loop
  useEffect(() => {
    setIsLoading(false);

    const interval = setInterval(() => {
      setApiData(prev => {
        const updatedWeekly = prev.overview.weekly_savings_trend.map(item => ({
          ...item,
          electricity: Math.max(8000, Math.round(item.electricity + (Math.random() - 0.5) * 200))
        }));

        const updatedDaily = prev.charts.dailyEnergyData.map(item => {
          const newTotal = Math.max(8000, Math.round(item.electricity + (Math.random() - 0.5) * 300));
          return {
            ...item,
            electricity: newTotal,
            hvac: Math.round(newTotal * 0.45),
            lighting: Math.round(newTotal * 0.20),
            equipment: Math.round(newTotal * 0.25),
            elevators: Math.round(newTotal * 0.10)
          };
        });

        return {
          ...prev,
          charts: {
            ...prev.charts,
            dailyEnergyData: updatedDaily
          },
          overview: {
            ...prev.overview,
            weekly_savings_trend: updatedWeekly
          }
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApplyAgentConfig = (agentId, newParams) => {
    setAgentConfigs(prev => ({
      ...prev,
      [agentId]: newParams
    }));
  };

  const handleAddNewWorkOrder = (newWo) => {
    const updated = [{ id: `WO-${workOrdersList.length + 1005}`, ...newWo }, ...workOrdersList];
    setWorkOrdersList(updated);
    triggerToast(`Work Order #${updated[0].id} created!`);
  };

  const handleAddNewSchedule = (newSched) => {
    const updated = [{ id: `SCH-${schedulesList.length + 1}`, ...newSched }, ...schedulesList];
    setSchedulesList(updated);
    triggerToast(`Schedule added for ${newSched.date}!`);
  };

  const toggleWorkOrderStatus = (id) => {
    setWorkOrdersList(prev => prev.map(wo => {
      if (wo.id === id) {
        const nextStatus = wo.status === 'Pending' ? 'In Progress' : wo.status === 'In Progress' ? 'Completed' : 'Pending';
        triggerToast(`Ticket ${id} status set to ${nextStatus}`);
        return { ...wo, status: nextStatus };
      }
      return wo;
    }));
  };

  const toggleScheduleStatus = (id) => {
    setSchedulesList(prev => prev.map(sch => {
      if (sch.id === id) {
        const nextStatus = sch.status === 'Completed' ? 'Pending' : 'Completed';
        triggerToast(`Schedule ${id} marked as ${nextStatus}`);
        return { ...sch, status: nextStatus };
      }
      return sch;
    }));
  };

  const dismissAlert = (id) => {
    setAlertsList(prev => prev.filter(a => a.id !== id));
    triggerToast(`Alert resolved and triaged.`);
  };

  const downloadFile = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded ${filename}`);
  };

  const handleLogout = () => {
    triggerToast("Logging out...");
    setTimeout(() => setIsLoggedIn(false), 850);
  };

  const filteredWorkOrders = useMemo(() => {
    return workOrdersList.filter(wo => {
      const matchSearch = wo.id.toLowerCase().includes(woSearch.toLowerCase()) ||
                          wo.asset.toLowerCase().includes(woSearch.toLowerCase()) ||
                          wo.assignedTo.toLowerCase().includes(woSearch.toLowerCase());
      const matchStatus = woStatusFilter === 'All' || wo.status.toLowerCase() === woStatusFilter.toLowerCase();
      const matchPriority = woPriorityFilter === 'All' || wo.priority.toLowerCase() === woPriorityFilter.toLowerCase();
      return matchSearch && matchStatus && matchPriority;
    });
  }, [workOrdersList, woSearch, woStatusFilter, woPriorityFilter]);

  if (!isLoggedIn) {
    return <GetStarted onGetStarted={() => setIsLoggedIn(true)} triggerToast={triggerToast} />;
  }

  if (isLoading || !apiData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading Facility 360 AI Platform...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex transition-all duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAskAIClick={() => setIsAskAIDrawerOpen(true)}
        onLogoutClick={handleLogout}
      />

      {/* Main Panel */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '72px' : '240px' }}
      >
        <TopNavbar 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onHelpClick={() => triggerToast("System documentation online.")}
          onNotificationsClick={() => triggerToast("System notifications synced.")}
        />

        <main className="p-6 mt-16 space-y-6 flex-1 flex flex-col max-w-7xl w-full mx-auto">

          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    REAL-TIME STREAMING
                  </span>
                </div>

                {/* 4 Top KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    onClick={() => setActiveTab('assets')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-500">Total Assets</span>
                    <h3 className="text-2xl font-black text-slate-900">1,250</h3>
                  </div>
                  <div 
                    onClick={() => setActiveTab('ai-agents')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-500">Active agents</span>
                    <h3 className="text-2xl font-black text-emerald-600">12</h3>
                  </div>
                  <div 
                    onClick={() => setActiveTab('alerts')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-500">Total Alerts</span>
                    <h3 className="text-2xl font-black text-rose-600">5</h3>
                  </div>
                  <div 
                    onClick={() => setActiveTab('analytics')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-500">Performance</span>
                    <h3 className="text-2xl font-black text-emerald-600">92%</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Performance Overview Area Chart */}
                  <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-800">Performance Overview</h3>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Live Ticking Telemetry
                      </span>
                    </div>
                    <div className="h-64">
                      <WeeklyTrendAreaChart weeklyData={apiData.overview.weekly_savings_trend} />
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                    <div className="space-y-3 text-xs">
                      <div 
                        onClick={() => triggerToast("Inspected maintenance completion logs")}
                        className="flex items-center justify-between pb-2 border-b border-slate-100 cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-slate-800">Maintenance completed</span>
                        </div>
                        <span className="text-slate-400 font-mono">10m ago</span>
                      </div>

                      <div 
                        onClick={() => triggerToast("Inspected energy optimization event")}
                        className="flex items-center justify-between pb-2 border-b border-slate-100 cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-slate-800">Energy usage optimized</span>
                        </div>
                        <span className="text-slate-400 font-mono">15m ago</span>
                      </div>

                      <div 
                        onClick={() => triggerToast("Inspected security triage log")}
                        className="flex items-center justify-between cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-slate-800">Security alert resolved</span>
                        </div>
                        <span className="text-slate-400 font-mono">1h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Provides a quick summary of key metrics and recent activities.
              </div>
            </div>
          )}

          {/* 2. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    LIVE SUB-METER FEED
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    onClick={() => setActiveTab('analytics')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-500">Energy Usage</span>
                    <h3 className="text-2xl font-black text-slate-900">12,450 <span className="text-xs font-normal text-slate-400">kWh</span></h3>
                  </div>
                  <div 
                    onClick={() => setActiveTab('work-orders')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-500">Maintenance</span>
                    <h3 className="text-2xl font-black text-emerald-600">8</h3>
                  </div>
                  <div 
                    onClick={() => setSelectedAgentDetails({ id: 'occupancy', name: 'OCCUPANCY AGENT' })}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-500">Occupancy</span>
                    <h3 className="text-2xl font-black text-slate-900">73%</h3>
                  </div>
                  <div 
                    onClick={() => setActiveTab('alerts')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-500">Alerts</span>
                    <h3 className="text-2xl font-black text-rose-600">3</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Sub-Meter Stacked Energy Usage Bar Chart */}
                  <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-800">Usage Overview</h3>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Live Sub-Meter Ticker
                      </span>
                    </div>
                    <div className="h-64">
                      <DailyEnergyBarChart dailyData={apiData.charts.dailyEnergyData} />
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-800">Alerts</h3>
                        <button 
                          onClick={() => setActiveTab('alerts')}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div 
                          onClick={() => dismissAlert('ALT-03')}
                          className="flex items-center justify-between p-2 rounded-lg bg-rose-50 text-rose-700 cursor-pointer hover:bg-rose-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                            <span className="font-semibold">High energy usage (Floor 3)</span>
                          </div>
                          <span className="text-[10px] font-bold text-rose-800 underline">Dismiss</span>
                        </div>

                        <div 
                          onClick={() => dismissAlert('ALT-04')}
                          className="flex items-center justify-between p-2 rounded-lg bg-rose-50 text-rose-700 cursor-pointer hover:bg-rose-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                            <span className="font-semibold">Door left open (Main Gate)</span>
                          </div>
                          <span className="text-[10px] font-bold text-rose-800 underline">Dismiss</span>
                        </div>

                        <div 
                          onClick={() => dismissAlert('ALT-02')}
                          className="flex items-center justify-between p-2 rounded-lg bg-amber-50 text-amber-700 cursor-pointer hover:bg-amber-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-600" />
                            <span className="font-semibold">Elevator maintenance (Lift-1)</span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-800 underline">Dismiss</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <h3 className="text-sm font-bold text-slate-800">Top Insights</h3>
                      <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                        <li className="hover:text-slate-900 cursor-pointer" onClick={() => triggerToast("Inspected 12% energy reduction trend")}>
                          Energy usage is 12% lower than last month
                        </li>
                        <li className="hover:text-slate-900 cursor-pointer" onClick={() => triggerToast("Inspected 20% maintenance cost reduction")}>
                          Maintenance cost reduced by 20%
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Detailed overview with charts, KPIs and real-time insights.
              </div>
            </div>
          )}

          {/* 3. AI AGENTS */}
          {activeTab === 'ai-agents' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Agents</h1>
                <AIAgents 
                  agentConfigs={agentConfigs}
                  triggerToast={triggerToast}
                  onDetailsClick={(agent) => setSelectedAgentDetails(agent)}
                  onOrchestrationClick={() => setIsOrchestrationModalOpen(true)}
                  onAddModuleClick={() => setIsAddModalOpen(true)}
                />
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Manage and monitor all AI agents from one place.
              </div>
            </div>
          )}

          {/* 4. MODULES */}
          {activeTab === 'modules' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Modules</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'energy', title: "Energy Management", desc: "Monitor and optimize energy usage", icon: Zap, target: 'dashboard' },
                    { id: 'security', title: "Security", desc: "Ensure building and asset safety", icon: Shield, target: 'ai-agents' },
                    { id: 'maintenance', title: "Maintenance", desc: "Manage and schedule maintenance", icon: Wrench, target: 'work-orders' },
                    { id: 'inventory', title: "Inventory", desc: "Track and manage inventory", icon: Database, target: 'assets' },
                    { id: 'parking', title: "Parking", desc: "Monitor and manage parking spaces", icon: Briefcase, target: 'ai-agents' },
                    { id: 'cleaning', title: "Cleaning", desc: "Manage cleaning operations", icon: RefreshCw, target: 'ai-agents' },
                    { id: 'water', title: "Water Management", desc: "Monitor water usage and quality", icon: Droplet, target: 'ai-agents' },
                    { id: 'hvac', title: "HVAC Management", desc: "Control and optimize HVAC systems", icon: Activity, target: 'monitoring' }
                  ].map((mod, i) => {
                    const Icon = mod.icon;
                    return (
                      <div 
                        key={i} 
                        onClick={() => {
                          if (['energy','maintenance','occupancy','security','water','cleaning','parking'].includes(mod.id)) {
                            setSelectedAgentDetails({ id: mod.id, name: mod.title.toUpperCase() });
                          } else {
                            setActiveTab(mod.target);
                          }
                          triggerToast(`Opened ${mod.title}`);
                        }}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{mod.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{mod.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Access and manage all facility modules.
              </div>
            </div>
          )}

          {/* 5. WORK ORDERS */}
          {activeTab === 'work-orders' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Work Orders</h1>
                  <button 
                    onClick={() => setIsWorkOrderModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Create Work Order
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    value={woStatusFilter}
                    onChange={(e) => setWoStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Status</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <select 
                    value={woPriorityFilter}
                    onChange={(e) => setWoPriorityFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text"
                      value={woSearch}
                      onChange={(e) => setWoSearch(e.target.value)}
                      placeholder="Search tickets..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                          <th className="p-3 font-bold">ID</th>
                          <th className="p-3 font-bold">Asset</th>
                          <th className="p-3 font-bold">Priority</th>
                          <th className="p-3 font-bold">Status</th>
                          <th className="p-3 font-bold">Assigned To</th>
                          <th className="p-3 font-bold">Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWorkOrders.map((wo, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-semibold text-slate-800">{wo.id}</td>
                            <td className="p-3 font-medium text-slate-900">{wo.asset}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                wo.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                                wo.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {wo.priority}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => toggleWorkOrderStatus(wo.id)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity ${
                                  wo.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                  wo.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {wo.status} ✎
                              </button>
                            </td>
                            <td className="p-3 text-slate-700">{wo.assignedTo}</td>
                            <td className="p-3 text-slate-500 font-medium">{wo.dueDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Create, track and manage maintenance work orders.
              </div>
            </div>
          )}

          {/* 6. ASSETS */}
          {activeTab === 'assets' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assets</h1>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Total Assets</span>
                    <h3 className="text-2xl font-black text-slate-900">1,250</h3>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Healthy</span>
                    <h3 className="text-2xl font-black text-emerald-600">1,050</h3>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Warning</span>
                    <h3 className="text-2xl font-black text-amber-600">120</h3>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Critical</span>
                    <h3 className="text-2xl font-black text-rose-600">80</h3>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                          <th className="p-3 font-bold">Asset</th>
                          <th className="p-3 font-bold">Type</th>
                          <th className="p-3 font-bold">Status</th>
                          <th className="p-3 font-bold">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'AC-1021', type: 'HVAC', status: 'Healthy', location: 'Floor 1', badge: 'bg-emerald-100 text-emerald-700' },
                          { name: 'Lift-1', type: 'Elevator', status: 'Warning', location: 'Lobby', badge: 'bg-amber-100 text-amber-700' },
                          { name: 'Camera-20', type: 'CCTV', status: 'Offline', location: 'Floor 2', badge: 'bg-rose-100 text-rose-700' },
                          { name: 'Generator', type: 'Power', status: 'Good', location: 'Basement', badge: 'bg-emerald-100 text-emerald-700' }
                        ].map((ast, i) => (
                          <tr 
                            key={i} 
                            onClick={() => triggerToast(`Inspected telemetry for ${ast.name} (${ast.type})`)}
                            className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <td className="p-3 font-semibold text-slate-900">{ast.name}</td>
                            <td className="p-3 text-slate-600">{ast.type}</td>
                            <td className="p-3"><span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ast.badge}`}>{ast.status}</span></td>
                            <td className="p-3 text-slate-500">{ast.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Manage all building assets and their status.
              </div>
            </div>
          )}

          {/* 7. MONITORING */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Monitoring</h1>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Temperature</span>
                    <h3 className="text-2xl font-black text-slate-900">24°C</h3>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Energy</span>
                    <h3 className="text-2xl font-black text-slate-900">12,450 <span className="text-xs font-normal text-slate-400">kWh</span></h3>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Air Quality</span>
                    <h3 className="text-2xl font-black text-slate-900">320 <span className="text-xs font-normal text-slate-400">AQI</span></h3>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Status</span>
                    <h3 className="text-2xl font-black text-emerald-600">Good</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-800">Realtime Sensors</h3>
                    <div className="h-64">
                      <RealTimeEnergyChart hourlyData={apiData.charts.hourlyEnergyData} />
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-sm font-bold text-slate-800">Live Alerts</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-rose-50 text-rose-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                          <span className="font-semibold">High energy usage</span>
                        </div>
                        <span className="text-slate-400">Floor 3</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-rose-50 text-rose-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                          <span className="font-semibold">Water leakage detected</span>
                        </div>
                        <span className="text-slate-400">Floor 2</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-amber-50 text-amber-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-600" />
                          <span className="font-semibold">Elevator maintenance due</span>
                        </div>
                        <span className="text-slate-400">Lift-1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Real-time monitoring of systems and facilities.
              </div>
            </div>
          )}

          {/* 8. ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800">Energy Consumption</h3>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">This Month ▾</span>
                  </div>
                  <div className="h-64">
                    <MonthlyComposedChart dailyData={apiData.charts.dailyEnergyData} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Cost Savings</span>
                    <h3 className="text-2xl font-black text-slate-900">$12,450</h3>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Efficiency</span>
                    <h3 className="text-2xl font-black text-emerald-600">87%</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <h3 className="text-sm font-bold text-slate-800">Top Insights</h3>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    <li>Energy usage is 12% lower than last month</li>
                    <li>Maintenance cost reduced by 20%</li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Analyze data and generate insights.
              </div>
            </div>
          )}

          {/* 9. REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports</h1>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                          <th className="p-3 font-bold">Report Name</th>
                          <th className="p-3 font-bold">Type</th>
                          <th className="p-3 font-bold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Energy Report', type: 'PDF', date: '10 May' },
                          { name: 'Maintenance Report', type: 'PDF', date: '09 May' },
                          { name: 'Security Report', type: 'PDF', date: '08 May' },
                          { name: 'Occupancy Report', type: 'PDF', date: '07 May' }
                        ].map((rep, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-semibold text-slate-900">{rep.name}</td>
                            <td className="p-3 text-slate-600">{rep.type}</td>
                            <td className="p-3 text-slate-500 font-medium">{rep.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-3">
                    <button 
                      onClick={() => downloadFile("Facility_Energy_Report.pdf", "Energy Intelligence Audit Report 2026", "application/pdf")}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
                    >
                      Download PDF
                    </button>
                    <button 
                      onClick={() => downloadFile("Facility_Telemetry_Metrics.csv", "Metric,Value\nTotalEnergy,12450\nOccupancy,73%", "text/csv")}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
                    >
                      Download Excel
                    </button>
                    <button 
                      onClick={() => downloadFile("Facility_Telemetry_Metrics.csv", "Metric,Value\nTotalEnergy,12450\nOccupancy,73%", "text/csv")}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
                    >
                      Download CSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Generate and download various reports.
              </div>
            </div>
          )}

          {/* 10. ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Alerts</h1>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="space-y-3 text-xs">
                    {alertsList.map((alt) => (
                      <div 
                        key={alt.id} 
                        className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                          alt.severity === 'critical' ? 'border-rose-200 bg-rose-50' :
                          alt.severity === 'warning' ? 'border-amber-200 bg-amber-50' :
                          'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${
                            alt.severity === 'critical' ? 'bg-rose-600 animate-pulse' :
                            alt.severity === 'warning' ? 'bg-amber-600' : 'bg-blue-600'
                          }`} />
                          <div>
                            <h4 className="font-bold text-slate-900">{alt.title}</h4>
                            <span className="text-slate-500">{alt.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-medium">{alt.time}</span>
                          <button 
                            onClick={() => dismissAlert(alt.id)}
                            className="text-[10px] font-bold text-slate-500 hover:text-rose-600 p-1 border border-slate-200 bg-white rounded hover:bg-slate-100"
                            title="Resolve alert"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                    {alertsList.length === 0 && (
                      <div className="p-6 text-center text-slate-400 font-semibold">
                        All alerts resolved! Systems operating nominally.
                      </div>
                    )}
                  </div>

                  {alertsList.length > 0 && (
                    <div className="text-center pt-3">
                      <button 
                        onClick={() => {
                          setAlertsList([]);
                          triggerToast("All alerts resolved and triaged.");
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View all alerts
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                View and manage system alerts and notifications.
              </div>
            </div>
          )}

          {/* 11. SCHEDULES */}
          {activeTab === 'schedules' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Schedules</h1>
                  <button 
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
                  >
                    Add Schedule
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                          <th className="p-3 font-bold">Date</th>
                          <th className="p-3 font-bold">Activity</th>
                          <th className="p-3 font-bold">Time</th>
                          <th className="p-3 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedulesList.map((sch, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-medium text-slate-900">{sch.date}</td>
                            <td className="p-3 font-semibold text-slate-900">{sch.activity}</td>
                            <td className="p-3 text-slate-500">{sch.time}</td>
                            <td className="p-3">
                              <button
                                onClick={() => toggleScheduleStatus(sch.id)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity ${
                                  sch.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {sch.status} ✎
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Manage and view maintenance schedules.
              </div>
            </div>
          )}

          {/* 12. INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Integrations</h1>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
                  {[
                    "Google Maps",
                    "IoT Sensors",
                    "Email Service",
                    "SMS Service",
                    "WhatsApp API"
                  ].map((item, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {item[0]}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{item}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Connected
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Connect and manage third-party integrations.
              </div>
            </div>
          )}

          {/* 13. SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Profile Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">User Full Name</label>
                        <input 
                          type="text" 
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Role Title</label>
                        <input 
                          type="text" 
                          readOnly
                          value="Facility Administrator"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">System Preferences</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">Real-time Telemetry Notifications</span>
                          <span className="text-slate-500">Receive alert popups on anomalous sensor triggers</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notificationsEnabled}
                          onChange={(e) => {
                            setNotificationsEnabled(e.target.checked);
                            triggerToast(`Notifications ${e.target.checked ? 'enabled' : 'disabled'}`);
                          }}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">Auto-Save Telemetry Logs</span>
                          <span className="text-slate-500">Automatically sync microservice log streams to local database</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={autoSaveEnabled}
                          onChange={(e) => {
                            setAutoSaveEnabled(e.target.checked);
                            triggerToast(`Auto-save ${e.target.checked ? 'enabled' : 'disabled'}`);
                          }}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => triggerToast("Settings saved successfully!")}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 text-xs font-semibold text-slate-500">
                Manage application settings and preferences.
              </div>
            </div>
          )}

        </main>

        <Footer />
      </div>

      {/* Overlays */}
      <AddModuleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(mod) => triggerToast(`Deployed: ${mod.name}`)}
      />

      <AddWorkOrderModal 
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
        onAdd={handleAddNewWorkOrder}
      />

      <AddScheduleModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onAdd={handleAddNewSchedule}
      />

      <AskAIDrawer 
        isOpen={isAskAIDrawerOpen} 
        onClose={() => setIsAskAIDrawerOpen(false)} 
        triggerToast={triggerToast}
      />

      <OrchestrationModal 
        isOpen={isOrchestrationModalOpen} 
        onClose={() => setIsOrchestrationModalOpen(false)} 
        triggerToast={triggerToast}
      />

      <AgentDetailsModal 
        isOpen={selectedAgentDetails !== null} 
        onClose={() => setSelectedAgentDetails(null)} 
        agent={selectedAgentDetails}
        onApplyConfig={handleApplyAgentConfig}
        triggerToast={triggerToast}
      />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
