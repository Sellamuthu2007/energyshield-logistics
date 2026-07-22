import React, { useState } from 'react';
import type { PurchaseOrder } from '@/types/procurement';
import { ShoppingCart, Send, FileText, FileClock, Plus } from 'lucide-react';
import CreatePOModal from './CreatePOModal';

interface Props {
  orders: PurchaseOrder[];
  onApprove: (id: string) => void;
  onTrack: (id: string) => void;
  onCreatePO?: (po: Partial<PurchaseOrder>) => Promise<void>;
  isLoading?: boolean;
}

const statusStyles = {
  Pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  Approved: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
  Completed: 'bg-green-400/10 text-green-400 border-green-400/20',
  Delayed: 'bg-red-400/10 text-red-400 border-red-400/20',
  Tracked: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
};

export const PurchaseOrderTable: React.FC<Props> = ({ orders, onApprove, onTrack, onCreatePO, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6 animate-pulse">
        <div className="h-6 w-1/4 bg-brand-border/50 rounded mb-4"></div>
        <div className="h-48 w-full bg-brand-border/30 rounded"></div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg shadow-black/20 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-teal" />
            Purchase Orders
          </h3>
          {onCreatePO && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1.5 rounded bg-brand-teal px-3 py-1.5 text-xs font-bold text-brand-dark hover:bg-teal-400 transition-colors shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Purchase Order</span>
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-brand-muted">
            <thead className="text-xs uppercase bg-[#1a2130] text-brand-text/70 border-b border-brand-border/40">
              <tr>
                <th className="px-4 py-3 font-semibold">PO Number</th>
                <th className="px-4 py-3 font-semibold">Supplier</th>
                <th className="px-4 py-3 font-semibold text-right">Quantity (bbl)</th>
                <th className="px-4 py-3 font-semibold">Destination</th>
                <th className="px-4 py-3 font-semibold">Est. Delivery</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-border/10 transition-colors">
                  <td className="px-4 py-3 font-mono text-brand-text font-medium">{order.po_number}</td>
                  <td className="px-4 py-3 text-brand-text font-semibold">{order.supplier}</td>
                  <td className="px-4 py-3 text-right text-brand-text">{order.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3">{order.destination_refinery}</td>
                  <td className="px-4 py-3">{new Date(order.expected_delivery).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => onApprove(order.id)}
                        className="px-3 py-1 bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal border border-brand-teal/30 rounded text-xs font-semibold transition-colors flex items-center gap-1 mx-auto"
                      >
                        <FileText className="w-3 h-3" /> Approve
                      </button>
                    )}
                    {order.status === 'Approved' && (
                      <button
                        onClick={() => onTrack(order.id)}
                        className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded text-xs font-semibold transition-colors flex items-center gap-1 mx-auto"
                      >
                        <Send className="w-3 h-3" /> Forward to Shipping
                      </button>
                    )}
                    {['Completed', 'Delayed', 'Tracked'].includes(order.status) && (
                      <span className="text-xs text-brand-muted/50 font-semibold italic">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-brand-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileClock className="w-8 h-8 opacity-50" />
                      <span>No purchase orders active.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {onCreatePO && (
        <CreatePOModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onCreatePO}
        />
      )}
    </>
  );
};

export default PurchaseOrderTable;
