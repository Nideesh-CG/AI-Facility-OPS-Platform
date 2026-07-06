import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Cpu, Server, Shield, Layers } from 'lucide-react';

const AddModuleModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('operations');
  const [priority, setPriority] = useState('medium');
  const [memory, setMemory] = useState('256MB');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.toUpperCase() + ' AGENT',
      category,
      priority,
      memory,
      id: name.toLowerCase().replace(/\s+/g, '-')
    });
    
    // Reset form
    setName('');
    setCategory('operations');
    setPriority('medium');
    setMemory('256MB');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-card p-6 shadow-2xl z-10 relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-accent/10 blur-xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-brand-border bg-brand-bg/50 hover:bg-brand-border/80 text-brand-textSec hover:text-brand-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent shadow-inner">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text tracking-tight m-0">Deploy AI Agent Module</h3>
            <p className="text-[11px] text-brand-textSec mt-0.5">Configure and initialize a new autonomous sub-agent.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Agent Module Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Thermal, Water Loop, Elevator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-textSec/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent transition-colors"
              >
                <option value="operations">Operations</option>
                <option value="maintenance">Maintenance</option>
                <option value="sustainability">Sustainability</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Memory Cap</label>
              <select 
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent transition-colors"
              >
                <option value="128MB">128 MB</option>
                <option value="256MB">256 MB</option>
                <option value="512MB">512 MB</option>
                <option value="1GB">1024 MB</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Operational Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    priority === p 
                      ? 'bg-brand-accent/15 border-brand-accent text-brand-accent font-bold' 
                      : 'bg-brand-bg/50 border-brand-border text-brand-textSec hover:text-brand-text'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-brand-border my-4" />

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-brand-border hover:bg-brand-border/30 text-brand-textSec hover:text-brand-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-accent text-white hover:bg-brand-accent/90 transition-all shadow-md shadow-brand-accent/15"
            >
              Deploy Module
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddModuleModal;
