import React from 'react';
import { Brain, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const RecommendationPlaceholders = () => {
  const mockPlaceholders = [
    {
      title: "HVAC Duty Cycling Optimization",
      desc: "AI Agent will analyze external temperature forecast and pre-cool the East Wing lobby to reduce peak grid draw.",
      estSavings: "Est. $185 / week",
      impact: "High Impact"
    },
    {
      title: "Smart Lighting setbacks",
      desc: "Automatically schedule lighting power reduction to 15% in basement garages based on historic low occupancy patterns.",
      estSavings: "Est. $60 / week",
      impact: "Medium Impact"
    },
    {
      title: "Chiller Temperature Reset",
      desc: "Dynamic supply air temperature adjustments based on real-time server rack heat loads rather than fixed static curves.",
      estSavings: "Est. $310 / week",
      impact: "Critical Impact"
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl bg-brand-card/30 border border-brand-border space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-brand-text flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-accent animate-pulse" />
            AI Energy Recommendations
          </h3>
          <p className="text-xs text-brand-textSec mt-1">Autonomous recommendations compiled by the FacilityOps Energy Agent.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Awaiting Integration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockPlaceholders.map((rec, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl border border-brand-border bg-brand-bg/30 relative overflow-hidden group hover:border-brand-accent/40 transition-colors"
          >
            <div className="absolute top-2 right-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-textSec/30 group-hover:text-brand-accent/50 transition-colors" />
            </div>
            
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-border/30 text-brand-textSec inline-block mb-3">
              {rec.impact}
            </span>
            <h4 className="text-sm font-semibold text-brand-text mb-1">{rec.title}</h4>
            <p className="text-xs text-brand-textSec leading-relaxed mb-4">{rec.desc}</p>
            
            <div className="flex justify-between items-center text-xs font-semibold pt-3 border-t border-brand-border/40">
              <span className="text-brand-success">{rec.estSavings}</span>
              <span className="text-[10px] text-brand-textSec/40 uppercase tracking-wider">Locked</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Overlay Callout */}
      <div className="p-4 rounded-xl border border-brand-accent/20 bg-brand-accent/5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
        <div className="text-xs text-brand-text">
          <strong className="font-semibold text-brand-text">Energy recommendations will appear here once the Energy Agent is integrated.</strong>
          <span className="block text-brand-textSec mt-1">
            Milestone 2 will establish the WebSocket connection to the AI Energy Agent for streaming live optimization actions.
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPlaceholders;
