import React from 'react';
import type { Contract } from '@/types/procurement';
import { FileSignature, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Props {
  contracts: Contract[];
  isLoading?: boolean;
}

const renewalStyles = {
  active: 'bg-green-400/10 text-green-400 border-green-400/20',
  expiring_soon: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  expired: 'bg-red-400/10 text-red-400 border-red-400/20',
};

export const ContractTable: React.FC<Props> = ({ contracts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6 animate-pulse">
        <div className="h-6 w-1/4 bg-brand-border/50 rounded mb-4"></div>
        <div className="h-32 w-full bg-brand-border/30 rounded"></div>
      </div>
    );
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg shadow-black/20 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-brand-teal" />
          Contract Management
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-brand-muted">
          <thead className="text-xs uppercase bg-[#1a2130] text-brand-text/70 border-b border-brand-border/40">
            <tr>
              <th className="px-4 py-3 font-semibold">Supplier</th>
              <th className="px-4 py-3 font-semibold">Valid Until</th>
              <th className="px-4 py-3 font-semibold text-right">Remaining</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold w-1/3">AI Suggestion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/30">
            {contracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-brand-border/10 transition-colors">
                <td className="px-4 py-3 text-brand-text font-semibold">{contract.supplier_name}</td>
                <td className="px-4 py-3">{new Date(contract.contract_end).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-mono font-bold ${contract.remaining_days < 30 ? 'text-yellow-400' : 'text-brand-text'}`}>
                    {contract.remaining_days} days
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${renewalStyles[contract.renewal_status]}`}>
                    {contract.renewal_status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs leading-relaxed text-brand-muted italic">
                  {contract.ai_suggestion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractTable;
