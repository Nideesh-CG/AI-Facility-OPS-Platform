import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar } from 'lucide-react';

const AddScheduleModal = ({ isOpen, onClose, onAdd }) => {
  const [date, setDate] = useState('20 May');
  const [activity, setActivity] = useState('HVAC Filter Cleaning');
  const [time, setTime] = useState('09:30 AM');
  const [status, setStatus] = useState('Upcoming');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      date,
      activity,
      time,
      status
    });
    setActivity('');
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
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text tracking-tight m-0">Add Maintenance Schedule</h3>
            <p className="text-[11px] text-brand-textSec mt-0.5">Schedule a recurring or one-time facility task.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Activity Description</label>
            <input 
              type="text" 
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
              placeholder="e.g. AC Maintenance, Fire Drill"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Date</label>
              <input 
                type="text" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
                placeholder="e.g. 18 May"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Time</label>
              <input 
                type="text" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
                placeholder="e.g. 10:00 AM"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-textSec uppercase tracking-wider block mb-1.5">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg text-brand-text text-xs focus:outline-none focus:border-brand-accent"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
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
              Save Schedule
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddScheduleModal;
