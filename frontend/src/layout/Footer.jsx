import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 border-t border-brand-border bg-brand-sec/20 text-brand-textSec text-xs flex flex-col sm:flex-row justify-between items-center gap-2 px-6">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
        </span>
        <span className="font-medium text-brand-text">Facility Status: Nominal</span>
      </div>
      <div>
        <span>Last Refreshed: Just now (Auto-updates every 10s)</span>
      </div>
      <div className="font-mono text-[10px] bg-brand-border/20 px-2 py-0.5 rounded border border-brand-border">
        v1.0.4-beta (Milestone 1)
      </div>
    </footer>
  );
};

export default Footer;
