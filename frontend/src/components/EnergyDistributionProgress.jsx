import React from 'react';
import { motion } from 'framer-motion';

const EnergyDistributionProgress = ({ dailyData }) => {
  // Aggregate total consumption
  const totals = dailyData.reduce((acc, curr) => {
    acc.hvac += curr.hvac;
    acc.lighting += curr.lighting;
    acc.equipment += curr.equipment;
    acc.elevators += curr.elevators;
    return acc;
  }, { hvac: 0, lighting: 0, equipment: 0, elevators: 0 });

  const totalSum = totals.hvac + totals.lighting + totals.equipment + totals.elevators;
  
  // Custom auxiliary "Other Systems" slice
  const otherSum = totalSum * 0.052; // 5.2% auxiliary
  const grandTotal = totalSum + otherSum;

  const distribution = [
    { name: 'HVAC Systems', percentage: ((totals.hvac / grandTotal) * 100).toFixed(1), color: 'bg-rose-500', value: totals.hvac },
    { name: 'Lighting Control', percentage: ((totals.lighting / grandTotal) * 100).toFixed(1), color: 'bg-amber-500', value: totals.lighting },
    { name: 'Primary Equipment', percentage: ((totals.equipment / grandTotal) * 100).toFixed(1), color: 'bg-cyan-500', value: totals.equipment },
    { name: 'Elevator Central Core', percentage: ((totals.elevators / grandTotal) * 100).toFixed(1), color: 'bg-emerald-500', value: totals.elevators },
    { name: 'Auxiliary (Other)', percentage: '5.2', color: 'bg-purple-500', value: otherSum }
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl bg-brand-card/30 border border-brand-border h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-brand-text mb-4 uppercase tracking-wider">Subsystem Breakdown</h3>
        <p className="text-xs text-brand-textSec mb-6">Percentage share of total aggregated energy consumption across 30 days.</p>
      </div>

      <div className="space-y-4">
        {distribution.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-brand-text flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                {item.name}
              </span>
              <span className="text-brand-textSec">
                {item.percentage}% <span className="text-[10px] text-brand-textSec/50 font-normal">({Math.round(item.value / 1000)} MWh)</span>
              </span>
            </div>
            <div className="h-2 w-full bg-brand-bg rounded-full overflow-hidden border border-brand-border/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                className={`h-full ${item.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyDistributionProgress;
