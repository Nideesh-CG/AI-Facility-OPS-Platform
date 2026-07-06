import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Count-up helper component for smooth number transitions
const AnimatedNumber = ({ value, duration = 1000, formatter }) => {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    let startTime;
    const endValue = parseFloat(value);
    
    if (isNaN(endValue)) {
      setCurrentVal(value);
      return;
    }

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progressPercent * (2 - progressPercent);
      const current = easeProgress * endValue;

      setCurrentVal(current);

      if (progressPercent < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentVal(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{formatter ? formatter(currentVal) : currentVal.toFixed(1)}</span>;
};

const KPICard = ({ 
  label, 
  value, 
  unit = '', 
  trend, 
  trendDirection = 'up', // 'up' or 'down'
  trendType = 'neutral',  // 'good', 'bad', 'neutral'
  icon: Icon, 
  sparklineData = [],
  formatter
}) => {
  // Sparkline dimensions
  const width = 120;
  const height = 40;

  // Calculate SVG path for the sparkline
  const getSparklinePaths = () => {
    if (!sparklineData || sparklineData.length < 2) return { strokePath: '', areaPath: '' };
    
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min === 0 ? 1 : max - min;
    
    const points = sparklineData.map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * (width - 4) + 2;
      // Subtracting 4 to leave a small padding at the top/bottom
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return { x, y };
    });

    const strokePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    // For area under sparkline
    const areaPath = `
      ${strokePath} 
      L ${points[points.length - 1].x} ${height} 
      L ${points[0].x} ${height} 
      Z
    `;

    return { strokePath, areaPath };
  };

  const { strokePath, areaPath } = getSparklinePaths();

  // Color mapping based on trendType (good vs bad vs neutral)
  const getTrendColor = () => {
    if (trendType === 'good') return 'text-brand-success bg-brand-success/10 border-brand-success/20';
    if (trendType === 'bad') return 'text-brand-danger bg-brand-danger/10 border-brand-danger/20';
    return 'text-brand-warning bg-brand-warning/10 border-brand-warning/20';
  };

  const getSparklineColor = () => {
    if (trendType === 'good') return 'var(--success-color)';
    if (trendType === 'bad') return 'var(--danger-color)';
    return 'var(--accent-color)';
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-panel p-5 rounded-2xl bg-brand-card/30 border border-brand-border flex flex-col justify-between h-36 relative overflow-hidden"
    >
      {/* Top Section: Icon & Trend */}
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-xl bg-brand-bg/50 border border-brand-border text-brand-textSec">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTrendColor()}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Bottom Section: Label & Value / Sparkline */}
      <div className="flex justify-between items-end mt-4">
        <div>
          <span className="text-[11px] font-semibold text-brand-textSec uppercase tracking-wider block mb-1">
            {label}
          </span>
          <div className="text-xl lg:text-2xl font-bold text-brand-text tracking-tight flex items-baseline">
            <AnimatedNumber value={value} formatter={formatter} />
            {unit && <span className="text-xs font-semibold text-brand-textSec ml-1">{unit}</span>}
          </div>
        </div>

        {/* Sparkline Visual */}
        {sparklineData.length > 0 && (
          <div className="w-[120px] h-[40px] opacity-75 hover:opacity-100 transition-opacity">
            <svg width={width} height={height}>
              <defs>
                <linearGradient id={`sparklineGrad-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getSparklineColor()} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={getSparklineColor()} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <path
                d={areaPath}
                fill={`url(#sparklineGrad-${label.replace(/\s+/g, '')})`}
              />
              <path
                d={strokePath}
                fill="none"
                stroke={getSparklineColor()}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;
