import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, AlertCircle, Play } from 'lucide-react';

const AskAIDrawer = ({ isOpen, onClose, triggerToast }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello Sarah. I'm the FacilityOps AI Core. I have consolidated telemetry from the Energy, Maintenance, Occupancy, and Security sub-agents. How can I assist you with facility optimization today?",
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const presets = [
    "Run HVAC diagnostics",
    "Identify peak demand hours",
    "Check MTBF metrics",
    "Get security incidents summary"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Trigger bot response simulation
    setIsTyping(true);
    setTimeout(() => {
      let botResponse = "";
      const textLower = textToSend.toLowerCase();

      if (textLower.includes("hvac") || textLower.includes("diagnostics")) {
        botResponse = "Initiating remote HVAC Diagnostic. Energy Agent is checking airflow dampers and chiller water feedback. Chiller COP is currently 4.1. Chilled water setpoint is optimized. No thermal anomalies detected.";
      } else if (textLower.includes("peak") || textLower.includes("demand") || textLower.includes("energy")) {
        botResponse = "Peak electricity load of 450.5 kW occurred at 14:00 UTC. Energy Agent forecasted a demand cap risk. HVAC duty cycling was engaged, reducing load by 15% and saving approximately $480 in peak demand tariffs.";
      } else if (textLower.includes("mtbf") || textLower.includes("maintenance")) {
        botResponse = "Maintenance Agent reports a current MTBF (Mean Time Between Failures) improvement of +32%. Chiller Plant Compressor B is flagged for routine gasket inspection on July 10 based on acoustic analysis.";
      } else if (textLower.includes("security") || textLower.includes("incident") || textLower.includes("events")) {
        botResponse = "Security Agent consolidated 1,204 threat triages today. 0 breach detections. Incident resolved rate is 100%. Entry Point C-4 badge scanner was recalibrated at 08:30 due to false positive alerts.";
      } else {
        botResponse = `Acknowledged. Querying the orchestration registry for: "${textToSend}". FacilityOps sub-agents report nominal conditions. Average carbon reduction is steady at 12.4% this week.`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
      triggerToast("AI Assistant responded");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-md bg-brand-sec border-l border-brand-border h-full flex flex-col justify-between shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="h-16 border-b border-brand-border px-5 flex items-center justify-between shrink-0 bg-brand-card/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-text m-0 flex items-center gap-1">
                Ops AI Console
                <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                <span className="text-[10px] text-brand-success font-semibold">Online & Synthesized</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-brand-border bg-brand-bg/50 hover:bg-brand-border/80 text-brand-textSec hover:text-brand-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-bg/15">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}>
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 shadow-sm ${
                  isBot 
                    ? 'bg-brand-accent/10 border-brand-accent/25 text-brand-accent' 
                    : 'bg-brand-border/30 border-brand-border text-brand-textSec'
                }`}>
                  {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                    isBot 
                      ? 'bg-brand-card/85 border-brand-border text-brand-text rounded-tl-none' 
                      : 'bg-brand-accent border-brand-accent/30 text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`text-[9px] text-brand-textSec font-mono ${isBot ? '' : 'text-right'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-7 h-7 rounded-full border border-brand-accent/25 bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3.5 rounded-2xl bg-brand-card/85 border border-brand-border text-brand-text rounded-tl-none flex items-center gap-1 py-2.5">
                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Area: Presets & Input */}
        <div className="p-4 border-t border-brand-border bg-brand-card/30 space-y-3 shrink-0">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSend(preset)}
                className="px-2 py-1 text-[10px] font-semibold rounded-lg border border-brand-border bg-brand-bg/50 hover:bg-brand-border/90 text-brand-textSec hover:text-brand-text transition-colors flex items-center gap-1"
              >
                <Play className="w-2.5 h-2.5 text-brand-accent" />
                {preset}
              </button>
            ))}
          </div>

          {/* Text Input Row */}
          <div className="flex gap-2 relative">
            <input
              type="text"
              placeholder="Ask FacilityOps AI..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              className="flex-1 pl-3 pr-10 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs sm:text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
            <button
              onClick={() => handleSend(inputText)}
              className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AskAIDrawer;
