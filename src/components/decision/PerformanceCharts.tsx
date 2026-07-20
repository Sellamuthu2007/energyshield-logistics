import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const deliveryData = [
  { month: 'Jan', onTime: 82, delayed: 18 },
  { month: 'Feb', onTime: 78, delayed: 22 },
  { month: 'Mar', onTime: 85, delayed: 15 },
  { month: 'Apr', onTime: 74, delayed: 26 },
  { month: 'May', onTime: 81, delayed: 19 },
  { month: 'Jun', onTime: 79, delayed: 21 },
];

const utilizationData = [
  { month: 'Jan', utilization: 72 },
  { month: 'Feb', utilization: 75 },
  { month: 'Mar', utilization: 78 },
  { month: 'Apr', utilization: 74 },
  { month: 'May', utilization: 76 },
  { month: 'Jun', utilization: 80 },
];

export const PerformanceCharts: React.FC = () => {
  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-brand-teal" />
        Performance Analytics
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">Delivery Performance (Last 6 Months)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a2130', border: '1px solid #2a3a5c', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="onTime" name="On Time %" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" name="Delayed %" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-4">Refinery Utilization Trend</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis domain={[60, 90]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a2130', border: '1px solid #2a3a5c', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
