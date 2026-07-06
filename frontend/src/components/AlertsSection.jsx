import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const AlertsSection = ({ initialAlerts }) => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleAction = (alertId, currentAction) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => {
        if (alert.id === alertId) {
          if (currentAction === 'Acknowledge') {
            return { ...alert, status: 'Acknowledged', action: 'Clear' };
          } else if (currentAction === 'Investigate') {
            return { ...alert, status: 'Acknowledged', action: 'Clear' };
          } else if (currentAction === 'Clear') {
            // We just remove the alert, or we can mark it as resolved.
            // Let's filter it out, or mark it resolved. Let's mark it as resolved.
            return { ...alert, status: 'Resolved', action: 'Archive' };
          }
        }
        return alert;
      })
    );
  };

  const getAlertStyles = (severity, status) => {
    if (status === 'Resolved') {
      return {
        bg: 'bg-brand-success/5 border-brand-success/10 opacity-60',
        text: 'text-brand-textSec',
        icon: Check,
        iconColor: 'text-brand-success bg-brand-success/10 border-brand-success/20'
      };
    }

    if (severity === 'Critical') {
      return {
        bg: 'bg-brand-danger/5 border-brand-danger/20',
        text: 'text-brand-text',
        icon: AlertCircle,
        iconColor: 'text-brand-danger bg-brand-danger/10 border-brand-danger/20'
      };
    }
    if (severity === 'Warning') {
      return {
        bg: 'bg-brand-warning/5 border-brand-warning/20',
        text: 'text-brand-text',
        icon: AlertTriangle,
        iconColor: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20'
      };
    }
    return {
      bg: 'bg-brand-accent/5 border-brand-border',
      text: 'text-brand-text',
      icon: Info,
      iconColor: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20'
    };
  };

  const activeAlerts = alerts.filter(a => a.action !== 'Archive');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-brand-text">Active System Alerts</h3>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-danger/10 text-brand-danger border border-brand-danger/20">
          {activeAlerts.filter(a => a.severity === 'Critical').length} Critical
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert) => {
              const styles = getAlertStyles(alert.severity, alert.status);
              const AlertIcon = styles.icon;
              const formattedTime = new Date(alert.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${styles.bg}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Severity Icon */}
                    <div className={`p-2 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${styles.iconColor}`}>
                      <AlertIcon className="w-4 h-4" />
                    </div>
                    {/* Content */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${alert.severity === 'Critical' ? 'text-brand-danger' : alert.severity === 'Warning' ? 'text-brand-warning' : 'text-brand-accent'}`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-brand-textSec font-mono">{formattedTime}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-bg border border-brand-border text-brand-textSec font-medium">
                          {alert.location}
                        </span>
                        {alert.status === 'Acknowledged' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-brand-success/15 text-brand-success font-bold uppercase">
                            ACKED
                          </span>
                        )}
                        {alert.status === 'Resolved' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-brand-success/15 text-brand-success font-bold uppercase">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-text mt-1.5 font-medium leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                    {alert.action !== 'Archive' && (
                      <button
                        onClick={() => handleAction(alert.id, alert.action)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          alert.action === 'Clear' 
                            ? 'bg-brand-success/10 hover:bg-brand-success/20 text-brand-success border border-brand-success/20' 
                            : alert.severity === 'Critical'
                            ? 'bg-brand-danger/10 hover:bg-brand-danger/20 text-brand-danger border border-brand-danger/20'
                            : 'bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent border border-brand-accent/20'
                        }`}
                      >
                        <span>{alert.action}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              layout
              className="p-8 text-center border border-dashed border-brand-border rounded-xl bg-brand-card/5 text-brand-textSec"
            >
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-brand-success" />
              <p className="text-xs font-medium">All clear. No active system alerts reported.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertsSection;
