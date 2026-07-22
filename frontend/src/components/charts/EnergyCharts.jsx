import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  RadialBarChart,
  RadialBar
} from 'recharts';

const useChartTheme = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    gridStroke: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
    textFill: isDark ? '#9CA3AF' : '#64748B',
    tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1',
    accentColor: '#2563EB',
    successColor: '#16A34A',
    warningColor: '#D97706',
    dangerColor: '#DC2626',
    purpleColor: '#9333EA',
    hvacColor: '#2563EB',
    lightingColor: '#D97706',
    equipmentColor: '#16A34A',
    elevatorColor: '#9333EA',
  };
};

/* 1. Real-Time Energy Consumption (Line Chart, Last 24 Hours) */
export const RealTimeEnergyChart = ({ hourlyData = [] }) => {
  const colors = useChartTheme();
  
  const data = (hourlyData.length > 0 ? hourlyData : [
    { timeDisplay: '00:00', electricity: 280, hvac: 120 },
    { timeDisplay: '04:00', electricity: 220, hvac: 95 },
    { timeDisplay: '08:00', electricity: 410, hvac: 190 },
    { timeDisplay: '12:00', electricity: 520, hvac: 240 },
    { timeDisplay: '16:00', electricity: 480, hvac: 210 },
    { timeDisplay: '20:00', electricity: 340, hvac: 150 }
  ]).map(d => ({
    ...d,
    time: d.timeDisplay || d.time || d.timestamp || '00:00',
    gridLoad: d.electricity || d.power || 300,
    hvacLoad: d.hvac || (d.electricity ? d.electricity * 0.45 : 135)
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="time" stroke={colors.textFill} fontSize={11} tickLine={false} />
        <YAxis stroke={colors.textFill} fontSize={11} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          labelStyle={{ color: '#0F172A', fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
        <Line 
          type="monotone" 
          dataKey="gridLoad" 
          name="Grid Load (kW)" 
          stroke={colors.accentColor} 
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="hvacLoad" 
          name="HVAC (kW)" 
          stroke={colors.warningColor} 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

/* 2. Daily Energy Usage (Stacked Bar Chart for Dashboard) */
export const DailyEnergyBarChart = ({ dailyData = [] }) => {
  const colors = useChartTheme();

  const rawData = dailyData.length > 0 ? dailyData.slice(-7) : [
    { date: 'Mon', electricity: 12450, hvac: 5600, lighting: 2490, equipment: 3110, elevators: 1250 },
    { date: 'Tue', electricity: 12800, hvac: 5760, lighting: 2560, equipment: 3200, elevators: 1280 },
    { date: 'Wed', electricity: 12100, hvac: 5445, lighting: 2420, equipment: 3025, elevators: 1210 },
    { date: 'Thu', electricity: 12650, hvac: 5692, lighting: 2530, equipment: 3162, elevators: 1266 },
    { date: 'Fri', electricity: 13100, hvac: 5895, lighting: 2620, equipment: 3275, elevators: 1310 },
    { date: 'Sat', electricity: 9800, hvac: 4410, lighting: 1960, equipment: 2450, elevators: 980 },
    { date: 'Sun', electricity: 8900, hvac: 4005, lighting: 1780, equipment: 2225, elevators: 890 }
  ];

  const data = rawData.map(d => {
    const total = d.electricity || 12000;
    return {
      date: d.date || d.name || d.timeDisplay || 'Day',
      hvac: d.hvac || Math.round(total * 0.45),
      lighting: d.lighting || Math.round(total * 0.20),
      equipment: d.equipment || Math.round(total * 0.25),
      elevators: d.elevators || Math.round(total * 0.10)
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="date" stroke={colors.textFill} fontSize={11} tickLine={false} />
        <YAxis stroke={colors.textFill} fontSize={11} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
        <Bar dataKey="hvac" name="HVAC (kWh)" stackId="a" fill={colors.hvacColor} radius={[0, 0, 0, 0]} />
        <Bar dataKey="lighting" name="Lighting" stackId="a" fill={colors.lightingColor} radius={[0, 0, 0, 0]} />
        <Bar dataKey="equipment" name="Equipment" stackId="a" fill={colors.equipmentColor} radius={[0, 0, 0, 0]} />
        <Bar dataKey="elevators" name="Elevators" stackId="a" fill={colors.elevatorColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 3. Weekly Savings & Performance Trend (Area Chart for Overview) */
export const WeeklyTrendAreaChart = ({ weeklyData = [] }) => {
  const colors = useChartTheme();

  const rawData = weeklyData.length > 0 ? weeklyData : [
    { name: 'Mon', electricity: 12000, cost: 1800 },
    { name: 'Tue', electricity: 12450, cost: 1867 },
    { name: 'Wed', electricity: 11800, cost: 1770 },
    { name: 'Thu', electricity: 12100, cost: 1815 },
    { name: 'Fri', electricity: 12900, cost: 1935 },
    { name: 'Sat', electricity: 9500, cost: 1425 },
    { name: 'Sun', electricity: 8800, cost: 1320 }
  ];

  const data = rawData.map(d => ({
    label: d.name || d.week || d.date || 'Day',
    electricity: d.electricity || d.value || 12000
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="overviewArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.accentColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={colors.accentColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="label" stroke={colors.textFill} fontSize={11} tickLine={false} />
        <YAxis stroke={colors.textFill} fontSize={11} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
        <Area 
          type="monotone" 
          dataKey="electricity" 
          name="Performance Load (kWh)" 
          stroke={colors.accentColor} 
          fillOpacity={1} 
          fill="url(#overviewArea)" 
          strokeWidth={2.5}
          dot={{ r: 4, fill: colors.accentColor }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/* 4. Monthly Consumption & Efficiency (Composed Chart for Analytics) */
export const MonthlyComposedChart = ({ dailyData = [] }) => {
  const colors = useChartTheme();

  const data = (dailyData.length > 0 ? dailyData : Array.from({ length: 14 }, (_, i) => ({ date: `May ${i+1}`, electricity: 11000 + (i%5)*400 }))).map((d, i) => ({
    date: d.timeDisplay || d.date || `May ${i+1}`,
    electricity: d.electricity || 12000,
    efficiency: d.efficiency || Math.round(82 + Math.sin(i)*6)
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="date" stroke={colors.textFill} fontSize={10} tickLine={false} />
        <YAxis yAxisId="left" stroke={colors.textFill} fontSize={10} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" stroke={colors.textFill} fontSize={10} tickLine={false} unit="%" />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
        <Bar yAxisId="left" dataKey="electricity" name="Consumption (kWh)" fill={colors.accentColor} opacity={0.8} radius={[3, 3, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency Score (%)" stroke={colors.purpleColor} strokeWidth={2.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

/* 5. Energy Distribution (Pie Chart) */
export const EnergyDistributionPieChart = ({ dailyData = [] }) => {
  const colors = useChartTheme();

  const data = [
    { name: 'HVAC', value: 45, fill: colors.hvacColor },
    { name: 'Lighting', value: 20, fill: colors.lightingColor },
    { name: 'Equipment', value: 25, fill: colors.equipmentColor },
    { name: 'Elevators', value: 10, fill: colors.elevatorColor }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="48%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Share']}
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px' }} 
        />
        <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
