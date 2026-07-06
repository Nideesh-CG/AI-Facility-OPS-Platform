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

// Global Chart Mapped Styles based on Theme
const useChartTheme = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    gridStroke: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)',
    textFill: isDark ? '#9CA3AF' : '#475569',
    tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
    accentColor: isDark ? '#3B82F6' : '#2563EB',
    successColor: isDark ? '#22C55E' : '#16A34A',
    warningColor: isDark ? '#F59E0B' : '#D97706',
    dangerColor: isDark ? '#EF4444' : '#DC2626',
    purpleColor: isDark ? '#A855F7' : '#7C3AED',
    hvacColor: isDark ? '#F43F5E' : '#E11D48',
    lightingColor: isDark ? '#EAB308' : '#CA8A04',
    equipmentColor: isDark ? '#06B6D4' : '#0891B2',
    elevatorColor: isDark ? '#10B981' : '#059669',
  };
};

/* 1. Real-Time Energy Consumption (Line Chart, Last 24 Hours) */
export const RealTimeEnergyChart = ({ hourlyData }) => {
  const colors = useChartTheme();
  
  // Take last 24 hours of data
  const data = hourlyData.slice(-24).map(d => {
    const timeStr = new Date(d.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return {
      ...d,
      time: timeStr
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="time" stroke={colors.textFill} fontSize={11} tickLine={false} />
        <YAxis stroke={colors.textFill} fontSize={11} tickLine={false} unit="kW" />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px' }} 
          labelStyle={{ color: colors.textFill, fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
        <Line 
          type="monotone" 
          dataKey="electricity" 
          name="Grid Load" 
          stroke={colors.accentColor} 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="hvac" 
          name="HVAC" 
          stroke={colors.hvacColor} 
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

/* 2. Daily Energy Usage (Stacked Bar Chart, Last 7 Days) */
export const DailyEnergyBarChart = ({ dailyData }) => {
  const colors = useChartTheme();
  const data = dailyData.slice(-7);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="date" stroke={colors.textFill} fontSize={11} tickLine={false} />
        <YAxis stroke={colors.textFill} fontSize={11} tickLine={false} unit="kWh" />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px' }} 
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
        <Bar dataKey="hvac" name="HVAC" stackId="a" fill={colors.hvacColor} radius={[0, 0, 0, 0]} />
        <Bar dataKey="lighting" name="Lighting" stackId="a" fill={colors.lightingColor} radius={[0, 0, 0, 0]} />
        <Bar dataKey="equipment" name="Equipment" stackId="a" fill={colors.equipmentColor} radius={[0, 0, 0, 0]} />
        <Bar dataKey="elevators" name="Elevators" stackId="a" fill={colors.elevatorColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 3. Energy Distribution (Pie Chart, 30 Days Split) */
export const EnergyDistributionPieChart = ({ dailyData }) => {
  const colors = useChartTheme();

  // Aggregate totals
  const totals = dailyData.reduce((acc, curr) => {
    acc.hvac += curr.hvac;
    acc.lighting += curr.lighting;
    acc.equipment += curr.equipment;
    acc.elevators += curr.elevators;
    return acc;
  }, { hvac: 0, lighting: 0, equipment: 0, elevators: 0 });

  const totalSum = totals.hvac + totals.lighting + totals.equipment + totals.elevators;
  
  const data = [
    { name: 'HVAC', value: Math.round((totals.hvac / totalSum) * 100), raw: totals.hvac, fill: colors.hvacColor },
    { name: 'Lighting', value: Math.round((totals.lighting / totalSum) * 100), raw: totals.lighting, fill: colors.lightingColor },
    { name: 'Equipment', value: Math.round((totals.equipment / totalSum) * 100), raw: totals.equipment, fill: colors.equipmentColor },
    { name: 'Elevators', value: Math.round((totals.elevators / totalSum) * 100), raw: totals.elevators, fill: colors.elevatorColor }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="48%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Distribution']}
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px' }} 
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

/* 4. Weekly Trend (Area Chart, Last 4 Weeks) */
export const WeeklyTrendAreaChart = ({ weeklyData }) => {
  const colors = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="areaElec" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.accentColor} stopOpacity={0.25} />
            <stop offset="95%" stopColor={colors.accentColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="week" stroke={colors.textFill} fontSize={11} tickLine={false} />
        <YAxis stroke={colors.textFill} fontSize={11} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px' }} 
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
        <Area 
          type="monotone" 
          dataKey="electricity" 
          name="Usage (kWh)" 
          stroke={colors.accentColor} 
          fillOpacity={1} 
          fill="url(#areaElec)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/* 5. Monthly Consumption & Efficiency (Composed Chart, 30 Days) */
export const MonthlyComposedChart = ({ dailyData }) => {
  const colors = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={dailyData} margin={{ top: 10, right: -15, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="date" stroke={colors.textFill} fontSize={9} tickLine={false} />
        <YAxis yAxisId="left" stroke={colors.textFill} fontSize={11} tickLine={false} unit="kWh" />
        <YAxis yAxisId="right" orientation="right" stroke={colors.textFill} fontSize={11} tickLine={false} unit="%" />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px' }} 
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
        <Bar yAxisId="left" dataKey="electricity" name="Consumption" fill={colors.accentColor} opacity={0.7} radius={[2, 2, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency Score" stroke={colors.purpleColor} strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

/* 6. Energy Forecast (Line Chart, Actuals vs Forecast) */
export const ForecastLineChart = ({ dailyData }) => {
  const colors = useChartTheme();

  // Create actual vs forecast split (last 20 days as actual, last 10 days as forecast)
  const data = dailyData.map((d, idx) => {
    if (idx < 20) {
      return {
        date: d.date,
        Actual: d.electricity,
        Forecast: null
      };
    } else if (idx === 20) {
      // Connect line at boundary
      return {
        date: d.date,
        Actual: d.electricity,
        Forecast: d.electricity
      };
    } else {
      return {
        date: d.date,
        Actual: null,
        Forecast: parseFloat((d.electricity * (1 + Math.sin(idx) * 0.06)).toFixed(1))
      };
    }
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
        <XAxis dataKey="date" stroke={colors.textFill} fontSize={9} tickLine={false} />
        <YAxis stroke={colors.textFill} fontSize={11} tickLine={false} unit="kWh" />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px' }} 
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
        <Line 
          type="monotone" 
          dataKey="Actual" 
          name="Actual Load" 
          stroke={colors.accentColor} 
          strokeWidth={2} 
          dot={false} 
        />
        <Line 
          type="monotone" 
          dataKey="Forecast" 
          name="AI Forecasted Load" 
          stroke={colors.purpleColor} 
          strokeWidth={2} 
          strokeDasharray="5 5" 
          dot={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

/* 7. HVAC Operating Efficiency (Radial Chart) */
export const HVACEfficiencyRadialChart = () => {
  const colors = useChartTheme();

  const data = [
    { name: 'Target', value: 95, fill: colors.gridStroke },
    { name: 'Current HVAC', value: 88, fill: colors.successColor }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="60%" 
        outerRadius="90%" 
        barSize={12} 
        data={data}
        startAngle={180}
        endAngle={-180}
      >
        <RadialBar
          minAngle={15}
          label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
          background
          clockWise
          dataKey="value"
        />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px' }} 
        />
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11 }} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
