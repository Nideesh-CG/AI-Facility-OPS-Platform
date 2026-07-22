import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

const RecommendationPlaceholders = ({ recommendations, isConnected: propIsConnected }) => {
  const [recs, setRecs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (recommendations) {
      setRecs(recommendations);
      setIsConnected(propIsConnected !== undefined ? propIsConnected : true);
      setIsLoading(false);
      return;
    }

    const fetchRecs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/energy/recommendations");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setRecs(data);
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.error("Failed to load live recommendations", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecs();
  }, [recommendations, propIsConnected]);

  const activeRecs = recs;

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
        
        {isConnected ? (
          <div className="flex items-center gap-1.5 text-xs text-brand-success bg-brand-success/10 border border-brand-success/20 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-brand-success" />
            <span>Live & Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-brand-textSec bg-brand-border/30 border border-brand-border px-3 py-1 rounded-full">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Awaiting Integration</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeRecs.map((rec) => (
          <div 
            key={rec.id}
            className="p-4 rounded-xl border border-brand-border bg-brand-bg/30 relative overflow-hidden group hover:border-brand-accent/40 transition-colors flex flex-col justify-between"
          >
            <div className="absolute top-2 right-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-textSec/30 group-hover:text-brand-accent/50 transition-colors" />
            </div>
            
            <div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded inline-block mb-3 ${
                rec.priority === 'High' || rec.priority === 'Critical'
                  ? 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20'
                  : 'bg-brand-border/40 text-brand-textSec'
              }`}>
                {rec.priority} Impact
              </span>
              <h4 className="text-sm font-semibold text-brand-text mb-1">{rec.title}</h4>
              <p className="text-xs text-brand-textSec leading-relaxed mb-4">{rec.reason}</p>
            </div>
            
            <div className="flex justify-between items-center text-xs font-semibold pt-3 border-t border-brand-border/40 mt-auto">
              <span className="text-brand-success">{rec.savings}</span>
              <span className="text-[10px] text-brand-textSec/40 uppercase tracking-wider">
                {isConnected ? 'Active' : 'Locked'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Overlay Callout */}
      {isConnected ? (
        <div className="p-4 rounded-xl border border-brand-success/20 bg-brand-success/5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
          <div className="text-xs text-brand-text">
            <strong className="font-semibold text-brand-success">Energy Agent successfully integrated.</strong>
            <span className="block text-brand-textSec mt-1">
              Live recommendations are compiled dynamically from current facility telemetry streams.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-brand-accent/20 bg-brand-accent/5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
          <div className="text-xs text-brand-text">
            <strong className="font-semibold text-brand-text">Energy recommendations will appear here once the Energy Agent is integrated.</strong>
            <span className="block text-brand-textSec mt-1">
              Start the Python backend service to establish the REST connection to the AI Energy Agent.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPlaceholders;
