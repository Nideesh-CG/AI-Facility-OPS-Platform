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
  Cpu
} from 'lucide-react';

// Static Import Mock Data
import mockData from './data/mockData.json';

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('energy');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Simulate initial data load for skeleton loaders
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
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

  // KPI Configurations
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
    },
    {
      label: "HVAC Usage",
      value: stats.hvac,
      unit: "kW",
      trend: "+2.1%",
      trendType: "bad",
      icon: Flame,
      sparkline: mockData.hourlyEnergyData.slice(-12).map(h => h.hvac),
      formatter: formatKW
    },
    {
      label: "Lighting Consumption",
      value: stats.lighting,
      unit: "kW",
      trend: "-8.0%",
      trendType: "good",
      icon: Sun,
      sparkline: mockData.hourlyEnergyData.slice(-12).map(h => h.lighting),
      formatter: formatKW
    },
    {
      label: "Water Consumption",
      value: stats.water,
      unit: "L/h",
      trend: "-1.2%",
      trendType: "good",
      icon: Droplet,
      sparkline: mockData.hourlyEnergyData.slice(-12).map(h => h.water),
      formatter: formatLiters
    },
    {
      label: "Peak Demand",
      value: stats.peakDemand,
      unit: "kW",
      trend: "-0.5%",
      trendType: "good",
      icon: TrendingUp,
      sparkline: mockData.dailyEnergyData.slice(-10).map(d => d.peakDemand),
      formatter: formatKW
    },
    {
      label: "Savings Generated",
      value: stats.savings,
      unit: "USD",
      trend: "+12.5%",
      trendType: "good",
      icon: PiggyBank,
      sparkline: mockData.dailyEnergyData.slice(-10).map(d => d.cost * 0.15),
      formatter: formatUSD
    }
  ];

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
      />

      {/* Main Core Container */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '72px' : '260px' }}
      >
        {/* Top Navbar */}
        <TopNavbar sidebarCollapsed={sidebarCollapsed} />

        {/* Main Content Area */}
        <main className="p-6 mt-16 space-y-6 flex-1 flex flex-col">
          {activeTab === 'energy' && (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <h1 className="text-2xl font-bold text-brand-text tracking-tight m-0">
                    Energy Intelligence Dashboard
                  </h1>
                  <p className="text-xs text-brand-textSec mt-1">Real-Time Facility Energy Monitoring</p>
                </div>
              </div>

              {/* Loading Skeletons */}
              {isLoading ? (
                <div className="space-y-6">
                  {/* KPI Grid Skeleton */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="animate-pulse bg-brand-card/40 rounded-2xl h-32 border border-brand-border/50" />
                    ))}
                  </div>
                  {/* Charts Grid Skeleton */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="animate-pulse bg-brand-card/40 rounded-2xl h-80 border border-brand-border/50" />
                      <div className="animate-pulse bg-brand-card/40 rounded-2xl h-80 border border-brand-border/50" />
                    </div>
                    <div className="animate-pulse bg-brand-card/40 rounded-2xl h-[660px] border border-brand-border/50" />
                  </div>
                </div>
              ) : (
                /* Actual Energy Intelligence Content */
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                  
                  {/* Left Main Panels (3 Columns) */}
                  <div className="xl:col-span-3 space-y-6">
                    
                    {/* First Section: KPI Cards Grid */}
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

                    {/* Second Section: Large Charts */}
                    <section className="space-y-6">
                      
                      {/* Charts Row 1: Real-time and daily load */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      </div>

                      {/* Charts Row 2: Distribution, Weekly, Monthly */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      </div>

                      {/* Charts Row 3: Forecast and HVAC Radial */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                          <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Energy Load Forecast</h3>
                          <div className="h-60">
                            <ForecastLineChart dailyData={mockData.dailyEnergyData} />
                          </div>
                        </div>
                        <div className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                          <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">HVAC Operating Efficiency</h3>
                          <div className="h-60">
                            <HVACEfficiencyRadialChart />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Third Section: Subsystem breakdown progress bars */}
                    <section className="grid grid-cols-1 gap-6">
                      <EnergyDistributionProgress dailyData={mockData.dailyEnergyData} />
                    </section>

                    {/* Fourth Section: Sensor Table */}
                    <section className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                      <SensorTable sensorsData={mockData.sensors} />
                    </section>

                    {/* Fifth Section: Recent Alerts */}
                    <section className="glass-panel p-5 rounded-2xl bg-brand-card/25 border border-brand-border">
                      <AlertsSection initialAlerts={mockData.alerts} />
                    </section>

                    {/* Sixth Section: AI Recommendation Elegant Placeholders */}
                    <section>
                      <RecommendationPlaceholders />
                    </section>
                  </div>

                  {/* Right Panel Utility Column (1 Column) */}
                  <div className="space-y-6">
                    <RightPanel />
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'reports' && (
            /* Reports View Page (Placeholder) */
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

                <div className="p-4 rounded-xl border border-brand-accent/20 bg-brand-accent/5 text-xs text-brand-text">
                  <p><strong>Energy reports will be compiled and displayed here once data aggregation services are enabled.</strong></p>
                  <p className="text-brand-textSec mt-1">This report dashboard acts as a preview layout for Milestone 1. Clicking download triggers background generation simulations.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            /* Settings View Page (Placeholder) */
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
                  {/* Settings Row 1 */}
                  <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 space-y-3">
                    <h4 className="text-sm font-semibold text-brand-text">Utility Electricity Rate (SaaS Baseline)</h4>
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

                  {/* Settings Row 2 */}
                  <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 space-y-3">
                    <h4 className="text-sm font-semibold text-brand-text">AI Agent Decision Thresholds</h4>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">Max Allowable Carbon Target (Monthly Tons)</label>
                        <input type="number" defaultValue={45.0} className="w-full px-3 py-1.5 rounded border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] text-brand-textSec uppercase font-bold block mb-1">Target HVAC Efficiency (COPs)</label>
                        <input type="number" defaultValue={4.2} className="w-full px-3 py-1.5 rounded border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent" />
                      </div>
                    </div>
                  </div>

                  {/* Settings Row 3 */}
                  <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-brand-text">Energy Agent Connection String</h4>
                      <p className="text-[11px] text-brand-textSec">ws://localhost:8080/api/v1/agent/energy-controller</p>
                    </div>
                    <button 
                      onClick={() => triggerToast("Connection parameters saved locally.")}
                      className="px-4 py-1.5 text-xs font-semibold rounded bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors"
                    >
                      Save Parameters
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-brand-accent/20 bg-brand-accent/5 text-xs text-brand-text">
                  <p><strong>BMS Configuration and integration settings will appear here.</strong></p>
                  <p className="text-brand-textSec mt-1">Adjusted settings are updated instantly inside the frontend state. Permanent database syncing is locked until Milestone 2.</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
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
