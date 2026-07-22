import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ClipboardList } from 'lucide-react';

const AddWorkOrderModal = ({ isOpen, onClose, onAdd }) => {
  const [asset, setAsset] = useState('AC unit');
  const [priority, setPriority] = useState('High');
  const [status, setStatus] = useState('In Progress');
  const [assignedTo, setAssignedTo] = useState('John Doe');
  const [dueDate, setDueDate] = useState('18 May');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      asset,
      priority,
      status,
      assignedTo,
      dueDate,
      description: description || 'Routine maintenance ticket dispatch'
    });
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-card p-6 shadow-2xl z-10 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-brand-border bg-brand-bg/50 hover:bg-brand-border/80 text-brand-textSec hover:text-brand-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent shadow-inner">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text tracking-tight m-0">Create Maintenance Work Order</h3>
            <p className="text-[11px] text-brand-textSec mt-0.5">Dispatch ticket to maintenance technicians.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Asset Target</label>
            <input 
              type="text" 
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
              placeholder="e.g. Chiller B plant, Lift-1, Camera-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
              >
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Assigned Technician</label>
              <input 
                type="text" 
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Due Date</label>
              <input 
                type="text" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
                placeholder="e.g. 20 May"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Work Order Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
              placeholder="Detail required maintenance action..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-brand-border bg-brand-bg text-xs font-bold text-brand-textSec hover:text-brand-text hover:bg-brand-border/40 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-brand-accent/90 transition-all shadow-md shadow-brand-accent/20"
            >
              Dispatch Ticket
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddWorkOrderModal;
