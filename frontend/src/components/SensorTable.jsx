import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SensorTable = ({ sensorsData }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and Sort Data
  const filteredAndSortedSensors = useMemo(() => {
    let result = [...sensorsData];

    // Search filter
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      result = result.filter(
        (sensor) =>
          sensor.id.toLowerCase().includes(query) ||
          sensor.name.toLowerCase().includes(query) ||
          sensor.location.toLowerCase().includes(query) ||
          sensor.type.toLowerCase().includes(query)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle numerical values in reading
      if (sortField === 'reading') {
        aVal = parseFloat(a.reading);
        bVal = parseFloat(b.reading);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [sensorsData, search, sortField, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedSensors.length / itemsPerPage);
  const paginatedSensors = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedSensors.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedSensors, currentPage]);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Status Chip Renderer
  const renderStatus = (status) => {
    if (status === 'Healthy') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-success/10 text-brand-success border border-brand-success/20">
          <CheckCircle2 className="w-3 h-3" />
          Healthy
        </span>
      );
    }
    if (status === 'Warning') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-warning/10 text-brand-warning border border-brand-warning/20">
          <AlertTriangle className="w-3 h-3" />
          Warning
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-danger/10 text-brand-danger border border-brand-danger/20">
        <AlertCircle className="w-3 h-3" />
        Critical
      </span>
    );
  };

  const SortHeader = ({ field, label }) => {
    const isSorted = sortField === field;
    return (
      <button 
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-brand-text transition-colors font-semibold"
      >
        <span>{label}</span>
        <ArrowUpDown className={`w-3.5 h-3.5 ${isSorted ? 'text-brand-accent' : 'text-brand-textSec/50'}`} />
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <h3 className="text-base font-semibold text-brand-text self-start sm:self-center">Telemetry Feeds</h3>
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-textSec/50" />
          <input 
            type="text"
            placeholder="Search sensors..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-brand-border bg-brand-bg/50 focus:bg-brand-bg focus:border-brand-accent text-brand-text text-sm focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Sensor Table */}
      <div className="border border-brand-border rounded-xl bg-brand-card/25 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-border/20 text-brand-textSec text-xs">
                <th className="px-5 py-3.5 font-semibold">
                  <SortHeader field="id" label="Sensor ID" />
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  <SortHeader field="name" label="Sensor Name" />
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  <SortHeader field="location" label="Location" />
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  <SortHeader field="reading" label="Current Reading" />
                </th>
                <th className="px-5 py-3.5 font-semibold">
                  <SortHeader field="status" label="Status" />
                </th>
                <th className="px-5 py-3.5 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-text text-xs">
              {paginatedSensors.length > 0 ? (
                paginatedSensors.map((sensor) => (
                  <tr 
                    key={sensor.id} 
                    className="hover:bg-brand-border/10 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-brand-accent">{sensor.id}</td>
                    <td className="px-5 py-3.5 font-medium">{sensor.name}</td>
                    <td className="px-5 py-3.5 text-brand-textSec">{sensor.location}</td>
                    <td className="px-5 py-3.5 font-bold font-mono">
                      {sensor.reading.toFixed(1)} <span className="text-[10px] text-brand-textSec font-normal">{sensor.unit}</span>
                    </td>
                    <td className="px-5 py-3.5">{renderStatus(sensor.status)}</td>
                    <td className="px-5 py-3.5 text-brand-textSec">{sensor.updatedTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-brand-textSec bg-brand-bg/10">
                    No active sensors match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-5 py-3 bg-brand-border/10 border-t border-brand-border">
            <span className="text-[11px] text-brand-textSec">
              Showing page <strong className="text-brand-text">{currentPage}</strong> of <strong className="text-brand-text">{totalPages}</strong> ({filteredAndSortedSensors.length} sensors)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-1 rounded border border-brand-border bg-brand-bg/50 hover:bg-brand-border/30 text-brand-textSec hover:text-brand-text disabled:opacity-40 disabled:hover:bg-brand-bg/50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded border border-brand-border bg-brand-bg/50 hover:bg-brand-border/30 text-brand-textSec hover:text-brand-text disabled:opacity-40 disabled:hover:bg-brand-bg/50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorTable;
