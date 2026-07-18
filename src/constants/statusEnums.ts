export const GOVERNMENT_RECOMMENDATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FORWARDED: 'forwarded',
} as const;

export const PURCHASE_ORDER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  DELAYED: 'delayed',
} as const;

export const SHIPMENT_STATUS = {
  PREPARING: 'preparing',
  DEPARTED: 'departed',
  IN_TRANSIT: 'in_transit',
  DELAYED: 'delayed',
  ARRIVED: 'arrived',
} as const;

export const ROUTE_RECOMMENDATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  IGNORED: 'ignored',
} as const;

export const INCOMING_SHIPMENT_STATUS = {
  PENDING: 'pending',
  DELIVERED: 'delivered',
  DELAYED: 'delayed',
} as const;

export const STRATEGIC_RECOMMENDATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  ARCHIVED: 'archived',
} as const;
