import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, FileSpreadsheet, FileBarChart, Loader2 } from 'lucide-react';

const REPORTS = [
  { id: 'r1', name: 'Monthly Supply Chain Health Report', type: 'PDF', date: '2026-07-15', size: '2.4 MB', icon: FileText },
  { id: 'r2', name: 'Q3 2026 Economic Impact Analysis', type: 'PDF', date: '2026-07-10', size: '1.8 MB', icon: FileBarChart },
  { id: 'r3', name: 'Refinery Utilization Summary - June', type: 'XLSX', date: '2026-07-05', size: '856 KB', icon: FileSpreadsheet },
  { id: 'r4', name: 'Strategic Petroleum Reserve Status', type: 'PDF', date: '2026-07-01', size: '1.2 MB', icon: FileText },
  { id: 'r5', name: 'Procurement Supplier Performance', type: 'XLSX', date: '2026-06-28', size: '3.1 MB', icon: FileSpreadsheet },
  { id: 'r6', name: 'Scenario Simulation - Gulf Crisis', type: 'PDF', date: '2026-06-25', size: '980 KB', icon: FileBarChart },
];

export const ReportsCenter: React.FC = () => {
  const [exportingId, setExportingId] = useState<string | null>(null);

  const handleExport = async (reportId: string) => {
    setExportingId(reportId);
    await new Promise(r => setTimeout(r, 1500));
    setExportingId(null);
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-brand-teal" />
        Reports Center
      </h3>

      <div className="space-y-2">
        {REPORTS.map((report, idx) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center justify-between p-3 bg-[#1a2130] border border-brand-border/50 rounded hover:border-brand-border transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-5 h-5 text-brand-teal shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{report.name}</div>
                  <div className="text-[10px] text-brand-muted">{report.type} · {report.date} · {report.size}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleExport(report.id)}
                  disabled={exportingId === report.id}
                  className="p-1.5 text-brand-muted hover:text-white hover:bg-brand-card rounded transition-colors"
                  title="Preview"
                >
                  {exportingId === report.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleExport(report.id)}
                  disabled={exportingId === report.id}
                  className="p-1.5 text-brand-muted hover:text-white hover:bg-brand-card rounded transition-colors"
                  title={exportingId === report.id ? 'Exporting...' : 'Export PDF'}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsCenter;
