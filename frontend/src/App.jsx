import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './layout/Sidebar';
import TopNavbar from './layout/TopNavbar';
import RightPanel from './layout/RightPanel';
import Footer from './layout/Footer';

// Subcomponents
import KPICard from './components/cards/KPICard';
import SensorTable from './components/SensorTable';
import AlertsSection from './components/AlertsSection';
import EnergyDistributionProgress from './components/EnergyDistributionProgress';
import RecommendationPlaceholders from './components/RecommendationPlaceholders';

// Charts
import {
  RealTimeEnergyChart,
  DailyEnergyBarChart,
  EnergyDistributionPieChart,
  WeeklyTrendAreaChart,
  MonthlyComposedChart,
  ForecastLineChart,
  HVACEfficiencyRadialChart
} from './components/charts/EnergyCharts';

// Icons
import {
  Zap,
  Gauge,
  DollarSign,
  Activity,
  Leaf,
  Flame,
  Sun,
  Droplet,
  TrendingUp,
  PiggyBank,
  FileText,
  Download,
  CheckCircle,
  Sliders,
  Bell,
  Cpu,
  Wrench,
  Users,
  Shield,
  HelpCircle,
  Settings as SettingsIcon,
  Compass,
  ArrowRight,
  ClipboardList,
  Database,
  Link,
  Plus,
  RefreshCw,
  Clock,
  Briefcase,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';

// Static Import Mock Data
import mockData from './data/mockData.json';

// Pages & Modals
import AIAgents from './pages/AIAgents';
import AddModuleModal from './components/AddModuleModal';
import AskAIDrawer from './components/AskAIDrawer';
import OrchestrationModal from './components/OrchestrationModal';
import AgentDetailsModal from './components/AgentDetailsModal';

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-agents'); // Active by default
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  
  // Modals & Overlays State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAskAIDrawerOpen, setIsAskAIDrawerOpen] = useState(false);
  const [isOrchestrationModalOpen, setIsOrchestrationModalOpen] = useState(false);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);

  // Simulate initial data load for skeleton loaders
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Helper variables derived from mockData
  const latestHour = mockData.hourlyEnergyData[mockData.hourlyEnergyData.length - 1];
  const latestDay = mockData.dailyEnergyData[mockData.dailyEnergyData.length - 1];

  // Calculations for KPI Cards
  const stats = useMemo(() => {
    const totalEnergy = mockData.dailyEnergyData.reduce((acc, curr) => acc + curr.electricity, 0);
    const totalCarbon = mockData.dailyEnergyData.reduce((acc, curr) => acc + curr.carbon, 0) / 1000;
    const totalCost = mockData.dailyEnergyData.reduce((acc, curr) => acc + curr.cost, 0);
    const savings = totalCost * 0.15; // 15% estimated savings vs baseline

    return {
      totalEnergy,
      currentPower: latestHour.electricity,
      todayCost: latestDay.cost,
      efficiency: latestHour.efficiency,
      carbon: totalCarbon,
      hvac: latestHour.hvac,
      lighting: latestHour.lighting,
      water: latestHour.water,
      peakDemand: latestDay.peakDemand,
      savings
    };
  }, [latestHour, latestDay]);

  // Formatter functions
  const formatKWh = (val) => `${Math.round(val).toLocaleString()}`;
  const formatUSD = (val) => `$${Math.round(val).toLocaleString()}`;
  const formatTons = (val) => `${val.toFixed(1)}`;
  const formatPercent = (val) => `${val.toFixed(1)}%`;
  const formatKW = (val) => `${val.toFixed(1)}`;
  const formatLiters = (val) => `${Math.round(val).toLocaleString()}`;

  // KPI Configurations for energy tab
  const kpis = [
    {
      label: "Total Energy Consumption",
      value: stats.totalEnergy,
      unit: "kWh",
      trend: "-3.2%",
      trendType: "good",
      icon: Zap,
      sparkline: mockData.dailyEnergyData.slice(-10).map(d => d.electricity),
      formatter: formatKWh
    },
    {
      label: "Current Power Usage",
      value: stats.currentPower,
      unit: "kW",
      trend: "+1.5%",
      trendType: "bad",
      icon: Gauge,
      sparkline: mockData.hourlyEnergyData.slice(-12).map(h => h.electricity),
      formatter: formatKW
    },
    {
      label: "Today's Cost",
      value: stats.todayCost,
      unit: "USD",
      trend: "-4.1%",
      trendType: "good",
      icon: DollarSign,
      sparkline: mockData.dailyEnergyData.slice(-10).map(d => d.cost),
      formatter: formatUSD
    },
    {
      label: "Efficiency Score",
      value: stats.efficiency,
      unit: "%",
      trend: "+0.8%",
      trendType: "good",
      icon: Activity,
      sparkline: mockData.hourlyEnergyData.slice(-12).map(h => h.efficiency),
      formatter: formatPercent
    },
    {
      label: "Carbon Emission",
      value: stats.carbon,
      unit: "Tons",
      trend: "-3.5%",
      trendType: "good",
      icon: Leaf,
      sparkline: mockData.dailyEnergyData.slice(-10).map(d => d.carbon),
      formatter: formatTons
    }
  ];

  // Mock handler for newly deployed module
  const handleAddNewAgentModule = (newAgent) => {
    triggerToast(`AI Agent [${newAgent.name}] deployed successfully!`);
  };

  const handleLogout = () => {
    triggerToast("Logging out... Session terminated safely.");
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex transition-all duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-brand-accent text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-white/10 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Layout */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAskAIClick={() => setIsAskAIDrawerOpen(true)}
        onLogoutClick={handleLogout}
      />

      {/* Main Core Container */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '72px' : '260px' }}
      >
        {/* Top Navbar */}
        <TopNavbar 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onHelpClick={() => triggerToast("Help system loaded. Documentation is online.")}
          onNotificationsClick={() => triggerToast("System notifications synced.")}
        />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 mt-16 space-y-6 flex-1 flex flex-col">
          
          {isLoading ? (
            /* Main Loading Skeletons */
            <div className="space-y-6">
              <div className="animate-pulse bg-brand-card/40 rounded-2xl h-16 border border-brand-border/50" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-brand-card/40 rounded-2xl h-32 border border-brand-border/50" />
                ))}
              </div>
              <div className="animate-pulse bg-brand-card/40 rounded-2xl h-96 border border-brand-border/50" />
            </div>
          ) : (
            <>
              {/* 1. AI Agents / Active Modules View (Landing Page) */}
              {(activeTab === 'ai-agents' || activeTab === 'modules-active') && (
                <AIAgents 
                  triggerToast={triggerToast}
                  onDetailsClick={(agent) => setSelectedAgentDetails(agent)}
                  onOrchestrationClick={() => setIsOrchestrationModalOpen(true)}
                  onAddModuleClick={() => setIsAddModalOpen(true)}
                />
              )}

              {/* 2. Overview Dashboard */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <h1 className="text-2xl font-bold text-brand-text tracking-tight m-0">Facility Control Overview</h1>
                      <p className="text-xs text-brand-textSec mt-1">Unified command panel for HQ Metro Facility 01</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border space-y-2">
                          <span className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider">CO2 Intensity</span>
                          <h3 className="text-xl font-bold text-brand-text">4.2 Tons</h3>
                          <span className="text-[10px] text-brand-success font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-brand-success" /> -8.4% this week
                          </span>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border space-y-2">
                          <span className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider">System Alarms</span>
                          <h3 className="text-xl font-bold text-brand-text">0 Active</h3>
                          <span className="text-[10px] text-brand-success font-semibold">All systems nominal</span>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border space-y-2">
                          <span className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider">Active Workflows</span>
                          <h3 className="text-xl font-bold text-brand-text">14 Parallel</h3>
                          <span className="text-[10px] text-brand-accent font-semibold">Orchestrated by AI</span>
                        </div>
                      </div>

                      {/* Main Overview chart */}
                      <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                        <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Facility Savings Trend</h3>
                        <div className="h-64">
                          <WeeklyTrendAreaChart weeklyData={mockData.weeklyEnergyData} />
                        </div>
                      </div>

                      <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                        <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Real-time Sensors Summary</h3>
                        <SensorTable sensorsData={mockData.sensors.slice(0, 5)} />
                      </div>
                    </div>
                    
                    <div className="lg:col-span-4 space-y-6">
                      <RightPanel />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Dashboard Tab (Energy Intelligence View) */}
              {activeTab === 'dashboard' && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <h1 className="text-2xl font-bold text-brand-text tracking-tight m-0">Energy Intelligence Dashboard</h1>
                      <p className="text-xs text-brand-textSec mt-1">Real-Time Facility Energy Monitoring & Analytics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                    <div className="xl:col-span-3 space-y-6">
                      {/* KPI Grid */}
                      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {kpis.map((kpi, idx) => (
                          <KPICard 
                            key={idx}
                            label={kpi.label}
                            value={kpi.value}
                            unit={kpi.unit}
                            trend={kpi.trend}
                            trendType={kpi.trendType}
                            icon={kpi.icon}
                            sparklineData={kpi.sparkline}
                            formatter={kpi.formatter}
                          />
                        ))}
                      </section>

                      {/* Charts Grid Row 1 */}
                      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                          <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Real-Time Energy Consumption</h3>
                          <div className="h-64">
                            <RealTimeEnergyChart hourlyData={mockData.hourlyEnergyData} />
                          </div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                          <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Daily Energy Usage</h3>
                          <div className="h-64">
                            <DailyEnergyBarChart dailyData={mockData.dailyEnergyData} />
                          </div>
                        </div>
                      </section>

                      {/* Charts Grid Row 2 */}
                      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                          <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Energy Distribution</h3>
                          <div className="h-60">
                            <EnergyDistributionPieChart dailyData={mockData.dailyEnergyData} />
                          </div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                          <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Weekly Trend</h3>
                          <div className="h-60">
                            <WeeklyTrendAreaChart weeklyData={mockData.weeklyEnergyData} />
                          </div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                          <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Monthly Consumption</h3>
                          <div className="h-60">
                            <MonthlyComposedChart dailyData={mockData.dailyEnergyData} />
                          </div>
                        </div>
                      </section>

                      <section className="grid grid-cols-1 gap-6">
                        <EnergyDistributionProgress dailyData={mockData.dailyEnergyData} />
                      </section>
                    </div>

                    <div className="xl:col-span-1 space-y-6">
                      <RightPanel />
                    </div>
                  </div>
                </>
              )}

              {/* 4. Work Orders View */}
              {activeTab === 'work-orders' && (
                <div className="space-y-6 max-w-5xl mx-auto w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-brand-text m-0">Maintenance Work Orders</h2>
                      <p className="text-xs text-brand-textSec mt-1">Autonomous maintenance dispatches and tickets log.</p>
                    </div>
                    <button 
                      onClick={() => triggerToast("New work order created")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-accent text-white hover:bg-brand-accent/90 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Create Work Order
                    </button>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl bg-brand-card/35 border border-brand-border space-y-4">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Search tickets by ID, asset, or technician..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm placeholder-brand-textSec/50 focus:outline-none focus:border-brand-accent"
                      />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-brand-border text-brand-textSec uppercase text-[10px] tracking-wider">
                            <th className="pb-3 font-semibold">Ticket ID</th>
                            <th className="pb-3 font-semibold">Asset Target</th>
                            <th className="pb-3 font-semibold">Description</th>
                            <th className="pb-3 font-semibold">Technician</th>
                            <th className="pb-3 font-semibold">Priority</th>
                            <th className="pb-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-brand-border/40 hover:bg-brand-border/10 transition-colors">
                            <td className="py-3 font-mono font-bold text-brand-accent">#WO-4921</td>
                            <td className="py-3 font-semibold text-brand-text">Chiller B plant</td>
                            <td className="py-3 text-brand-textSec">Inspect chiller compressor valve gasket seals</td>
                            <td className="py-3 text-brand-text">Sarah Jenkins</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-danger/10 text-brand-danger border border-brand-danger/20">Critical</span></td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/25">Dispatched</span></td>
                          </tr>
                          <tr className="border-b border-brand-border/40 hover:bg-brand-border/10 transition-colors">
                            <td className="py-3 font-mono font-bold text-brand-accent">#WO-4819</td>
                            <td className="py-3 font-semibold text-brand-text">Sector G VAV Box</td>
                            <td className="py-3 text-brand-textSec">Re-calibrate airflow dampers</td>
                            <td className="py-3 text-brand-text">Dave R.</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-warning/10 text-brand-warning border border-brand-warning/20">Medium</span></td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">In Progress</span></td>
                          </tr>
                          <tr className="hover:bg-brand-border/10 transition-colors">
                            <td className="py-3 font-mono font-bold text-brand-accent">#WO-4731</td>
                            <td className="py-3 font-semibold text-brand-text">Badge scanner C-4</td>
                            <td className="py-3 text-brand-textSec">Audit Entry Point C-4 badge reader scanner</td>
                            <td className="py-3 text-brand-text">Alex T.</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-border/45 text-brand-textSec border border-brand-border">Low</span></td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-success/10 text-brand-success border border-brand-success/20">Closed</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Assets View */}
              {activeTab === 'assets' && (
                <div className="space-y-6 max-w-5xl mx-auto w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-brand-text m-0">Facility Assets Inventory</h2>
                      <p className="text-xs text-brand-textSec mt-1">Audit status, location index, and health metrics of telemetry devices.</p>
                    </div>
                    <button 
                      onClick={() => triggerToast("Scanning assets network...")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-accent text-white hover:bg-brand-accent/90 transition-all"
                    >
                      Scan System Assets
                    </button>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl bg-brand-card/35 border border-brand-border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-brand-border text-brand-textSec uppercase text-[10px] tracking-wider">
                            <th className="pb-3 font-semibold">Asset ID</th>
                            <th className="pb-3 font-semibold">Type</th>
                            <th className="pb-3 font-semibold">Location</th>
                            <th className="pb-3 font-semibold">Health Score</th>
                            <th className="pb-3 font-semibold">Diagnostic Connection</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-brand-border/40">
                            <td className="py-3 font-mono font-bold text-brand-accent">#AST-CHILL-A1</td>
                            <td className="py-3 font-semibold text-brand-text">HVAC Plant Chiller A</td>
                            <td className="py-3 text-brand-textSec">Basement Plant Room B-2</td>
                            <td className="py-3 font-bold text-brand-success">98.5%</td>
                            <td className="py-3 font-mono text-[11px] text-brand-textSec">BACnet://192.168.1.12:47808</td>
                          </tr>
                          <tr className="border-b border-brand-border/40">
                            <td className="py-3 font-mono font-bold text-brand-accent">#AST-GEN-01</td>
                            <td className="py-3 font-semibold text-brand-text">Backup Generator 500kVA</td>
                            <td className="py-3 text-brand-textSec">External Yard North</td>
                            <td className="py-3 font-bold text-brand-success">100.0%</td>
                            <td className="py-3 font-mono text-[11px] text-brand-textSec">Modbus://192.168.1.50:502</td>
                          </tr>
                          <tr className="border-b border-brand-border/40">
                            <td className="py-3 font-mono font-bold text-brand-accent">#AST-CAM-SEC3</td>
                            <td className="py-3 font-semibold text-brand-text">CCTV Camera Dome v2</td>
                            <td className="py-3 text-brand-textSec">Entry Point Sector C</td>
                            <td className="py-3 font-bold text-brand-warning">91.2%</td>
                            <td className="py-3 font-mono text-[11px] text-brand-textSec">ONVIF://192.168.2.103:80</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Monitoring (Sensor Table) */}
              {activeTab === 'monitoring' && (
                <div className="space-y-6 max-w-5xl mx-auto w-full">
                  <div>
                    <h2 className="text-xl font-bold text-brand-text m-0">Live Sensors Monitoring</h2>
                    <p className="text-xs text-brand-textSec mt-1">Real-time modbus telemetry data from IoT nodes.</p>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl bg-brand-card/35 border border-brand-border">
                    <SensorTable sensorsData={mockData.sensors} />
                  </div>
                </div>
              )}

              {/* 7. Analytics */}
              {activeTab === 'analytics' && (
                <div className="space-y-6 max-w-5xl mx-auto w-full">
                  <div>
                    <h2 className="text-xl font-bold text-brand-text m-0">Data Analytics</h2>
                    <p className="text-xs text-brand-textSec mt-1">Predictive analysis and composite energy timelines.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-5 rounded-2xl bg-brand-card/35 border border-brand-border">
                      <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Carbon Footprints Forecast</h3>
                      <div className="h-64">
                        <ForecastLineChart dailyData={mockData.dailyEnergyData} />
                      </div>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl bg-brand-card/35 border border-brand-border">
                      <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">HVAC Operating Efficiency</h3>
                      <div className="h-64">
                        <HVACEfficiencyRadialChart />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Reports View */}
              {activeTab === 'reports' && (
                <div className="space-y-6 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-10">
                  <div className="glass-panel p-8 rounded-2xl bg-brand-card/30 border border-brand-border space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-brand-text m-0">Energy Intelligence Reports</h2>
                        <p className="text-xs text-brand-textSec mt-1">Compile and export automated carbon and cost statistics.</p>
                      </div>
                    </div>

                    <div className="h-px bg-brand-border" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-semibold text-brand-text">Monthly Sustainability Report</h4>
                          <p className="text-[11px] text-brand-textSec">PDF • Aggregated cost/carbon statistics for June 2026</p>
                        </div>
                        <button 
                          onClick={() => triggerToast("Generating Monthly Sustainability Report...")}
                          className="p-2 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent hover:bg-brand-accent/20 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-semibold text-brand-text">HVAC Duty Cycling Audits</h4>
                          <p className="text-[11px] text-brand-textSec">CSV • Temperature telemetry and HVAC runtimes</p>
                        </div>
                        <button 
                          onClick={() => triggerToast("Generating HVAC Duty Cycling Audit...")}
                          className="p-2 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent hover:bg-brand-accent/20 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-semibold text-brand-text">Daily Peak Demand Profile</h4>
                          <p className="text-[11px] text-brand-textSec">PDF • Peak demand analytics and sub-meter profiles</p>
                        </div>
                        <button 
                          onClick={() => triggerToast("Generating Peak Demand Profile...")}
                          className="p-2 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent hover:bg-brand-accent/20 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-semibold text-brand-text">Executive ESG Carbon Brief</h4>
                          <p className="text-[11px] text-brand-textSec">PDF • Greenhouse gas Scope 1 & 2 audit brief</p>
                        </div>
                        <button 
                          onClick={() => triggerToast("Generating ESG Carbon Brief...")}
                          className="p-2 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent hover:bg-brand-accent/20 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. Alerts View */}
              {activeTab === 'alerts' && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div>
                    <h2 className="text-xl font-bold text-brand-text m-0">Recent Alerts & Triages</h2>
                    <p className="text-xs text-brand-textSec mt-1">Telemetry triggers and system fault logs.</p>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl bg-brand-card/35 border border-brand-border">
                    <AlertsSection initialAlerts={mockData.alerts} />
                  </div>
                </div>
              )}

              {/* 10. Schedules View */}
              {activeTab === 'schedules' && (
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-brand-text m-0">Operational Schedules</h2>
                      <p className="text-xs text-brand-textSec mt-1">Calendar overrides for energy consumption profiling.</p>
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl bg-brand-card/35 border border-brand-border space-y-4">
                    <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 space-y-3">
                      <h4 className="text-sm font-semibold text-brand-text">Occupancy Profile Target Time (Weekly)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <span className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">Weekdays Duty Cycle</span>
                          <span className="text-xs font-bold text-brand-text">07:00 - 19:00 UTC (Active)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">Weekend Profile</span>
                          <span className="text-xs font-bold text-brand-text">Eco Saver mode (24h)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">Holdups Override</span>
                          <span className="text-xs font-bold text-brand-text">Disabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. Integrations View */}
              {activeTab === 'integrations' && (
                <div className="space-y-6 max-w-5xl mx-auto w-full">
                  <div>
                    <h2 className="text-xl font-bold text-brand-text m-0">Connected Integrations</h2>
                    <p className="text-xs text-brand-textSec mt-1">Protocol endpoints linking building networks to FacilityOps AI.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="glass-panel p-4 rounded-xl bg-brand-card/35 border border-brand-border space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 flex items-center justify-center">
                          <Link className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-brand-text uppercase">BACnet IP Protocol</h4>
                          <span className="text-[9px] text-brand-success font-semibold">Active & Tunneled</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-brand-textSec">Syncs HVAC plants, chiller controllers, and thermostat telemetry.</p>
                    </div>

                    <div className="glass-panel p-4 rounded-xl bg-brand-card/35 border border-brand-border space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 flex items-center justify-center">
                          <Link className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-brand-text uppercase">Modbus TCP Protocol</h4>
                          <span className="text-[9px] text-brand-success font-semibold">Active</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-brand-textSec">Controls grid substation power meters, and transformer sensors.</p>
                    </div>

                    <div className="glass-panel p-4 rounded-xl bg-brand-card/35 border border-brand-border space-y-3 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-warning/10 text-brand-warning border border-brand-warning/25 flex items-center justify-center">
                          <Link className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-brand-text uppercase">Niagara Framework</h4>
                          <span className="text-[9px] text-brand-warning font-semibold">Connecting...</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-brand-textSec">BMS endpoint integration wrapper for third-party Honeywell boxes.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 12. Settings View */}
              {activeTab === 'settings' && (
                <div className="space-y-6 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-10">
                  <div className="glass-panel p-8 rounded-2xl bg-brand-card/30 border border-brand-border space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-brand-text m-0">Facility Configuration</h2>
                        <p className="text-xs text-brand-textSec mt-1">Adjust optimization targets, utility tariffs, and agent connectivity.</p>
                      </div>
                    </div>

                    <div className="h-px bg-brand-border" />

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 space-y-3">
                        <h4 className="text-sm font-semibold text-brand-text">Utility Electricity Rate</h4>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">On-Peak Rate ($/kWh)</label>
                            <input type="number" defaultValue={0.15} className="w-full px-3 py-1.5 rounded border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent" />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">Off-Peak Rate ($/kWh)</label>
                            <input type="number" defaultValue={0.08} className="w-full px-3 py-1.5 rounded border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 space-y-3">
                        <h4 className="text-sm font-semibold text-brand-text">AI Agent Decision Thresholds</h4>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">Max Carbon Target (Monthly Tons)</label>
                            <input type="number" defaultValue={45.0} className="w-full px-3 py-1.5 rounded border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent" />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">Target HVAC Efficiency (COPs)</label>
                            <input type="number" defaultValue={4.2} className="w-full px-3 py-1.5 rounded border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-brand-accent/20 bg-brand-accent/5 text-xs text-brand-text">
                      <p><strong>BMS Settings are active in local memory cache.</strong></p>
                      <p className="text-brand-textSec mt-1">Config changes apply immediately to the AI Agents view parameters.</p>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* OVERLAY MODALS & DRAWERS */}
      <AddModuleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNewAgentModule}
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
