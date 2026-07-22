import React from 'react';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import {
  useForwardedRecommendations,
  useProcurementSuppliers,
  useSupplierRankings,
  usePurchaseOrders,
  useCrudeCompatibility,
  useContracts
} from '@/hooks/useProcurementData';
import {
  acceptRecommendation,
  rejectRecommendation,
  approvePurchaseOrder,
  trackShipment,
  createPurchaseOrder
} from '@/services/procurementService';
import type { PurchaseOrder } from '@/types/procurement';
import { RefreshCw } from 'lucide-react';

// Components
import GovernmentRecommendationCard from '@/components/procurement/GovernmentRecommendationCard';
import SupplierCards from '@/components/procurement/SupplierCards';
import SupplierRankingComponent from '@/components/procurement/SupplierRanking';
import PurchaseOrderTable from '@/components/procurement/PurchaseOrderTable';
import CompatibilityPanel from '@/components/procurement/CompatibilityPanel';
import ContractTable from '@/components/procurement/ContractTable';
import ProcurementAssistant from '@/components/procurement/ProcurementAssistant';
import NotificationPanel from '@/components/procurement/NotificationPanel';
import { useProcurementStore } from '@/store/useProcurementStore';

export const ProcurementDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isSyncing, setSyncing, setGlobalError, globalError } = useProcurementStore();
  
  // Real-time hooks
  useRealtimeTable('government_recommendations', ['forwarded_recommendations']);
  useRealtimeTable('procurement_suppliers', ['procurement_suppliers']);
  useRealtimeTable('supplier_rankings', ['supplier_rankings']);
  useRealtimeTable('purchase_orders', ['purchase_orders']);
  useRealtimeTable('crude_compatibility', ['crude_compatibility']);
  useRealtimeTable('contracts', ['contracts']);
  useRealtimeTable('notifications', ['notifications']);

  // Data fetching
  const { data: recommendations, isLoading: isRecsLoading, refetch: refetchRecs } = useForwardedRecommendations();
  const { data: suppliers, isLoading: isSuppliersLoading, refetch: refetchSuppliers } = useProcurementSuppliers();
  const { data: rankings, isLoading: isRankingsLoading, refetch: refetchRankings } = useSupplierRankings();
  const { data: orders, isLoading: isOrdersLoading, refetch: refetchOrders } = usePurchaseOrders();
  const { data: compatibilities, isLoading: isCompatLoading, refetch: refetchCompat } = useCrudeCompatibility();
  const { data: contracts, isLoading: isContractsLoading, refetch: refetchContracts } = useContracts();
  const { data: notifications, isLoading: isNotifsLoading } = useNotifications('procurement');

  const handleManualRefresh = async () => {
    setSyncing(true);
    try {
      await Promise.all([
        refetchRecs(),
        refetchSuppliers(),
        refetchRankings(),
        refetchOrders(),
        refetchCompat(),
        refetchContracts()
      ]);
      setGlobalError(null);
    } catch (err) {
      setGlobalError('Failed to sync with Supabase. Retrying automatically.');
    } finally {
      setTimeout(() => setSyncing(false), 600); // Visual delay for feedback
    }
  };

  const handleAcceptRecommendation = async (id: string) => {
    await acceptRecommendation(id);
    refetchRecs();
  };

  const handleRejectRecommendation = async (id: string) => {
    await rejectRecommendation(id);
    refetchRecs();
  };

  const handleApprovePO = async (id: string) => {
    await approvePurchaseOrder(id);
    refetchOrders();
  };

  const handleTrackShipment = async (id: string) => {
    await trackShipment(id);
    refetchOrders();
  };

  const handleCreatePO = async (po: Partial<PurchaseOrder>) => {
    if (!user) return;
    await createPurchaseOrder(po, user.id);
    refetchOrders();
  };

  const isPageLoading = isRecsLoading || isSuppliersLoading || isOrdersLoading || isSyncing;

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border/40 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <span>AI Procurement Decision Center</span>
            <span className="flex items-center space-x-1 text-[9px] bg-brand-teal/10 border border-brand-teal/30 px-2 py-0.5 rounded text-brand-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
              <span>CONNECTED DESK</span>
            </span>
          </h2>
          <p className="text-xs text-brand-muted mt-0.5">
            Supplier ranking, compatibility analysis, and secure purchase order execution.
          </p>
        </div>
        
        <button
          onClick={handleManualRefresh}
          disabled={isSyncing}
          className="flex items-center justify-center space-x-1.5 rounded border border-brand-border bg-brand-card px-3 py-1.5 text-xs font-semibold text-brand-text hover:bg-[#1a2130] transition-colors self-start sm:self-center disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
        </button>
      </div>

      {globalError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded text-sm flex justify-between items-center">
          <span>{globalError}</span>
          <button onClick={handleManualRefresh} className="underline text-xs font-bold hover:text-red-300">Retry</button>
        </div>
      )}

      {isPageLoading ? (
        <div className="flex h-[60vh] items-center justify-center text-brand-muted">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-teal" />
            <p className="text-sm font-semibold">Synchronizing procurement intel...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Top priority alerts from Government */}
          <GovernmentRecommendationCard
            recommendations={recommendations || []}
            onAccept={handleAcceptRecommendation}
            onReject={handleRejectRecommendation}
            isLoading={isRecsLoading}
          />

          {/* Section 2: Supplier Core Metrics */}
          <SupplierCards
            suppliers={suppliers || []}
            isLoading={isSuppliersLoading}
          />

          {/* Section 3: AI Rankings & Assistant Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SupplierRankingComponent rankings={rankings || []} isLoading={isRankingsLoading} />
            </div>
            <div>
              <ProcurementAssistant />
            </div>
          </div>

          {/* Section 4: Compatibility and Contracts Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompatibilityPanel compatibilities={compatibilities || []} isLoading={isCompatLoading} />
            <ContractTable contracts={contracts || []} isLoading={isContractsLoading} />
          </div>

          {/* Section 5: Purchase Orders & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <PurchaseOrderTable
                orders={orders || []}
                onApprove={handleApprovePO}
                onTrack={handleTrackShipment}
                onCreatePO={handleCreatePO}
                isLoading={isOrdersLoading}
              />
            </div>
            <div className="lg:col-span-1">
              <NotificationPanel
                notifications={notifications || []}
                isLoading={isNotifsLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementDashboard;
